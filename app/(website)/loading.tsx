export default function Loading() {
  const shimmer: React.CSSProperties = {
    background: 'linear-gradient(90deg, rgba(255,255,255,.04), rgba(255,255,255,.09), rgba(255,255,255,.04))',
    backgroundSize: '200% 100%',
    animation: 'shotech-loading 1.2s infinite',
    borderRadius: 10,
  };

  return (
    <main aria-label="جاري تحميل الصفحة" style={{minHeight:'70vh',padding:'90px 0',background:'var(--wb, #07111b)'}}>
      <style>{`@keyframes shotech-loading{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div className="container" style={{width:'min(1180px,92%)',margin:'auto'}}>
        <div style={{...shimmer,width:110,height:12,margin:'0 auto 22px'}} />
        <div style={{...shimmer,width:'min(620px,85%)',height:58,margin:'0 auto 18px'}} />
        <div style={{...shimmer,width:'min(520px,80%)',height:18,margin:'0 auto 55px'}} />
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:18}}>
          {[1,2,3].map((item)=><div key={item} style={{...shimmer,height:220}} />)}
        </div>
      </div>
    </main>
  );
}
