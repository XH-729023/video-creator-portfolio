import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  createIcons,
  ArrowDownRight,
  ArrowUp,
  ArrowUpRight,
  Copy,
  X,
} from 'lucide';

gsap.registerPlugin(ScrollTrigger);
createIcons({ icons: { ArrowDownRight, ArrowUp, ArrowUpRight, Copy, X } });

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

const projects = {
  neon: {
    title: 'NEON PULSE',
    kicker: 'MUSIC FILM / 2026',
    intro: '把一场现场演出压缩成两分钟的电流：先让声音建立空间，再让光线打破它。',
    facts: [
      ['ROLE', 'Creative direction / Edit'],
      ['SCOPE', 'Concept / Film / Grade'],
      ['FORMAT', 'Hero film / Social cutdowns'],
      ['DURATION', '02:14'],
    ],
    idea: '以“脉冲”作为贯穿全片的视觉规则。画面不追求完整记录演出，而是捕捉音乐最接近失控的瞬间。',
    approach: '现场使用低照度与高反差灯光建立层次，后期以鼓点驱动剪辑，在冷色空间中保留少量高饱和霓虹。',
  },
  afterimage: {
    title: 'AFTERIMAGE',
    kicker: 'FASHION FILM / 2025',
    intro: '关于身体、服装与残像的一次短暂实验，让每个动作在离开画面后仍然继续发生。',
    facts: [
      ['ROLE', 'Director / Editor'],
      ['SCOPE', 'Treatment / Shoot / Post'],
      ['FORMAT', 'Campaign film / Vertical edits'],
      ['DURATION', '00:47'],
    ],
    idea: '将服装的轮廓看作运动留下的证据，通过重复、错位和短暂曝光，让静态造型产生持续向前的力量。',
    approach: '摄影机保持克制，主要变化来自人物动作和光源。剪辑使用帧间叠化与速度变化制造记忆残留感。',
  },
  liminal: {
    title: 'LIMINAL',
    kicker: 'CAMPAIGN / 2025',
    intro: '一支发生在边界空间里的品牌影像：人物始终在抵达之前，也始终在离开之后。',
    facts: [
      ['ROLE', 'Visual direction'],
      ['SCOPE', 'Concept / Direction / Motion'],
      ['FORMAT', 'Campaign film / Stills'],
      ['DURATION', '01:08'],
    ],
    idea: '用走廊、幕布和不可见的出口构成没有明确时间的空间，让产品不依赖情节，而依赖氛围被记住。',
    approach: '通过固定构图与缓慢移动制造张力，使用材质、阴影和留白建立统一视觉，并为平面物料同步设计关键帧。',
  },
  dawn: {
    title: 'SYNTHETIC DAWN',
    kicker: 'SHORT FILM / 2024',
    intro: '在一座尚未醒来的城市里，真实日出与人造光第一次变得难以区分。',
    facts: [
      ['ROLE', 'Director / Co-writer'],
      ['SCOPE', 'Development / Production / Post'],
      ['FORMAT', 'Narrative short'],
      ['DURATION', '08:32'],
    ],
    idea: '以清晨作为人物关系的临界点。故事不解释城市为何改变，而是让光线、噪声和空旷街道逐步暴露这种变化。',
    approach: '在真实黎明前后完成主要拍摄，用有限色温区分自然与人造光源；声音设计承担画外世界的叙事。',
  },
};

function initPageMotion() {
  if (reducedMotion) return;

  gsap.timeline({ defaults: { ease: 'power4.out' } })
    .from('.line > span', { yPercent: 115, duration: 1.35, stagger: 0.11, delay: 0.2 })
    .from('.reveal', { opacity: 0, y: 20, duration: 0.8, stagger: 0.12 }, '-=0.75');

  gsap.to('.hero-media', {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.hero-copy', {
    yPercent: -22,
    opacity: 0.25,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: '45% top', end: 'bottom top', scrub: true },
  });
  gsap.to('.orbit-word', {
    xPercent: -32,
    ease: 'none',
    scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: 1 },
  });
  gsap.from('.manifesto-text', {
    y: 100,
    opacity: 0,
    rotation: 2,
    duration: 1.2,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.manifesto-text', start: 'top 82%' },
  });
  gsap.from('.about-copy', {
    y: 60,
    opacity: 0,
    duration: 1,
    scrollTrigger: { trigger: '.about-copy', start: 'top 88%' },
  });
  document.querySelectorAll('.project').forEach((project, index) => {
    gsap.from(project, {
      y: index % 2 ? 130 : 90,
      rotation: index % 2 ? 1.2 : -0.8,
      opacity: 0,
      duration: 1.25,
      ease: 'power3.out',
      scrollTrigger: { trigger: project, start: 'top 88%' },
    });
  });
  gsap.from('.process li', {
    y: 50,
    opacity: 0,
    stagger: 0.12,
    duration: 0.8,
    scrollTrigger: { trigger: '.process ol', start: 'top 85%' },
  });
}

async function initFluid() {
  const canvas = document.querySelector('#fluid');
  if (reducedMotion || !canvas) return;

  try {
    const { createFluidScene } = await import('./fluid.js');
    const fluid = createFluidScene(canvas);
    gsap.to(fluid.blob.position, {
      x: -1.5,
      y: 0.5,
      ease: 'none',
      scrollTrigger: { trigger: '.works', start: 'top bottom', end: 'bottom top', scrub: 1.3 },
    });
    const handlePageHide = (event) => {
      if (event.persisted) return;
      fluid.destroy();
      window.removeEventListener('pagehide', handlePageHide);
    };
    window.addEventListener('pagehide', handlePageHide);
  } catch (error) {
    canvas.hidden = true;
    console.warn('WebGL background unavailable; continuing with the static layout.', error);
  }
}

const menuButton = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
const menuLinks = [...menu.querySelectorAll('a')];
const main = document.querySelector('main');
const brand = document.querySelector('.brand');

function setMenu(open, returnFocus = true) {
  menu.classList.toggle('open', open);
  menuButton.classList.toggle('active', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
  menu.setAttribute('aria-hidden', String(!open));
  menu.inert = !open;
  main.inert = open;
  brand.inert = open;
  document.body.classList.toggle('menu-open', open);

  if (open) {
    requestAnimationFrame(() => menuLinks[0].focus());
  } else if (returnFocus) {
    menuButton.focus();
  }
}

menuButton.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
menuLinks.forEach((link) => link.addEventListener('click', () => setMenu(false, false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.classList.contains('open')) {
    setMenu(false);
    return;
  }
  if (event.key !== 'Tab' || !menu.classList.contains('open')) return;

  const focusable = [menuButton, ...menuLinks];
  const current = focusable.indexOf(document.activeElement);
  const next = event.shiftKey
    ? (current <= 0 ? focusable.length - 1 : current - 1)
    : (current + 1) % focusable.length;
  event.preventDefault();
  focusable[next].focus();
});

const dialog = document.querySelector('#project-dialog');
const dialogImage = dialog.querySelector('.dialog-media img');
const dialogTitle = dialog.querySelector('#dialog-title');
const dialogKicker = dialog.querySelector('.dialog-kicker');
const dialogIntro = dialog.querySelector('.dialog-intro');
const dialogFacts = dialog.querySelector('.dialog-facts');
const dialogIdea = dialog.querySelector('[data-field="idea"]');
const dialogApproach = dialog.querySelector('[data-field="approach"]');
let projectTrigger = null;

function renderFacts(facts) {
  dialogFacts.replaceChildren(...facts.map(([label, value]) => {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = label;
    description.textContent = value;
    row.append(term, description);
    return row;
  }));
}

function openProject(button) {
  const project = projects[button.dataset.project];
  if (!project) return;

  const sourceImage = button.querySelector('img');
  projectTrigger = button;
  dialogImage.src = sourceImage.currentSrc || sourceImage.src;
  dialogImage.alt = sourceImage.alt;
  dialogTitle.textContent = project.title;
  dialogKicker.textContent = project.kicker;
  dialogIntro.textContent = project.intro;
  dialogIdea.textContent = project.idea;
  dialogApproach.textContent = project.approach;
  renderFacts(project.facts);
  cursor.classList.remove('view');
  document.body.classList.add('dialog-open');
  dialog.showModal();
  dialog.scrollTop = 0;
}

document.querySelectorAll('[data-project]').forEach((button) => {
  button.addEventListener('click', () => openProject(button));
});
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  cursor.classList.remove('view');
  projectTrigger?.focus();
});

const cursor = document.querySelector('.cursor');
if (finePointer && !reducedMotion) {
  window.addEventListener('pointermove', (event) => {
    gsap.to(cursor, { x: event.clientX, y: event.clientY, duration: 0.16, ease: 'power2.out' });
  });
  document.querySelectorAll('.cursor-view').forEach((element) => {
    element.addEventListener('mouseenter', () => cursor.classList.add('view'));
    element.addEventListener('mouseleave', () => cursor.classList.remove('view'));
  });
  document.querySelectorAll('.magnetic').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const bounds = element.getBoundingClientRect();
      gsap.to(element, {
        x: (event.clientX - bounds.left - bounds.width / 2) * 0.22,
        y: (event.clientY - bounds.top - bounds.height / 2) * 0.22,
        duration: 0.35,
      });
    });
    element.addEventListener('pointerleave', () => {
      gsap.to(element, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,.35)' });
    });
  });
}

async function copyEmail(button) {
  const email = button.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = email;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }

  const label = button.querySelector('span');
  label.textContent = '已复制';
  window.setTimeout(() => { label.textContent = '复制邮箱'; }, 1800);
}

document.querySelector('.copy-email').addEventListener('click', (event) => copyEmail(event.currentTarget));
document.querySelector('.to-top').addEventListener('click', () => {
  scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
});

initPageMotion();
if ('requestIdleCallback' in window) {
  window.requestIdleCallback(initFluid, { timeout: 800 });
} else {
  window.setTimeout(initFluid, 200);
}
