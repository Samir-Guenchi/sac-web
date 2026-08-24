/**
 * ZAPHIRA — Compte (Account) Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const step1View = document.getElementById('compte-view-step-1');
  const step2View = document.getElementById('compte-view-step-2');
  const step1Form = document.getElementById('compte-step-1-form');
  const step2Form = document.getElementById('compte-step-2-form');

  const initialEmailInput = document.getElementById('compte-initial-email');
  const displayEmailInput = document.getElementById('compte-display-email');
  const sendCodeBtn = document.getElementById('btn-send-verification-code');
  const pwdInput = document.getElementById('compte-password');

  // Password criteria elements
  const critLen = document.getElementById('crit-len');
  const critNum = document.getElementById('crit-num');
  const critMaj = document.getElementById('crit-maj');
  const critMin = document.getElementById('crit-min');
  const critSpe = document.getElementById('crit-spe');

  // Populate birth date dropdowns
  const daySelect = document.getElementById('birth-day');
  const yearSelect = document.getElementById('birth-year');

  if (daySelect) {
    for (let d = 1; d <= 31; d++) {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d < 10 ? '0' + d : d;
      daySelect.appendChild(opt);
    }
  }

  if (yearSelect) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 18; y >= 1930; y--) {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      yearSelect.appendChild(opt);
    }
  }

  // Step 1: Submit Email -> Proceed to Step 2
  if (step1Form) {
    step1Form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = initialEmailInput.value.trim();
      if (!email) return;

      displayEmailInput.value = email;
      step1View.style.display = 'none';
      step2View.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Send verification code simulation
  if (sendCodeBtn) {
    sendCodeBtn.addEventListener('click', () => {
      sendCodeBtn.textContent = 'CODE ENVOYÉ (123456)';
      sendCodeBtn.style.backgroundColor = '#2E7D32';
      setTimeout(() => {
        const codeInput = document.getElementById('compte-code');
        if (codeInput) codeInput.value = '123456';
      }, 1000);
    });
  }

  // Live password validation
  if (pwdInput) {
    pwdInput.addEventListener('input', () => {
      const val = pwdInput.value;
      
      const hasLen = val.length >= 10;
      const hasNum = /\d/.test(val);
      const hasMaj = /[A-Z]/.test(val);
      const hasMin = /[a-z]/.test(val);
      const hasSpe = /[^A-Za-z0-9]/.test(val);

      if (critLen) critLen.className = `pwd-criterion ${hasLen ? 'is-valid' : ''}`;
      if (critNum) critNum.className = `pwd-criterion ${hasNum ? 'is-valid' : ''}`;
      if (critMaj) critMaj.className = `pwd-criterion ${hasMaj ? 'is-valid' : ''}`;
      if (critMin) critMin.className = `pwd-criterion ${hasMin ? 'is-valid' : ''}`;
      if (critSpe) critSpe.className = `pwd-criterion ${hasSpe ? 'is-valid' : ''}`;
    });
  }

  // Step 2 Submit Form
  if (step2Form) {
    step2Form.addEventListener('submit', (e) => {
      e.preventDefault();
      const prenom = document.getElementById('compte-firstname')?.value || 'Client';
      const nom = document.getElementById('compte-lastname')?.value || '';
      
      // Store user session
      localStorage.setItem('zaphira_user', JSON.stringify({
        email: displayEmailInput.value,
        prenom,
        nom,
        loggedIn: true
      }));

      // Success notification
      alert(`Bienvenue dans la Maison ZAPHIRA, ${prenom} ${nom}. Votre compte a été créé avec succès.`);
      window.location.href = 'index.html';
    });
  }
});
