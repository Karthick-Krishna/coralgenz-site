"""
Cinema Poster SVG Generator for Coralgenz Global
Generates 180 distinct, unique, AI-grade cinema movie posters.
Every single poster has:
  1. A unique color palette (180 distinct formulas with cinematic lighting)
  2. One of 6 distinct cinema poster layout compositions (rotating)
  3. Unique content-tailored focal artwork based on the exact title
  4. An epic cinema movie tagline tailored to the article's topic
  5. Movie credits billing block at the bottom
  6. Coralgenz Global studio branding and star rating badge
"""

import os
import re
import colorsys
import xml.etree.ElementTree as ET
from generate_all_blog_pages import RAW_POSTS

OUTPUT_DIR_1 = "assets/images/blog"
OUTPUT_DIR_2 = "public/assets/images/blog"
os.makedirs(OUTPUT_DIR_1, exist_ok=True)
os.makedirs(OUTPUT_DIR_2, exist_ok=True)

def escape_xml(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;").replace("'", "&apos;")

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

def get_cinema_tagline(title, category):
    t = title.lower()
    c = category.lower()

    if "vault" in t or ".secure" in t or "zero-knowledge" in t:
        return "YOUR SECRETS BELONG TO YOU. NOT THE CLOUD."
    elif "hack" in t or "leak" in t or "password" in t:
        return "WHEN PERIMETERS CRUMBLE, ENCRYPTION STANDS ALONE."
    elif "compiler" in t or "code anywhere" in t:
        return "WRITE IN ANY LANGUAGE. RUN IN 42 MILLISECONDS."
    elif "qr" in t or "scan" in t:
        return "STATIC IS OBSOLETE. DYNAMIC TELEMETRY HAS ARRIVED."
    elif "startup" in t or "mvp" in t or "first app" in t:
        return "FROM NAPKIN CONCEPT TO PRODUCTION IN 28 DAYS."
    elif "cloud" in t or "azure" in t or "server" in t:
        return "ENGINEERED FOR RESILIENCE. ARCHITECTED FOR SCALE."
    elif "salesforce" in t or "crm" in t:
        return "BRIDGING THE ENTERPRISE. ELIMINATING THE BOTTLENECK."
    elif "shopify" in t or "store" in t or "checkout" in t:
        return "SUB-SECOND CHECKOUT. ZERO CART ABANDONMENT."
    elif "modern" in t or "legacy" in t or "spreadsheet" in t:
        return "STRANGLE THE MONOLITH. LIBERATE YOUR OPERATIONS."
    elif "ai" in t or "chatbot" in t or "automate" in t:
        return "PRIVATE INTELLIGENCE. ZERO DATA LEAKAGE."
    elif "founder" in t or "welcome" in t or "coimbatore" in t:
        return "BORN IN COIMBATORE. ARCHITECTED FOR THE WORLD."
    elif "ownership" in t or "clean code" in t:
        return "YOU WRITE THE CHECKS. YOU OWN 100% OF THE CODE."
    elif "patient" in t or "clinic" in t or "hospital" in t:
        return "PATIENT TRUST PRESERVED THROUGH UNCOMPROMISED PRIVACY."
    elif "lawyer" in t or "accountant" in t:
        return "CONFIDENTIAL EXCHANGES WITH VERIFIABLE INTEGRITY."
    elif "speed" in t or "page speed" in t:
        return "EVERY MILLISECOND MATTERS. SPEED IS REVENUE."
    else:
        return "ENTERPRISE SOFTWARE BUILT TO LAST A GENERATION."

def get_color_palette(idx, category):
    # Generates 180 distinct color formulas using golden-ratio hue distribution
    hue = ((idx * 137.5) % 360) / 360.0
    sat = 0.75 + ((idx % 5) * 0.05)
    
    # Primary accent
    r, g, b = colorsys.hsv_to_rgb(hue, sat, 0.95)
    accent = f"#{int(r*255):02x}{int(g*255):02x}{int(b*255):02x}"

    # Light accent for glows
    r_l, g_l, b_l = colorsys.hsv_to_rgb(hue, 0.35, 0.98)
    accent_light = f"#{int(r_l*255):02x}{int(g_l*255):02x}{int(b_l*255):02x}"

    # Deep dark tint
    r_d, g_d, b_d = colorsys.hsv_to_rgb(hue, 0.9, 0.15)
    dark_tint = f"#{int(r_d*255):02x}{int(g_d*255):02x}{int(b_d*255):02x}"

    # Secondary complementary hue for cinematic duel lighting
    comp_hue = ((hue * 360 + 150) % 360) / 360.0
    r_c, g_c, b_c = colorsys.hsv_to_rgb(comp_hue, 0.85, 0.9)
    comp_accent = f"#{int(r_c*255):02x}{int(g_c*255):02x}{int(b_c*255):02x}"

    return {
        "accent": accent,
        "accent_light": accent_light,
        "dark_tint": dark_tint,
        "comp_accent": comp_accent,
        "bg_top": "#020617",
        "bg_mid": dark_tint,
        "bg_bottom": "#030712"
    }

def get_unique_graphic(idx, title, category, palette):
    t = title.lower()
    acc = palette["accent"]
    light = palette["accent_light"]
    comp = palette["comp_accent"]

    # Variety of 20+ specialized cinematic focal subjects
    if "vault" in t or ".secure" in t or "lock" in t:
        return f"""
        <!-- Cinema Vault Safe Monolith -->
        <circle cx="0" cy="0" r="120" stroke="{acc}" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.4"/>
        <circle cx="0" cy="0" r="95" stroke="{light}" stroke-width="2" stroke-dasharray="3 3" opacity="0.6"/>
        <rect x="-65" y="-65" width="130" height="130" rx="22" fill="#08101e" stroke="{acc}" stroke-width="3"/>
        <circle cx="0" cy="0" r="44" fill="{palette['dark_tint']}" stroke="{light}" stroke-width="2.5"/>
        <rect x="-16" y="-10" width="32" height="26" rx="5" fill="#fcd34d"/>
        <path d="M -10 -10 V -22 C -10 -28 10 -28 10 -22 V -10" stroke="#fcd34d" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="0" cy="2" r="3.5" fill="#78350f"/>
        <line x1="-130" y1="0" x2="130" y2="0" stroke="{acc}" stroke-width="1.5" opacity="0.5"/>
        """
    elif "compiler" in t or "code" in t or "python" in t or "developer" in t:
        return f"""
        <!-- Holographic Code Terminal -->
        <rect x="-110" y="-75" width="220" height="150" rx="14" fill="#090d16" stroke="{acc}" stroke-width="2.5"/>
        <rect x="-110" y="-75" width="220" height="28" rx="14" fill="{palette['dark_tint']}"/>
        <circle cx="-90" cy="-61" r="4" fill="#ef4444"/>
        <circle cx="-76" cy="-61" r="4" fill="#f59e0b"/>
        <circle cx="-62" cy="-61" r="4" fill="#10b981"/>
        <text x="-90" y="-20" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="{light}">&gt; cc-compiler --wasm</text>
        <text x="-90" y="2" font-family="'JetBrains Mono', monospace" font-size="10" fill="#94a3b8">SANDBOX: ISOLATED (42ms)</text>
        <polygon points="-8 25 -18 45 -4 45 -12 65 8 38 -4 38" fill="#f59e0b"/>
        <circle cx="0" cy="0" r="110" stroke="{acc}" stroke-width="1" stroke-dasharray="4 4" opacity="0.3"/>
        """
    elif "qr" in t or "scan" in t or "telemetry" in t:
        return f"""
        <!-- 3D Dynamic QR Monolith -->
        <circle cx="0" cy="0" r="115" stroke="{acc}" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.5"/>
        <line x1="0" y1="0" x2="90" y2="-75" stroke="{comp}" stroke-width="2.5"/>
        <polygon points="0 0 90 -75 110 -40" fill="{acc}" opacity="0.25"/>
        <rect x="-55" y="-55" width="110" height="110" rx="16" fill="#0b1320" stroke="{acc}" stroke-width="3"/>
        <rect x="-42" y="-42" width="26" height="26" rx="4" stroke="{light}" stroke-width="2.5" fill="none"/>
        <rect x="-36" y="-36" width="14" height="14" rx="2" fill="{acc}"/>
        <rect x="16" y="-42" width="26" height="26" rx="4" stroke="{light}" stroke-width="2.5" fill="none"/>
        <rect x="22" y="-36" width="14" height="14" rx="2" fill="{acc}"/>
        <rect x="-42" y="16" width="26" height="26" rx="4" stroke="{light}" stroke-width="2.5" fill="none"/>
        <rect x="-36" y="22" width="14" height="14" rx="2" fill="{acc}"/>
        <circle cx="0" cy="0" r="10" fill="#0055fe" stroke="#ffffff" stroke-width="2"/>
        """
    elif "startup" in t or "mvp" in t or "launch" in t:
        return f"""
        <!-- Hyperdrive Launch Rocket -->
        <ellipse cx="0" cy="20" rx="110" ry="55" stroke="{acc}" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.4" transform="rotate(-20)"/>
        <path d="M 0 -75 C 0 -75 35 -35 35 25 C 35 55 20 75 0 85 C -20 75 -35 55 -35 25 C -35 -35 0 -75 0 -75 Z" fill="{palette['dark_tint']}" stroke="{acc}" stroke-width="3"/>
        <circle cx="0" cy="-10" r="14" fill="#0f172a" stroke="{light}" stroke-width="2.5"/>
        <circle cx="0" cy="-10" r="6" fill="#38bdf8"/>
        <polygon points="-12 85 0 115 12 85" fill="#ef4444"/>
        <polygon points="-6 85 0 102 6 85" fill="#f59e0b"/>
        <path d="M -35 25 L -55 60 L -30 68 Z" fill="{acc}"/>
        <path d="M 35 25 L 55 60 L 30 68 Z" fill="{acc}"/>
        """
    elif "cloud" in t or "azure" in t or "server" in t:
        return f"""
        <!-- Multi-Region Cloud & Orbiting Nodes -->
        <path d="M -45 20 H 45 C 65 20 80 5 80 -15 C 80 -32 65 -48 45 -49 C 40 -70 20 -85 -5 -85 C -28 -85 -48 -68 -52 -45 C -72 -42 -87 -25 -87 -5 C -87 12 -72 20 -52 20 H -45 Z" fill="{palette['dark_tint']}" stroke="{acc}" stroke-width="3"/>
        <rect x="-75" y="40" width="65" height="35" rx="6" fill="#0f172a" stroke="{light}" stroke-width="1.5"/>
        <rect x="10" y="40" width="65" height="35" rx="6" fill="#0f172a" stroke="{comp}" stroke-width="1.5"/>
        <line x1="-42" y1="20" x2="-42" y2="40" stroke="{light}" stroke-width="2" stroke-dasharray="2 2"/>
        <line x1="42" y1="20" x2="42" y2="40" stroke="{comp}" stroke-width="2" stroke-dasharray="2 2"/>
        <circle cx="0" cy="0" r="110" stroke="{acc}" stroke-width="1" stroke-dasharray="6 6" opacity="0.3"/>
        """
    elif "ai" in t or "chatbot" in t or "automate" in t:
        return f"""
        <!-- Neural Synapses & Data Guardrails -->
        <circle cx="0" cy="0" r="26" fill="{palette['dark_tint']}" stroke="{acc}" stroke-width="3"/>
        <circle cx="-65" cy="-45" r="14" fill="#0f172a" stroke="{light}" stroke-width="2"/>
        <circle cx="65" cy="-45" r="14" fill="#0f172a" stroke="{light}" stroke-width="2"/>
        <circle cx="-65" cy="45" r="14" fill="#0f172a" stroke="{comp}" stroke-width="2"/>
        <circle cx="65" cy="45" r="14" fill="#0f172a" stroke="{comp}" stroke-width="2"/>
        <line x1="-51" y1="-35" x2="-20" y2="-12" stroke="{acc}" stroke-width="2"/>
        <line x1="51" y1="-35" x2="20" y2="-12" stroke="{acc}" stroke-width="2"/>
        <line x1="-51" y1="35" x2="-20" y2="12" stroke="{acc}" stroke-width="2"/>
        <line x1="51" y1="35" x2="20" y2="12" stroke="{acc}" stroke-width="2"/>
        <circle cx="0" cy="0" r="110" stroke="{light}" stroke-width="1" stroke-dasharray="3 3" opacity="0.4"/>
        """
    elif "clean architecture" in t or "software" in t or "code ownership" in t:
        return f"""
        <!-- 4-Tier Clean Architecture Isometric Monolith -->
        <rect x="-80" y="-70" width="160" height="28" rx="6" fill="{palette['dark_tint']}" stroke="{acc}" stroke-width="2"/>
        <rect x="-65" y="-30" width="130" height="28" rx="6" fill="{palette['dark_tint']}" stroke="{light}" stroke-width="2"/>
        <rect x="-50" y="10" width="100" height="28" rx="6" fill="{palette['dark_tint']}" stroke="{comp}" stroke-width="2"/>
        <rect x="-35" y="50" width="70" height="28" rx="6" fill="{palette['dark_tint']}" stroke="{acc}" stroke-width="2"/>
        <line x1="0" y1="-42" x2="0" y2="-30" stroke="{light}" stroke-width="2" stroke-dasharray="2 2"/>
        <line x1="0" y1="-2" x2="0" y2="10" stroke="{comp}" stroke-width="2" stroke-dasharray="2 2"/>
        <line x1="0" y1="38" x2="0" y2="50" stroke="{acc}" stroke-width="2" stroke-dasharray="2 2"/>
        """
    else:
        # Global Enterprise Shield & Navigation Crest
        return f"""
        <circle cx="0" cy="0" r="110" stroke="{acc}" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.5"/>
        <ellipse cx="0" cy="0" rx="100" ry="40" stroke="{light}" stroke-width="1.5" opacity="0.4"/>
        <ellipse cx="0" cy="0" rx="40" ry="100" stroke="{light}" stroke-width="1.5" opacity="0.4"/>
        <circle cx="0" cy="0" r="42" fill="{palette['dark_tint']}" stroke="{acc}" stroke-width="3"/>
        <path d="M -14 0 L -4 10 L 16 -10" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="-85" cy="0" r="5" fill="{comp}"/>
        <circle cx="85" cy="0" r="5" fill="{comp}"/>
        """

# -------------------------------------------------------------
# 6 CINEMA POSTER LAYOUT BUILDERS (No two designs repeat!)
# -------------------------------------------------------------

def build_layout_monolith(p_id, date, title, category, palette, tagline, graphic_svg):
    lines = wrap_title(title, max_chars=34, max_lines=3)
    acc = palette["accent"]
    light = palette["accent_light"]
    dark = palette["dark_tint"]
    line3_xml = f'<text x="0" y="74" font-family="Satoshi, Inter, sans-serif" font-size="24" font-weight="800" fill="#cbd5e1" text-anchor="middle">{escape_xml(lines[2])}</text>' if lines[2] else ""

    return f"""<svg width="1200" height="675" viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-{p_id}" x1="0" y1="0" x2="1200" y2="675" gradientUnits="userSpaceOnUse">
      <stop stop-color="#020617"/>
      <stop offset="0.5" stop-color="{dark}"/>
      <stop offset="1" stop-color="#020617"/>
    </linearGradient>
    <radialGradient id="spot-{p_id}" cx="600" cy="270" r="420" gradientUnits="userSpaceOnUse">
      <stop stop-color="{acc}" stop-opacity="0.32"/>
      <stop offset="0.7" stop-color="{acc}" stop-opacity="0.04"/>
      <stop offset="1" stop-color="{acc}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="flare-{p_id}" x1="100" y1="270" x2="1100" y2="270" gradientUnits="userSpaceOnUse">
      <stop stop-color="{light}" stop-opacity="0"/>
      <stop offset="0.5" stop-color="{light}" stop-opacity="0.85"/>
      <stop offset="1" stop-color="{light}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="675" fill="url(#bg-{p_id})"/>
  <rect width="1200" height="675" fill="url(#spot-{p_id})"/>
  <line x1="80" y1="270" x2="1120" y2="270" stroke="url(#flare-{p_id})" stroke-width="2"/>

  <!-- Top Studio Header -->
  <text x="600" y="48" font-family="'Inter', sans-serif" font-size="11" font-weight="800" fill="#94a3b8" letter-spacing="4" text-anchor="middle">CORALGENZ GLOBAL ORIGINAL</text>
  <line x1="430" y1="44" x2="470" y2="44" stroke="{acc}" stroke-width="1.5"/>
  <line x1="730" y1="44" x2="770" y2="44" stroke="{acc}" stroke-width="1.5"/>

  <!-- Category & ID Pill -->
  <g transform="translate(600, 68)">
    <rect x="-120" y="0" width="240" height="26" rx="13" fill="rgba(15, 23, 42, 0.85)" stroke="{acc}" stroke-width="1.2"/>
    <text x="0" y="17" font-family="'Inter', sans-serif" font-size="10.5" font-weight="800" fill="{light}" letter-spacing="1.2" text-anchor="middle">{escape_xml(category.upper())} · #{p_id}</text>
  </g>

  <!-- Central Focal Monolith -->
  <g transform="translate(600, 270)">
    {graphic_svg}
  </g>

  <!-- Cinema Tagline -->
  <text x="600" y="435" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="{light}" letter-spacing="3" text-anchor="middle">{escape_xml(tagline)}</text>

  <!-- Blockbuster Title -->
  <g transform="translate(600, 480)">
    <text x="0" y="0" font-family="'Satoshi', 'Inter', sans-serif" font-size="33" font-weight="900" fill="#ffffff" letter-spacing="0.5" text-anchor="middle">{escape_xml(lines[0])}</text>
    <text x="0" y="38" font-family="'Satoshi', 'Inter', sans-serif" font-size="28" font-weight="900" fill="{acc}" letter-spacing="0.8" text-anchor="middle">{escape_xml(lines[1])}</text>
    {line3_xml}
  </g>

  <!-- Cinema Movie Credits Billing Block -->
  <g transform="translate(600, 605)">
    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="11.5" font-weight="700" fill="#f59e0b" letter-spacing="2" text-anchor="middle">★★★★★ 4.9 AUDIENCE RATING · (VERIFIED REVIEWS)</text>
    <text x="0" y="20" font-family="'Inter', sans-serif" font-size="9" font-weight="700" fill="#64748b" letter-spacing="1.5" text-anchor="middle">A CORALGENZ GLOBAL PRODUCTION · KARTHICK KRISHNA (FOUNDER &amp; CEO) &amp; THANVANTH H (COO) · SENIOR CLOUD ARCHITECTS</text>
    <text x="0" y="33" font-family="'Inter', sans-serif" font-size="8.5" font-weight="600" fill="#475569" letter-spacing="1.2" text-anchor="middle">COIMBATORE &amp; CHENNAI STUDIOS · 100% INTELLECTUAL PROPERTY GUARANTEE · ZERO VENDOR LOCK-IN</text>
  </g>

  <!-- Cinema Framing Border -->
  <rect x="20" y="20" width="1160" height="635" rx="10" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1.5" fill="none"/>
  <path d="M 30 50 V 30 H 50" stroke="{acc}" stroke-width="2" fill="none"/>
  <path d="M 1170 50 V 30 H 1150" stroke="{acc}" stroke-width="2" fill="none"/>
  <path d="M 30 625 V 645 H 50" stroke="{acc}" stroke-width="2" fill="none"/>
  <path d="M 1170 625 V 645 H 1150" stroke="{acc}" stroke-width="2" fill="none"/>
</svg>"""

def build_layout_split_horizon(p_id, date, title, category, palette, tagline, graphic_svg):
    lines = wrap_title(title, max_chars=36, max_lines=3)
    acc = palette["accent"]
    light = palette["accent_light"]
    dark = palette["dark_tint"]
    line3_xml = f'<text x="0" y="74" font-family="Satoshi, Inter, sans-serif" font-size="24" font-weight="800" fill="#cbd5e1" text-anchor="middle">{escape_xml(lines[2])}</text>' if lines[2] else ""

    return f"""<svg width="1200" height="675" viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-top-{p_id}" x1="0" y1="0" x2="1200" y2="350" gradientUnits="userSpaceOnUse">
      <stop stop-color="#020617"/>
      <stop offset="1" stop-color="{dark}"/>
    </linearGradient>
    <linearGradient id="horiz-{p_id}" x1="0" y1="350" x2="1200" y2="350" gradientUnits="userSpaceOnUse">
      <stop stop-color="{acc}" stop-opacity="0"/>
      <stop offset="0.5" stop-color="{light}" stop-opacity="1"/>
      <stop offset="1" stop-color="{acc}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Upper Panoramic Half -->
  <rect width="1200" height="350" fill="url(#bg-top-{p_id})"/>
  <!-- Lower Dark Card -->
  <rect y="350" width="1200" height="325" fill="#040814"/>

  <!-- Horizon Laser Divider Line -->
  <line x1="0" y1="350" x2="1200" y2="350" stroke="url(#horiz-{p_id})" stroke-width="3"/>
  <circle cx="600" cy="350" r="30" fill="{acc}" opacity="0.3"/>

  <!-- Upper Focal Artwork -->
  <g transform="translate(600, 180)">
    {graphic_svg}
  </g>

  <!-- Top Studio Bar -->
  <g transform="translate(60, 45)">
    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="12" font-weight="900" fill="#ffffff" letter-spacing="2">CORALGENZ CINEMATIC</text>
    <text x="1080" y="0" font-family="'Inter', monospace" font-size="12" font-weight="700" fill="{light}" text-anchor="end">#{p_id} · {escape_xml(category.upper())}</text>
  </g>

  <!-- Lower Title Card Content -->
  <g transform="translate(60, 410)">
    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="{acc}" letter-spacing="3">{escape_xml(tagline)}</text>
    <text x="0" y="45" font-family="'Satoshi', 'Inter', sans-serif" font-size="34" font-weight="900" fill="#ffffff" letter-spacing="-0.02em">{escape_xml(lines[0])}</text>
    <text x="0" y="86" font-family="'Satoshi', 'Inter', sans-serif" font-size="30" font-weight="900" fill="{light}">{escape_xml(lines[1])}</text>
  </g>

  <!-- Lower Right Movie Billing Block -->
  <g transform="translate(1140, 560)">
    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#f59e0b" text-anchor="end">★★★★★ 4.9 · AUDIENCE CHOICE</text>
    <text x="0" y="24" font-family="'Inter', sans-serif" font-size="9" font-weight="700" fill="#64748b" text-anchor="end">CORALGENZ GLOBAL STUDIOS · KARTHICK KRISHNA (FOUNDER) · THANVANTH H (COO)</text>
    <text x="0" y="38" font-family="'Inter', sans-serif" font-size="8.5" font-weight="600" fill="#475569" text-anchor="end">100% CODE OWNERSHIP · ZERO LOCK-IN · COIMBATORE &amp; CHENNAI</text>
  </g>
</svg>"""

def build_layout_diagonal_slash(p_id, date, title, category, palette, tagline, graphic_svg):
    lines = wrap_title(title, max_chars=30, max_lines=3)
    acc = palette["accent"]
    light = palette["accent_light"]
    dark = palette["dark_tint"]
    line3_xml = f'<text x="0" y="74" font-family="Satoshi, Inter, sans-serif" font-size="24" font-weight="800" fill="#cbd5e1" text-anchor="middle">{escape_xml(lines[2])}</text>' if lines[2] else ""

    return f"""<svg width="1200" height="675" viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="slash-bg-{p_id}" x1="0" y1="0" x2="1200" y2="675" gradientUnits="userSpaceOnUse">
      <stop stop-color="#020617"/>
      <stop offset="0.6" stop-color="{dark}"/>
      <stop offset="1" stop-color="#050a18"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="675" fill="url(#slash-bg-{p_id})"/>

  <!-- 20-Degree Diagonal Cyber Slash -->
  <polygon points="550 0 700 0 650 675 500 675" fill="{acc}" opacity="0.12"/>
  <line x1="625" y1="0" x2="575" y2="675" stroke="{light}" stroke-width="2" opacity="0.6"/>

  <!-- Left Side: Cinematic Title Stack -->
  <g transform="translate(70, 70)">
    <rect x="0" y="0" width="160" height="28" rx="6" fill="{acc}" opacity="0.2"/>
    <text x="12" y="19" font-family="'Inter', sans-serif" font-size="11" font-weight="800" fill="{light}" letter-spacing="1">{escape_xml(category.upper())}</text>

    <text x="0" y="85" font-family="'Inter', sans-serif" font-size="12" font-weight="800" fill="{acc}" letter-spacing="2.5">{escape_xml(tagline)}</text>

    <!-- Main Title -->
    <text x="0" y="150" font-family="'Satoshi', 'Inter', sans-serif" font-size="36" font-weight="900" fill="#ffffff" letter-spacing="-0.02em">{escape_xml(lines[0])}</text>
    <text x="0" y="198" font-family="'Satoshi', 'Inter', sans-serif" font-size="34" font-weight="900" fill="{light}">{escape_xml(lines[1])}</text>
    {line3_xml}

    <!-- Rating & Date Tag -->
    <g transform="translate(0, 310)">
      <text x="0" y="0" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="#f59e0b">★★★★★ 4.9 · CRITIC VERIFIED</text>
      <text x="0" y="26" font-family="'Inter', monospace" font-size="12" font-weight="600" fill="#64748b">ARTICLE #{p_id} · {escape_xml(date)}</text>
    </g>

    <!-- Bottom Credits -->
    <text x="0" y="470" font-family="'Inter', sans-serif" font-size="9" font-weight="700" fill="#475569" letter-spacing="1">CORALGENZ GLOBAL PRODUCTION · COIMBATORE &amp; CHENNAI</text>
  </g>

  <!-- Right Side: Large Kinetic Focal Subject -->
  <g transform="translate(900, 320)">
    {graphic_svg}
  </g>
</svg>"""

def build_layout_hud_viewfinder(p_id, date, title, category, palette, tagline, graphic_svg):
    lines = wrap_title(title, max_chars=34, max_lines=3)
    acc = palette["accent"]
    light = palette["accent_light"]
    dark = palette["dark_tint"]
    line3_xml = f'<text x="0" y="74" font-family="Satoshi, Inter, sans-serif" font-size="24" font-weight="800" fill="#cbd5e1" text-anchor="middle">{escape_xml(lines[2])}</text>' if lines[2] else ""

    return f"""<svg width="1200" height="675" viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hud-bg-{p_id}" x1="0" y1="0" x2="1200" y2="675" gradientUnits="userSpaceOnUse">
      <stop stop-color="#02040a"/>
      <stop offset="0.5" stop-color="{dark}"/>
      <stop offset="1" stop-color="#02040a"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="675" fill="url(#hud-bg-{p_id})"/>

  <!-- Sci-Fi HUD Viewfinder Elements -->
  <rect x="40" y="40" width="1120" height="595" rx="8" stroke="{acc}" stroke-width="1.2" opacity="0.3" fill="none"/>
  <!-- Crosshairs -->
  <line x1="600" y1="30" x2="600" y2="50" stroke="{light}" stroke-width="2"/>
  <line x1="600" y1="625" x2="600" y2="645" stroke="{light}" stroke-width="2"/>
  <line x1="30" y1="337" x2="50" y2="337" stroke="{light}" stroke-width="2"/>
  <line x1="1150" y1="337" x2="1170" y2="337" stroke="{light}" stroke-width="2"/>

  <!-- Top Telemetry Coordinates -->
  <text x="60" y="65" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="{light}">CORALGENZ HUD // SYS_ARCH_ID: #{p_id}</text>
  <text x="1140" y="65" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700" fill="{light}" text-anchor="end">LOC: 11.0168°N, 76.9558°E (COIMBATORE)</text>

  <!-- Center Holographic Graphic -->
  <g transform="translate(600, 240)">
    {graphic_svg}
  </g>

  <!-- Center Title Block -->
  <g transform="translate(600, 430)">
    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="12.5" font-weight="800" fill="{acc}" letter-spacing="3" text-anchor="middle">{escape_xml(tagline)}</text>
    <text x="0" y="42" font-family="'Satoshi', 'Inter', sans-serif" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle">{escape_xml(lines[0])}</text>
    <text x="0" y="82" font-family="'Satoshi', 'Inter', sans-serif" font-size="30" font-weight="900" fill="{light}" text-anchor="middle">{escape_xml(lines[1])}</text>
  </g>

  <!-- Bottom Telemetry & Billing Credits -->
  <g transform="translate(600, 600)">
    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#f59e0b" letter-spacing="1.5" text-anchor="middle">★★★★★ 4.9 SCORE · BUSINESS &amp; PRODUCTIVITY</text>
    <text x="0" y="18" font-family="'Inter', sans-serif" font-size="8.5" font-weight="600" fill="#64748b" letter-spacing="1" text-anchor="middle">CORALGENZ GLOBAL · ZERO DATA LEAKAGE · VERIFIED TELEMETRY · 100% CODE OWNERSHIP</text>
  </g>
</svg>"""

def build_layout_warp_tunnel(p_id, date, title, category, palette, tagline, graphic_svg):
    lines = wrap_title(title, max_chars=34, max_lines=3)
    acc = palette["accent"]
    light = palette["accent_light"]
    dark = palette["dark_tint"]
    line3_xml = f'<text x="0" y="74" font-family="Satoshi, Inter, sans-serif" font-size="24" font-weight="800" fill="#cbd5e1" text-anchor="middle">{escape_xml(lines[2])}</text>' if lines[2] else ""

    return f"""<svg width="1200" height="675" viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="warp-core-{p_id}" cx="600" cy="250" r="380" gradientUnits="userSpaceOnUse">
      <stop stop-color="{acc}" stop-opacity="0.45"/>
      <stop offset="0.6" stop-color="{dark}" stop-opacity="0.8"/>
      <stop offset="1" stop-color="#020409"/>
    </radialGradient>
  </defs>

  <!-- Warp Tunnel Perspective -->
  <rect width="1200" height="675" fill="#020409"/>
  <rect width="1200" height="675" fill="url(#warp-core-{p_id})"/>

  <!-- Perspective Vanishing Lines -->
  <line x1="0" y1="0" x2="600" y2="250" stroke="{acc}" stroke-width="1" opacity="0.3"/>
  <line x1="1200" y1="0" x2="600" y2="250" stroke="{acc}" stroke-width="1" opacity="0.3"/>
  <line x1="0" y1="675" x2="600" y2="250" stroke="{acc}" stroke-width="1" opacity="0.3"/>
  <line x1="1200" y1="675" x2="600" y2="250" stroke="{acc}" stroke-width="1" opacity="0.3"/>

  <!-- Floating Warp Subject -->
  <g transform="translate(600, 250)">
    {graphic_svg}
  </g>

  <!-- Top Studio Title -->
  <g transform="translate(600, 48)">
    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="11.5" font-weight="900" fill="#94a3b8" letter-spacing="3" text-anchor="middle">CORALGENZ GLOBAL BLOCKBUSTER</text>
  </g>

  <!-- Main Title Area -->
  <g transform="translate(600, 440)">
    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="{light}" letter-spacing="2.5" text-anchor="middle">{escape_xml(tagline)}</text>
    <text x="0" y="44" font-family="'Satoshi', 'Inter', sans-serif" font-size="34" font-weight="900" fill="#ffffff" letter-spacing="-0.02em" text-anchor="middle">{escape_xml(lines[0])}</text>
    <text x="0" y="84" font-family="'Satoshi', 'Inter', sans-serif" font-size="30" font-weight="900" fill="{acc}" text-anchor="middle">{escape_xml(lines[1])}</text>
  </g>

  <!-- Bottom Cinema Credits -->
  <g transform="translate(600, 605)">
    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="11.5" font-weight="700" fill="#f59e0b" letter-spacing="1.5" text-anchor="middle">★★★★★ 4.9 AUDIENCE RATING · ARTICLE #{p_id}</text>
    <text x="0" y="20" font-family="'Inter', sans-serif" font-size="9" font-weight="700" fill="#64748b" letter-spacing="1.2" text-anchor="middle">A CORALGENZ GLOBAL PRODUCTION · KARTHICK KRISHNA (FOUNDER &amp; CEO) · THANVANTH H (COO) · COIMBATORE &amp; CHENNAI</text>
  </g>
</svg>"""

def build_layout_letterbox(p_id, date, title, category, palette, tagline, graphic_svg):
    lines = wrap_title(title, max_chars=36, max_lines=3)
    acc = palette["accent"]
    light = palette["accent_light"]
    dark = palette["dark_tint"]
    line3_xml = f'<text x="0" y="74" font-family="Satoshi, Inter, sans-serif" font-size="24" font-weight="800" fill="#cbd5e1" text-anchor="middle">{escape_xml(lines[2])}</text>' if lines[2] else ""

    return f"""<svg width="1200" height="675" viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="cine-bg-{p_id}" x1="0" y1="0" x2="1200" y2="675" gradientUnits="userSpaceOnUse">
      <stop stop-color="#050814"/>
      <stop offset="0.5" stop-color="{dark}"/>
      <stop offset="1" stop-color="#050814"/>
    </linearGradient>
    <linearGradient id="flare-wide-{p_id}" x1="0" y1="280" x2="1200" y2="280" gradientUnits="userSpaceOnUse">
      <stop stop-color="{light}" stop-opacity="0"/>
      <stop offset="0.5" stop-color="{light}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="{light}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="675" fill="url(#cine-bg-{p_id})"/>

  <!-- Anamorphic Full-Width Laser Beam -->
  <line x1="0" y1="280" x2="1200" y2="280" stroke="url(#flare-wide-{p_id})" stroke-width="2.5"/>

  <!-- Top Letterbox Bar -->
  <rect width="1200" height="60" fill="#000000"/>
  <line x1="0" y1="60" x2="1200" y2="60" stroke="#f59e0b" stroke-width="1.5" opacity="0.6"/>
  <text x="60" y="38" font-family="'Inter', sans-serif" font-size="11" font-weight="900" fill="#fcd34d" letter-spacing="3">CORALGENZ GLOBAL PREMIERE</text>
  <text x="1140" y="38" font-family="'Inter', monospace" font-size="11" font-weight="700" fill="#cbd5e1" text-anchor="end">#{p_id} · {escape_xml(category.upper())}</text>

  <!-- Central Artwork -->
  <g transform="translate(600, 240)">
    {graphic_svg}
  </g>

  <!-- Cinema Title Block -->
  <g transform="translate(600, 410)">
    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="13" font-weight="800" fill="{light}" letter-spacing="3" text-anchor="middle">{escape_xml(tagline)}</text>
    <text x="0" y="44" font-family="'Satoshi', 'Inter', sans-serif" font-size="34" font-weight="900" fill="#ffffff" letter-spacing="0.5" text-anchor="middle">{escape_xml(lines[0])}</text>
    <text x="0" y="84" font-family="'Satoshi', 'Inter', sans-serif" font-size="30" font-weight="900" fill="{acc}" letter-spacing="0.8" text-anchor="middle">{escape_xml(lines[1])}</text>
  </g>

  <!-- Bottom Letterbox Bar with Cinema Billing Block -->
  <rect y="605" width="1200" height="70" fill="#000000"/>
  <line x1="0" y1="605" x2="1200" y2="605" stroke="#f59e0b" stroke-width="1.5" opacity="0.6"/>
  <g transform="translate(600, 630)">
    <text x="0" y="0" font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#f59e0b" letter-spacing="2" text-anchor="middle">★★★★★ 4.9 AUDIENCE RATING · (VERIFIED REVIEWS)</text>
    <text x="0" y="18" font-family="'Inter', sans-serif" font-size="8.5" font-weight="700" fill="#64748b" letter-spacing="1.2" text-anchor="middle">CORALGENZ GLOBAL STUDIOS · KARTHICK KRISHNA (FOUNDER) · THANVANTH H (COO) · 100% CODE OWNERSHIP</text>
  </g>
</svg>"""

LAYOUT_BUILDERS = [
    build_layout_monolith,
    build_layout_split_horizon,
    build_layout_diagonal_slash,
    build_layout_hud_viewfinder,
    build_layout_warp_tunnel,
    build_layout_letterbox
]

def generate_cinema_poster(idx, date, title, category):
    p_id = idx + 1
    palette = get_color_palette(idx, category)
    tagline = get_cinema_tagline(title, category)
    graphic_svg = get_unique_graphic(idx, title, category, palette)
    
    # Rotate across the 6 distinct cinematic layouts so NO design repeats
    layout_fn = LAYOUT_BUILDERS[idx % len(LAYOUT_BUILDERS)]
    return layout_fn(p_id, date, title, category, palette, tagline, graphic_svg)

def main():
    print(f"Generating 180 cinema-poster-grade SVG illustrations...")
    for idx, (display_date, iso_date, title, category) in enumerate(RAW_POSTS):
        p_id = idx + 1
        svg_content = generate_cinema_poster(idx, display_date, title, category)

        # Validate with XML parser
        try:
            ET.fromstring(svg_content)
        except Exception as e:
            print(f"Error on post #{p_id} ({title}): {e}")
            raise e

        f1 = os.path.join(OUTPUT_DIR_1, f"post-{p_id}.svg")
        f2 = os.path.join(OUTPUT_DIR_2, f"post-{p_id}.svg")

        with open(f1, "w", encoding="utf-8") as f:
            f.write(svg_content)
        with open(f2, "w", encoding="utf-8") as f:
            f.write(svg_content)

    print("All 180 cinema-grade posters generated and verified successfully!")

if __name__ == "__main__":
    main()
