import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 不需要登录的页面
const publicRoutes = ['/', '/auth', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/auth/callback'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查是否为公开路由
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // 获取用户会话
  const supabase = await import('./lib/supabase').then(m => m.supabase);
  const { data: { session } } = await supabase.auth.getSession();

  // 如果没有会话且不是公开路由，重定向到登录页
  if (!session) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

// 指定中间件应用的路径
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
