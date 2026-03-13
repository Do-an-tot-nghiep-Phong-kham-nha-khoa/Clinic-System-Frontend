import { FaClock, FaEnvelope } from 'react-icons/fa';
import { FiPhone } from "react-icons/fi";
import { LuAmbulance } from "react-icons/lu";
import { IoLocationOutline } from 'react-icons/io5';
import Footer from '../../components/General/Footer';
import NavbarDark from '../../components/General/NavbarDark';

const ContactInfo = () => {
    return (
        <section id='contact-info' className="bg-white py-12 md:py-20 mt-10">
            <div className='container mx-auto px-4 lg:px-8'>
                {/* Header Section */}
                <div className='flex flex-col items-center justify-center mb-10 text-center'>
                    <h1 className='text-2xl md:text-4xl font-bold uppercase tracking-tight text-gray-900'>
                        Liên Hệ Với Chúng Tôi
                    </h1>
                    <div className='w-20 h-1 bg-[var(--color-primary)] mt-4 mb-3 md:hidden rounded-full'></div>
                    <p className='text-sm md:text-base text-gray-500 max-w-md'>
                        Liên hệ với chúng tôi nếu có bất kỳ thắc mắc hoặc đặt lịch hẹn
                    </p>
                </div>

                {/* Grid Info Cards */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
                    {[
                        { icon: <FiPhone />, title: "Đường Dây Nóng", content: "1900-0091" },
                        { icon: <LuAmbulance />, title: "Xe Cấp Cứu", content: "876-256-876" },
                        { icon: <IoLocationOutline />, title: "Địa Chỉ", content: "123 Nguyễn Trãi, Hà Nội" },
                        { icon: <FaEnvelope />, title: "Email", content: "support@prohealth.vn" }
                    ].map((item, index) => (
                        <div key={index} className='flex flex-row md:flex-col lg:flex-row items-center justify-start gap-4 md:gap-5 p-5 md:p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white'>
                            <div className="bg-[var(--color-primary)] rounded-full min-w-[50px] h-[50px] md:min-w-[64px] md:h-[64px] flex items-center justify-center shrink-0 shadow-lg shadow-blue-100">
                                <span className="text-white text-xl md:text-[32px]">{item.icon}</span>
                            </div>
                            <div className='overflow-hidden'>
                                <h2 className='text-xs md:text-base font-bold uppercase text-gray-400 md:text-gray-900 tracking-wider'>{item.title}</h2>
                                <p className='text-gray-700 text-sm md:text-xl font-semibold truncate'>{item.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Working Hours Section */}
                <div className='mt-12 md:mt-16 bg-slate-50 rounded-3xl p-8 flex flex-col items-center border border-slate-100'>
                    <div className='flex items-center gap-3 mb-6'>
                        <FaClock className='text-[var(--color-primary)] text-2xl' />
                        <h2 className='text-xl md:text-2xl font-bold text-gray-800'>Giờ Làm Việc</h2>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl'>
                        <div className='text-center p-4 bg-white rounded-xl shadow-sm'>
                            <p className='text-sm text-gray-500'>Thứ Hai - Thứ Sáu</p>
                            <p className='font-bold text-[var(--color-primary)]'>8:00 Sáng - 8:00 Tối</p>
                        </div>
                        <div className='text-center p-4 bg-white rounded-xl shadow-sm'>
                            <p className='text-sm text-gray-500'>Thứ Bảy</p>
                            <p className='font-bold text-[var(--color-primary)]'>9:00 Sáng - 5:00 Chiều</p>
                        </div>
                        <div className='text-center p-4 bg-white rounded-xl shadow-sm border-t-4 border-red-400'>
                            <p className='text-sm text-gray-500'>Chủ Nhật</p>
                            <p className='font-bold text-red-500'>Đóng cửa</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const MapSection = () => {
    return (
        <section id='map' className="bg-white pb-20">
            <div className='container mx-auto px-4 lg:px-8'>
                <div className='flex flex-col items-center justify-center mb-8 text-center'>
                    <h1 className='text-2xl md:text-4xl font-bold uppercase text-gray-900'>Tìm Chúng Tôi</h1>
                    <p className='text-sm md:text-base text-gray-400 mt-2'>Địa chỉ: 123 Nguyễn Trãi, Thanh Xuân, Hà Nội</p>
                </div>
                <div className='w-full h-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white'>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.096888041974!2d105.84116531501055!3d21.028811785994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab145bf89bf7%3A0xd7c2f79a5a1c48b4!2sHanoi%2C%20Vietnam!5e0!3m2!1sen!2sus!4v1690000000000!5m2!1sen!2sus"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        title="map"
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

const Contact = () => {
    return (
        <div>
            <NavbarDark />
            <ContactInfo />
            <MapSection />
            <Footer />
        </div>
    );
};

export default Contact;