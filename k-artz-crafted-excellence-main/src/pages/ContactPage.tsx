import React, { useState } from 'react';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    service: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted', formState);
    // Add your submission logic here
  };

  return (
    <div className="min-h-screen bg-[#050810] text-white font-sans selection:bg-yellow-500 selection:text-black overflow-hidden relative">
      
      {/* --- Ambient Background Glows --- */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* --- Navbar Placeholder (For Visual Continuity) --- */}
      

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-16 relative z-10">
        
        {/* --- Header Section --- */}
        <div className="mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-700 bg-gray-900/50 backdrop-blur-sm text-xs text-gray-300 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
            GET IN TOUCH
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Let’s Build Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Vision Together.</span>
          </h1>
          
          <div className="flex items-start">
            <div className="w-1 h-12 bg-yellow-500 mr-6 rounded-full"></div>
            <p className="text-gray-400 text-lg max-w-2xl italic pt-2">
              "From modern acrylic plates to bespoke signage, we are ready to craft the designs that make people remember you."
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* --- Left Column: Contact Info Cards --- */}
          <div className="space-y-8">
            <p className="text-gray-500 uppercase tracking-widest text-sm font-semibold mb-4">Contact Details</p>
            
            {/* Phone Card */}
            <div className="group flex items-center gap-6 p-6 rounded-2xl bg-[#0e1422] border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(234,179,8,0.15)]">
                <div className="w-14 h-14 flex items-center justify-center bg-gray-800/50 rounded-full text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                    <Phone size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">Call Us</h3>
                    <a href="tel:+919876543210" className="text-gray-400 hover:text-yellow-400 transition-colors block mt-1">+91 9822110512</a>
                </div>
            </div>

            {/* Email Card */}
            <div className="group flex items-center gap-6 p-6 rounded-2xl bg-[#0e1422] border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(234,179,8,0.15)]">
                <div className="w-14 h-14 flex items-center justify-center bg-gray-800/50 rounded-full text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                    <Mail size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">Email Us</h3>
                    <a href="mailto:hello@kartz.com" className="text-gray-400 hover:text-yellow-400 transition-colors block mt-1">k.arts.signs@gmail.com</a>
                </div>
            </div>

            {/* Address Card */}
            <div className="group flex items-center gap-6 p-6 rounded-2xl bg-[#0e1422] border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(234,179,8,0.15)]">
                <div className="w-14 h-14 flex items-center justify-center bg-gray-800/50 rounded-full text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                    <MapPin size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">Pune, Maharashtra</h3>
                   
                </div>
            </div>
          </div>

          {/* --- Right Column: The Form --- */}
          <div className="relative">
            {/* Subtle glow behind the form */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-3xl blur-2xl opacity-50"></div>
            
            <form onSubmit={handleSubmit} className="relative bg-[#0b101b] border border-gray-800 p-8 md:p-10 rounded-3xl shadow-2xl space-y-6">
                
                <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Your Name</label>
                        <input 
                            type="text" 
                            name="name"
                            placeholder="your name" 
                            className="w-full bg-[#161b2c] border border-gray-700 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                        <input 
                            type="email" 
                            name="email"
                            placeholder="you@gmail.com" 
                            className="w-full bg-[#161b2c] border border-gray-700 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Service Interest</label>
                    <div className="relative">
                        <select 
                            name="service"
                            className="w-full bg-[#161b2c] border border-gray-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all appearance-none cursor-pointer"
                            onChange={handleChange}
                            defaultValue=""
                        >
                            <option value="" disabled>Select a service type...</option>
                            <option value="signage">Architectural Signage</option>
                            <option value="plates">Acrylic Name Plates</option>
                            <option value="branding">Corporate Branding</option>
                            <option value="custom">Custom Fabrication</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Project Details</label>
                    <textarea 
                        name="message"
                        rows={4} 
                        placeholder="Tell us about your requirements..." 
                        className="w-full bg-[#161b2c] border border-gray-700 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all resize-none"
                        onChange={handleChange}
                    ></textarea>
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-white text-black font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:bg-yellow-500 transition-all duration-300 transform active:scale-[0.98] group"
                >
                    Submit Request
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ContactPage;

