import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Avatar } from "antd";
import {
    MdDashboard,
    MdPeople,
    MdLogout,
} from "react-icons/md";
import { useState } from "react";
import { FaListCheck } from "react-icons/fa6";
import { FaClipboardList } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { GiMedicines } from "react-icons/gi";

const { Header, Sider, Content } = Layout;


const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const location = useLocation();

    const menuItems = [
        {
            key: "dashboard",
            icon: <MdDashboard size={20} />,
            label: "Thống kê",
            onClick: () => navigate("/admin/"),
        },
        {
            key: "users",
            icon: <MdPeople size={20} />,
            label: "Quản lý tài khoản",
            onClick: () => navigate("/admin/users"),
        },
        {
            key: "categories",
            icon: <FaListCheck size={20} />,
            label: "Quản lý lịch hẹn",
            onClick: () => navigate("/admin/appointments"),
        },
        {
            key: "medicines",
            icon: <GiMedicines size={20} />,
            label: "Quản lý kho thuốc",
            onClick: () => navigate("/admin/medicines"),
        },
        {
            key: "services",
            icon: <FaClipboardList size={20} />,
            label: "Quản lý dịch vụ",
            onClick: () => navigate("/admin/services"),
        },
    ];

    const pathname = location.pathname || "";
    let selectedKey = "dashboard";
    if (pathname.startsWith("/admin/medicines")) selectedKey = "medicines";
    else if (pathname.startsWith("/admin/users")) selectedKey = "users";
    else if (pathname.startsWith("/admin/appointments")) selectedKey = "categories";
    else if (pathname.startsWith("/admin/services")) selectedKey = "services";
    else if (pathname === "/admin" || pathname === "/admin/") selectedKey = "dashboard";

    return (
        <Layout className="h-screen">
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={300}
                className="!flex !flex-col !h-full"
            >
                <div className="flex h-screen flex-col justify-between border-e border-gray-100 bg-slate-800 text-white">
                    <div className="px-4 py-6">
                        <div className="text-white text-xl font-bold text-center pb-4 align-middle justify-center flex items-center">
                            <Link to="/" className="!text-white">{!collapsed ? "Admin Panel" : "Admin"}</Link>
                        </div>

                        <div className="!flex-1 !overflow-auto">
                            <Menu className="!bg-slate-800 !text-base flex flex-col items-center justify-center gap-4" theme="dark" mode="inline" items={menuItems} selectedKeys={[selectedKey]} />
                        </div>
                    </div>

                    <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
                        <div>
                            <div className="p-4 flex items-center gap-3">
                                <Avatar size={40} className="!bg-[var(--color-primary)] !text-white !uppercase !font-bold">
                                    {user?.email?.charAt(0).toUpperCase() || "A"}
                                </Avatar>
                                {!collapsed && (
                                    <div className="flex flex-col text-white text-sm gap-1">
                                        <span className="font-semibold">{user?.email}</span>
                                        <span className="text-gray-400 text-xs">{user?.email}</span>
                                    </div>
                                )}
                            </div>

                            {!collapsed && (
                                <div className="flex items-center justify-center pb-4">
                                    <Button
                                        type="link"
                                        icon={<MdLogout />}
                                        className="!bg-white !text-black hover:!bg-black hover:!text-white !border-none"
                                        onClick={() => {
                                            logout();
                                            navigate("/");
                                        }}
                                    >
                                        Đăng xuất
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Sider>
            <Layout>
                <Header
                    className="px-4 flex items-center !bg-slate-800 text-white"

                >
                    <Button
                        type="text"
                        icon={
                            collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        className="!w-[48px] !h-[48px] !text-base !text-white"
                    />
                </Header>

                <Content className="p-4 bg-[#f5f5f5] flex-grow overflow-y-auto">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default AdminLayout;