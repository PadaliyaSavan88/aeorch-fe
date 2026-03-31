import Link from 'next/link';
import { Check, X, ArrowRight } from 'lucide-react';

const freeFeatures = [
  { label: '20 pages per month', included: true },
  { label: '+20 pages per referral (no cap)', included: true },
  { label: 'All 5 audit dimensions', included: true },
  { label: 'Full HTML report', included: true },
  { label: 'Generated llm.txt & ai-plugin.json', included: true },
  { label: 'Unlimited scans (within credits)', included: true },
  { label: 'API access', included: false },
  { label: 'Scheduled scans', included: false },
  { label: 'White-label reports', included: false },
];

export default function FreemiumSection() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="badge bg-brand-50 text-brand-700 mb-4">Pricing</span>
          <h2 className="section-title mb-4">Free to start. Powerful from day one.</h2>
          <p className="section-subtitle mx-auto text-center">
            Start with 20 free page credits every month. Earn more by referring friends, or connect with us for a custom premium plan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Free plan */}
          <div className="card p-8 border-2 border-brand-600">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-navy-900">Free</h3>
                <p className="text-slate-500 text-sm mt-1">Everything you need to get started</p>
              </div>
              <span className="badge bg-brand-600 text-white">Current plan</span>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold text-navy-900">$0</span>
              <span className="text-slate-500 text-sm ml-2">/ month</span>
            </div>

            <ul className="space-y-3 mb-8">
              {freeFeatures.map(f => (
                <li key={f.label} className="flex items-center gap-3 text-sm">
                  {f.included
                    ? <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    : <X className="w-4 h-4 text-slate-300 flex-shrink-0" />}
                  <span className={f.included ? 'text-slate-700' : 'text-slate-400'}>{f.label}</span>
                </li>
              ))}
            </ul>

            <Link href="/signup" className="btn-primary w-full justify-center">
              Get started free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Premium */}
          <div className="card p-8 bg-gradient-hero text-white">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-1">Premium</h3>
              <p className="text-slate-300 text-sm">Custom plans for agencies and power users</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold">Custom</span>
              <span className="text-slate-300 text-sm ml-2">pricing</span>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                'Unlimited page credits',
                'API access for integrations',
                'Scheduled automated scans',
                'White-label PDF reports',
                'Priority support',
                'Multiple websites',
              ].map(f => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link href="/contact" className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-white text-navy-900 font-semibold text-sm hover:bg-slate-100 transition-colors">
              Contact for pricing <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Referral note */}
        <p className="text-center text-sm text-slate-500 mt-8">
          💡 Refer a friend and both of you get +20 free page credits. No cap on referrals.{' '}
          <Link href="/signup" className="text-brand-600 hover:underline font-medium">Start referring →</Link>
        </p>
      </div>
    </section>
  );
}
