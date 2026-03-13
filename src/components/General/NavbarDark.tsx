import { useEffect, useState } from 'react';
import logo from '../../assets/logo.svg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button, message, Drawer } from 'antd';
import { FaUserLarge, FaBars, FaXmark } from 'react-icons/fa6';

const NavbarDark = () => {
    const [isTop, setIsTop] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Dùng để đóng drawer khi chuyển trang
    const { user, logout } = useAuth();

    const getDashboardLink = () => {
        if (!user) return '/patient/appointments-specialty';
        switch (user.role) {
            case 'doctor': return '/doctor';
            case 'admin': return '/admin';
            case 'receptionist': return '/receptionist';
            default: return '/patient/appointments-specialty';
        }
    };

    const getDashboardText = () => {
        if (!user) return 'ĐẶT LỊCH';
        switch (user.role) {
            case 'doctor': return 'TRANG BÁC SĨ';
            case 'admin': return 'QUẢN TRỊ';
            case 'receptionist': return 'LỄ TÂN';
            default: return 'ĐẶT LỊCH';
        }
    };

    useEffect(() => {
        const handleScroll = () => setIsTop(window.scrollY === 0);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Đóng mobile menu khi đường dẫn thay đổi
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const handleLogout = async () => {
        try {
            await logout();
            message.success('Đăng xuất thành công!', 2);
            navigate('/');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    // Component con cho các liên kết điều hướng để tái sử dụng
    const NavLinks = ({ mobile = false }) => (
        <div className={`flex ${mobile ? 'flex-col gap-6' : 'flex-row gap-6'}`}>
            <Link to={getDashboardLink()} className='text-base font-semibold hover:text-blue-400 transition-colors'>{getDashboardText()}</Link>
            <Link to="/doctors" className='text-base font-semibold hover:text-blue-400 transition-colors'>BÁC SĨ</Link>
            <Link to="/about" className='text-base font-semibold hover:text-blue-400 transition-colors'>GIỚI THIỆU</Link>
            <Link to="/contact" className='text-base font-semibold hover:text-blue-400 transition-colors'>LIÊN HỆ</Link>
        </div>
    );

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isTop ? 'bg-slate-800 py-4 shadow-none' : 'bg-white py-2 shadow-md'
                }`}
        >
            <div className="container mx-auto flex justify-between items-center px-4">
                {/* Logo */}
                <a className="w-40 md:w-50 cursor-pointer" href="/">
                    <img
                        src={logo}
                        alt="Logo"
                        className={`transition-all duration-300 ${isTop ? 'filter brightness-0 invert' : ''}`}
                    />
                </a>

                {/* Desktop Navigation (Ẩn khi < 1024px hoặc tùy chỉnh lg: thành md:) */}
                <nav className={`hidden lg:flex gap-8 items-center ${isTop ? 'text-white' : 'text-slate-800'}`}>
                    <NavLinks />

                    <div className="w-[1px] h-6 bg-gray-400/50 mx-2"></div>

                    <div className='flex items-center gap-3'>
                        {user ? (
                            <div className='flex items-center gap-4'>
                                <span className='flex items-center gap-2 font-medium'>
                                    <FaUserLarge className='text-sm' /> {user.email?.split('@')[0]}
                                </span>
                                <Button
                                    onClick={handleLogout}
                                    danger
                                    type="primary"
                                    className='!font-bold'
                                >
                                    Đăng xuất
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Button onClick={() => navigate('/login')}
                                    type="primary"
                                    className='!text-base !font-bold'>
                                    Đăng nhập
                                </Button>
                                <Button
                                    ghost={isTop}
                                    type={isTop ? 'default' : 'primary'}
                                    className={`!text-base !font-bold ${isTop ? 'border-white text-white hover:!text-blue-400 hover:!border-blue-400' : ''}`}
                                    onClick={() => navigate('/register')}
                                >
                                    Đăng ký
                                </Button>
                            </>
                        )}
                    </div>
                </nav>

                {/* Mobile Toggle Button (Hiện khi < 1024px) */}
                <button
                    className={`lg:hidden text-2xl p-2 rounded-md transition-colors ${isTop ? 'text-white hover:bg-slate-700' : 'text-slate-800 hover:bg-gray-100'}`}
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <FaBars />
                </button>

                {/* Mobile Drawer (UI chuyên nghiệp cho bệnh nhân) */}
                <Drawer
                    title={<img src={logo} alt="Logo" className="w-32" />}
                    placement="right"
                    onClose={() => setIsMobileMenuOpen(false)}
                    open={isMobileMenuOpen}
                    width={280}
                    closeIcon={<FaXmark className="text-xl text-gray-600" />}
                >
                    <div className="flex flex-col h-full justify-between">
                        <div className="mt-4">
                            <NavLinks mobile={true} />
                        </div>

                        <div className="border-t pt-6 mb-4">
                            {user ? (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3 text-slate-700 font-semibold px-1">
                                        <FaUserLarge /> {user.email}
                                    </div>
                                    <Button onClick={handleLogout} danger block size="large">
                                        Đăng xuất
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Button onClick={() => navigate('/login')} type="primary" block size="large">
                                        Đăng nhập
                                    </Button>
                                    <Button onClick={() => navigate('/register')} block size="large">
                                        Đăng ký
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </Drawer>
            </div>
        </header>
    );
}

export default NavbarDark;