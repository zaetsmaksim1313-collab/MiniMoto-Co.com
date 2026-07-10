import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow admin pages, API routes, and static assets
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Otherwise, return a blank white screen with a premium design and reopening notice
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mini Moto Co - Reopening Soon</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Space+Grotesk:wght@700;800&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          padding: 0;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #ffffff;
          /* SVG Topography Pattern from Hero Patterns with #e2e8f0 slate-200 color */
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='192' viewBox='0 0 192 192'%3E%3Cpath fill='%23e2e8f0' fill-opacity='0.6' d='M192 15v2a11 11 0 0 0-11 11c0 1.94 1.16 4.75 2.53 6.11l2.36 2.36a6.93 6.93 0 0 0 2.45 1.57l3.66 1.14a22.25 22.25 0 0 1 15.65 15.65l1.14 3.66a6.93 6.93 0 0 0 1.57 2.45l2.36 2.36c1.36 1.36 4.17 2.53 6.11 2.53a11 11 0 0 0 11-11v-2a11 11 0 0 0-11-11c-1.94 0-4.75-1.16-6.11-2.53l-2.36-2.36a6.93 6.93 0 0 0-1.57-2.45l-1.14-3.66a22.25 22.25 0 0 1-15.65-15.65l-3.66-1.14a6.93 6.93 0 0 0-2.45-1.57l-2.36-2.36C24.75 1.16 21.94 0 20 0a11 11 0 0 0-11 11v2a11 11 0 0 0 11 11c1.94 0 4.75 1.16 6.11 2.53l2.36 2.36a6.93 6.93 0 0 0 1.57 2.45l1.14 3.66a22.25 22.25 0 0 1 15.65 15.65l3.66 1.14a6.93 6.93 0 0 0 2.45 1.57l2.36 2.36c1.36 1.36 4.17 2.53 6.11 2.53a11 11 0 0 0 11-11v-2a11 11 0 0 0-11-11c-1.94 0-4.75-1.16-6.11-2.53l-2.36-2.36a6.93 6.93 0 0 0-1.57-2.45l-1.14-3.66A22.25 22.25 0 0 1 20 15a11 11 0 0 0-11-11v-2a11 11 0 0 0 11-11c1.94 0 4.75 1.16 6.11 2.53l2.36 2.36a6.93 6.93 0 0 0 2.45 1.57l3.66 1.14a22.25 22.25 0 0 1 15.65 15.65l1.14 3.66a6.93 6.93 0 0 0 2.45 1.57l2.36 2.36C187.25 154.84 190.06 156 192 156v-2c-1.94 0-4.75-1.16-6.11-2.53l-2.36-2.36a6.93 6.93 0 0 0-1.57-2.45l-1.14-3.66A22.25 22.25 0 0 1 165.17 129.7l-3.66-1.14a6.93 6.93 0 0 0-2.45-1.57l-2.36-2.36c-1.36-1.36-4.17-2.53-6.11-2.53a11 11 0 0 0-11 11v2a11 11 0 0 0 11 11c1.94 0 4.75 1.16 6.11 2.53l2.36 2.36a6.93 6.93 0 0 0 1.57 2.45l1.14 3.66a22.25 22.25 0 0 1 15.65 15.65l3.66 1.14a6.93 6.93 0 0 0 2.45 1.57l2.36 2.36C187.25 190.84 190.06 192 192 192v-2c-1.94 0-4.75-1.16-6.11-2.53l-2.36-2.36a6.93 6.93 0 0 0-1.57-2.45l-1.14-3.66A22.25 22.25 0 0 1 165.17 165.7l-3.66-1.14a6.93 6.93 0 0 0-2.45-1.57l-2.36-2.36c-1.36-1.36-4.17-2.53-6.11-2.53a11 11 0 0 0-11 11v2c1.94 0 4.75 1.16 6.11 2.53l2.36 2.36a6.93 6.93 0 0 0 1.57 2.45l1.14 3.66a22.25 22.25 0 0 1 15.65 15.65l3.66 1.14a6.93 6.93 0 0 0 2.45 1.57l2.36 2.36C187.25 190.84 190.06 192 192 192z'/%3E%3C/svg%3E");
          background-size: 260px;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #0d0d0d;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card {
          max-width: 600px;
          width: 90%;
          padding: 3rem 2.5rem;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 28px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
          text-align: center;
          z-index: 10;
        }

        h1 {
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: clamp(1.8rem, 5vw, 2.5rem);
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.03em;
          margin: 0 0 2rem 0;
          text-transform: capitalize;
        }

        .emoji {
          display: inline-block;
          animation: winkAnim 2.5s infinite ease-in-out;
          transform-origin: center;
        }

        @keyframes winkAnim {
          0%, 100% { transform: scale(1) rotate(0deg); }
          45% { transform: scale(1.18) rotate(6deg); }
          55% { transform: scale(1.18) rotate(-4deg); }
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 0.9rem;
        }

        li {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 14px;
          padding: 14px 20px;
          font-size: clamp(0.95rem, 3vw, 1.1rem);
          font-weight: 600;
          color: #2d2d2d;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.01);
        }

        li:hover {
          background: #ffffff;
          border-color: #000000;
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.04);
          color: #000000;
        }

        li::before {
          content: "✦";
          color: #ff69b4; /* Branded Hot pink bullet */
          font-size: 1.1rem;
          line-height: 1;
        }

        /* Subtle logo mark */
        .brand-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #888888;
          margin-bottom: 0.8rem;
          border-bottom: 2px solid #ff69b4;
          padding-bottom: 4px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <span class="brand-badge">Mini Moto Co</span>
        <h1>biggest ever minimotoco reopening august 1st <span class="emoji">😉</span></h1>
        <ul>
          <li>tons of new bikes</li>
          <li>most upgrades of any company</li>
          <li>custom decals....</li>
          <li>and a new layout</li>
        </ul>
      </div>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  });
}
