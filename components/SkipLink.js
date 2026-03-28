'use client';

/**
 * Accessible skip-to-content navigation link.
 * Visually hidden until focused via keyboard, then overlays at top-left.
 * @returns {JSX.Element}
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 'auto',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
      onFocus={(e) => {
        e.target.style.position = 'fixed';
        e.target.style.top = '10px';
        e.target.style.left = '10px';
        e.target.style.width = 'auto';
        e.target.style.height = 'auto';
        e.target.style.padding = '0.75rem 1.5rem';
        e.target.style.background = '#4f8cff';
        e.target.style.color = '#fff';
        e.target.style.zIndex = '9999';
        e.target.style.borderRadius = '8px';
        e.target.style.fontWeight = '600';
      }}
      onBlur={(e) => {
        e.target.style.position = 'absolute';
        e.target.style.left = '-9999px';
      }}
    >
      Skip to main content
    </a>
  );
}
