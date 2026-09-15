export default function Loading() {
  return (
    <main className="route-loading" aria-label="جاري تحميل الصفحة">
      <div className="container">
        <div className="loading-line loading-eyebrow" />
        <div className="loading-line loading-title" />
        <div className="loading-line loading-copy" />
        <div className="loading-grid">
          <div className="loading-card" />
          <div className="loading-card" />
          <div className="loading-card" />
        </div>
      </div>
    </main>
  );
}
