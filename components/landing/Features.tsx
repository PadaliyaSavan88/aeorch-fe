import { Search, MessageSquare, MapPin, Bot, ShieldCheck } from 'lucide-react';

const pillars = [
  {
    icon: Search,
    color: 'bg-blue-50 text-brand-600',
    title: 'SEO Score',
    description:
      'Audit titles, meta descriptions, H1 tags, canonical URLs, Open Graph tags and more. Fix the fundamentals that Google still rewards.',
    checks: ['Title & meta tags', 'Heading structure', 'Canonical URLs', 'OG tags'],
  },
  {
    icon: MessageSquare,
    color: 'bg-violet-50 text-violet-600',
    title: 'AEO Score',
    description:
      'Answer Engine Optimization. Measure how well your content is structured for ChatGPT, Perplexity and other AI answer engines.',
    checks: ['FAQPage schema', 'Q&A headings', 'HowTo markup', 'Article schema'],
  },
  {
    icon: MapPin,
    color: 'bg-emerald-50 text-emerald-600',
    title: 'GEO Score',
    description:
      'Generative Engine Optimization. Ensure your content depth, citations, and signals make AI models confident enough to surface your site.',
    checks: ['Content depth', 'Author attribution', 'External citations', 'Publication dates'],
  },
  {
    icon: Bot,
    color: 'bg-cyan-50 text-cyan-600',
    title: 'AI Compatibility',
    description:
      'Check if 10+ AI bots can actually access your site. Generate llm.txt and ai-plugin.json to help AI engines understand your content.',
    checks: ['robots.txt AI directives', 'llm.txt file', 'ai-plugin.json', '10 AI bots checked'],
  },
  {
    icon: ShieldCheck,
    color: 'bg-amber-50 text-amber-600',
    title: 'Authority Score',
    description:
      'Trust signals that both Google and AI engines use to verify credibility — About, Contact and Privacy pages that back up your claims.',
    checks: ['About page', 'Contact page', 'Privacy policy', 'Trust signals'],
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="badge bg-brand-50 text-brand-700 mb-4">5 Dimensions of Website Health</span>
          <h2 className="section-title mb-4">
            One audit. Five scores.
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Aeorch checks your website across every dimension that matters in 2025 — from classic SEO to AI discoverability.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className={`card p-7 flex flex-col gap-4 hover:shadow-md transition-shadow ${i === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${pillar.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-navy-900 text-lg mb-1">{pillar.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{pillar.description}</p>
                </div>
                <ul className="mt-auto space-y-1.5">
                  {pillar.checks.map(check => (
                    <li key={check} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                      {check}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
