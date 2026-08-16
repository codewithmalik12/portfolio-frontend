import React from 'react';

const About = () => {
  return (
    <section id="about" className="section-padding border-y border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)]/30">
      <div className="container mx-auto px-6 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          <div className="w-full lg:w-1/3" data-aos="fade-up">
            <div className="sticky top-32">

              <div className="w-90 h-100 rounded-2xl overflow-hidden border-2 border-[#10b981]  bg-[var(--color-bg-base)] hidden lg:block">
                <img
                  src="abdullah-about.jpg"
                  alt=""
                  className="w-full h-full object-cover  p-2"
                />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/3 space-y-8" data-aos="fade-up" data-aos-delay="200">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-8">
              About <span className="text-emerald-500">Me</span>
            </h2>
            <p className="text-[var(--color-text-secondary)] text-xl leading-relaxed">

              I am a dedicated web developer with a passion for transforming ideas into scalable, efficient, and beautifully designed digital products. My journey into coding started with a curiosity for how things work on the web, which quickly evolved into a full-time pursuit of mastering the MERN stack.
            </p>

            <p className="text-[var(--color-text-secondary)] text-xl leading-relaxed">
              I specialize in building responsive front-end interfaces with React and Tailwind CSS, while also engineering robust back-end systems using Node.js, Express, and MongoDB. I pride myself on writing clean, maintainable code and continuously learning new paradigms.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[var(--color-border-subtle)] mt-8">
              <div>
                <h4 className="text-4xl font-bold text-white mb-2">2+</h4>
                <p className="text-[var(--color-text-secondary)]">Years Experience</p>
              </div>
              <div>
                <h4 className="text-4xl font-bold text-white mb-2">08+</h4>
                <p className="text-[var(--color-text-secondary)]">Projects Completed</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
