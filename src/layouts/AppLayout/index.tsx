import './index.css';
import React, {useEffect, useState} from "react";
import {Layout, Menu, Dropdown, Tooltip, Button, Breadcrumb} from "antd";
import {
    BellOutlined,
    SettingOutlined,
    GlobalOutlined,
    UserOutlined,
    PieChartOutlined,
    PushpinOutlined,
    BulbOutlined,
} from "@ant-design/icons";

import {useNavigate, useLocation} from "react-router-dom";
import {getLogo} from "../../api/system";
import {BreadcrumbItem, useBreadcrumb} from "../../context/BreadcrumbContext";
import AppRouter from "../../router";


const {Header, Content} = Layout;

export interface BusinessItem {
    code: string;
    name: string;
    is_common: number;
}

export interface BusinessCategory {
    category_no: number;
    category_name: string;
    children: BusinessItem[];
}

// 语言菜单
const languageMenuItems = [
    {key: "1", label: "中文"},
    {key: "2", label: "English"},
];

const AppLayout: React.FC = () => {
    const [logoUrl, setLogoUrl] = useState<string>("");
    const [businessData, setBusinessData] = useState<BusinessCategory[]>([]);

    const navigate = useNavigate();
    const location = useLocation();
    const {crumbs, setCrumbs} = useBreadcrumb();

    // 点击业务按钮
    const handleBusinessClick = (item: BusinessItem) => {
        let newCrumbs: BreadcrumbItem[] = [{label: "造价作业", path: "/workbench"}];

        switch (item.code) {
            case "B223":
                newCrumbs.push({label: "竣工结算审核"});
                setCrumbs(newCrumbs);
                navigate("/workbench/b223");
                break;
            default:
                alert(`尚未配置页面：${item.name}`);
        }
    };

    // 初始化 logo 和业务数据
    useEffect(() => {
        const fetchLogo = async () => {
            try {
                const logo = await getLogo();
                setLogoUrl(logo);
            } catch (err) {
                console.error("获取 logo 失败：", err);
            }
        };
        fetchLogo();

        const fetchServices = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/services/tree");
                const data: BusinessCategory[] = await res.json();
                setBusinessData(data);
            } catch (err) {
                console.error("获取服务失败：", err);
            }
        };
        fetchServices();
    }, []);

    // 根据 URL 自动设置面包屑
    useEffect(() => {
        if (location.pathname === "/workbench") {
            setCrumbs([{label: "造价作业", path: "/workbench"}]);
        } else if (location.pathname === "/workbench/b223") {
            setCrumbs([
                {label: "造价作业", path: "/workbench"},
                {label: "竣工结算审核"},
            ]);
        } else if (location.pathname === "/workbench/b223/create") {
            setCrumbs([
                {label: "造价作业", path: "/workbench"},
                {label: "竣工结算审核", path: "/workbench/b223"},
                {label: "新建结算项目"},
            ]);
        }
    }, [location.pathname, setCrumbs]);

    // 点击面包屑导航
    const handleBreadcrumbClick = (item: BreadcrumbItem, index: number) => {
        if (item.path) {
            setCrumbs(crumbs.slice(0, index + 1));
            navigate(item.path);
        }
    };

    return (
        <Layout style={{minHeight: "100vh", background: "#f0f2f5"}}>
            {/* Header */}
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
                        <img src={logoUrl} alt="企业 Logo" style={{height: 24, marginTop: 22, marginRight: 60}}/>
                    ) : (
                        <span style={{fontWeight: 600, fontSize: 16}}>Logo</span>
                    )}
                </div>

                <Menu
                    mode="horizontal"
                    defaultSelectedKeys={["workbench"]}
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
                    <Tooltip title="消息中心">
                        <Button type="text" icon={<BellOutlined/>}/>
                    </Tooltip>
                    <Tooltip title="待办事项">
                        <Button type="text" icon={<PushpinOutlined/>}/>
                    </Tooltip>
                    <Tooltip title="工作台">
                        <Button type="text" icon={<PieChartOutlined/>}/>
                    </Tooltip>
                    <Tooltip title="系统管理">
                        <Button type="text" icon={<SettingOutlined/>}/>
                    </Tooltip>
                    <Dropdown menu={{items: languageMenuItems}} placement="bottomRight">
                        <Tooltip title="语言">
                            <Button type="text" icon={<GlobalOutlined/>}/>
                        </Tooltip>
                    </Dropdown>
                    <Tooltip title="主题切换">
                        <Button type="text" icon={<BulbOutlined/>}/>
                    </Tooltip>
                    <Tooltip title="个人中心">
                        <Button type="text" icon={<UserOutlined/>}/>
                    </Tooltip>
                </div>
            </Header>

            {/* Content */}
            <Content style={{padding: "24px", marginTop: 64, height: `calc(100vh - 64px)`, overflowY: "auto"}}>
                {/* 面包屑 */}
                <Breadcrumb
                    style={{marginBottom: 16}}
                    items={crumbs.map((item, index) => ({
                        title: item.path ? (
                            <button
                                style={{
                                    fontSize: 12,
                                    color: "#1890ff",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                }}
                                onClick={() => handleBreadcrumbClick(item, index)}
                            >
                                {item.label}
                            </button>
                        ) : (
                            <span style={{fontSize: 12, color: "#000"}}>{item.label}</span>
                        ),
                    }))}
                />


                {/* 路由内容 */}
                {/*<Routes>*/}
                {/*    <Route path="/" element={<Navigate to="/workbench"/>}/>*/}
                {/*    <Route*/}
                {/*        path="/workbench"*/}
                {/*        element={<WorkbenchHome businessData={businessData} onBusinessClick={handleBusinessClick}/>}*/}
                {/*    />*/}
                {/*    <Route path="/B223" element={<B223/>}/>*/}
                {/*</Routes>*/}
                <AppRouter businessData={businessData} onBusinessClick={handleBusinessClick}/>
            </Content>
        </Layout>
    );
};

export default AppLayout;
