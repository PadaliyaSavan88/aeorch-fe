'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Mail, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
import { contactApi } from '@/lib/api';

const SUBJECTS = [
  'General question',
  'Premium plan enquiry',
  'Bug report',
  'Partnership',
  'Other',
];

export default function ContactPage() {
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

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-hero text-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">Get in touch</h1>
            <p className="text-slate-300 text-lg">
              Questions, premium enquiries, or just want to say hi.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              <div className="card p-6">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-brand-600" />
                </div>
                <h2 className="font-bold text-navy-900 mb-1">General enquiries</h2>
                <p className="text-sm text-slate-500">Questions about the product, your account, or feedback — use the form below.</p>
              </div>

              <div className="card p-6 bg-gradient-hero text-white">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="font-bold mb-1">Premium plans</h2>
                <p className="text-sm text-slate-300">
                  Unlimited credits, API access, white-label reports, and custom plans for agencies and power users — use the form below.
                </p>
              </div>
            </div>

            <div className="card p-8">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                  <CheckCircle className="w-12 h-12 text-emerald-500" />
                  <h2 className="font-bold text-navy-900 text-xl">Message sent!</h2>
                  <p className="text-slate-500 text-sm">Thanks for reaching out. We typically respond within one business day.</p>
                  <button onClick={() => setStatus('idle')} className="text-sm text-brand-600 hover:underline mt-2">
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-bold text-navy-900 text-xl mb-1">Send us a message</h2>
                  <p className="text-slate-500 text-sm mb-6">We typically respond within one business day.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-navy-900 mb-1.5">Name</label>
                        <input
                          name="name"
                          type="text"
                          className="input-field"
                          placeholder="Jane Smith"
                          value={form.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-900 mb-1.5">Email</label>
                        <input
                          name="email"
                          type="email"
                          className="input-field"
                          placeholder="jane@company.com"
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-1.5">Subject</label>
                      <select name="subject" className="input-field" value={form.subject} onChange={handleChange}>
                        {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-navy-900 mb-1.5">Message</label>
                      <textarea
                        name="message"
                        className="input-field resize-none"
                        rows={5}
                        placeholder="Tell us how we can help…"
                        value={form.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {status === 'error' && (
                      <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</p>
                    )}

                    <button type="submit" disabled={status === 'loading'} className="btn-primary w-full justify-center">
                      {status === 'loading' ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                      ) : 'Send message'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
