import React from 'react';
import picAbout1 from '../../assets/pic-about-1.png'
import picAbout2 from '../../assets/pic-about-2.png';
import { Card, Carousel } from 'antd';
import { FaArrowRight, } from 'react-icons/fa';
import Link from 'antd/es/typography/Link';
import Footer from '../../components/General/Footer';
import NavbarDark from '../../components/General/NavbarDark';


const AboutContent = () => {
    return (
        <section id='about-content' className='bg-white pt-10'>
            <div className='container mx-auto px-4'>
                <div className='flex flex-col md:flex-row items-center'>
                    <div className='w-full md:w-1/2 p-5 md:p-10'>
                        <div className='image object-center text-center flex items-center 
                            justify-center'>
                            <img src={picAbout1} alt="ContactBg" className='h-[400px] md:h-[480px] 
                                object-cover rounded-lg' />
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 p-5">
                        <div className="text">
                            <span className="text-gray-500 border-b-2 border-[var(--color-primary)] 
                            uppercase">About us
                            </span>
                            <h2 className="my-4 font-bold text-3xl sm:text-4xl ">
                                About <span className="text-[var(--color-primary)]">
                                    ProHealth Clinic
                                </span>
                            </h2>
                            <p className="text-gray-700 text-lg mb-4">
                                ProHealth Clinic is a leading healthcare provider in Hanoi, Vietnam,
                                dedicated to delivering comprehensive medical services with
                                compassion and expertise.
                            </p>
                            <p className="text-gray-600 text-base mb-4">
                                Founded in 2010, our clinic has grown to become a trusted name
                                in the community, offering state-of-the-art facilities and a team of
                                highly skilled professionals. We specialize in various departments
                                including Emergency, Pediatrics, Gynecology, Cardiology, Neurology,
                                and Psychiatry.
                            </p>
                            <p className="text-gray-600 text-base mb-4">
                                Our mission is to provide holistic healthcare that addresses the
                                physical, emotional, and mental well-being of our patients.
                                We believe in preventive care, patient education, and personalized
                                treatment plans to ensure the best outcomes.
                            </p>
                            <div className='flex items-center gap-2 mt-5'>
                                <Link className='!text-base !text-[var(--color-primary)] 
                                hover:!text-[var(--color-secondary)]' href='/contact'>
                                    Contact us for more information
                                </Link>
                                <FaArrowRight className='text-xs text-[var(--color-primary)]' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const GlobalReach = () => {
    return (
        <section id='global-reach' className='bg-white py-20'>
            <div className='container mx-auto px-4'>
                <div className='flex flex-col md:flex-row items-center'>
                    <div className='w-full md:w-1/2 p-5 md:p-10 order-2 md:order-1'>
                        <div className="text">
                            <span className="text-gray-500 border-b-2 border-[var(--color-primary)]
                             uppercase">
                                Global Reach
                            </span>
                            <h2 className="my-4 font-bold text-3xl sm:text-4xl ">
                                Our <span className="text-[var(--color-primary)]">
                                    International Presence
                                </span>
                            </h2>
                            <p className="text-gray-700 text-lg mb-4">
                                ProHealth Clinic extends its expertise beyond borders,
                                partnering with international healthcare organizations to bring
                                world-class medical practices to Vietnam.
                            </p>
                            <p className="text-gray-600 text-base mb-4">
                                We collaborate with leading hospitals in the US, Europe, and Asia
                                to exchange knowledge, adopt advanced technologies, and participate
                                in global health initiatives. Our doctors regularly attend
                                international conferences and training programs to stay at the
                                forefront of medical advancements.
                            </p>
                            <p className="text-gray-600 text-base mb-4">
                                Through telemedicine services, we connect patients with specialists
                                worldwide, ensuring access to diverse expertise. ProHealth is
                                committed to global standards of care, holding accreditations from
                                international bodies like JCI.
                            </p>
                            <div className='flex items-center gap-2 mt-5'>
                                <Link className='!text-base !text-[var(--color-primary)] 
                                hover:!text-[var(--color-secondary)]'>
                                    Learn more about our global partnerships</Link>
                                <FaArrowRight className='text-xs text-[var(--color-primary)]' />
                            </div>
                        </div>
                    </div>
                    <div className='w-full md:w-1/2 p-5 md:p-10 order-1 md:order-2'>
                        <div className='image object-center text-center flex items-center 
                            justify-center'>
                            <img src={picAbout2} alt="Global Reach" className='h-[400px] md:h-[480px] 
                                object-cover rounded-lg' />
                        </div>
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
                    <h1 className='text-4xl font-bold uppercase'>Our Mission & Vision</h1>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <Card className="shadow-md p-6">
                        <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
                            Mission
                        </h3>
                        <p className="text-gray-600">
                            To deliver accessible, high-quality healthcare services that empower
                            individuals and communities to lead healthier lives through innovation,
                            compassion, and excellence.
                        </p>
                    </Card>
                    <Card className="shadow-md p-6">
                        <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
                            Vision
                        </h3>
                        <p className="text-gray-600">
                            To be the premier healthcare destination in Vietnam, setting new
                            standards in patient care, medical research, and community health
                            initiatives.
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
        feedback: 'The care at ProHealth was exceptional. The staff were compassionate and professional throughout my treatment.'
    },
    {
        name: 'Michael Chen',
        image: 'https://randomuser.me/api/portraits/men/2.jpg',
        feedback: 'Thanks to the team at ProHealth, I recovered quickly from my illness. Highly recommended!'
    },
    {
        name: 'Sophia Nguyen',
        image: 'https://randomuser.me/api/portraits/women/3.jpg',
        feedback: 'Best pediatric care for my child. The doctors are knowledgeable and very patient.'
    },
    {
        name: 'David Kim',
        image: 'https://randomuser.me/api/portraits/men/4.jpg',
        feedback: 'Professional service and state-of-the-art facilities. Grateful for their expertise in cardiology.'
    },
    {
        name: 'Emma Tran',
        image: 'https://randomuser.me/api/portraits/women/5.jpg',
        feedback: 'Excellent neurology department. They helped manage my condition effectively.'
    },
    {
        name: 'James Wong',
        image: 'https://randomuser.me/api/portraits/men/6.jpg',
        feedback: 'Compassionate care and personalized treatment plans. ProHealth is the best in Hanoi.'
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
                    <h1 className='text-4xl font-bold uppercase'>Patient Feedback</h1>
                    <p className='text-base text-gray-400 mt-3'>What our patients say about us</p>
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
            <AboutContent />
            <GlobalReach />
            <MissionVision />
            <PatientFeedback />
            <Footer />
        </div>
    );
};

export default About;