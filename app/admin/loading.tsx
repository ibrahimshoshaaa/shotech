export default function AdminLoading() {
  return (
    <div
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        minHeight:      '60vh',
        gap:            12,
        color:          '#888',
        fontSize:       15,
      }}
    >
      <span
        style={{
          width:        20,
          height:       20,
          border:       '2px solid #ddd',
          borderTop:    '2px solid #111',
          borderRadius: '50%',
          display:      'inline-block',
          animation:    'spin 0.7s linear infinite',
        }}
      />
      جاري التحميل...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
