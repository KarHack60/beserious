// ===============================
// Beserious Front-End Scripts
// ===============================

// Smooth scroll is handled via CSS: html { scroll-behavior: smooth; }

// Sticky navbar: mobile toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close nav when clicking a link (on mobile)
  navLinks.addEventListener('click', (event) => {
    if (event.target.tagName.toLowerCase() === 'a') {
      navToggle.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}

// Intersection Observer for fade-in animations
const fadeEls = document.querySelectorAll('.fade-in');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18
    }
  );

  fadeEls.forEach((el) => observer.observe(el));
} else {
  // Fallback for very old browsers
  fadeEls.forEach((el) => el.classList.add('visible'));
}

// Dynamic year in footer
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ===============================
// Contact Form Handling
// Default: Formspree (no JS required to send)
// Below: optional JS to show nicer feedback.
// ===============================

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (event) => {
    // Comment out the next two lines if you prefer
    // the default browser submission directly to Formspree.
    event.preventDefault();
    formStatus.textContent = 'Sending...';

    try {
      const formData = new FormData(contactForm);

      // IMPORTANT:
      // Make sure the <form> "action" attribute in index.html
      // is set to your real Formspree endpoint.
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json'
        }
      });

      if (response.ok) {
        contactForm.reset();
        formStatus.textContent = 'Thank you. We have received your inquiry.';
        formStatus.style.color = '#33c0ff';
      } else {
        formStatus.textContent =
          'Something went wrong. Please try again or email us directly.';
        formStatus.style.color = '#ff6b81';
      }
    } catch (error) {
      formStatus.textContent =
        'Unable to send right now. Please check your connection and try again.';
      formStatus.style.color = '#ff6b81';
    }
  });
}

/*
  Optional: EmailJS Integration (if you prefer it instead of Formspree)
  ---------------------------------------------------------------------
  1. Include the EmailJS SDK in index.html before this script, for example:
     <script src="https://cdn.emailjs.com/sdk/3.11.0/email.min.js"></script>

  2. Initialize EmailJS here by uncommenting and filling your PUBLIC KEY:

     emailjs.init('YOUR_EMAILJS_PUBLIC_KEY'); // <-- paste your public key here

  3. Replace the Formspree fetch logic above with something like:

     const templateParams = {
       name: formData.get('name'),
       email: formData.get('email'),
       company: formData.get('company'),
       project_type: formData.get('project_type'),
       budget: formData.get('budget'),
       message: formData.get('message')
     };

     emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
       .then(() => {
         contactForm.reset();
         formStatus.textContent = 'Thank you. We have received your inquiry.';
         formStatus.style.color = '#33c0ff';
       })
       .catch(() => {
         formStatus.textContent = 'Something went wrong. Please try again.';
         formStatus.style.color = '#ff6b81';
       });

  4. With EmailJS, you no longer need the "action" attribute on the <form>.
     EmailJS will route submissions to your configured email.
*/