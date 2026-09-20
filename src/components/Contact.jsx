import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('https://https://portfolio-backend-malik.bonto.run/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to submit message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000); // Clear success message after 5s
    } catch (err) {
      console.error('Contact submission error:', err);
      setErrorMsg(err.message || 'Failed to send message. Please try again.');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section-padding bg-[var(--color-bg-surface)]/30 border-t border-[var(--color-border-subtle)]">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-16">

          <div className="flex-1" data-aos="fade-right">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
              Let's build something <span className="text-emerald-500">together</span>.
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg mb-8">
              Whether you have a question, a project idea, or just want to connect, my inbox is always open. I'll try my best to get back to you!
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-[var(--color-text-secondary)]">
                <div className="w-12 h-12 rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] flex items-center justify-center text-emerald-500 shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <a href="mailto:spmalakabdullah123@gmail.com" className="hover:text-emerald-500 transition-colors">spmalakabdullah123@gmail.com</a>
              </div>
              <div className="flex items-center gap-4 text-[var(--color-text-secondary)]">
                <div className="w-12 h-12 rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] flex items-center justify-center text-emerald-500 shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <a href="https://wa.me/923465267473?text=Hi%20Abdullah!%20I%20saw%20your%20portfolio.%20Are%20you%20available%20for%20work?" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors">+92 346 5267473</a>
              </div>
            </div>
          </div>

          <div className="flex-1 card p-8 md:p-10" data-aos="fade-left" data-aos-delay="200">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {status === 'success' && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-lg text-sm flex items-center gap-2">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Message saved and sent successfully! I will get back to you soon.
                </div>
              )}

              {status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg text-sm flex items-center gap-2">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {errorMsg}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-primary)]">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors animate-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-primary)]">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors animate-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--color-text-primary)]">Message</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white rounded-lg font-semibold transition-all flex items-center justify-center"
              >
                {status === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
