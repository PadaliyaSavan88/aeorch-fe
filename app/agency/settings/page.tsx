'use client';

import { useState } from 'react';
import SiteThemeProvider, { useSiteTheme } from '@/components/site/SiteThemeProvider';
import AppShell from '@/components/site/AppShell';

const BRAND_COLORS = ['#3CD070', '#D99E32', '#E0533C', '#2A4736'];
const TEAM = [
  { name: 'Jordan Reyes', email: 'jordan@brightpeak-marketing.com', role: 'Owner' },
  { name: 'Sam Okafor', email: 'sam@brightpeak-marketing.com', role: 'Admin' },
  { name: 'Priya Nair', email: 'priya@brightpeak-marketing.com', role: 'Member' },
];

function LogoSlot() {
  const { theme } = useSiteTheme();
  return (
    <div
      style={{
        width: 96, height: 96, borderRadius: 8, background: theme.bg, border: `1px dashed ${theme.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: theme.textSecondary, textAlign: 'center', flexShrink: 0,
      }}
    >
      agency logo
    </div>
  );
}

function SettingsBody() {
  const { theme } = useSiteTheme();
  const [agencyName, setAgencyName] = useState('Bright Peak Marketing');
  const [agencyUrl, setAgencyUrl] = useState('brightpeak-marketing.com');
  const [whiteLabel, setWhiteLabel] = useState(true);
  const [brandColor, setBrandColor] = useState('#3CD070');

  const inputStyle = {
    width: '100%', boxSizing: 'border-box' as const, background: theme.bg, border: `1px solid ${theme.border}`,
    borderRadius: 6, padding: '10px 12px', fontSize: 14, color: theme.textPrimary, transition: 'border-color 150ms ease', fontFamily: 'inherit',
  };

  const card = { border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 28, marginBottom: 20 };

  return (
    <AppShell active="settings" maxWidth={880}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>
          Settings <span style={{ textTransform: 'none', letterSpacing: 'normal' }}>· preview, changes aren&apos;t saved yet</span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>Agency &amp; brand</h1>
      </div>

      <div style={card}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Agency profile</div>
        <p style={{ fontSize: 13, color: theme.textSecondary, margin: '0 0 20px' }}>Shown on your account and in team invites.</p>
        <div className="flex flex-col sm:flex-row" style={{ gap: 24, alignItems: 'flex-start' }}>
          <LogoSlot />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, minWidth: 0, width: '100%' }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme.textSecondary, marginBottom: 6 }}>Agency name</label>
              <input value={agencyName} onChange={e => setAgencyName(e.target.value)} className="focus:!border-[#3CD070] focus:!outline-none" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme.textSecondary, marginBottom: 6 }}>Website</label>
              <input value={agencyUrl} onChange={e => setAgencyUrl(e.target.value)} className="focus:!border-[#3CD070] focus:!outline-none" style={{ ...inputStyle, fontFamily: 'ui-monospace,monospace' }} />
            </div>
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Client report branding</div>
        <p style={{ fontSize: 13, color: theme.textSecondary, margin: '0 0 20px' }}>Controls how PDF exports and the report view look to your clients.</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${theme.border}` }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>White-label reports</div>
            <div style={{ fontSize: 12.5, color: theme.textSecondary }}>Remove the Aeorch mark from client-facing PDFs (Agency plan)</div>
          </div>
          <button
            onClick={() => setWhiteLabel(w => !w)}
            className="focus:!outline focus:!outline-2 focus:!outline-[#3CD070] focus:!outline-offset-2"
            style={{
              width: 44, height: 26, borderRadius: 14, border: 'none', padding: 3, cursor: 'pointer',
              background: whiteLabel ? '#3CD070' : theme.border, display: 'flex',
              justifyContent: whiteLabel ? 'flex-end' : 'flex-start', transition: 'background 150ms ease',
            }}
          >
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#F9F9F8' }} />
          </button>
        </div>

        <div style={{ padding: '16px 0 4px' }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme.textSecondary, marginBottom: 10 }}>Report accent color</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {BRAND_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setBrandColor(c)}
                className="transition-transform hover:!scale-110"
                style={{
                  width: 32, height: 32, borderRadius: '50%', background: c, cursor: 'pointer',
                  border: c === brandColor ? `2px solid ${theme.textPrimary}` : `1px solid ${theme.border}`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={{ ...card, marginBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Team</div>
            <p style={{ fontSize: 13, color: theme.textSecondary, margin: '4px 0 0' }}>People at your agency with access to this account.</p>
          </div>
          <button
            disabled
            title="Coming soon"
            style={{ background: '#2A4736', color: '#F9F9F8', border: 'none', padding: '9px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'not-allowed', opacity: 0.6 }}
          >
            + Invite
          </button>
        </div>
        {TEAM.map(m => (
          <div key={m.email} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: `1px solid ${theme.border}` }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
              <div style={{ fontSize: 12.5, color: theme.textSecondary }}>{m.email}</div>
            </div>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: theme.textSecondary, border: `1px solid ${theme.border}`, padding: '4px 10px', borderRadius: 12 }}>
              {m.role}
            </span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

export default function AgencySettingsPage() {
  return (
    <SiteThemeProvider>
      <SettingsBody />
    </SiteThemeProvider>
  );
}
