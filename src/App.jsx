import React, { useState, useEffect, useRef } from "react";
import {
  Home, Users, MessageCircle, Copy, Wallet, TrendingUp, TrendingDown,
  Heart, MessageSquare, Repeat2, Plus, ArrowDownToLine, ArrowUpFromLine,
  ArrowLeftRight, ShieldCheck, Server, Landmark, Check, X, Search, Send,
  Share2, PiggyBank, Link2, ChevronRight, Sparkles, Twitter, Facebook, Linkedin,
  Lock, Unlock, Gift,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ---------- design tokens ----------
const T = {
  bg: "#0E1016",
  surface: "#171B26",
  surfaceAlt: "#1F2433",
  border: "#2A2F42",
  text: "#EDEFF5",
  muted: "#8B93A7",
  gold: "#D9A441",
  teal: "#34D399",
  rose: "#F87171",
  periwinkle: "#7C9EFF",
};

const mono = { fontFamily: "'JetBrains Mono', ui-monospace, monospace" };
const display = { fontFamily: "'Space Grotesk', sans-serif" };
const body = { fontFamily: "'Inter', sans-serif" };

// ---------- mock data ----------
const TICKERS = [
  { sym: "BTC", price: 71230.44, chg: 2.31 },
  { sym: "ETH", price: 3841.02, chg: -1.12 },
  { sym: "SOL", price: 178.65, chg: 5.87 },
  { sym: "XRP", price: 0.62, chg: 0.44 },
  { sym: "DOGE", price: 0.171, chg: -3.02 },
  { sym: "ADA", price: 0.451, chg: 1.05 },
  { sym: "AVAX", price: 38.9, chg: 3.4 },
  { sym: "LINK", price: 15.22, chg: -0.63 },
];

const PEOPLE = [
  { id: "u1", name: "Nadia Chen", handle: "@nadia.trades", roi: 42.1, followers: 12800, following: false, avatar: "NC" },
  { id: "u2", name: "Marcus Oduya", handle: "@marcus_onchain", roi: 18.4, followers: 6400, following: true, avatar: "MO" },
  { id: "u3", name: "Priya Raman", handle: "@priya.defi", roi: 67.9, followers: 21100, following: false, avatar: "PR" },
  { id: "u4", name: "Tomas Vale", handle: "@tomasv", roi: -4.2, followers: 980, following: false, avatar: "TV" },
];

const INITIAL_POSTS = [
  { id: "p1", uid: "u1", text: "Rotated 15% of my BTC position into SOL this morning — momentum on the L1 narrative feels early, not late.", tag: "BTC→SOL", side: "buy", time: "2h", likes: 214, comments: 18, reposts: 9 },
  { id: "p2", uid: "u3", text: "Closed the LINK swing for +22%. Staying in cash on alts until the next FOMC print.", tag: "LINK", side: "sell", time: "4h", likes: 501, comments: 44, reposts: 31 },
  { id: "p3", uid: "u2", text: "New group forming for people doing on-chain options strategies — link in my profile if you want in.", tag: null, side: null, time: "6h", likes: 88, comments: 12, reposts: 3 },
  { id: "p4", uid: "u4", text: "Rough week. Got stopped out of DOGE twice. Sizing down until volatility cools off.", tag: "DOGE", side: "sell", time: "9h", likes: 63, comments: 27, reposts: 1 },
];

const GROUPS = [
  { id: "g1", name: "On-Chain Options Desk", members: 3120, desc: "Strategy talk for options and derivatives on decentralized venues.", joined: true },
  { id: "g2", name: "Layer-1 Rotation Club", members: 8890, desc: "Tracking capital flow between BTC, ETH, SOL and other base layers.", joined: false },
  { id: "g3", name: "Cold Storage & Custody", members: 1540, desc: "Hardware wallets, multisig setups, and self-custody best practice.", joined: false },
  { id: "g4", name: "New Trader Onboarding", members: 12980, desc: "Questions welcome. No trade is too small to ask about.", joined: true },
];

const CHATS = [
  { id: "c1", uid: "u1", last: "Sent you the allocation breakdown", unread: 2 },
  { id: "c2", uid: "u2", last: "You: sounds good, copying at 10%", unread: 0 },
  { id: "c3", uid: "u3", last: "That LINK exit was clean 👏", unread: 0 },
];

const INITIAL_THREADS = {
  c1: [{ from: "them", text: "Hey — sent you the allocation breakdown for the copy portfolio." }, { from: "them", text: "Let me know if 10% feels right to start." }],
  c2: [{ from: "me", text: "Sounds good, copying at 10%." }],
  c3: [{ from: "them", text: "That LINK exit was clean 👏" }],
};

const CEX = ["Binance", "Coinbase", "Kraken"];
const DEX = ["Uniswap", "dYdX", "Curve"];
const COLD = ["Ledger", "Trezor", "Manual address"];

const INVESTMENT_PLANS = [
  { id: "ip1", name: "Starter Pool", apr: 8, min: 100, duration: "30 days", risk: "Low" },
  { id: "ip2", name: "Growth Pool", apr: 18, min: 500, duration: "90 days", risk: "Medium" },
  { id: "ip3", name: "Alpha Pool", apr: 34, min: 2000, duration: "180 days", risk: "High" },
];

const STAKING_ASSETS = [
  { sym: "ETH", apy: 5.2, min: 0.05, lockup: "Flexible" },
  { sym: "SOL", apy: 7.8, min: 1, lockup: "Flexible" },
  { sym: "BTC", apy: 3.1, min: 0.01, lockup: "30 days" },
];

const INITIAL_DROPS = [
  { id: "d1", name: "Genesis Airdrop", token: "LDGR", amount: 250, eligibility: "Early users", claimed: false },
  { id: "d2", name: "Staker Bonus Drop", token: "LDGR", amount: 120, eligibility: "Active stakers", claimed: false },
  { id: "d3", name: "Referral Milestone Drop", token: "USDT", amount: 40, eligibility: "3+ referrals", claimed: false },
];

const INITIAL_REFERRALS = [
  { id: "r1", name: "Elena Ruiz", joined: "3 days ago", status: "active", earned: 24.5 },
  { id: "r2", name: "Sam Whitfield", joined: "1 week ago", status: "active", earned: 61.2 },
  { id: "r3", name: "Devon Park", joined: "2 weeks ago", status: "pending", earned: 0 },
];

const INITIAL_CUMULATIVE = [
  { label: "Jan", pct: 0 },
  { label: "Feb", pct: 4.2 },
  { label: "Mar", pct: 9.8 },
  { label: "Apr", pct: 7.1 },
  { label: "May", pct: 15.6 },
  { label: "Jun", pct: 23.4 },
  { label: "Jul", pct: 31.2 },
];

const INITIAL_COPYING = { u1: false, u2: true, u3: false, u4: false };
const INITIAL_ALLOC = { u1: 10, u2: 10, u3: 10, u4: 10 };

const findUser = (uid) => PEOPLE.find((p) => p.id === uid);

// ---------- small shared bits ----------
function Avatar({ initials, size = 40, ring }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: `linear-gradient(135deg, ${T.periwinkle}33, ${T.gold}33)`,
        border: `1px solid ${ring || T.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.36, fontWeight: 600, color: T.text, flexShrink: 0,
        ...display,
      }}
    >
      {initials}
    </div>
  );
}

function Pill({ children, tone = "muted" }) {
  const colors = { muted: T.muted, teal: T.teal, rose: T.rose, gold: T.gold };
  const c = colors[tone];
  return (
    <span
      style={{
        fontSize: 11, padding: "2px 8px", borderRadius: 999,
        border: `1px solid ${c}55`, color: c, background: `${c}14`,
        ...mono, letterSpacing: 0.3,
      }}
    >
      {children}
    </span>
  );
}

function ShareMenu({ text, urlPath = "" }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  const shareUrl = `https://ledgersocial.app${urlPath}`;
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(shareUrl);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const platforms = [
    { name: "X", icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}` },
    { name: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { name: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { name: "Telegram", icon: Send, href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}` },
    { name: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${encodedText}%20${encodedUrl}` },
  ];

  const copyLink = (e) => {
    e.stopPropagation();
    try { navigator.clipboard && navigator.clipboard.writeText(shareUrl); } catch (err) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <span
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", color: open ? T.periwinkle : T.muted }}
      >
        <Share2 size={15} /> Share
      </span>
      {open && (
        <div
          style={{
            position: "absolute", bottom: "130%", left: 0, background: T.surfaceAlt,
            border: `1px solid ${T.border}`, borderRadius: 10, padding: 8, display: "flex",
            gap: 6, zIndex: 30, boxShadow: "0 10px 28px rgba(0,0,0,0.45)", whiteSpace: "nowrap",
          }}
        >
          {platforms.map((p) => (
            <a
              key={p.name} href={p.href} target="_blank" rel="noopener noreferrer"
              onClick={(e) => { e.stopPropagation(); setOpen(false); }}
              title={`Share on ${p.name}`}
              style={{
                width: 32, height: 32, borderRadius: 8, background: T.surface, border: `1px solid ${T.border}`,
                display: "flex", alignItems: "center", justifyContent: "center", color: T.text,
              }}
            >
              <p.icon size={15} />
            </a>
          ))}
          <button
            onClick={copyLink} title="Copy link"
            style={{
              width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, cursor: "pointer",
              background: copied ? T.teal : T.surface, color: copied ? "#08211A" : T.text,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {copied ? <Check size={14} /> : <Link2 size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

function Ticker() {
  const row = [...TICKERS, ...TICKERS];
  return (
    <div
      style={{
        background: T.surface, borderBottom: `1px solid ${T.border}`,
        overflow: "hidden", whiteSpace: "nowrap", position: "relative",
      }}
    >
      <div className="ticker-track" style={{ display: "inline-flex", padding: "10px 0" }}>
        {row.map((t, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", marginRight: 36, ...mono, fontSize: 13 }}>
            <span style={{ color: T.text, fontWeight: 600, marginRight: 8 }}>{t.sym}</span>
            <span style={{ color: T.muted, marginRight: 8 }}>${t.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span style={{ color: t.chg >= 0 ? T.teal : T.rose, display: "inline-flex", alignItems: "center", gap: 2 }}>
              {t.chg >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {t.chg >= 0 ? "+" : ""}{t.chg}%
            </span>
          </span>
        ))}
      </div>
      <style>{`
        .ticker-track { animation: scroll-left 32s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .ticker-track { animation: none; } }
        @keyframes scroll-left { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12, width: "100%",
        padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer",
        background: active ? T.surfaceAlt : "transparent",
        color: active ? T.text : T.muted, ...body, fontSize: 14, fontWeight: active ? 600 : 500,
        textAlign: "left", transition: "background 120ms, color 120ms",
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = T.surfaceAlt; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}

// ---------- Feed ----------
function Feed({ people, setPeople, posts, setPosts, balances }) {
  const [draft, setDraft] = useState("");

  const toggleFollow = (uid) =>
    setPeople((ps) => ps.map((p) => (p.id === uid ? { ...p, following: !p.following } : p)));

  const like = (pid) =>
    setPosts((ps) => ps.map((p) => (p.id === pid ? { ...p, likes: p.likes + 1, _liked: true } : p)));

  const publish = () => {
    if (!draft.trim()) return;
    setPosts((ps) => [
      { id: "p" + Date.now(), uid: "me", text: draft, tag: null, side: null, time: "now", likes: 0, comments: 0, reposts: 0 },
      ...ps,
    ]);
    setDraft("");
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px" }}>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Avatar initials="YOU" />
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Share a trade, a take, or a question…"
            rows={2}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: T.text, resize: "none", ...body, fontSize: 14, paddingTop: 8,
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <button
            onClick={publish}
            style={{
              background: T.gold, color: "#1A1204", border: "none", borderRadius: 8,
              padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", ...body,
            }}
          >
            Post
          </button>
        </div>
      </div>

      {posts.map((post) => {
        const author = post.uid === "me" ? { name: "You", handle: "@you", avatar: "YOU" } : findUser(post.uid);
        return (
          <div key={post.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <Avatar initials={author.avatar} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, fontSize: 14, ...display }}>{author.name}</span>
                  <span style={{ color: T.muted, fontSize: 13 }}>{author.handle}</span>
                  <span style={{ color: T.muted, fontSize: 12 }}>· {post.time}</span>
                  {post.uid !== "me" && (
                    <button
                      onClick={() => toggleFollow(post.uid)}
                      style={{
                        marginLeft: "auto", fontSize: 12, padding: "3px 10px", borderRadius: 999,
                        border: `1px solid ${T.border}`, cursor: "pointer", ...body, fontWeight: 600,
                        background: findUser(post.uid).following ? "transparent" : T.periwinkle,
                        color: findUser(post.uid).following ? T.muted : "#0E1016",
                      }}
                    >
                      {findUser(post.uid).following ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
                <p style={{ margin: "8px 0", fontSize: 14, lineHeight: 1.5, color: T.text, ...body }}>{post.text}</p>
                {post.tag && (
                  <div style={{ marginBottom: 8 }}>
                    <Pill tone={post.side === "buy" ? "teal" : "rose"}>
                      {post.side === "buy" ? "BUY" : "SELL"} · {post.tag}
                    </Pill>
                  </div>
                )}
                <div style={{ display: "flex", gap: 20, color: T.muted, fontSize: 13, alignItems: "center" }}>
                  <span onClick={() => like(post.id)} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                    <Heart size={15} fill={post._liked ? T.rose : "none"} color={post._liked ? T.rose : T.muted} /> {post.likes}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}><MessageSquare size={15} /> {post.comments}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Repeat2 size={15} /> {post.reposts}</span>
                  <ShareMenu
                    text={post.tag ? `${post.side === "buy" ? "Bought" : "Sold"} ${post.tag} on LedgerSocial — ${post.text}` : `"${post.text}" — via LedgerSocial`}
                    urlPath={`/post/${post.id}`}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Groups ----------
function Groups({ groups, setGroups }) {
  const toggleJoin = (gid) =>
    setGroups((gs) => gs.map((g) => (g.id === gid ? { ...g, joined: !g.joined, members: g.members + (g.joined ? -1 : 1) } : g)));

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px" }}>
      <h2 style={{ ...display, fontSize: 20, marginBottom: 16 }}>Groups</h2>
      {groups.map((g) => (
        <div key={g.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, ...display, fontSize: 15 }}>{g.name}</div>
            <div style={{ color: T.muted, fontSize: 13, margin: "4px 0" }}>{g.desc}</div>
            <div style={{ color: T.muted, fontSize: 12, ...mono }}>{g.members.toLocaleString()} members</div>
          </div>
          <button
            onClick={() => toggleJoin(g.id)}
            style={{
              flexShrink: 0, padding: "8px 16px", borderRadius: 8, border: `1px solid ${T.border}`,
              cursor: "pointer", fontWeight: 600, fontSize: 13, ...body,
              background: g.joined ? "transparent" : T.gold,
              color: g.joined ? T.muted : "#1A1204",
            }}
          >
            {g.joined ? "Joined" : "Join"}
          </button>
        </div>
      ))}
    </div>
  );
}

// ---------- Chat ----------
function Chat({ threads, setThreads }) {
  const [active, setActive] = useState(CHATS[0].id);
  const [draft, setDraft] = useState("");

  const send = () => {
    if (!draft.trim()) return;
    setThreads((t) => ({ ...t, [active]: [...t[active], { from: "me", text: draft }] }));
    setDraft("");
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ width: 240, borderRight: `1px solid ${T.border}`, padding: 12 }}>
        {CHATS.map((c) => {
          const u = findUser(c.uid);
          return (
            <div
              key={c.id}
              onClick={() => setActive(c.id)}
              style={{
                display: "flex", gap: 10, alignItems: "center", padding: 10, borderRadius: 10,
                cursor: "pointer", background: active === c.id ? T.surfaceAlt : "transparent", marginBottom: 4,
              }}
            >
              <Avatar initials={u.avatar} size={34} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, ...body }}>{u.name}</div>
                <div style={{ fontSize: 12, color: T.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.last}</div>
              </div>
              {c.unread > 0 && (
                <span style={{ background: T.gold, color: "#1A1204", borderRadius: 999, fontSize: 11, padding: "1px 7px", fontWeight: 700 }}>{c.unread}</span>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: 14, borderBottom: `1px solid ${T.border}`, fontWeight: 700, ...display }}>
          {findUser(CHATS.find((c) => c.id === active).uid).name}
        </div>
        <div style={{ flex: 1, padding: 16, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          {threads[active].map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: m.from === "me" ? "flex-end" : "flex-start",
                background: m.from === "me" ? T.periwinkle : T.surfaceAlt,
                color: m.from === "me" ? "#0E1016" : T.text,
                padding: "8px 12px", borderRadius: 14, maxWidth: "70%", fontSize: 14, ...body,
              }}
            >
              {m.text}
            </div>
          ))}
        </div>
        <div style={{ padding: 12, borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Message…"
            style={{
              flex: 1, background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 8,
              padding: "8px 12px", color: T.text, outline: "none", ...body, fontSize: 14,
            }}
          />
          <button onClick={send} style={{ background: T.gold, border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}>
            <Send size={16} color="#1A1204" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Copy trading ----------
function CopyTrading({ people, setPeople, copying, setCopying, alloc, setAlloc }) {
  const toggleCopy = (uid) => setCopying((c) => ({ ...c, [uid]: !c[uid] }));

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 20px" }}>
      <h2 style={{ ...display, fontSize: 20, marginBottom: 4 }}>Copy trading</h2>
      <p style={{ color: T.muted, fontSize: 13, marginBottom: 18 }}>Simulated allocations — no real funds move in this demo.</p>
      {people.map((p) => (
        <div key={p.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar initials={p.avatar} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, ...display, fontSize: 15 }}>{p.name}</div>
              <div style={{ color: T.muted, fontSize: 13 }}>{p.handle} · {p.followers.toLocaleString()} followers</div>
            </div>
            <div style={{ textAlign: "right" }}><div style={{ ...mono, fontSize: 15, fontWeight: 700, color: p.roi >= 0 ? T.teal : T.rose }}>
                {p.roi >= 0 ? "+" : ""}{p.roi}%
              </div>
              <div style={{ color: T.muted, fontSize: 11 }}>90d ROI</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12 }}>
            <button
              onClick={() => toggleCopy(p.id)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8,
                border: `1px solid ${T.border}`, cursor: "pointer", fontWeight: 600, fontSize: 13, ...body,
                background: copying[p.id] ? T.teal : "transparent", color: copying[p.id] ? "#08211A" : T.text,
              }}
            >
              <Copy size={14} /> {copying[p.id] ? "Copying" : "Copy"}
            </button>
            {copying[p.id] && (
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="range" min={1} max={50} value={alloc[p.id]}
                  onChange={(e) => setAlloc((a) => ({ ...a, [p.id]: Number(e.target.value) }))}
                  style={{ flex: 1, accentColor: T.gold }}
                />
                <span style={{ ...mono, fontSize: 12, color: T.muted, minWidth: 70 }}>{alloc[p.id]}% of portfolio</span>
              </div>
            )}
            <div style={{ marginLeft: "auto" }}>
              <ShareMenu text={`I'm copy-trading ${p.handle} on LedgerSocial — ${p.roi >= 0 ? "+" : ""}${p.roi}% 90d ROI`} urlPath={`/trader/${p.id}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Cumulative performance ----------
function PerformanceCard({ data }) {
  const current = data[data.length - 1].pct;
  const start = data[0].pct;
  const positive = current >= start;

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 18, marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ color: T.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6 }}>
            Cumulative return
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ ...mono, fontSize: 34, fontWeight: 700, color: positive ? T.teal : T.rose }}>
              {positive ? "+" : ""}{current.toFixed(1)}%
            </span>
            <span style={{ color: T.muted, fontSize: 12 }}>since account start</span>
          </div>
        </div>
        <Pill tone={positive ? "teal" : "rose"}>
          {positive ? <TrendingUp size={11} style={{ marginRight: 4 }} /> : <TrendingDown size={11} style={{ marginRight: 4 }} />}
          {data.length} data points
        </Pill>
      </div>
      <div style={{ marginTop: 10 }}>
        <ShareMenu text={`My cumulative return on LedgerSocial is ${positive ? "+" : ""}${current.toFixed(1)}% 📈`} urlPath="/portfolio" />
      </div>
      <div style={{ height: 140, marginTop: 10 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={T.border} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" stroke={T.muted} fontSize={11} tickLine={false} axisLine={{ stroke: T.border }} />
            <YAxis stroke={T.muted} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: T.text }}
              formatter={(v) => [`${v.toFixed(1)}%`, "Cumulative"]}
            />
            <Line type="monotone" dataKey="pct" stroke={T.gold} strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ---------- Affiliate ----------
function Affiliate({ referrals }) {
  const [copied, setCopied] = useState(false);
  const code = "you-8421";
  const link = `ledgersocial.app/join/${code}`;
  const commissionRate = 20;
  const totalEarned = referrals.reduce((s, r) => s + r.earned, 0);
  const activeCount = referrals.filter((r) => r.status === "active").length;

  const copyLink = () => {
    try { navigator.clipboard && navigator.clipboard.writeText(`https://${link}`); } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 20px" }}>
      <h2 style={{ ...display, fontSize: 20, marginBottom: 4 }}>Affiliate program</h2>
      <p style={{ color: T.muted, fontSize: 13, marginBottom: 18 }}>Earn a share of trading fees from people you invite. Simulated for this demo.</p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
        {[
          { label: "Referrals", value: referrals.length },
          { label: "Active", value: activeCount },
          { label: "Commission rate", value: `${commissionRate}%` },
          { label: "Total earned", value: `$${totalEarned.toFixed(2)}` },
        ].map((s) => (
          <div key={s.label} style={{ flex: "1 1 130px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 14 }}>
            <div style={{ color: T.muted, fontSize: 11, marginBottom: 4 }}>{s.label}</div>
            <div style={{ ...mono, fontSize: 18, fontWeight: 700 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, ...display, fontWeight: 700, fontSize: 14 }}>
          <Share2 size={16} color={T.gold} /> Your referral link
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200, background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 8, padding: "9px 12px", ...mono, fontSize: 13, color: T.text, display: "flex", alignItems: "center", gap: 8 }}>
            <Link2 size={14} color={T.muted} /> {link}
          </div>
          <button
            onClick={copyLink}
            style={{ padding: "9px 16px", borderRadius: 8, border: "none", background: copied ? T.teal : T.gold, color: "#1A1204", fontWeight: 700, fontSize: 13, cursor: "pointer", ...body }}
          >
            {copied ? "Copied ✓" : "Copy link"}
          </button>
        </div>
        <div style={{ color: T.muted, fontSize: 12, marginTop: 8 }}>
          Code: <span style={{ ...mono, color: T.text }}>{code}</span> · you earn {commissionRate}% of trading fees generated by anyone who signs up through it.
        </div>
      </div>

      <div style={{ color: T.muted, fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Your referrals</div>
      {referrals.map((r) => (
        <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 12, marginBottom: 8 }}>
          <Avatar initials={r.name.split(" ").map((n) => n[0]).join("")} size={34} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</div>
            <div style={{ color: T.muted, fontSize: 12 }}>Joined {r.joined}</div>
          </div>
          <Pill tone={r.status === "active" ? "teal" : "muted"}>{r.status}</Pill>
          <div style={{ ...mono, fontSize: 13, minWidth: 60, textAlign: "right", color: T.text }}>${r.earned.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
}

// ---------- Invest ----------
function Invest({ balances, setBalances, investments, setInvestments, onAdvance }) {
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState(null);

  const usdt = balances.USDT || 0;

  const invest = (plan) => {
    const amt = parseFloat(amount);
    if (!amt || amt < plan.min) { setMsg({ ok: false, text: `Minimum investment is $${plan.min}.` }); return; }
    if (amt > usdt) { setMsg({ ok: false, text: "Insufficient USDT balance." }); return; }
    setBalances((b) => ({ ...b, USDT: b.USDT - amt }));
    setInvestments((inv) => [...inv, { id: "iv" + Date.now(), plan: plan.name, apr: plan.apr, amount: amt, duration: plan.duration, progress: 0 }]);
    setMsg({ ok: true, text: `Invested $${amt} in ${plan.name} (simulated).` });
    setAmount(""); setSelected(null);
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 20px" }}>
      <h2 style={{ ...display, fontSize: 20, marginBottom: 4 }}>Invest</h2>
      <p style={{ color: T.muted, fontSize: 13, marginBottom: 4 }}>Simulated yield pools funded from your USDT balance.</p>
      <p style={{ color: T.muted, fontSize: 12, marginBottom: 18 }}>Available: <span style={{ ...mono, color: T.text }}>${usdt.toFixed(2)} USDT</span></p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        {INVESTMENT_PLANS.map((p) => (
          <div key={p.id} style={{ background: T.surface, border: `1px solid ${selected === p.id ? T.gold : T.border}`, borderRadius: 14, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, ...display, fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
              <PiggyBank size={16} color={T.gold} /> {p.name}
            </div>
            <div style={{ ...mono, fontSize: 24, fontWeight: 700, color: T.teal, marginBottom: 4 }}>{p.apr}% <span style={{ fontSize: 12, color: T.muted, ...body, fontWeight: 500 }}>APR</span></div>
            <div style={{ color: T.muted, fontSize: 12, marginBottom: 4 }}>Min ${p.min} · {p.duration}</div>
            <div style={{ marginBottom: 10 }}><Pill tone={p.risk === "Low" ? "teal" : p.risk === "Medium" ? "gold" : "rose"}>{p.risk} risk</Pill></div>
            {selected === p.id ? (
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`≥ ${p.min}`} inputMode="decimal"
                  style={{ ...selectStyle, ...mono, padding: "7px 10px", fontSize: 12 }}
                />
                <button onClick={() => invest(p)} style={{ padding: "7px 12px", borderRadius: 8, border: "none", background: T.gold, color: "#1A1204", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Go</button>
              </div>
            ) : (
              <button
                onClick={() => { setSelected(p.id); setMsg(null); }}
                style={{ width: "100%", padding: "8px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", color: T.text, fontWeight: 600, fontSize: 13, cursor: "pointer", ...body, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
              >
                Invest <ChevronRight size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {msg && (
        <div style={{ marginBottom: 16, fontSize: 13, color: msg.ok ? T.teal : T.rose, display: "flex", alignItems: "center", gap: 6 }}>
          {msg.ok ? <Check size={15} /> : <X size={15} />} {msg.text}
        </div>
      )}

      {investments.length > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ color: T.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Active investments</div>
            <button onClick={onAdvance} style={{ display: "flex", alignItems: "center", gap: 5, background: "transparent", border: `1px solid ${T.border}`, borderRadius: 999, padding: "5px 12px", color: T.periwinkle, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              <Sparkles size={13} /> Simulate 30 days
            </button>
          </div>
          {investments.map((iv) => {
            const accrued = iv.amount * (iv.apr / 100) * (iv.progress / 100);
            return (
              <div key={iv.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 14, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>{iv.plan}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ ...mono, color: T.teal }}>+${accrued.toFixed(2)}</span>
                    <ShareMenu text={`Earning ${iv.apr}% APR in the ${iv.plan} on LedgerSocial — up $${accrued.toFixed(2)} so far`} urlPath={`/invest/${iv.id}`} />
                  </span>
                </div>
                <div style={{ height: 6, background: T.surfaceAlt, borderRadius: 999, overflow: "hidden", marginBottom: 6 }}>
                  <div style={{ width: `${iv.progress}%`, height: "100%", background: T.gold, transition: "width 400ms" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.muted }}>
                  <span>${iv.amount} principal · {iv.apr}% APR</span>
                  <span>{iv.progress}% of {iv.duration} elapsed</span>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ---------- Staking ----------
function Staking({ balances, setBalances, stakes, setStakes, onAdvance }) {const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState(null);

  const stake = (asset) => {
    const amt = parseFloat(amount);
    const bal = balances[asset.sym] || 0;
    if (!amt || amt < asset.min) { setMsg({ ok: false, text: `Minimum stake is ${asset.min} ${asset.sym}.` }); return; }
    if (amt > bal) { setMsg({ ok: false, text: `Insufficient ${asset.sym} balance.` }); return; }
    setBalances((b) => ({ ...b, [asset.sym]: b[asset.sym] - amt }));
    setStakes((s) => [...s, { id: "sk" + Date.now(), sym: asset.sym, apy: asset.apy, amount: amt, lockup: asset.lockup, progress: 0 }]);
    setMsg({ ok: true, text: `Staked ${amt} ${asset.sym} (simulated).` });
    setAmount(""); setSelected(null);
  };

  const unstake = (id) => {
    setStakes((s) => {
      const rec = s.find((x) => x.id === id);
      if (!rec) return s;
      const reward = rec.amount * (rec.apy / 100) * (rec.progress / 100);
      setBalances((b) => ({ ...b, [rec.sym]: (b[rec.sym] || 0) + rec.amount + reward }));
      return s.filter((x) => x.id !== id);
    });
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 20px" }}>
      <h2 style={{ ...display, fontSize: 20, marginBottom: 4 }}>Staking</h2>
      <p style={{ color: T.muted, fontSize: 13, marginBottom: 18 }}>Lock assets to earn simulated yield. Unstake anytime to reclaim principal plus accrued rewards.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginBottom: 24 }}>
        {STAKING_ASSETS.map((a) => (
          <div key={a.sym} style={{ background: T.surface, border: `1px solid ${selected === a.sym ? T.gold : T.border}`, borderRadius: 14, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, ...display, fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
              <Lock size={15} color={T.gold} /> {a.sym}
            </div>
            <div style={{ ...mono, fontSize: 24, fontWeight: 700, color: T.teal, marginBottom: 4 }}>{a.apy}% <span style={{ fontSize: 12, color: T.muted, ...body, fontWeight: 500 }}>APY</span></div>
            <div style={{ color: T.muted, fontSize: 12, marginBottom: 10 }}>Min {a.min} {a.sym} · {a.lockup}</div>
            {selected === a.sym ? (
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`≥ ${a.min}`} inputMode="decimal"
                  style={{ ...selectStyle, ...mono, padding: "7px 10px", fontSize: 12 }}
                />
                <button onClick={() => stake(a)} style={{ padding: "7px 12px", borderRadius: 8, border: "none", background: T.gold, color: "#1A1204", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Go</button>
              </div>
            ) : (
              <button
                onClick={() => { setSelected(a.sym); setMsg(null); }}
                style={{ width: "100%", padding: "8px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", color: T.text, fontWeight: 600, fontSize: 13, cursor: "pointer", ...body, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
              >
                Stake <ChevronRight size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {msg && (
        <div style={{ marginBottom: 16, fontSize: 13, color: msg.ok ? T.teal : T.rose, display: "flex", alignItems: "center", gap: 6 }}>
          {msg.ok ? <Check size={15} /> : <X size={15} />} {msg.text}
        </div>
      )}

      {stakes.length > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ color: T.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Active stakes</div>
            <button onClick={onAdvance} style={{ display: "flex", alignItems: "center", gap: 5, background: "transparent", border: `1px solid ${T.border}`, borderRadius: 999, padding: "5px 12px", color: T.periwinkle, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              <Sparkles size={13} /> Simulate 30 days
            </button>
          </div>
          {stakes.map((sk) => {
            const reward = sk.amount * (sk.apy / 100) * (sk.progress / 100);
            return (
              <div key={sk.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 14, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>{sk.amount} {sk.sym} staked</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ ...mono, color: T.teal }}>+{reward.toFixed(4)} {sk.sym}</span>
                    <button
                      onClick={() => unstake(sk.id)}
                      style={{ display: "flex", alignItems: "center", gap: 4, background: "transparent", border: `1px solid ${T.border}`, borderRadius: 999, padding: "3px 10px", color: T.text, fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                    >
                      <Unlock size={11} /> Unstake
                    </button>
                  </span>
                </div>
                <div style={{ height: 6, background: T.surfaceAlt, borderRadius: 999, overflow: "hidden", marginBottom: 6 }}>
                  <div style={{ width: `${sk.progress}%`, height: "100%", background: T.gold, transition: "width 400ms" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.muted }}>
                  <span>{sk.apy}% APY · {sk.lockup}</span>
                  <span>{sk.progress}% accrued</span>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ---------- Drop ----------
function Drop({ drops, setDrops, balances, setBalances }) {
  const claim = (id) => {
    setDrops((ds) => {
      const rec = ds.find((d) => d.id === id);
      if (!rec || rec.claimed) return ds;
      setBalances((b) => ({ ...b, [rec.token]: (b[rec.token] || 0) + rec.amount }));
      return ds.map((d) => (d.id === id ? { ...d, claimed: true } : d));
    });
  };

  const claimedCount = drops.filter((d) => d.claimed).length;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 20px" }}>
      <h2 style={{ ...display, fontSize: 20, marginBottom: 4 }}>Drops</h2>
      <p style={{ color: T.muted, fontSize: 13, marginBottom: 4 }}>Claimable token rewards for eligible activity. Simulated balances only.</p>
      <p style={{ color: T.muted, fontSize: 12, marginBottom: 18 }}>{claimedCount} of {drops.length} claimed</p>

      {drops.map((d) => (
        <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 14, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: `${T.gold}1A`, border: `1px solid ${T.gold}44`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Gift size={20} color={T.gold} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, ...display, fontSize: 15 }}>{d.name}</div>
            <div style={{ color: T.muted, fontSize: 12 }}>Eligibility: {d.eligibility}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ ...mono, fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{d.amount} {d.token}</div>
            {d.claimed ? (
              <Pill tone="teal"><Check size={11} style={{ marginRight: 3 }} />Claimed</Pill>
            ) : (
              <button
                onClick={() => claim(d.id)}
                style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: T.gold, color: "#1A1204", fontWeight: 700, fontSize: 12, cursor: "pointer", ...body }}
              >
                Claim
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Wallet ----------
function Wallet_({ balances, setBalances, log, setLog, cumulative }) {
  const [mode, setMode] = useState("deposit"); // deposit | withdraw | exchange
  const [platformType, setPlatformType] = useState("cex"); // cex | dex | cold
  const [platform, setPlatform] = useState(CEX[0]);
  const [asset, setAsset] = useState("BTC");
  const [toAsset, setToAsset] = useState("ETH");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState(null);

  const platformList = platformType === "cex" ? CEX : platformType === "dex" ? DEX : COLD;

  const submit = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setStatus({ ok: false, msg: "Enter a valid amount." }); return; }
    setBalances((b) => {
      const nb = { ...b };
      if (mode === "deposit") nb[asset] = (nb[asset] || 0) + amt;
      if (mode === "withdraw") {
        if ((nb[asset] || 0) < amt) { setStatus({ ok: false, msg: `Insufficient ${asset} balance.` }); return b; }
        nb[asset] = nb[asset] - amt;
      }
      if (mode === "exchange") {
        if ((nb[asset] || 0) < amt) { setStatus({ ok: false, msg: `Insufficient ${asset} balance.` }); return b; }
        const rate = (TICKERS.find((t) => t.sym === asset)?.price || 1) / (TICKERS.find((t) => t.sym === toAsset)?.price || 1);
        nb[asset] -= amt;
        nb[toAsset] = (nb[toAsset] || 0) + amt * rate;
      }
      return nb;
    });
    setStatus({ ok: true, msg: `${mode === "deposit" ? "Deposited" : mode === "withdraw" ? "Withdrew" : "Exchanged"} ${amt} ${asset} via ${platform} (simulated).` });
    setLog((l) => [{ id: Date.now(), mode, asset, toAsset: mode === "exchange" ? toAsset : null, amt, platform }, ...l]);
    setAmount("");
  };

  const modeBtn = (key, label, Icon) => (
    <button
      onClick={() => { setMode(key); setStatus(null); }}
      style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        padding: "10px 0", borderRadius: 10, border: `1px solid ${T.border}`, cursor: "pointer",
        background: mode === key ? T.surfaceAlt : "transparent", color: mode === key ? T.text : T.muted,
        fontWeight: 600, fontSize: 13, ...body,
      }}
    >
      <Icon size={15} /> {label}
    </button>
  );

  const typeBtn = (key, label, Icon) => (
    <button
      onClick={() => { setPlatformType(key); setPlatform((key === "cex" ? CEX : key === "dex" ? DEX : COLD)[0]); }}
      style={{
        display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999,
        border: `1px solid ${T.border}`, cursor: "pointer", fontSize: 12, fontWeight: 600, ...body,
        background: platformType === key ? T.gold : "transparent", color: platformType === key ? "#1A1204" : T.muted,
      }}
    >
      <Icon size={13} /> {label}
    </button>
  );

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 20px" }}>
      <h2 style={{ ...display, fontSize: 20, marginBottom: 4 }}>Wallet</h2>
      <p style={{ color: T.muted, fontSize: 13, marginBottom: 18 }}>Simulated balances only — connect flows are mocked, no real funds move.</p>

      <PerformanceCard data={cumulative} />

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
        {Object.entries(balances).map(([sym, bal]) => (
          <div key={sym} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "10px 16px", minWidth: 120 }}>
            <div style={{ color: T.muted, fontSize: 11, ...mono }}>{sym}</div>
            <div style={{ fontSize: 16, fontWeight: 700, ...mono }}>{bal.toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
          </div>
        ))}
      </div>

      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 18 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {modeBtn("deposit", "Deposit", ArrowDownToLine)}
          {modeBtn("withdraw", "Withdraw", ArrowUpFromLine)}
          {modeBtn("exchange", "Exchange", ArrowLeftRight)}
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ color: T.muted, fontSize: 12, marginBottom: 6, ...body }}>Platform type</div>
          <div style={{ display: "flex", gap: 8 }}>
            {typeBtn("cex", "Centralized", Landmark)}
            {typeBtn("dex", "Decentralized", Server)}
            {typeBtn("cold", "Cold wallet", ShieldCheck)}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
          <div style={{ flex: 1, minWidth: 140 }}><div style={{ color: T.muted, fontSize: 12, marginBottom: 6 }}>Provider</div>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={selectStyle}>
              {platformList.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 100 }}>
            <div style={{ color: T.muted, fontSize: 12, marginBottom: 6 }}>Asset</div>
            <select value={asset} onChange={(e) => setAsset(e.target.value)} style={selectStyle}>
              {TICKERS.map((t) => <option key={t.sym}>{t.sym}</option>)}
            </select>
          </div>
          {mode === "exchange" && (
            <div style={{ flex: 1, minWidth: 100 }}>
              <div style={{ color: T.muted, fontSize: 12, marginBottom: 6 }}>To</div>
              <select value={toAsset} onChange={(e) => setToAsset(e.target.value)} style={selectStyle}>
                {TICKERS.map((t) => <option key={t.sym}>{t.sym}</option>)}
              </select>
            </div>
          )}
          <div style={{ flex: 1, minWidth: 120 }}>
            <div style={{ color: T.muted, fontSize: 12, marginBottom: 6 }}>Amount</div>
            <input
              value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" inputMode="decimal"
              style={{ ...selectStyle, ...mono }}
            />
          </div>
        </div>

        {platformType === "cold" && (
          <div style={{ background: T.surfaceAlt, borderRadius: 10, padding: 12, marginBottom: 14, fontSize: 12, color: T.muted, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <ShieldCheck size={16} color={T.teal} style={{ flexShrink: 0, marginTop: 1 }} />
            Cold wallet flows generate a receive address for you to sign on-device. Nothing leaves your hardware wallet without physical confirmation.
          </div>
        )}

        <button onClick={submit} style={{ width: "100%", padding: "11px 0", borderRadius: 10, border: "none", background: T.gold, color: "#1A1204", fontWeight: 700, fontSize: 14, cursor: "pointer", ...body }}>
          Confirm {mode}
        </button>

        {status && (
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: status.ok ? T.teal : T.rose }}>
            {status.ok ? <Check size={15} /> : <X size={15} />} {status.msg}
          </div>
        )}
      </div>

      {log.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={{ color: T.muted, fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Recent activity</div>
          {log.slice(0, 6).map((l) => (
            <div key={l.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.border}`, fontSize: 13 }}>
              <span style={{ color: T.text, textTransform: "capitalize" }}>{l.mode} · {l.platform}</span>
              <span style={{ ...mono, color: T.muted }}>
                {l.amt} {l.asset}{l.toAsset ? ` → ${l.toAsset}` : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const selectStyle = {
  width: "100%", background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 8,
  padding: "8px 10px", color: "#EDEFF5", outline: "none", fontSize: 13,
};

// ---------- App shell ----------
const PERSONAL_KEY = "app-state";
const POSTS_KEY = "posts";

function LoadingScreen() {
  return (
    <div style={{ background: T.bg, color: T.muted, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", ...body, fontSize: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${T.border}`, borderTopColor: T.gold, animation: "spin 800ms linear infinite" }} />
        Loading your data…
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("feed");
  const [loaded, setLoaded] = useState(false);
  const [syncState, setSyncState] = useState("idle"); // idle | saving | error

  const [people, setPeople] = useState(PEOPLE);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [groups, setGroups] = useState(GROUPS);
  const [balances, setBalances] = useState({ BTC: 0.42, ETH: 3.1, USDT: 1250 });
  const [log, setLog] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [referrals] = useState(INITIAL_REFERRALS);
  const [cumulative, setCumulative] = useState(INITIAL_CUMULATIVE);
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [copying, setCopying] = useState(INITIAL_COPYING);
  const [alloc, setAlloc] = useState(INITIAL_ALLOC);
  const [stakes, setStakes] = useState([]);
  const [drops, setDrops] = useState(INITIAL_DROPS);

  const loadedRef = useRef(false);
  const saveTimer = useRef(null);

  // ---- initial load from persistent storage ----
  useEffect(() => {
    (async () => {
      try {
        const personal = await window.storage.get(PERSONAL_KEY, false);
        if (personal && personal.value) {
          const s = JSON.parse(personal.value);
          if (s.people) setPeople(s.people);
          if (s.groups) setGroups(s.groups);
          if (s.balances) setBalances(s.balances);
          if (s.log) setLog(s.log);
          if (s.investments) setInvestments(s.investments);
          if (s.cumulative) setCumulative(s.cumulative);
          if (s.threads) setThreads(s.threads);
          if (s.copying) setCopying(s.copying);
          if (s.alloc) setAlloc(s.alloc);
          if (s.stakes) setStakes(s.stakes);
          if (s.drops) setDrops(s.drops);
        }
      } catch (e) {
        // no personal record yet — first run, defaults stand
      }
      try {
        const shared = await window.storage.get(POSTS_KEY, true);
        if (shared && shared.value) setPosts(JSON.parse(shared.value));
        else await window.storage.set(POSTS_KEY, JSON.stringify(INITIAL_POSTS), true);
      } catch (e) {
        try { await window.storage.set(POSTS_KEY, JSON.stringify(INITIAL_POSTS), true); } catch (e2) {}
      }
      loadedRef.current = true;
      setLoaded(true);
    })();
  }, []);

  // ---- persist private state (debounced, single combined key) ----
  useEffect(() => {
    if (!loadedRef.current) return;
    setSyncState("saving");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        const payload = JSON.stringify({ people, groups, balances, log, investments, cumulative, threads, copying, alloc, stakes, drops });
        const res = await window.storage.set(PERSONAL_KEY, payload, false);
        setSyncState(res ? "idle" : "error");
      } catch (e) {
        setSyncState("error");
      }
    }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [people, groups, balances, log, investments, cumulative, threads, copying, alloc, stakes, drops]);

  // ---- persist shared feed whenever posts change ----
  useEffect(() => {
    if (!loadedRef.current) return;
    (async () => {
      try {
        await window.storage.set(POSTS_KEY, JSON.stringify(posts), true);
      } catch (e) {
        setSyncState("error");
      }
    })();
  }, [posts]);

  const advanceInvestments = () => {
    setInvestments((inv) => inv.map((iv) => ({ ...iv, progress: Math.min(100, iv.progress + 20) })));
    setStakes((sk) => sk.map((s) => ({ ...s, progress: Math.min(100, s.progress + 20) })));
    setCumulative((c) => {
      const last = c[c.length - 1].pct;
      const bump = 2 + Math.random() * 4;
      const next = [...c, { label: `+${c.length}`, pct: Math.round((last + bump) * 10) / 10 }];
      return next.slice(-9);
    });
  };

  const resetDemoData = async () => {
    if (!window.confirm || window.confirm("Reset all saved demo data back to defaults?")) {
      setPeople(PEOPLE); setGroups(GROUPS); setBalances({ BTC: 0.42, ETH: 3.1, USDT: 1250 });
      setLog([]); setInvestments([]); setCumulative(INITIAL_CUMULATIVE);
      setThreads(INITIAL_THREADS); setCopying(INITIAL_COPYING); setAlloc(INITIAL_ALLOC);
      setStakes([]); setDrops(INITIAL_DROPS);
      setPosts(INITIAL_POSTS);
      try {
        await window.storage.delete(PERSONAL_KEY, false);
        await window.storage.set(POSTS_KEY, JSON.stringify(INITIAL_POSTS), true);
      } catch (e) {}
    }
  };

  if (!loaded) return <LoadingScreen />;

  return (
    <div style={{ background: T.bg, color: T.text, minHeight: "100vh", ...body }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" />
      <Ticker />
      <div style={{ display: "flex", maxWidth: 1180, margin: "0 auto" }}>
        <aside style={{ width: 220, padding: "20px 12px", flexShrink: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ ...display, fontSize: 20, fontWeight: 700, padding: "6px 14px 20px", letterSpacing: -0.5 }}>
            Ledger<span style={{ color: T.gold }}>Social</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <NavItem icon={Home} label="Feed" active={tab === "feed"} onClick={() => setTab("feed")} />
            <NavItem icon={Users} label="Groups" active={tab === "groups"} onClick={() => setTab("groups")} />
            <NavItem icon={MessageCircle} label="Chat" active={tab === "chat"} onClick={() => setTab("chat")} />
            <NavItem icon={Copy} label="Copy trading" active={tab === "copy"} onClick={() => setTab("copy")} />
            <NavItem icon={PiggyBank} label="Invest" active={tab === "invest"} onClick={() => setTab("invest")} />
            <NavItem icon={Lock} label="Staking" active={tab === "staking"} onClick={() => setTab("staking")} />
            <NavItem icon={Gift} label="Drop" active={tab === "drop"} onClick={() => setTab("drop")} />
            <NavItem icon={Share2} label="Affiliate" active={tab === "affiliate"} onClick={() => setTab("affiliate")} />
            <NavItem icon={Wallet} label="Wallet" active={tab === "wallet"} onClick={() => setTab("wallet")} />
          </div>
          <div style={{ marginTop: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 11, color: syncState === "error" ? T.rose : T.muted, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: syncState === "error" ? T.rose : syncState === "saving" ? T.gold : T.teal, flexShrink: 0 }} />
              {syncState === "error" ? "Sync failed — will retry" : syncState === "saving" ? "Saving…" : "Synced"}
            </div>
            <button
              onClick={resetDemoData}
              style={{ fontSize: 11, color: T.muted, background: "transparent", border: `1px solid ${T.border}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", ...body }}
            >
              Reset demo data
            </button>
          </div>
        </aside>
        <main style={{ flex: 1, borderLeft: `1px solid ${T.border}`, minHeight: "calc(100vh - 41px)" }}>
          {tab === "feed" && <Feed people={people} setPeople={setPeople} posts={posts} setPosts={setPosts} balances={balances} />}
          {tab === "groups" && <Groups groups={groups} setGroups={setGroups} />}
          {tab === "chat" && <div style={{ height: "calc(100vh - 41px)" }}><Chat threads={threads} setThreads={setThreads} /></div>}
          {tab === "copy" && <CopyTrading people={people} setPeople={setPeople} copying={copying} setCopying={setCopying} alloc={alloc} setAlloc={setAlloc} />}
          {tab === "invest" && <Invest balances={balances} setBalances={setBalances} investments={investments} setInvestments={setInvestments} onAdvance={advanceInvestments} />}
          {tab === "staking" && <Staking balances={balances} setBalances={setBalances} stakes={stakes} setStakes={setStakes} onAdvance={advanceInvestments} />}
          {tab === "drop" && <Drop drops={drops} setDrops={setDrops} balances={balances} setBalances={setBalances} />}
          {tab === "affiliate" && <Affiliate referrals={referrals} />}
          {tab === "wallet" && <Wallet_ balances={balances} setBalances={setBalances} log={log} setLog={setLog} cumulative={cumulative} />}
        </main>
      </div>
    </div>
  );
}
