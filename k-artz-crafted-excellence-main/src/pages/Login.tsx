import React from "react";
import LoginCard from "../components/Login/LoginCard";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-amber-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="container max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side - Login Form */}
        <div className="flex flex-col justify-center items-center lg:items-start w-full">
          <div className="mb-8 flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-white">
              K<span className="text-amber-400">'</span>artz
            </span>
          </div>
          <LoginCard />
        </div>

        {/* Right Side - Decorative (Matching screenshot vibe) */}
        <div className="hidden lg:block relative h-[600px] w-full bg-slate-800/30 rounded-[2.5rem] border border-slate-700/50 overflow-hidden shadow-2xl group">
            {/* Mocking the 'Urban Coffee' card from screenshot using CSS gradients/text */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-slate-900/80"></div>
            
            {/* Abstract cloud/nature representation */}
            <div className="absolute top-0 right-0 w-full h-2/3 bg-gradient-to-b from-pink-300/20 to-transparent blur-3xl opacity-60"></div>
            
            <div className="absolute bottom-12 left-12 right-12 z-20">
                <span className="text-amber-400 text-xs font-bold tracking-wider uppercase mb-2 block">Our Craft</span>
                <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                    Designs that make people remember you.
                </h2>
                <div className="h-1 w-24 bg-amber-500 rounded-full mt-6"></div>
            </div>

            {/* Subtle Texture overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        </div>
      </div>
    </div>
  );
}