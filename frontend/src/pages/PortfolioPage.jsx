import { useState } from 'react';
import PublicFooter from '../components/portfolio/PublicFooter.jsx';
import PublicNavbar from '../components/portfolio/PublicNavbar.jsx';
import api from '../services/api.js';

const services = [
  {
    title: 'Laptop Repair',
    description: 'Fast diagnostics, component replacement, and complete device recovery for personal and business laptops.'
  },
  {
    title: 'Software Installation',
    description: 'Operating system setup, driver installation, licensed applications, and full machine optimization.'
  },
  {
    title: 'Hardware Fixing',
    description: 'Motherboard work, memory upgrades, screen replacement, fan issues, battery service, and storage repair.'
  },
  {
    title: 'IT Support',
    description: 'Reliable technical support for homes, offices, and institutions that need dependable assistance.'
  }
];

function PortfolioPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback('');

    try {
      const { data } = await api.post('/public/contact', form);
      setFeedback(data.message);
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Unable to send your message right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="public-shell">
      <PublicNavbar />

      <section className="hero section" id="home">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Modern repair lab and support partner</p>
            <h1>NEW OPTION TECHNOLOGY</h1>
            <p className="hero-text">
              Professional laptop repair, software installation, hardware fixing, and responsive IT
              support built around quality service and trusted technical care.
            </p>

            <div className="hero-actions">
              <a className="button" href="#contact">
                Get Service
              </a>
              <a className="button button-secondary" href="#about">
                Meet the Technician
              </a>
            </div>

            <div className="hero-stats">
              <div className="glass-card">
                <strong>4 Core Services</strong>
                <span>Laptop, software, hardware, and support</span>
              </div>
              <div className="glass-card">
                <strong>Secure Staff Portal</strong>
                <span>Private repair tracking and analytics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Services</p>
            <h2>Technology support with practical, repair-first expertise</h2>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card glass-card" key={service.title}>
                <div className="service-icon">{service.title.slice(0, 1)}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>

          <div className="work-gallery">
            <figure>
              <img alt="Laptop repair workbench" src="/assets/repair-workshop.jpg" />
              <figcaption>Diagnostics bench</figcaption>
            </figure>
            <figure>
              <img alt="Laptop software and component repair" src="/assets/login-background.jpg" />
              <figcaption>Component service</figcaption>
            </figure>
            <figure>
              <img alt="Laptop memory upgrade" src="/assets/memory-upgrade.jpg" />
              <figcaption>Hardware upgrades</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="container about-grid">
          <div className="about-copy">
            <p className="eyebrow">About</p>
            <h2>Built for reliable public service and disciplined internal operations</h2>
            <p>
              NEW OPTION TECHNOLOGY combines customer-facing professionalism with a private repair
              management system for handling diagnostics, assignments, status tracking, and revenue
              reporting in one place.
            </p>
            <p>
              The goal is simple: visitors can discover the business publicly, while authorized staff
              can securely manage repairs, customers, technicians, and reports behind login.
            </p>
          </div>

          <article className="profile-card glass-card">
            <img alt="APHRODIS NIYONZIMA" className="profile-photo" src="/assets/aphrodis-niyonzima.jpeg" />
            <div className="profile-copy">
              <p className="eyebrow">Lead Technician Profile</p>
              <h3>APHRODIS NIYONZIMA</h3>
              <p>
                Specialist in laptop diagnostics, repair workflow coordination, software setup, and
                hands-on technical support with a polished professional presence.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="container contact-grid">
          <div className="contact-copy">
            <p className="eyebrow">Contact</p>
            <h2>Start your repair request or technical support conversation</h2>

            <div className="contact-cards">
              <a className="glass-card info-card" href="tel:+250788790756">
                <strong>Phone</strong>
                <span>+250 788 790 756</span>
              </a>
              <a className="glass-card info-card" href="tel:+250780528761">
                <strong>Phone</strong>
                <span>+250 780 528 761</span>
              </a>
              <a className="glass-card info-card" href="mailto:newoptiontechnology@gmail.com">
                <strong>Email</strong>
                <span>newoptiontechnology@gmail.com</span>
              </a>
            </div>
          </div>

          <form className="glass-card contact-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" onChange={handleChange} required value={form.name} />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                onChange={handleChange}
                required
                type="email"
                value={form.email}
              />
            </div>

            <div className="input-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                onChange={handleChange}
                required
                rows="5"
                value={form.message}
              />
            </div>

            <button className="button" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {feedback ? <p className="form-note">{feedback}</p> : null}
          </form>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

export default PortfolioPage;
