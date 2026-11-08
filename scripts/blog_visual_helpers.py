"""
Blog Visual Helpers for Coralgenz Global
Provides:
1. Topic classification
2. Attractive card thumbnail SVGs/HTML for blog.html
3. In-article hero visual banners for all 180 blog posts
4. Topic-specific contextual diagrams, flowcharts, benchmark graphs, and audit scorecards
"""

def get_topic_type(title, category):
    t = title.lower()
    c = category.lower()

    if any(k in t or k in c for k in ["vault", "security", ".secure", "hack", "leak", "password", "dpdp", "privacy", "protect patient", "compliance", "confidential"]):
        return "security"
    elif any(k in t or k in c for k in ["compiler", "code anywhere", "python", "java", "c++", "developer", "saas engineering", "run code"]):
        return "compiler"
    elif any(k in t or k in c for k in ["qr", "scan", "telemetry", "tracking", "conversion rate", "local business growth", "festive discounts"]):
        return "qr"
    elif any(k in t or k in c for k in ["startup", "mvp", "idea", "founder", "first app", "launch", "burn rate", "product roadmap"]):
        return "startup"
    elif any(k in t or k in c for k in ["cloud", "azure", "server", "backup", "devops", "sre", "migration", "high availability", "aws", "infrastructure", "cost optimization"]):
        return "cloud"
    elif any(k in t or k in c for k in ["salesforce", "crm", "lead", "client portal", "b2b portal", "b2b client"]):
        return "salesforce"
    elif any(k in t or k in c for k in ["shopify", "store", "e-commerce", "cart", "checkout", "shopping rush", "online store", "b2b e-commerce"]):
        return "shopify"
    elif any(k in t or k in c for k in ["ai", "automate", "chatbot", "ocr", "intelligence", "analytics", "ai safety", "llm", "office tasks"]):
        return "ai"
    elif any(k in t or k in c for k in ["modern", "legacy", "upgrade", "dashboard", "pwa", "speed", "ui/ux", "frontend", "website fixes", "redesign", "mobile-first"]):
        return "modernization"
    elif any(k in t or k in c for k in ["custom software", "architecture", "ready-made", "clean", "code ownership", "outgrown spreadsheets", "enterprise ecosystem"]):
        return "software"
    else:
        return "company"


THEME_CONFIGS = {
    "security": {
        "gradient": "linear-gradient(135deg, #064e3b 0%, #022c22 45%, #0f172a 100%)",
        "accent": "#10b981",
        "accent_light": "#34d399",
        "border_color": "#059669",
        "badge": "AES-256-GCM Zero-Knowledge",
        "product": "Coralgenz Vault",
        "metric_tag": "Zero-Knowledge Encryption",
        "center_svg": """
          <circle cx="50" cy="50" r="42" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6"/>
          <circle cx="50" cy="50" r="32" stroke="#34d399" stroke-width="1.2" opacity="0.3"/>
          <path d="M50 20L72 30V48C72 62 50 75 50 75C50 75 28 62 28 48V30L50 20Z" fill="url(#secG)" stroke="#34d399" stroke-width="2"/>
          <rect x="42" y="44" width="16" height="14" rx="3" fill="#ffffff"/>
          <path d="M45 44V38C45 35.2 47.2 33 50 33C52.8 33 55 35.2 55 38V44" stroke="#ffffff" stroke-width="2.5" fill="none"/>
          <circle cx="50" cy="51" r="2" fill="#064e3b"/>
          <defs>
            <linearGradient id="secG" x1="28" y1="20" x2="72" y2="75" gradientUnits="userSpaceOnUse">
              <stop stop-color="#059669"/>
              <stop offset="1" stop-color="#047857"/>
            </linearGradient>
          </defs>
        """
    },
    "qr": {
        "gradient": "linear-gradient(135deg, #4c1d95 0%, #2e1065 45%, #0f172a 100%)",
        "accent": "#8b5cf6",
        "accent_light": "#c4b5fd",
        "border_color": "#7c3aed",
        "badge": "Dynamic Telemetry & Routing",
        "product": "Coralgenz QR",
        "metric_tag": "Real-Time Telemetry",
        "center_svg": """
          <circle cx="50" cy="50" r="44" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.5"/>
          <rect x="22" y="22" width="22" height="22" rx="4" stroke="#c4b5fd" stroke-width="2.5" fill="none"/>
          <rect x="27" y="27" width="12" height="12" rx="2" fill="#8b5cf6"/>
          <rect x="56" y="22" width="22" height="22" rx="4" stroke="#c4b5fd" stroke-width="2.5" fill="none"/>
          <rect x="61" y="27" width="12" height="12" rx="2" fill="#8b5cf6"/>
          <rect x="22" y="56" width="22" height="22" rx="4" stroke="#c4b5fd" stroke-width="2.5" fill="none"/>
          <rect x="27" y="61" width="12" height="12" rx="2" fill="#8b5cf6"/>
          <path d="M56 56H64V64H56V56Z" fill="#a78bfa"/>
          <path d="M70 56H78V64H70V56Z" fill="#c4b5fd"/>
          <path d="M56 70H64V78H56V70Z" fill="#c4b5fd"/>
          <path d="M70 70H78V78H70V70Z" fill="#a78bfa"/>
          <path d="M12 50C12 29 29 12 50 12" stroke="#8b5cf6" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
          <path d="M88 50C88 71 71 88 50 88" stroke="#8b5cf6" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>
        """
    },
    "compiler": {
        "gradient": "linear-gradient(135deg, #083344 0%, #164e63 45%, #0f172a 100%)",
        "accent": "#06b6d4",
        "accent_light": "#67e8f9",
        "border_color": "#0891b2",
        "badge": "Sub-50ms WebAssembly Sandbox",
        "product": "Coralgenz Compiler",
        "metric_tag": "Instant Wasm Sandbox",
        "center_svg": """
          <rect x="18" y="22" width="64" height="56" rx="8" fill="#0f172a" stroke="#06b6d4" stroke-width="2"/>
          <rect x="18" y="22" width="64" height="14" rx="8" fill="#164e63"/>
          <circle cx="26" cy="29" r="2.5" fill="#ef4444"/>
          <circle cx="33" cy="29" r="2.5" fill="#f59e0b"/>
          <circle cx="40" cy="29" r="2.5" fill="#10b981"/>
          <path d="M26 48L34 54L26 60" stroke="#67e8f9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="38" y1="60" x2="52" y2="60" stroke="#22d3ee" stroke-width="2.5" stroke-linecap="round"/>
          <polygon points="66 42 58 54 68 54 62 66 76 50 68 50" fill="#f59e0b"/>
        """
    },
    "startup": {
        "gradient": "linear-gradient(135deg, #78350f 0%, #451a03 45%, #0f172a 100%)",
        "accent": "#f59e0b",
        "accent_light": "#fcd34d",
        "border_color": "#d97706",
        "badge": "4-Week Rapid MVP Sprint",
        "product": "Coralgenz MVP",
        "metric_tag": "High-Velocity Launch",
        "center_svg": """
          <circle cx="50" cy="50" r="42" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.4"/>
          <path d="M50 16C50 16 68 28 68 52C68 62 62 70 50 74C38 70 32 62 32 52C32 28 50 16 50 16Z" fill="url(#rocG)" stroke="#fcd34d" stroke-width="2"/>
          <circle cx="50" cy="40" r="6" fill="#0f172a" stroke="#fcd34d" stroke-width="2"/>
          <path d="M32 52L22 62L34 66" stroke="#f59e0b" stroke-width="2" fill="#78350f"/>
          <path d="M68 52L78 62L66 66" stroke="#f59e0b" stroke-width="2" fill="#78350f"/>
          <path d="M44 74L50 86L56 74" fill="#ef4444"/>
          <defs>
            <linearGradient id="rocG" x1="32" y1="16" x2="68" y2="74" gradientUnits="userSpaceOnUse">
              <stop stop-color="#f59e0b"/>
              <stop offset="1" stop-color="#b45309"/>
            </linearGradient>
          </defs>
        """
    },
    "software": {
        "gradient": "linear-gradient(135deg, #1e3a8a 0%, #172554 45%, #0f172a 100%)",
        "accent": "#3b82f6",
        "accent_light": "#93c5fd",
        "border_color": "#2563eb",
        "badge": "100% Client Code Ownership",
        "product": "Coralgenz Engineering",
        "metric_tag": "Clean Architecture",
        "center_svg": """
          <rect x="20" y="20" width="60" height="15" rx="4" fill="#2563eb" stroke="#93c5fd" stroke-width="1.5"/>
          <rect x="25" y="42" width="50" height="15" rx="4" fill="#1d4ed8" stroke="#60a5fa" stroke-width="1.5"/>
          <rect x="30" y="64" width="40" height="16" rx="4" fill="#1e40af" stroke="#3b82f6" stroke-width="1.5"/>
          <line x1="50" y1="35" x2="50" y2="42" stroke="#93c5fd" stroke-width="2" stroke-dasharray="2 2"/>
          <line x1="50" y1="57" x2="50" y2="64" stroke="#93c5fd" stroke-width="2" stroke-dasharray="2 2"/>
          <circle cx="20" cy="50" r="3" fill="#60a5fa"/>
          <circle cx="80" cy="50" r="3" fill="#60a5fa"/>
        """
    },
    "cloud": {
        "gradient": "linear-gradient(135deg, #0369a1 0%, #0c4a6e 45%, #0f172a 100%)",
        "accent": "#0ea5e9",
        "accent_light": "#7dd3fc",
        "border_color": "#0284c7",
        "badge": "Microsoft Developer Partner",
        "product": "Coralgenz Cloud",
        "metric_tag": "99.99% High Availability",
        "center_svg": """
          <path d="M35 60H65C73.3 60 80 53.3 80 45C80 37.2 74 30.8 66.5 30.1C65 20.6 57 14 47 14C37.5 14 29.5 20 27.5 29C19.5 30.5 14 37.5 14 45.5C14 53.5 20.5 60 28.5 60H35" fill="#0284c7" stroke="#7dd3fc" stroke-width="2" opacity="0.9"/>
          <circle cx="40" cy="74" r="5" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
          <circle cx="60" cy="74" r="5" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
          <line x1="40" y1="60" x2="40" y2="69" stroke="#38bdf8" stroke-width="1.5"/>
          <line x1="60" y1="60" x2="60" y2="69" stroke="#38bdf8" stroke-width="1.5"/>
        """
    },
    "salesforce": {
        "gradient": "linear-gradient(135deg, #0284c7 0%, #075985 45%, #082f49 100%)",
        "accent": "#38bdf8",
        "accent_light": "#bae6fd",
        "border_color": "#0369a1",
        "badge": "Salesforce ISV Partner",
        "product": "Coralgenz CRM",
        "metric_tag": "Lightning Web Components",
        "center_svg": """
          <path d="M40 28C43.5 22 50.5 20 56 23C61 17 71 18 75 25C81 26 85 31 84 37C88 42 86 50 80 54C81 58 78 64 71 65C68 70 60 71 55 67C50 71 42 70 38 64C31 65 25 60 25 53C20 49 20 40 25 35C26 29 32 25 38 27" fill="#0284c7" stroke="#bae6fd" stroke-width="2"/>
          <path d="M52 35L42 50H54L48 65L64 47H52L58 35H52Z" fill="#fcd34d" stroke="#f59e0b" stroke-width="1"/>
        """
    },
    "shopify": {
        "gradient": "linear-gradient(135deg, #047857 0%, #064e3b 45%, #022c22 100%)",
        "accent": "#10b981",
        "accent_light": "#6ee7b7",
        "border_color": "#059669",
        "badge": "Shopify Partner Network",
        "product": "Coralgenz Commerce",
        "metric_tag": "Headless Sub-Second Speed",
        "center_svg": """
          <path d="M22 26H30L38 60H68L76 34H33" stroke="#6ee7b7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <circle cx="42" cy="72" r="5" fill="#10b981"/>
          <circle cx="64" cy="72" r="5" fill="#10b981"/>
          <polygon points="52 18 46 30 54 30 50 40 60 28 52 28" fill="#f59e0b"/>
          <line x1="16" y1="36" x2="26" y2="36" stroke="#34d399" stroke-width="2" stroke-linecap="round"/>
          <line x1="14" y1="44" x2="28" y2="44" stroke="#34d399" stroke-width="2" stroke-linecap="round"/>
        """
    },
    "modernization": {
        "gradient": "linear-gradient(135deg, #581c87 0%, #3b0764 45%, #0f172a 100%)",
        "accent": "#a855f7",
        "accent_light": "#e9d5ff",
        "border_color": "#9333ea",
        "badge": "Zero Business Interruption",
        "product": "Coralgenz Modernize",
        "metric_tag": "Strangler Fig Refactoring",
        "center_svg": """
          <rect x="18" y="22" width="44" height="34" rx="4" fill="#3b0764" stroke="#c084fc" stroke-width="2"/>
          <line x1="18" y1="30" x2="62" y2="30" stroke="#a855f7" stroke-width="1.5"/>
          <rect x="48" y="38" width="34" height="44" rx="5" fill="#0f172a" stroke="#e9d5ff" stroke-width="2"/>
          <line x1="48" y1="46" x2="82" y2="46" stroke="#c084fc" stroke-width="1.5"/>
          <circle cx="65" cy="76" r="2.5" fill="#a855f7"/>
          <path d="M30 68L38 60M38 60H30M38 60V68" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        """
    },
    "ai": {
        "gradient": "linear-gradient(135deg, #0f766e 0%, #115e59 45%, #0a0f1d 100%)",
        "accent": "#14b8a6",
        "accent_light": "#5eead4",
        "border_color": "#0d9488",
        "badge": "Private Isolated AI Guardrails",
        "product": "Coralgenz AI",
        "metric_tag": "Zero-Leak Enterprise AI",
        "center_svg": """
          <circle cx="50" cy="50" r="12" fill="#0f766e" stroke="#5eead4" stroke-width="2"/>
          <circle cx="26" cy="30" r="6" fill="#115e59" stroke="#2dd4bf" stroke-width="1.5"/>
          <circle cx="74" cy="30" r="6" fill="#115e59" stroke="#2dd4bf" stroke-width="1.5"/>
          <circle cx="26" cy="70" r="6" fill="#115e59" stroke="#2dd4bf" stroke-width="1.5"/>
          <circle cx="74" cy="70" r="6" fill="#115e59" stroke="#2dd4bf" stroke-width="1.5"/>
          <line x1="31" y1="34" x2="42" y2="43" stroke="#5eead4" stroke-width="1.5"/>
          <line x1="69" y1="34" x2="58" y2="43" stroke="#5eead4" stroke-width="1.5"/>
          <line x1="31" y1="66" x2="42" y2="57" stroke="#5eead4" stroke-width="1.5"/>
          <line x1="69" y1="66" x2="58" y2="57" stroke="#5eead4" stroke-width="1.5"/>
          <polygon points="50 44 46 52 54 52" fill="#ffffff"/>
        """
    },
    "company": {
        "gradient": "linear-gradient(135deg, #0055fe 0%, #0037a8 45%, #0a0f1d 100%)",
        "accent": "#38bdf8",
        "accent_light": "#bfdbfe",
        "border_color": "#2563eb",
        "badge": "Coimbatore & Chennai IT Hubs",
        "product": "Coralgenz Global",
        "metric_tag": "Verified Global Authority",
        "center_svg": """
          <circle cx="50" cy="50" r="38" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 3" opacity="0.6"/>
          <ellipse cx="50" cy="50" rx="36" ry="16" stroke="#93c5fd" stroke-width="1.2" opacity="0.4"/>
          <ellipse cx="50" cy="50" rx="16" ry="36" stroke="#93c5fd" stroke-width="1.2" opacity="0.4"/>
          <circle cx="50" cy="50" r="14" fill="#0055fe" stroke="#ffffff" stroke-width="2"/>
          <path d="M45 50L48 53L56 45" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        """
    }
}


def get_card_thumbnail_html(topic_type, category, title):
    cfg = THEME_CONFIGS.get(topic_type, THEME_CONFIGS["company"])
    gradient = cfg["gradient"]
    accent = cfg["accent"]
    accent_light = cfg["accent_light"]
    product = cfg["product"]
    metric_tag = cfg["metric_tag"]
    center_svg = cfg["center_svg"].strip()

    return f"""
<div style="width: 100%; height: 165px; border-radius: 12px; margin-bottom: 16px; overflow: hidden; position: relative; background: {gradient}; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12); display: flex; flex-direction: column; justify-content: space-between; padding: 12px; box-sizing: border-box; transition: transform 0.3s ease;">
  <!-- Background Blueprint Mesh -->
  <svg style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; opacity: 0.12;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid-{topic_type}" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ffffff" stroke-width="0.8"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid-{topic_type})"/>
  </svg>

  <!-- Top Bar: Brand Pill & Category -->
  <div style="position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: center; gap: 8px;">
    <div style="display: flex; align-items: center; gap: 6px; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px); padding: 3px 9px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.18);">
      <img src="/assets/images/DVyu6tz4dqPirA4TwAJZUz5CUw.png" width="15" height="15" alt="Coralgenz Global" style="border-radius: 3px; display: block;">
      <span style="font-size: 10.5px; font-weight: 700; color: #ffffff; letter-spacing: 0.02em;">Coralgenz</span>
    </div>
    <span style="font-size: 10px; font-weight: 700; color: {accent_light}; background: rgba(0,0,0,0.45); backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 2px 7px; text-transform: uppercase;">
      {category}
    </span>
  </div>

  <!-- Center Thematic Visual -->
  <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 88px; height: 88px; z-index: 1; display: flex; align-items: center; justify-content: center;">
    <svg width="88" height="88" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {center_svg}
    </svg>
  </div>

  <!-- Bottom Metric & Status Tag -->
  <div style="position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: center;">
    <span style="font-size: 10px; font-weight: 700; color: #ffffff; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(6px); border: 1px solid {accent}; border-radius: 4px; padding: 2px 8px; display: inline-flex; align-items: center; gap: 4px;">
      <span style="width: 5px; height: 5px; border-radius: 50%; background: {accent}; display: inline-block;"></span>
      {metric_tag}
    </span>
    <span style="font-size: 9.5px; color: rgba(255,255,255,0.7); font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">
      {product}
    </span>
  </div>
</div>
"""


def get_in_article_hero_html(topic_type, title, category, author, date_display):
    cfg = THEME_CONFIGS.get(topic_type, THEME_CONFIGS["company"])
    gradient = cfg["gradient"]
    accent = cfg["accent"]
    accent_light = cfg["accent_light"]
    product = cfg["product"]
    badge = cfg["badge"]
    center_svg = cfg["center_svg"].strip()

    return f"""
    <!-- In-Article Executive Visual Hero Banner -->
    <div style="margin: 28px 0 36px 0; background: {gradient}; border: 1.5px solid rgba(255,255,255,0.15); border-radius: 18px; overflow: hidden; box-shadow: 0 12px 36px rgba(15, 23, 42, 0.12); color: #ffffff; position: relative;">
      <!-- Subtle Tech Blueprint Grid Overlay -->
      <svg style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; opacity: 0.08;" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="heroGrid-{topic_type}" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#ffffff" stroke-width="0.8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroGrid-{topic_type})"/>
      </svg>

      <!-- Top Header Meta Bar -->
      <div style="position: relative; z-index: 2; padding: 12px 22px; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <img src="/assets/images/DVyu6tz4dqPirA4TwAJZUz5CUw.png" width="18" height="18" alt="Coralgenz Global" style="border-radius: 4px; display: block;">
          <span style="font-size: 11.5px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: #ffffff;">
            Coralgenz Global Architecture Insights
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 11px; font-weight: 700; color: {accent_light}; background: rgba(255,255,255,0.1); padding: 3px 10px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.15);">
            {category}
          </span>
          <span style="font-size: 11px; color: #94a3b8; font-weight: 600;">{date_display}</span>
        </div>
      </div>

      <!-- Hero Visual Body -->
      <div style="position: relative; z-index: 2; padding: clamp(22px, 3.5vw, 32px); display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 260px;">
          <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; background: rgba(255,255,255,0.12); border: 1px solid {accent}; border-radius: 6px; font-size: 11px; font-weight: 700; color: {accent_light}; margin-bottom: 12px; text-transform: uppercase;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: {accent};"></span>
            {badge}
          </div>
          <h2 style="font-family: var(--font-satoshi), sans-serif; font-size: clamp(20px, 3vw, 28px); font-weight: 800; color: #ffffff; line-height: 1.25; margin: 0 0 10px 0; letter-spacing: -0.015em;">
            {title}
          </h2>
          <p style="font-size: 13.5px; color: #cbd5e1; margin: 0; line-height: 1.6; max-width: 580px;">
            Official engineering analysis and enterprise architecture playbook by {author['name']} ({author['role']}, Coralgenz Global).
          </p>
        </div>

        <!-- Thematic Illustration Badge -->
        <div style="width: 100px; height: 100px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: rgba(15, 23, 42, 0.6); border: 1.5px solid rgba(255,255,255,0.15); border-radius: 20px; backdrop-filter: blur(8px); box-shadow: 0 8px 24px rgba(0,0,0,0.3);">
          <svg width="84" height="84" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {center_svg}
          </svg>
        </div>
      </div>
    </div>
"""


def get_in_article_diagram_html(topic_type, title, category):
    """
    Returns tailored contextual diagrams, flowcharts, benchmark graphs, or scorecards.
    Strictly returns empty string ("") for company/culture/founder topics where technical diagrams
    are not required, fulfilling: "(donot put all in all pages put as per requirments, if no requirements leave blank)".
    """
    if topic_type == "security":
        return """
        <!-- Contextual Architectural Diagram: Zero-Knowledge Browser Cryptographic Pipeline -->
        <figure style="margin: 36px 0; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06);">
          <div style="background: #0f172a; padding: 14px 22px; display: flex; justify-content: space-between; align-items: center; color: #ffffff;">
            <span style="font-size: 13.5px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
              Figure 1: Coralgenz Vault Zero-Knowledge Cryptographic Pipeline (AES-256-GCM)
            </span>
            <span style="font-size: 11px; background: rgba(16, 185, 129, 0.2); color: #34d399; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-weight: 700;">PROPRIETARY STANDARD</span>
          </div>

          <div style="padding: 24px 26px; background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);">
            <!-- 5-Step Cryptographic Flowchart -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin-bottom: 24px;">
              <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 4px;">STEP 1</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Raw Client File</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 4px;">PDF, DOCX, ZIP</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #10b981; border-radius: 10px; padding: 14px 10px; text-align: center; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);">
                <div style="font-size: 11px; font-weight: 700; color: #10b981; margin-bottom: 4px;">STEP 2</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Browser Key Gen</div>
                <div style="font-size: 11px; color: #10b981; font-weight: 600; margin-top: 4px;">WebCrypto 256-bit</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #10b981; border-radius: 10px; padding: 14px 10px; text-align: center; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);">
                <div style="font-size: 11px; font-weight: 700; color: #10b981; margin-bottom: 4px;">STEP 3</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">In-Memory AES</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Client RAM Only</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #0055fe; border-radius: 10px; padding: 14px 10px; text-align: center; box-shadow: 0 2px 8px rgba(0, 85, 254, 0.1);">
                <div style="font-size: 11px; font-weight: 700; color: #0055fe; margin-bottom: 4px;">STEP 4</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">.secure Container</div>
                <div style="font-size: 11px; color: #0055fe; font-weight: 600; margin-top: 4px;">Locked Envelope</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #0f172a; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #0f172a; margin-bottom: 4px;">STEP 5</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Zero-Access Cloud</div>
                <div style="font-size: 11px; color: #10b981; font-weight: 700; margin-top: 4px;">0 Server Decrypt</div>
              </div>
            </div>

            <!-- Security Audit Scorecard -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; text-align: center;">
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Plaintext Leak Risk</div>
                <div style="font-size: 20px; font-weight: 800; color: #10b981; margin-top: 4px;">0.00%</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Server Key Access</div>
                <div style="font-size: 16px; font-weight: 800; color: #0055fe; margin-top: 6px;">Zero-Knowledge</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Cipher Standard</div>
                <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 4px;">256-bit GCM</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Offline Decryption</div>
                <div style="font-size: 18px; font-weight: 800; color: #f59e0b; margin-top: 4px;">Supported</div>
              </div>
            </div>
          </div>
          <figcaption style="padding: 10px 20px; background: #f8fafc; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b; text-align: center;">
            Source: Coralgenz Global Cryptographic Security Architecture Blueprint (2026 Edition)
          </figcaption>
        </figure>
        """

    elif topic_type == "qr":
        return """
        <!-- Contextual Architectural Diagram: Smart Dynamic QR Telemetry & Edge Routing -->
        <figure style="margin: 36px 0; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06);">
          <div style="background: #0f172a; padding: 14px 22px; display: flex; justify-content: space-between; align-items: center; color: #ffffff;">
            <span style="font-size: 13.5px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #8b5cf6; display: inline-block;"></span>
              Figure 1: Coralgenz Smart QR Dynamic Edge Routing & Real-Time Telemetry Funnel
            </span>
            <span style="font-size: 11px; background: rgba(139, 92, 246, 0.2); color: #c4b5fd; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-weight: 700;">EDGE ROUTING</span>
          </div>

          <div style="padding: 24px 26px; background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);">
            <!-- 4-Step Funnel -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px;">
              <div style="background: #ffffff; border: 1.5px solid #8b5cf6; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #8b5cf6; margin-bottom: 4px;">SCAN TRIGGER</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Smart QR Code</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Print, Menu, Packaging</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #0055fe; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #0055fe; margin-bottom: 4px;">EDGE RESOLVER</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Sub-15ms Latency</div>
                <div style="font-size: 11px; color: #0055fe; font-weight: 600; margin-top: 4px;">Geo-Aware Routing</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #10b981; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #10b981; margin-bottom: 4px;">TELEMETRY HUB</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Live Analytics</div>
                <div style="font-size: 11px; color: #10b981; font-weight: 600; margin-top: 4px;">Zero-PII Metrics</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #f59e0b; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #f59e0b; margin-bottom: 4px;">CONVERSION</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Dynamic Target</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Instant Update</div>
              </div>
            </div>

            <!-- Performance Metric Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; text-align: center;">
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Redirect Latency</div>
                <div style="font-size: 20px; font-weight: 800; color: #8b5cf6; margin-top: 4px;">&lt; 14ms</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Conversion Rate Lift</div>
                <div style="font-size: 20px; font-weight: 800; color: #10b981; margin-top: 4px;">+34.8%</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Reprint Cost Saved</div>
                <div style="font-size: 20px; font-weight: 800; color: #0055fe; margin-top: 4px;">100%</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Anti-Counterfeiting</div>
                <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 6px;">Instant Verify</div>
              </div>
            </div>
          </div>
          <figcaption style="padding: 10px 20px; background: #f8fafc; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b; text-align: center;">
            Source: Coralgenz QR Telemetry & Edge Routing Production Benchmark (2026)
          </figcaption>
        </figure>
        """

    elif topic_type == "compiler":
        return """
        <!-- Contextual Benchmark Graph: Coralgenz Compiler Execution Latency -->
        <figure style="margin: 36px 0; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06);">
          <div style="background: #0f172a; padding: 14px 22px; display: flex; justify-content: space-between; align-items: center; color: #ffffff;">
            <span style="font-size: 13.5px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #06b6d4; display: inline-block;"></span>
              Figure 1: Coralgenz Compiler Execution Latency Benchmark (Browser WebAssembly vs Remote VMs)
            </span>
            <span style="font-size: 11px; background: rgba(6, 182, 212, 0.2); color: #67e8f9; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-weight: 700;">BENCHMARK LAB</span>
          </div>

          <div style="padding: 24px 26px; background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);">
            <!-- Horizontal Latency Comparison Bars -->
            <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 700; margin-bottom: 6px;">
                  <span style="color: #06b6d4;">Coralgenz Compiler (Browser Wasm Sandbox)</span>
                  <span style="color: #06b6d4;">42 ms (Instant)</span>
                </div>
                <div style="width: 100%; height: 12px; background: #e2e8f0; border-radius: 9999px; overflow: hidden;">
                  <div style="width: 4%; height: 100%; background: linear-gradient(90deg, #06b6d4, #22d3ee); border-radius: 9999px;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; margin-bottom: 6px; color: #64748b;">
                  <span>Standard Remote Container Worker API</span>
                  <span>680 ms</span>
                </div>
                <div style="width: 100%; height: 12px; background: #e2e8f0; border-radius: 9999px; overflow: hidden;">
                  <div style="width: 32%; height: 100%; background: #94a3b8; border-radius: 9999px;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 600; margin-bottom: 6px; color: #64748b;">
                  <span>Cold Virtual Machine Spin-up</span>
                  <span>2,150 ms</span>
                </div>
                <div style="width: 100%; height: 12px; background: #e2e8f0; border-radius: 9999px; overflow: hidden;">
                  <div style="width: 95%; height: 100%; background: #cbd5e1; border-radius: 9999px;"></div>
                </div>
              </div>
            </div>

            <!-- Capabilities Scorecard -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; text-align: center;">
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Engines Supported</div>
                <div style="font-size: 18px; font-weight: 800; color: #06b6d4; margin-top: 4px;">Python, C++, Java</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Client Setup Time</div>
                <div style="font-size: 20px; font-weight: 800; color: #10b981; margin-top: 4px;">0 Seconds</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Offline Execution</div>
                <div style="font-size: 18px; font-weight: 800; color: #0055fe; margin-top: 4px;">Supported</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Process Isolation</div>
                <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 4px;">100% Wasm</div>
              </div>
            </div>
          </div>
          <figcaption style="padding: 10px 20px; background: #f8fafc; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b; text-align: center;">
            Source: Coralgenz Compiler Benchmark Lab (Tested across Chrome, Safari, and Firefox)
          </figcaption>
        </figure>
        """

    elif topic_type == "startup":
        return """
        <!-- Contextual Gantt Chart: 4-Week Rapid MVP Launch Roadmap -->
        <figure style="margin: 36px 0; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06);">
          <div style="background: #0f172a; padding: 14px 22px; display: flex; justify-content: space-between; align-items: center; color: #ffffff;">
            <span style="font-size: 13.5px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
              Figure 1: Coralgenz 4-Week Rapid MVP Launch Roadmap
            </span>
            <span style="font-size: 11px; background: rgba(245, 158, 11, 0.2); color: #fcd34d; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-weight: 700;">AGILE SPRINT</span>
          </div>

          <div style="padding: 24px 26px; background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);">
            <!-- 4-Week Visual Timeline -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px;">
              <div style="background: #ffffff; border: 1.5px solid #f59e0b; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; font-weight: 700; color: #f59e0b; margin-bottom: 4px;">WEEK 1 (DAYS 1-7)</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Blueprint & UX</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Clickable Prototypes</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #0055fe; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; font-weight: 700; color: #0055fe; margin-bottom: 4px;">WEEK 2 (DAYS 8-14)</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Core Logic Engine</div>
                <div style="font-size: 11px; color: #0055fe; font-weight: 600; margin-top: 4px;">PostgreSQL & APIs</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #8b5cf6; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; font-weight: 700; color: #8b5cf6; margin-bottom: 4px;">WEEK 3 (DAYS 15-21)</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Integration & Auth</div>
                <div style="font-size: 11px; color: #8b5cf6; font-weight: 600; margin-top: 4px;">Payments & Security</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #10b981; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; font-weight: 700; color: #10b981; margin-bottom: 4px;">WEEK 4 (DAYS 22-28)</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Production Launch</div>
                <div style="font-size: 11px; color: #10b981; font-weight: 700; margin-top: 4px;">Real User Testing</div>
              </div>
            </div>

            <!-- ROI Scorecard -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; text-align: center;">
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Time-to-Market</div>
                <div style="font-size: 20px; font-weight: 800; color: #f59e0b; margin-top: 4px;">4 Weeks</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Runway Budget Saved</div>
                <div style="font-size: 20px; font-weight: 800; color: #10b981; margin-top: 4px;">45-60%</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">IP Code Ownership</div>
                <div style="font-size: 20px; font-weight: 800; color: #0055fe; margin-top: 4px;">100% Client</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Investor Demo Ready</div>
                <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 4px;">Guaranteed</div>
              </div>
            </div>
          </div>
          <figcaption style="padding: 10px 20px; background: #f8fafc; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b; text-align: center;">
            Source: Coralgenz Global High-Velocity Agile Delivery Framework
          </figcaption>
        </figure>
        """

    elif topic_type == "software":
        return """
        <!-- Contextual Architectural Diagram: Clean Architecture 4-Layer Blueprint -->
        <figure style="margin: 36px 0; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06);">
          <div style="background: #0f172a; padding: 14px 22px; display: flex; justify-content: space-between; align-items: center; color: #ffffff;">
            <span style="font-size: 13.5px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #0284c7; display: inline-block;"></span>
              Figure 1: Coralgenz Enterprise Clean Architecture & Separation of Concerns
            </span>
            <span style="font-size: 11px; background: rgba(2, 132, 199, 0.2); color: #7dd3fc; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-weight: 700;">MODULAR STACK</span>
          </div>

          <div style="padding: 24px 26px; background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);">
            <!-- 4 Architecture Layers -->
            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
              <div style="background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 8px; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                <span style="font-size: 13px; font-weight: 800; color: #1e40af;">Layer 1: Presentation & UI Layer</span>
                <span style="font-size: 11.5px; color: #3b82f6; font-weight: 600;">React, Next.js, Mobile PWA, Tailwind CSS</span>
              </div>
              <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 8px; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                <span style="font-size: 13px; font-weight: 800; color: #166534;">Layer 2: Application Use Cases & Auth</span>
                <span style="font-size: 11.5px; color: #15803d; font-weight: 600;">Domain Workflows, RBAC, Data Validation</span>
              </div>
              <div style="background: #faf5ff; border: 1.5px solid #e9d5ff; border-radius: 8px; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                <span style="font-size: 13px; font-weight: 800; color: #6b21a8;">Layer 3: Core Domain Business Entities</span>
                <span style="font-size: 11.5px; color: #7e22ce; font-weight: 600;">Pure Business Rules (Zero External Dependencies)</span>
              </div>
              <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                <span style="font-size: 13px; font-weight: 800; color: #334155;">Layer 4: Infrastructure & Persistence</span>
                <span style="font-size: 11.5px; color: #475569; font-weight: 600;">PostgreSQL, Redis, Cloud Object Storage, APIs</span>
              </div>
            </div>

            <!-- Guarantees Scorecard -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; text-align: center;">
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Code Ownership</div>
                <div style="font-size: 20px; font-weight: 800; color: #0055fe; margin-top: 4px;">100% Client</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Vendor Lock-in</div>
                <div style="font-size: 20px; font-weight: 800; color: #10b981; margin-top: 4px;">0% (Open)</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Test Coverage</div>
                <div style="font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 4px;">&gt; 90%</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Billing Model</div>
                <div style="font-size: 16px; font-weight: 800; color: #f59e0b; margin-top: 6px;">Milestone Only</div>
              </div>
            </div>
          </div>
          <figcaption style="padding: 10px 20px; background: #f8fafc; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b; text-align: center;">
            Source: Coralgenz Global Enterprise Systems Architecture Handbook
          </figcaption>
        </figure>
        """

    elif topic_type == "cloud":
        return """
        <!-- Contextual Architectural Diagram: Multi-Region Cloud & High Availability -->
        <figure style="margin: 36px 0; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06);">
          <div style="background: #0f172a; padding: 14px 22px; display: flex; justify-content: space-between; align-items: center; color: #ffffff;">
            <span style="font-size: 13.5px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #0ea5e9; display: inline-block;"></span>
              Figure 1: High-Availability Multi-Region Cloud Deployment & Automated Failover
            </span>
            <span style="font-size: 11px; background: rgba(14, 165, 233, 0.2); color: #7dd3fc; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-weight: 700;">AZURE & HYBRID CLOUD</span>
          </div>

          <div style="padding: 24px 26px; background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);">
            <!-- Cloud Pipeline Nodes -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px;">
              <div style="background: #ffffff; border: 1.5px solid #0ea5e9; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #0ea5e9; margin-bottom: 4px;">GLOBAL EDGE</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Traffic Manager</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Latency-Based Routing</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #10b981; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #10b981; margin-bottom: 4px;">PRIMARY CLUSTER</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Active Region</div>
                <div style="font-size: 11px; color: #10b981; font-weight: 600; margin-top: 4px;">Auto-Scaling Nodes</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #f59e0b; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #f59e0b; margin-bottom: 4px;">HOT STANDBY</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Secondary Region</div>
                <div style="font-size: 11px; color: #f59e0b; font-weight: 600; margin-top: 4px;">Instant Failover</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #0055fe; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #0055fe; margin-bottom: 4px;">REPLICATED DB</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Multi-Zone Sync</div>
                <div style="font-size: 11px; color: #0055fe; font-weight: 600; margin-top: 4px;">Automated Backups</div>
              </div>
            </div>

            <!-- Reliability Metrics -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; text-align: center;">
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Uptime SLA</div>
                <div style="font-size: 20px; font-weight: 800; color: #0ea5e9; margin-top: 4px;">99.99%</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Failover Time</div>
                <div style="font-size: 20px; font-weight: 800; color: #10b981; margin-top: 4px;">&lt; 30s</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Cost Reduction</div>
                <div style="font-size: 20px; font-weight: 800; color: #0055fe; margin-top: 4px;">Up to 40%</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Daily Backups</div>
                <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 6px;">Geo-Encrypted</div>
              </div>
            </div>
          </div>
          <figcaption style="padding: 10px 20px; background: #f8fafc; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b; text-align: center;">
            Source: Coralgenz Global Cloud Engineering Lab (Microsoft Partner Network)
          </figcaption>
        </figure>
        """

    elif topic_type == "modernization":
        return """
        <!-- Contextual Architectural Diagram: Strangler Fig Modernization -->
        <figure style="margin: 36px 0; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06);">
          <div style="background: #0f172a; padding: 14px 22px; display: flex; justify-content: space-between; align-items: center; color: #ffffff;">
            <span style="font-size: 13.5px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #a855f7; display: inline-block;"></span>
              Figure 1: Zero-Downtime Strangler Fig Migration: Monolith to Modular PWAs
            </span>
            <span style="font-size: 11px; background: rgba(168, 85, 247, 0.2); color: #e9d5ff; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-weight: 700;">STRANGLER PATTERN</span>
          </div>

          <div style="padding: 24px 26px; background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);">
            <!-- 3-Phase Modernization Flow -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 24px;">
              <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 4px;">PHASE 1</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Legacy Monolith</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Behind Facade Router</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #a855f7; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #a855f7; margin-bottom: 4px;">PHASE 2</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Modular Slice Cutover</div>
                <div style="font-size: 11px; color: #a855f7; font-weight: 600; margin-top: 4px;">PWAs & Fast APIs</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #10b981; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #10b981; margin-bottom: 4px;">PHASE 3</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Clean Cloud Native</div>
                <div style="font-size: 11px; color: #10b981; font-weight: 700; margin-top: 4px;">Zero Monolith Debt</div>
              </div>
            </div>

            <!-- Scorecard -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; text-align: center;">
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Migration Downtime</div>
                <div style="font-size: 20px; font-weight: 800; color: #10b981; margin-top: 4px;">0 Hours</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Speed Acceleration</div>
                <div style="font-size: 20px; font-weight: 800; color: #a855f7; margin-top: 4px;">3.5x Faster</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Mobile PWA Support</div>
                <div style="font-size: 20px; font-weight: 800; color: #0055fe; margin-top: 4px;">100% Native</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Legacy Debt Removed</div>
                <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 4px;">Up to 80%</div>
              </div>
            </div>
          </div>
          <figcaption style="padding: 10px 20px; background: #f8fafc; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b; text-align: center;">
            Source: Coralgenz Global Legacy Modernization Methodology
          </figcaption>
        </figure>
        """

    elif topic_type == "salesforce":
        return """
        <!-- Contextual Architectural Diagram: Salesforce CRM Event Stream -->
        <figure style="margin: 36px 0; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06);">
          <div style="background: #0f172a; padding: 14px 22px; display: flex; justify-content: space-between; align-items: center; color: #ffffff;">
            <span style="font-size: 13.5px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #38bdf8; display: inline-block;"></span>
              Figure 1: Salesforce ISV Enterprise CRM & ERP Bi-Directional Event Stream
            </span>
            <span style="font-size: 11px; background: rgba(56, 189, 248, 0.2); color: #bae6fd; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-weight: 700;">SALESFORCE ISV</span>
          </div>

          <div style="padding: 24px 26px; background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px;">
              <div style="background: #ffffff; border: 1.5px solid #0284c7; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #0284c7; margin-bottom: 4px;">SALESFORCE CRM</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Lightning Web App</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Customer 360 View</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #38bdf8; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #0284c7; margin-bottom: 4px;">EVENT BUS</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Real-Time CDC</div>
                <div style="font-size: 11px; color: #0284c7; font-weight: 600; margin-top: 4px;">Sub-Second Sync</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #10b981; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #10b981; margin-bottom: 4px;">CORALGENZ API</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Custom Integrator</div>
                <div style="font-size: 11px; color: #10b981; font-weight: 600; margin-top: 4px;">ERP & Billing Sync</div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; text-align: center;">
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Sync Latency</div>
                <div style="font-size: 20px; font-weight: 800; color: #0284c7; margin-top: 4px;">&lt; 1.0s</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Data Accuracy</div>
                <div style="font-size: 20px; font-weight: 800; color: #10b981; margin-top: 4px;">99.99%</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Admin Hours Saved</div>
                <div style="font-size: 20px; font-weight: 800; color: #0055fe; margin-top: 4px;">75%</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Architecture</div>
                <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 6px;">Native ISV</div>
              </div>
            </div>
          </div>
          <figcaption style="padding: 10px 20px; background: #f8fafc; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b; text-align: center;">
            Source: Coralgenz Global Enterprise CRM Integration Practice
          </figcaption>
        </figure>
        """

    elif topic_type == "shopify":
        return """
        <!-- Contextual Architectural Diagram: Headless Shopify Speed -->
        <figure style="margin: 36px 0; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06);">
          <div style="background: #0f172a; padding: 14px 22px; display: flex; justify-content: space-between; align-items: center; color: #ffffff;">
            <span style="font-size: 13.5px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
              Figure 1: Headless Shopify Architecture: Edge CDN & Sub-Second Checkout
            </span>
            <span style="font-size: 11px; background: rgba(16, 185, 129, 0.2); color: #6ee7b7; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-weight: 700;">SHOPIFY PLUS</span>
          </div>

          <div style="padding: 24px 26px; background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px;">
              <div style="background: #ffffff; border: 1.5px solid #10b981; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #10b981; margin-bottom: 4px;">EDGE STOREFRONT</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Next.js Edge CDN</div>
                <div style="font-size: 11px; color: #10b981; font-weight: 600; margin-top: 4px;">&lt; 700ms TTFB</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #0055fe; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #0055fe; margin-bottom: 4px;">STOREFRONT API</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">GraphQL Gateway</div>
                <div style="font-size: 11px; color: #0055fe; font-weight: 600; margin-top: 4px;">Real-Time Stock</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #f59e0b; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #f59e0b; margin-bottom: 4px;">CHECKOUT CORE</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Shopify Pay / 1-Click</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 4px;">High Conversion</div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; text-align: center;">
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Page Load Speed</div>
                <div style="font-size: 20px; font-weight: 800; color: #10b981; margin-top: 4px;">&lt; 700ms</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Cart Abandonment</div>
                <div style="font-size: 20px; font-weight: 800; color: #0055fe; margin-top: 4px;">-28%</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Mobile Lighthouse</div>
                <div style="font-size: 20px; font-weight: 800; color: #10b981; margin-top: 4px;">98 / 100</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Concurrency Capacity</div>
                <div style="font-size: 16px; font-weight: 800; color: #0f172a; margin-top: 6px;">100k+ Shoppers</div>
              </div>
            </div>
          </div>
          <figcaption style="padding: 10px 20px; background: #f8fafc; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b; text-align: center;">
            Source: Coralgenz Global Headless E-Commerce Practice
          </figcaption>
        </figure>
        """

    elif topic_type == "ai":
        return """
        <!-- Contextual Architectural Diagram: Private Enterprise AI Pipeline -->
        <figure style="margin: 36px 0; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06);">
          <div style="background: #0f172a; padding: 14px 22px; display: flex; justify-content: space-between; align-items: center; color: #ffffff;">
            <span style="font-size: 13.5px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #14b8a6; display: inline-block;"></span>
              Figure 1: Private Enterprise AI Pipeline & Zero-Leak Data Guardrails
            </span>
            <span style="font-size: 11px; background: rgba(20, 184, 166, 0.2); color: #5eead4; padding: 3px 8px; border-radius: 4px; font-family: monospace; font-weight: 700;">ISOLATED VPC</span>
          </div>

          <div style="padding: 24px 26px; background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px;">
              <div style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 4px;">INGESTION</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Internal Docs</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Zero Public Cloud</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #14b8a6; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #14b8a6; margin-bottom: 4px;">VECTOR STORE</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">VPC Isolated</div>
                <div style="font-size: 11px; color: #14b8a6; font-weight: 600; margin-top: 4px;">Strict Encryption</div>
              </div>
              <div style="background: #ffffff; border: 1.5px solid #10b981; border-radius: 10px; padding: 14px 10px; text-align: center;">
                <div style="font-size: 11px; font-weight: 700; color: #10b981; margin-bottom: 4px;">GUARDRAILS</div>
                <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Zero-Leak Filter</div>
                <div style="font-size: 11px; color: #10b981; font-weight: 700; margin-top: 4px;">Hallucination Guard</div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; text-align: center;">
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Data Privacy</div>
                <div style="font-size: 20px; font-weight: 800; color: #14b8a6; margin-top: 4px;">100% VPC</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Training Leak Risk</div>
                <div style="font-size: 20px; font-weight: 800; color: #10b981; margin-top: 4px;">0.00%</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Retrieval Accuracy</div>
                <div style="font-size: 20px; font-weight: 800; color: #0055fe; margin-top: 4px;">96.4%</div>
              </div>
              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 10px;">
                <div style="font-size: 11px; color: #64748b; font-weight: 700;">Query Latency</div>
                <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 4px;">&lt; 1.2s</div>
              </div>
            </div>
          </div>
          <figcaption style="padding: 10px 20px; background: #f8fafc; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b; text-align: center;">
            Source: Coralgenz Global Applied Artificial Intelligence Group
          </figcaption>
        </figure>
        """

    # For company / culture / founders / team / recap / general advice, return empty string
    return ""
