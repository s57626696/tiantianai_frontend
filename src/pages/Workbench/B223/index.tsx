import React, {useState, useEffect} from "react";
import {Card, Table, Button, Space, Tag, Tooltip, Dropdown, Checkbox} from "antd";
import type {ColumnType} from "antd/es/table";
import {EnterOutlined, EditOutlined, InboxOutlined, SettingOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

interface SettlementProject {
    id: number;
    constructionUnit: string;
    contractor: string;
    contractName: string;
    sendAmount: number;
    auditAmount: number;
    diffAmount: number;
    diffRate: number;
    projectStatus: "准备" | "审查" | "审定" | "归档";
    leader: string;
    createdAt: string;
}

const B223: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<SettlementProject[]>([]);

    // 默认显示列
    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        "contractName",
        "constructionUnit",
        "contractor",
        "sendAmount",
        "projectStatus",
    ]);

    // 全部列定义
    const allColumns: ColumnType<SettlementProject>[] = [
        {title: "合同名称", dataIndex: "contractName", width: 240, align: "left"},
        {title: "建设单位", dataIndex: "constructionUnit", width: 180, align: "left"},
        {title: "施工单位", dataIndex: "contractor", width: 180, align: "left"},
        {
            title: "送审金额（元）",
            dataIndex: "sendAmount",
            width: 140,
            align: "right",
            render: (v: number) => v.toLocaleString(),
        },
        {
            title: "审定金额（元）",
            dataIndex: "auditAmount",
            width: 140,
            align: "right",
            render: (v: number) => v.toLocaleString(),
        },
        {
            title: "审减金额（元）",
            dataIndex: "diffAmount",
            width: 140,
            align: "right",
            render: (v: number) => v.toLocaleString(),
        },
        {
            title: "审减率",
            dataIndex: "diffRate",
            width: 100,
            align: "right",
            render: (v: number) => `${(v * 100).toFixed(2)}%`,
        },
        {
            title: "项目状态",
            dataIndex: "projectStatus",
            width: 140,
            align: "center",
            render: (v: SettlementProject["projectStatus"]) => {
                switch (v) {
                    case "准备":
                        return <Tag color="default">准备</Tag>;
                    case "审查":
                        return <Tag color="blue">审查</Tag>;
                    case "审定":
                        return <Tag color="green">审定</Tag>;
                    case "归档":
                        return <Tag>归档</Tag>;
                }
            },
        },
        {title: "主审", dataIndex: "leader", width: 100, align: "center"},
        {
            title: "操作",
            fixed: "right",
            width: 140,
            align: "center",
            render: (_: any, record: SettlementProject) => (
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

    useEffect(() => {
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
                    projectStatus: "准备",
                    leader: "李四",
                    createdAt: "2026-01-09",
                },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    // 过滤出当前显示的列
    const displayedColumns = allColumns.filter(
        (col) =>
            col.dataIndex === undefined ||
            visibleColumns.includes(col.dataIndex.toString()) ||
            col.title === "操作"
    );


    // 列显示菜单 items
    const columnMenuItems = allColumns
        .filter((col) => col.dataIndex && col.title !== "操作")
        .map((col) => ({
            key: col.dataIndex!.toString(),
            label: (
                <Checkbox
                    checked={visibleColumns.includes(col.dataIndex!.toString())}
                    onChange={(e) => {
                        const checked = e.target.checked;
                        setVisibleColumns((prev) =>
                            checked
                                ? [...prev, col.dataIndex!.toString()]
                                : prev.filter((c) => c !== col.dataIndex!.toString())
                        );
                    }}
                >
                    {typeof col.title === "function" ? col.title({}) : col.title}
                </Checkbox>
            ),
        }));

    return (
        <Card>
            <Space style={{marginBottom: 16}}>
                <Button type="primary" onClick={() => navigate("/workbench/b223/create")}>
                    新建
                </Button>
                <Dropdown menu={{items: columnMenuItems}} placement="bottomLeft">
                    <Button icon={<SettingOutlined/>}>列显示</Button>
                </Dropdown>
                <Button>导出</Button>
                <Button>导入</Button>
            </Space>

            <Table
                rowKey="id"
                loading={loading}
                columns={displayedColumns}
                dataSource={data}
                scroll={{x: 1500}}
                pagination={{pageSize: 10}}
            />
        </Card>
    );
};

export default B223;
