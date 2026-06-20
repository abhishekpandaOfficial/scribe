import { useEffect, useMemo, useRef } from "react";
import landingDocument from "../assets/landing-index.html?raw";

function extractLandingDocument(documentText) {
  const style = documentText.match(/<style>([\s\S]*?)<\/style>/i)?.[1] || "";
  const body = documentText.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || "";
  const markup = body
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<script[^>]*\/>/gi, "")
    .replace(
      /<img src="https:\/\/cdn\.simpleicons\.org\/openai\/0B0B0C" alt="OpenAI" loading="lazy"\s*\/>/i,
      ""
    );

  return { style, markup };
}

function loadLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
    return Promise.resolve();
  }

  const existing = document.querySelector('script[data-scribe-lucide="true"]');
  if (existing) {
    return new Promise((resolve) => {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", resolve, { once: true });
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/lucide@latest";
    script.async = true;
    script.dataset.scribeLucide = "true";
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", resolve, { once: true });
    document.head.appendChild(script);
  });
}

export default function LandingScreen({ setScreen }) {
  const rootRef = useRef(null);
  const landing = useMemo(() => extractLandingDocument(landingDocument), []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return undefined;
    }

    const cleanups = [];
    document.body.classList.add("reference-landing-active");
    cleanups.push(() => document.body.classList.remove("reference-landing-active"));
    if (window.location.hash) {
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}${window.location.search}`
      );
    }
    const savedTheme = localStorage.getItem("scribe-theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const refreshIcons = () => {
      window.lucide?.createIcons();
    };

    loadLucide().then(refreshIcons);

    root.querySelectorAll("img").forEach((image) => {
      const hideBrokenImage = () => {
        image.style.display = "none";
      };
      image.addEventListener("error", hideBrokenImage);
      cleanups.push(() => image.removeEventListener("error", hideBrokenImage));
    });

    const themeToggle = root.querySelector("#themeToggle");
    const updateThemeIcon = () => {
      if (!themeToggle) return;
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      themeToggle.innerHTML = `<i data-lucide="${isDark ? "moon" : "sun-medium"}"></i>`;
      refreshIcons();
    };
    const toggleTheme = () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("scribe-theme", next);
      updateThemeIcon();
    };
    themeToggle?.addEventListener("click", toggleTheme);
    cleanups.push(() => themeToggle?.removeEventListener("click", toggleTheme));
    updateThemeIcon();

    const handlePointerMove = (event) => {
      document.documentElement.style.setProperty("--mx", `${(event.clientX / window.innerWidth) * 100}%`);
      document.documentElement.style.setProperty("--my", `${(event.clientY / window.innerHeight) * 100}%`);
    };
    document.addEventListener("pointermove", handlePointerMove, { passive: true });
    cleanups.push(() => document.removeEventListener("pointermove", handlePointerMove));

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    root.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));
    cleanups.push(() => revealObserver.disconnect());

    const tabs = [...root.querySelectorAll(".showcase-tab")];
    const panels = [...root.querySelectorAll(".showcase-panel")];
    const activateTab = (tab) => {
      const id = tab?.dataset.tab;
      if (!id) return;
      tabs.forEach((item) => item.classList.toggle("active", item === tab));
      panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === id));
    };
    tabs.forEach((tab) => {
      const handler = () => activateTab(tab);
      tab.addEventListener("click", handler);
      cleanups.push(() => tab.removeEventListener("click", handler));
    });

    let tabIndex = 0;
    let autoRotate = window.setInterval(() => {
      tabIndex = (tabIndex + 1) % tabs.length;
      activateTab(tabs[tabIndex]);
    }, 5400);
    const showcase = root.querySelector(".showcase");
    const stopRotation = () => {
      window.clearInterval(autoRotate);
      autoRotate = null;
    };
    showcase?.addEventListener("mouseenter", stopRotation);
    showcase?.addEventListener("focusin", stopRotation);
    cleanups.push(() => {
      window.clearInterval(autoRotate);
      showcase?.removeEventListener("mouseenter", stopRotation);
      showcase?.removeEventListener("focusin", stopRotation);
    });

    const faqItems = [...root.querySelectorAll(".faq-item")];
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-q");
      const handler = () => {
        const wasOpen = item.classList.contains("open");
        faqItems.forEach((faqItem) => faqItem.classList.remove("open"));
        if (!wasOpen) item.classList.add("open");
      };
      question?.addEventListener("click", handler);
      cleanups.push(() => question?.removeEventListener("click", handler));
    });

    const workspace = root.querySelector("#workspace");
    const updateWorkspaceParallax = () => {
      if (!workspace) return;
      const bounds = workspace.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > 0) {
        const progress = (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height);
        workspace.style.setProperty("--p", progress.toFixed(3));
      }
    };
    window.addEventListener("scroll", updateWorkspaceParallax, { passive: true });
    updateWorkspaceParallax();
    cleanups.push(() => window.removeEventListener("scroll", updateWorkspaceParallax));

    const rotatingWords = [...root.querySelectorAll("#rotator .word")];
    let wordIndex = 0;
    const rotateWord = () => {
      if (rotatingWords.length < 2) return;
      const current = rotatingWords[wordIndex];
      wordIndex = (wordIndex + 1) % rotatingWords.length;
      current.classList.remove("active");
      current.classList.add("exit");
      rotatingWords[wordIndex].classList.add("active");
      window.setTimeout(() => current.classList.remove("exit"), 600);
    };
    const wordTimer = window.setInterval(rotateWord, 2600);
    cleanups.push(() => window.clearInterval(wordTimer));

    const clickHandler = (event) => {
      const anchor = event.target.closest("a");
      if (!anchor || !root.contains(anchor)) return;

      const href = anchor.getAttribute("href");
      const label = anchor.textContent.trim().toLowerCase();

      if (label.includes("sign in")) {
        event.preventDefault();
        setScreen("login");
        return;
      }

      if (
        label.includes("get started") ||
        label.includes("start free") ||
        label.includes("start trial")
      ) {
        event.preventDefault();
        setScreen("signup");
        return;
      }

      if (label === "blog") {
        event.preventDefault();
        setScreen("blog");
        return;
      }

      const sectionAliases = {
        "#solutions": "#workflows",
        "#resources": "#templates",
      };

      if (href?.startsWith("#")) {
        event.preventDefault();
        const sectionHref = sectionAliases[href] || href;
        const target = sectionHref.length > 1 ? root.querySelector(sectionHref) : null;
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (anchor.classList.contains("brand")) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    };
    root.addEventListener("click", clickHandler);
    cleanups.push(() => root.removeEventListener("click", clickHandler));

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      document.documentElement.style.removeProperty("--mx");
      document.documentElement.style.removeProperty("--my");
    };
  }, [setScreen]);

  return (
    <div ref={rootRef} className="reference-landing">
      <style>{landing.style}</style>
      <style>{`
        body.reference-landing-active::before {
          display: none;
        }
        .reference-landing {
          min-height: 100vh;
          background: var(--paper);
          color: var(--ink);
          overflow: clip;
          background-image:
            linear-gradient(rgba(11, 11, 12, .018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(11, 11, 12, .018) 1px, transparent 1px);
          background-size: 4px 4px;
        }
        .reference-landing .nav {
          padding-inline: env(safe-area-inset-left) env(safe-area-inset-right);
        }
        .reference-landing [id] {
          scroll-margin-top: 92px;
        }
        .reference-landing .pr-card.featured {
          background: #0b0b0c;
          color: #f2eee5;
        }
        .reference-landing .dark-section {
          background: #0b0b0c;
          color: #f2eee5;
        }
        .reference-landing .hero {
          padding-top: 136px;
          padding-bottom: 64px;
        }
        .reference-landing .hero-meta {
          margin-bottom: 44px;
        }
        .reference-landing .hero-headline {
          max-width: 1180px;
        }
        .reference-landing .hero-headline h1 {
          font-size: 96px;
          line-height: .91;
          letter-spacing: 0;
        }
        .reference-landing .rotator {
          min-width: 5.25em;
        }
        .reference-landing .hero-formats {
          margin-top: 44px;
        }
        .reference-landing .hero-sub {
          margin-top: 26px;
        }
        .reference-landing .footer-col ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .reference-landing a,
        .reference-landing button,
        .reference-landing .showcase-tab,
        .reference-landing .tpl-card,
        .reference-landing .int-cell {
          -webkit-tap-highlight-color: transparent;
        }
        @media (max-width: 1100px) {
          .reference-landing .hero-headline h1 {
            font-size: 74px;
          }
          .reference-landing .workspace {
            transform: scale(.9);
            transform-origin: top center;
            margin-bottom: -60px;
          }
          .reference-landing .section-head {
            gap: 40px;
          }
        }
        @media (max-width: 768px) {
          .reference-landing .nav {
            top: 10px;
          }
          .reference-landing .nav-inner {
            padding-inline: 10px;
          }
          .reference-landing .nav-shell {
            min-width: 0;
            padding-left: 10px;
          }
          .reference-landing .nav-cta .btn-ghost {
            display: none;
          }
          .reference-landing .hero {
            padding-top: 112px;
            padding-bottom: 48px;
          }
          .reference-landing .hero-meta,
          .reference-landing .hero-sub,
          .reference-landing .section-head {
            grid-template-columns: 1fr;
          }
          .reference-landing .hero-meta {
            align-items: flex-start;
            margin-bottom: 34px;
          }
          .reference-landing .hero-meta .right {
            text-align: left;
          }
          .reference-landing .hero-headline h1 {
            font-size: 58px;
            line-height: .93;
          }
          .reference-landing .rotator {
            display: block;
            margin-top: .08em;
            min-height: 1.08em;
            min-width: 0;
            width: max-content;
            max-width: 100%;
          }
          .reference-landing .hero-formats {
            margin-top: 30px;
          }
          .reference-landing .hero-sub {
            display: grid;
            gap: 26px;
          }
          .reference-landing .workspace {
            transform: none;
            margin: 48px 0 0;
            min-height: auto;
          }
          .reference-landing .ws-stage {
            min-height: 720px;
          }
          .reference-landing .workspace .card {
            max-width: calc(100vw - 40px);
          }
          .reference-landing .logos-grid,
          .reference-landing .int-grid,
          .reference-landing .tpl-grid,
          .reference-landing .pr-grid,
          .reference-landing .t-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .reference-landing .showcase {
            grid-template-columns: 1fr;
          }
          .reference-landing .showcase-tabs {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .reference-landing .showcase-stage {
            min-height: 520px;
          }
          .reference-landing .split,
          .reference-landing .dev-grid,
          .reference-landing .enterprise-grid {
            grid-template-columns: 1fr;
          }
          .reference-landing .footer-top {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 520px) {
          .reference-landing .container {
            padding-inline: 16px;
          }
          .reference-landing .nav-cta .theme-toggle {
            display: none;
          }
          .reference-landing .nav-cta .btn-primary {
            padding-inline: 12px;
          }
          .reference-landing .hero-badge {
            max-width: 100%;
          }
          .reference-landing .hero-meta {
            margin-bottom: 28px;
          }
          .reference-landing .hero-meta .right {
            display: none;
          }
          .reference-landing .hero-headline h1 {
            font-size: 48px;
            line-height: .94;
          }
          .reference-landing .hero-formats {
            flex-wrap: nowrap;
            overflow-x: auto;
            padding-block: 10px;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }
          .reference-landing .hero-formats::-webkit-scrollbar {
            display: none;
          }
          .reference-landing .hero-formats .f-chip {
            flex: 0 0 auto;
          }
          .reference-landing .hero-actions,
          .reference-landing .cta-row {
            align-items: stretch;
          }
          .reference-landing .hero-actions .btn,
          .reference-landing .cta-row .btn {
            justify-content: center;
          }
          .reference-landing .logos-grid,
          .reference-landing .int-grid,
          .reference-landing .tpl-grid,
          .reference-landing .pr-grid,
          .reference-landing .t-grid,
          .reference-landing .showcase-tabs,
          .reference-landing .footer-top {
            grid-template-columns: 1fr;
          }
          .reference-landing .showcase-stage {
            min-height: 580px;
          }
          .reference-landing .cta-final {
            border-radius: 16px;
            padding: 48px 22px;
          }
          .reference-landing .footer-newsletter {
            flex-direction: column;
          }
          .reference-landing .footer-newsletter .btn {
            justify-content: center;
          }
          .reference-landing .footer-massive {
            font-size: 28vw;
          }
        }
        @media (max-width: 350px) {
          .reference-landing .hero-headline h1 {
            font-size: 43px;
          }
        }
      `}</style>
      <div dangerouslySetInnerHTML={{ __html: landing.markup }} />
    </div>
  );
}
