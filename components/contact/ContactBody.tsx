'use client';

import { useState } from 'react';
import { Mail, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
import { contactApi } from '@/lib/api';
import { useSiteTheme } from '@/components/site/SiteThemeProvider';
import { SITE_ACCENT, SITE_CTA_BG, SITE_CTA_BG_HOVER } from '@/lib/siteTheme';

const SUBJECTS = ['General question', 'Premium plan enquiry', 'Bug report', 'Partnership', 'Other'];

const FAQS = [
  { q: 'How fast does Aeorch respond to messages?', a: 'We typically respond within one business day.' },
  { q: 'How do I report a bug?', a: "Select \"Bug report\" from the subject dropdown below and describe the issue — we read every submission." },
  { q: 'Do you offer white-label reports for agencies?', a: 'White-label PDF export is an Agency-tier feature — reach out via Premium plan enquiry for agency onboarding.' },
];

export default function ContactBody() {
  const { theme } = useSiteTheme();
  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      await contactApi.submit(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: SUBJECTS[0], message: '' });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  const card: React.CSSProperties = { border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card };
  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', background: theme.bg, border: `1px solid ${theme.border}`,
    borderRadius: 6, padding: '10px 12px', fontSize: 14, color: theme.textPrimary, fontFamily: 'inherit',
  };
  const label: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: theme.textSecondary, marginBottom: 6 };

  return (
    <>
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '90px 24px 50px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 16px' }}>Get in touch</h1>
        <p style={{ fontSize: 17, color: theme.textSecondary, margin: 0 }}>Questions, premium enquiries, or just want to say hi.</p>
      </section>

      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 100px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20, marginBottom: 32 }}>
          <div style={{ ...card, padding: 24 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#3CD07022', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Mail className="w-5 h-5" style={{ color: SITE_ACCENT }} />
            </div>
            <h2 style={{ fontWeight: 700, fontSize: 15, margin: '0 0 4px' }}>General enquiries</h2>
            <p style={{ fontSize: 13, color: theme.textSecondary, margin: 0 }}>Questions about the product, your account, or feedback — use the form below.</p>
          </div>
          <div style={{ ...card, background: SITE_CTA_BG, border: 'none', padding: 24 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#ffffff1a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <MessageSquare className="w-5 h-5" style={{ color: '#7FB2FF' }} />
            </div>
            <h2 style={{ fontWeight: 700, fontSize: 15, margin: '0 0 4px', color: '#F9F9F8' }}>Premium plans</h2>
            <p style={{ fontSize: 13, color: '#D7DED9', margin: 0 }}>
              Unlimited credits, API access, white-label reports, and custom plans for agencies and power users — use the form below.
            </p>
          </div>
        </div>

        <div style={{ ...card, padding: 32 }}>
          {status === 'success' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14, padding: '32px 0' }}>
              <CheckCircle className="w-11 h-11" style={{ color: SITE_ACCENT }} />
              <h2 style={{ fontWeight: 700, fontSize: 19, margin: 0 }}>Message sent!</h2>
              <p style={{ fontSize: 13.5, color: theme.textSecondary, margin: 0 }}>Thanks for reaching out. We typically respond within one business day.</p>
              <button
                onClick={() => setStatus('idle')}
                className="transition-colors hover:!text-[#5ddb8c]"
                style={{ fontSize: 13, color: SITE_ACCENT, background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <h2 style={{ fontWeight: 700, fontSize: 19, margin: '0 0 4px' }}>Send us a message</h2>
              <p style={{ fontSize: 13.5, color: theme.textSecondary, margin: '0 0 24px' }}>We typically respond within one business day.</p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
                  <div>
                    <label style={label}>Name</label>
                    <input name="name" type="text" placeholder="Jane Smith" value={form.name} onChange={handleChange} required className="focus:!border-[#3CD070] focus:!outline-none" style={inputStyle} />
                  </div>
                  <div>
                    <label style={label}>Email</label>
                    <input name="email" type="email" placeholder="jane@company.com" value={form.email} onChange={handleChange} required className="focus:!border-[#3CD070] focus:!outline-none" style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={label}>Subject</label>
                  <select name="subject" value={form.subject} onChange={handleChange} className="focus:!border-[#3CD070] focus:!outline-none" style={inputStyle}>
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label style={label}>Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Tell us how we can help…"
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="focus:!border-[#3CD070] focus:!outline-none"
                    style={{ ...inputStyle, resize: 'none' }}
                  />
                </div>

                {status === 'error' && (
                  <p style={{ fontSize: 13, color: '#E0533C', background: '#E0533C1a', border: '1px solid #E0533C55', borderRadius: 6, padding: '10px 14px', margin: 0 }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex items-center justify-center gap-2"
                  style={{ background: SITE_CTA_BG, color: '#F9F9F8', border: 'none', padding: '13px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: status === 'loading' ? 'default' : 'pointer', opacity: status === 'loading' ? 0.7 : 1, fontFamily: 'inherit' }}
                  onMouseEnter={e => status !== 'loading' && (e.currentTarget.style.background = SITE_CTA_BG_HOVER)}
                  onMouseLeave={e => (e.currentTarget.style.background = SITE_CTA_BG)}
                >
                  {status === 'loading' ? (<><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>) : 'Send message'}
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 100px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 24px' }}>Questions</h2>
        {FAQS.map(item => (
          <div key={item.q} style={{ borderBottom: `1px solid ${theme.border}`, padding: '18px 0' }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 6px' }}>{item.q}</h3>
            <div style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.6 }}>{item.a}</div>
          </div>
        ))}
      </section>
    </>
  );
}
