import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Bits&Bytes - 1500+ Teen Builders | High-Impact Execution'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0b1220 0%, #16223a 50%, #28184a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          position: 'relative',
          padding: '52px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'radial-gradient(circle at 18% 20%, rgba(63, 225, 255, 0.22) 0%, transparent 36%), radial-gradient(circle at 82% 10%, rgba(255, 120, 180, 0.2) 0%, transparent 42%), radial-gradient(circle at 50% 90%, rgba(131, 102, 255, 0.22) 0%, transparent 40%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: '28px',
            borderRadius: '28px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            zIndex: 10,
            padding: '22px 20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #2fe2ff, #7f67ff 60%, #ff6dad)',
                color: '#0c1020',
                fontSize: '24px',
                fontWeight: 900,
              }}
            >
              B&B
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ fontSize: '20px', color: '#c6d6ff', letterSpacing: '2px' }}>
                INDIA'S TEEN-LED CODE CLUB
              </div>
              <div style={{ fontSize: '46px', fontWeight: 850, lineHeight: 1.05 }}>
                Bits&Bytes
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <div
              style={{
                fontSize: '56px',
                fontWeight: 900,
                lineHeight: 1.08,
                maxWidth: '1020px',
                letterSpacing: '-1px',
              }}
            >
              Building India&apos;s next generation of founders, engineers, and problem solvers.
            </div>

            <div
              style={{
                fontSize: '26px',
                color: '#d7e4ff',
                maxWidth: '1020px',
                lineHeight: 1.3,
              }}
            >
              High-agency community. Real products. Real velocity. Real outcomes.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '14px',
              alignItems: 'stretch',
            }}
          >
            {[
              { label: 'Community Size', value: '1500+', note: 'Teen builders across India' },
              { label: 'Submission Ops', value: '2700+', note: 'Participant submissions evaluated' },
              { label: 'Execution Speed', value: '900/day', note: 'Reviewed in a 3-day sprint' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  flex: 1,
                  borderRadius: '16px',
                  padding: '16px 18px',
                  background: 'rgba(14, 20, 38, 0.62)',
                  border: '1px solid rgba(188, 214, 255, 0.28)',
                }}
              >
                <div style={{ fontSize: '17px', color: '#a7bfec', marginBottom: '6px', textTransform: 'uppercase' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '44px', fontWeight: 900, lineHeight: 1 }}>
                  {item.value}
                </div>
                <div style={{ fontSize: '17px', color: '#d7e4ff', marginTop: '6px' }}>
                  {item.note}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '21px',
              color: '#bfd4ff',
              marginTop: '6px',
            }}
          >
            <div>Impact Highlight: 2700+ submissions evaluated in 72 hours by the Bits&Bytes team.</div>
            <div style={{ color: '#ffffff' }}>gobitsnbytes.org</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
