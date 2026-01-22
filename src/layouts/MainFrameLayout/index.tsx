import './index.css';
import React, {useEffect, useState} from "react";
import {Layout, Menu, Dropdown, Tooltip, Button} from "antd";
import {
    BellOutlined,
    SettingOutlined,
    GlobalOutlined,
    UserOutlined,
    PieChartOutlined,
    PushpinOutlined,
    BulbOutlined,
} from "@ant-design/icons";
import {useNavigate, Outlet} from "react-router-dom";
import {getLogo} from "../../api/system";

const {Header, Content} = Layout;

// 语言菜单
const languageMenuItems = [
    {key: "1", label: "中文"},
    {key: "2", label: "English"},
];

const MainFrameLayout: React.FC = () => {
    const [logoUrl, setLogoUrl] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        getLogo().then(setLogoUrl).catch(console.error);
    }, []);

    return (
        <Layout style={{minHeight: "100vh", background: "#f0f2f5"}}>
            <Header
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 64,
                    display: "flex",
                    alignItems: "center",
                    background: "#fff",
                    padding: "0 24px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    zIndex: 100,
                }}
            >
                <div style={{marginRight: 24}}>
                    {logoUrl ? (
                        <img src={logoUrl} alt="Logo" style={{height: 24, marginTop: 22, marginRight: 60}}/>
                    ) : (
                        <span style={{fontWeight: 600}}>Logo</span>
                    )}
                </div>

                <Menu
                    mode="horizontal"
                    defaultSelectedKeys={["workbench"]}
                    selectedKeys={[]} // 可以根据 location 设置高亮
                    onClick={({key}) => {
                        switch (key) {
                            case "workbench":
                                navigate("/workbench");
                                break;
                            case "project":
                                navigate("/project");
                                break;
                            case "knowledge":
                                navigate("/knowledge");
                                break;
                            case "ai":
                                navigate("/ai");
                                break;
                            case "data":
                                navigate("/data");
                                break;
                            default:
                                break;
                        }
                    }}
                    items={[
                        {key: "workbench", label: "造价作业"},
                        {key: "project", label: "项目管理"},
                        {key: "knowledge", label: "知识库"},
                        {key: "ai", label: "智能助手"},
                        {key: "data", label: "数据分析"},
                    ]}
                    style={{flex: 1, borderBottom: "none"}}
                />

                <div style={{display: "flex", alignItems: "center"}}>
                    <Tooltip title="消息中心"><Button type="text" icon={<BellOutlined/>}/></Tooltip>
                    <Tooltip title="待办事项"><Button type="text" icon={<PushpinOutlined/>}/></Tooltip>
                    <Tooltip title="工作台"><Button type="text" icon={<PieChartOutlined/>}/></Tooltip>

                    <Tooltip title="系统管理">
                        <Button
                            type="text"
                            icon={<SettingOutlined/>}
                            onClick={() => navigate("/system")}
                        />
                    </Tooltip>

                    <Dropdown menu={{items: languageMenuItems}}>
                        <Tooltip title="语言"><Button type="text" icon={<GlobalOutlined/>}/></Tooltip>
                    </Dropdown>

                    <Tooltip title="主题"><Button type="text" icon={<BulbOutlined/>}/></Tooltip>
                    <Tooltip title="个人中心"><Button type="text" icon={<UserOutlined/>}/></Tooltip>
                </div>
            </Header>

            <Content style={{padding: 24, marginTop: 64, height: "calc(100vh - 64px)", overflowY: "auto"}}>
                <Outlet/>
            </Content>
        </Layout>
    );
};

export default MainFrameLayout;
