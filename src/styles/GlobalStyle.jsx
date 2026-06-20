export default function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      :root {
        --font-display:'Fraunces',serif;
        --font-body:'Plus Jakarta Sans',sans-serif;
        --font-mono:'JetBrains Mono',monospace;

        --bg:#07090e;--bg2:#0c1018;--bg3:#111820;--bg4:#172030;--bg5:#1d2840;
        --border:#182236;--border2:#243550;--border3:#2e4468;
        --text:#d8e8f8;--text2:#7a9ab8;--text3:#3e5a7a;--text4:#1e3050;
        --accent:#00ccf8;--a2:#0090c0;--green:#00e5a0;--blue:#5aabff;
        --purple:#b08aff;--red:#ff6b6b;--orange:#ffaa44;--yellow:#ffd166;--pink:#f472b6;

        --nav-bg:rgba(7,9,14,.86);
        --hero-surface:rgba(12,16,24,.92);
        --hero-surface-soft:rgba(12,16,24,.7);
        --hero-card-gradient:linear-gradient(165deg, rgba(12,16,24,.95) 0%, rgba(17,24,32,.95) 100%);
        --hero-gradient:linear-gradient(135deg,#07090e 0%,#071522 35%,#0a1c2c 62%,#071019 80%,#07090e 100%);
        --hero-gridline:rgba(255,255,255,.13);
        --hero-shadow-rest:0 18px 40px rgba(0,0,0,.45);
        --hero-shadow-glow:0 22px 56px rgba(0,204,248,.16);
        --editor-shadow:0 24px 70px rgba(0,0,0,.55);
      }

      [data-theme='light'] {
        --bg:#f3f7fc;--bg2:#ffffff;--bg3:#edf3fb;--bg4:#e3ecf8;--bg5:#d7e6f7;
        --border:#d9e4f3;--border2:#c5d5ec;--border3:#95b4de;
        --text:#0f1f36;--text2:#344f71;--text3:#6a84a8;--text4:#98abc2;
        --accent:#0098cc;--a2:#0078a8;--green:#0fba82;--blue:#2f75ff;
        --purple:#7e65d8;--red:#e05a5a;--orange:#f39c35;--yellow:#d4a726;--pink:#d860a6;

        --nav-bg:rgba(243,247,252,.88);
        --hero-surface:rgba(255,255,255,.9);
        --hero-surface-soft:rgba(255,255,255,.75);
        --hero-card-gradient:linear-gradient(165deg, rgba(255,255,255,.98) 0%, rgba(236,245,255,.95) 100%);
        --hero-gradient:linear-gradient(135deg,#eef5ff 0%,#e8f3ff 35%,#dcf4fb 62%,#eaf0ff 80%,#f3f7fc 100%);
        --hero-gridline:rgba(15,31,54,.09);
        --hero-shadow-rest:0 16px 36px rgba(18,42,74,.12);
        --hero-shadow-glow:0 20px 46px rgba(0,152,204,.15);
        --editor-shadow:0 18px 48px rgba(18,42,74,.15);
      }

      * { box-sizing:border-box; margin:0; padding:0; }
      html,body,#root { height:100%; background:var(--bg); color:var(--text); }
      body {
        color:var(--text);
        font-family:var(--font-body);
        font-size:14px;
        line-height:1.5;
        -webkit-font-smoothing:antialiased;
      }
      h1,h2,h3,h4,h5,h6 {
        font-family:var(--font-display);
        letter-spacing:-0.02em;
      }
      code,pre,kbd,samp { font-family:var(--font-mono); }

      ::-webkit-scrollbar { width:3px; height:3px; }
      ::-webkit-scrollbar-track { background:transparent; }
      ::-webkit-scrollbar-thumb { background:var(--border2); border-radius:3px; }
      button { cursor:pointer; border:none; outline:none; font-family:var(--font-mono); }
      input,textarea,select {
        background:var(--bg4);
        border:1px solid var(--border2);
        border-radius:8px;
        color:var(--text);
        font-family:var(--font-body);
        font-size:14px;
        padding:9px 12px;
        outline:none;
        width:100%;
        transition:border-color .13s,box-shadow .13s,background-color .2s,color .2s;
      }
      input:focus,textarea:focus,select:focus {
        border-color:var(--accent);
        box-shadow:0 0 0 3px rgba(0,200,248,.12);
      }
      input::placeholder,textarea::placeholder { color:var(--text4); }
      a { color:var(--accent); text-decoration:none; }
      [contenteditable]:focus { outline:none; }

      @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      @keyframes gradientShift { 0% { background-position:0% 50%; } 50% { background-position:100% 50%; } 100% { background-position:0% 50%; } }
      @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
      @keyframes spin { to { transform:rotate(360deg); } }
      @keyframes slideDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
      @keyframes orb { 0%,100% { transform:scale(1) translate(0,0); } 33% { transform:scale(1.08) translate(20px,-15px); } 66% { transform:scale(.95) translate(-15px,20px); } }
      @keyframes floatY {
        0%,100% { transform:translateY(0); }
        50% { transform:translateY(-10px); }
      }
      @keyframes meshShift {
        0% { background-position:0 0,0 0; }
        100% { background-position:120px 90px,-120px -90px; }
      }
      @keyframes cardGlow {
        0%,100% { box-shadow:var(--hero-shadow-rest); }
        50% { box-shadow:var(--hero-shadow-glow); }
      }
      @keyframes stripeMove {
        0% { background-position:0 0; }
        100% { background-position:160px 0; }
      }
      @keyframes omniScroll {
        0% { transform:translateX(0); }
        100% { transform:translateX(-50%); }
      }
      .fadeIn { animation:fadeIn .3s ease forwards; }
      .slideDown { animation:slideDown .2s ease forwards; }
      .landing-main {
        max-width:1240px;
        margin:0 auto;
        padding:0 48px;
        width:100%;
      }
      .landing-nav {
        position:fixed;
        top:0;
        left:0;
        right:0;
        z-index:100;
        background:var(--nav-bg);
        backdrop-filter:blur(12px);
        border-bottom:1px solid var(--border);
        height:62px;
        display:flex;
        align-items:center;
        gap:28px;
        padding:0 48px;
        position:fixed;
      }
      .landing-nav-links {
        display:flex;
        gap:22px;
        position:absolute;
        left:54%;
        transform:translateX(-50%);
      }
      .landing-nav-actions {
        margin-left:auto;
        display:flex;
        gap:10px;
        align-items:center;
      }
      .hero-grid {
        display:grid;
        grid-template-columns:minmax(0,1fr) minmax(0,1fr);
        gap:74px;
        align-items:center;
      }
      .hero-scene {
        position:relative;
        min-height:520px;
        overflow:visible;
        isolation:isolate;
      }
      .hero-mesh {
        position:absolute;
        inset:0;
        opacity:.22;
        pointer-events:none;
        z-index:1;
        background-image:
          radial-gradient(circle at 30% 30%, rgba(0,204,248,.22) 0, transparent 55%),
          radial-gradient(circle at 75% 70%, rgba(0,229,160,.18) 0, transparent 52%);
        animation:meshShift 14s linear infinite;
      }
      .hero-float-card {
        position:absolute;
        background:var(--hero-surface);
        border:1px solid var(--border2);
        border-radius:12px;
        padding:12px 14px;
        min-width:180px;
        box-shadow:var(--hero-shadow-rest);
        animation:floatY 4.6s ease-in-out infinite;
        z-index:4;
        pointer-events:none;
      }
      .hero-float-card:nth-child(2n) {
        animation-duration:5.6s;
      }
      .hero-editor {
        position:relative;
        z-index:2;
        border-radius:18px;
        overflow:hidden;
        border:1px solid var(--border2);
        background:var(--bg2);
        box-shadow:var(--editor-shadow);
        animation:cardGlow 5.2s ease-in-out infinite;
      }
      .hero-stripe {
        height:3px;
        width:100%;
        background:linear-gradient(90deg,var(--accent) 0%, var(--blue) 35%, var(--green) 70%, var(--accent) 100%);
        background-size:160px 100%;
        animation:stripeMove 2.8s linear infinite;
      }
      .landing-stat-grid {
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:10px;
        margin-top:24px;
      }
      .landing-stat {
        background:var(--hero-surface-soft);
        border:1px solid var(--border2);
        border-radius:10px;
        padding:10px 12px;
      }
      .hero-card-grid {
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:16px;
        margin-top:30px;
      }
      .hero-card {
        background:var(--hero-card-gradient);
        border:1px solid var(--border2);
        border-radius:14px;
        padding:16px 18px;
      }
      .landing-feature-grid {
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:20px;
      }
      .omni-marquee {
        position:relative;
        overflow:hidden;
        border:1px solid var(--border);
        border-radius:10px;
        background:var(--bg2);
        padding:10px 0;
      }
      .omni-track {
        display:flex;
        align-items:center;
        gap:10px;
        width:max-content;
        min-width:200%;
        animation:omniScroll 26s linear infinite;
      }
      .omni-marquee:hover .omni-track {
        animation-play-state:paused;
      }
      .omni-pill {
        display:inline-flex;
        align-items:center;
        gap:7px;
        padding:6px 10px;
        border-radius:999px;
        border:1px solid var(--border2);
        background:var(--bg3);
        color:var(--text2);
        font-size:11px;
        font-family:var(--font-mono);
        white-space:nowrap;
      }
      @media (max-width:1100px) {
        .landing-nav {
          padding:0 24px;
          gap:18px;
        }
        .landing-main {
          padding:0 24px;
        }
        .hero-grid {
          grid-template-columns:1fr;
          gap:34px;
        }
        .hero-scene {
          min-height:560px;
        }
        .hero-editor {
          max-width:760px;
          margin:0 auto;
        }
        .hero-float-card--top {
          top:12px !important;
          right:10px !important;
        }
        .hero-float-card--left {
          top:auto !important;
          bottom:122px !important;
          left:10px !important;
        }
        .hero-float-card--bottom {
          bottom:14px !important;
          right:16px !important;
        }
        .landing-feature-grid {
          grid-template-columns:repeat(2,minmax(0,1fr));
        }
        .hero-card-grid {
          grid-template-columns:1fr;
        }
        .omni-pill {
          font-size:10px;
          padding:5px 9px;
        }
      }
      @media (max-width:760px) {
        .landing-nav-links {
          display:none;
          position:static;
          transform:none;
        }
        .landing-nav {
          padding:0 14px;
          gap:10px;
        }
        .landing-nav-actions {
          gap:6px;
        }
        .landing-main {
          padding:0 14px;
        }
        .landing-feature-grid {
          grid-template-columns:1fr;
        }
        .landing-stat-grid {
          grid-template-columns:1fr;
        }
        .hero-float-card {
          min-width:150px;
          padding:10px 11px;
        }
        .hero-float-card--left {
          display:none;
        }
        .hero-float-card--top {
          top:10px !important;
          right:6px !important;
        }
        .hero-float-card--bottom {
          left:8px !important;
          right:auto !important;
          bottom:10px !important;
        }
      }

      .scribe-landing {
        --paper:#f2eee5;
        --paper-2:#e8e0d1;
        --ink:#0b0b0c;
        --ink-2:#24211d;
        --muted:#696158;
        --muted-2:#8b8276;
        --rule:rgba(11,11,12,.14);
        --rule-soft:rgba(11,11,12,.08);
        --scribe-accent:#ff4d1f;
        --scribe-accent-deep:#d43d14;
        --scribe-gold:#c8a668;
        --scribe-moss:#3c5a3a;
        --scribe-sky:#3a5a8c;
        --scribe-plum:#5a3a6e;
        min-height:100vh;
        background:var(--paper);
        color:var(--ink);
        font-family:var(--font-body);
        overflow:hidden;
      }
      .scribe-landing button {
        font-family:var(--font-body);
      }
      .scribe-container {
        width:100%;
        max-width:1320px;
        margin:0 auto;
        padding:0 32px;
      }
      .scribe-nav {
        position:fixed;
        top:14px;
        left:0;
        right:0;
        z-index:120;
        padding:0 16px;
      }
      .scribe-nav-shell {
        max-width:1320px;
        margin:0 auto;
        min-height:54px;
        display:flex;
        align-items:center;
        gap:10px;
        border:1px solid var(--rule);
        border-radius:999px;
        padding:7px 8px 7px 16px;
        background:rgba(242,238,229,.78);
        backdrop-filter:saturate(140%) blur(18px);
        box-shadow:0 12px 36px rgba(11,11,12,.08), 0 1px 0 rgba(255,255,255,.5) inset;
      }
      .scribe-brand {
        display:inline-flex;
        align-items:center;
        gap:10px;
        color:var(--ink);
        background:transparent;
        border:0;
        white-space:nowrap;
      }
      .scribe-brand img {
        width:30px;
        height:30px;
        border-radius:8px;
        display:block;
        box-shadow:0 1px 2px rgba(11,11,12,.14);
      }
      .scribe-brand span {
        font-family:var(--font-display);
        font-size:22px;
        font-weight:600;
        letter-spacing:-.02em;
      }
      .scribe-nav-links {
        display:flex;
        align-items:center;
        gap:2px;
        padding-left:14px;
        margin-left:6px;
        border-left:1px solid var(--rule-soft);
      }
      .scribe-nav-links button,
      .scribe-footer button {
        padding:8px 12px;
        border-radius:999px;
        background:transparent;
        color:var(--ink-2);
        font-size:13px;
        transition:background .18s,color .18s,transform .18s;
      }
      .scribe-nav-links button:hover,
      .scribe-footer button:hover {
        background:var(--rule-soft);
        color:var(--ink);
      }
      .scribe-nav-actions {
        margin-left:auto;
        display:flex;
        align-items:center;
        gap:6px;
      }
      .scribe-btn {
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:8px;
        min-height:36px;
        padding:9px 15px;
        border-radius:999px;
        border:1px solid transparent;
        font-size:13px;
        font-weight:700;
        line-height:1;
        white-space:nowrap;
        transition:transform .18s,background .18s,border-color .18s,color .18s,box-shadow .18s;
      }
      .scribe-btn:hover {
        transform:translateY(-1px);
      }
      .scribe-btn-dark {
        background:var(--ink);
        color:var(--paper);
        border-color:var(--ink);
        box-shadow:0 10px 24px rgba(11,11,12,.16);
      }
      .scribe-btn-dark:hover {
        background:var(--scribe-accent);
        border-color:var(--scribe-accent);
        color:#fff;
      }
      .scribe-btn-outline {
        background:rgba(242,238,229,.5);
        color:var(--ink);
        border-color:var(--rule);
      }
      .scribe-btn-outline:hover {
        border-color:var(--ink);
        background:var(--paper);
      }
      .scribe-btn-ghost {
        color:var(--ink-2);
        background:transparent;
      }
      .scribe-btn-ghost:hover {
        background:var(--rule-soft);
      }
      .scribe-btn-lg {
        min-height:46px;
        padding:13px 20px;
        font-size:14px;
      }
      .scribe-hero {
        position:relative;
        padding:154px 0 58px;
      }
      .scribe-hero::before {
        content:"";
        position:absolute;
        inset:0;
        pointer-events:none;
        background:
          linear-gradient(115deg, rgba(255,77,31,.13), transparent 36%),
          linear-gradient(245deg, rgba(60,90,58,.12), transparent 38%),
          linear-gradient(0deg, rgba(58,90,140,.08), transparent 44%);
      }
      .scribe-grid-bg {
        position:absolute;
        inset:0;
        opacity:.45;
        pointer-events:none;
        background-image:
          linear-gradient(to right, var(--rule-soft) 1px, transparent 1px),
          linear-gradient(to bottom, var(--rule-soft) 1px, transparent 1px);
        background-size:78px 78px;
        mask-image:radial-gradient(ellipse at center, black 28%, transparent 76%);
      }
      .scribe-hero-meta {
        position:relative;
        z-index:1;
        display:flex;
        align-items:flex-end;
        justify-content:space-between;
        gap:20px;
        margin-bottom:50px;
      }
      .scribe-badge {
        display:inline-flex;
        align-items:center;
        gap:10px;
        padding:5px 14px 5px 5px;
        border:1px solid var(--rule);
        border-radius:999px;
        color:var(--ink-2);
        background:rgba(242,238,229,.72);
        backdrop-filter:blur(10px);
        font-size:13px;
      }
      .scribe-badge span {
        padding:4px 8px;
        border-radius:999px;
        background:var(--scribe-accent);
        color:#fff;
        font-family:var(--font-mono);
        font-size:10px;
        letter-spacing:.08em;
        text-transform:uppercase;
      }
      .scribe-hero-meta p {
        margin:0;
        text-align:right;
        color:var(--muted);
        font-family:var(--font-mono);
        font-size:11px;
        line-height:1.7;
        letter-spacing:.06em;
        text-transform:uppercase;
      }
      .scribe-hero-layout {
        position:relative;
        z-index:1;
        display:grid;
        grid-template-columns:minmax(0,1.08fr) minmax(360px,.92fr);
        align-items:center;
        gap:64px;
      }
      .scribe-hero h1 {
        margin:0;
        max-width:860px;
        color:var(--ink);
        font-family:var(--font-display);
        font-size:clamp(58px,8.4vw,128px);
        font-weight:500;
        line-height:.94;
        letter-spacing:-.035em;
      }
      .scribe-hero h1 em {
        color:var(--scribe-accent);
        font-style:italic;
      }
      .scribe-lead {
        max-width:580px;
        margin:26px 0 0;
        color:var(--ink-2);
        font-size:18px;
        line-height:1.65;
      }
      .scribe-hero-actions {
        display:flex;
        align-items:center;
        flex-wrap:wrap;
        gap:10px;
        margin-top:28px;
      }
      .scribe-product-frame {
        position:relative;
        border:1px solid var(--rule);
        border-radius:18px;
        background:rgba(255,252,245,.8);
        box-shadow:0 28px 70px rgba(11,11,12,.16), 0 1px 0 rgba(255,255,255,.65) inset;
      }
      .scribe-window-bar {
        height:44px;
        display:flex;
        align-items:center;
        gap:8px;
        padding:0 16px;
        border-bottom:1px solid var(--rule-soft);
      }
      .scribe-window-bar span {
        width:10px;
        height:10px;
        border-radius:50%;
        background:#ff6b6b;
      }
      .scribe-window-bar span:nth-child(2) { background:#ffaa44; }
      .scribe-window-bar span:nth-child(3) { background:#3c5a3a; }
      .scribe-window-bar b {
        margin-left:8px;
        color:var(--muted);
        font-family:var(--font-mono);
        font-size:11px;
        font-weight:500;
      }
      .scribe-editor-preview {
        padding:24px;
      }
      .scribe-doc-header {
        display:flex;
        align-items:center;
        gap:10px;
        margin-bottom:16px;
      }
      .scribe-doc-header span,
      .scribe-proof-grid article span,
      .scribe-feature-grid article span,
      .scribe-section-heading span,
      .scribe-api-band span {
        color:var(--scribe-accent-deep);
        font-family:var(--font-mono);
        font-size:10px;
        font-weight:700;
        letter-spacing:.16em;
        text-transform:uppercase;
      }
      .scribe-doc-header strong {
        color:var(--ink);
        font-size:14px;
      }
      .scribe-editor-preview h2 {
        margin:0 0 12px;
        color:var(--ink);
        font-family:var(--font-display);
        font-size:34px;
        font-weight:600;
        line-height:1.04;
      }
      .scribe-editor-preview p {
        margin:0;
        color:var(--muted);
        font-size:14px;
        line-height:1.7;
      }
      .scribe-editor-preview pre,
      .scribe-api-band pre {
        margin:18px 0 0;
        overflow:auto;
        border:1px solid var(--rule);
        border-radius:10px;
        background:#11100f;
        color:#f2eee5;
        padding:16px;
        font-family:var(--font-mono);
        font-size:12px;
        line-height:1.7;
      }
      .scribe-preview-tags {
        display:flex;
        flex-wrap:wrap;
        gap:7px;
        margin-top:16px;
      }
      .scribe-preview-tags span {
        padding:5px 9px;
        border:1px solid var(--rule);
        border-radius:999px;
        color:var(--ink-2);
        background:var(--paper);
        font-family:var(--font-mono);
        font-size:10px;
      }
      .scribe-float-note {
        position:absolute;
        min-width:180px;
        padding:12px 14px;
        border:1px solid var(--rule);
        border-radius:12px;
        background:rgba(242,238,229,.9);
        box-shadow:0 16px 36px rgba(11,11,12,.13);
      }
      .scribe-float-note small {
        display:block;
        color:var(--muted);
        font-family:var(--font-mono);
        font-size:10px;
        letter-spacing:.12em;
        margin-bottom:6px;
      }
      .scribe-float-note strong,
      .scribe-float-note code {
        color:var(--ink);
        font-size:12px;
      }
      .scribe-float-note span {
        display:block;
        margin-top:5px;
        color:var(--muted);
        font-family:var(--font-mono);
        font-size:10px;
      }
      .scribe-float-top {
        top:18px;
        right:-24px;
      }
      .scribe-float-bottom {
        right:18px;
        bottom:-26px;
      }
      .scribe-format-strip {
        position:relative;
        z-index:1;
        display:flex;
        align-items:center;
        flex-wrap:wrap;
        gap:8px;
        margin-top:58px;
        padding:14px 0;
        border-top:1px solid var(--rule);
        border-bottom:1px solid var(--rule);
      }
      .scribe-format-strip > span {
        padding-right:14px;
        margin-right:4px;
        border-right:1px solid var(--rule-soft);
        color:var(--muted);
        font-family:var(--font-mono);
        font-size:10px;
        letter-spacing:.18em;
        text-transform:uppercase;
      }
      .scribe-format-strip button {
        padding:8px 14px;
        border:1px solid var(--rule-soft);
        border-radius:999px;
        background:rgba(242,238,229,.62);
        color:var(--ink-2);
        font-size:13px;
      }
      .scribe-format-strip button.is-active {
        background:var(--ink);
        color:var(--paper);
        border-color:var(--ink);
      }
      .scribe-stat-row {
        position:relative;
        z-index:1;
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:12px;
        margin-top:24px;
      }
      .scribe-stat-row div,
      .scribe-proof-grid article,
      .scribe-feature-grid article,
      .scribe-price-grid article,
      .scribe-local-plan {
        border:1px solid var(--rule);
        border-radius:8px;
        background:rgba(255,252,245,.58);
      }
      .scribe-stat-row div {
        padding:14px 16px;
      }
      .scribe-stat-row strong {
        display:block;
        color:var(--ink);
        font-family:var(--font-display);
        font-size:28px;
        line-height:1;
      }
      .scribe-stat-row span {
        display:block;
        margin-top:6px;
        color:var(--muted);
        font-family:var(--font-mono);
        font-size:10px;
        letter-spacing:.08em;
        text-transform:uppercase;
      }
      .scribe-proof-band,
      .scribe-api-band {
        border-top:1px solid var(--rule);
        border-bottom:1px solid var(--rule);
        background:var(--paper-2);
      }
      .scribe-proof-grid {
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:16px;
        padding-top:34px;
        padding-bottom:34px;
      }
      .scribe-proof-grid article,
      .scribe-feature-grid article,
      .scribe-price-grid article {
        padding:22px;
        transition:transform .18s,box-shadow .18s,border-color .18s;
      }
      .scribe-proof-grid article:hover,
      .scribe-feature-grid article:hover,
      .scribe-price-grid article:hover {
        transform:translateY(-3px);
        border-color:rgba(11,11,12,.28);
        box-shadow:0 18px 38px rgba(11,11,12,.08);
      }
      .scribe-proof-grid h3,
      .scribe-feature-grid h3,
      .scribe-price-grid h3,
      .scribe-local-plan h3 {
        margin:12px 0 8px;
        color:var(--ink);
        font-family:var(--font-display);
        font-size:23px;
        font-weight:600;
        line-height:1.1;
      }
      .scribe-proof-grid p,
      .scribe-feature-grid p,
      .scribe-section-heading p,
      .scribe-api-band p,
      .scribe-local-plan p {
        margin:0;
        color:var(--muted);
        font-size:14px;
        line-height:1.7;
      }
      .scribe-writer-band,
      .scribe-section {
        padding:82px 0;
        background:var(--paper);
        scroll-margin-top:96px;
      }
      .scribe-section-heading {
        max-width:780px;
        margin:0 auto 34px;
        text-align:center;
      }
      .scribe-section-heading.is-split {
        max-width:none;
        display:flex;
        justify-content:space-between;
        align-items:flex-end;
        gap:24px;
        text-align:left;
      }
      .scribe-section-heading h2,
      .scribe-api-band h2 {
        margin:10px 0 0;
        color:var(--ink);
        font-family:var(--font-display);
        font-size:clamp(34px,5vw,58px);
        font-weight:500;
        line-height:1.02;
        letter-spacing:-.03em;
      }
      .scribe-section-heading p {
        margin-top:12px;
      }
      .scribe-marquee {
        overflow:hidden;
        border:1px solid var(--rule);
        border-radius:8px;
        background:rgba(255,252,245,.62);
        padding:12px 0;
      }
      .scribe-marquee div {
        display:flex;
        width:max-content;
        min-width:200%;
        gap:10px;
        animation:omniScroll 28s linear infinite;
      }
      .scribe-marquee span {
        display:inline-flex;
        align-items:center;
        min-height:34px;
        padding:7px 13px;
        border:1px solid var(--rule-soft);
        border-radius:999px;
        background:var(--paper);
        color:var(--ink-2);
        font-family:var(--font-mono);
        font-size:11px;
      }
      .scribe-feature-grid {
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:16px;
      }
      .scribe-api-grid {
        display:grid;
        grid-template-columns:minmax(0,.84fr) minmax(0,1.16fr);
        gap:54px;
        align-items:center;
        padding-top:70px;
        padding-bottom:70px;
      }
      .scribe-api-band pre {
        margin:0;
        min-height:250px;
      }
      .scribe-api-band .scribe-btn {
        margin-top:24px;
      }
      .scribe-segment-row {
        display:flex;
        justify-content:center;
        flex-wrap:wrap;
        gap:12px;
        margin-bottom:26px;
      }
      .scribe-segment {
        display:inline-flex;
        padding:4px;
        border:1px solid var(--rule);
        border-radius:999px;
        background:rgba(255,252,245,.62);
      }
      .scribe-segment button {
        padding:7px 14px;
        border-radius:999px;
        background:transparent;
        color:var(--muted);
        font-family:var(--font-mono);
        font-size:11px;
      }
      .scribe-segment button.is-active {
        background:var(--ink);
        color:var(--paper);
      }
      .scribe-price-grid {
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:18px;
      }
      .scribe-price-grid article {
        position:relative;
        display:flex;
        flex-direction:column;
        min-height:390px;
      }
      .scribe-price-grid article.is-popular {
        border-color:var(--scribe-accent);
        box-shadow:0 20px 48px rgba(255,77,31,.12);
      }
      .scribe-popular {
        position:absolute;
        top:-12px;
        left:22px;
        padding:4px 10px;
        border-radius:999px;
        background:var(--scribe-accent);
        color:#fff;
        font-family:var(--font-mono);
        font-size:10px;
        font-weight:700;
        letter-spacing:.08em;
        text-transform:uppercase;
      }
      .scribe-price {
        display:flex;
        align-items:flex-end;
        gap:6px;
        margin:18px 0;
      }
      .scribe-price strong {
        color:var(--ink);
        font-family:var(--font-display);
        font-size:42px;
        line-height:1;
      }
      .scribe-price span {
        color:var(--muted);
        font-size:13px;
      }
      .scribe-price-grid ul {
        list-style:none;
        display:flex;
        flex-direction:column;
        gap:9px;
        margin:0 0 24px;
        color:var(--ink-2);
        font-size:13px;
        line-height:1.5;
      }
      .scribe-price-grid li::before {
        content:"";
        display:inline-block;
        width:6px;
        height:6px;
        margin-right:9px;
        border-radius:50%;
        background:var(--scribe-moss);
        vertical-align:1px;
      }
      .scribe-price-grid .scribe-btn {
        width:100%;
        margin-top:auto;
      }
      .scribe-local-plan {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:20px;
        margin-top:18px;
        padding:22px;
      }
      .scribe-local-plan h3 {
        margin-top:0;
      }
      .scribe-local-plan strong {
        color:var(--scribe-moss);
        font-family:var(--font-display);
        font-size:34px;
      }
      .scribe-footer {
        padding:34px 0;
        border-top:1px solid var(--rule);
        background:var(--paper-2);
      }
      .scribe-footer .scribe-container {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:18px;
      }
      .scribe-footer div div {
        display:flex;
        align-items:center;
        flex-wrap:wrap;
        gap:2px;
      }
      .scribe-footer p {
        margin:0;
        color:var(--muted);
        font-family:var(--font-mono);
        font-size:11px;
      }
      @media (max-width:1080px) {
        .scribe-hero-layout,
        .scribe-api-grid {
          grid-template-columns:1fr;
        }
        .scribe-product-frame {
          max-width:760px;
        }
        .scribe-feature-grid,
        .scribe-proof-grid,
        .scribe-price-grid {
          grid-template-columns:repeat(2,minmax(0,1fr));
        }
        .scribe-nav-links {
          display:none;
        }
      }
      @media (max-width:720px) {
        .scribe-container {
          padding:0 18px;
        }
        .scribe-nav {
          top:10px;
          padding:0 10px;
        }
        .scribe-nav-shell {
          padding-left:12px;
        }
        .scribe-brand span {
          font-size:19px;
        }
        .scribe-nav-actions .scribe-btn-ghost {
          display:none;
        }
        .scribe-hero {
          padding-top:122px;
        }
        .scribe-hero-meta {
          align-items:flex-start;
          flex-direction:column;
          margin-bottom:34px;
        }
        .scribe-hero-meta p {
          text-align:left;
        }
        .scribe-hero h1 {
          font-size:clamp(48px,16vw,72px);
        }
        .scribe-lead {
          font-size:16px;
        }
        .scribe-product-frame {
          border-radius:14px;
        }
        .scribe-editor-preview {
          padding:18px;
        }
        .scribe-editor-preview h2 {
          font-size:28px;
        }
        .scribe-float-note {
          position:static;
          margin:10px 14px;
        }
        .scribe-format-strip > span {
          width:100%;
          border-right:0;
          padding-right:0;
        }
        .scribe-stat-row,
        .scribe-feature-grid,
        .scribe-proof-grid,
        .scribe-price-grid {
          grid-template-columns:1fr;
        }
        .scribe-section-heading.is-split,
        .scribe-local-plan,
        .scribe-footer .scribe-container {
          align-items:flex-start;
          flex-direction:column;
        }
        .scribe-section,
        .scribe-writer-band {
          padding:62px 0;
        }
      }
    `}</style>
  );
}
