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
        <section id='hero' className="relative h-screen overflow-hidden">
            {/* Background Image */}
            <img src={BgPicture} alt="Background"
                className='absolute inset-0 w-full h-full object-cover z-0'
            />
            {/* Overlay để text dễ đọc hơn trên mobile */}
            <div className="absolute inset-0 bg-black/30 z-[1]"></div>

            <div className="container mx-auto h-full flex items-center justify-center text-white relative z-10 px-4">
                <div className="flex flex-col justify-center items-center text-center gap-4 md:gap-6 w-full">
                    <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl italic font-[Times_New_Roman] font-semibold leading-tight">
                        Chào Mừng Đến Với Phòng Khám Của Chúng Tôi!
                    </h2>

                    {/* Responsive Text cho tiêu đề chính */}
                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-bold leading-none tracking-tighter">
                        RẤT VUI KHI <br className="sm:hidden" /> GẶP BẠN
                    </h1>

                    <a className="mt-4 px-8 py-4 bg-[var(--color-primary)] rounded-xl border-none text-white font-bold 
                        text-lg sm:text-xl md:text-3xl hover:bg-white hover:text-[var(--color-secondary)] transition duration-300 ease-in-out shadow-lg"
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
    // Dữ liệu để map cho gọn code và dễ quản lý
    const departments = [
        { id: 'Emergency', icon: LiaDnaSolid, line1: 'Khoa', line2: 'Da Liễu' },
        { id: 'Pediatric', icon: LuBaby, line1: 'Khoa', line2: 'Nhi Khoa' },
        { id: 'Gynecology', icon: IoEarOutline, line1: 'Khoa', line2: 'Tai Mũi Họng' },
        { id: 'Cardiology', icon: GiHeartOrgan, line1: 'Khoa', line2: 'Tim Mạch' },
        { id: 'Neurology', icon: FaSyringe, line1: 'Khoa', line2: 'Sản Phụ' },
        { id: 'Psychiatry', icon: GiBrain, line1: 'Khoa', line2: 'Nội Tổng Quát' },
    ];

    return (
        <section id='department' className="bg-white py-12 md:py-20">
            <div className='container mx-auto px-4'>
                <div className='flex flex-col items-center justify-center mb-10'>
                    <h1 className='text-3xl md:text-4xl font-bold uppercase text-center'>
                        Chuyên Khoa
                    </h1>
                    <div className="w-20 h-1 bg-[var(--color-primary)] mt-2"></div>
                </div>

                {/* Grid Responsive: 1 cột cho mobile nhỏ, 2 cột cho mobile lớn, 3 cột cho tablet, 6 cột cho desktop */}
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6'>
                    {departments.map((dept, index) => (
                        <Card
                            key={index}
                            className="shadow-md transition-all duration-300 ease-in-out hover:bg-[var(--color-primary)] group hover:scale-105 hover:-translate-y-2 cursor-pointer border-gray-100"
                            bodyStyle={{ padding: '24px 12px' }}
                        >
                            <a className='flex flex-col items-center justify-center' href={`/doctors#${dept.id}`}>
                                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-3 bg-gray-50 rounded-full group-hover:bg-white transition-colors duration-300">
                                    <dept.icon className="w-10 h-10 md:w-12 md:h-12 text-[var(--color-primary)] transition-colors duration-300" />
                                </div>
                                <div className="text-center">
                                    <p className='text-sm md:text-lg font-bold uppercase text-[var(--color-primary)] group-hover:text-white transition-colors duration-300 leading-tight'>
                                        {dept.line1}
                                    </p>
                                    <p className='text-sm md:text-lg font-bold uppercase text-[var(--color-primary)] group-hover:text-white transition-colors duration-300 leading-tight'>
                                        {dept.line2}
                                    </p>
                                </div>
                            </a>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

const AboutSection = () => {
    return (
        <section id='about' className='bg-white py-10 md:py-0'>
            <div className='container mx-auto px-4'>
                {/* Thay đổi: thêm flex-col cho mobile và md:flex-row để giữ desktop */}
                <div className='flex flex-col md:flex-row items-center'>

                    {/* Cột hình ảnh: full width trên mobile, 1/2 trên desktop */}
                    <div className='w-full md:w-1/2 p-5 md:p-10'>
                        <div className='image object-center text-center flex items-center justify-center'>
                            {/* Responsive image: giảm chiều cao trên mobile */}
                            <img
                                src={contactBg}
                                alt="ContactBg"
                                className='h-[300px] md:h-[480px] w-auto object-contain'
                            />
                        </div>
                    </div>

                    {/* Cột nội dung: full width trên mobile, 1/2 trên desktop */}
                    <div className="w-full md:w-1/2 p-5">
                        <div className="text text-center md:text-left"> {/* Căn giữa chữ trên mobile */}
                            <span className="text-gray-500 border-b-2 border-[var(--color-primary)] uppercase text-sm md:text-base">
                                Về chúng tôi
                            </span>
                            <h2 className="my-4 font-bold text-2xl md:text-4xl leading-tight">
                                Về <span className="text-[var(--color-primary)]">Đội Ngũ Của Chúng Tôi</span>
                            </h2>
                            <p className="text-gray-400 text-lg md:text-xl mb-3 flex items-start justify-center md:justify-start">
                                <FaArrowRight className='mr-2 mt-1 flex-shrink-0' />
                                <span>ProHealth là một đội ngũ chuyên gia y tế giàu kinh nghiệm</span>
                            </p>
                            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                                Tận tâm cung cấp các dịch vụ chăm sóc sức khỏe chất lượng hàng đầu. Chúng tôi tin vào phương pháp chăm sóc sức khỏe toàn diện, tập trung vào điều trị toàn bộ con người, không chỉ là bệnh tật hay triệu chứng.
                            </p>
                            <div className='flex items-center justify-center md:justify-start gap-2 mt-6 !text-[var(--color-primary)] hover:!text-[var(--color-secondary)] transition-colors'>
                                <Link className='!text-base font-semibold' href="/about">Tìm hiểu thêm về chúng tôi </Link>
                                <FaArrowRight className='text-xs' />
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
        <section id='appointment' className="bg-gray-100 py-12 md:py-20">
            <div className='container mx-auto px-4'>
                <div className='flex flex-col items-center justify-center text-center mb-8'>
                    {/* Giảm size chữ tiêu đề trên mobile */}
                    <h1 className='text-2xl md:text-4xl font-bold uppercase tracking-wide'>
                        Liên Hệ Với Chúng Tôi
                    </h1>
                </div>

                {/* Thay đổi: mặc định 1 cột, lên tablet 2 cột, desktop 4 cột */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5'>

                    {/* Item: Hotline */}
                    <div className='flex flex-row items-center justify-start md:justify-center gap-5 p-4 bg-white md:bg-transparent rounded-lg shadow-sm md:shadow-none'>
                        <div className="bg-[var(--color-primary)] rounded-full w-[50px] h-[50px] md:w-[64px] md:h-[64px] flex-shrink-0 flex items-center justify-center transition-all duration-300 hover:scale-105">
                            <FiPhone className="text-white w-[24px] h-[24px] md:w-[32px] md:h-[32px]" />
                        </div>
                        <div>
                            <h2 className='text-xs md:text-base font-bold uppercase text-gray-700'>Đường Dây Nóng</h2>
                            <p className='text-[var(--color-primary)] md:text-gray-400 text-lg md:text-xl font-semibold'>1900-0091</p>
                        </div>
                    </div>

                    {/* Item: Ambulance */}
                    <div className='flex flex-row items-center justify-start md:justify-center gap-5 p-4 bg-white md:bg-transparent rounded-lg shadow-sm md:shadow-none'>
                        <div className="bg-[var(--color-primary)] rounded-full w-[50px] h-[50px] md:w-[64px] md:h-[64px] flex-shrink-0 flex items-center justify-center transition-all duration-300 hover:scale-105">
                            <LuAmbulance className="text-white w-[24px] h-[24px] md:w-[32px] md:h-[32px]" />
                        </div>
                        <div>
                            <h2 className='text-xs md:text-base font-bold uppercase text-gray-700'>Xe Cấp Cứu</h2>
                            <p className='text-[var(--color-primary)] md:text-gray-400 text-lg md:text-xl font-semibold'>876-256-876</p>
                        </div>
                    </div>

                    {/* Item: Location */}
                    <div className='flex flex-row items-center justify-start md:justify-center gap-5 p-4 bg-white md:bg-transparent rounded-lg shadow-sm md:shadow-none'>
                        <div className="bg-[var(--color-primary)] rounded-full w-[50px] h-[50px] md:w-[64px] md:h-[64px] flex-shrink-0 flex items-center justify-center transition-all duration-300 hover:scale-105">
                            <IoLocationOutline className="text-white w-[24px] h-[24px] md:w-[32px] md:h-[32px]" />
                        </div>
                        <div>
                            <h2 className='text-xs md:text-base font-bold uppercase text-gray-700'>Địa Chỉ</h2>
                            <p className='text-[var(--color-primary)] md:text-gray-400 text-lg md:text-xl font-semibold'>Hà Nội, Việt Nam</p>
                        </div>
                    </div>

                    {/* Button: Contact */}
                    <div className='flex items-center justify-center p-6'>
                        <Button
                            type="primary"
                            size="large"
                            icon={<FaArrowRight />}
                            iconPosition="end"
                            className="w-full md:w-auto !h-[50px] md:!h-auto !bg-gradient-to-r from-[#1DA1F2] to-[#0066CC] border-none text-white
                                !font-bold uppercase hover:shadow-lg transition-all !p-2"
                            onClick={() => window.location.href = '/contact'}
                        >
                            Liên hệ ngay
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
        <section id='doctors' className="bg-gray-100 py-12 md:py-20">
            <div className='container mx-auto px-4'>
                {/* Phần Header: Căn giữa trên mọi thiết bị, thu nhỏ text trên mobile */}
                <div className='flex flex-col items-center justify-center pb-6 md:pb-10 text-center'>
                    <h1 className='text-2xl md:text-4xl font-bold uppercase mb-3 leading-tight'>
                        Chuyên Gia Hàng Đầu Của Chúng Tôi
                    </h1>
                    <p className='text-sm md:text-base text-gray-400 px-4'>
                        Bác sĩ với kỹ năng và kỹ thuật hàng đầu tại miền Bắc Việt Nam
                    </p>
                    <div className='flex flex-row items-center justify-center gap-5 p-6'>
                        <Button
                            onClick={() => window.location.href = '/patient/'}
                            type="primary"
                            size="large"
                            icon={<AiOutlineSchedule />}
                            iconPosition="start"
                            className="!bg-gradient-to-r from-[#1DA1F2] to-[#0066CC] border-none text-white
                                !font-bold uppercase hover:opacity-80 transition-opacity"
                        >
                            Đặt lịch hẹn
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-4 md:mt-10">
                    {doctors.map((doctor, idx) => (
                        <div
                            key={idx}
                            className={`bg-white rounded-xl shadow-lg overflow-hidden flex flex-col 
                                h-auto md:h-[550px] transition-all duration-300 hover:shadow-2xl
                                /* Desktop: Giữ nguyên hiệu ứng so le */
                                ${idx === 1 ? 'md:-mt-8' : 'md:mt-8'} 
                                /* Mobile: Loại bỏ lề âm/dương để card thẳng hàng */
                                mt-0`}
                        >
                            {/* Phần ảnh: Fix chiều cao cố định để card đồng đều */}
                            <div className="relative w-full aspect-[4/5] md:h-2/3 md:aspect-auto bg-blue-50 overflow-hidden flex items-end justify-center">
                                <img
                                    src={doctor.image || "https://via.placeholder.com/200x250?text=Doctor+Photo"}
                                    alt={doctor.name}
                                    className="absolute inset-0 w-full h-full object-contain md:object-contain transition-transform duration-500 hover:scale-105"

                                />
                            </div>

                            {/* Phần thông tin: Padding linh hoạt */}
                            <div className="flex-1 p-5 md:p-6 flex flex-col items-center justify-between text-center">
                                <div>
                                    <h3 className="text-xl font-bold mb-1 text-gray-800">{doctor.name}</h3>
                                    <p className="text-[var(--color-primary)] font-semibold mb-2">{doctor.department}</p>
                                    <p className="text-gray-500 text-sm line-clamp-3 md:line-clamp-none">
                                        {doctor.description}
                                    </p>
                                </div>

                                {/* Social Icons */}
                                <div className="flex items-center text-white gap-4 mt-5">
                                    <a href="#" aria-label="Facebook" className="p-2.5 rounded-full bg-[var(--color-primary)] hover:bg-slate-800 transition-all transform hover:-translate-y-1">
                                        <FaFacebook />
                                    </a>
                                    <a href="#" aria-label="Instagram" className="p-2.5 rounded-full bg-[var(--color-primary)] hover:bg-slate-800 transition-all transform hover:-translate-y-1">
                                        <FaInstagram />
                                    </a>
                                    <a href="#" aria-label="Twitter" className="p-2.5 rounded-full bg-[var(--color-primary)] hover:bg-slate-800 transition-all transform hover:-translate-y-1">
                                        <FaTwitter />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
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