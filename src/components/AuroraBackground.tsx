/*
 * Cheap CSS aurora: three transform-animated radial gradients (no `filter: blur`,
 * no blend modes) plus a static vignette. Used on the Hobbies page and as the
 * fallback on the main page when the WebGL shader backdrop is not rendered
 * (reduced-motion users).
 */
const AuroraBackground = () => {
  return (
    <>
      <div className="aurora-bg" aria-hidden>
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: "radial-gradient(ellipse at center, transparent 45%, hsl(222 47% 3% / 0.55) 100%)",
        }}
        aria-hidden
      />
    </>
  );
};

export default AuroraBackground;
