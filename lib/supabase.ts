import { createClient } from '@supabase/supabase-js';

// Supabase 客户端配置（用于浏览器端）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase 环境变量未配置，请检查 .env.local 文件');
}

// 浏览器端使用的客户端（带有 anon key）
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// 服务端使用的客户端（带有 service role key）
// 注意：仅在服务端组件或 API 路由中使用
export const createServerClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!serviceRoleKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY 未配置');
    return supabase;
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export default supabase;