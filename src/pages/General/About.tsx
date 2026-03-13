import { Card, Carousel } from 'antd';
import { FaArrowRight, FaClinicMedical, FaGlobe, } from 'react-icons/fa';
import Link from 'antd/es/typography/Link';
import Footer from '../../components/General/Footer';
import NavbarDark from '../../components/General/NavbarDark';


const AboutSection = () => {
    return (
        <section id='about-prohealth' className='bg-gray-100 py-16 md:py-24'>
            <div className='container mx-auto px-4 lg:px-8'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-0 border border-gray-100 shadow-2xl rounded-3xl overflow-hidden'>

                    {/* Phần 1: Về chúng tôi */}
                    <div className='p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white border-b lg:border-b-0 lg:border-r border-gray-100'>
                        <div className='flex items-center gap-3 mb-6'>
                            <div className='p-3 bg-blue-50 rounded-lg'>
                                <FaClinicMedical className='text-[var(--color-primary)] text-2xl' />
                            </div>
                            <span className="text-sm font-bold tracking-widest text-[var(--color-primary)] uppercase">
                                Về chúng tôi
                            </span>
                        </div>

                        <h2 className="mb-6 font-bold text-3xl md:text-4xl leading-tight text-gray-900">
                            Phòng Khám <span className="text-[var(--color-primary)]">ProHealth</span>
                        </h2>

                        <div className='space-y-4 text-gray-600 text-base md:text-lg leading-relaxed'>
                            <p className="font-medium text-gray-800">
                                Nhà cung cấp dịch vụ chăm sóc sức khỏe hàng đầu tại Hà Nội từ năm 2010.
                            </p>
                            <p>
                                Chúng tôi chuyên sâu trong nhiều chuyên khoa bao gồm
                                <span className='text-gray-900 font-semibold'> Cấp Cứu, Nhi Khoa, Tim Mạch và Thần Kinh</span>.
                                Hệ thống trang thiết bị hiện đại đảm bảo kết quả chính xác nhất.
                            </p>
                            <p>
                                Sứ mệnh của ProHealth là mang lại sự an tâm và sức khỏe toàn diện cho bệnh nhân thông qua giáo dục và điều trị cá nhân hóa.
                            </p>
                        </div>

                        <Link
                            href='/contact'
                            className='group mt-10 flex items-center gap-2 text-base font-bold text-[var(--color-primary)] hover:underline'
                        >
                            Liên hệ tư vấn chi tiết
                            <FaArrowRight className='group-hover:translate-x-2 transition-transform' />
                        </Link>
                    </div>

                    {/* Phần 2: Phạm vi toàn cầu */}
                    <div className='p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-slate-50/50'>
                        <div className='flex items-center gap-3 mb-6'>
                            <div className='p-3 bg-blue-50 rounded-lg'>
                                <FaGlobe className='text-[var(--color-primary)] text-2xl' />
                            </div>
                            <span className="text-sm font-bold tracking-widest text-[var(--color-primary)] uppercase">
                                Phạm vi Toàn cầu
                            </span>
                        </div>

                        <h2 className="mb-6 font-bold text-3xl md:text-4xl leading-tight text-gray-900">
                            Sự Hiện Diện <span className="text-[var(--color-primary)]">Quốc Tế</span>
                        </h2>

                        <div className='space-y-4 text-gray-600 text-base md:text-lg leading-relaxed'>
                            <p>
                                Hợp tác chiến lược với các bệnh viện hàng đầu tại <strong>Mỹ, Châu Âu và Châu Á</strong> để cập nhật công nghệ y tế tiên tiến nhất toàn cầu.
                            </p>

                            <div className='flex flex-wrap gap-2 py-3'>
                                <span className='px-3 py-1 bg-white border border-blue-100 text-[var(--color-primary)] rounded-md text-sm font-medium shadow-sm italic'>
                                    #Chứng nhận JCI
                                </span>
                                <span className='px-3 py-1 bg-white border border-blue-100 text-[var(--color-primary)] rounded-md text-sm font-medium shadow-sm italic'>
                                    #Y học từ xa
                                </span>
                            </div>

                            <p>
                                Chúng tôi kết nối bạn với mạng lưới chuyên gia quốc tế thông qua dịch vụ Telemedicine, đảm bảo tiếp cận chuyên môn đa dạng mọi lúc.
                            </p>
                        </div>

                        <Link
                            href='/global-partners'
                            className='group mt-10 flex items-center gap-2 text-base font-bold text-[var(--color-primary)] hover:underline'
                        >
                            Xem mạng lưới đối tác quốc tế
                            <FaArrowRight className='group-hover:translate-x-2 transition-transform' />
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};


const MissionVision = () => {
    return (
        <section id='mission-vision' className="bg-gray-100 py-20">
            <div className='container mx-auto px-4'>
                <div className='flex flex-col items-center justify-center mb-10'>
                    <h1 className='text-4xl font-bold uppercase'>Sứ Mệnh & Tầm Nhìn Của Chúng Tôi</h1>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <Card className="shadow-md p-6">
                        <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
                            Sứ Mệnh
                        </h3>
                        <p className="text-gray-600">
                            Cung cấp các dịch vụ chăm sóc sức khỏe dễ tiếp cận, chất lượng cao, giúp
                            các cá nhân và cộng đồng sống khỏe mạnh hơn thông qua đổi mới,
                            lòng nhân ái và sự xuất sắc.
                        </p>
                    </Card>
                    <Card className="shadow-md p-6">
                        <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
                            Tầm Nhìn
                        </h3>
                        <p className="text-gray-600">
                            Trở thành điểm đến chăm sóc sức khỏe hàng đầu tại Việt Nam, thiết lập các tiêu chuẩn mới
                            trong chăm sóc bệnh nhân, nghiên cứu y học và các sáng kiến sức khỏe
                            cộng đồng.
                        </p>
                    </Card>
                </div>
            </div>
        </section>
    );
};

const patients = [
    {
        name: 'Anna Lee',
        image: 'https://randomuser.me/api/portraits/women/1.jpg',
        feedback: 'Sự chăm sóc tại ProHealth là đặc biệt. Đội ngũ nhân viên rất nhân ái và chuyên nghiệp trong suốt quá trình điều trị của tôi.'
    },
    {
        name: 'Michael Chen',
        image: 'https://randomuser.me/api/portraits/men/2.jpg',
        feedback: 'Nhờ đội ngũ tại ProHealth, tôi đã hồi phục nhanh chóng sau cơn bệnh. Rất khuyến nghị!'
    },
    {
        name: 'Sophia Nguyen',
        image: 'https://randomuser.me/api/portraits/women/3.jpg',
        feedback: 'Dịch vụ nhi khoa tốt nhất cho con tôi. Các bác sĩ rất am hiểu và rất kiên nhẫn.'
    },
    {
        name: 'David Kim',
        image: 'https://randomuser.me/api/portraits/men/4.jpg',
        feedback: 'Dịch vụ chuyên nghiệp và cơ sở vật chất hiện đại. Rất biết ơn chuyên môn của họ trong lĩnh vực tim mạch.'
    },
    {
        name: 'Emma Tran',
        image: 'https://randomuser.me/api/portraits/women/5.jpg',
        feedback: 'Khoa thần kinh xuất sắc. Họ đã giúp tôi quản lý tình trạng bệnh một cách hiệu quả.'
    },
    {
        name: 'James Wong',
        image: 'https://randomuser.me/api/portraits/men/6.jpg',
        feedback: 'Chăm sóc tận tâm và kế hoạch điều trị cá nhân hóa. ProHealth là tốt nhất ở Hà Nội.'
    }
];

const chunk = <T,>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};

const PatientFeedback = () => {
    return (
        <section id='patient-feedback' className='bg-gray-100 py-20'>
            <div className='container mx-auto px-4'>
                <div className='flex flex-col items-center justify-center mb-6'>
                    <h1 className='text-4xl font-bold uppercase'>Phản Hồi Từ Bệnh Nhân</h1>
                    <p className='text-base text-gray-400 mt-3'>Những gì bệnh nhân của chúng tôi nói về chúng tôi</p>
                </div>
                <Carousel autoplay arrows infinite={true}>
                    {chunk(patients, 2).map((pair, index) => (
                        <div key={index}>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 p-5'>
                                {pair.map((patient: {
                                    name: string;
                                    image: string;
                                    feedback: string;
                                }, idx: number) => (
                                    <div key={idx} className='bg-blue-50 rounded-3xl p-4 flex 
                                    items-center gap-4 shadow-md'>
                                        <img src={patient.image} alt={patient.name}
                                            className='w-16 h-16 rounded-full object-cover' />
                                        <div>
                                            <h3 className='font-bold text-lg text-gray-800'>
                                                {patient.name}
                                            </h3>
                                            <p className='text-gray-600'>{patient.feedback}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>
        </section>
    );
};

const About = () => {
    return (
        <div>
            <NavbarDark />
            <AboutSection />
            <MissionVision />
            <PatientFeedback />
            <Footer />
        </div>
    );
};

export default About;