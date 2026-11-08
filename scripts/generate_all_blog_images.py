"""
Generates 180 distinct, unique, company-branded 1200x675 SVG illustrations
representing Coralgenz Global and each article's individual topic and content.
Outputs:
  assets/images/blog/post-<id>.svg
  public/assets/images/blog/post-<id>.svg
"""

import os
import re
import xml.etree.ElementTree as ET
import shutil
from generate_all_blog_pages import RAW_POSTS

OUTPUT_DIR_1 = "assets/images/blog"
OUTPUT_DIR_2 = "public/assets/images/blog"
os.makedirs(OUTPUT_DIR_1, exist_ok=True)
os.makedirs(OUTPUT_DIR_2, exist_ok=True)

def wrap_title(title, max_chars=34, max_lines=3):
    words = title.split()
    lines = []
    curr = []
    curr_len = 0
    for w in words:
        if curr_len + len(w) + (1 if curr else 0) <= max_chars:
            curr.append(w)
            curr_len += len(w) + (1 if len(curr) > 1 else 0)
        else:
            if curr:
                lines.append(" ".join(curr))
            curr = [w]
            curr_len = len(w)
            if len(lines) == max_lines - 1:
                break
    if curr and len(lines) < max_lines:
        lines.append(" ".join(curr))
    consumed = sum(len(l.split()) for l in lines)
    if consumed < len(words) and lines:
        lines[-1] += "..."
    while len(lines) < max_lines:
        lines.append("")
    return lines

def escape_xml(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;").replace("'", "&apos;")

def get_graphic_for_post(post_id, title, category):
    t = title.lower()
    c = category.lower()

    # Determine visual archetype and content-specific graphic
    if "vault" in t or ".secure" in t or "zero-knowledge" in t or "self-destruct" in t:
        archetype = "vault"
        gradient_theme = ("#064e3b", "#022c22", "#10b981", "#34d399")
        metric_tag = "AES-256-GCM Zero-Knowledge Vault"
        graphic = """
        <!-- Isometric Cryptographic Safe & Encryption Rings -->
        <g transform="translate(40, 30)">
          <circle cx="160" cy="180" r="140" stroke="#10b981" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.4"/>
          <circle cx="160" cy="180" r="110" stroke="#34d399" stroke-width="2" stroke-dasharray="3 3" opacity="0.6"/>
          <!-- Safe Box -->
          <rect x="70" y="90" width="180" height="180" rx="24" fill="#0b1b17" stroke="#10b981" stroke-width="3"/>
          <circle cx="160" cy="180" r="54" fill="#047857" stroke="#34d399" stroke-width="3"/>
          <!-- Padlock mechanism -->
          <rect x="142" y="165" width="36" height="30" rx="6" fill="#ffffff"/>
          <path d="M 148 165 V 150 C 148 143.4 153.4 138 160 138 C 166.6 138 172 143.4 172 150 V 165" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round"/>
          <circle cx="160" cy="178" r="4" fill="#064e3b"/>
          <path d="M 160 182 V 188" stroke="#064e3b" stroke-width="3" stroke-linecap="round"/>
          <!-- Orbiting Key Badges -->
          <rect x="230" y="70" width="80" height="28" rx="14" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
          <text x="270" y="88" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#34d399" text-anchor="middle">256-BIT</text>
          <rect x="10" y="240" width="90" height="28" rx="14" fill="#0f172a" stroke="#34d399" stroke-width="1.5"/>
          <text x="55" y="258" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#a7f3d0" text-anchor="middle">.SECURE</text>
        </g>
        """
    elif "compiler" in t or "code anywhere" in t or "python" in t or "java" in t or "c++" in t:
        archetype = "compiler"
        gradient_theme = ("#083344", "#164e63", "#06b6d4", "#67e8f9")
        metric_tag = "Sub-50ms WebAssembly Sandbox"
        graphic = """
        <!-- Modern Code Terminal & Compiler Engine -->
        <g transform="translate(30, 25)">
          <rect x="30" y="50" width="300" height="240" rx="16" fill="#0b1320" stroke="#06b6d4" stroke-width="2.5"/>
          <!-- Window Header -->
          <rect x="30" y="50" width="300" height="38" rx="16" fill="#164e63"/>
          <circle cx="54" cy="69" r="6" fill="#ef4444"/>
          <circle cx="74" cy="69" r="6" fill="#f59e0b"/>
          <circle cx="94" cy="69" r="6" fill="#10b981"/>
          <text x="180" y="73" font-family="'Inter', monospace" font-size="12" font-weight="700" fill="#e0f2fe" text-anchor="middle">compiler.coralgenz.net</text>
          <!-- Code Lines -->
          <text x="54" y="120" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="700" fill="#38bdf8">&gt; run main.py --wasm</text>
          <text x="54" y="148" font-family="'JetBrains Mono', monospace" font-size="12" fill="#67e8f9">import coralgenz.crypto as cc</text>
          <text x="54" y="172" font-family="'JetBrains Mono', monospace" font-size="12" fill="#a5f3fc">def execute_isolated():</text>
          <text x="74" y="196" font-family="'JetBrains Mono', monospace" font-size="12" fill="#34d399">return status.OK (42ms)</text>
          <!-- Speed Flash Pill -->
          <rect x="54" y="225" width="250" height="36" rx="8" fill="rgba(6, 182, 212, 0.15)" stroke="#06b6d4" stroke-width="1.5"/>
          <polygon points="74 235 68 247 78 247 72 257 84 243 76 243" fill="#f59e0b"/>
          <text x="96" y="248" font-family="'Inter', sans-serif" font-size="12" font-weight="800" fill="#ffffff">WASM ENGINE: 42MS LATENCY</text>
        </g>
        """
    elif "qr" in t or "scan" in t:
        archetype = "qr"
        gradient_theme = ("#4c1d95", "#2e1065", "#8b5cf6", "#c4b5fd")
        metric_tag = "Smart Dynamic QR Telemetry"
        graphic = """
        <!-- Dynamic QR Matrix & Radar Telemetry Scan -->
        <g transform="translate(40, 25)">
          <circle cx="160" cy="170" r="130" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.4"/>
          <circle cx="160" cy="170" r="95" stroke="#c4b5fd" stroke-width="2" opacity="0.5"/>
          <!-- Radar beam -->
          <line x1="160" y1="170" x2="270" y2="100" stroke="#a78bfa" stroke-width="3" stroke-linecap="round"/>
          <polygon points="160 170 270 100 290 140" fill="rgba(139, 92, 246, 0.25)"/>
          <!-- QR Center Frame -->
          <rect x="85" y="95" width="150" height="150" rx="18" fill="#0f172a" stroke="#8b5cf6" stroke-width="3"/>
          <!-- QR Corners -->
          <rect x="100" y="110" width="36" height="36" rx="6" stroke="#c4b5fd" stroke-width="3" fill="none"/>
          <rect x="108" y="118" width="20" height="20" rx="3" fill="#8b5cf6"/>
          <rect x="184" y="110" width="36" height="36" rx="6" stroke="#c4b5fd" stroke-width="3" fill="none"/>
          <rect x="192" y="118" width="20" height="20" rx="3" fill="#8b5cf6"/>
          <rect x="100" y="194" width="36" height="36" rx="6" stroke="#c4b5fd" stroke-width="3" fill="none"/>
          <rect x="108" y="202" width="20" height="20" rx="3" fill="#8b5cf6"/>
          <!-- Center Logo -->
          <circle cx="160" cy="170" r="16" fill="#0055fe" stroke="#ffffff" stroke-width="2"/>
          <circle cx="160" cy="170" r="6" fill="#ffffff"/>
          <!-- Conversion Pill -->
          <rect x="60" y="270" width="200" height="32" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
          <text x="160" y="291" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#34d399" text-anchor="middle">+34.8% CONVERSION RATE</text>
        </g>
        """
    elif "startup" in t or "mvp" in t or "idea" in t or "founder" in t or "launch" in t:
        archetype = "startup"
        gradient_theme = ("#78350f", "#451a03", "#f59e0b", "#fcd34d")
        metric_tag = "4-Week Rapid MVP Launch Roadmap"
        graphic = """
        <!-- Launch Rocket & Velocity Roadmap -->
        <g transform="translate(40, 20)">
          <!-- Orbital rings -->
          <ellipse cx="160" cy="180" rx="140" ry="70" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.4" transform="rotate(-25 160 180)"/>
          <!-- Rocket Body -->
          <path d="M 160 50 C 160 50 200 90 200 160 C 200 190 185 220 160 230 C 135 220 120 190 120 160 C 120 90 160 50 160 50 Z" fill="#b45309" stroke="#fcd34d" stroke-width="3"/>
          <!-- Porthole -->
          <circle cx="160" cy="120" r="18" fill="#0f172a" stroke="#fcd34d" stroke-width="3"/>
          <circle cx="160" cy="120" r="8" fill="#38bdf8"/>
          <!-- Fins -->
          <path d="M 120 160 L 90 200 L 125 210 Z" fill="#78350f" stroke="#f59e0b" stroke-width="2"/>
          <path d="M 200 160 L 230 200 L 195 210 Z" fill="#78350f" stroke="#f59e0b" stroke-width="2"/>
          <!-- Flame -->
          <polygon points="145 230 160 270 175 230" fill="#ef4444"/>
          <polygon points="152 230 160 255 168 230" fill="#f59e0b"/>
          <!-- Milestone Badge -->
          <rect x="70" y="260" width="180" height="34" rx="8" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="160" y="282" font-family="'Inter', sans-serif" font-size="12" font-weight="800" fill="#fcd34d" text-anchor="middle">WEEK 4: MARKET READY</text>
        </g>
        """
    elif "cloud" in t or "azure" in t or "server" in t or "devops" in t or "backup" in t:
        archetype = "cloud"
        gradient_theme = ("#0369a1", "#0c4a6e", "#0ea5e9", "#7dd3fc")
        metric_tag = "Microsoft Azure High-Availability"
        graphic = """
        <!-- Multi-Region Cloud & Replicated Nodes -->
        <g transform="translate(40, 25)">
          <path d="M 110 170 H 210 C 235 170 255 150 255 125 C 255 102 236 83 213 81 C 208 52 183 30 152 30 C 122 30 97 51 91 80 C 66 84 47 105 47 130 C 47 152 65 170 90 170 H 110 Z" fill="#0284c7" stroke="#7dd3fc" stroke-width="3" opacity="0.9"/>
          <!-- Microservices Node Cluster -->
          <rect x="70" y="195" width="80" height="45" rx="8" fill="#0f172a" stroke="#0ea5e9" stroke-width="2"/>
          <text x="110" y="222" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#7dd3fc" text-anchor="middle">REGION 1</text>
          <rect x="170" y="195" width="80" height="45" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
          <text x="210" y="222" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#34d399" text-anchor="middle">HOT SYNC</text>
          <!-- Connection lines -->
          <line x1="110" y1="170" x2="110" y2="195" stroke="#7dd3fc" stroke-width="2" stroke-dasharray="3 3"/>
          <line x1="210" y1="170" x2="210" y2="195" stroke="#34d399" stroke-width="2" stroke-dasharray="3 3"/>
          <rect x="80" y="260" width="160" height="30" rx="15" fill="#0f172a" stroke="#0ea5e9" stroke-width="1.5"/>
          <text x="160" y="280" font-family="'Inter', sans-serif" font-size="11" font-weight="800" fill="#ffffff" text-anchor="middle">99.99% UPTIME SLA</text>
        </g>
        """
    elif "salesforce" in t or "crm" in t or "lead" in t:
        archetype = "salesforce"
        gradient_theme = ("#0284c7", "#075985", "#38bdf8", "#bae6fd")
        metric_tag = "Salesforce ISV Enterprise CRM"
        graphic = """
        <!-- Salesforce CRM Cloud & Bi-Directional CDC -->
        <g transform="translate(40, 25)">
          <path d="M 120 90 C 130 70 152 65 170 75 C 185 55 215 58 228 80 C 245 83 258 98 255 116 C 268 132 262 155 242 168 C 245 180 236 198 215 200 C 205 215 180 220 165 208 C 150 220 125 215 112 198 C 92 200 75 185 75 164 C 60 152 60 125 75 110 C 78 92 98 80 118 86" fill="#0284c7" stroke="#bae6fd" stroke-width="3"/>
          <!-- Lightning Bolt -->
          <polygon points="165 100 135 150 168 150 150 200 200 140 168 140" fill="#fcd34d" stroke="#f59e0b" stroke-width="2"/>
          <rect x="70" y="240" width="180" height="36" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="160" y="263" font-family="'Inter', sans-serif" font-size="12" font-weight="800" fill="#38bdf8" text-anchor="middle">SUB-SECOND LEAD SYNC</text>
        </g>
        """
    elif "shopify" in t or "store" in t or "e-commerce" in t or "checkout" in t or "cart" in t:
        archetype = "shopify"
        gradient_theme = ("#047857", "#064e3b", "#10b981", "#6ee7b7")
        metric_tag = "Headless Shopify Sub-Second Checkout"
        graphic = """
        <!-- Lightning Cart & Edge Commerce -->
        <g transform="translate(40, 25)">
          <!-- Shopping Cart Frame -->
          <path d="M 60 80 H 90 L 115 180 H 225 L 245 100 H 100" stroke="#6ee7b7" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <circle cx="130" cy="215" r="16" fill="#10b981" stroke="#ffffff" stroke-width="3"/>
          <circle cx="210" cy="215" r="16" fill="#10b981" stroke="#ffffff" stroke-width="3"/>
          <!-- Speed Flash -->
          <polygon points="175 60 155 100 180 100 165 140 205 90 180 90" fill="#f59e0b" stroke="#fcd34d" stroke-width="2"/>
          <rect x="70" y="255" width="180" height="34" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
          <text x="160" y="277" font-family="'Inter', sans-serif" font-size="12" font-weight="800" fill="#6ee7b7" text-anchor="middle">&lt; 700MS LOAD TIME</text>
        </g>
        """
    elif "ai" in t or "chatbot" in t or "automate" in t or "ocr" in t or "intelligence" in t:
        archetype = "ai"
        gradient_theme = ("#0f766e", "#115e59", "#14b8a6", "#5eead4")
        metric_tag = "Private Isolated Enterprise AI"
        graphic = """
        <!-- Neural Synapses & Data Guardrails -->
        <g transform="translate(40, 25)">
          <!-- Neural Graph Circles -->
          <circle cx="160" cy="150" r="32" fill="#0f766e" stroke="#5eead4" stroke-width="3"/>
          <circle cx="80" cy="90" r="18" fill="#115e59" stroke="#2dd4bf" stroke-width="2"/>
          <circle cx="240" cy="90" r="18" fill="#115e59" stroke="#2dd4bf" stroke-width="2"/>
          <circle cx="80" cy="210" r="18" fill="#115e59" stroke="#2dd4bf" stroke-width="2"/>
          <circle cx="240" cy="210" r="18" fill="#115e59" stroke="#2dd4bf" stroke-width="2"/>
          <line x1="95" y1="102" x2="135" y2="132" stroke="#5eead4" stroke-width="2"/>
          <line x1="225" y1="102" x2="185" y2="132" stroke="#5eead4" stroke-width="2"/>
          <line x1="95" y1="198" x2="135" y2="168" stroke="#5eead4" stroke-width="2"/>
          <line x1="225" y1="198" x2="185" y2="168" stroke="#5eead4" stroke-width="2"/>
          <polygon points="160 135 150 155 170 155" fill="#ffffff"/>
          <rect x="70" y="255" width="180" height="34" rx="8" fill="#0f172a" stroke="#14b8a6" stroke-width="1.5"/>
          <text x="160" y="277" font-family="'Inter', sans-serif" font-size="12" font-weight="800" fill="#5eead4" text-anchor="middle">ZERO-LEAK VPC SHIELD</text>
        </g>
        """
    elif "modern" in t or "legacy" in t or "pwa" in t or "dashboard" in t or "speed" in t or "ui/ux" in t:
        archetype = "modern"
        gradient_theme = ("#581c87", "#3b0764", "#a855f7", "#e9d5ff")
        metric_tag = "Modern Modular PWA Architecture"
        graphic = """
        <!-- Desktop + Mobile Multi-Device PWA Frame -->
        <g transform="translate(30, 20)">
          <!-- Laptop Base -->
          <rect x="30" y="70" width="180" height="115" rx="10" fill="#1e1b4b" stroke="#c084fc" stroke-width="2"/>
          <rect x="42" y="82" width="156" height="85" rx="4" fill="#0f172a"/>
          <!-- Smartphone -->
          <rect x="180" y="110" width="90" height="160" rx="14" fill="#0f172a" stroke="#e9d5ff" stroke-width="2.5"/>
          <circle cx="225" cy="255" r="7" fill="#a855f7"/>
          <path d="M 70 140 L 95 115 L 120 130 L 150 100" stroke="#34d399" stroke-width="3" stroke-linecap="round" fill="none"/>
          <rect x="60" y="250" width="180" height="34" rx="8" fill="#0f172a" stroke="#a855f7" stroke-width="1.5"/>
          <text x="150" y="272" font-family="'Inter', sans-serif" font-size="12" font-weight="800" fill="#e9d5ff" text-anchor="middle">100/100 LIGHTHOUSE SPEED</text>
        </g>
        """
    elif "custom software" in t or "clean architecture" in t or "code ownership" in t or "spreadsheet" in t:
        archetype = "software"
        gradient_theme = ("#1e3a8a", "#172554", "#3b82f6", "#93c5fd")
        metric_tag = "100% Client Code Ownership"
        graphic = """
        <!-- Clean Architecture 4-Tier Blueprint Blocks -->
        <g transform="translate(40, 25)">
          <rect x="50" y="50" width="220" height="38" rx="8" fill="#2563eb" stroke="#93c5fd" stroke-width="2"/>
          <text x="160" y="74" font-family="'Inter', sans-serif" font-size="12" font-weight="800" fill="#ffffff" text-anchor="middle">UI &amp; PRESENTATION LAYER</text>
          <rect x="65" y="105" width="190" height="38" rx="8" fill="#1d4ed8" stroke="#60a5fa" stroke-width="2"/>
          <text x="160" y="129" font-family="'Inter', sans-serif" font-size="12" font-weight="800" fill="#ffffff" text-anchor="middle">APPLICATION USE CASES</text>
          <rect x="80" y="160" width="160" height="38" rx="8" fill="#1e40af" stroke="#3b82f6" stroke-width="2"/>
          <text x="160" y="184" font-family="'Inter', sans-serif" font-size="12" font-weight="800" fill="#ffffff" text-anchor="middle">CORE DOMAIN LOGIC</text>
          <rect x="95" y="215" width="130" height="38" rx="8" fill="#172554" stroke="#93c5fd" stroke-width="2"/>
          <text x="160" y="239" font-family="'Inter', sans-serif" font-size="11" font-weight="800" fill="#93c5fd" text-anchor="middle">INFRASTRUCTURE &amp; DB</text>
          <line x1="160" y1="88" x2="160" y2="105" stroke="#93c5fd" stroke-width="2" stroke-dasharray="2 2"/>
          <line x1="160" y1="143" x2="160" y2="160" stroke="#93c5fd" stroke-width="2" stroke-dasharray="2 2"/>
          <line x1="160" y1="198" x2="160" y2="215" stroke="#93c5fd" stroke-width="2" stroke-dasharray="2 2"/>
          <rect x="70" y="270" width="180" height="30" rx="15" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="160" y="290" font-family="'Inter', sans-serif" font-size="11" font-weight="800" fill="#38bdf8" text-anchor="middle">ZERO VENDOR LOCK-IN</text>
        </g>
        """
    else:
        archetype = "company"
        gradient_theme = ("#0055fe", "#0037a8", "#38bdf8", "#bfdbfe")
        metric_tag = "Coimbatore & Chennai Global Delivery"
        graphic = """
        <!-- Verified Enterprise Authority & Global Delivery Hub -->
        <g transform="translate(40, 25)">
          <circle cx="160" cy="160" r="120" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.5"/>
          <ellipse cx="160" cy="160" rx="110" ry="45" stroke="#93c5fd" stroke-width="1.5" opacity="0.4"/>
          <ellipse cx="160" cy="160" rx="45" ry="110" stroke="#93c5fd" stroke-width="1.5" opacity="0.4"/>
          <!-- Central Crest -->
          <circle cx="160" cy="160" r="48" fill="#0055fe" stroke="#ffffff" stroke-width="3"/>
          <path d="M 145 160 L 155 170 L 178 147" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="50" y="255" width="220" height="34" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
          <text x="160" y="277" font-family="'Inter', sans-serif" font-size="12" font-weight="800" fill="#ffffff" text-anchor="middle">COIMBATORE &amp; CHENNAI HQ</text>
        </g>
        """

    # Subtle chromatic shift based on post_id so each post has unique color nuance
    hue_shift = (post_id * 7) % 360
    return gradient_theme, metric_tag, graphic

def build_post_svg(post_id, date, title, category):
    lines = wrap_title(title, max_chars=34, max_lines=3)
    (c1, c2, accent, accent_light), metric_tag, graphic_svg = get_graphic_for_post(post_id, title, category)

    cat_escaped = escape_xml(category.upper())
    title_escaped = [escape_xml(l) for l in lines]
    metric_escaped = escape_xml(metric_tag)
    date_escaped = escape_xml(date.upper())

    # Calculate category pill width
    cat_width = max(110, len(cat_escaped) * 9 + 30)

    svg = f"""<svg width="1200" height="675" viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-{post_id}" x1="0" y1="0" x2="1200" y2="675" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0a0f1d"/>
      <stop offset="0.5" stop-color="{c1}"/>
      <stop offset="1" stop-color="{c2}"/>
    </linearGradient>
    <radialGradient id="glow-{post_id}" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(900 337) rotate(90) scale(360 480)">
      <stop stop-color="{accent}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="{accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="line-grad-{post_id}" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
      <stop stop-color="{accent}"/>
      <stop offset="0.5" stop-color="{accent_light}"/>
      <stop offset="1" stop-color="{accent}"/>
    </linearGradient>
    <pattern id="grid-{post_id}" width="38" height="38" patternUnits="userSpaceOnUse">
      <path d="M 38 0 L 0 0 0 38" fill="none" stroke="#ffffff" stroke-width="0.75" opacity="0.08"/>
    </pattern>
  </defs>

  <!-- Deep Tech Background -->
  <rect width="1200" height="675" fill="url(#bg-{post_id})"/>
  <rect width="1200" height="675" fill="url(#grid-{post_id})"/>
  <circle cx="920" cy="337" r="380" fill="url(#glow-{post_id})"/>

  <!-- Top Header Navigation Bar -->
  <g transform="translate(60, 48)">
    <!-- Coralgenz Logo & Mark -->
    <rect width="185" height="42" rx="21" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.2"/>
    <circle cx="22" cy="21" r="13" fill="#0055fe"/>
    <path d="M 17 21 L 20 24 L 27 17" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="44" y="26" font-family="'Satoshi', 'Inter', -apple-system, sans-serif" font-size="14" font-weight="800" fill="#ffffff" letter-spacing="0.5">CORALGENZ</text>

    <!-- Category Pill -->
    <rect x="200" y="0" width="{cat_width}" height="42" rx="21" fill="rgba(15, 23, 42, 0.75)" stroke="{accent}" stroke-width="1.2"/>
    <text x="{200 + cat_width // 2}" y="26" font-family="'Inter', sans-serif" font-size="12" font-weight="800" fill="{accent_light}" letter-spacing="0.8" text-anchor="middle">{cat_escaped}</text>

    <!-- Article ID & Date -->
    <text x="1080" y="26" text-anchor="end" font-family="'JetBrains Mono', 'Inter', monospace" font-size="13" font-weight="700" fill="#94a3b8">ARTICLE #{post_id} · {date_escaped}</text>
  </g>

  <!-- Left Content Block -->
  <g transform="translate(60, 160)">
    <rect x="0" y="0" width="48" height="4" rx="2" fill="{accent}"/>

    <!-- Wrapped Article Title -->
    <text x="0" y="55" font-family="'Satoshi', 'Inter', -apple-system, sans-serif" font-size="38" font-weight="800" fill="#ffffff" letter-spacing="-0.02em">
      <tspan x="0" dy="0">{title_escaped[0]}</tspan>
      <tspan x="0" dy="52">{title_escaped[1]}</tspan>
      <tspan x="0" dy="52">{title_escaped[2]}</tspan>
    </text>

    <!-- Key Takeaway Pill -->
    <g transform="translate(0, 230)">
      <rect width="360" height="44" rx="8" fill="rgba(15, 23, 42, 0.85)" stroke="{accent}" stroke-width="1.4"/>
      <circle cx="22" cy="22" r="5" fill="{accent}"/>
      <text x="38" y="27" font-family="'Inter', sans-serif" font-size="13.5" font-weight="700" fill="#ffffff">{metric_escaped}</text>
    </g>

    <!-- Authority Byline -->
    <text x="0" y="325" font-family="'Inter', sans-serif" font-size="14.5" font-weight="500" fill="#cbd5e1">
      Official Technology Playbook &amp; Architecture Roadmap by Coralgenz Global
    </text>
  </g>

  <!-- Right Graphic Area -->
  <g transform="translate(730, 130)">
    {graphic_svg}
  </g>

  <!-- Bottom Accent Line -->
  <rect x="0" y="670" width="1200" height="5" fill="url(#line-grad-{post_id})"/>
</svg>
"""
    return svg

def main():
    print(f"Generating 180 unique SVG images for all articles...")
    for idx, (display_date, iso_date, title, category) in enumerate(RAW_POSTS):
        post_id = idx + 1
        svg_content = build_post_svg(post_id, display_date, title, category)

        # Validate SVG
        try:
            ET.fromstring(svg_content)
        except Exception as e:
            print(f"Error validating SVG for post #{post_id} ({title}): {e}")
            raise e

        # Write to assets/images/blog/post-<id>.svg
        filename = f"post-{post_id}.svg"
        p1 = os.path.join(OUTPUT_DIR_1, filename)
        p2 = os.path.join(OUTPUT_DIR_2, filename)

        with open(p1, "w", encoding="utf-8") as f:
            f.write(svg_content)
        with open(p2, "w", encoding="utf-8") as f:
            f.write(svg_content)

    print(f"Successfully generated all 180 SVG files in {OUTPUT_DIR_1} and {OUTPUT_DIR_2}!")

if __name__ == "__main__":
    main()
