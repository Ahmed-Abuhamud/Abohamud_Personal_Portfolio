// Portfolio interactions: galleries, launch-film modal, copy-email, reveal-on-scroll.
// Gallery images live in ./media/shots/<project>/ — captions match what each shot shows.
import './clouds.js';

const GALLERIES = {
  novapos: [
    { src: './media/shots/novapos/01-pos-initial.png', cap: 'Cashier register — empty basket', device: 'desktop' },
    { src: './media/shots/novapos/02-pos-colors.png', cap: 'Register with category color coding', device: 'desktop' },
    { src: './media/shots/novapos/03-basket.png', cap: 'Basket with items and totals', device: 'desktop' },
    { src: './media/shots/novapos/04-after-charge-click.png', cap: 'Charge flow', device: 'desktop' },
    { src: './media/shots/novapos/05-success.png', cap: 'Sale success screen', device: 'desktop' },
    { src: './media/shots/novapos/06-admin-gate.png', cap: 'Password-gated admin entry', device: 'desktop' },
    { src: './media/shots/novapos/07-dashboard.png', cap: 'Admin dashboard', device: 'desktop' },
    { src: './media/shots/novapos/08-dashboard-charts.png', cap: 'Sales analytics charts (Recharts)', device: 'desktop' },
    { src: './media/shots/novapos/09-products.png', cap: 'Product catalog', device: 'desktop' },
    { src: './media/shots/novapos/10-product-edit.png', cap: 'Product editor', device: 'desktop' },
    { src: './media/shots/novapos/11-transactions.png', cap: 'Transactions log', device: 'desktop' },
    { src: './media/shots/novapos/12-receipts.png', cap: 'Receipt-photo gallery', device: 'desktop' },
    { src: './media/shots/novapos/13-receipt-viewer.png', cap: 'Receipt viewer', device: 'desktop' },
    { src: './media/shots/novapos/14-mobile-pos.png', cap: 'Register on a phone', device: 'mobile' },
    { src: './media/shots/novapos/15-mobile-basket-sheet.png', cap: 'Mobile basket sheet', device: 'mobile' },
    { src: './media/shots/novapos/16-mobile-transfer.png', cap: 'Mobile transfer flow', device: 'mobile' },
    { src: './media/shots/novapos/17-offline-sale.png', cap: 'Offline sale handling', device: 'mobile' },
    { src: './media/shots/novapos/18-mobile-admin.png', cap: 'Admin panel on mobile', device: 'mobile' },
    { src: './media/shots/novapos/19-mobile-admin-tabs.png', cap: 'Mobile admin tabs', device: 'mobile' },
    { src: './media/shots/novapos/20-history.png', cap: 'Sales history', device: 'mobile' },
    { src: './media/shots/novapos/21-final-desktop.png', cap: 'Full register — final desktop pass', device: 'desktop' },
  ],
  chromaflow: [
    { src: './media/shots/chromaflow/desktop.png', cap: 'Day view — quarter-hour circles & Pomodoro', device: 'desktop' },
    { src: './media/shots/chromaflow/mobile.png', cap: 'Day view on a phone', device: 'mobile' },
    { src: './media/shots/chromaflow/check1.png', cap: 'Chromaflow brand splash', device: 'desktop' },
    { src: './media/shots/chromaflow/check2.png', cap: 'A fresh year — empty rings waiting to be painted', device: 'desktop' },
    { src: './media/shots/chromaflow/check3.png', cap: 'The painted canvas — five life-domain colors', device: 'desktop' },
    { src: './media/shots/chromaflow/check4.png', cap: '“Start painting today” — local-first, offline, no account', device: 'desktop' },
    { src: './media/shots/chromaflow/ar-check-1.8.png', cap: 'Arabic onboarding (RTL)', device: 'desktop', rtl: true },
    { src: './media/shots/chromaflow/ar-check-7.6.png', cap: 'لونها بما يهمّك — paint the year with what matters', device: 'desktop', rtl: true },
    { src: './media/shots/chromaflow/ar-check-13.2.png', cap: 'كروما فلو — ابدأ الرسم اليوم، محليًا دون اتصال', device: 'desktop', rtl: true },
  ],
  enjazatec: [
    { src: './media/shots/enjazatec-app/desktop.png', cap: 'Habit garden — night scene with the focus timer', device: 'desktop' },
    { src: './media/shots/enjazatec-app/mobile.png', cap: 'Habit garden on a phone', device: 'mobile' },
    { src: './media/shots/enjazatec/still-2.00s.png', cap: 'Launch reel — “إنجازاتك تنمو هنا”', device: 'mobile', rtl: true },
    { src: './media/shots/enjazatec/still-10.00s.png', cap: 'Launch reel — night garden, tasks & Pomodoro', device: 'mobile' },
    { src: './media/shots/enjazatec/still-14.00s.png', cap: 'Launch reel — fireflies over the garden', device: 'mobile' },
    { src: './media/shots/enjazatec/still-22.00s.png', cap: 'Launch reel — the private finance ledger (المحاسبة)', device: 'mobile', rtl: true },
    { src: './media/launches/enjazatec/frames/f4-growth-burst.png', cap: 'Launch-page frame — growth burst', device: 'mobile' },
  ],
  labatak: [
    { src: './media/shots/labatak/desktop.png', cap: 'Game picker — six games, Arabic-first', device: 'desktop' },
    { src: './media/shots/labatak/mobile.png', cap: 'Game picker on a phone', device: 'mobile' },
  ],
  school: [
    { src: './media/shots/school/desktop.png', cap: 'Dashboard — stats, critical alerts and 24 class tiles', device: 'desktop' },
    { src: './media/shots/school/mobile.png', cap: 'Dashboard on a phone with bottom-tab navigation', device: 'mobile' },
  ],
};

const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCap = document.getElementById('lb-cap');
const lbCount = document.getElementById('lb-count');
let currentList = [];
let currentIndex = 0;

function openGallery(key) {
  currentList = GALLERIES[key] || [];
  currentIndex = 0;
  renderSlide();
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}

function renderSlide() {
  const slide = currentList[currentIndex];
  if (!slide) return;
  lbImg.src = slide.src;
  lbImg.alt = slide.cap;
  lbCap.textContent = slide.cap;
  lbCap.dir = slide.rtl ? 'rtl' : 'ltr';
  lbCount.textContent = `${currentIndex + 1} / ${currentList.length}`;
}

function moveSlide(step) {
  if (!currentList.length) return;
  currentIndex = (currentIndex + step + currentList.length) % currentList.length;
  renderSlide();
}

function closeLightbox() {
  lightbox.hidden = true;
  lbImg.src = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-gallery]').forEach((btn) =>
  btn.addEventListener('click', () => openGallery(btn.dataset.gallery))
);
lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lb-prev').addEventListener('click', () => moveSlide(-1));
lightbox.querySelector('.lb-next').addEventListener('click', () => moveSlide(1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

// ---- Launch film modal ----
const videoModal = document.getElementById('video-modal');
const vmPlayer = document.getElementById('vm-player');

document.querySelectorAll('[data-video]').forEach((btn) =>
  btn.addEventListener('click', () => {
    vmPlayer.src = btn.dataset.video;
    videoModal.hidden = false;
    document.body.style.overflow = 'hidden';
    vmPlayer.play().catch(() => { /* autoplay may be blocked — controls still work */ });
  })
);

function closeVideo() {
  vmPlayer.pause();
  vmPlayer.src = '';
  videoModal.hidden = true;
  document.body.style.overflow = '';
}
videoModal.querySelector('.vm-close').addEventListener('click', closeVideo);
videoModal.addEventListener('click', (e) => { if (e.target === videoModal) closeVideo(); });

// ---- Keyboard ----
document.addEventListener('keydown', (e) => {
  if (!lightbox.hidden) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') moveSlide(-1);
    if (e.key === 'ArrowRight') moveSlide(1);
  } else if (!videoModal.hidden && e.key === 'Escape') {
    closeVideo();
  }
});

// ---- Copy email ----
const toast = document.getElementById('toast');
const copyBtn = document.getElementById('copy-email');
copyBtn.addEventListener('click', async () => {
  const email = copyBtn.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
  } catch {
    const tmp = document.createElement('textarea');
    tmp.value = email;
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    tmp.remove();
  }
  toast.hidden = false;
  setTimeout(() => { toast.hidden = true; }, 1800);
});

// ---- Reveal on scroll ----
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
