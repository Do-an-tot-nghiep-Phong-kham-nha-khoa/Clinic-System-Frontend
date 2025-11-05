import React from 'react';
import BgPicture from '../../assets/bg-hero.png'
import contactBg from '../../assets/contact-picture.png'
import doctor1 from '../../assets/doctor_1.png'
import doctor2 from '../../assets/doctor_2.png'
import doctor3 from '../../assets/doctor_3.png'
import { FiPhone } from "react-icons/fi";
import { LuAmbulance, LuBaby } from "react-icons/lu";
import { IoLocationOutline } from 'react-icons/io5';
import { Button, Card } from 'antd';
import { FaArrowRight, FaFacebook, FaInstagram, FaSyringe, FaTwitter } from 'react-icons/fa';
import Link from 'antd/es/typography/Link';
import { RiAlarmWarningFill } from 'react-icons/ri';
import { LiaDnaSolid } from 'react-icons/lia';
import { GiBrain, GiHeartOrgan } from 'react-icons/gi';
import { AiOutlineSchedule } from 'react-icons/ai';
import Footer from '../../components/General/Footer';
import Navbar from '../../components/General/Navbar';

const HeroSection = () => {
    return (
        <section id='hero' className="bg-gray-100 h-screen">
            <img src={BgPicture} alt="Background"
                className='absolute inset-0 w-full h-full object-cover z-0'
            />
            <div className="min-h-screen flex items-center justify-center text-white relative z-10">
                <div className="flex flex-col justify-center items-center text-center gap-5">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl italic font-[Times_New_Roman] font-semibold">Welcome To Our Clinic!</h2>
                    <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-9xl font-bold">IT'S NICE TO MEET YOU</h1>
                    <a className="p-6 bg-[var(--color-primary)] rounded-xl border-none text-white font-bold 
                        sm:text-xl md:text-3xl hover:bg-white hover:text-[var(--color-secondary)] transition duration-300 ease-in-out"
                        href="#department"
                        onClick={e => {
                            e.preventDefault();
                            const el = document.getElementById('department');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        Tell Me More
                    </a>
                </div>
            </div>
        </section>
    );
}

const DepartmentSection = () => {
    return (
        <section id='department' className="bg-white py-20">
            <div className='container mx-auto px-4'>
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='text-4xl font-bold uppercase'>Departments</h1>
                </div>
                <div className='grid grid-cols-6 gap-6 mt-10'>
                    <Card
                        className="shadow-md transition-all duration-300 ease-in-out hover:bg-[var(--color-primary)] group hover:scale-105 hover:-translate-y-2"
                    >
                        <a className='flex flex-col items-center justify-center' href="/doctors#Emergency">
                            <div className="w-[80px] h-[80px] flex items-center justify-center mb-3 bg-white rounded-full">
                                <RiAlarmWarningFill className="w-[64px] h-[64px] text-[var(--color-primary)]  transition-colors duration-300" />
                            </div>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Emergency</p>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Department</p>
                        </a>
                    </Card>
                    <Card
                        className="shadow-md transition-all duration-300 ease-in-out hover:bg-[var(--color-primary)] group hover:scale-105 hover:-translate-y-2"
                    >
                        <a className='flex flex-col items-center justify-center' href="/doctors#Pediatric">
                            <div className="w-[80px] h-[80px] flex items-center justify-center mb-3 bg-white rounded-full">
                                <LuBaby className="w-[64px] h-[64px] text-[var(--color-primary)]  transition-colors duration-300" />
                            </div>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Pediatric</p>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Department</p>
                        </a>
                    </Card>
                    <Card
                        className="shadow-md transition-all duration-300 ease-in-out hover:bg-[var(--color-primary)] group hover:scale-105 hover:-translate-y-2"
                    >
                        <a className='flex flex-col items-center justify-center' href="/doctors#Gynecology">
                            <div className="w-[80px] h-[80px] flex items-center justify-center mb-3 bg-white rounded-full">
                                <LiaDnaSolid className="w-[64px] h-[64px] text-[var(--color-primary)]  transition-colors duration-300" />
                            </div>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Gynecology</p>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Department</p>
                        </a>
                    </Card>
                    <Card
                        className="shadow-md transition-all duration-300 ease-in-out hover:bg-[var(--color-primary)] group hover:scale-105 hover:-translate-y-2"
                    >
                        <a className='flex flex-col items-center justify-center ' href="/doctors#Cardiology">
                            <div className="w-[80px] h-[80px] flex items-center justify-center mb-3 bg-white rounded-full">
                                <GiHeartOrgan className="w-[64px] h-[64px] text-[var(--color-primary)]  transition-colors duration-300" />
                            </div>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Cardiology</p>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Department</p>
                        </a>
                    </Card>
                    <Card
                        className="shadow-md transition-all duration-300 ease-in-out hover:bg-[var(--color-primary)] group hover:scale-105 hover:-translate-y-2"
                    >
                        <a className='flex flex-col items-center justify-center ' href="/doctors#Neurology">
                            <div className="w-[80px] h-[80px] flex items-center justify-center mb-3 bg-white rounded-full">
                                <FaSyringe className="w-[64px] h-[64px] text-[var(--color-primary)]  transition-colors duration-300" />
                            </div>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Neurology</p>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Department</p>
                        </a>
                    </Card>
                    <Card
                        className="shadow-md transition-all duration-300 ease-in-out hover:bg-[var(--color-primary)] group hover:scale-105 hover:-translate-y-2"
                    >
                        <a className='flex flex-col items-center justify-center' href="/doctors#Psychiatry">
                            <div className="w-[80px] h-[80px] flex items-center justify-center mb-3 bg-white rounded-full">
                                <GiBrain className="w-[64px] h-[64px] text-[var(--color-primary)]  transition-colors duration-300" />
                            </div>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Psychiatry</p>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Department</p>
                        </a>
                    </Card>
                </div>
            </div>
        </section>
    )
}

const AboutSection = () => {
    return (
        <section id='about' className='bg-white '>
            <div className='container mx-auto px-4'>
                <div className='flex items-center'>
                    <div className='w-1/2 p-10'>
                        <div className='image object-center text-center flex items-center justify-center'>
                            <img src={contactBg} alt="ContactBg " className='h-[480px]' />
                        </div>
                    </div>
                    <div className="sm:w-1/2 p-5">
                        <div className="text">
                            <span className="text-gray-500 border-b-2 border-[var(--color-primary)] uppercase">About us</span>
                            <h2 className="my-4 font-bold text-3xl sm:text-4xl ">About <span className="text-[var(--color-primary)]">Our Team</span>
                            </h2>
                            <p className="text-gray-400 text-xl mb-3 flex items-center">
                                <FaArrowRight className='mr-2' />ProHealth is a team of experienced medical professionals
                            </p>
                            <p className="text-gray-400 text-base">
                                Dedicated to providing top-quality healthcare services. We believe in a holistic approach to healthcare that focuses on treating the whole person, not just the illness or symptoms.
                            </p>
                            <div className='flex items-center gap-2 mt-5 !text-[var(--color-primary)] hover:!text-[var(--color-secondary)]'>
                                <Link className='!text-base' href="/about">Learn more about us </Link>
                                <FaArrowRight className='text-xs text-blue-500 ' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const ContactSection = () => {
    return (
        <section id='appointment' className="bg-gray-100 py-20">
            <div className='container mx-auto px-4'>
                <div className='flex flex-col items-center justify-center'>
                    <h1 className='text-4xl font-bold uppercase'>Get In Touch</h1>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-10'>
                    <div className='flex flex-row items-center justify-center gap-5 p-6'>
                        <div className="bg-[var(--color-primary)] rounded-full w-[64px] h-[64px] flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-105">
                            <FiPhone className="text-white w-[32px] h-[32px]" />
                        </div>
                        <div>
                            <h2 className='text-base font-bold uppercase'>Hotline</h2>
                            <p className='text-gray-400 text-xl'>1900-0091</p>
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-center gap-5 p-6'>
                        <div className="bg-[var(--color-primary)] rounded-full w-[64px] h-[64px] flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-105">
                            <LuAmbulance className="text-white w-[32px] h-[32px]" />
                        </div>
                        <div>
                            <h2 className='text-base font-bold uppercase'>Ambulance</h2>
                            <p className='text-gray-400 text-xl'>876-256-876</p>
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-center gap-5 p-6'>
                        <div className="bg-[var(--color-primary)] rounded-full w-[64px] h-[64px] flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-105">
                            <IoLocationOutline className="text-white w-[32px] h-[32px]" />
                        </div>
                        <div>
                            <h2 className='text-base font-bold uppercase'>Location</h2>
                            <p className='text-gray-400 text-xl'>Hanoi, Vietnam</p>
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-center gap-5 p-6'>
                        <Button
                            type="primary"
                            size="large"
                            icon={<FaArrowRight />}
                            iconPosition="end"
                            className="!bg-gradient-to-r from-[#1DA1F2] to-[#0066CC] border-none text-white
                                !font-bold uppercase hover:opacity-60"
                            onClick={() => window.location.href = '/contact'}
                        >
                            Contact us
                        </Button>
                    </div>
                </div>
            </div>

        </section>
    )
}

type Doctor = {
    name: string;
    image: string;
    department: string;
    description: string;
};

const doctors: Doctor[] = [
    {
        name: "Dr. Nguyen Van A",
        image: doctor1,
        department: "Cardiology",
        description: "Dr. Nguyen Van A is the top cardiologist in our hospital, specializing in heart diseases and interventions.",
    },
    {
        name: "Dr. Tran Van B",
        image: doctor2,
        department: "Neurology",
        description: "Dr. Tran Thi B is the leading neurologist, renowned for her expertise in treating complex neurological disorders.",
    },
    {
        name: "Dr. Le Thi C",
        image: doctor3,
        department: "Pediatrics",
        description: "Dr. Le Van C is the best pediatrician, dedicated to providing excellent care for children.",
    },
];


const DoctorSection = () => {
    return (
        <section id='doctors' className="bg-gray-100 py-20">
            <div className='container mx-auto px-4'>
                <div className='flex flex-col items-center justify-center pb-10'>
                    <h1 className='text-4xl font-bold uppercase mb-3'>Our Top Professionists</h1>
                    <p className='text-base text-gray-400'>Doctor with top skills and techniques in Northside Vietnam</p>
                    <div className='flex flex-row items-center justify-center gap-5 p-6'>
                        <Button
                            type="primary"
                            size="large"
                            icon={<AiOutlineSchedule />}
                            iconPosition="start"
                            className="!bg-gradient-to-r from-[#1DA1F2] to-[#0066CC] border-none text-white
                                !font-bold uppercase hover:opacity-60"
                        >
                            Book an appointment
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">
                    {doctors.map((doctor, idx) => (
                        <div
                            key={idx}
                            className={`bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[500px] transition-transform duration-300
                                ${idx === 1 ? 'md:-mt-8' : 'md:mt-8'}`}
                        >
                            <div className="h-2/3 w-full flex items-center justify-center bg-gray-100">
                                {/* Thay src bằng link ảnh thật */}
                                <img
                                    src={doctor.image || "https://via.placeholder.com/200x250?text=Doctor+Photo"}
                                    alt={doctor.name}
                                    className="object-contain h-full w-full bg-blue-100"
                                />
                            </div>
                            <div className="h-1/3 p-4 flex flex-col items-center justify-center">
                                <h3 className="text-xl font-bold mb-1">{doctor.name}</h3>
                                <p className="text-[var(--color-primary)] font-semibold mb-1">{doctor.department}</p>
                                <p className="text-gray-500 text-sm text-center">{doctor.description}</p>
                                <div>
                                    <div className="flex items-center text-white gap-3 mt-4">
                                        <a aria-label="Facebook" className="p-2 rounded-full bg-[var(--color-primary)] hover:bg-slate-800 transition-colors">
                                            <FaFacebook />
                                        </a>
                                        <a aria-label="Instagram" className="p-2 rounded-full bg-[var(--color-primary)] hover:bg-slate-800 hover:text-white transition-colors">
                                            <FaInstagram />
                                        </a>
                                        <a aria-label="Twitter" className="p-2 rounded-full bg-[var(--color-primary)] hover:bg-slate-800 hover:text-white transition-colors">
                                            <FaTwitter />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
};


const Home = () => {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <DepartmentSection />
            <AboutSection />
            <DoctorSection />
            <ContactSection />
            <Footer />
        </div>
    );
}

export default Home;