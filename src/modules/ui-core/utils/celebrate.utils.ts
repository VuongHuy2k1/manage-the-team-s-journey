/**
 * Hiệu ứng pháo giấy nhỏ tại chỗ vừa bấm (hoặc giữa màn hình).
 * Dùng cho các thao tác "xong việc": hoàn thành mốc, duyệt lịch, nộp quỹ…
 */
const COLORS = ['#25389A', '#FFC93C', '#12A150', '#F36F21', '#7FB2FF', '#5DDBB4'];
let lastPointer: { x: number; y: number } | null = null;

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointerdown',
    (e) => {
      lastPointer = { x: e.clientX, y: e.clientY };
    },
    { capture: true, passive: true },
  );
}

export function celebrate(options: { count?: number; x?: number; y?: number } = {}) {
  if (typeof document === 'undefined') return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const x = options.x ?? lastPointer?.x ?? window.innerWidth / 2;
  const y = options.y ?? lastPointer?.y ?? window.innerHeight / 2;
  const count = options.count ?? 18;
  const layer = document.createElement('div');
  layer.setAttribute('aria-hidden', 'true');
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:3000;overflow:hidden';
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const dist = 50 + Math.random() * 70;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 40;
    const size = 5 + Math.random() * 5;
    p.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size * (Math.random() > 0.5 ? 1 : 0.5)}px;background:${COLORS[i % COLORS.length]};border-radius:${Math.random() > 0.5 ? '50%' : '2px'}`;
    layer.appendChild(p);
    p.animate(
      [
        { transform: 'translate(-50%,-50%) scale(1) rotate(0deg)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: 0.6 },
        { transform: `translate(calc(-50% + ${dx * 1.1}px), calc(-50% + ${dy + 60}px)) scale(0.6) rotate(${Math.random() * 540}deg)`, opacity: 0 },
      ],
      { duration: 900 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' },
    );
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 1400);
}
