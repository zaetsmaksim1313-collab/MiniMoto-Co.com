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

  // Otherwise, return a blank white screen with the reopening notice
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mini Moto Co - Reopening Soon</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #000000;
          text-align: center;
        }
        .container {
          max-width: 600px;
          padding: 2rem;
        }
        h1 {
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.25;
          letter-spacing: -0.02em;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 2rem 0 0 0;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          font-size: 1.15rem;
          color: #666666;
          font-weight: 500;
        }
        li {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        li::before {
          content: "•";
          color: #000000;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>biggest ever minimotoco reopening august 1st 😉</h1>
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
