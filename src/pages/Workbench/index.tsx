import React, { useEffect, useState } from "react";
import { Collapse, Row, Col, Button, Spin } from "antd";

interface BusinessItem {
    code: string;
    name: string;
    is_common: number;
}

interface BusinessCategory {
    category_no: number;
    category_name: string;
    children: BusinessItem[];
}

interface Props {
    onBusinessClick: (item: BusinessItem) => void;
}

const WorkbenchHome: React.FC<Props> = ({ onBusinessClick }) => {
    const [businessData, setBusinessData] = useState<BusinessCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const res = await fetch("http://127.0.0.1:8000/services/tree");
                const data: BusinessCategory[] = await res.json();
                setBusinessData(data);
            } catch (err) {
                console.error("获取服务失败：", err);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    if (loading) {
        return <Spin tip="正在加载服务..." style={{ marginTop: 100, display: "block" }} />;
    }

    // 将 businessData 转换为 Collapse 所需的 items
    const collapseItems = businessData.map((category) => ({
        key: category.category_no.toString(),
        label: category.category_name.replace("类", ""),
        children: (
            <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
                {category.children.map((item) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={item.code}>
                        <Button
                            type={item.is_common === 1 ? "primary" : "default"}
                            style={{
                                width: "100%",
                                textAlign: "left",
                                borderRadius: 8,
                                fontWeight: item.is_common === 1 ? 600 : 500,
                            }}
                            onClick={() => onBusinessClick(item)}
                        >
                            {item.name}
                        </Button>
                    </Col>
                ))}
            </Row>
        ),
        style: { background: "#fff", borderRadius: 8, marginBottom: 16 },
    }));

    return (
        <div>
            {/* 欢迎语 */}
            <div
                style={{
                    fontSize: 18,
                    fontWeight: 600,
                    marginBottom: 24,
                }}
            >
                欢迎使用中联筑云造价作业工作台
            </div>

            {/* 折叠面板 */}
            <Collapse
                accordion
                bordered={false}
                style={{ background: "transparent" }}
                items={collapseItems}
            />
        </div>
    );
};

export default WorkbenchHome;
