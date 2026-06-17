// ============================================================
// 环境变量读取工具
// 统一管理所有环境变量的访问，提供类型安全
// ============================================================

interface EnvConfig {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;

  // DeepSeek
  DEEPSEEK_API_KEY: string;

  // 项目配置
  NEXT_PUBLIC_PROJECT_NAME: string;
}

/**
 * 获取环境变量（带默认值和验证）
 * 客户端组件使用 - 只能读取 NEXT_PUBLIC_ 开头的变量
 */
export function getEnv(key: keyof EnvConfig): string {
  const value = process.env[key] || '';

  // 对于必要的变量，在开发环境中警告
  if (!value && process.env.NODE_ENV === 'development') {
    console.warn(`${key} 环境变量未设置，请检查 .env.local 文件`);
  }

  return value;
}

/**
 * 检查 Supabase 配置是否完整
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && anonKey);
}

/**
 * 检查 DeepSeek 配置是否完整
 */
export function isDeepSeekConfigured(): boolean {
  return Boolean(process.env.DEEPSEEK_API_KEY);
}

/**
 * 获取当前环境
 */
export function getEnvironment(): 'development' | 'production' | 'test' {
  return (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development';
}

/**
 * 获取项目名称
 */
export function getProjectName(): string {
  return process.env.NEXT_PUBLIC_PROJECT_NAME || '时空星球';
}