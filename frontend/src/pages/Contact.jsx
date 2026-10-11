import React, { useState } from 'react';
import { Mail, MapPin, Globe, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import './Pages.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    setErrorMsg('');
    setSubmitted(true);
  };

  return (
    <div className="page-wrapper">
      <section className="page-hero">
        <div className="container page-hero-content">
          <span className="badge badge-teal">Get in Touch</span>
          <h1>Contact the ProductLife Team</h1>
          <p>
            Have inquiries regarding digital passport integration, circular economy partnerships, 
            or this collegiate web programming project? Reach out below.
          </p>
        </div>
      </section>

      <section className="container" style={{ marginBottom: '5rem' }}>
        <div className="contact-grid">
          {/* Contact Details Card */}
          <div className="contact-info-card">
            <h3>Let's Connect</h3>
            <p>
              ProductLife is an innovative academic project exploring digital product passport technology, 
              built using React, Java Spring Boot, and MySQL.
            </p>

            <div className="contact-method">
              <MapPin size={22} style={{ color: 'var(--teal-500)', flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Department & Campus</strong>
                <span style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                  Department of Information Technology, Engineering Campus
                </span>
              </div>
            </div>

            <div className="contact-method">
              <Mail size={22} style={{ color: 'var(--teal-500)', flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Direct Email</strong>
                <a href="mailto:contact@productlife.eco" style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                  contact@productlife.eco
                </a>
              </div>
            </div>

            <div className="contact-method">
              <Globe size={22} style={{ color: 'var(--teal-500)', flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Project Repository</strong>
                <span style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                  github.com/productlife-dpp
                </span>
              </div>
            </div>

            <div style={{ marginTop: '2.5rem', padding: '1.25rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <span className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>Phase Roadmap</span>
              <p style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>
                In <strong>Phase 5</strong>, this form will connect to a Spring Boot REST API endpoint (<code>POST /api/contact</code>) 
                to persist queries in MySQL.
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="contact-form">
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Send Us a Message</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', fontSize: '0.95rem' }}>
              Fill in your enquiry details and our team will get back to you shortly.
            </p>

            {submitted ? (
              <div style={{ 
                background: 'var(--teal-50)', 
                border: '1px solid var(--teal-100)', 
                borderRadius: 'var(--radius-md)', 
                padding: '2rem', 
                textAlign: 'center' 
              }}>
                <CheckCircle2 size={44} style={{ color: 'var(--teal-600)', margin: '0 auto 1rem auto' }} />
                <h4 style={{ color: 'var(--primary-800)', marginBottom: '0.5rem' }}>Thank You for Reaching Out!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.5rem' }}>
                  Your message has been captured by the frontend state. (In Phase 5, this will be saved into the MySQL database).
                </p>
                <button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }} className="btn btn-outline btn-sm">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {errorMsg && (
                  <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <AlertCircle size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. Alex Henderson"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. alex@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. Digital Passport Demonstration Inquiry"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Write your questions or comments here..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Send size={16} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
