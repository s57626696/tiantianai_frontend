import React, {useEffect, useState} from "react";
import {
    Card,
    Table,
    Form,
    Input,
    Button,
    Select,
    Space,
    Tag,
    Tooltip,
} from "antd";
import type {ColumnsType} from "antd/es/table";
import {EnterOutlined, EditOutlined, InboxOutlined} from "@ant-design/icons";

const {Option} = Select;

// 数据结构
interface SettlementProject {
    id: number;
    constructionUnit: string;
    contractor: string;
    contractName: string;
    sendAmount: number;
    auditAmount: number;
    diffAmount: number; // 审减金额
    diffRate: number;   // 审减率 0.1234 = 12.34%
    projectStatus: "准备阶段" | "审查" | "审定" | "已归档";
    leader: string;
    createdAt: string;
}

const B223: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<SettlementProject[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setTimeout(() => {
            setData([
                {
                    id: 1,
                    constructionUnit: "XX化工集团",
                    contractor: "XX安装公司",
                    contractName: "动力站施工合同",
                    sendAmount: 12000000,
                    auditAmount: 9800000,
                    diffAmount: 2200000,
                    diffRate: 0.1833,
                    projectStatus: "审查",
                    leader: "张三",
                    createdAt: "2026-01-10",
                },
                {
                    id: 2,
                    constructionUnit: "XX水务集团",
                    contractor: "YY安装公司",
                    contractName: "泵站改造施工合同",
                    sendAmount: 8000000,
                    auditAmount: 7900000,
                    diffAmount: 100000,
                    diffRate: 0.0127,
                    projectStatus: "准备阶段",
                    leader: "李四",
                    createdAt: "2026-01-09",
                },
            ]);
            setLoading(false);
        }, 500);
    };

    const onSearch = () => {
        const values = form.getFieldsValue();
        console.log("查询条件：", values);
        // TODO: 后端接口筛选
        loadData();
    };

    const onReset = () => {
        form.resetFields();
        loadData();
    };

    // 表格列
    const columns: ColumnsType<SettlementProject> = [
        {
            title: "合同名称",
            dataIndex: "contractName",
            align: "center",
            width: 240,
            render: (v) => (
                <div style={{textAlign: "left"}}>{v.toLocaleString()}</div> // 单元格右对齐
            ),
        },
        {
            title: "建设单位",
            dataIndex: "constructionUnit",
            align: "center",
            width: 180,
            render: (v) => (
                <div style={{textAlign: "left"}}>{v.toLocaleString()}</div> // 单元格右对齐
            ),
        },
        {
            title: "施工单位",
            dataIndex: "contractor",
            align: "center",
            width: 180,
            render: (v) => (
                <div style={{textAlign: "left"}}>{v.toLocaleString()}</div> // 单元格右对齐
            ),
        },
        {
            title: "送审金额（元）",
            dataIndex: "sendAmount",
            align: "center",
            width: 140,
            render: (v) => (
                <div style={{textAlign: "right"}}>{v.toLocaleString()}</div> // 单元格右对齐
            ),
        },
        {
            title: "审定金额（元）",
            dataIndex: "auditAmount",
            align: "center",
            width: 140,
            render: (v) => (
                <div style={{textAlign: "right"}}>{v.toLocaleString()}</div> // 单元格右对齐
            ),
        },
        {
            title: "审减金额（元）",
            dataIndex: "diffAmount",
            align: "center",
            width: 140,
            render: (v) => (
                <div style={{textAlign: "right"}}>{v.toLocaleString()}</div> // 单元格右对齐
            ),
        },
        {
            title: "审减率",
            dataIndex: "diffRate",
            align: "center",
            width: 100,
            render: (v) => (
                <div style={{textAlign: "right"}}>{`${(v * 100).toFixed(2)}%`}</div> // 单元格右对齐
            ),
        },
        {
            title: "项目状态",
            dataIndex: "projectStatus",
            width: 140,
            align: "center",
            render: (v) => {
                switch (v) {
                    case "准备阶段":
                        return <Tag color="default" style={{textAlign:"center"}}>准备阶段</Tag>;
                    case "审查":
                        return <Tag color="blue" style={{textAlign:"center"}}>审查</Tag>;
                    case "审定":
                        return <Tag color="green" style={{textAlign:"center"}}>审定</Tag>;
                    case "已归档":
                        return <Tag style={{textAlign:"center"}}>已归档</Tag>;
                    default:
                        return <Tag>{v}</Tag>;
                }
            },
        },
        {
            title: "主审",
            dataIndex: "leader",
            align: "center",
            width: 100,
            render: (v) => (
                <div style={{textAlign: "center"}}>{v.toLocaleString()}</div> // 单元格右对齐
            ),
        },
        {
            title: "操作",
            fixed: "right",
            width: 140,
            align: "center",
            render: (_, record) => (
                <Space>
                    <Tooltip title="进入合同">
                        <Button
                            type="text"
                            icon={<EnterOutlined/>}
                            onClick={() => console.log("进入合同", record.id)}
                        />
                    </Tooltip>

                    <Tooltip title="编辑合同">
                        <Button
                            type="text"
                            icon={<EditOutlined/>}
                            onClick={() => console.log("编辑合同", record.id)}
                        />
                    </Tooltip>

                    <Tooltip title="归档合同">
                        <Button
                            type="text"
                            icon={<InboxOutlined/>}
                            onClick={() => console.log("归档合同", record.id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Card>
                {/* 查询区 */}
                <Form form={form} layout="inline" style={{marginBottom: 16}}>
                    <Form.Item name="contractName" label="合同名称">
                        <Input placeholder="请输入合同名称" allowClear/>
                    </Form.Item>

                    <Form.Item name="constructionUnit" label="建设单位">
                        <Input placeholder="请输入建设单位" allowClear/>
                    </Form.Item>

                    <Form.Item name="contractor" label="施工单位">
                        <Input placeholder="请输入施工单位" allowClear/>
                    </Form.Item>

                    <Form.Item name="projectStatus" label="项目状态">
                        <Select placeholder="请选择" allowClear style={{width: 120}}>
                            <Option value="准备阶段">准备阶段</Option>
                            <Option value="审查">审查</Option>
                            <Option value="审定">审定</Option>
                            <Option value="已归档">已归档</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" onClick={onSearch}>
                                查询
                            </Button>
                            <Button onClick={onReset}>重置</Button>
                        </Space>
                    </Form.Item>
                </Form>

                {/* 工具栏 */}
                <div style={{marginBottom: 16}}>
                    <Space>
                        <Button type="primary">新建</Button>
                        <Button>导出</Button>
                        <Button>导入</Button>
                    </Space>
                </div>

                {/* 表格 */}
                <Table
                    rowKey="id"
                    loading={loading}
                    columns={columns}
                    dataSource={data}
                    scroll={{x: 1500}}
                    pagination={{pageSize: 10}}
                />
            </Card>
        </div>
    );
};

export default B223;
