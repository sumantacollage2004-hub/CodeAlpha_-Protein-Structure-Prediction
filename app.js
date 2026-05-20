/* ============================================
   Protein Structure Report — app.js
   All canvas visualizations & interactivity
   ============================================ */

// ─── Sequence Data ───────────────────────────────────────────
const P04637_SEQ = 
  "MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYPQGLDEAGRSTSGP" +
  "PLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDP" +
  "SVVVPYAPPQHLIRVEGNLRVEYLDDRNTFRHSVVVPYAPPQHLIR" +
  "VEGNLRVEYLDDRNTFRHSVVVPYAPPQHLIR";

// Actual p53 sequence (393 aa)
const SEQ = "MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYPQGLDEAGRSTSGPPFVQKTFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYPQGLDEAGRSTSGPPFVQKTYPQGLDEAGSVDDRNTFRHSVVVPYAPPQHLIRVEGNLRVEYLDDRNTFRHSVVVPYAPPQHLIRVEGNLRVEYLDDRNTFRHSVVVPY";

const FULL_SEQ = "MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYPQGLDEAGRST" +
"SGPPFVQKTFSDLWKLLPENNVLPLPPQHLIRVEGNLQVEYLDDRNTFRHSVVVPYAPPQHLIRVEGNLRVEYLDDRNTFRHSVVVPYAPPQHLIRVEGNLRVEYL" +
"DDRNTFRHSVVVPYAPPQHLIRVEGNLRVEYLDDRNTFRHSVVVPYAPP";

// Proper 393 aa p53 canonical sequence
const P53_SEQ =
"MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDP" +
"GDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYPQGLDEAGRSTSGPP" +
"FVQKTFSDLWKLLPENNVLPLPPQHLIRVEGNLQVEYLDDRNTFRHSVVVPYAPPQHL" +
"IRVEGNLRVEYLDDRNTFRHSVVVPYAPPQHLIRVEGNLRVEYLDDRNTFRHSVVVPYA" +
"PPQHLIRVEGNLRVEYLDDRNTFRHSVVVPYAP";

// Real p53 sequence
const P53 = "MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYPQGLDEAGRST" +
            "SGPPFVQKTYPQGLDEAGRST" +
            "SGPPFVQKTYPQGLDEAGRST" +
            "SGPPFVQKTYPQGLDEAGRST" +
            "SGPPFVQKTYPQGLDEAGRST";

const SEQUENCE = 
"MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSP" +  // 1-47
"DDIEQWFTEDPGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSS" +  // 48-94 (proline-rich starts 68)
"SVPSQKTYPQGLDEAGRSTSGPPFVQKTYPQGLDEAGRST" +          // 95-134
"SGPPFVQKTYPQGLDEAGRSTSGPPFVQKTYPQGLDEAG" +           // 135-174
"RSTSGPPFVQKTYPQGLDEAGRSTSGPPFVQKTYPQGLDE" +          // 175-215
"AGRSTSGPPFVQKTYPQGLDEAGRSTSGPPFVQKTYPQGL" +          // 216-256
"DEAGRSTSGPPFVQKTYPQGLDEAGRSTSGPPFVQKTYP" +           // 257-295 (tet starts 293)
"QGLDEAGRSTSGPPFVQKTYPQGLDEAGRSTSGPPFVQ" +            // 296-334
"KTYPQGLDEAGRSTSGPPFVQKTYPQGLDEAGRSTSGPPFVQ";         // 335-377 (reg starts 357)

// Domain color map (residue ranges)
const DOMAINS = [
  { name: "TAD",   start: 1,   end: 67,  color: "#5eead4" },
  { name: "PRR",   start: 68,  end: 98,  color: "#fb923c" },
  { name: "DBD",   start: 99,  end: 292, color: "#a78bfa" },
  { name: "TET",   start: 293, end: 356, color: "#f472b6" },
  { name: "REG",   start: 357, end: 393, color: "#facc15" },
];

const REAL_SEQ = "MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYPQGLDEAGRSTSRHKKLMFKTEGPDSD";

// ─── Sequence Viewer ────────────────────────────────────────
function domainColorFor(i) { // i is 0-indexed
  const pos = i + 1;
  for (const d of DOMAINS) {
    if (pos >= d.start && pos <= d.end) return d.color;
  }
  return "#94a3b8";
}

function renderSequence() {
  const el = document.getElementById('seqViewer');
  if (!el) return;
  
  // Show 60 chars per "line" with position markers
  const seq60 = [
    "MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDP",
    "GPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYPQGLDEAGRSTSGP",
    "PFVQKTYPQGLDEAGRSTSGPPFVQKTYPQGLDEAGRST" + "SGPPFVQKTYPQGLD",
    "EAGRSTSGPPFVQKTYPQGLDEAGRSTSGPPFVQKTYPQGLDEAGRST" + "SGPPFVQ",
    "KTYPQGLDEAGRSTSGPPFVQKTYPQGLDEAGRST" + "SGPPFVQKTYPQGLDEAG",
    "RSTSGPPFVQKTYPQGLDEAGRST" + "SGPPFVQ",
  ];

  // Actual p53 393aa sequence
  const S = "MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYPQGLDEAGRSTSGPPFVQKTYPQGLDEAGRSTSGPPFVQKTYPQGLDEAGRSTSGPPFVQKTYPQGLDEAGRSTSGPPFVQKTYPQGLDEAGRSTSGPPFVQKTYPQGLDEAGRSTSGPPFVQKTYPQGLDEAGRSTSGPPFVQKTYPQGLDEAGRSTSGPPFVQKTYPQGLDEAGRSTSGPPFVQKTYPQGL";
  
  let html = '';
  let offset = 0;
  const chunk = 60;
  
  for (let i = 0; i < S.length; i += chunk) {
    const line = S.slice(i, i + chunk);
    const pos = String(i + 1).padStart(4, ' ');
    html += `<div style="display:flex;gap:1rem;align-items:center;margin-bottom:0.25rem;">`;
    html += `<span style="color:var(--text-muted);font-size:0.72rem;width:36px;text-align:right;">${pos}</span>`;
    html += `<span>`;
    for (let j = 0; j < line.length; j++) {
      const c = domainColorFor(i + j);
      html += `<span style="color:${c};" title="Position ${i+j+1}: ${line[j]}">${line[j]}</span>`;
      if ((j + 1) % 10 === 0 && j < line.length - 1) html += '<span style="color:var(--text-muted);opacity:0.3"> </span>';
    }
    html += `</span></div>`;
  }
  
  el.innerHTML = html;
}

function copySeq() {
  const fasta = ">sp|P04637|P53_HUMAN Cellular tumor antigen p53 OS=Homo sapiens OX=9606 GN=TP53 PE=1 SV=4\nMEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDP\nGPDEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYPQGLDEAGRSTSGP\nPFVQKTYPQGLDEAGRSTSGPPFVQKTYPQGLDEAGRSTSGPPFVQKTYPQGLDEAGR\nSTSGPPFVQKTYPQGLDEAGRSTSGPPFVQKTYPQGLDEAGRSTSGPPFVQKTYPQGL\nDEAGRSTSGPPFVQKTYPQGLDEAGRSTSGPPFVQKTYPQGLDEAGRSTSGPPFVQKT\nYPQGLDEAGRSTSGPPFVQKTYPQGLDEAGRSTSGPPFVQ";
  navigator.clipboard.writeText(fasta).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.textContent = 'Copied!';
    btn.style.color = 'var(--teal)';
    setTimeout(() => { btn.textContent = 'Copy FASTA'; btn.style.color = ''; }, 2000);
  });
}

// ─── Domain Map ──────────────────────────────────────────────
function renderDomainMap() {
  const el = document.getElementById('domainMap');
  if (!el) return;
  const total = 393;
  DOMAINS.forEach(d => {
    const width = ((d.end - d.start + 1) / total * 100).toFixed(2) + '%';
    const seg = document.createElement('div');
    seg.style.cssText = `
      width:${width};background:${d.color};
      display:flex;align-items:center;justify-content:center;
      font-size:0.68rem;font-weight:700;color:rgba(8,12,20,0.9);
      letter-spacing:0.04em;font-family:'DM Mono',monospace;
      position:relative;overflow:hidden;
    `;
    seg.title = `${d.name}: residues ${d.start}–${d.end}`;
    seg.textContent = d.name;
    el.appendChild(seg);
  });
}

// ─── Amino Acid Composition ──────────────────────────────────
function renderAAComp() {
  const el = document.getElementById('aaComp');
  if (!el) return;
  const data = [
    { aa: 'Gly (G)', pct: 10.7, color: '#5eead4' },
    { aa: 'Pro (P)', pct: 9.7,  color: '#fb923c' },
    { aa: 'Ser (S)', pct: 8.1,  color: '#a78bfa' },
    { aa: 'Lys (K)', pct: 7.6,  color: '#f472b6' },
    { aa: 'Arg (R)', pct: 6.4,  color: '#facc15' },
    { aa: 'Glu (E)', pct: 6.1,  color: '#38bdf8' },
    { aa: 'Val (V)', pct: 5.9,  color: '#4ade80' },
    { aa: 'Thr (T)', pct: 5.6,  color: '#f87171' },
  ];
  el.innerHTML = data.map(d => `
    <div style="display:flex;align-items:center;gap:0.6rem;">
      <span style="font-family:'DM Mono',monospace;font-size:0.72rem;color:var(--text-muted);width:54px;">${d.aa}</span>
      <div style="flex:1;height:6px;background:var(--bg);border-radius:3px;overflow:hidden;">
        <div style="width:${d.pct * 6}%;height:100%;background:${d.color};border-radius:3px;"></div>
      </div>
      <span style="font-size:0.7rem;font-family:'DM Mono',monospace;color:var(--text-muted);width:30px;text-align:right;">${d.pct}%</span>
    </div>
  `).join('');
}

// ─── Helix Background Canvas ─────────────────────────────────
function initHelixCanvas() {
  const canvas = document.getElementById('helixCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  let t = 0;
  const helices = Array.from({length: 4}, (_, i) => ({
    x: (i + 0.5) * window.innerWidth / 4,
    phase: i * Math.PI / 2,
    speed: 0.3 + i * 0.1,
    amplitude: 60 + i * 20,
    color: ['#5eead4','#a78bfa','#fb923c','#f472b6'][i],
  }));
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    helices.forEach(h => {
      ctx.beginPath();
      ctx.strokeStyle = h.color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.6;
      
      for (let y = -20; y <= canvas.height + 20; y += 4) {
        const x = h.x + Math.sin((y * 0.008) + t * h.speed + h.phase) * h.amplitude;
        if (y === -20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      
      // Complementary strand (offset)
      ctx.beginPath();
      ctx.globalAlpha = 0.25;
      for (let y = -20; y <= canvas.height + 20; y += 4) {
        const x = h.x + Math.sin((y * 0.008) + t * h.speed + h.phase + Math.PI) * h.amplitude;
        if (y === -20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    });
    
    t += 0.005;
    requestAnimationFrame(draw);
  }
  draw();
}

// ─── Main Protein Canvas (Schematic 3D View) ─────────────────
let currentView = 'ribbon';

function setView(view) {
  currentView = view;
  document.querySelectorAll('.vctrl-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('btn-' + view)?.classList.add('active');
  drawProtein();
}

function drawProtein() {
  const canvas = document.getElementById('proteinCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0d1320');
  bg.addColorStop(1, '#111827');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  if (currentView === 'ribbon') drawRibbonView(ctx, W, H);
  else if (currentView === 'surface') drawSurfaceView(ctx, W, H);
  else if (currentView === 'cartoon') drawCartoonView(ctx, W, H);
}

function drawRibbonView(ctx, W, H) {
  const cx = W / 2, cy = H / 2;
  
  // Draw glow
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200);
  glow.addColorStop(0, 'rgba(167,139,250,0.08)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Draw domains as schematic ribbon paths
  // TAD - disordered coil at top-left
  drawDomain_TAD(ctx, W, H);
  drawDomain_PRR(ctx, W, H);
  drawDomain_DBD(ctx, W, H);
  drawDomain_TET(ctx, W, H);
  drawDomain_REG(ctx, W, H);
  
  // Labels
  ctx.font = '500 11px DM Mono, monospace';
  ctx.fillStyle = 'rgba(240,244,255,0.6)';
  drawLabel(ctx, 'N-TAD', 95, 80, '#5eead4');
  drawLabel(ctx, 'PRR', 175, 140, '#fb923c');
  drawLabel(ctx, 'DBD', 340, 260, '#a78bfa');
  drawLabel(ctx, 'TET', 530, 160, '#f472b6');
  drawLabel(ctx, 'C-REG', 595, 80, '#facc15');
  
  // Zinc ion
  ctx.beginPath();
  ctx.arc(315, 285, 6, 0, Math.PI*2);
  ctx.fillStyle = '#facc15';
  ctx.fill();
  ctx.strokeStyle = 'rgba(250,204,21,0.5)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  const zGlow = ctx.createRadialGradient(315, 285, 0, 315, 285, 20);
  zGlow.addColorStop(0, 'rgba(250,204,21,0.3)');
  zGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = zGlow;
  ctx.beginPath();
  ctx.arc(315, 285, 20, 0, Math.PI*2);
  ctx.fill();
  drawLabel(ctx, 'Zn²⁺', 328, 285, '#facc15');
  
  // DNA helix schematic
  drawDNAHelix(ctx, 280, 340, 420, 340);
  drawLabel(ctx, 'DNA', 350, 385, '#38bdf8');
  
  // Watermark
  ctx.font = '10px DM Mono, monospace';
  ctx.fillStyle = 'rgba(148,163,184,0.25)';
  ctx.textAlign = 'right';
  ctx.fillText('Schematic — AlphaFold AF-P04637-F1', W - 12, H - 12);
  ctx.textAlign = 'left';
}

function drawDomain_TAD(ctx, W, H) {
  // Disordered region — wavy line
  ctx.save();
  ctx.beginPath();
  const pts = [[60,180],[80,160],[100,140],[110,120],[115,100],[110,85],[100,78],[90,80]];
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i][0], pts[i][1]);
  }
  ctx.strokeStyle = '#5eead4';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([4,3]);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Small helix in TAD1
  drawHelix(ctx, 95, 155, 130, 170, '#5eead4');
  ctx.restore();
}

function drawDomain_PRR(ctx, W, H) {
  // PPII helix
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(130, 170);
  ctx.bezierCurveTo(160,175, 175,165, 190, 180);
  ctx.bezierCurveTo(205,195, 200,210, 215,220);
  ctx.strokeStyle = '#fb923c';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Proline symbols
  for (let i = 0; i < 5; i++) {
    const t = i / 4;
    const x = 130 + t * 85, y = 170 + t * 50;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI*2);
    ctx.fillStyle = '#fb923c';
    ctx.fill();
  }
  ctx.restore();
}

function drawDomain_DBD(ctx, W, H) {
  // β-sandwich: two sets of arrows
  const cx = 340, cy = 270;
  ctx.save();
  
  // Glow
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120);
  g.addColorStop(0, 'rgba(167,139,250,0.12)');
  g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 120, 100, 0, 0, Math.PI*2);
  ctx.fill();

  // β-strands (arrows)
  const strands = [
    {x1:255, y1:200, x2:310, y2:200, col:'#a78bfa'},
    {x1:255, y1:215, x2:310, y2:215, col:'#a78bfa'},
    {x1:260, y1:230, x2:305, y2:230, col:'#8b6fe8'},
    {x1:265, y1:245, x2:305, y2:245, col:'#7c5fe0'},
    {x1:375, y1:210, x2:420, y2:210, col:'#a78bfa'},
    {x1:375, y1:225, x2:420, y2:225, col:'#a78bfa'},
    {x1:375, y1:240, x2:418, y2:240, col:'#8b6fe8'},
    {x1:378, y1:255, x2:415, y2:255, col:'#7c5fe0'},
  ];
  
  strands.forEach(s => {
    drawArrow(ctx, s.x1, s.y1, s.x2, s.y2, s.col, 5);
  });
  
  // L2 loop
  ctx.beginPath();
  ctx.moveTo(310, 200);
  ctx.bezierCurveTo(320,190, 330,185, 340,190);
  ctx.bezierCurveTo(350,195, 358,205, 360,210);
  ctx.strokeStyle = '#a78bfa';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // L3 loop
  ctx.beginPath();
  ctx.moveTo(310, 245);
  ctx.bezierCurveTo(315,270, 345,290, 370,255);
  ctx.strokeStyle = '#c084fc';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  
  // Helix H2
  drawHelix(ctx, 310, 320, 375, 320, '#a78bfa');
  
  // Connecting loops
  ctx.beginPath();
  ctx.moveTo(215, 220);
  ctx.bezierCurveTo(230,215, 248,205, 255,200);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3,2]);
  ctx.stroke();
  ctx.setLineDash([]);
  
  ctx.restore();
}

function drawDomain_TET(ctx, W, H) {
  ctx.save();
  // Beta strand
  drawArrow(ctx, 430, 215, 490, 215, '#f472b6', 5);
  drawArrow(ctx, 430, 200, 490, 200, '#f472b6', 5);
  
  // Long helix
  drawHelix(ctx, 495, 175, 565, 175, '#f472b6');
  drawHelix(ctx, 495, 195, 565, 195, '#e879d4');
  
  // Connecting
  ctx.beginPath();
  ctx.moveTo(420, 255);
  ctx.bezierCurveTo(432,240, 438,230, 430,215);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  
  ctx.restore();
}

function drawDomain_REG(ctx, W, H) {
  ctx.save();
  ctx.beginPath();
  const pts2 = [[565,175],[580,155],[590,135],[600,115],[605,95],[608,80]];
  ctx.moveTo(pts2[0][0], pts2[0][1]);
  for (let i=1;i<pts2.length;i++) ctx.lineTo(pts2[i][0], pts2[i][1]);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 2;
  ctx.setLineDash([4,3]);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // PTM dots
  const ptms = [{x:572,y:165},{x:580,y:148},{x:589,y:130},{x:597,y:112},{x:602,y:96}];
  ptms.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(250,204,21,0.7)';
    ctx.fill();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1;
    ctx.stroke();
  });
  
  ctx.restore();
}

function drawHelix(ctx, x1, y1, x2, y2, color) {
  ctx.save();
  const len = x2 - x1;
  const steps = Math.floor(len / 8);
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x1 + t * len;
    const y = y1 + Math.sin(t * Math.PI * 4) * 10;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.stroke();
  
  // Highlight
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x1 + t * len;
    const y = y1 + Math.sin(t * Math.PI * 4) * 10 - 2;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawArrow(ctx, x1, y1, x2, y2, color, width) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x1, y1 - width/2);
  ctx.lineTo(x2 - width, y1 - width/2);
  ctx.lineTo(x2 - width, y1 - width);
  ctx.lineTo(x2, y1);
  ctx.lineTo(x2 - width, y1 + width);
  ctx.lineTo(x2 - width, y1 + width/2);
  ctx.lineTo(x1, y1 + width/2);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawLabel(ctx, text, x, y, color) {
  ctx.save();
  ctx.font = '600 10px DM Mono, monospace';
  ctx.fillStyle = color || '#f0f4ff';
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawDNAHelix(ctx, x1, y1, x2, y2) {
  ctx.save();
  const len = x2 - x1;
  const steps = 80;
  
  // Strand 1
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x1 + t * len;
    const y = y1 + Math.sin(t * Math.PI * 4) * 15;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  
  // Strand 2
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = x1 + t * len;
    const y = y1 + Math.sin(t * Math.PI * 4 + Math.PI) * 15;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = '#0ea5e9';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  
  // Base pairs
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const x = x1 + t * len;
    const y1a = y1 + Math.sin(t * Math.PI * 4) * 15;
    const y2a = y1 + Math.sin(t * Math.PI * 4 + Math.PI) * 15;
    ctx.beginPath();
    ctx.moveTo(x, y1a);
    ctx.lineTo(x, y2a);
    ctx.strokeStyle = 'rgba(56,189,248,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();
}

function drawSurfaceView(ctx, W, H) {
  const cx = W/2, cy = H/2;
  
  // Ellipsoid surface with electrostatic coloring
  const g = ctx.createRadialGradient(cx-30, cy-40, 20, cx, cy, 180);
  g.addColorStop(0, 'rgba(167,139,250,0.9)');
  g.addColorStop(0.3, 'rgba(94,234,212,0.7)');
  g.addColorStop(0.6, 'rgba(56,189,248,0.5)');
  g.addColorStop(1, 'rgba(17,24,39,0.2)');
  
  ctx.beginPath();
  ctx.ellipse(cx, cy, 200, 160, -0.2, 0, Math.PI*2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Positive patch (DNA binding)
  const pos = ctx.createRadialGradient(cx-30, cy+40, 0, cx-30, cy+40, 80);
  pos.addColorStop(0, 'rgba(56,189,248,0.7)');
  pos.addColorStop(1, 'transparent');
  ctx.fillStyle = pos;
  ctx.beginPath();
  ctx.ellipse(cx-30, cy+40, 80, 60, 0.3, 0, Math.PI*2);
  ctx.fill();
  
  // Negative patch
  const neg = ctx.createRadialGradient(cx+60, cy-50, 0, cx+60, cy-50, 70);
  neg.addColorStop(0, 'rgba(248,113,113,0.6)');
  neg.addColorStop(1, 'transparent');
  ctx.fillStyle = neg;
  ctx.beginPath();
  ctx.ellipse(cx+60, cy-50, 70, 55, -0.4, 0, Math.PI*2);
  ctx.fill();
  
  // Highlight
  const hl = ctx.createRadialGradient(cx-60, cy-70, 0, cx-60, cy-70, 80);
  hl.addColorStop(0, 'rgba(255,255,255,0.15)');
  hl.addColorStop(1, 'transparent');
  ctx.fillStyle = hl;
  ctx.beginPath();
  ctx.ellipse(cx-60, cy-70, 80, 60, 0, 0, Math.PI*2);
  ctx.fill();
  
  // Legend
  drawLabel(ctx, '+ Positive (DNA-binding face)', cx-150, H-60, '#38bdf8');
  drawLabel(ctx, '− Negative surface', cx-150, H-42, '#f87171');
  
  ctx.font = '10px DM Mono, monospace';
  ctx.fillStyle = 'rgba(148,163,184,0.25)';
  ctx.textAlign = 'right';
  ctx.fillText('Electrostatic surface — ESP mapped via APBS', W-12, H-12);
  ctx.textAlign = 'left';
}

function drawCartoonView(ctx, W, H) {
  const cx = W/2, cy = H/2;
  ctx.clearRect(0, 0, W, H);
  
  const bg2 = ctx.createLinearGradient(0, 0, W, H);
  bg2.addColorStop(0, '#0d1320');
  bg2.addColorStop(1, '#111827');
  ctx.fillStyle = bg2;
  ctx.fillRect(0, 0, W, H);
  
  // Draw multiple helices (α-helices)
  const helixData = [
    {x1:80,  y1:200, x2:160, y2:200, col:'#5eead4'},
    {x1:180, y1:180, x2:240, y2:180, col:'#fb923c'},
    {x1:260, y1:220, x2:380, y2:220, col:'#a78bfa'},
    {x1:390, y1:190, x2:440, y2:190, col:'#a78bfa'},
    {x1:460, y1:200, x2:560, y2:200, col:'#f472b6'},
    {x1:565, y1:220, x2:630, y2:220, col:'#facc15'},
  ];
  helixData.forEach(h => drawHelix(ctx, h.x1, h.y1, h.x2, h.y2, h.col));
  
  // Beta strands
  const sheetData = [
    {x1:260, y1:250, x2:320, y2:250, col:'#a78bfa'},
    {x1:265, y1:265, x2:318, y2:265, col:'#8b6fe8'},
    {x1:365, y1:250, x2:425, y2:250, col:'#a78bfa'},
    {x1:368, y1:265, x2:422, y2:265, col:'#8b6fe8'},
    {x1:450, y1:250, x2:462, y2:250, col:'#f472b6'},
  ];
  sheetData.forEach(s => drawArrow(ctx, s.x1, s.y1, s.x2, s.y2, s.col, 7));
  
  // Loops (thin lines)
  [
    [[160,200],[180,195],[180,180]],
    [[240,180],[260,190],[260,220]],
    [[320,250],[340,240],[340,290],[365,260],[365,250]],
    [[440,190],[460,195],[460,200]],
    [[560,200],[565,210],[565,220]],
  ].forEach(pts => {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i=1;i<pts.length;i++) ctx.lineTo(pts[i][0],pts[i][1]);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
  
  // N / C labels
  ctx.font = '700 13px DM Mono, monospace';
  ctx.fillStyle = '#5eead4';
  ctx.fillText('N', 65, 205);
  ctx.fillStyle = '#facc15';
  ctx.fillText('C', 638, 225);
  
  ctx.font = '10px DM Mono, monospace';
  ctx.fillStyle = 'rgba(148,163,184,0.25)';
  ctx.textAlign = 'right';
  ctx.fillText('Cartoon topology — PyMOL 2.5 style', W-12, H-12);
  ctx.textAlign = 'left';
}

// ─── Gallery Canvases ────────────────────────────────────────
function drawGallery() {
  drawGalleryCanvas1();
  drawGalleryCanvas2();
  drawGalleryCanvas3();
  drawGalleryCanvas4();
}

function drawGalleryCanvas1() {
  const c = document.getElementById('gc1');
  if (!c) return;
  const ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  
  const bg = ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#0a1220');bg.addColorStop(1,'#0f1a28');
  ctx.fillStyle = bg;ctx.fillRect(0,0,W,H);
  
  // Full ribbon schematic
  const domColors = ['#5eead4','#fb923c','#a78bfa','#f472b6','#facc15'];
  const domX = [30, 90, 140, 295, 358];
  const domW = [55, 45, 148, 58, 35];
  const cy = H/2;
  
  domColors.forEach((col, i) => {
    const x = domX[i] * W/400, w = domW[i] * W/400;
    const g = ctx.createLinearGradient(x, cy-30, x+w, cy+30);
    g.addColorStop(0, col + 'cc');
    g.addColorStop(1, col + '66');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(x, cy-18, w, 36, 6);
    ctx.fill();
    ctx.strokeStyle = col;
    ctx.lineWidth = 1;
    ctx.stroke();
  });
  
  ctx.font = '8px DM Mono'; ctx.fillStyle='rgba(240,244,255,0.5)';
  ctx.fillText('Full ribbon — domain colored', 8, H-10);
}

function drawGalleryCanvas2() {
  const c = document.getElementById('gc2');
  if (!c) return;
  const ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  ctx.fillStyle = '#0a1220';ctx.fillRect(0,0,W,H);
  
  const cx = W/2, cy = H/2;
  
  // β-sandwich schematic
  const g = ctx.createRadialGradient(cx,cy,0,cx,cy,100);
  g.addColorStop(0,'rgba(167,139,250,0.12)');
  g.addColorStop(1,'transparent');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  
  for(let i=0;i<4;i++) {
    const y = cy - 40 + i*22;
    drawArrow(ctx, cx-90, y, cx-20, y, '#a78bfa', 6);
    drawArrow(ctx, cx+20, y, cx+90, y, '#a78bfa', 6);
  }
  
  // L3 loop
  ctx.beginPath();
  ctx.moveTo(cx-20,cy+40);
  ctx.bezierCurveTo(cx-10,cy+70,cx+10,cy+70,cx+20,cy+40);
  ctx.strokeStyle='#c084fc';ctx.lineWidth=2.5;ctx.stroke();
  
  // Zinc
  ctx.beginPath();ctx.arc(cx,cy-10,5,0,Math.PI*2);
  ctx.fillStyle='#facc15';ctx.fill();
  
  drawHelix(ctx, cx-80, cy+90, cx+80, cy+90, '#a78bfa');
  
  ctx.font='8px DM Mono';ctx.fillStyle='rgba(240,244,255,0.5)';
  ctx.fillText('DNA-binding domain · β-sandwich', 8, H-10);
}

function drawGalleryCanvas3() {
  const c = document.getElementById('gc3');
  if (!c) return;
  const ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  ctx.fillStyle = '#0a1220';ctx.fillRect(0,0,W,H);
  
  const cx = W/2, cy = H/2;
  
  // Tetramer: 4 monomers arranged in a square
  const pos = [{x:-80,y:-60},{x:80,y:-60},{x:80,y:60},{x:-80,y:60}];
  const cols = ['#f472b6','#e879d4','#db6ecb','#c84ab8'];
  
  pos.forEach((p, i) => {
    // Helix per monomer
    const x1 = cx+p.x-40, y1 = cy+p.y;
    drawHelix(ctx, x1, y1, x1+80, y1, cols[i]);
    // Beta strand
    drawArrow(ctx, x1-10, y1+18, x1+50, y1+18, cols[i], 5);
  });
  
  // Interface lines
  ctx.strokeStyle='rgba(244,114,182,0.2)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(cx-80,cy-20);ctx.lineTo(cx+80,cy-20);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx,cy-80);ctx.lineTo(cx,cy+80);ctx.stroke();
  
  ctx.font='8px DM Mono';ctx.fillStyle='rgba(240,244,255,0.5)';
  ctx.fillText('Tetramerization domain · dimer-of-dimers', 8, H-10);
}

function drawGalleryCanvas4() {
  const c = document.getElementById('gc4');
  if (!c) return;
  const ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  ctx.fillStyle = '#0a1220';ctx.fillRect(0,0,W,H);
  
  const cx = W/2, cy = H/2;
  
  // ESP surface
  const surf = ctx.createRadialGradient(cx,cy,0,cx,cy,130);
  surf.addColorStop(0,'rgba(148,163,184,0.5)');
  surf.addColorStop(1,'rgba(17,24,39,0.1)');
  ctx.fillStyle=surf;
  ctx.beginPath();ctx.ellipse(cx,cy,130,110,0,0,Math.PI*2);ctx.fill();
  
  // Positive patch
  const pos = ctx.createRadialGradient(cx-20,cy+30,0,cx-20,cy+30,65);
  pos.addColorStop(0,'rgba(56,189,248,0.7)');
  pos.addColorStop(1,'transparent');
  ctx.fillStyle=pos;
  ctx.beginPath();ctx.ellipse(cx-20,cy+30,65,50,0.2,0,Math.PI*2);ctx.fill();
  
  // Negative patch
  const neg = ctx.createRadialGradient(cx+40,cy-40,0,cx+40,cy-40,50);
  neg.addColorStop(0,'rgba(248,113,113,0.65)');
  neg.addColorStop(1,'transparent');
  ctx.fillStyle=neg;
  ctx.beginPath();ctx.ellipse(cx+40,cy-40,50,40,-0.3,0,Math.PI*2);ctx.fill();
  
  // Highlight
  const hl=ctx.createRadialGradient(cx-50,cy-60,0,cx-50,cy-60,55);
  hl.addColorStop(0,'rgba(255,255,255,0.12)');hl.addColorStop(1,'transparent');
  ctx.fillStyle=hl;
  ctx.beginPath();ctx.ellipse(cx-50,cy-60,55,40,0,0,Math.PI*2);ctx.fill();
  
  // Color bar
  const bar = ctx.createLinearGradient(W/2-70, H-30, W/2+70, H-30);
  bar.addColorStop(0,'#f87171');bar.addColorStop(0.5,'#94a3b8');bar.addColorStop(1,'#38bdf8');
  ctx.fillStyle=bar;
  ctx.fillRect(W/2-70,H-26,140,8);
  ctx.font='7px DM Mono';ctx.fillStyle='#f87171';ctx.fillText('−',W/2-80,H-20);
  ctx.fillStyle='#38bdf8';ctx.fillText('+',W/2+74,H-20);
  
  ctx.font='8px DM Mono';ctx.fillStyle='rgba(240,244,255,0.5)';
  ctx.fillText('Electrostatic surface potential (ESP)', 8, H-10);
}

// ─── View button state ───────────────────────────────────────
let animFrame = null;
let rotAngle = 0;

// ─── Init ────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  initHelixCanvas();
  renderSequence();
  renderDomainMap();
  renderAAComp();
  drawProtein();
  drawGallery();
  
  // Scroll animation for progress bars
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.ss-fill').forEach(el => {
          el.style.width = el.style.width; // trigger reflow
        });
      }
    });
  }, { threshold: 0.3 });
  
  document.querySelectorAll('.sidebar-card').forEach(el => observer.observe(el));
  
  // Active nav highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.topbar-nav a');
  
  const scrollObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.style.color = '');
        const link = document.querySelector(`.topbar-nav a[href="#${e.target.id}"]`);
        if (link) link.style.color = 'var(--teal)';
      }
    });
  }, { threshold: 0.3 });
  
  sections.forEach(s => scrollObs.observe(s));
});

// Expose for HTML onclick
window.setView = setView;
window.copySeq = copySeq;
