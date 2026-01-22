import React from "react";
import {Layout, Menu} from "antd";
import {Outlet, useLocation, useNavigate} from "react-router-dom";

const {Sider, Content} = Layout;

const SystemLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Layout style={{background: "#fff", minHeight: "100%"}}>
            <Sider width={200} style={{background: "#fff"}}>
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    onClick={({key}) => navigate(key)}
                    items={[
                        {key: "/system/prompts", label: "提示模板"},
                        {key: "/system/org", label: "组织结构"},
                        {key: "/system/roles", label: "角色权限"},
                        {key: "/system/config", label: "系统配置"},
                    ]}
                />
            </Sider>
            <Content style={{padding: 24}}>
                <Outlet/>
            </Content>
        </Layout>
    );
};

export default SystemLayout;
