/**
 * Card artwork.
 *
 * One drawn scene per tool, showing what the tool actually does rather than a
 * generic icon. Everything is inline SVG so it stays crisp, weighs nothing and
 * picks up the card's tint and the current theme through CSS classes:
 *
 *   a-grid  faint chart grid      a-line   the tinted price line
 *   a-fill  tinted area fill      a-rule   dashed levels / ranges
 *   a-ink   strong tinted ink     a-soft   half-strength tint
 *   a-up    a green candle        a-down   a red candle
 *   a-text  small tinted caption  a-glass  the lens / panel wash
 */
window.FELIX_ART = {
  /* Winston — the market cockpit: a quality score, the chart, the three decks. */
  cockpit: [
    '<svg class="scene" viewBox="0 0 260 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true">',
    '<g class="a-grid">',
    '<path d="M20 140h220M20 172h220M20 204h220M20 236h220" />',
    '<path d="M64 132v112M108 132v112M152 132v112M196 132v112" />',
    '</g>',

    // GOAT quality score, the thing Stock Radar puts on 10,800+ stocks
    '<path class="a-track" d="M84 96a46 46 0 0 1 92 0" />',
    '<path class="a-arc" d="M84 96a46 46 0 0 1 92 0" />',
    '<circle class="a-ink" cx="166" cy="72" r="4.5" />',
    '<text class="a-score" x="130" y="90" text-anchor="middle">87</text>',
    '<text class="a-text" x="130" y="112" text-anchor="middle">GOAT SCORE</text>',

    // the price action underneath
    '<path class="a-fill" d="M20 232 56 214 92 220 128 186 164 196 200 158 240 138v106H20z" />',
    '<path class="a-line" d="M20 232 56 214 92 220 128 186 164 196 200 158 240 138" />',
    '<circle class="a-ink" cx="240" cy="138" r="4" />',

    // Stock Radar · Metal Minute · ETF Edge
    '<g class="a-chip">',
    '<rect x="20" y="258" width="70" height="22" rx="11" />',
    '<rect x="95" y="258" width="70" height="22" rx="11" />',
    '<rect x="170" y="258" width="70" height="22" rx="11" />',
    '</g>',
    '<g class="a-text">',
    '<text x="55" y="273" text-anchor="middle">RADAR</text>',
    '<text x="130" y="273" text-anchor="middle">METALS</text>',
    '<text x="205" y="273" text-anchor="middle">ETFs</text>',
    '</g>',
    '</svg>'
  ].join(''),

  /* Breakout Scanner — price coiling in a range, then breaking out, spotted. */
  breakout: [
    '<svg class="scene" viewBox="0 0 260 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true">',
    '<g class="a-grid">',
    '<path d="M20 90h220M20 130h220M20 170h220M20 210h220" />',
    '<path d="M64 60v190M108 60v190M152 60v190M196 60v190" />',
    '</g>',

    // the range it coiled in, and the level it broke
    '<rect class="a-range" x="36" y="150" width="116" height="58" rx="6" />',
    '<path class="a-rule" d="M36 150h204" />',
    '<text class="a-text" x="40" y="143">RESISTANCE</text>',

    // price: chop inside the range, then the break
    '<path class="a-line-soft" d="M20 226 40 206 54 186 68 202 82 176 96 196 110 172 124 192 138 166 152 182" />',
    '<path class="a-line" d="M152 182 168 150 182 122 198 96 214 74" />',
    '<path class="a-ink-stroke" d="M214 74 200 78M214 74l2 15" />',

    // the scanner picking it up
    '<circle class="a-ring" cx="200" cy="96" r="26" />',
    '<circle class="a-ring a-ring--far" cx="200" cy="96" r="40" />',
    '<g class="a-reticle">',
    '<path d="M170 74v-10h12M230 74v-10h-12M170 118v10h12M230 118v10h-12" />',
    '</g>',

    // volume under the break
    '<g class="a-bar">',
    '<rect x="26" y="256" width="8" height="14" rx="2" />',
    '<rect x="44" y="250" width="8" height="20" rx="2" />',
    '<rect x="62" y="258" width="8" height="12" rx="2" />',
    '<rect x="80" y="252" width="8" height="18" rx="2" />',
    '<rect x="98" y="260" width="8" height="10" rx="2" />',
    '<rect x="116" y="254" width="8" height="16" rx="2" />',
    '<rect x="134" y="258" width="8" height="12" rx="2" />',
    '</g>',
    '<g class="a-bar a-bar--hot">',
    '<rect x="152" y="242" width="8" height="28" rx="2" />',
    '<rect x="170" y="232" width="8" height="38" rx="2" />',
    '<rect x="188" y="224" width="8" height="46" rx="2" />',
    '<rect x="206" y="236" width="8" height="34" rx="2" />',
    '</g>',
    '</svg>'
  ].join(''),

  /* TradeVision — candles between levels, a screener lens, options flow. */
  vision: [
    '<svg class="scene" viewBox="0 0 260 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true">',
    '<g class="a-grid">',
    '<path d="M20 80h220M20 120h220M20 160h220M20 200h220" />',
    '<path d="M64 60v170M108 60v170M152 60v170M196 60v170" />',
    '</g>',

    // support and resistance, drawn in for you
    '<path class="a-rule" d="M20 96h220M20 206h220" />',
    '<text class="a-text" x="24" y="90">RESISTANCE</text>',
    '<text class="a-text" x="24" y="222">SUPPORT</text>',

    // the candles
    '<g class="a-up">',
    '<rect x="30" y="168" width="12" height="26" rx="2" /><rect x="34.5" y="158" width="3" height="46" rx="1.5" />',
    '<rect x="78" y="146" width="12" height="30" rx="2" /><rect x="82.5" y="136" width="3" height="50" rx="1.5" />',
    '<rect x="126" y="126" width="12" height="34" rx="2" /><rect x="130.5" y="114" width="3" height="56" rx="1.5" />',
    '<rect x="198" y="106" width="12" height="30" rx="2" /><rect x="202.5" y="98" width="3" height="48" rx="1.5" />',
    '</g>',
    '<g class="a-down">',
    '<rect x="54" y="156" width="12" height="24" rx="2" /><rect x="58.5" y="148" width="3" height="42" rx="1.5" />',
    '<rect x="102" y="140" width="12" height="22" rx="2" /><rect x="106.5" y="132" width="3" height="38" rx="1.5" />',
    '<rect x="150" y="120" width="12" height="26" rx="2" /><rect x="154.5" y="112" width="3" height="42" rx="1.5" />',
    '<rect x="174" y="116" width="12" height="20" rx="2" /><rect x="178.5" y="108" width="3" height="36" rx="1.5" />',
    '</g>',

    // the screener lens
    '<circle class="a-glass" cx="170" cy="150" r="44" />',
    '<circle class="a-lens" cx="170" cy="150" r="44" />',
    '<path class="a-lens" d="M202 182 226 208" />',
    '<path class="a-lens-mark" d="M146 160l14-16 12 10 16-24" />',

    // options and dark pool flow
    '<text class="a-text" x="20" y="248">FLOW</text>',
    '<g class="a-bar">',
    '<rect x="20" y="258" width="7" height="18" rx="2" />',
    '<rect x="35" y="264" width="7" height="12" rx="2" />',
    '<rect x="50" y="256" width="7" height="20" rx="2" />',
    '<rect x="65" y="266" width="7" height="10" rx="2" />',
    '<rect x="80" y="260" width="7" height="16" rx="2" />',
    '<rect x="95" y="254" width="7" height="22" rx="2" />',
    '<rect x="110" y="264" width="7" height="12" rx="2" />',
    '</g>',
    '<g class="a-bar a-bar--hot">',
    '<rect x="140" y="250" width="7" height="26" rx="2" />',
    '<rect x="155" y="244" width="7" height="32" rx="2" />',
    '<rect x="170" y="252" width="7" height="24" rx="2" />',
    '<rect x="185" y="240" width="7" height="36" rx="2" />',
    '<rect x="200" y="248" width="7" height="28" rx="2" />',
    '<rect x="215" y="256" width="7" height="20" rx="2" />',
    '</g>',
    '</svg>'
  ].join('')
};
