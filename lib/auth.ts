// ============================================================
// Auth 认证工具函数
// ============================================================

import { supabase } from './supabase';
import { Profile } from './types';

// 登录错误类型
export type AuthError = 
  | 'invalid_credentials'
  | 'email_not_confirmed'
  | 'network_error'
  | 'rate_limit_exceeded'
  | 'unknown_error';

// 注册错误类型
export type SignupError = 
  | 'email_exists'
  | 'invalid_email'
  | 'weak_password'
  | 'network_error'
  | 'rate_limit_exceeded'
  | 'unknown_error';

// 密码重置错误类型
export type ResetError = 
  | 'email_not_found'
  | 'invalid_email'
  | 'network_error'
  | 'rate_limit_exceeded'
  | 'unknown_error';

// 登录结果
export interface LoginResult {
  success: boolean;
  error: AuthError | null;
  message: string;
  profile: Profile | null;
}

// 注册结果
export interface SignupResult {
  success: boolean;
  error: SignupError | null;
  message: string;
  profile: Profile | null;
}

// 密码重置结果
export interface ResetResult {
  success: boolean;
  error: ResetError | null;
  message: string;
}

/**
 * 用户登录
 * @param email 邮箱
 * @param password 密码
 */
export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('登录失败:', error);
      return parseLoginError(error);
    }

    if (!data.session) {
      return {
        success: false,
        error: 'invalid_credentials',
        message: '登录凭证无效',
        profile: null,
      };
    }

    // 获取用户资料
    const profile = await fetchProfile();
    
    return {
      success: true,
      error: null,
      message: '登录成功',
      profile,
    };
  } catch (e) {
    console.error('登录异常:', e);
    return {
      success: false,
      error: 'network_error',
      message: '网络连接异常，请稍后重试',
      profile: null,
    };
  }
}

/**
 * 用户注册
 * @param email 邮箱
 * @param password 密码
 */
export async function signup(email: string, password: string): Promise<SignupResult> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('注册失败:', error);
      return parseSignupError(error);
    }

    // 创建用户资料记录
    if (data.user) {
      await createProfile(data.user.id, email);
    }

    return {
      success: true,
      error: null,
      message: '注册成功，请检查邮箱验证链接',
      profile: null,
    };
  } catch (e) {
    console.error('注册异常:', e);
    return {
      success: false,
      error: 'network_error',
      message: '网络连接异常，请稍后重试',
      profile: null,
    };
  }
}

/**
 * 发送密码重置邮件
 * @param email 邮箱
 */
export async function resetPassword(email: string): Promise<ResetResult> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      console.error('密码重置失败:', error);
      return parseResetError(error);
    }

    return {
      success: true,
      error: null,
      message: '重置链接已发送至您的邮箱',
    };
  } catch (e) {
    console.error('密码重置异常:', e);
    return {
      success: false,
      error: 'network_error',
      message: '网络连接异常，请稍后重试',
    };
  }
}

/**
 * 更新密码
 * @param newPassword 新密码
 */
export async function updatePassword(newPassword: string): Promise<ResetResult> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('密码更新失败:', error);
      return {
        success: false,
        error: 'unknown_error',
        message: '密码更新失败，请重试',
      };
    }

    return {
      success: true,
      error: null,
      message: '密码更新成功',
    };
  } catch (e) {
    console.error('密码更新异常:', e);
    return {
      success: false,
      error: 'network_error',
      message: '网络连接异常，请稍后重试',
    };
  }
}

/**
 * 用户登出
 */
export async function logout(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.error('登出异常:', e);
  }
}

/**
 * 获取当前登录用户信息
 */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/**
 * 获取当前用户资料
 */
export async function fetchProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      // 如果没有资料，尝试创建一个
      await createProfile(user.id, user.email || '');
      return {
        id: user.id,
        email: user.email || '',
        nickname: null,
        avatar_url: null,
        created_at: new Date().toISOString(),
      };
    }

    return data as Profile;
  } catch (e) {
    console.error('获取用户资料失败:', e);
    return null;
  }
}

/**
 * 创建用户资料记录
 */
async function createProfile(userId: string, email: string): Promise<void> {
  try {
    await supabase.from('profiles').insert({
      id: userId,
      email,
    });
  } catch (e) {
    console.error('创建用户资料失败:', e);
  }
}

// 解析登录错误
function parseLoginError(error: any): LoginResult {
  const errorCode = error.code;
  
  switch (errorCode) {
    case 'invalid_credentials':
      return {
        success: false,
        error: 'invalid_credentials',
        message: '邮箱或密码错误',
        profile: null,
      };
    case 'email_not_confirmed':
      return {
        success: false,
        error: 'email_not_confirmed',
        message: '邮箱尚未验证，请检查邮箱确认链接',
        profile: null,
      };
    case 'rate_limit_exceeded':
      return {
        success: false,
        error: 'rate_limit_exceeded',
        message: '请求过于频繁，请稍后重试',
        profile: null,
      };
    default:
      return {
        success: false,
        error: 'unknown_error',
        message: '登录失败，请稍后重试',
        profile: null,
      };
  }
}

// 解析注册错误
function parseSignupError(error: any): SignupResult {
  const errorCode = error.code;
  
  switch (errorCode) {
    case 'email_already_exists':
      return {
        success: false,
        error: 'email_exists',
        message: '该邮箱已被注册',
        profile: null,
      };
    case 'invalid_email':
      return {
        success: false,
        error: 'invalid_email',
        message: '邮箱格式无效',
        profile: null,
      };
    case 'weak_password':
      return {
        success: false,
        error: 'weak_password',
        message: '密码强度不足，请使用更复杂的密码',
        profile: null,
      };
    case 'rate_limit_exceeded':
      return {
        success: false,
        error: 'rate_limit_exceeded',
        message: '请求过于频繁，请稍后重试',
        profile: null,
      };
    default:
      return {
        success: false,
        error: 'unknown_error',
        message: '注册失败，请稍后重试',
        profile: null,
      };
  }
}

// 解析密码重置错误
function parseResetError(error: any): ResetResult {
  const errorCode = error.code;
  
  switch (errorCode) {
    case 'user_not_found':
      return {
        success: false,
        error: 'email_not_found',
        message: '该邮箱未注册',
      };
    case 'invalid_email':
      return {
        success: false,
        error: 'invalid_email',
        message: '邮箱格式无效',
      };
    case 'rate_limit_exceeded':
      return {
        success: false,
        error: 'rate_limit_exceeded',
        message: '请求过于频繁，请稍后重试',
      };
    default:
      return {
        success: false,
        error: 'unknown_error',
        message: '操作失败，请稍后重试',
      };
  }
}
