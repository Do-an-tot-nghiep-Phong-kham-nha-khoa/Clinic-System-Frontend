import { useEffect, useState } from 'react';
import logo from '../../assets/logo.svg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button, message, Drawer } from 'antd';
import { FaUserLarge, FaBars, FaXmark } from 'react-icons/fa6';

const Navbar = () => {
    const [isTop, setIsTop] = useState(true);
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
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

    // Đóng drawer khi chuyển trang
    useEffect(() => {
        setOpenMobileMenu(false);
    }, [location]);

    const handleLogout = async () => {
        try {
            await logout();
            message.success('Đăng xuất thành công!');
            navigate('/');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const NavLinks = () => (
        <>
            <Link to={getDashboardLink()} className='text-base font-semibold hover:text-blue-500 transition-colors'>{getDashboardText()}</Link>
            <Link to="/doctors" className='text-base font-semibold hover:text-blue-500 transition-colors'>BÁC SĨ</Link>
            <Link to="/about" className='text-base font-semibold hover:text-blue-500 transition-colors'>GIỚI THIỆU</Link>
            <Link to="/contact" className='text-base font-semibold hover:text-blue-500 transition-colors'>LIÊN HỆ</Link>
        </>
    );

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isTop ? 'bg-transparent py-4' : 'bg-white shadow-md py-2'
                }`}
        >
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="w-40 md:w-48 transition-all">
                    <img
                        src={logo}
                        alt="Logo"
                        className={`${isTop ? 'brightness-0 invert' : ''} transition-all duration-300`}
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className={`hidden lg:flex items-center gap-8 ${isTop ? 'text-white' : 'text-gray-800'}`}>
                    <div className="flex gap-6">
                        <NavLinks />
                    </div>

                    <div className='h-6 w-[1px] bg-gray-300 mx-2'></div>

                    <div className='flex items-center gap-3'>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-2 text-sm font-medium">
                                    <FaUserLarge /> {user.email?.split('@')[0]}
                                </span>
                                <Button onClick={handleLogout} type="primary" danger ghost size="middle">
                                    Đăng xuất
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Button onClick={() => navigate('/login')} type="primary" className="font-semibold">
                                    Đăng nhập
                                </Button>
                                <Button
                                    onClick={() => navigate('/register')}
                                    className={`${isTop ? 'text-white border-white hover:!text-blue-400' : ''} font-semibold`}
                                >
                                    Đăng ký
                                </Button>
                            </>
                        )}
                    </div>
                </nav>

                {/* Mobile Toggle Button */}
                <button
                    className={`lg:hidden text-2xl p-2 ${isTop ? 'text-white' : 'text-gray-800'}`}
                    onClick={() => setOpenMobileMenu(true)}
                >
                    <FaBars />
                </button>

                {/* Mobile Drawer */}
                <Drawer
                    title="Menu"
                    placement="right"
                    onClose={() => setOpenMobileMenu(false)}
                    open={openMobileMenu}
                    width={280}
                    extra={<FaXmark className="text-xl" onClick={() => setOpenMobileMenu(false)} />}
                    closeIcon={null}
                >
                    <div className="flex flex-col gap-6">
                        <nav className="flex flex-col gap-4">
                            <NavLinks />
                        </nav>
                        <hr />
                        <div className="flex flex-col gap-3">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                        <FaUserLarge /> {user.email}
                                    </div>
                                    <Button onClick={handleLogout} block danger>Đăng xuất</Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={() => navigate('/login')} type="primary" block>Đăng nhập</Button>
                                    <Button onClick={() => navigate('/register')} block>Đăng ký</Button>
                                </>
                            )}
                        </div>
                    </div>
                </Drawer>
            </div>
        </header>
    );
}

export default Navbar;