import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import { CgProfile } from "react-icons/cg";
import { ImProfile } from "react-icons/im";
import { FaHome } from 'react-icons/fa';
import { Button, Layout, Menu, Avatar } from "antd";
import {
    MdLogout,
} from "react-icons/md";
import { useState } from "react";
import { FaListCheck } from "react-icons/fa6";
import { FaFileMedical, FaRegCalendarPlus, FaRobot } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const { Header, Sider, Content } = Layout;


const PatientLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const location = useLocation();

    const menuItems = [
        
        {
            key: "profile",
            icon: <CgProfile size={20} />,
            label: "Thông tin cá nhân",
            onClick: () => navigate("/patient"),
        },
        {
            key: "health-profile",
            icon: <ImProfile size={20} />,
            label: "Hồ sơ sức khỏe",
            onClick: () => navigate("/patient/health-profile"),
        },
        {
            key: "appointments",
            icon: <FaRegCalendarPlus size={20} />,
            label: "Xem lịch hẹn",
            onClick: () => navigate("/patient/appointments"),
        },
        {
            key: "appointments-specialty",
            icon: <FaListCheck size={20} />,
            label: "Đặt lịch chuyên khoa",
            onClick: () => navigate("/patient/appointments-specialty"),
        },
        {
            key: "appointments-doctor",
            icon: <FaListCheck size={20} />,
            label: "Đặt lịch hẹn theo bác sĩ",
            onClick: () => navigate("/patient/appointments-doctor"),
        },
        {
            key: "medical-records",
            icon: <FaFileMedical size={20} />,
            label: "Xem lịch sử khám",
            onClick: () => navigate("/patient/medical-records"),
        },
        {
            key: "chatbot",
            icon: <FaRobot size={20} />,
            label: "Chatbot tư vấn",
            onClick: () => navigate("/patient/chatbot"),
        },
    ];

    const pathname = location.pathname || "";
    let selectedKey = "profile";
    if (pathname.startsWith("/patient/medical-records")) selectedKey = "medical-records";
    else if (pathname.startsWith("/patient/chatbot")) selectedKey = "chatbot";
    else if (pathname.startsWith("/patient/health-profile")) selectedKey = "health-profile";
    else if (pathname.startsWith("/patient/appointments-doctor")) selectedKey = "appointments-doctor";
    else if (pathname.startsWith("/patient/appointments-specialty")) selectedKey = "appointments-specialty";
    else if (pathname.startsWith("/patient/appointments")) selectedKey = "appointments";
    else if (pathname === "/patient" || pathname === "/patient/") selectedKey = "profile";

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
                            <Link to="/" className="!text-white">{!collapsed ? "Khung bệnh nhân" : "Bệnh nhân"}</Link>
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
                    {/* Home button to return to patient home/dashboard */}
                    <Button
                        type="text"
                        icon={<FaHome />}
                        onClick={() => navigate('/')}
                        className="!ml-2 !text-white"
                    >
                        {!collapsed && <span>Trang chủ</span>}
                    </Button>
                </Header>

                <Content className="p-4 bg-[#f5f5f5] flex-grow overflow-y-auto">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

export default PatientLayout;