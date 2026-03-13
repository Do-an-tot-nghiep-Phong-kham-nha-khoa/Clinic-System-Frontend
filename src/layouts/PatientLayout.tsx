import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import { CgProfile } from "react-icons/cg";
import { ImProfile } from "react-icons/im";
import { FaHome } from 'react-icons/fa';
import { Button, Layout, Menu, Avatar, Drawer } from "antd";
import {
    MdLogout,
} from "react-icons/md";
import { useState } from "react";
import { FaListCheck } from "react-icons/fa6";
import { FaFileMedical, FaRegCalendarPlus, FaRobot } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import logo from '../assets/logo.svg';
import logoOnly from '../assets/logoOnly.svg';

const { Header, Sider, Content } = Layout;

const PatientLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [openDrawer, setOpenDrawer] = useState(false); // Quản lý đóng mở menu trên mobile
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        {
            key: "profile",
            icon: <CgProfile size={20} />,
            label: "Thông tin cá nhân",
            onClick: () => { navigate("/patient"); setOpenDrawer(false); },
        },
        {
            key: "health-profile",
            icon: <ImProfile size={20} />,
            label: "Hồ sơ sức khỏe",
            onClick: () => { navigate("/patient/health-profile"); setOpenDrawer(false); },
        },
        {
            key: "appointments",
            icon: <FaRegCalendarPlus size={20} />,
            label: "Xem lịch hẹn",
            onClick: () => { navigate("/patient/appointments"); setOpenDrawer(false); },
        },
        {
            key: "appointments-specialty",
            icon: <FaListCheck size={20} />,
            label: "Đặt lịch chuyên khoa",
            onClick: () => { navigate("/patient/appointments-specialty"); setOpenDrawer(false); },
        },
        {
            key: "appointments-doctor",
            icon: <FaListCheck size={20} />,
            label: "Đặt lịch theo bác sĩ",
            onClick: () => { navigate("/patient/appointments-doctor"); setOpenDrawer(false); },
        },
        {
            key: "medical-records",
            icon: <FaFileMedical size={20} />,
            label: "Xem lịch sử khám",
            onClick: () => { navigate("/patient/medical-records"); setOpenDrawer(false); },
        },
        {
            key: "chatbot",
            icon: <FaRobot size={20} />,
            label: "Chatbot tư vấn",
            onClick: () => { navigate("/patient/chatbot"); setOpenDrawer(false); },
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

    return (
        <Layout className="h-screen overflow-hidden">
            {/* --- DESKTOP SIDER (Ẩn trên Mobile < 768px) --- */}
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={280}
                className="hidden md:flex flex-col h-full !bg-slate-800"
            >
                <div className="flex h-full flex-col justify-between text-white">
                    <div className="px-4 py-6">
                        <div className="text-white text-xl font-bold text-center pb-6 flex items-center justify-center">
                            <Link to="/" className="filter brightness-0 invert">
                                <img src={collapsed ? logoOnly : logo} alt="logo" className="h-8 w-auto" />
                            </Link>
                        </div>
                        <Menu
                            className="!bg-transparent !border-none text-base"
                            theme="dark"
                            mode="inline"
                            items={menuItems}
                            selectedKeys={[selectedKey]}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div className="p-4 border-t border-slate-700 bg-slate-900">
                        <div className={`flex items-center gap-3 mb-4 ${collapsed ? 'justify-center' : ''}`}>
                            <Avatar size={40} className="!bg-blue-100 !text-blue-600 font-bold shrink-0">
                                {user?.email?.charAt(0).toUpperCase() || "A"}
                            </Avatar>
                            {!collapsed && (
                                <div className="flex flex-col overflow-hidden">
                                    <span className="font-semibold truncate text-sm">{user?.email?.split('@')[0]}</span>
                                    <span className="text-[11px] text-gray-400 truncate">{user?.email}</span>
                                </div>
                            )}
                        </div>
                        {!collapsed && (
                            <Button
                                block danger type="primary" ghost icon={<MdLogout />}
                                onClick={() => { logout(); navigate("/"); }}
                            >
                                Đăng xuất
                            </Button>
                        )}
                    </div>
                </div>
            </Sider>

            {/* --- MOBILE DRAWER (Chỉ hiện khi nhấn menu trên Mobile) --- */}
            <Drawer
                title={<img src={logo} alt="logo" className="h-8 brightness-0 invert" />}
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
                width={280}
                bodyStyle={{ padding: 0, backgroundColor: '#1e293b' }} // bg-slate-800
                headerStyle={{ backgroundColor: '#1e293b', borderBottom: '1px solid #334155' }}
            >
                <Menu
                    theme="dark"
                    mode="inline"
                    items={menuItems}
                    selectedKeys={[selectedKey]}
                    className="!bg-transparent !text-lg"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        fontSize: '16px'
                    }}
                />
                <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
                    <Button block danger icon={<MdLogout />} onClick={() => { logout(); navigate("/"); }}>
                        Đăng xuất
                    </Button>
                </div>
            </Drawer>

            <Layout className="flex flex-col">
                {/* --- HEADER --- */}
                <Header className="px-4 flex items-center justify-between !bg-slate-800 text-white sticky top-0 z-10 shadow-md">
                    <div className="flex items-center">
                        {/* Mobile Toggle */}
                        <Button
                            type="text"
                            icon={openDrawer ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => {
                                if (window.innerWidth < 768) setOpenDrawer(true);
                                else setCollapsed(!collapsed);
                            }}
                            className="!text-white !text-xl"
                        />
                        <Button
                            type="text"
                            icon={<FaHome />}
                            onClick={() => navigate('/')}
                            className="!ml-2 !text-white flex items-center gap-2"
                        >
                            <span className="hidden sm:inline">Trang chủ</span>
                        </Button>
                    </div>

                    <div className="flex items-center gap-3 md:hidden">
                        <span className="text-sm font-medium text-white">{user?.email?.split('@')[0]}</span>
                        <Avatar size="small" className="!bg-blue-500">{user?.email?.charAt(0).toUpperCase()}</Avatar>
                    </div>
                </Header>

                {/* --- CONTENT --- */}
                <Content className="p-3 md:p-6 bg-[#f0f2f5] overflow-y-auto pb-20 md:pb-6">
                    <div className="">
                        <Outlet />
                    </div>
                </Content>

                {/* --- MOBILE BOTTOM NAVIGATION (UI chuyên nghiệp cho bệnh nhân) --- */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-col items-center text-blue-600" onClick={() => navigate("/patient")}>
                        <CgProfile size={22} />
                        <span className="text-[10px] mt-1">Cá nhân</span>
                    </div>
                    <div className="flex flex-col items-center text-gray-500" onClick={() => navigate("/patient/appointments")}>
                        <FaRegCalendarPlus size={22} />
                        <span className="text-[10px] mt-1">Lịch hẹn</span>
                    </div>
                    <div className="flex flex-col items-center text-gray-500" onClick={() => navigate("/patient/chatbot")}>
                        <FaRobot size={22} />
                        <span className="text-[10px] mt-1">AI Tư vấn</span>
                    </div>
                </div>
            </Layout>
        </Layout>
    );
}

export default PatientLayout;