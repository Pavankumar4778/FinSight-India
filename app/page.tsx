"use client";

import { useEffect, useState, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MacroPulse {
  dxy_trend: string;
  us_real_yield: string;
  market_volatility_vix: string;
  global_sentiment: string;
}

interface QuantData {
  rsi: number;
  ema_proximity: string;
  delivery_surge: string;
  momentum_10d: string;
  news_sentiment: number;
  current_price: number;
}

interface FundamentalData {
  roe: string;
  revenue_growth: string;
  pe_ratio: number;
  debt_equity: number;
}

interface ShortTermEquity {
  ticker: string;
  company_name: string;
  sector: string;
  probability: number;
  direction: "UPWARD" | "DOWNWARD";
  catalyst: string;
  risk_reward: string;
  quant_data: QuantData;
  fundamental_data: FundamentalData;
  is_premium: boolean;
}

interface LongTermEquity {
  ticker: string;
  company_name: string;
  sector: string;
  probability: number;
  horizon: string;
  structural_drivers: string;
  fundamental_data: FundamentalData;
  is_premium: boolean;
}

interface PreciousMetal {
  asset_name: string;
  spot_price_usd: number;
  probability: number;
  bias: string;
  macro_drivers: string;
  is_premium: boolean;
}

interface MutualFund {
  fund_name: string;
  category: string;
  amc: string;
  probability: number;
  alpha_rating: string;
  sharpe_ratio: string;
  cagr_3yr: string;
  action_outlook: string;
  is_premium: boolean;
}

interface Payload {
  generation_timestamp: string;
  pipeline_version: string;
  vix_at_generation: number;
  governor_active: boolean;
  macro_pulse: MacroPulse;
  short_term_equities: ShortTermEquity[];
  long_term_equities: LongTermEquity[];
  precious_metals: PreciousMetal[];
  mutual_funds: MutualFund[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function probColor(p: number) {
  if (p >= 85) return "text-emerald-400";
  if (p >= 75) return "text-emerald-500/80";
  if (p >= 65) return "text-amber-400";
  return "text-rose-400";
}

function probBarColor(p: number) {
  if (p >= 85) return "bg-emerald-500";
  if (p >= 75) return "bg-emerald-600";
  if (p >= 65) return "bg-amber-500";
  return "bg-rose-500";
}

function formatTs(ts: string) {
  try {
    return new Date(ts).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }) + " IST";
  } catch { return ts; }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PremiumGate({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <div className="blur-sm select-none pointer-events-none text-slate-400 font-mono text-sm">
        {name || "████████████████"}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={() => setOpen(true)}
          className="bg-amber-500/20 border border-amber-500/50 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full hover:bg-amber-500/30 transition-colors"
        >
          🔒 PREMIUM
        </button>
      </div>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative bg-slate-900 border border-zinc-700 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Institutional-Grade Vector</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Unlock full quantitative research deck, multi-vector accordion, and live conviction metrics for this asset.
              </p>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-4 mb-6 border border-zinc-700/50">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">One-time unlock</span>
                <span className="text-emerald-400 font-mono font-bold text-xl">₹29</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">Instant access · No subscription</div>
            </div>
            <a
              href="upi://pay?pa=finsightindia@upi&pn=FinSight+India&am=29&tn=Premium+Asset+Unlock&cu=INR"
              className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center py-3 rounded-xl transition-colors mb-3"
            >
              Pay ₹29 via UPI
            </a>
            <div className="flex gap-3 justify-center text-xs text-slate-500">
              <span>GPay</span><span>·</span><span>PhonePe</span><span>·</span><span>Paytm</span><span>·</span><span>BHIM</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 text-lg"
            >✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfidenceMeter({ probability }: { probability: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${probBarColor(probability)}`}
          style={{ width: `${probability}%` }}
        />
      </div>
      <span className={`font-mono font-bold text-sm tabular-nums ${probColor(probability)}`}>
        {probability}%
      </span>
    </div>
  );
}

type AccordionTab = "corporate" | "macro" | "trends" | "quant";

function STEquityCard({ item }: { item: ShortTermEquity }) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<AccordionTab>("corporate");

  const tabs: { id: AccordionTab; label: string }[] = [
    { id: "corporate", label: "Corporate" },
    { id: "macro",     label: "Macro" },
    { id: "trends",    label: "Trends" },
    { id: "quant",     label: "Quant" },
  ];

  return (
    <div className="bg-slate-900 border border-zinc-800/60 rounded-xl overflow-hidden hover:border-zinc-700/80 transition-colors">
      <div
        className="p-5 cursor-pointer"
        onClick={() => !item.is_premium && setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono font-bold text-white text-sm tracking-wider">
                {item.is_premium ? <PremiumGate name={item.ticker} /> : item.ticker}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  item.direction === "UPWARD"
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                }`}
              >
                {item.direction === "UPWARD" ? "↑" : "↓"} {item.direction}
              </span>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-xs border border-zinc-700/50">
                {item.sector}
              </span>
            </div>
            {!item.is_premium && (
              <div className="text-slate-400 text-xs">{item.company_name}</div>
            )}
          </div>
          <div className="text-right ml-4 shrink-0">
            <div className="text-xs text-slate-500 mb-1">R:R {item.risk_reward}</div>
            <div className={`font-mono font-bold text-lg ${probColor(item.probability)}`}>
              {item.probability}%
            </div>
          </div>
        </div>
        <ConfidenceMeter probability={item.probability} />
        {!item.is_premium && (
          <p className="text-slate-400 text-xs mt-3 leading-relaxed line-clamp-2">{item.catalyst}</p>
        )}
        {item.is_premium && (
          <div className="mt-3 text-xs text-amber-500/70 italic">
            Unlock to view catalyst analysis and full research deck.
          </div>
        )}
      </div>

      {expanded && !item.is_premium && (
        <div className="border-t border-zinc-800/60">
          <div className="flex border-b border-zinc-800/60">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
                  tab === t.id
                    ? "text-emerald-400 bg-emerald-500/5 border-b-2 border-emerald-500"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="p-4">
            {tab === "corporate" && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Return on Equity", item.fundamental_data.roe],
                  ["Revenue Growth", item.fundamental_data.revenue_growth],
                  ["P/E Ratio", String(item.fundamental_data.pe_ratio)],
                  ["Debt / Equity", String(item.fundamental_data.debt_equity)],
                ].map(([k, v]) => (
                  <div key={k} className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-slate-500 text-xs mb-1">{k}</div>
                    <div className="text-white font-mono font-semibold text-sm">{v || "—"}</div>
                  </div>
                ))}
              </div>
            )}
            {tab === "macro" && (
              <p className="text-slate-300 text-xs leading-relaxed">{item.catalyst}</p>
            )}
            {tab === "trends" && (
              <div className="space-y-2">
                {[
                  ["10-Day Momentum", item.quant_data.momentum_10d],
                  ["EMA Proximity", item.quant_data.ema_proximity],
                  ["News Sentiment", item.quant_data.news_sentiment > 0 ? `+${item.quant_data.news_sentiment} (Bullish)` : `${item.quant_data.news_sentiment} (Bearish)`],
                ].map(([k, v]) => (
                  <div key={String(k)} className="flex justify-between items-center py-2 border-b border-zinc-800/40 last:border-0">
                    <span className="text-slate-400 text-xs">{k}</span>
                    <span className="text-white font-mono text-xs font-semibold">{String(v)}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === "quant" && (
              <div className="space-y-2">
                {[
                  ["RSI (14)", String(item.quant_data.rsi)],
                  ["Delivery Surge", item.quant_data.delivery_surge],
                  ["Current Price", `₹${item.quant_data.current_price}`],
                  ["Risk : Reward", item.risk_reward],
                ].map(([k, v]) => (
                  <div key={String(k)} className="flex justify-between items-center py-2 border-b border-zinc-800/40 last:border-0">
                    <span className="text-slate-400 text-xs">{k}</span>
                    <span className="text-white font-mono text-xs font-semibold">{String(v)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LTEquityCard({ item }: { item: LongTermEquity }) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<AccordionTab>("corporate");

  return (
    <div className="bg-slate-900 border border-zinc-800/60 rounded-xl overflow-hidden hover:border-zinc-700/80 transition-colors">
      <div className="p-5 cursor-pointer" onClick={() => !item.is_premium && setExpanded(!expanded)}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono font-bold text-white text-sm tracking-wider">
                {item.is_premium ? <PremiumGate name={item.ticker} /> : item.ticker}
              </span>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-xs border border-zinc-700/50">{item.sector}</span>
              <span className="px-2 py-0.5 bg-indigo-500/15 text-indigo-400 rounded text-xs border border-indigo-500/30 font-semibold">{item.horizon}</span>
            </div>
            {!item.is_premium && <div className="text-slate-400 text-xs">{item.company_name}</div>}
          </div>
          <div className="text-right ml-4 shrink-0">
            <div className={`font-mono font-bold text-lg ${probColor(item.probability)}`}>{item.probability}%</div>
          </div>
        </div>
        <ConfidenceMeter probability={item.probability} />
        {!item.is_premium && (
          <p className="text-slate-400 text-xs mt-3 leading-relaxed line-clamp-2">{item.structural_drivers}</p>
        )}
        {item.is_premium && (
          <div className="mt-3 text-xs text-amber-500/70 italic">Unlock for structural driver analysis.</div>
        )}
      </div>
      {expanded && !item.is_premium && (
        <div className="border-t border-zinc-800/60">
          <div className="flex border-b border-zinc-800/60">
            {(["corporate", "macro", "trends", "quant"] as AccordionTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors ${tab === t ? "text-emerald-400 bg-emerald-500/5 border-b-2 border-emerald-500" : "text-slate-500 hover:text-slate-300"}`}
              >
                {t === "corporate" ? "Corporate" : t === "macro" ? "Macro" : t === "trends" ? "Trends" : "Quant"}
              </button>
            ))}
          </div>
          <div className="p-4">
            {tab === "corporate" && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Return on Equity", item.fundamental_data.roe],
                  ["Revenue Growth", item.fundamental_data.revenue_growth],
                  ["P/E Ratio", String(item.fundamental_data.pe_ratio)],
                  ["Debt / Equity", String(item.fundamental_data.debt_equity)],
                ].map(([k, v]) => (
                  <div key={k} className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-slate-500 text-xs mb-1">{k}</div>
                    <div className="text-white font-mono font-semibold text-sm">{v || "—"}</div>
                  </div>
                ))}
              </div>
            )}
            {tab === "macro" && <p className="text-slate-300 text-xs leading-relaxed">{item.structural_drivers}</p>}
            {tab === "trends" && (
              <p className="text-slate-300 text-xs leading-relaxed">
                Structural long-term compounder. Investment horizon: <span className="text-indigo-400 font-semibold">{item.horizon}</span>.
                Sector-specific tailwinds remain intact based on latest macro scan.
              </p>
            )}
            {tab === "quant" && (
              <div className="space-y-2">
                {[
                  ["Confidence Score", `${item.probability}%`],
                  ["Investment Horizon", item.horizon],
                  ["Sector", item.sector],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center py-2 border-b border-zinc-800/40 last:border-0">
                    <span className="text-slate-400 text-xs">{k}</span>
                    <span className="text-white font-mono text-xs font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MetalCard({ item }: { item: PreciousMetal }) {
  const [expanded, setExpanded] = useState(false);
  const isBull = item.bias.includes("BULL");

  return (
    <div className="bg-slate-900 border border-zinc-800/60 rounded-xl overflow-hidden hover:border-zinc-700/80 transition-colors">
      <div className="p-5 cursor-pointer" onClick={() => !item.is_premium && setExpanded(!expanded)}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-semibold text-white text-sm">
                {item.is_premium ? <PremiumGate name={item.asset_name} /> : item.asset_name}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${isBull ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-slate-700 text-slate-400 border-zinc-600"}`}>
                {item.bias}
              </span>
            </div>
            <div className="text-slate-500 text-xs font-mono">Spot: ${item.spot_price_usd.toLocaleString()}</div>
          </div>
          <div className={`font-mono font-bold text-lg ml-4 ${probColor(item.probability)}`}>{item.probability}%</div>
        </div>
        <ConfidenceMeter probability={item.probability} />
        {!item.is_premium && (
          <p className="text-slate-400 text-xs mt-3 leading-relaxed line-clamp-2">{item.macro_drivers}</p>
        )}
      </div>
      {expanded && !item.is_premium && (
        <div className="border-t border-zinc-800/60 p-4">
          <p className="text-slate-300 text-xs leading-relaxed">{item.macro_drivers}</p>
        </div>
      )}
    </div>
  );
}

function MFCard({ item }: { item: MutualFund }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-900 border border-zinc-800/60 rounded-xl overflow-hidden hover:border-zinc-700/80 transition-colors">
      <div className="p-5 cursor-pointer" onClick={() => !item.is_premium && setExpanded(!expanded)}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs px-2 py-0.5 bg-violet-500/15 text-violet-400 border border-violet-500/30 rounded font-semibold">{item.category}</span>
              <span className="text-slate-500 text-xs">{item.amc}</span>
            </div>
            <div className="text-white text-sm font-medium leading-snug">
              {item.is_premium ? <PremiumGate name={item.fund_name} /> : item.fund_name}
            </div>
          </div>
          <div className="text-right ml-4 shrink-0">
            <div className={`font-mono font-bold text-lg ${probColor(item.probability)}`}>{item.probability}%</div>
          </div>
        </div>
        <ConfidenceMeter probability={item.probability} />
        {!item.is_premium && (
          <div className="flex gap-4 mt-3">
            <div>
              <div className="text-slate-500 text-xs">Sharpe</div>
              <div className="text-white font-mono text-sm font-bold">{item.sharpe_ratio}</div>
            </div>
            <div>
              <div className="text-slate-500 text-xs">3Y CAGR</div>
              <div className="text-emerald-400 font-mono text-sm font-bold">{item.cagr_3yr}</div>
            </div>
          </div>
        )}
      </div>
      {expanded && !item.is_premium && (
        <div className="border-t border-zinc-800/60 p-4 space-y-3">
          <p className="text-slate-300 text-xs leading-relaxed">{item.alpha_rating}</p>
          <p className="text-slate-400 text-xs leading-relaxed">{item.action_outlook}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type Tab = "short" | "long" | "metals" | "mf";

export default function FinSightDashboard() {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("short");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/high_conviction_v2.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const tabs: { id: Tab; label: string; count: number | null }[] = data ? [
    { id: "short",  label: "Short-Term Trading",      count: data.short_term_equities.length },
    { id: "long",   label: "Long-Term Compounders",   count: data.long_term_equities.length },
    { id: "metals", label: "Precious Metals",         count: data.precious_metals.length },
    { id: "mf",     label: "Mutual Fund Quant",       count: data.mutual_funds.length },
  ] : [];

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans antialiased">
      {/* ── Header ── */}
      <header className="border-b border-zinc-800/60 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <span className="text-emerald-400 text-xs font-bold">FS</span>
            </div>
            <div>
              <span className="text-white font-bold text-sm tracking-wide">FinSight</span>
              <span className="text-slate-500 text-xs ml-1.5">India · Quant Analytics</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {data?.governor_active && (
              <span className="px-2 py-1 bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-semibold rounded-full">
                ⚠ VIX GOVERNOR
              </span>
            )}
            {data && (
              <span className="text-slate-500 text-xs hidden sm:block">
                Updated {formatTs(data.generation_timestamp)}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* ── Loading / Error ── */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              <span className="text-slate-500 text-sm">Loading analytics payload…</span>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-6 text-center">
            <p className="text-rose-400 font-semibold mb-1">Payload Load Error</p>
            <p className="text-slate-400 text-sm">{error}</p>
            <p className="text-slate-500 text-xs mt-2">Ensure <code className="font-mono bg-slate-800 px-1 rounded">public/high_conviction_v2.json</code> exists and is valid.</p>
          </div>
        )}

        {data && (
          <>
            {/* ── Macro Pulse Banner ── */}
            <section>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "DXY Trend",    value: data.macro_pulse.dxy_trend,             icon: "💵" },
                  { label: "India VIX",    value: data.macro_pulse.market_volatility_vix,  icon: "📊" },
                  { label: "US Real Yield",value: data.macro_pulse.us_real_yield,          icon: "🏦" },
                  { label: "Sentiment",    value: data.macro_pulse.global_sentiment,       icon: "🌐" },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="bg-slate-900 border border-zinc-800/60 rounded-xl p-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-base">{icon}</span>
                      <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">{label}</span>
                    </div>
                    <div className="text-white font-semibold text-sm leading-snug">{value}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Tab Deck ── */}
            <section>
              <div className="flex gap-1 bg-slate-900/50 border border-zinc-800/60 rounded-xl p-1 overflow-x-auto">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      tab === t.id
                        ? "bg-emerald-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    }`}
                  >
                    {t.label}
                    {t.count !== null && (
                      <span className={`px-1.5 py-0.5 rounded-full text-xs tabular-nums ${tab === t.id ? "bg-white/20 text-white" : "bg-slate-800 text-slate-500"}`}>
                        {t.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* ── Asset Grid ── */}
            <section>
              {tab === "short" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-white font-bold text-base">Short-Term Trading Signals</h2>
                      <p className="text-slate-500 text-xs mt-0.5">1–10 day high-conviction setups · Price-action velocity · Institutional footprint</p>
                    </div>
                    <span className="text-xs text-slate-600 font-mono hidden sm:block">Horizon: 1–10 Days</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {data.short_term_equities.map((item) => (
                      <STEquityCard key={item.ticker} item={item} />
                    ))}
                  </div>
                </div>
              )}

              {tab === "long" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-white font-bold text-base">Long-Term Structural Compounders</h2>
                      <p className="text-slate-500 text-xs mt-0.5">1–3 year horizon · RoE expansion · Capex cycle beneficiaries</p>
                    </div>
                    <span className="text-xs text-slate-600 font-mono hidden sm:block">Horizon: 1–3 Years</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {data.long_term_equities.map((item) => (
                      <LTEquityCard key={item.ticker} item={item} />
                    ))}
                  </div>
                </div>
              )}

              {tab === "metals" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-white font-bold text-base">Precious Metals Market Cycles</h2>
                      <p className="text-slate-500 text-xs mt-0.5">DXY · Real yields · Central bank reserves · Geopolitical tension</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {data.precious_metals.map((item) => (
                      <MetalCard key={item.asset_name} item={item} />
                    ))}
                  </div>
                </div>
              )}

              {tab === "mf" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-white font-bold text-base">Mutual Fund Quant Track</h2>
                      <p className="text-slate-500 text-xs mt-0.5">Alpha generation · Sharpe ratio · Rolling AUM inflow momentum</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {data.mutual_funds.map((item) => (
                      <MFCard key={item.fund_name} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* ── SEBI Footer ── */}
      <footer className="mt-12 border-t border-zinc-800/60 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="bg-slate-900/50 border border-zinc-800/60 rounded-xl p-4">
            <div className="flex gap-2 items-start">
              <span className="text-amber-500 text-sm shrink-0 mt-0.5">⚖</span>
              <p className="text-slate-500 text-xs leading-relaxed">
                <span className="text-slate-400 font-semibold">Regulatory Disclosure:</span>{" "}
                FinSight India is an automated quantitative research utility. This system processes open macro indicators, corporate filing disclosures, and historical market patterns using rule-based scoring models.
                It does <span className="text-slate-300 font-semibold">not</span> provide SEBI-registered financial advisory services, personalized investment mandates, or direct execution buy/sell trade alerts.
                All probability scores are model outputs, not guarantees of future returns. Past performance of referenced instruments does not assure future results.
                Investments in securities markets are subject to market risks. Please read all scheme-related documents carefully before investing.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-slate-700 text-xs">FinSight India · Pipeline v{data?.pipeline_version ?? "—"}</span>
            <span className="text-slate-700 text-xs">Not SEBI Registered · Research Utility Only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
