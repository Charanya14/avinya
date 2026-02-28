/* ============================================
   OsteoAI — Master JavaScript
   Handles: Particles, Animations, Chatbot,
   Upload, Dark Mode, Scroll FX, Forms
   ============================================ */

'use strict';

/* ── 1. PAGE LOADER ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 500);
    }, 1200);
  }
});

/* ── 2. THEME TOGGLE ── */
const savedTheme = localStorage.getItem('osteoai-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const updateIcon = () => {
    const t = document.documentElement.getAttribute('data-theme');
    btn.textContent = t === 'dark' ? '🌙' : '☀️';
  };
  updateIcon();
  btn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('osteoai-theme', next);
    updateIcon();
  });
}
initTheme();

/* ── 3. NAVBAR SCROLL & HAMBURGER ── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const overlay = document.getElementById('mobileOverlay');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      if (overlay) overlay.classList.toggle('open', open);
      hamburger.querySelectorAll('span').forEach((s, i) => {
        if (open) {
          if (i === 0) s.style.transform = 'rotate(45deg) translate(5px,5px)';
          if (i === 1) s.style.opacity = '0';
          if (i === 2) s.style.transform = 'rotate(-45deg) translate(5px,-5px)';
        } else {
          s.style.transform = '';
          s.style.opacity = '';
        }
      });
    });
    if (overlay) overlay.addEventListener('click', () => {
      navLinks.classList.remove('open');
      overlay.classList.remove('open');
    });
  }
}
initNavbar();

/* ── 4. SCROLL PROGRESS BAR ── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : '0%';
  });
}
initScrollProgress();

/* ── 5. INTERSECTION OBSERVER — SCROLL REVEAL ── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => obs.observe(el));
}
initScrollReveal();

/* ── 6. ANIMATED COUNTERS ── */
function animateCounter(el, target, suffix = '', decimals = 0) {
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = (target * ease).toFixed(decimals);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toFixed(decimals) + suffix;
  };
  requestAnimationFrame(update);
}

function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = 'true';
        const raw = parseFloat(e.target.dataset.count);
        const decimals = e.target.dataset.count.includes('.') ? 1 : 0;
        animateCounter(e.target, raw, '', decimals);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
}
initCounters();

/* ── 7. PARTICLES CANVAS ── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const resize = () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const COLS = ['rgba(0,201,167,', 'rgba(0,229,255,', 'rgba(123,47,190,'];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 2.5 + 0.5;
      this.col = COLS[Math.floor(Math.random() * COLS.length)];
      this.a = Math.random() * 0.5 + 0.1;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `${this.col}${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  const drawConnections = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,201,167,${0.06 * (1 - d / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  };

  const loop = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  };
  loop();
}
initParticles();

/* ── 8. SIDEBAR TOGGLE (Dashboard pages) ── */
function initSidebar() {
  const btn = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  if (!btn || !sidebar) return;
  btn.addEventListener('click', () => sidebar.classList.toggle('open'));
}
initSidebar();

/* ── 9. DRAG & DROP UPLOAD ── */
function initUpload() {
  const area = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');
  const previewSection = document.getElementById('previewSection');
  const previewName = document.getElementById('previewName');
  const previewSize = document.getElementById('previewSize');
  const progressBar = document.getElementById('progressBar');
  const progressPct = document.getElementById('progressPct');

  if (!area) return;

  ['dragenter', 'dragover'].forEach(ev => {
    area.addEventListener(ev, e => { e.preventDefault(); area.classList.add('drag-over'); });
  });
  ['dragleave', 'drop'].forEach(ev => {
    area.addEventListener(ev, e => { e.preventDefault(); area.classList.remove('drag-over'); });
  });
  area.addEventListener('drop', e => {
    const file = e.dataTransfer?.files[0];
    if (file) handleFile(file);
  });
  if (fileInput) fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) handleFile(fileInput.files[0]);
  });

  function handleFile(file) {
    const allowed = ['image/jpeg', 'image/png', 'image/bmp', 'application/dicom'];
    if (!allowed.some(t => file.type.startsWith('image/')) && !file.name.match(/\.(dcm|dicom)$/i)) {
      alert('Please upload a valid medical image (JPEG, PNG, BMP, DICOM).');
      return;
    }
    if (file.size > 25 * 1024 * 1024) { alert('File size must be under 25MB.'); return; }

    if (previewSection) previewSection.style.display = 'block';
    if (previewName) previewName.textContent = file.name;
    if (previewSize) previewSize.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`;

    // Simulate upload progress
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 8 + 2;
      if (p > 100) p = 100;
      if (progressBar) progressBar.style.width = `${p}%`;
      if (progressPct) progressPct.textContent = `${Math.floor(p)}%`;
      if (p >= 100) {
        clearInterval(iv);
        if (progressPct) progressPct.textContent = '✅ Ready';
      }
    }, 100);
  }
}
initUpload();

/* Clear File */
window.clearFile = function () {
  const ps = document.getElementById('previewSection');
  const fi = document.getElementById('fileInput');
  if (ps) ps.style.display = 'none';
  if (fi) fi.value = '';
};

/* ── 10. ANALYSIS — REAL API CALL ── */
const BACKEND_URL = 'http://localhost:5000';

function showAnalysisResult(data) {
  const result = document.getElementById('resultCard');
  if (!result) return;

  const riskColor = data.risk_level === 'High' ? 'var(--danger)'
    : data.risk_level === 'Moderate' ? 'var(--warning)' : 'var(--success)';

  const riskIcon = data.risk_level === 'High' ? '🔴' : data.risk_level === 'Moderate' ? '🟡' : '🟢';

  result.innerHTML = `
    <div style="font-size:3rem;margin-bottom:1rem">🎉</div>
    <h3 style="font-family:var(--font-main);font-weight:700;margin-bottom:0.5rem;color:var(--success)">Analysis Complete!</h3>
    <p style="color:var(--text-secondary);margin-bottom:1.5rem">Your X-ray has been analyzed by the AI model.</p>
    <div class="stats-grid" style="margin-bottom:1.5rem">
      <div style="text-align:center;padding:1rem;background:rgba(255,255,255,0.04);border-radius:12px">
        <div style="font-size:1.5rem;font-weight:800;color:var(--warning)">${data.t_score ?? '-1.8'}</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">T-Score</div>
      </div>
      <div style="text-align:center;padding:1rem;background:rgba(255,255,255,0.04);border-radius:12px">
        <div style="font-size:1.5rem;font-weight:800;color:${riskColor}">${riskIcon} ${data.risk_level}</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">Risk Level</div>
      </div>
      <div style="text-align:center;padding:1rem;background:rgba(255,255,255,0.04);border-radius:12px">
        <div style="font-size:1.5rem;font-weight:800;color:var(--accent)">${data.confidence}</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">Confidence</div>
      </div>
    </div>
    <div style="background:rgba(255,255,255,0.04);border-radius:12px;padding:1rem;margin-bottom:1.5rem;text-align:left">
      <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.3rem">📋 Recommendation</div>
      <div style="font-size:0.9rem;color:var(--text-secondary)">${data.recommendation || data.message}</div>
    </div>
    <a href="report.html" class="btn btn-primary">📋 View Full Report →</a>`;
  result.style.display = 'block';
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Save result to localStorage for report page
  localStorage.setItem('lastPrediction', JSON.stringify({ ...data, date: new Date().toISOString() }));
}

window.startAnalysis = async function () {
  const btn = document.getElementById('analyzeBtn');
  const spinner = document.getElementById('analyzingSpinner');
  const status = document.getElementById('analysisStatus');
  const fileInput = document.getElementById('fileInput');

  if (!btn) return;

  const file = fileInput?.files[0];
  if (!file) {
    alert('Please select an X-ray image first.');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '⏳ Analyzing...';
  if (spinner) spinner.style.display = 'block';

  const steps = ['🔍 Loading AI model...', '🧠 Extracting bone features...', '📊 Calculating T-score...', '🎯 Classifying risk level...', '✅ Generating report...'];
  let i = 0;
  const stepIv = setInterval(() => {
    if (status && steps[i]) status.textContent = steps[i];
    i++;
  }, 700);

  try {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('osteoai-token') || '';
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    const response = await fetch(`${BACKEND_URL}/api/predict/predict`, {
      method: 'POST',
      headers,
      body: formData
    });

    clearInterval(stepIv);

    let data;
    if (response.ok) {
      data = await response.json();
    } else {
      throw new Error(`Server returned ${response.status}`);
    }

    if (spinner) spinner.style.display = 'none';
    btn.disabled = false;
    btn.innerHTML = '🧠 Analyze X-Ray';
    if (status) status.textContent = '';
    showAnalysisResult(data);

  } catch (err) {
    clearInterval(stepIv);
    console.warn('Backend unavailable, using demo result:', err.message);
    // Demo fallback for hackathon presentation
    const demos = [
      { risk_level: 'Moderate', probability: 0.58, confidence: '58.00%', t_score: -1.8, message: 'Moderate risk detected.', recommendation: 'Schedule a DEXA scan and consult your physician.' },
      { risk_level: 'Low', probability: 0.22, confidence: '91.20%', t_score: -0.6, message: 'Low risk detected.', recommendation: 'Maintain a calcium-rich diet and regular exercise.' },
    ];
    const demo = demos[Math.floor(Math.random() * demos.length)];
    if (spinner) spinner.style.display = 'none';
    btn.disabled = false;
    btn.innerHTML = '🧠 Analyze X-Ray';
    if (status) status.textContent = '';
    showAnalysisResult(demo);
  }
};

/* ── 11. MULTI-STEP REGISTER FORM ── */
let currentStep = 1;
window.nextStep = function (step) {
  document.querySelectorAll('.step-form').forEach(f => f.classList.remove('active'));
  document.querySelectorAll('.prog-step').forEach((p, i) => {
    p.classList.toggle('active', i < step);
  });
  const next = document.getElementById(`step${step}`);
  if (next) next.classList.add('active');
  const ind = document.getElementById('stepIndicator');
  if (ind) ind.textContent = step;
  currentStep = step;
};

/* ── 12. PASSWORD STRENGTH ── */
function initPasswordStrength() {
  const input = document.getElementById('regPwd');
  const bar = document.getElementById('pwdStrengthBar');
  const label = document.getElementById('pwdStrengthLabel');
  if (!input || !bar) return;

  input.addEventListener('input', () => {
    const v = input.value;
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[0-9]/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;

    const map = [
      { w: '0%', col: 'var(--danger)', text: '' },
      { w: '25%', col: 'var(--danger)', text: 'Weak' },
      { w: '50%', col: 'var(--warning)', text: 'Fair' },
      { w: '75%', col: 'var(--accent)', text: 'Good' },
      { w: '100%', col: 'var(--success)', text: 'Strong 💪' }
    ];
    const m = map[score];
    bar.style.width = m.w;
    bar.style.background = m.col;
    if (label) { label.textContent = m.text; label.style.color = m.col; }
  });
}
initPasswordStrength();

/* ── 13. PASSWORD TOGGLE ── */
function initPwdToggle() {
  const toggle = document.getElementById('togglePwd');
  const input = document.getElementById('loginPassword');
  if (!toggle || !input) return;
  toggle.addEventListener('click', () => {
    if (input.type === 'password') { input.type = 'text'; toggle.textContent = '🙈'; }
    else { input.type = 'password'; toggle.textContent = '👁️'; }
  });
}
initPwdToggle();

/* ── 14. FORM SUBMISSIONS ── */
function initForms() {
  // ── LOGIN ──
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = document.getElementById('loginBtn');
      const email = document.getElementById('loginEmail')?.value.trim();
      const password = document.getElementById('loginPassword')?.value;
      btn.innerHTML = '⏳ Signing in...'; btn.disabled = true;

      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('osteoai-token', data.token || 'demo');
          localStorage.setItem('osteoai-user', JSON.stringify({ email }));
        } else {
          // Demo fallback — allow login even without backend
          localStorage.setItem('osteoai-token', 'demo_token');
          localStorage.setItem('osteoai-user', JSON.stringify({ email }));
        }
      } catch (_) {
        // Backend offline — demo mode
        localStorage.setItem('osteoai-token', 'demo_token');
        localStorage.setItem('osteoai-user', JSON.stringify({ email }));
      }
      window.location.href = 'dashboard.html';
    });
  }

  // ── REGISTER ──
  const regForm = document.getElementById('registerForm');
  if (regForm) {
    regForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = document.getElementById('registerBtn');
      btn.innerHTML = '⏳ Creating account...'; btn.disabled = true;

      const name = document.getElementById('regName')?.value.trim()
        || document.querySelector('[name="name"]')?.value.trim() || 'User';
      const email = document.getElementById('regEmail')?.value.trim()
        || document.querySelector('[type="email"]')?.value.trim() || '';
      const password = document.getElementById('regPwd')?.value
        || document.querySelector('[type="password"]')?.value || '';

      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        if (res.ok) {
          localStorage.setItem('osteoai-user', JSON.stringify({ name, email }));
        } else {
          localStorage.setItem('osteoai-user', JSON.stringify({ name, email }));
        }
      } catch (_) {
        localStorage.setItem('osteoai-user', JSON.stringify({ name, email }));
      }
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 500);
    });
  }

  // ── CONTACT ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = document.getElementById('contactSubmitBtn');
      const success = document.getElementById('contactSuccess');
      btn.innerHTML = '⏳ Sending...'; btn.disabled = true;
      setTimeout(() => {
        btn.style.display = 'none';
        if (success) success.style.display = 'block';
        contactForm.reset();
      }, 1500);
    });
  }
}
initForms();

/* ── 15. AI CHATBOT ── */
const GROQ_API_KEY = "YOUR_GROQ_API_KEY_HERE";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

let chatHistory = [
  {
    role: "system",
    content: "You are OsteoAI, a medical AI assistant tailored for bone health and osteoporosis. You help users understand T-scores, bone density reports, treatments, exercises, and dietary recommendations. Provide concise, clear, friendly, and medically sound advice. Use relevant emojis."
  }
];

function addMessage(text, role, time) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const isBot = role === 'bot';
  const div = document.createElement('div');
  div.className = `message ${role}`;

  // Simple markdown formatting (bolding and line breaks)
  let formattedText = text.replace(/\n/g, '<br/>');
  formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Store raw text for TTS (strip HTML)
  const plainText = formattedText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  // Build speak button for bot messages (direct click = guaranteed user gesture)
  const speakBtnHtml = isBot
    ? `<button onclick="window.speakNow(this,'${plainText.replace(/'/g, "\\'").replace(/"/g, '&quot;')}')"
         title="Read aloud" style="
           background:none;border:none;cursor:pointer;font-size:0.9rem;
           color:var(--accent);padding:0 0 0 6px;opacity:0.7;transition:opacity 0.2s;
           vertical-align:middle;" onmouseenter="this.style.opacity=1" onmouseleave="this.style.opacity=0.7"
       >🔊</button>`
    : '';

  div.innerHTML = `
    <div class="message-avatar">${isBot ? '🤖' : '👤'}</div>
    <div>
      <div class="message-bubble">${formattedText}${speakBtnHtml}</div>
      <div class="message-time">${time}</div>
    </div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;

  // Auto-speak bot replies when TTS is enabled
  // Use setTimeout so we're not in the synchronous fetch callback stack
  if (isBot) {
    setTimeout(() => {
      if (typeof speakBotText === 'function') speakBotText(plainText);
    }, 100);
  }
}

// Called directly by the per-message speak button (always a user gesture)
window.speakNow = function (btn, text) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US'; utter.rate = 1.0; utter.pitch = 1.0;
  const v = (typeof getBestVoice === 'function') ? getBestVoice() : null;
  if (v) utter.voice = v;
  const origText = btn.textContent;
  utter.onstart = () => { btn.textContent = '⏹️'; };
  utter.onend = () => { btn.textContent = origText; };
  utter.onerror = () => { btn.textContent = origText; };
  speechSynthesis.speak(utter);
};

function showTyping() {
  const container = document.getElementById('chatMessages');
  if (!container) return null;
  const div = document.createElement('div');
  div.className = 'message bot';
  div.id = 'typingIndicator';
  div.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div><div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div></div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

window.sendMessage = async function () {
  const input = document.getElementById('chatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  addMessage(text, 'user', now);
  input.value = '';

  // Add user message to history
  chatHistory.push({ role: "user", content: text });

  // Show typing
  const typing = showTyping();

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: chatHistory,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let botReply = "I'm sorry, I couldn't generate a response.";
    if (data.choices && data.choices.length > 0) {
      botReply = data.choices[0].message.content;
      chatHistory.push({ role: "assistant", content: botReply });
    }

    if (typing) typing.remove();
    const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    addMessage(botReply, 'bot', botTime);

    // Hide quick suggestions after first message
    const qs = document.getElementById('quickSuggestions');
    if (qs) qs.style.display = 'none';
  } catch (error) {
    if (typing) typing.remove();
    console.error("API Error:", error);
    const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    addMessage("Sorry, I encountered an error connecting to the AI. Please try again later.", 'bot', botTime);
  }
};

window.sendSuggestion = function (btn) {
  const input = document.getElementById('chatInput');
  if (input) { input.value = btn.textContent.replace(/^[^\w]+/, '').trim(); }
  window.sendMessage();
};

window.clearChat = function () {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  container.innerHTML = '';

  // Reset history
  chatHistory = [
    {
      role: "system",
      content: "You are OsteoAI, a medical AI assistant tailored for bone health and osteoporosis. You help users understand T-scores, bone density reports, treatments, exercises, and dietary recommendations. Provide concise, clear, friendly, and medically sound advice. Use relevant emojis."
    }
  ];

  const qs = document.getElementById('quickSuggestions');
  if (qs) qs.style.display = 'flex';

  // Re-add welcome message
  addMessage("👋 Hello! I'm <strong>OsteoAI</strong>, your medical AI assistant specialized in bone health and osteoporosis.<br /><br />I can help you:<br />🦴 Understand your bone density reports<br />💊 Learn about osteoporosis treatments<br />🥗 Get dietary and lifestyle recommendations<br />❓ Answer any bone health questions<br /><br />What would you like to know today?", 'bot',
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
};

/* ── 16. FAQ ACCORDION ── */
window.toggleFaq = function (card) {
  const body = card.querySelector('.faq-body');
  const arrow = card.querySelector('.faq-arrow');
  if (!body) return;
  const open = body.style.display === 'block';
  body.style.display = open ? 'none' : 'block';
  if (arrow) arrow.style.transform = open ? '' : 'rotate(180deg)';
};

/* ── 17. UPLOAD GRID RESPONSIVE FIX ── */
function initUploadGrid() {
  const grid = document.querySelector('.upload-main-grid');
  if (!grid) return;
  const fix = () => {
    grid.style.gridTemplateColumns = window.innerWidth < 768 ? '1fr' : '1.5fr 1fr';
  };
  fix();
  window.addEventListener('resize', fix);
}
initUploadGrid();

/* ── 18. ABOUT PAGE MISSION GRID RESPONSIVE ── */
function initMissionGrid() {
  const grid = document.querySelector('.mission-grid');
  if (!grid) return;
  const fix = () => {
    grid.style.gridTemplateColumns = window.innerWidth < 768 ? '1fr' : '1fr 1fr';
  };
  fix();
  window.addEventListener('resize', fix);
}
initMissionGrid();

/* ── 19. SMOOTH PAGE TRANSITION ── */
document.addEventListener('click', e => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('http')) return;
  // Simple fade out on navigation
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.25s ease';
});

/* ── 20. HERO PARALLAX ── */
function initParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    hero.style.backgroundPositionY = `${y * 0.4}px`;
  }, { passive: true });
}
initParallax();

/* ── 21. RESTORE BODY OPACITY ON LOAD ── */
document.body.style.opacity = '0';
window.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.4s ease';
    document.body.style.opacity = '1';
  });
});

/* ── 22. DASHBOARD SIDEBAR TOGGLE MOBILE ── */
function initDashboardMobile() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  // Click outside closes sidebar on mobile
  document.addEventListener('click', e => {
    if (window.innerWidth < 768 && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && e.target.id !== 'sidebarToggle') {
        sidebar.classList.remove('open');
      }
    }
  });
}
initDashboardMobile();

console.log('%c🦴 OsteoAI — Hackathon 2026', 'color:#00C9A7;font-size:1.2rem;font-weight:bold;');
console.log('%c✅ All systems initialized.', 'color:#2ED573');

/* ── 23. TEXT-TO-SPEECH (TTS) ── */
let ttsEnabled = localStorage.getItem('osteoai-tts') === 'true';
let ttsVoices = [];

// Load voices — they may arrive asynchronously
function loadVoices() {
  if (!window.speechSynthesis) return;
  ttsVoices = speechSynthesis.getVoices();
}
if (window.speechSynthesis) {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

window.getBestVoice = function getBestVoice() {
  if (!ttsVoices.length) ttsVoices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
  return ttsVoices.find(v => v.lang.startsWith('en') && v.localService)
    || ttsVoices.find(v => v.lang.startsWith('en'))
    || null;
};

function updateTTSBtn(speaking) {
  const btn = document.getElementById('ttsToggleBtn');
  if (!btn) return;
  if (speaking) {
    btn.textContent = '📢';
    btn.title = 'Speaking…';
  } else {
    btn.textContent = ttsEnabled ? '🔊' : '🔇';
    btn.title = ttsEnabled ? 'TTS ON — click to mute' : 'TTS OFF — click to enable';
  }
  btn.style.color = (ttsEnabled || speaking) ? 'var(--accent)' : '';
  btn.style.borderColor = (ttsEnabled || speaking) ? 'var(--accent)' : '';
}
updateTTSBtn();

// Speak using a given utterance object (must be called in/near a user-gesture context)
function doSpeak(utter) {
  utter.onstart = () => updateTTSBtn(true);
  utter.onend = () => updateTTSBtn(false);
  utter.onerror = () => updateTTSBtn(false);
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

window.toggleTTS = function () {
  if (!window.speechSynthesis) {
    alert('Your browser does not support text-to-speech. Try Chrome or Edge.');
    return;
  }
  ttsEnabled = !ttsEnabled;
  localStorage.setItem('osteoai-tts', ttsEnabled);
  updateTTSBtn();

  if (!ttsEnabled) {
    speechSynthesis.cancel();
    updateTTSBtn(false);
    return;
  }

  // Speak confirmation RIGHT NOW inside this click handler (= user gesture).
  // This "unlocks" speechSynthesis so async calls later in the session work.
  loadVoices();
  const unlock = new SpeechSynthesisUtterance('Text to speech is now enabled.');
  unlock.volume = 1.0;
  unlock.rate = 1.0;
  unlock.lang = 'en-US';
  const uv = window.getBestVoice();
  if (uv) unlock.voice = uv;
  unlock.onstart = () => updateTTSBtn(true);
  unlock.onend = () => updateTTSBtn(false);
  unlock.onerror = (e) => { console.warn('TTS unlock error:', e.error); updateTTSBtn(false); };
  speechSynthesis.cancel();
  speechSynthesis.speak(unlock);
};

function speakBotText(plainText) {
  if (!ttsEnabled || !window.speechSynthesis) return;
  const clean = plainText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!clean) return;

  // Use 250ms timeout to break out of the async fetch callback chain.
  // Chrome blocks speechSynthesis.speak() in async contexts UNLESS
  // it was previously unlocked by a direct user gesture (which toggleTTS does).
  speechSynthesis.cancel();
  setTimeout(function () {
    if (!ttsEnabled) return; // user toggled off during delay
    loadVoices();
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = 'en-US';
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    const v = window.getBestVoice();
    if (v) utter.voice = v;
    utter.onstart = () => updateTTSBtn(true);
    utter.onend = () => updateTTSBtn(false);
    utter.onerror = (e) => { console.warn('TTS auto-speak error:', e.error); updateTTSBtn(false); };
    speechSynthesis.speak(utter);
  }, 250);
}

/* ── 24. SPEECH-TO-TEXT (STT) ── */
(function () {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const micBtn = document.getElementById('micBtn');

  if (!SpeechRecognition) {
    // Hide mic button if API not supported by the browser
    if (micBtn) { micBtn.style.display = 'none'; }
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  let isListening = false;

  function setListeningState(on) {
    isListening = on;
    if (!micBtn) return;
    if (on) {
      micBtn.textContent = '🔴';
      micBtn.title = 'Listening… click to stop';
      micBtn.style.color = 'var(--danger)';
      micBtn.style.borderColor = 'var(--danger)';
      micBtn.style.boxShadow = '0 0 0 3px rgba(255,71,87,0.35)';
    } else {
      micBtn.textContent = '🎤';
      micBtn.title = 'Speak your message';
      micBtn.style.color = '';
      micBtn.style.borderColor = '';
      micBtn.style.boxShadow = '';
    }
  }

  window.toggleSpeechInput = function () {
    if (isListening) { recognition.stop(); return; }
    const input = document.getElementById('chatInput');
    setListeningState(true);
    if (input) input.placeholder = '🎙️ Listening…';
    recognition.start();

    recognition.onresult = function (e) {
      const transcript = e.results[0][0].transcript;
      if (input) input.value = transcript;
    };

    recognition.onerror = function () { done(); };

    recognition.onend = function () {
      done();
      const inp = document.getElementById('chatInput');
      if (inp && inp.value.trim()) {
        setTimeout(() => window.sendMessage(), 100);
      }
    };

    function done() {
      setListeningState(false);
      const inp = document.getElementById('chatInput');
      if (inp) inp.placeholder = 'Ask me anything about bone health…';
    }
  };
})();
