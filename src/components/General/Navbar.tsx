import { useEffect, useState } from 'react';
import logo from '../../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button, message } from 'antd';
import { FaUserLarge, FaBars } from 'react-icons/fa6';

const Navbar = () => {
    const [isTop, setIsTop] = useState(true);
    const [openMenu, setOpenMenu] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => setIsTop(window.scrollY === 0);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        await logout();
        message.success('Đăng xuất thành công!', 2);
        navigate('/');
    };

    return (
        <header
            className={`fixed top-0 w-full z-20 transition-colors duration-300
            ${isTop ? 'bg-transparent shadow-none' : 'bg-white shadow'}`}
        >
            <div className="container mx-auto flex justify-between items-center p-4">
                {/* Logo */}
                <a className="w-50 cursor-pointer" href="/">
                    <img
                        src={logo}
                        alt="Logo"
                        className={`${isTop ? 'filter brightness-0 invert' : ''}`}
                    />
                </a>

                {/* DESKTOP NAV – GIỮ NGUYÊN */}
                <nav
                    className={`hidden md:flex gap-4 items-center transition-colors duration-300 
                    ${isTop ? 'text-white' : 'text-black'}`}
                >
                    <a href="/patient/" className="text-base font-semibold">ĐẶT LỊCH</a>
                    <a href="/doctors" className="text-base font-semibold">BÁC SĨ</a>
                    <a href="/about" className="text-base font-semibold">GIỚI THIỆU</a>
                    <a href="/contact" className="text-base font-semibold">LIÊN HỆ</a>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <FaUserLarge />
                                {user.email || 'User'}
                                <Button
                                    onClick={handleLogout}
                                    variant="solid"
                                    color="blue"
                                    className="!text-base !font-bold"
                                >
                                    Đăng xuất
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={() => navigate('/login')}
                                    variant="solid"
                                    color="blue"
                                    className="!text-base !font-bold"
                                >
                                    Đăng nhập
                                </Button>
                                <Button
                                    color="blue"
                                    variant="outlined"
                                    ghost
                                    className="!text-base !font-bold"
                                    onClick={() => navigate('/register')}
                                >
                                    Đăng ký
                                </Button>
                            </>
                        )}
                    </div>
                </nav>

                {/* MOBILE MENU */}
                <div className="relative md:hidden">
                    <button
                        onClick={() => setOpenMenu(!openMenu)}
                        className={`p-2 rounded-md
                        ${isTop ? 'text-white' : 'text-black'}`}
                    >
                        <FaBars size={22} />
                    </button>

                    {openMenu && (
                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-lg overflow-hidden z-30">
                            {/* Nav links */}
                            <div className="flex flex-col">
                                <button onClick={() => navigate('/patient')} className="px-4 py-3 text-left hover:bg-slate-100">
                                    Đặt lịch
                                </button>
                                <button onClick={() => navigate('/doctors')} className="px-4 py-3 text-left hover:bg-slate-100">
                                    Bác sĩ
                                </button>
                                <button onClick={() => navigate('/about')} className="px-4 py-3 text-left hover:bg-slate-100">
                                    Giới thiệu
                                </button>
                                <button onClick={() => navigate('/contact')} className="px-4 py-3 text-left hover:bg-slate-100">
                                    Liên hệ
                                </button>
                            </div>

                            <div className="border-t" />

                            {/* Auth */}
                            <div className="flex flex-col p-3 gap-2">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-2 text-sm text-slate-700">
                                            <FaUserLarge />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                        <Button
                                            onClick={handleLogout}
                                            color="blue"
                                            className="w-full"
                                        >
                                            Đăng xuất
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            onClick={() => navigate('/login')}
                                            color="blue"
                                            className="w-full"
                                        >
                                            Đăng nhập
                                        </Button>
                                        <Button
                                            onClick={() => navigate('/register')}
                                            color="blue"
                                            variant="outlined"
                                            ghost
                                            className="w-full"
                                        >
                                            Đăng ký
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
