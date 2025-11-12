import React from 'react';
import BgPicture from '../../assets/bg-hero.png'
import contactBg from '../../assets/contact-picture.png'
import doctor1 from '../../assets/doctor_1.png'
import doctor2 from '../../assets/doctor_2.png'
import doctor3 from '../../assets/doctor_3.png'
import { FiPhone } from "react-icons/fi";
import { LuAmbulance, LuBaby } from "react-icons/lu";
import { IoEarOutline, IoLocationOutline } from 'react-icons/io5';
import { Button, Card } from 'antd';
import { FaArrowRight, FaFacebook, FaInstagram, FaSyringe, FaTwitter } from 'react-icons/fa';
import Link from 'antd/es/typography/Link';
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
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl italic font-[Times_New_Roman] font-semibold">Chào Mừng Đến Với Phòng Khám Của Chúng Tôi!</h2>
                    <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-9xl font-bold">RẤT VUI KHI GẶP BẠN</h1>
                    <a className="p-6 bg-[var(--color-primary)] rounded-xl border-none text-white font-bold 
                        sm:text-xl md:text-3xl hover:bg-white hover:text-[var(--color-secondary)] transition duration-300 ease-in-out"
                        href="#department"
                        onClick={e => {
                            e.preventDefault();
                            const el = document.getElementById('department');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        Tìm Hiểu Thêm
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
                    <h1 className='text-4xl font-bold uppercase'>Chuyên Khoa</h1>
                </div>
                <div className='grid grid-cols-6 gap-6 mt-10'>
                    <Card
                        className="shadow-md transition-all duration-300 ease-in-out hover:bg-[var(--color-primary)] group hover:scale-105 hover:-translate-y-2"
                    >
                        <a className='flex flex-col items-center justify-center' href="/doctors#Emergency">
                            <div className="w-[80px] h-[80px] flex items-center justify-center mb-3 bg-white rounded-full">
                                <LiaDnaSolid className="w-[64px] h-[64px] text-[var(--color-primary)]  transition-colors duration-300" />
                            </div>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Khoa</p>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Da Liễu</p>
                        </a>
                    </Card>
                    <Card
                        className="shadow-md transition-all duration-300 ease-in-out hover:bg-[var(--color-primary)] group hover:scale-105 hover:-translate-y-2"
                    >
                        <a className='flex flex-col items-center justify-center' href="/doctors#Pediatric">
                            <div className="w-[80px] h-[80px] flex items-center justify-center mb-3 bg-white rounded-full">
                                <LuBaby className="w-[64px] h-[64px] text-[var(--color-primary)]  transition-colors duration-300" />
                            </div>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Khoa</p>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Nhi Khoa</p>
                        </a>
                    </Card>
                    <Card
                        className="shadow-md transition-all duration-300 ease-in-out hover:bg-[var(--color-primary)] group hover:scale-105 hover:-translate-y-2"
                    >
                        <a className='flex flex-col items-center justify-center' href="/doctors#Gynecology">
                            <div className="w-[80px] h-[80px] flex items-center justify-center mb-3 bg-white rounded-full">
                                <IoEarOutline className="w-[64px] h-[64px] text-[var(--color-primary)]  transition-colors duration-300" />
                            </div>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Khoa</p>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Tai Mũi Họng</p>
                        </a>
                    </Card>
                    <Card
                        className="shadow-md transition-all duration-300 ease-in-out hover:bg-[var(--color-primary)] group hover:scale-105 hover:-translate-y-2"
                    >
                        <a className='flex flex-col items-center justify-center ' href="/doctors#Cardiology">
                            <div className="w-[80px] h-[80px] flex items-center justify-center mb-3 bg-white rounded-full">
                                <GiHeartOrgan className="w-[64px] h-[64px] text-[var(--color-primary)]  transition-colors duration-300" />
                            </div>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Khoa</p>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Tim Mạch</p>
                        </a>
                    </Card>
                    <Card
                        className="shadow-md transition-all duration-300 ease-in-out hover:bg-[var(--color-primary)] group hover:scale-105 hover:-translate-y-2"
                    >
                        <a className='flex flex-col items-center justify-center ' href="/doctors#Neurology">
                            <div className="w-[80px] h-[80px] flex items-center justify-center mb-3 bg-white rounded-full">
                                <FaSyringe className="w-[64px] h-[64px] text-[var(--color-primary)]  transition-colors duration-300" />
                            </div>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Khoa</p>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Sản Phụ</p>
                        </a>
                    </Card>
                    <Card
                        className="shadow-md transition-all duration-300 ease-in-out hover:bg-[var(--color-primary)] group hover:scale-105 hover:-translate-y-2"
                    >
                        <a className='flex flex-col items-center justify-center' href="/doctors#Psychiatry">
                            <div className="w-[80px] h-[80px] flex items-center justify-center mb-3 bg-white rounded-full">
                                <GiBrain className="w-[64px] h-[64px] text-[var(--color-primary)]  transition-colors duration-300" />
                            </div>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Khoa</p>
                            <p className='text-lg font-bold uppercase text-[var(--color-primary)]  transition-colors duration-300'>Nội Tổng Quát</p>
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
                            <span className="text-gray-500 border-b-2 border-[var(--color-primary)] uppercase">Về chúng tôi</span>
                            <h2 className="my-4 font-bold text-3xl sm:text-4xl ">Về <span className="text-[var(--color-primary)]">Đội Ngũ Của Chúng Tôi</span>
                            </h2>
                            <p className="text-gray-400 text-xl mb-3 flex items-center">
                                <FaArrowRight className='mr-2' />ProHealth là một đội ngũ chuyên gia y tế giàu kinh nghiệm
                            </p>
                            <p className="text-gray-400 text-base">
                                Tận tâm cung cấp các dịch vụ chăm sóc sức khỏe chất lượng hàng đầu. Chúng tôi tin vào phương pháp chăm sóc sức khỏe toàn diện, tập trung vào điều trị toàn bộ con người, không chỉ là bệnh tật hay triệu chứng.
                            </p>
                            <div className='flex items-center gap-2 mt-5 !text-[var(--color-primary)] hover:!text-[var(--color-secondary)]'>
                                <Link className='!text-base' href="/about">Tìm hiểu thêm về chúng tôi </Link>
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
                    <h1 className='text-4xl font-bold uppercase'>Liên Hệ Với Chúng Tôi</h1>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-10'>
                    <div className='flex flex-row items-center justify-center gap-5 p-6'>
                        <div className="bg-[var(--color-primary)] rounded-full w-[64px] h-[64px] flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-105">
                            <FiPhone className="text-white w-[32px] h-[32px]" />
                        </div>
                        <div>
                            <h2 className='text-base font-bold uppercase'>Đường Dây Nóng</h2>
                            <p className='text-gray-400 text-xl'>1900-0091</p>
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-center gap-5 p-6'>
                        <div className="bg-[var(--color-primary)] rounded-full w-[64px] h-[64px] flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-105">
                            <LuAmbulance className="text-white w-[32px] h-[32px]" />
                        </div>
                        <div>
                            <h2 className='text-base font-bold uppercase'>Xe Cấp Cứu</h2>
                            <p className='text-gray-400 text-xl'>876-256-876</p>
                        </div>
                    </div>
                    <div className='flex flex-row items-center justify-center gap-5 p-6'>
                        <div className="bg-[var(--color-primary)] rounded-full w-[64px] h-[64px] flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-105">
                            <IoLocationOutline className="text-white w-[32px] h-[32px]" />
                        </div>
                        <div>
                            <h2 className='text-base font-bold uppercase'>Địa Chỉ</h2>
                            <p className='text-gray-400 text-xl'>Hà Nội, Việt Nam</p>
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
                            Liên hệ
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
        name: "Bác Sĩ Nguyễn Văn A",
        image: doctor1,
        department: "Tim Mạch",
        description: "Bác sĩ Nguyễn Văn A là chuyên gia tim mạch hàng đầu tại bệnh viện, chuyên về bệnh lý tim và can thiệp tim mạch.",
    },
    {
        name: "Bác Sĩ Lê Văn B",
        image: doctor2,
        department: "Thần Kinh",
        description: "Bác sĩ Lê Văn B là nhà thần kinh học hàng đầu, nổi tiếng với chuyên môn điều trị các rối loạn thần kinh phức tạp.",
    },
    {
        name: "Bác Sĩ Trần Thị C",
        image: doctor3,
        department: "Nhi Khoa",
        description: "Bác sĩ Trần Thị C là bác sĩ nhi khoa giỏi nhất, tận tâm cung cấp dịch vụ chăm sóc sức khỏe tuyệt vời cho trẻ em.",
    },
];


const DoctorSection = () => {
    return (
        <section id='doctors' className="bg-gray-100 py-20">
            <div className='container mx-auto px-4'>
                <div className='flex flex-col items-center justify-center pb-10'>
                    <h1 className='text-4xl font-bold uppercase mb-3'>Chuyên Gia Hàng Đầu Của Chúng Tôi</h1>
                    <p className='text-base text-gray-400'>Bác sĩ với kỹ năng và kỹ thuật hàng đầu tại miền Bắc Việt Nam</p>
                    <div className='flex flex-row items-center justify-center gap-5 p-6'>
                        <Button
                            onClick={() => window.location.href = '/patient/'}
                            type="primary"
                            size="large"
                            icon={<AiOutlineSchedule />}
                            iconPosition="start"
                            className="!bg-gradient-to-r from-[#1DA1F2] to-[#0066CC] border-none text-white
                                !font-bold uppercase hover:opacity-60"
                        >
                            Đặt lịch hẹn
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