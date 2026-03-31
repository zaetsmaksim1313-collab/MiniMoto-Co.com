import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith('/admin')) {
        const basicAuth = req.headers.get('authorization');
        
        const user = process.env.ADMIN_USER || 'admin';
        const pwd = process.env.ADMIN_PASSWORD || 'minimotorocks';

        if (basicAuth) {
            const authValue = basicAuth.split(' ')[1];
            try {
                const [providedUser, providedPwd] = atob(authValue).split(':');

                if (providedUser === user && providedPwd === pwd) {
                    return NextResponse.next();
                }
            } catch (e) {
                // Ignore malformed auth headers
            }
        }

        return new NextResponse('Authentication required', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Area"'
            }
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
