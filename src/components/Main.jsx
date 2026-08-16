import React from 'react';

const Main = () => {
  return (
    <section id="home" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 flex flex-col-reverse md:flex-row items-center justify-between gap-12">

        {/* Left Side: Text Content */}
        <div className="flex-1 text-center md:text-left z-10" data-aos="fade-right">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent-light)] text-emerald-400 font-medium text-sm mb-6 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Available for work
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white">
            Hi, I'm <span className="text-emerald-500">Abdullah</span>
            <br />
            Full-Stack Developer.
          </h1>

          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed">
            I build fast, responsive websites for businesses using the MERN stack. I speclialize in clean code, modern desgin, and mobile-friendly websites that help you stand out online.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <a
              href="#contact"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all"
            >
              Contact Me
            </a>
            <a
              href="#about"
              className="w-full sm:w-auto px-8 py-4 bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-surface-hover)] border border-[var(--color-border-subtle)] text-white rounded-xl font-semibold transition-all"
            >
              Read More
            </a>
          </div>
        </div>

        {/* Right Side: Profile Picture Space */}
        <div className="flex-1 flex justify-center md:justify-end w-full max-w-md md:max-w-none z-10" data-aos="fade-left" data-aos-delay="200">
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full p-2 border-2 border-dashed border-[var(--color-border-subtle)] flex items-center justify-center">
            {/* Spinning/pulsing decoration ring */}
            <div className="absolute inset-0 border-2 border-[#10b981] rounded-full animate-[spin_10s_linear_infinite]"></div>

            <div className="w-full h-full rounded-full overflow-hidden bg-[var(--color-bg-surface)] flex items-center justify-center relative">

              <img src="abdullah.jpg" alt="Abdullah" className="w-full h-full object-cover object-top" />


            </div>
          </div>
        </div>

      </div>

      {/* Background Subtle Gradient */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
    </section>
  );
};

export default Main;
