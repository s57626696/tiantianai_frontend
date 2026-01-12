import React from "react";
import {Collapse, Row, Col, Button} from "antd";

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
    businessData: BusinessCategory[];
    onBusinessClick: (item: BusinessItem) => void;
}

const WorkbenchHome: React.FC<Props> = ({businessData, onBusinessClick}) => {
    // 将 businessData 转换为 Collapse 所需的 items
    const collapseItems = businessData.map((category) => ({
        key: category.category_no.toString(),
        label: category.category_name.replace("类", ""),
        children: (
            <Row gutter={[16, 16]} style={{marginTop: 8}}>
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
        style: {background: "#fff", borderRadius: 8, marginBottom: 16},
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
                style={{background: "transparent"}}
                items={collapseItems} // 使用 items 替代 children
            />
        </div>
    );
};

export default WorkbenchHome;
