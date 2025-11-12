import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button, message } from 'antd';
import { FaUserLarge } from 'react-icons/fa6';

const NavbarDark = () => {
    const [isTop, setIsTop] = useState(true);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsTop(window.scrollY === 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            message.success('Đăng xuất thành công!', 2);
            navigate('/');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <>
            <header
                className={`fixed top-0 w-full z-20 transition-colors duration-300 ${isTop ? 'bg-slate-800 shadow-none' : 'bg-white shadow'
                    }`}
            >
                <div className="container mx-auto flex justify-between items-center p-4">
                    <a className="w-50 cursor-pointer " href="/">
                        <img src={logo} alt="Logo"
                            className={`${isTop ? 'filter brightness-0 invert' : ''}`}
                        />
                    </a>

                    <nav
                        className={`flex gap-4 items-center transition-colors duration-300 
                            ${isTop ? 'text-white' : 'text-black'
                            }`}
                    >
                        <>
                            <a href="/patient" className='text-base font-semibold'>APPOINTMENT</a>
                            <a href="/doctors" className='text-base font-semibold'>DOCTORS</a>
                            <a href="/about" className='text-base font-semibold'>ABOUT</a>
                            <a href="/contact" className='text-base font-semibold'>CONTACT</a>
                        </>

                        <div className='flex items-center gap-3'>
                            {user ? (
                                <>
                                    <FaUserLarge /> {user.email || 'User'}
                                    <Button
                                        onClick={handleLogout}
                                        variant="solid" color="blue"
                                        className='!text-base !font-bold'
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={() => navigate('/login')}
                                        variant="solid" color="blue"
                                        className='!text-base !font-bold'>
                                        Login
                                    </Button>
                                    <Button
                                        color="blue" variant="outlined" ghost
                                        className='!text-base !font-bold'
                                        onClick={() => navigate('/register')}
                                    >
                                        Register
                                    </Button>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

        </>
    );
}

export default NavbarDark;