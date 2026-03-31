import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aeorch.com';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Aeorch Privacy Policy — how we collect, use and protect your data.',
  alternates: { canonical: `${siteUrl}/privacy` },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-hero text-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-slate-300 text-sm">Last updated: March 2025</p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="prose-brand">
              <h2>1. Information we collect</h2>
              <p>When you create an account, we collect your name and email address. If you sign in with Google, we receive your name and email from Google. We do not receive or store your Google password.</p>
              <p>When you run a scan, we store the URL you submitted, the scan results, and the date of the scan — linked to your account.</p>

              <h2>2. How we use your information</h2>
              <p>We use your information to:</p>
              <ul>
                <li>Provide the Aeorch scan service</li>
                <li>Manage your credits and referral bonuses</li>
                <li>Send transactional emails (account creation, password reset)</li>
                <li>Improve the product through aggregated, anonymised usage analytics</li>
              </ul>
              <p>We do not sell your personal information to third parties.</p>

              <h2>3. Data storage and security</h2>
              <p>Your data is stored in MongoDB with encrypted connections. Passwords are hashed using bcrypt with 12 salt rounds. Access tokens are short-lived (15 minutes) and refresh tokens are stored in Redis with 7-day expiry.</p>

              <h2>4. Cookies and analytics</h2>
              <p>We use Google Analytics 4 to understand how the site is used. This uses cookies. You can opt out by using your browser&apos;s cookie controls or the Google Analytics opt-out extension.</p>

              <h2>5. Your rights</h2>
              <p>You can request a copy of your data, correction of inaccurate data, or deletion of your account at any time via our <a href="/contact">contact page</a>.</p>

              <h2>6. Contact</h2>
              <p>For privacy questions, reach us via our <a href="/contact">contact page</a>.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
