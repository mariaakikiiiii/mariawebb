/* js/cv.js
   Renders CV preview from the cv-entry form (no backend).
   - Validates required fields (name, email, education)
   - Renders into the preview panel matching cv.html structure
   - Saves to localStorage as convenience
   - Provides Download HTML snapshot
*/

(function () {
  const form = document.getElementById('cvForm');
  const preview = document.getElementById('cvPreview');
  const resetBtn = document.getElementById('resetBtn');
  const generateBtn = document.getElementById('generateBtn');

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function listFromLines(text) {
    return text.split('\n').map(s => s.trim()).filter(Boolean);
  }

  function commaList(text) {
    return text.split(',').map(s => s.trim()).filter(Boolean);
  }

  function render(data) {
    // Build HTML similar to css/cv.html structure
    const educationHtml = (data.education || '').trim() ? listFromLines(data.education).map(line => {
      const parts = line.split('—').map(s => s.trim());
      const left = parts[0] || line;
      const right = parts[1] || '';
      return `<div class="education-item"><div class="edu-left">${escapeHtml(left)}</div><div class="edu-right">${escapeHtml(right)}</div></div>`;
    }).join('') : '<p class="muted">No education provided.</p>';

    const expHtml = (data.experience || '').trim() ? listFromLines(data.experience).map(e => {
      const parts = e.split('—').map(s => s.trim());
      const title = parts[0] || e;
      const details = parts.slice(1).join(' — ') || '';
      return `<article class="experience-item"><h4>${escapeHtml(title)}</h4>${details ? `<p class="muted">${escapeHtml(details)}</p>` : ''}</article>`;
    }).join('') : '<p class="muted">No experience provided.</p>';

    const skills = commaList(data.skills || '').map(s => `<li>${escapeHtml(s)}</li>`).join('') || '<li>No skills provided.</li>';
    const projects = listFromLines(data.projects || '').map(p => `<li>${escapeHtml(p)}</li>`).join('') || '<li>No projects provided.</li>';

    // ✅ FIX: handle valid or broken image links
    const defaultPhoto = "https://i.imgur.com/8Km9tLL.jpg";
    const photoUrl = data.photoUrl && data.photoUrl.trim() ? data.photoUrl.trim() : defaultPhoto;

    preview.innerHTML = `
      <article class="cv-container">
        <aside class="cv-side">
          <img id="cvPhoto" src="${escapeHtml(photoUrl)}" alt="Photo of ${escapeHtml(data.fullName||'Candidate')}" class="cv-photo">
          <div class="contact-card">
            <h2>Contact</h2>
            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email||'')}">${escapeHtml(data.email||'')}</a></p>
            <p><strong>Phone:</strong> ${escapeHtml(data.phone||'')}</p>
            <p><strong>Location:</strong> ${escapeHtml(data.location||'')}</p>
          </div>
        </aside>
        <section class="cv-main">
          <header>
            <h2>${escapeHtml(data.fullName||'')}</h2>
            <p class="profile-text">${escapeHtml(data.profile||'')}</p>
          </header>
          <section class="cv-section"><h3>Education</h3>${educationHtml}</section>
          <section class="cv-section"><h3>Experience</h3>${expHtml}</section>
          <section class="cv-section"><h3>Skills</h3><ul class="skills-list">${skills}</ul></section>
          <section class="cv-section"><h3>Projects</h3><ul>${projects}</ul></section>
          <div class="cv-actions" style="margin-top:1rem">
            <button id="downloadHtml" class="button">Download HTML</button>
            <button id="editFocus" class="button" style="background:#eee;color:var(--accent)">Edit</button>
          </div>
        </section>
      </article>
    `;

    // ✅ if the image link is broken, fallback to default
    const imgEl = preview.querySelector("#cvPhoto");
    imgEl.onerror = () => { imgEl.src = defaultPhoto; };

    // wire download
    document.getElementById('downloadHtml').addEventListener('click', function () {
      const content = preview.innerHTML;
      const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(data.fullName||'CV')}</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>${content}</body>
</html>`;
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (data.fullName ? data.fullName.replace(/\s+/g, '_') : 'cv') + '.html';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    });

    document.getElementById('editFocus').addEventListener('click', function () {
      document.getElementById('fullName').focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"'`]/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' })[m];
    });
  }

  function loadSaved() {
    try {
      const raw = localStorage.getItem('cvData');
      if (raw) {
        const obj = JSON.parse(raw);
        Object.keys(obj).forEach(k => {
          const el = document.getElementById(k);
          if (el) el.value = obj[k];
        });
        render(obj);
      }
    } catch (e) { /* ignore */ }
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    const data = {
      fullName: form.fullName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      location: form.location.value.trim(),
      profile: form.profile.value.trim(),
      education: form.education.value.trim(),
      experience: form.experience.value.trim(),
      skills: form.skills.value.trim(),
      projects: form.projects.value.trim(),
      photoUrl: form.photoUrl.value.trim()
    };

    if (!data.fullName) { alert('Full name required'); document.getElementById('fullName').focus(); return; }
    if (!data.email || !isValidEmail(data.email)) { alert('Valid email required'); document.getElementById('email').focus(); return; }
    if (!data.education) { alert('Education is required'); document.getElementById('education').focus(); return; }

    render(data);

    try { localStorage.setItem('cvData', JSON.stringify(data)); } catch (e) { /* ignore */ }
    generateBtn.textContent = 'Generated ✓';
    setTimeout(() => generateBtn.textContent = 'Generate CV', 1200);
  });

  resetBtn.addEventListener('click', function () {
    if (!confirm('Reset form and preview?')) return;
    form.reset();
    preview.innerHTML = '';
    try { localStorage.removeItem('cvData'); } catch (e) {}
  });

  loadSaved();
})();
