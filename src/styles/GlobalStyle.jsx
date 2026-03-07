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
    `}</style>
  );
}
