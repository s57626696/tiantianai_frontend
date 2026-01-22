import React, {useEffect} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {Breadcrumb} from "antd";
import {BreadcrumbItem, useBreadcrumb} from "../../context/BreadcrumbContext";

const WorkbenchLayout: React.FC = () => {
    const {crumbs, setCrumbs} = useBreadcrumb();
    const location = useLocation();
    const navigate = useNavigate();

    // 页面初始化或路由变化时设置面包屑
    useEffect(() => {
        // 默认造价作业模块
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
                {label: "新建结算审核项目"},
            ]);
        } else {
            // 默认其他工作台页面
            setCrumbs([{label: "造价作业", path: "/workbench"}]);
        }
    }, [location.pathname, setCrumbs]);

    // 点击面包屑导航
    const handleBreadcrumbClick = (item: BreadcrumbItem, index: number) => {
        if (item.path) {
            setCrumbs(crumbs.slice(0, index + 1));
            navigate(item.path);
        }
    };

    // 仅在造价作业模块显示面包屑
    const showBreadcrumb = location.pathname.startsWith("/workbench");

    return (
        <div>
            {showBreadcrumb && (
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
            )}

            {/* 渲染工作台内部页面 */}
            <Outlet/>
        </div>
    );
};

export default WorkbenchLayout;
