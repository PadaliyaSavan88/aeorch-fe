import { Globe, BarChart3, FileText } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Globe,
    title: 'Enter your URL',
    description: 'Paste your website address. Aeorch discovers all your pages via sitemap and crawls up to your credit limit.',
  },
  {
    step: '02',
    icon: BarChart3,
    title: 'Get your scores',
    description: 'Within minutes, receive scores for SEO, AEO, GEO, AI Compatibility and Authority — each with detailed issue breakdowns.',
  },
  {
    step: '03',
    icon: FileText,
    title: 'Fix and generate',
    description: 'Get actionable recommendations for every issue. Download auto-generated llm.txt and ai-plugin.json files to boost AI discoverability instantly.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="badge bg-slate-200 text-slate-700 mb-4">Simple by design</span>
          <h2 className="section-title mb-4">How it works</h2>
          <p className="section-subtitle mx-auto text-center">
            From URL to a full SEO + AEO + GEO audit report in under 2 minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-[33%] right-[33%] h-px bg-gradient-to-r from-brand-200 to-brand-200" />

          {steps.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="flex flex-col items-center text-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-200">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-brand-600 flex items-center justify-center text-xs font-bold text-brand-700">
                    {s.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-navy-900 text-lg mb-2">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
