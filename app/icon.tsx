import { ImageResponse } from 'next/og';

export const size    = { width: 32, height: 32 };
export const runtime = 'edge';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width:           '100%',
          height:          '100%',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          background:      '#0b1823',
          borderRadius:    6,
          color:           '#fff',
          fontWeight:      800,
          fontSize:        18,
          fontFamily:      'sans-serif',
          letterSpacing:   '-1px',
        }}
      >
        ST
      </div>
    ),
    size,
  );
}
