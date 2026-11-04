(() => {
  const root = document.documentElement;
  if (!root.classList.contains('intro-active')) return;

  const intro = document.getElementById('brand-intro');
  const canvas = document.getElementById('brand-intro-canvas');
  const mark = document.getElementById('brand-intro-mark');
  if (!intro || !canvas || !mark) {
    root.classList.remove('intro-active');
    return;
  }

  let finished = false;
  let frame = 0;
  let watchdog;
  const finish = () => {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(frame);
    clearTimeout(watchdog);
    intro.classList.add('is-leaving');
    window.setTimeout(() => {
      root.classList.remove('intro-active');
      intro.remove();
    }, 340);
  };

  // The site stays usable even if image decoding or animation fails.
  watchdog = window.setTimeout(finish, 1850);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) finish();
  }, { once: true });
  window.addEventListener('pageshow', event => {
    if (event.persisted) finish();
  }, { once: true });

  const start = () => {
    if (finished) return;
    const size = Math.max(1, Math.round(canvas.getBoundingClientRect().width));
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * ratio);
    canvas.height = Math.round(size * ratio);
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return finish();
    context.scale(ratio, ratio);

    const sample = document.createElement('canvas');
    sample.width = 184;
    sample.height = 184;
    const sampleContext = sample.getContext('2d', { willReadFrequently: true });
    if (!sampleContext) return finish();
    try {
      sampleContext.drawImage(mark, 0, 0, 184, 184);
    } catch {
      return finish();
    }
    const pixels = sampleContext.getImageData(0, 0, 184, 184).data;
    const targets = [];
    const step = size < 240 ? 6 : 5;
    for (let y = 5; y < 179; y += step) {
      for (let x = 5; x < 179; x += step) {
        const i = (y * 184 + x) * 4;
        const red = pixels[i];
        const green = pixels[i + 1];
        const blue = pixels[i + 2];
        if (red > green + 11 && green > blue + 9 && red > 75) {
          targets.push({ x: x / 184 * size, y: y / 184 * size });
        }
      }
    }
    if (targets.length < 40) return finish();

    // Sample only a bounded number of particles; smaller screens draw fewer.
    const limit = size < 240 ? 200 : 290;
    const stride = Math.max(1, Math.ceil(targets.length / limit));
    const points = targets.filter((_, index) => index % stride === 0).map((target, index) => {
      const angle = (index * 2.399963229728653) % (Math.PI * 2);
      const radius = size * (.43 + (index % 9) * .045);
      return {
        ...target,
        fromX: size / 2 + Math.cos(angle) * radius,
        fromY: size / 2 + Math.sin(angle) * radius,
        radius: index % 5 === 0 ? 1.7 : 1.15,
      };
    });

    const started = performance.now();
    const duration = 1050;
    const draw = now => {
      if (finished) return;
      const t = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      context.clearRect(0, 0, size, size);
      context.shadowColor = 'rgba(244, 191, 110, .75)';
      context.shadowBlur = 5;
      context.fillStyle = `rgba(245, 197, 120, ${Math.min(1, .28 + t * .82)})`;
      for (const point of points) {
        const x = point.fromX + (point.x - point.fromX) * eased;
        const y = point.fromY + (point.y - point.fromY) * eased;
        context.beginPath();
        context.arc(x, y, point.radius, 0, Math.PI * 2);
        context.fill();
      }
      if (t < 1) frame = requestAnimationFrame(draw);
      else window.setTimeout(finish, 260);
    };
    frame = requestAnimationFrame(draw);
  };

  if (mark.complete && mark.naturalWidth) start();
  else {
    mark.addEventListener('load', start, { once: true });
    mark.addEventListener('error', finish, { once: true });
  }
})();
