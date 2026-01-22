import React, {useEffect, useState} from "react";
import {Form, Input, Select, Space, Tooltip, Button, message, Card, Typography, Upload} from "antd";
import {FilePdfOutlined, FileTextOutlined, UploadOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

const {Title} = Typography;
const {Option} = Select;

interface ContractItem {
    id: number;
    contract_no: string;
    contract_name: string;
    contract_status: string;
    client?: string;
    pdf_url?: string;
    markdown_url?: string;
}

const B223Create: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [contracts, setContracts] = useState<ContractItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedContract, setSelectedContract] = useState<ContractItem | null>(null);

    /** 🔹 加载合同列表 */
    const fetchContracts = async (keyword?: string) => {
        setLoading(true);
        try {
            const params = keyword ? `?keyword=${encodeURIComponent(keyword)}` : "";
            const res = await fetch(`http://127.0.0.1:8000/contracts/${params}`);
            const data = await res.json();
            setContracts(data);
        } catch (e) {
            message.error("获取合同列表失败");
        } finally {
            setLoading(false);
        }
    };

    /** 🔹 提交 */
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const formData = new FormData();
            formData.append("project_name", values.projectName);
            formData.append("audit_type", values.auditType);
            formData.append("contract_id", values.relatedContractId);

            if (values.entrustFile && values.entrustFile.length > 0) {
                formData.append("entrust_file", values.entrustFile[0].originFileObj);
            }

            const res = await fetch("http://127.0.0.1:8000/settlement-projects/", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("创建失败");

            message.success("项目创建成功");
            navigate("/workbench/b223");

        } catch (e) {
            message.error("创建失败");
        }
    };


    /** 首次加载 */
    useEffect(() => {
        fetchContracts();
    }, []);

    /** 选择合同 */
    const handleContractChange = (contractId: number) => {
        const contract = contracts.find(c => c.id === contractId) || null;
        setSelectedContract(contract);

        if (contract) {
            form.setFieldsValue({
                relatedContractId: contract.id,
                projectName: contract.contract_name,
            });
        }
    };

    /** 🔹 预览 */
    const handlePreview = async (type: "pdf" | "markdown") => {
        if (!selectedContract) return;

        if (type === "pdf") {
            if (!selectedContract.pdf_url) {
                message.warning("该合同没有 PDF 文件");
                return;
            }
            const newWin = window.open("", "_blank");
            if (newWin) {
                newWin.document.write(`
                <html>
                    <head>
                        <title>${selectedContract.contract_name} - PDF预览</title>
                    </head>
                    <body style="margin:0">
                        <embed src="${selectedContract.pdf_url}" type="application/pdf" width="100%" height="100%"/>
                    </body>
                </html>
            `);
                newWin.document.close();
            }
        } else {
            if (!selectedContract.markdown_url) {
                message.warning("该合同没有 Markdown 文件");
                return;
            }

            try {
                const res = await fetch(selectedContract.markdown_url);
                const text = await res.text();

                const newWin = window.open("", "_blank");
                if (newWin) {
                    newWin.document.write(`
                    <html>
                        <head>
                            <meta charset="UTF-8" />
                            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vditor/dist/index.css" />
                            <script src="https://cdn.jsdelivr.net/npm/vditor/dist/index.min.js"></script>
                            <title>${selectedContract.contract_name} - Markdown预览</title>
                            <style>
                                html, body { margin:0; height:100%; }
                                #vditor { height:100%; }
                            </style>
                        </head>
                        <body>
                            <div id="vditor"></div>
                            <script>
                                function initVditor() {
                                    new Vditor('vditor', {
                                        value: ${JSON.stringify(text)},
                                        mode: 'ir',
                                        preview: {only: true},
                                        height: window.innerHeight
                                    });
                                }
                                if (window.Vditor) {
                                    initVditor();
                                } else {
                                    window.addEventListener('load', initVditor);
                                }
                            </script>
                        </body>
                    </html>
                `);
                    newWin.document.close();
                }
            } catch (e) {
                message.error("加载 Markdown 文件失败");
            }
        }
    };

    return (
        <Card>
            <Title level={3}>新建结算审核项目</Title>

            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    relatedContractId: undefined,
                    projectName: "",
                    auditType: "竣工结算审核",
                    entrustFileUrl: "",
                }}
            >
                {/* 1. 关联造价咨询合同 */}
                <Form.Item
                    label="关联造价咨询合同"
                    name="relatedContractId"
                    rules={[{required: true, message: "请选择一个关联合同"}]}
                >
                    <Select
                        placeholder="搜索合同名称 / 编号"
                        showSearch
                        allowClear
                        filterOption={false}
                        onSearch={fetchContracts}
                        onChange={handleContractChange}
                        loading={loading}
                    >
                        {contracts.map(c => (
                            <Option key={c.id} value={c.id}>
                                {c.contract_name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* 合同预览 */}
                {selectedContract && (
                    <Form.Item label="合同预览">
                        <Space>
                            {selectedContract.pdf_url && (
                                <Tooltip title="PDF预览">
                                    <Button
                                        icon={<FilePdfOutlined/>}
                                        onClick={() => handlePreview("pdf")}
                                    />
                                </Tooltip>
                            )}

                            {selectedContract.markdown_url && (
                                <Tooltip title="Markdown预览">
                                    <Button
                                        icon={<FileTextOutlined/>}
                                        onClick={() => handlePreview("markdown")}
                                    />
                                </Tooltip>
                            )}

                            {!selectedContract.pdf_url && !selectedContract.markdown_url && (
                                <span style={{color: "#888"}}>暂无可预览文件</span>
                            )}
                        </Space>
                    </Form.Item>
                )}

                {/* 2. 工程名称 */}
                <Form.Item label="工程名称" name="projectName">
                    <Input placeholder="可暂不填写，后续从送审资料中自动识别"/>
                </Form.Item>

                {/* 3. 审核委托书 */}
                <Form.Item label="审核委托书" name="entrustFile">
                    <Upload
                        beforeUpload={() => false}   // 阻止自动上传
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined/>}>选择文件</Button>
                    </Upload>
                </Form.Item>


                {/* 4. 审核类型 */}
                <Form.Item label="审核类型" name="auditType">
                    <Select disabled>
                        <Option value="竣工结算审核">竣工结算审核</Option>
                    </Select>
                </Form.Item>

                {/* 5. 项目组成员（预留） */}
                <Form.Item label="项目组成员（预留）">
                    <Input.TextArea
                        disabled
                        rows={3}
                        placeholder="此处后续对接人员系统，当前版本不支持配置"
                    />
                </Form.Item>

                {/* 6. 操作按钮 */}
                <Form.Item>
                    <Space>
                        <Button type="primary" onClick={handleSubmit}>
                            提交
                        </Button>
                        <Button onClick={() => navigate("/workbench/b223")}>
                            取消
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default B223Create;
