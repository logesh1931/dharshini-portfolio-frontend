// ─── API Base URL ─────────────────────────────────────────────────
// When deployed: frontend calls backend Render URL
// Change this to your actual Render backend URL after deployment
const API_BASE = 'https://dharshini-portfolio-api-3x5m.onrender.com/api';// For local testing, comment above and uncomment below:
// const API_BASE = 'http://localhost:5000/api';

// ─── Custom Cursor ────────────────────────────────────────────────
const cursor = document.querySelector('.cursor');
const trail  = document.querySelector('.cursor-trail');
let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});
(function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  trail.style.left = trailX + 'px';
  trail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
})();
document.querySelectorAll('a,button,.project-card,.filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// ─── Navbar ───────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));

// ─── Mobile Menu ─────────────────────────────────────────────────
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');
hamburger?.addEventListener('click',  () => mobileMenu.classList.add('open'));
mobileClose?.addEventListener('click',() => mobileMenu.classList.remove('open'));
mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

// ─── Reveal on Scroll ─────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }});
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ─── Skill Bar Animation ──────────────────────────────────────────
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => setTimeout(() => bar.classList.add('animated'), 100));
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

// ─── Load Projects from API ───────────────────────────────────────
let allProjects = [];

async function loadProjects() {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = `
    <div class="project-card featured" style="height:280px"><div class="loading-skeleton" style="height:100%"></div></div>
    <div class="project-card" style="height:280px"><div class="loading-skeleton" style="height:100%"></div></div>
    <div class="project-card" style="height:280px"><div class="loading-skeleton" style="height:100%"></div></div>`;

  try {
    const res  = await fetch(`${API_BASE}/projects`);
    const data = await res.json();
    allProjects = data.data || [];
    renderProjects(allProjects);
  } catch {
    // Fallback inline projects if API is unreachable
    allProjects = [
      { _id:'1', title:'Personal Portfolio', description:'Full-stack portfolio with Node.js backend and MongoDB.', techStack:['HTML','CSS','JS','Node.js','MongoDB'], category:'web', featured:true, liveUrl:'#', githubUrl:'#', imageUrl:'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80', order:1 },
      { _id:'2', title:'Student Result Management', description:'Role-based system for managing and publishing student results.', techStack:['React','Node.js','MySQL','JWT'], category:'web', featured:true, liveUrl:'', githubUrl:'#', imageUrl:'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80', order:2 },
      { _id:'3', title:'E-Commerce Shopping App', description:'Full online store with cart, orders, and admin dashboard.', techStack:['React','Node.js','MongoDB'], category:'web', featured:false, liveUrl:'', githubUrl:'#', imageUrl:'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80', order:3 },
      { _id:'4', title:'Weather Dashboard', description:'Real-time 5-day forecasts using OpenWeather API.', techStack:['HTML','CSS','JavaScript'], category:'web', featured:false, liveUrl:'', githubUrl:'#', imageUrl:'https://images.unsplash.com/photo-1504608524841-42584120d693?w=600&q=80', order:4 },
      { _id:'5', title:'Library Management System', description:'Python + MySQL desktop app to manage books and lending.', techStack:['Python','MySQL','Tkinter'], category:'backend', featured:false, liveUrl:'', githubUrl:'#', imageUrl:'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80', order:5 },
      { _id:'6', title:'Spam Email Classifier', description:'NLP-based ML model to detect spam with 97% accuracy.', techStack:['Python','Flask','Scikit-learn'], category:'ai/ml', featured:false, liveUrl:'', githubUrl:'#', imageUrl:'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80', order:6 },
    ];
    renderProjects(allProjects);
  }
}

function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!projects.length) { grid.innerHTML = `<p class="no-projects">No projects found.</p>`; return; }

  grid.innerHTML = projects.map((p, i) => `
    <div class="project-card ${p.featured && i === 0 ? 'featured' : ''} reveal" data-category="${p.category}">
      <div class="project-img">
        <img src="${p.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80'}" alt="${p.title}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80'">
        <div class="project-overlay"></div>
      </div>
      <div class="project-content">
        <p class="project-cat">${p.category}</p>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="project-stack">${(p.techStack||[]).map(t=>`<span class="stack-tag">${t}</span>`).join('')}</div>
        <div class="project-links">
          ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" class="project-link">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>Live Demo</a>` : ''}
          ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" class="project-link">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>GitHub</a>` : ''}
        </div>
      </div>
    </div>`).join('');

  grid.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
}

// Project Filter
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    renderProjects(f === 'all' ? allProjects : allProjects.filter(p => p.category === f));
  });
});

// ─── Load Skills from API ─────────────────────────────────────────
async function loadSkills() {
  const grid = document.getElementById('skills-grid');
  try {
    const res  = await fetch(`${API_BASE}/skills`);
    const data = await res.json();
    buildSkillsUI(data.data || []);
  } catch {
    buildSkillsUI([
      {name:'HTML & CSS',level:90,category:'frontend'},
      {name:'JavaScript',level:82,category:'frontend'},
      {name:'React.js',level:78,category:'frontend'},
      {name:'Node.js / Express',level:80,category:'backend'},
      {name:'Python / Flask',level:78,category:'backend'},
      {name:'REST API Design',level:82,category:'backend'},
      {name:'MongoDB',level:80,category:'database'},
      {name:'MySQL',level:78,category:'database'},
      {name:'Git & GitHub',level:85,category:'tools'},
      {name:'Postman',level:78,category:'tools'},
    ]);
  }
}

function buildSkillsUI(skills) {
  const grid = document.getElementById('skills-grid');
  const grouped = skills.reduce((acc, s) => { (acc[s.category] = acc[s.category]||[]).push(s); return acc; }, {});
  grid.innerHTML = Object.entries(grouped).map(([cat, items]) => `
    <div class="skill-category reveal">
      <div class="skill-cat-label">${cat}</div>
      ${items.map(s => `
        <div class="skill-item">
          <div class="skill-name-row">
            <span class="skill-name">${s.name}</span>
            <span class="skill-pct">${s.level}%</span>
          </div>
          <div class="skill-bar"><div class="skill-fill" style="--target-width:${s.level}%"></div></div>
        </div>`).join('')}
    </div>`).join('');
  grid.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
  grid.querySelectorAll('.skill-category').forEach(el => skillObs.observe(el));
}

// ─── Contact Form ─────────────────────────────────────────────────
const form   = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('.form-submit');
  btn.disabled = true; btn.textContent = 'Sending...';
  status.className = 'form-status';

  try {
    const res  = await fetch(`${API_BASE}/contact`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ name:form.name.value, email:form.email.value, subject:form.subject.value, message:form.message.value })
    });
    const data = await res.json();
    if (data.success) {
      status.textContent = '✓ Message sent! Dharshini will get back to you soon.';
      status.className = 'form-status success show';
      form.reset();
    } else throw new Error(data.error || 'Failed');
  } catch (err) {
    status.textContent = `✗ Could not send. Email directly: dharshinirevathi19@gmail.com`;
    status.className = 'form-status error show';
  } finally {
    btn.disabled = false; btn.textContent = 'Send Message →';
  }
});

// ─── Smooth Scroll ────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior:'smooth', block:'start' }); }
  });
});

// ─── Init ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadProjects();
  loadSkills();
});
