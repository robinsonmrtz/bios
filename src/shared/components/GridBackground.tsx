export function GridBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage:
          'linear-gradient(rgba(31,143,209,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(31,143,209,0.06) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
        WebkitMaskImage:
          'radial-gradient(ellipse 80% 60% at 50% 20%, black 20%, transparent 75%)',
        maskImage:
          'radial-gradient(ellipse 80% 60% at 50% 20%, black 20%, transparent 75%)',
      }}
    />
  );
}