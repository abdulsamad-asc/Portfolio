/* =========================================================
   Abdul Samad Qureshi — Portfolio Script
   Vanilla JavaScript only. Organised by feature, top to bottom.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     1. Sticky nav background on scroll + active link highlight
     --------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const sections = document.querySelectorAll('main .section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScroll(){
    nav.style.background = window.scrollY > 40 ? 'rgba(10,13,18,0.85)' : 'rgba(10,13,18,0.55)';

    let currentId = sections[0] ? sections[0].id : '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 120) currentId = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------
     2. Mobile hamburger menu
     --------------------------------------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinksWrap = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinksWrap.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinksWrap.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinksWrap.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------------------------------------------
     3. Hero rotating role text
     --------------------------------------------------------- */
  const roles = [
    'Web Developer',
    'Graphic Designer',
    'Computer Operator',
    'Data Entry Professional',
    'Digital Services Professional',
    'Video Editor',
    'Freelancer'
  ];
  const roleEl = document.getElementById('hero-role');

  if (roleEl){
    if (reduceMotion){
      roleEl.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = roles[0].length;
      let deleting = false;

      function tick(){
        const word = roles[roleIndex];
        if (!deleting){
          charIndex++;
          if (charIndex > word.length){
            deleting = true;
            setTimeout(tick, 1400);
            return;
          }
        } else {
          charIndex--;
          if (charIndex < 1){
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
          }
        }
        roleEl.textContent = word.slice(0, Math.max(charIndex, 0));
        setTimeout(tick, deleting ? 45 : 85);
      }
      setTimeout(tick, 900);
    }
  }

  /* ---------------------------------------------------------
     4. Scroll-triggered reveal animation
     --------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.project-card, .service-card, .timeline-item, .cert-card, .about-media, .about-content, .contact-info, .contact-form'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window && !reduceMotion){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('in'));
  }

  /* ---------------------------------------------------------
     5. Work / project horizontal scroller arrows
     --------------------------------------------------------- */
  const scroller = document.getElementById('work-scroller');
  const prevBtn = document.getElementById('work-prev');
  const nextBtn = document.getElementById('work-next');

  if (scroller && prevBtn && nextBtn){
    const scrollByCard = () => {
      const card = scroller.querySelector('.project-card');
      return card ? card.getBoundingClientRect().width + 24 : 320;
    };
    prevBtn.addEventListener('click', () => scroller.scrollBy({ left: -scrollByCard(), behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => scroller.scrollBy({ left: scrollByCard(), behavior: 'smooth' }));
  }

  /* ---------------------------------------------------------
     6. Project data + modal
     --------------------------------------------------------- */
  const projectData = {
    1: {
      title: 'Local Business Landing Page',
      category: 'Web Development',
      stack: 'HTML, CSS, JavaScript',
      desc: 'A single-page responsive site built for a local shop, focused on fast load times, clear service information and a simple contact flow that works well on mobile.'
    },
    2: {
      title: 'YouTube Thumbnail Set',
      category: 'Graphic Design',
      stack: 'Photo editing, branding consistency',
      desc: 'A batch of thumbnail designs for a growing channel, kept visually consistent through a repeatable template and colour system.'
    },
    3: {
      title: 'Admissions Form Digitisation',
      category: 'Digital Services',
      stack: 'Data entry, online forms',
      desc: 'Helped a small institute move a paper-based admission process onto simple online forms, with organised digital record-keeping.'
    },
    4: {
      title: 'Personal Portfolio (v1)',
      category: 'Web Development',
      stack: 'HTML, CSS, JavaScript',
      desc: 'An earlier practice build exploring responsive layout techniques and vanilla JavaScript interactivity, used as a stepping stone to this site.'
    }
  };

  const projectModal = document.getElementById('project-modal');
  const projectModalBody = document.getElementById('project-modal-body');

  document.querySelectorAll('.js-project-view').forEach(btn => {
    btn.addEventListener('click', () => {
      const data = projectData[btn.dataset.project];
      if (!data) return;
      projectModalBody.innerHTML = `
        <span class="project-tag">${data.category}</span>
        <h3>${data.title}</h3>
        <p>${data.desc}</p>
        <p class="project-stack">${data.stack}</p>
      `;
      openModal(projectModal);
    });
  });

  /* ---------------------------------------------------------
     7. Service data + modal
     --------------------------------------------------------- */
  const serviceData = {
    design: { title: 'Graphic Design', tasks: ['Posters, banners &amp; flyers', 'Social media graphics', 'Logo &amp; brand basics', 'Print-ready file prep'], process: 'Share your requirements and reference material, receive a draft, request revisions, get final print/web-ready files.' },
    print: { title: 'Printing Services', tasks: ['Colour &amp; black and white printing', 'Document formatting', 'Binding &amp; finishing coordination'], process: 'Send the file or bring a copy, confirm paper/size/quantity, collect the finished prints.' },
    system: { title: 'Windows Installation', tasks: ['Fresh Windows install', 'Driver &amp; update setup', 'Basic software bundle install'], process: 'Back up your data, install and configure Windows, test hardware, hand back a ready-to-use machine.' },
    software: { title: 'Software Installation', tasks: ['Requested application installs', 'License/activation guidance', 'Basic configuration'], process: 'Tell me what you need installed, I install and test it, you confirm everything works.' },
    applications: { title: 'Online Applications', tasks: ['Job &amp; institutional applications', 'Document upload &amp; formatting', 'Submission confirmation'], process: 'Share the application details and documents, I complete and submit the form accurately.' },
    admissions: { title: 'Admissions Assistance', tasks: ['Form filling guidance', 'Document checklist support', 'Submission &amp; follow-up'], process: 'We go through the admission requirements together and complete every step correctly.' },
    forms: { title: 'Online Forms &amp; Card Filling', tasks: ['Registration &amp; record forms', 'Card/ID data filling', 'Accuracy double-checks'], process: 'Provide the details needed, I fill and verify the form or card before submission.' },
    thumbnails: { title: 'YouTube Thumbnail Design', tasks: ['Custom thumbnail design', 'Template &amp; brand consistency', 'Multiple size exports'], process: 'Share the video topic and style preference, receive drafts, approve the final design.' },
    video: { title: 'Video Editing', tasks: ['Trimming &amp; sequencing', 'Basic colour &amp; audio cleanup', 'Simple captions/titles'], process: 'Send raw footage and notes, receive an edited cut, request adjustments if needed.' },
    photo: { title: 'Photo Editing', tasks: ['Retouching', 'Background cleanup', 'Print/web preparation'], process: 'Send the photo and desired outcome, receive the edited version.' },
    repair: { title: 'Computer Repair &amp; Maintenance', tasks: ['Slowdown diagnosis', 'Hardware troubleshooting', 'General upkeep &amp; cleaning'], process: 'Describe the issue, I diagnose and fix it, you get a working machine back.' },
    'printer-repair': { title: 'Printer Repair &amp; Services', tasks: ['Jam &amp; connectivity fixes', 'Print quality troubleshooting', 'Setup for new printers'], process: 'Describe the printer issue, I troubleshoot on-site or remotely, confirm it prints correctly.' },
    mobile: { title: 'Mobile Software Services', tasks: ['App setup &amp; configuration', 'Basic troubleshooting', 'Storage/account guidance'], process: 'Explain the issue, I walk through or perform the fix on your device.' },
    content: { title: 'Movies &amp; Digital Content Services', tasks: ['Sourcing digital content', 'Basic organisation &amp; transfer', 'Format guidance'], process: 'Tell me what you need, I source and prepare the content as requested.' },
    crypto: { title: 'Cryptocurrency Buy &amp; Sell Guidance', tasks: ['Getting started guidance', 'Safe buying/selling walkthrough', 'Basic wallet safety tips'], process: 'We discuss your goal and risk comfort, then go through the process together, step by step.' },
    accounts: { title: 'Digital Accounts Buy &amp; Sell', tasks: ['Safe transaction guidance', 'Account verification support', 'Basic setup after transfer'], process: 'Share what you are looking to buy or sell, I guide you through doing it safely.' }
  };

  const serviceModal = document.getElementById('service-modal');
  const serviceModalBody = document.getElementById('service-modal-body');

  document.querySelectorAll('.js-service-view').forEach(btn => {
    btn.addEventListener('click', () => {
      const data = serviceData[btn.dataset.service];
      if (!data) return;
      serviceModalBody.innerHTML = `
        <h3>${data.title}</h3>
        <h4>What this covers</h4>
        <ul>${data.tasks.map(t => `<li>${t}</li>`).join('')}</ul>
        <h4>How it works</h4>
        <p>${data.process}</p>
        <a href="#contact" class="btn btn-primary" style="margin-top:20px;" data-close-and-scroll>Request This Service</a>
      `;
      openModal(serviceModal);
      const cta = serviceModalBody.querySelector('[data-close-and-scroll]');
      cta.addEventListener('click', () => closeModal(serviceModal));
    });
  });

  /* ---------------------------------------------------------
     8. Certificate modal
     --------------------------------------------------------- */
  const certModal = document.getElementById('cert-modal');
  const certModalBody = document.getElementById('cert-modal-body');

  document.querySelectorAll('.js-cert-view').forEach(card => {
    card.addEventListener('click', () => {
      const { title, org, img } = card.dataset;
      certModalBody.innerHTML = `
        <img src="${img}" alt="${title} certificate" class="modal-body-img" draggable="false" oncontextmenu="return false" onerror="this.style.display='none'">
        <h3>${title}</h3>
        <p style="color:var(--text-low); font-size:0.9rem;">${org}</p>
      `;
      openModal(certModal);
    });
  });

  /* ---------------------------------------------------------
     9. Generic modal open/close helpers
     --------------------------------------------------------- */
  function openModal(modal){
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(modal){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.js-close-modal').forEach(el => {
    el.addEventListener('click', () => {
      const modal = el.closest('.modal');
      if (modal) closeModal(modal);
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape'){
      document.querySelectorAll('.modal.open').forEach(closeModal);
    }
  });

  /* ---------------------------------------------------------
     10. Skills tabs
     --------------------------------------------------------- */
  const skillTabs = document.querySelectorAll('.skills-tab');
  const skillPanels = document.querySelectorAll('.skills-panel');

  skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      skillPanels.forEach(p => p.classList.toggle('active', p.dataset.cat === tab.dataset.cat));
    });
  });

  /* ---------------------------------------------------------
     11. Testimonial carousel
     --------------------------------------------------------- */
  const track = document.getElementById('testimonial-track');
  const dotsWrap = document.getElementById('testimonial-dots');

  if (track && dotsWrap){
    const cards = Array.from(track.children);
    let current = 0;
    let timer = null;

    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(index){
      cards[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + cards.length) % cards.length;
      cards[current].classList.add('active');
      dots[current].classList.add('active');
    }
    goTo(0);

    function startAuto(){
      if (reduceMotion) return;
      timer = setInterval(() => goTo(current + 1), 5000);
    }
    function stopAuto(){ if (timer) clearInterval(timer); }

    track.addEventListener('mouseenter', stopAuto);
    track.addEventListener('mouseleave', startAuto);
    startAuto();
  }

  /* ---------------------------------------------------------
     12. Contact form validation (frontend only)
     --------------------------------------------------------- */
  const form = document.getElementById('contact-form');
  const formNote = document.getElementById('form-note');

  if (form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const fields = [
        { id: 'cf-name', err: 'err-name', message: 'Please enter your name.' },
        { id: 'cf-email', err: 'err-email', message: 'Please enter a valid email address.', type: 'email' },
        { id: 'cf-subject', err: 'err-subject', message: 'Please add a subject.' },
        { id: 'cf-message', err: 'err-message', message: 'Please write a short message.' }
      ];

      fields.forEach(f => {
        const input = document.getElementById(f.id);
        const errEl = document.getElementById(f.err);
        const row = input.closest('.form-row');
        let ok = input.value.trim().length > 0;
        if (ok && f.type === 'email'){
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        }
        row.classList.toggle('invalid', !ok);
        errEl.textContent = ok ? '' : f.message;
        if (!ok) valid = false;
      });

      if (!valid){
        formNote.textContent = 'Please fix the highlighted fields.';
        formNote.classList.remove('success');
        return;
      }

      /* -----------------------------------------------------
         NOTE FOR FUTURE INTEGRATION:
         A static HTML/CSS/JS site cannot send email securely
         on its own. To make this form actually deliver
         messages, connect it to a backend or a form service
         (for example Formspree, EmailJS, or your own server
         endpoint) and replace this block with the real
         submission call. For now this only confirms the form
         is filled in correctly.
      ----------------------------------------------------- */
      formNote.textContent = 'Thanks — your message looks good. Connect a form service or backend to actually deliver it (see comments in script.js).';
      formNote.classList.add('success');
      form.reset();
    });
  }

});
