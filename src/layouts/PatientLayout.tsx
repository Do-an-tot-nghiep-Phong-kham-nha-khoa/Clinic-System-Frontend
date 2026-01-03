import React, { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu, Avatar, Button, Grid } from "antd";
import { CgProfile } from "react-icons/cg";
import { ImProfile } from "react-icons/im";
import { FaHome, FaFileMedical } from "react-icons/fa";
import { FaListCheck, FaRegCalendarPlus, FaRobot } from "react-icons/fa6";
import { MdOutlineReceiptLong, MdLogout } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

/* ================= ICON FIX ================= */
const IconBox = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      width: 24,
      height: 24,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </span>
);

const PatientLayout = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  /* ================= COLLAPSE STATE ================= */
  const [collapsed, setCollapsed] = useState(false);

  // Mobile: luôn collapsed
  useEffect(() => {
    if (isMobile) setCollapsed(true);
  }, [isMobile]);

  /* ================= MENU ITEMS ================= */
  const menuItems = useMemo(
    () => [
      {
        key: "profile",
        icon: (
          <IconBox>
            <CgProfile size={18} />
          </IconBox>
        ),
        label: collapsed ? null : "Thông tin cá nhân",
        onClick: () => navigate("/patient"),
      },
      {
        key: "health-profile",
        icon: (
          <IconBox>
            <ImProfile size={18} />
          </IconBox>
        ),
        label: collapsed ? null : "Hồ sơ sức khỏe",
        onClick: () => navigate("/patient/health-profile"),
      },
      {
        key: "appointments",
        icon: (
          <IconBox>
            <FaRegCalendarPlus size={16} />
          </IconBox>
        ),
        label: collapsed ? null : "Xem lịch hẹn",
        onClick: () => navigate("/patient/appointments"),
      },
      {
        key: "appointments-specialty",
        icon: (
          <IconBox>
            <FaListCheck size={16} />
          </IconBox>
        ),
        label: collapsed ? null : "Đặt lịch chuyên khoa",
        onClick: () => navigate("/patient/appointments-specialty"),
      },
      {
        key: "appointments-doctor",
        icon: (
          <IconBox>
            <FaListCheck size={16} />
          </IconBox>
        ),
        label: collapsed ? null : "Đặt lịch theo bác sĩ",
        onClick: () => navigate("/patient/appointments-doctor"),
      },
      {
        key: "medical-records",
        icon: (
          <IconBox>
            <FaFileMedical size={16} />
          </IconBox>
        ),
        label: collapsed ? null : "Lịch sử khám",
        onClick: () => navigate("/patient/medical-records"),
      },
      {
        key: "invoices",
        icon: (
          <IconBox>
            <MdOutlineReceiptLong size={18} />
          </IconBox>
        ),
        label: collapsed ? null : "Hóa đơn",
        onClick: () => navigate("/patient/invoices"),
      },
      {
        key: "chatbot",
        icon: (
          <IconBox>
            <FaRobot size={16} />
          </IconBox>
        ),
        label: collapsed ? null : "Chatbot tư vấn",
        onClick: () => navigate("/patient/chatbot"),
      },
    ],
    [navigate, collapsed]
  );

  // Find the longest matching key to handle nested routes like appointments-specialty
  const selectedKey =
    menuItems
      .filter((i) => location.pathname.includes(i.key))
      .sort((a, b) => b.key.length - a.key.length)[0]?.key || "profile";

  return (
    <Layout className="fixed inset-0">
      {/* ================= SIDER ================= */}
      <Sider
        collapsible={!isMobile}
        collapsed={collapsed}
        trigger={null}
        width={260}
        collapsedWidth={80}
        className="!bg-slate-800"
      >
        <div className="flex h-full flex-col">
          <div className="flex-1">
            <div className="h-[76px] flex items-center justify-center px-4 overflow-hidden">
              {!collapsed && (
                <Link to="/" className="text-white text-xl font-bold whitespace-nowrap">
                  Khung bệnh nhân
                </Link>
              )}
            </div>

            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[selectedKey]}
              items={menuItems}
              className={`!bg-slate-800 ${
                collapsed
                  ? "[&_.ant-menu-item]:!flex [&_.ant-menu-item]:!justify-center [&_.ant-menu-item]:!items-center [&_.ant-menu-item]:!px-0 [&_.ant-menu-item-icon]:!mr-0"
                  : ""
              }`}
            />
          </div>

          <div className="border-t border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <Avatar className="!bg-[var(--color-primary)]">
                {user?.email?.charAt(0).toUpperCase()}
              </Avatar>
              {!collapsed && (
                <span className="text-white text-sm truncate">
                  {user?.email}
                </span>
              )}
            </div>

            {!collapsed && (
              <Button
                type="text"
                icon={<MdLogout />}
                className="mt-3 w-full !bg-white !text-black"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Đăng xuất
              </Button>
            )}
          </div>
        </div>
      </Sider>

      {/* ================= MAIN ================= */}
      <Layout>
        <Header className="px-4 flex items-center gap-2 !bg-slate-800 text-white">
          {!isMobile && (
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed((v) => !v)}
              className="!text-white"
            />
          )}

          <Button
            type="text"
            icon={<FaHome />}
            onClick={() => navigate("/")}
            className="!text-white"
          />
        </Header>

        <Content className="bg-[#f5f5f5] overflow-y-auto p-4">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default PatientLayout;
