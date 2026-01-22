import React, {useState} from "react";
import {Card, Button, Table, Input, Select, Checkbox, message, Typography} from "antd";
import type {ColumnsType} from "antd/es/table";

const {Option} = Select;
const {Link} = Typography;

interface ScannedFile {
    uid: string;
    path: string;      // 原始相对路径
    name: string;      // 不含扩展名
    ext: string;       // 扩展名
    upload: boolean;
    category?: string;
    tags?: string[];
    file?: File;       // 原始文件对象
}

interface Props {
    value: ScannedFile[];
    onChange: (files: ScannedFile[]) => void;
}

const categoryOptions = ["合同", "资料", "报表", "其他"];
const tagOptions = ["重要", "待确认", "草稿", "归档"];

/** ✅ 模拟项目数据（后期你可以换成接口） */
const mockProjects = [
    {id: "XM202428468", name: "中缅管道45#阀室—昌明—贵定—福泉支线管道工程（昌明—福泉段）项目决算审计"},
    {id: "XM202427822", name: "中煤陕西能源化工集团有限公司 2024~2026 年零星外委作业结算复审"},
    {id: "XM202427788", name: "精细化工及原料工程项目标段3工程造价咨询服务"},
];

const Step1Receive: React.FC<Props> = ({value, onChange}) => {
    const [loadingStep, setLoadingStep] = useState<string | null>(null);
    const [fileList, setFileList] = useState<ScannedFile[]>(value);

    /** ✅ 新增：选择的项目 */
    const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>();

    // --- 扫描目录 ---
    const handleScan = () => {
        const input = document.createElement("input");
        input.type = "file";
        // @ts-ignore
        input.webkitdirectory = true;
        input.multiple = true;

        input.onchange = (e: any) => {
            const files: FileList = e.target.files;
            if (!files) return;

            const scanned: ScannedFile[] = Array.from(files).map((file, idx) => {
                const fullName = file.name;
                const dotIndex = fullName.lastIndexOf(".");

                const baseName = dotIndex > -1 ? fullName.slice(0, dotIndex) : fullName;
                const ext = dotIndex > -1 ? fullName.slice(dotIndex + 1) : "";

                return {
                    uid: String(idx),
                    path: file.webkitRelativePath || file.name,
                    name: baseName,
                    ext: ext,
                    upload: true,
                    file,
                };
            });

            setFileList(scanned);
            onChange(scanned);
            message.success(`扫描完成，共 ${scanned.length} 个文件`);
        };

        input.click();
    };

    // --- AI识别 ---
    const handleAI = async () => {
        if (fileList.length === 0) {
            message.warning("请先扫描文件");
            return;
        }
        setLoadingStep("AI识别分类");

        setTimeout(() => {
            const aiResult = fileList.map((f) => ({
                ...f,
                category: "合同",
                tags: ["重要", "待确认"],
            }));
            setFileList(aiResult);
            onChange(aiResult);
            setLoadingStep(null);
            message.success("AI识别完成！");
        }, 800);
    };

    // --- 上传 ---
    const handleUpload = async () => {
        if (!selectedProjectId) {
            message.warning("请先选择要关联的造价项目");
            return;
        }

        const toUpload = fileList.filter((f) => f.upload);
        if (toUpload.length === 0) {
            message.warning("没有需要上传的文件");
            return;
        }

        setLoadingStep("上传入库");

        const formData = new FormData();

        toUpload.forEach((f) => {
            if (f.file) {
                formData.append("files", f.file, `${f.name}.${f.ext}`);
            }
        });

        const meta = toUpload.map((f) => ({
            uid: f.uid,
            name: f.name,
            ext: f.ext,
            originPath: f.path,
            category: f.category,
            tags: f.tags,
        }));

        /** ✅ 把项目ID一起传给后端 */
        formData.append("meta", JSON.stringify(meta));
        formData.append("projectId", selectedProjectId);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("projectId:", selectedProjectId);
            console.log("上传 meta:", meta);
            message.success(`${toUpload.length} 个文件上传完成！`);
        } catch {
            message.error("上传失败");
        } finally {
            setLoadingStep(null);
        }
    };

    // --- 更新文件信息 ---
    const updateFile = (uid: string, key: keyof ScannedFile, value: any) => {
        const newList = fileList.map((f) =>
            f.uid === uid ? {...f, [key]: value, file: f.file} : f
        );
        setFileList(newList);
        onChange(newList);
    };

    // --- 文件预览 / 下载 ---
    const handlePreview = (file: File) => {
        if (!file) return;
        const ext = file.name.split(".").pop()?.toLowerCase();

        const previewable = ["pdf", "png", "jpg", "jpeg", "gif", "txt"];
        const url = URL.createObjectURL(file);

        if (previewable.includes(ext || "")) {
            window.open(url, "_blank");
        } else {
            const a = document.createElement("a");
            a.href = url;
            a.download = file.name;
            a.click();
        }

        setTimeout(() => URL.revokeObjectURL(url), 5000);
    };

    const columns: ColumnsType<ScannedFile> = [
        {
            title: "上传",
            dataIndex: "upload",
            width: 60,
            render: (val, record) => (
                <Checkbox
                    checked={val}
                    onChange={(e) => updateFile(record.uid, "upload", e.target.checked)}
                />
            ),
        },
        {
            title: "文件名称",
            dataIndex: "name",
            width: 360,
            render: (text, record) => (
                <Input.TextArea
                    value={text}
                    autoSize={{minRows: 1, maxRows: 3}}
                    onChange={(e) => updateFile(record.uid, "name", e.target.value)}
                />
            ),
        },
        {
            title: "文件路径",
            dataIndex: "path",
            render: (text, record) => (
                <Link onClick={() => record.file && handlePreview(record.file)}>
                    {text}
                </Link>
            ),
        },
        {
            title: "扩展名",
            dataIndex: "ext",
            width: 80,
            align: "center",
        },
        {
            title: "文件分类",
            dataIndex: "category",
            width: 120,
            render: (val, record) => (
                <Select
                    value={val}
                    style={{width: "100%"}}
                    onChange={(v) => updateFile(record.uid, "category", v)}
                >
                    {categoryOptions.map((c) => (
                        <Option key={c} value={c}>{c}</Option>
                    ))}
                </Select>
            ),
        },
        {
            title: "文件标签",
            dataIndex: "tags",
            width: 150,
            render: (tags: string[], record) => (
                <Select
                    mode="multiple"
                    value={tags}
                    style={{width: "100%"}}
                    onChange={(v) => updateFile(record.uid, "tags", v)}
                >
                    {tagOptions.map((t) => (
                        <Option key={t} value={t}>{t}</Option>
                    ))}
                </Select>
            ),
        },
    ];

    return (
        <Card>
            {/* ================= 顶部工具栏 ================= */}
            <div style={{marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap"}}>

                <span style={{fontWeight: 600, marginTop:4}}>选择造价咨询合同：</span>

                <Select
                    showSearch
                    placeholder="输入项目名称搜索"
                    style={{width: 360}}
                    value={selectedProjectId}
                    onChange={(v) => setSelectedProjectId(v)}
                    filterOption={(input, option) =>
                        String(option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                    }
                >
                    {mockProjects.map((p) => (
                        <Option key={p.id} value={p.id} label={p.name}>
                            {p.name}
                        </Option>
                    ))}
                </Select>


                <Button type="primary" onClick={handleScan}>
                    扫描目录
                </Button>

                <Button
                    type="primary"
                    onClick={handleAI}
                    disabled={fileList.length === 0}
                    loading={loadingStep === "AI识别分类"}
                >
                    AI识别 & 分类
                </Button>

                <Button
                    type="primary"
                    onClick={handleUpload}
                    disabled={!fileList.some((f) => f.upload)}
                    loading={loadingStep === "上传入库"}
                >
                    上传入库
                </Button>
            </div>

            <Table<ScannedFile>
                dataSource={fileList}
                columns={columns}
                rowKey="uid"
                scroll={{x: 900}}
            />
        </Card>
    );
};

export default Step1Receive;
