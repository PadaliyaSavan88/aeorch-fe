'use client';

import { useState } from 'react';
import SiteThemeProvider, { useSiteTheme } from '@/components/site/SiteThemeProvider';
import AppShell from '@/components/site/AppShell';
import { SITE_ACCENT } from '@/lib/siteTheme';

type View = 'billing' | 'change-plan' | 'cancel';
type PlanKey = 'agency' | 'starter';

const PLANS: Record<PlanKey, { name: string; label: string; desc: string }> = {
  agency: { name: 'Agency', label: 'Agency · $79/mo', desc: 'Up to 15 sites, competitor comparison, white-label PDF' },
  starter: { name: 'Starter', label: 'Starter · $29/mo', desc: '1 site, monthly re-scan, alerts' },
};

const USAGE = [
  { label: 'Sites monitored', value: '12 / 15', pct: 80 },
  { label: 'Team seats', value: '3 / 5', pct: 60 },
  { label: 'PDF exports this month', value: '24', pct: 40 },
];

const INVOICES = [
  { date: 'Aug 7, 2026', desc: 'Agency plan (monthly)', amount: '$79.00' },
  { date: 'Jul 7, 2026', desc: 'Agency plan (monthly)', amount: '$79.00' },
  { date: 'Jun 7, 2026', desc: 'Agency plan (monthly)', amount: '$79.00' },
  { date: 'May 7, 2026', desc: 'Starter plan (monthly)', amount: '$29.00' },
];

function BillingBody() {
  const { theme } = useSiteTheme();
  const [view, setView] = useState<View>('billing');
  const [plan, setPlan] = useState<PlanKey>('agency');
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('agency');
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const card = { border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 28, marginBottom: 20 };
  const currentPlanLabel = cancelled ? 'No active plan' : PLANS[plan].label;

  return (
    <AppShell active="billing" maxWidth={880}>
      {view === 'billing' && (
        <>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>
              Billing <span style={{ textTransform: 'none', letterSpacing: 'normal' }}>· preview, not connected to Stripe yet</span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>Plan &amp; usage</h1>
          </div>

          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: SITE_ACCENT, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Current plan</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{currentPlanLabel}</div>
                <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4 }}>Founding pricing locked through Feb 2027 · renews Sep 7, 2026</div>
              </div>
              <button
                onClick={() => { setSelectedPlan(plan); setView('change-plan'); }}
                className="transition-colors hover:!border-[#3CD070] hover:!text-[#3CD070]"
                style={{ border: `1px solid ${theme.border}`, background: 'none', color: theme.textPrimary, padding: '10px 18px', borderRadius: 8, fontWeight: 600, fontSize: 13.5, cursor: 'pointer' }}
              >
                Change plan
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 16 }}>
              {USAGE.map(u => (
                <div key={u.label} style={{ border: `1px solid ${theme.border}`, borderRadius: 6, padding: '14px 16px' }}>
                  <div style={{ fontSize: 11.5, color: theme.textSecondary, marginBottom: 8 }}>{u.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{u.value}</div>
                  <div style={{ height: 5, borderRadius: 3, background: theme.border, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${u.pct}%`, background: SITE_ACCENT }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Payment method</div>
              <button disabled title="Coming soon" style={{ border: `1px solid ${theme.border}`, background: 'none', color: theme.textPrimary, padding: '8px 14px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'not-allowed', opacity: 0.6 }}>
                Update card
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 30, borderRadius: 5, background: theme.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: theme.textSecondary }}>
                VISA
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Visa ending in 4242</div>
                <div style={{ fontSize: 12.5, color: theme.textSecondary }}>Expires 08/28</div>
              </div>
            </div>
          </div>

          <div style={{ ...card, marginBottom: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Billing history</div>
            <div className="hidden sm:grid" style={{ gridTemplateColumns: '1fr 1fr 1fr auto', paddingBottom: 12, borderBottom: `1px solid ${theme.border}`, fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.04em' }}>
              <div>Date</div><div>Description</div><div>Amount</div><div>Invoice</div>
            </div>
            {INVOICES.map(inv => (
              <div key={inv.date + inv.desc} className="grid grid-cols-2 sm:[grid-template-columns:1fr_1fr_1fr_auto]" style={{ padding: '14px 0', borderBottom: `1px solid ${theme.border}`, alignItems: 'center', fontSize: 13.5, gap: 4 }}>
                <div>{inv.date}</div>
                <div style={{ color: theme.textSecondary }}>{inv.desc}</div>
                <div style={{ fontWeight: 600 }}>{inv.amount}</div>
                <span style={{ fontWeight: 600, color: theme.textSecondary }}>—</span>
              </div>
            ))}
            <div style={{ paddingTop: 16 }}>
              <button
                onClick={() => { setCancelled(false); setView('cancel'); }}
                className="transition-colors hover:!text-[#E0533C]"
                style={{ background: 'none', border: 'none', padding: 0, fontSize: 13, color: theme.textSecondary, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Cancel subscription
              </button>
            </div>
          </div>
        </>
      )}

      {view === 'change-plan' && (
        <>
          <button
            onClick={() => setView('billing')}
            className="transition-colors hover:!text-[#5ddb8c]"
            style={{ background: 'none', border: 'none', padding: 0, fontSize: 13, fontWeight: 600, color: SITE_ACCENT, cursor: 'pointer', marginBottom: 16 }}
          >
            ← Back to billing
          </button>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.01em' }}>Change plan</h1>
          <p style={{ fontSize: 14, color: theme.textSecondary, margin: '0 0 28px' }}>Switch anytime, changes prorate on your next invoice.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
            {(Object.keys(PLANS) as PlanKey[]).map(key => (
              <label
                key={key}
                style={{
                  border: selectedPlan === key ? `2px solid ${SITE_ACCENT}` : `1px solid ${theme.border}`,
                  borderRadius: 8, padding: '20px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  cursor: 'pointer', background: theme.card,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{PLANS[key].label}</div>
                  <div style={{ fontSize: 13, color: theme.textSecondary }}>{PLANS[key].desc}</div>
                </div>
                <input type="radio" name="plan-select" checked={selectedPlan === key} onChange={() => setSelectedPlan(key)} />
              </label>
            ))}
          </div>
          <button
            onClick={() => { setPlan(selectedPlan); setView('billing'); }}
            style={{ background: '#2A4736', color: '#F9F9F8', border: 'none', padding: '13px 24px', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
          >
            Confirm change
          </button>
        </>
      )}

      {view === 'cancel' && (
        <>
          <button
            onClick={() => setView('billing')}
            className="transition-colors hover:!text-[#5ddb8c]"
            style={{ background: 'none', border: 'none', padding: 0, fontSize: 13, fontWeight: 600, color: SITE_ACCENT, cursor: 'pointer', marginBottom: 16 }}
          >
            ← Back to billing
          </button>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.01em' }}>Cancel subscription</h1>
          <p style={{ fontSize: 14, color: theme.textSecondary, margin: '0 0 24px', lineHeight: 1.6 }}>
            You&apos;ll keep access to {currentPlanLabel} through the end of your current billing period (Sep 7, 2026), then your sites will stop re-scanning and white-label exports will turn off.
          </p>
          <div style={{ border: '1px solid #E0533C55', borderRadius: 6, background: '#E0533C1a', padding: '20px 22px', marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#E0533C', marginBottom: 6 }}>This will affect 12 monitored client sites</div>
            <div style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.6 }}>Scans stop, reports go stale, and clients relying on your monthly export will notice.</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setCancelling(true);
                setTimeout(() => { setCancelling(false); setCancelled(true); setView('billing'); }, 500);
              }}
              style={{ background: 'none', border: '1px solid #E0533C', color: '#E0533C', padding: '13px 24px', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
            >
              {cancelling ? 'Cancelling…' : 'Confirm cancellation'}
            </button>
            <button
              onClick={() => setView('billing')}
              style={{ background: '#2A4736', color: '#F9F9F8', border: 'none', padding: '13px 24px', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
            >
              Keep my plan
            </button>
          </div>
        </>
      )}
    </AppShell>
  );
}

export default function BillingPage() {
  return (
    <SiteThemeProvider>
      <BillingBody />
    </SiteThemeProvider>
  );
}
