'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi, organizationApi } from '@/lib/api';
import { clearTokens, isLoggedIn } from '@/lib/auth';
import SiteThemeProvider, { useSiteTheme } from '@/components/site/SiteThemeProvider';
import AppShell from '@/components/site/AppShell';
import { SITE_ACCENT, SITE_CTA_BG, SITE_CTA_BG_HOVER } from '@/lib/siteTheme';

const BRAND_COLORS = ['#3CD070', '#D99E32', '#E0533C', '#2A4736'];

interface Me {
  id: string;
  orgRole?: 'owner' | 'admin' | 'member';
}

interface Organization {
  _id: string;
  name: string;
  url: string;
  whiteLabel: boolean;
  brandColor: string;
}

interface Member {
  _id: string;
  name: string;
  email: string;
  orgRole: 'owner' | 'admin' | 'member';
}

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
  const router = useRouter();

  const [me, setMe] = useState<Me | null>(null);
  const [org, setOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [agencyName, setAgencyName] = useState('');
  const [agencyUrl, setAgencyUrl] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [brandingError, setBrandingError] = useState('');

  const [addingMember, setAddingMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [memberSubmitting, setMemberSubmitting] = useState(false);
  const [memberError, setMemberError] = useState('');
  const [memberActionId, setMemberActionId] = useState<string | null>(null);

  async function refreshOrg() {
    try {
      const res = await organizationApi.getMine();
      setOrg(res.data.data.organization);
      setMembers(res.data.data.members);
      setAgencyName(res.data.data.organization.name);
      setAgencyUrl(res.data.data.organization.url);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setOrg(null);
        setMembers([]);
      }
    }
  }

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return; }

    authApi.me()
      .then(meRes => {
        setMe(meRes.data.data);
        return refreshOrg();
      })
      .catch(err => {
        if (err.response?.status === 401) {
          clearTokens();
          router.replace('/login');
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault();
    if (!org) return;
    setProfileError('');
    setSavingProfile(true);
    try {
      await organizationApi.update(org._id, { name: agencyName, url: agencyUrl });
      await refreshOrg();
    } catch (err: any) {
      setProfileError(err.response?.data?.message || 'Failed to save agency profile.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function toggleWhiteLabel() {
    if (!org) return;
    setBrandingError('');
    try {
      await organizationApi.update(org._id, { whiteLabel: !org.whiteLabel });
      await refreshOrg();
    } catch (err: any) {
      setBrandingError(err.response?.data?.message || 'Failed to update.');
    }
  }

  async function selectBrandColor(color: string) {
    if (!org) return;
    setBrandingError('');
    try {
      await organizationApi.update(org._id, { brandColor: color });
      await refreshOrg();
    } catch (err: any) {
      setBrandingError(err.response?.data?.message || 'Failed to update.');
    }
  }

  async function handleAddMember(e: FormEvent) {
    e.preventDefault();
    if (!org) return;
    setMemberError('');
    setMemberSubmitting(true);
    try {
      await organizationApi.addMember(org._id, newMemberEmail);
      setNewMemberEmail('');
      setAddingMember(false);
      await refreshOrg();
    } catch (err: any) {
      setMemberError(err.response?.data?.message || 'Failed to add member.');
    } finally {
      setMemberSubmitting(false);
    }
  }

  async function handleRoleChange(userId: string, role: 'admin' | 'member') {
    if (!org) return;
    setMemberActionId(userId);
    try {
      await organizationApi.updateMemberRole(org._id, userId, role);
      await refreshOrg();
    } finally {
      setMemberActionId(null);
    }
  }

  async function handleRemoveMember(userId: string) {
    if (!org) return;
    setMemberActionId(userId);
    try {
      await organizationApi.removeMember(org._id, userId);
      await refreshOrg();
    } finally {
      setMemberActionId(null);
    }
  }

  const isOwner = me?.orgRole === 'owner';
  const canManage = me?.orgRole === 'owner' || me?.orgRole === 'admin';

  const inputStyle = {
    width: '100%', boxSizing: 'border-box' as const, background: theme.bg, border: `1px solid ${theme.border}`,
    borderRadius: 6, padding: '10px 12px', fontSize: 14, color: theme.textPrimary, transition: 'border-color 150ms ease', fontFamily: 'inherit',
  };

  const card = { border: `1px solid ${theme.border}`, borderRadius: 6, background: theme.card, padding: 28, marginBottom: 20 };

  if (loading) {
    return (
      <AppShell active="settings" maxWidth={880}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: SITE_ACCENT }}>Loading…</div>
      </AppShell>
    );
  }

  if (!org) {
    return (
      <AppShell active="settings" maxWidth={640}>
        <div style={card}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>No agency workspace yet</h1>
          <p style={{ fontSize: 13.5, color: theme.textSecondary, margin: '0 0 16px' }}>Create one first, then come back here to manage branding and your team.</p>
          <Link href="/agency" style={{ color: SITE_ACCENT, fontSize: 13.5, fontWeight: 600 }}>Go to Multi-site →</Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell active="settings" maxWidth={880}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>
          Settings
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>Agency &amp; brand</h1>
      </div>

      <form onSubmit={handleSaveProfile} style={card}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Agency profile</div>
        <p style={{ fontSize: 13, color: theme.textSecondary, margin: '0 0 20px' }}>Shown on your account and in team invites.</p>
        <div className="flex flex-col sm:flex-row" style={{ gap: 24, alignItems: 'flex-start' }}>
          <LogoSlot />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, minWidth: 0, width: '100%' }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme.textSecondary, marginBottom: 6 }}>Agency name</label>
              <input disabled={!canManage} value={agencyName} onChange={e => setAgencyName(e.target.value)} className="focus:!border-[#3CD070] focus:!outline-none" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: theme.textSecondary, marginBottom: 6 }}>Website</label>
              <input disabled={!canManage} value={agencyUrl} onChange={e => setAgencyUrl(e.target.value)} className="focus:!border-[#3CD070] focus:!outline-none" style={{ ...inputStyle, fontFamily: 'ui-monospace,monospace' }} />
            </div>
            {canManage && (
              <div>
                {profileError && <p style={{ color: '#E0533C', fontSize: 13, margin: '0 0 10px' }}>{profileError}</p>}
                <button
                  type="submit"
                  disabled={savingProfile}
                  style={{ background: SITE_CTA_BG, color: '#F9F9F8', border: 'none', padding: '10px 18px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: savingProfile ? 'default' : 'pointer', opacity: savingProfile ? 0.7 : 1 }}
                  onMouseEnter={e => !savingProfile && (e.currentTarget.style.background = SITE_CTA_BG_HOVER)}
                  onMouseLeave={e => !savingProfile && (e.currentTarget.style.background = SITE_CTA_BG)}
                >
                  {savingProfile ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </form>

      <div style={card}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Client report branding</div>
        <p style={{ fontSize: 13, color: theme.textSecondary, margin: '0 0 20px' }}>Controls how PDF exports and the report view look to your clients.</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${theme.border}` }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>White-label reports</div>
            <div style={{ fontSize: 12.5, color: theme.textSecondary }}>Remove the Aeorch mark from client-facing PDFs (Agency plan)</div>
          </div>
          <button
            onClick={toggleWhiteLabel}
            disabled={!canManage}
            className="focus:!outline focus:!outline-2 focus:!outline-[#3CD070] focus:!outline-offset-2"
            style={{
              width: 44, height: 26, borderRadius: 14, border: 'none', padding: 3, cursor: canManage ? 'pointer' : 'default',
              background: org.whiteLabel ? '#3CD070' : theme.border, display: 'flex',
              justifyContent: org.whiteLabel ? 'flex-end' : 'flex-start', transition: 'background 150ms ease',
              opacity: canManage ? 1 : 0.6,
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
                onClick={() => selectBrandColor(c)}
                disabled={!canManage}
                className="transition-transform hover:!scale-110"
                style={{
                  width: 32, height: 32, borderRadius: '50%', background: c, cursor: canManage ? 'pointer' : 'default',
                  border: c === org.brandColor ? `2px solid ${theme.textPrimary}` : `1px solid ${theme.border}`,
                  opacity: canManage ? 1 : 0.6,
                }}
              />
            ))}
          </div>
          {brandingError && <p style={{ color: '#E0533C', fontSize: 13, margin: '10px 0 0' }}>{brandingError}</p>}
        </div>
      </div>

      <div style={{ ...card, marginBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Team</div>
            <p style={{ fontSize: 13, color: theme.textSecondary, margin: '4px 0 0' }}>People at your agency with access to this account.</p>
          </div>
          {canManage && (
            <button
              onClick={() => setAddingMember(a => !a)}
              style={{ background: '#2A4736', color: '#F9F9F8', border: 'none', padding: '9px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
            >
              + Add member
            </button>
          )}
        </div>

        {addingMember && (
          <form onSubmit={handleAddMember} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', padding: '4px 0 16px', borderBottom: `1px solid ${theme.border}`, marginBottom: 4 }}>
            <input
              required
              type="email"
              autoFocus
              value={newMemberEmail}
              onChange={e => setNewMemberEmail(e.target.value)}
              placeholder="teammate@youragency.com"
              className="focus:!border-[#3CD070] focus:!outline-none"
              style={{ ...inputStyle, flex: 1, minWidth: 220 }}
            />
            <button
              type="submit"
              disabled={memberSubmitting}
              style={{ background: SITE_CTA_BG, color: '#F9F9F8', border: 'none', padding: '10px 18px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: memberSubmitting ? 'default' : 'pointer', opacity: memberSubmitting ? 0.7 : 1 }}
            >
              {memberSubmitting ? 'Adding…' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => { setAddingMember(false); setMemberError(''); }}
              style={{ background: 'none', border: `1px solid ${theme.border}`, color: theme.textSecondary, padding: '10px 16px', borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <p style={{ fontSize: 11.5, color: theme.textSecondary, margin: 0, width: '100%' }}>
              They need an existing Aeorch account — this adds them, it doesn&apos;t send an email invite yet.
            </p>
            {memberError && <p style={{ color: '#E0533C', fontSize: 13, margin: 0, width: '100%' }}>{memberError}</p>}
          </form>
        )}

        {members.map(m => (
          <div key={m._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: `1px solid ${theme.border}`, gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
              <div style={{ fontSize: 12.5, color: theme.textSecondary }}>{m.email}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              {isOwner && m.orgRole !== 'owner' ? (
                <select
                  value={m.orgRole}
                  onChange={e => handleRoleChange(m._id, e.target.value as 'admin' | 'member')}
                  disabled={memberActionId === m._id}
                  style={{ fontSize: 11.5, fontWeight: 600, color: theme.textSecondary, border: `1px solid ${theme.border}`, padding: '4px 8px', borderRadius: 12, background: theme.card }}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              ) : (
                <span style={{ fontSize: 11.5, fontWeight: 600, color: theme.textSecondary, border: `1px solid ${theme.border}`, padding: '4px 10px', borderRadius: 12, textTransform: 'capitalize' }}>
                  {m.orgRole}
                </span>
              )}
              {canManage && m.orgRole !== 'owner' && (
                <button
                  onClick={() => handleRemoveMember(m._id)}
                  disabled={memberActionId === m._id}
                  className="transition-colors hover:!text-[#E0533C]"
                  style={{ background: 'none', border: 'none', color: theme.textSecondary, fontSize: 12, cursor: 'pointer', padding: 4 }}
                >
                  Remove
                </button>
              )}
            </div>
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
