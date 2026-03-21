type Teardown = () => void;

const INTERACTIVE_SELECTOR =
  'a,button,[role="button"],input,select,textarea,.vp-project-card,.vp-article-item';

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  return !!target.closest("input, textarea, [contenteditable='true']");
};

const setupCustomCursor = (teardowns: Teardown[]): void => {
  const canUseCustomCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!canUseCustomCursor) return;

  const root = document.documentElement;
  root.classList.add("has-custom-cursor");

  const dot = document.createElement("div");
  dot.className = "ghlg-cursor-dot";
  const ring = document.createElement("div");
  ring.className = "ghlg-cursor-ring";
  document.body.append(dot, ring);

  let targetX = -100;
  let targetY = -100;
  let ringX = -100;
  let ringY = -100;
  let hovering = false;
  let rafId = 0;

  const moveCursor = (event: MouseEvent): void => {
    targetX = event.clientX;
    targetY = event.clientY;
    dot.style.opacity = "1";
    ring.style.opacity = "1";
  };

  const updateHover = (event: MouseEvent): void => {
    if (!(event.target instanceof HTMLElement)) return;
    const target = event.target;
    hovering =
      !!target.closest(INTERACTIVE_SELECTOR) || window.getComputedStyle(target).cursor === "pointer";
  };

  const hideCursor = (): void => {
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  };

  const render = (): void => {
    ringX += (targetX - ringX) * 0.18;
    ringY += (targetY - ringY) * 0.18;

    dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%) scale(${
      hovering ? 0 : 1
    })`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${
      hovering ? 1.45 : 1
    })`;
    ring.style.background = hovering ? "rgba(255, 213, 79, 0.22)" : "transparent";

    rafId = window.requestAnimationFrame(render);
  };

  window.addEventListener("mousemove", moveCursor);
  window.addEventListener("mouseover", updateHover);
  window.addEventListener("mouseleave", hideCursor);
  rafId = window.requestAnimationFrame(render);

  teardowns.push(() => {
    window.removeEventListener("mousemove", moveCursor);
    window.removeEventListener("mouseover", updateHover);
    window.removeEventListener("mouseleave", hideCursor);
    window.cancelAnimationFrame(rafId);
    dot.remove();
    ring.remove();
    root.classList.remove("has-custom-cursor");
  });
};

type Particle = {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  angle: number;
  spin: number;
  color: string;
  opacity: number;
};

const setupParticleBackground = (teardowns: Teardown[]): void => {
  if (document.querySelector(".ghlg-particle-bg")) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const canvas = document.createElement("canvas");
  canvas.className = "ghlg-particle-bg";
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  document.documentElement.classList.add("ghlg-has-particles");
  document.body.prepend(canvas);

  const mouse = { x: -1000, y: -1000 };
  const colors = ["#FFD54F", "#FFCA28", "#FFC107", "#FFE082", "#FFF9C4"];
  let particles: Particle[] = [];
  let rafId = 0;

  const createParticle = (x?: number, y?: number): Particle => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
      x: x ?? Math.random() * canvas.width,
      y: y ?? Math.random() * canvas.height,
      size: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 1.2,
      speedY: Math.random() * 1.3 + 0.4,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.045,
      color,
      opacity: Math.random() * 0.5 + 0.35,
    };
  };

  const initParticles = (): void => {
    particles = [];
    const divisor = 32000;
    const count = Math.max(24, Math.floor((window.innerWidth * window.innerHeight) / divisor));
    for (let i = 0; i < count; i += 1) particles.push(createParticle());
  };

  const resize = (): void => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  };

  const drawParticle = (particle: Particle): void => {
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.angle);
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = particle.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = particle.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, particle.size * 1.45, particle.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const update = (): void => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const particle of particles) {
      const dx = mouse.x - particle.x;
      const dy = mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 130) {
        const force = (130 - distance) / 130;
        const safeDistance = Math.max(distance, 1);
        particle.speedX -= (dx / safeDistance) * force * 0.7;
        particle.speedY -= (dy / safeDistance) * force * 0.7;
      }

      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.angle += particle.spin;

      particle.speedX += (Math.random() - 0.5) * 0.08;
      particle.speedX *= 0.95;
      if (particle.speedY < 0.4) particle.speedY += 0.04;
      if (particle.speedY > 2.2) particle.speedY *= 0.94;

      if (particle.y > canvas.height + 20) {
        particle.y = -20;
        particle.x = Math.random() * canvas.width;
        particle.speedX = (Math.random() - 0.5) * 1.2;
      }
      if (particle.x > canvas.width + 20) particle.x = -20;
      if (particle.x < -20) particle.x = canvas.width + 20;

      drawParticle(particle);
    }

    rafId = window.requestAnimationFrame(update);
  };

  const handleMouseMove = (event: MouseEvent): void => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  };

  const handleMouseLeave = (): void => {
    mouse.x = -1000;
    mouse.y = -1000;
  };

  const handleMouseClick = (event: MouseEvent): void => {
    const burstCount = 6;
    for (let i = 0; i < burstCount; i += 1) {
      const particle = createParticle(event.clientX, event.clientY);
      particle.speedX = (Math.random() - 0.5) * 12;
      particle.speedY = (Math.random() - 0.5) * 12;
      particles.push(particle);
    }

    const maxParticles = 110;
    if (particles.length > maxParticles) particles.splice(0, burstCount);
  };

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseleave", handleMouseLeave);
  window.addEventListener("click", handleMouseClick);
  resize();
  rafId = window.requestAnimationFrame(update);

  teardowns.push(() => {
    window.removeEventListener("resize", resize);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseleave", handleMouseLeave);
    window.removeEventListener("click", handleMouseClick);
    window.cancelAnimationFrame(rafId);
    canvas.remove();
    document.documentElement.classList.remove("ghlg-has-particles");
  });
};

const setupContextMenu = (teardowns: Teardown[]): void => {
  const menu = document.createElement("div");
  menu.className = "ghlg-context-menu";
  menu.innerHTML = `
    <div class="ghlg-context-menu__header">Site Menu</div>
    <button type="button" data-action="top">回到顶部</button>
    <button type="button" data-action="home">前往主页</button>
    <button type="button" data-action="intro">关于我</button>
    <button type="button" data-action="copy">复制当前链接</button>
    <button type="button" data-action="theme">切换明暗主题</button>
  `;

  document.body.append(menu);

  const setVisible = (visible: boolean): void => {
    menu.dataset.open = visible ? "true" : "false";
  };

  const positionMenu = (x: number, y: number): void => {
    const padding = 12;
    const width = menu.offsetWidth || 240;
    const height = menu.offsetHeight || 280;
    const maxX = window.innerWidth - width - padding;
    const maxY = window.innerHeight - height - padding;
    const safeX = Math.max(padding, Math.min(x, maxX));
    const safeY = Math.max(padding, Math.min(y, maxY));
    menu.style.left = `${safeX}px`;
    menu.style.top = `${safeY}px`;
  };

  const handleContextMenu = (event: MouseEvent): void => {
    if (isEditableTarget(event.target)) return;
    event.preventDefault();
    setVisible(true);
    positionMenu(event.clientX, event.clientY);
  };

  const closeMenu = (): void => setVisible(false);

  const handleMenuClick = async (event: MouseEvent): Promise<void> => {
    const target = event.target as HTMLElement | null;
    const button = target?.closest("button[data-action]") as HTMLButtonElement | null;
    if (!button) return;

    const action = button.dataset.action;
    if (action === "top") window.scrollTo({ top: 0, behavior: "smooth" });
    if (action === "home") window.location.href = "/";
    if (action === "intro") window.location.href = "/intro.html";
    if (action === "copy") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        button.textContent = "链接已复制";
        window.setTimeout(() => {
          button.textContent = "复制当前链接";
        }, 1200);
      } catch {
        button.textContent = "复制失败";
        window.setTimeout(() => {
          button.textContent = "复制当前链接";
        }, 1200);
      }
    }
    if (action === "theme") {
      const html = document.documentElement;
      const current = html.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      localStorage.setItem("vuepress-theme-hope-scheme", next);
      localStorage.setItem("theme", next);
    }
    closeMenu();
  };

  window.addEventListener("contextmenu", handleContextMenu);
  window.addEventListener("click", closeMenu);
  window.addEventListener("scroll", closeMenu, { passive: true });
  window.addEventListener("resize", closeMenu);
  menu.addEventListener("click", handleMenuClick as EventListener);

  teardowns.push(() => {
    window.removeEventListener("contextmenu", handleContextMenu);
    window.removeEventListener("click", closeMenu);
    window.removeEventListener("scroll", closeMenu);
    window.removeEventListener("resize", closeMenu);
    menu.removeEventListener("click", handleMenuClick as EventListener);
    menu.remove();
  });
};

const setupCustomFooter = (teardowns: Teardown[]): void => {
  if (document.querySelector(".ghlg-custom-footer")) return;

  const year = new Date().getFullYear();
  document.documentElement.classList.add("ghlg-footer-replaced");

  const footer = document.createElement("footer");
  footer.className = "ghlg-custom-footer";
  footer.innerHTML = `
    <div class="ghlg-custom-footer__inner">
      <div class="ghlg-custom-footer__left">
        <p class="ghlg-custom-footer__copyright">Made with © ${year} 桂花拉糕</p>
        <div class="ghlg-custom-footer__contact">
          <a href="mailto:guihualagao@gmail.com">guihualagao@gmail.com</a>
          <span>+86 158-5717-8329</span>
        </div>
      </div>
      <div class="ghlg-custom-footer__right">
        <a class="ghlg-custom-footer__blog" href="https://game-developer-portfolio-tau.vercel.app/" target="_blank" rel="noopener noreferrer">Portfolio</a>
        <div class="ghlg-custom-footer__socials">
          <a href="https://github.com/guihuala" target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.6v-2.1c-3.4.7-4.1-1.5-4.1-1.5-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.7-2.7-.3-5.5-1.4-5.5-6.1 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.3 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.8-2.9 5.8-5.6 6.1.4.4.8 1.1.8 2.2v3.2c0 .4.2.7.8.6A12 12 0 0 0 12 .5z"/></svg>
          </a>
          <a href="https://twitter.com/mokukeki" target="_blank" rel="noopener noreferrer" title="Twitter / X" aria-label="Twitter / X">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23 22h-6.3l-4.9-6.4L6.2 22H3l7.3-8.3L1 2h6.5l4.4 5.8L18.9 2zm-1.1 18h1.8L6.5 3.9H4.6L17.8 20z"/></svg>
          </a>
          <a href="https://space.bilibili.com/39258274" target="_blank" rel="noopener noreferrer" title="Bilibili" aria-label="Bilibili">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.2 4.3 6.7 2.9a1 1 0 1 0-1.4 1.4l1.5 1.4H5a3 3 0 0 0-3 3v8.3a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V8.7a3 3 0 0 0-3-3h-1.8l1.5-1.4a1 1 0 1 0-1.4-1.4l-1.5 1.4h-7.6zm-1.7 5.2a1.1 1.1 0 0 1 1.1 1.1v2.8a1.1 1.1 0 1 1-2.2 0v-2.8a1.1 1.1 0 0 1 1.1-1.1zm11 0a1.1 1.1 0 0 1 1.1 1.1v2.8a1.1 1.1 0 1 1-2.2 0v-2.8a1.1 1.1 0 0 1 1.1-1.1zM9 17h6a1 1 0 1 0 0-2H9a1 1 0 1 0 0 2z"/></svg>
          </a>
          <a href="https://guihuala.itch.io/" target="_blank" rel="noopener noreferrer" title="Itch.io" aria-label="Itch.io">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 9.1c.2-.7.8-1.2 1.6-1.2h14c.8 0 1.5.5 1.6 1.2l1 4.6a1.7 1.7 0 0 1-1.7 2.1h-1.1v2a2 2 0 0 1-2 2h-1.3a2 2 0 0 1-2-2v-2h-3a2 2 0 0 1-2 2H7.2a2 2 0 0 1-2-2v-2H4.1a1.7 1.7 0 0 1-1.7-2.1l1-4.6zm2.8-2.6a2.2 2.2 0 1 1 4.4 0h2.8a2.2 2.2 0 1 1 4.4 0h1.5v-.8a2.8 2.8 0 0 0-2.8-2.8H7.5a2.8 2.8 0 0 0-2.8 2.8v.8h1.5z"/></svg>
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.append(footer);
  teardowns.push(() => {
    document.documentElement.classList.remove("ghlg-footer-replaced");
    footer.remove();
  });
};

export const setupDesktopEffects = (): Teardown => {
  const teardowns: Teardown[] = [];
  setupParticleBackground(teardowns);
  setupCustomCursor(teardowns);
  setupContextMenu(teardowns);
  setupCustomFooter(teardowns);
  return () => {
    for (const teardown of teardowns) teardown();
  };
};
