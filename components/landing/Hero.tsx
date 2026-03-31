import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

const highlights = [
  'Free — 20 pages per month',
  'No credit card required',
  'Results in under 2 minutes',
];

export default function Hero() {
  return (
    <section className="bg-gradient-hero text-white relative overflow-hidden">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm text-cyan-300 font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          The SEO audit tool built for the AI era
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
          Make Your Website{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            AI-Ready
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Get a comprehensive SEO audit with AEO, GEO, AI Compatibility and Authority scores.
          Know exactly why your site isn&apos;t showing up in ChatGPT, Claude, or Perplexity — and fix it.
        </p>

        {/* URL input CTA */}
        <div className="max-w-xl mx-auto mb-8">
          <form
            action="/scan"
            method="get"
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="url"
              name="url"
              placeholder="https://yourwebsite.com"
              className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
              required
            />
            <button type="submit" className="btn-primary !py-4 !px-8 whitespace-nowrap">
              Scan now <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-slate-400">
          {highlights.map(h => (
            <span key={h} className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 48h1440V24C1200 8 960 0 720 0S240 8 0 24v24z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
