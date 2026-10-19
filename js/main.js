/* ==========================================================================
   MAIN APPLICATION CONTROLLER
   Cursor physics, 3D card tilt, filtering, sound bindings, and scroll spy.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Audio Toggle Initialization
  const audioToggleBtn = document.getElementById('audio-toggle');
  const audioIcon = document.getElementById('audio-icon');

  function updateAudioIcon() {
    if (window.soundEngine && audioIcon) {
      if (window.soundEngine.isMuted()) {
        audioIcon.setAttribute('data-lucide', 'volume-x');
        audioToggleBtn.title = 'Sound FX: Muted';
      } else {
        audioIcon.setAttribute('data-lucide', 'volume-2');
        audioToggleBtn.title = 'Sound FX: Enabled';
      }
      if (window.lucide) window.lucide.createIcons();
    }
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      if (window.soundEngine) {
        window.soundEngine.toggleMute();
        window.soundEngine.playClick();
        updateAudioIcon();
      }
    });
    updateAudioIcon();
  }

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      if (window.soundEngine) window.soundEngine.playClick();
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // 2. Custom Magnetic Cursor
  const cursorDot = document.querySelector('.custom-cursor-dot');
  const cursorRing = document.querySelector('.custom-cursor-ring');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  function renderCursorRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    if (cursorRing) {
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
    }
    requestAnimationFrame(renderCursorRing);
  }
  renderCursorRing();

  // Hover triggers for custom cursor and sound
  const interactiveElements = document.querySelectorAll('a, button, .project-card, .rule-card, .skill-category-card, .filter-btn');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
      if (window.soundEngine) window.soundEngine.playHover();
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
    el.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playClick();
    });
  });

  // 3. 3D Card Tilt Effect on Mouse Move
  const tiltCards = document.querySelectorAll('.project-card, .rule-card, .skill-category-card');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // 4. Project Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 5. Header Scroll Effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 6. Contact Form Transmission Submission
  const contactForm = document.getElementById('transmission-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>TRANSMITTING...</span>`;
      if (window.soundEngine) window.soundEngine.playClick();

      setTimeout(() => {
        submitBtn.innerHTML = `<span style="color:#10b981">✓ TRANSMISSION DELIVERED</span>`;
        if (window.soundEngine) window.soundEngine.playHover();
        
        // Open default mail client with pre-filled content
        const senderName = document.getElementById('form-name').value;
        const senderEmail = document.getElementById('form-email').value;
        const senderMsg = document.getElementById('form-msg').value;
        
        const mailtoUrl = `mailto:tamalkanti223@gmail.com?subject=Transmission%20from%20${encodeURIComponent(senderName)}&body=${encodeURIComponent(senderMsg + "\n\nFrom: " + senderEmail)}`;
        window.location.href = mailtoUrl;

        setTimeout(() => {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }, 2000);
      }, 700);
    });
  }

  // 7. Lucide Icons Initializer
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
