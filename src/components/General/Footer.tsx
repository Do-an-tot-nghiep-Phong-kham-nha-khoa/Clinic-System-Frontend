import React from "react";
import { FaEnvelope, FaFacebook, FaInstagram, FaPhone, FaTwitter, FaYoutube } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 ">
            <div className="container mx-auto px-4 py-10">
                {/* Trusted by brands */}
                <div className="flex flex-wrap items-center gap-3 justify-center mb-10">
                    <span className="uppercase tracking-wider text-xs text-slate-400">Trusted by</span>
                    {["MediX", "HealthOne", "BioCore", "CarePlus", "NovaLab"].map((b) => (
                        <span key={b} className="px-3 py-1 rounded-full border border-slate-700 text-sm">
                            {b}
                        </span>
                    ))}
                </div>

                {/* Main columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-white text-2xl font-bold">ProHealth</h3>
                        <p className="mt-3 text-sm">
                            Leading healthcare provider with modern facilities and a passionate team.
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                            <a aria-label="Facebook" className="p-2 rounded-full bg-slate-800 hover:bg-[#13c2c2] hover:text-white transition-colors">
                                <FaFacebook />
                            </a>
                            <a aria-label="Instagram" className="p-2 rounded-full bg-slate-800 hover:bg-[#13c2c2] hover:text-white transition-colors">
                                <FaInstagram />
                            </a>
                            <a aria-label="Twitter" className="p-2 rounded-full bg-slate-800 hover:bg-[#13c2c2] hover:text-white transition-colors">
                                <FaTwitter />
                            </a>
                            <a aria-label="YouTube" className="p-2 rounded-full bg-slate-800 hover:bg-[#13c2c2] hover:text-white transition-colors">
                                <FaYoutube />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-3 uppercase text-sm">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#hero" className="hover:text-white transition-colors">Home</a></li>
                            <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                            <li><a href="#doctor" className="hover:text-white transition-colors">Departments</a></li>
                            <li><a href="#doctors" className="hover:text-white transition-colors">Doctors</a></li>
                            <li><a href="#appointment" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Departments */}
                    <div>
                        <h4 className="text-white font-semibold mb-3 uppercase text-sm">Departments</h4>
                        <ul className="space-y-2 text-sm">
                            <li>Cardiology</li>
                            <li>Neurology</li>
                            <li>Pediatrics</li>
                            <li>Genecology</li>
                            <li>Psychiatry</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-3 uppercase text-sm">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <FaLocationDot className="mt-1 text-[var(--color-primary)]" />
                                123 Nguyen Trai, Thanh Xuan, Hanoi, Vietnam
                            </li>
                            <li className="flex items-center gap-2">
                                <FaPhone className="text-[var(--color-primary)]" /> 1900-0091
                            </li>
                            <li className="flex items-center gap-2">
                                <FaEnvelope className="text-[var(--color-primary)]" /> support@prohealth.vn
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-slate-800">
                <div className="container mx-auto px-4 py-4 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-between">
                    <span>© {new Date().getFullYear()} ProHealth. All rights reserved.</span>
                    <span className="text-slate-400">Made with care and love</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;