import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo.svg';
import { useNavigate } from 'react-router-dom';

const NavbarDark = () => {
    const [isTop, setIsTop] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsTop(window.scrollY === 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

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
                            <a href="/appointment" className='text-base font-semibold'>APPOINTMENT</a>
                            <a href="/doctors" className='text-base font-semibold'>DOCTORS</a>
                            <a href="/about" className='text-base font-semibold'>ABOUT</a>
                            <a href="/contact" className='text-base font-semibold'>CONTACT</a>
                        </>
                    </nav>
                </div>
            </header>

        </>
    );
}

export default NavbarDark;