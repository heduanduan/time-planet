# 《时空星球》项目部署指南

## 📋 部署前准备

### 1. 创建 GitHub 仓库
1. 访问 [GitHub](https://github.com/new) 创建新仓库
2. 仓库名称建议：`time-planet`
3. 设置为公开或私有（根据需求）
4. 不要初始化 README、.gitignore 或 LICENSE

### 2. 连接本地仓库到 GitHub
```bash
# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/time-planet.git

# 推送代码到 GitHub
git push -u origin main
```

## 🚀 Vercel 部署

### 1. 创建 Vercel 项目
1. 访问 [Vercel](https://vercel.com/new)
2. 导入 GitHub 仓库 `time-planet`
3. 配置项目设置：
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 2. 配置环境变量
在 Vercel 项目设置中添加以下环境变量：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# DeepSeek API 配置
DEEPSEEK_API_KEY=your_deepseek_api_key

# 应用配置
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 3. 获取环境变量值

#### Supabase 配置
1. 访问 [Supabase](https://supabase.com/dashboard)
2. 创建新项目或使用现有项目
3. 在项目设置中获取：
   - Project URL
   - anon public key
   - service_role key（保密）

#### DeepSeek API 配置
1. 访问 [DeepSeek](https://platform.deepseek.com/)
2. 注册账号并获取 API Key

## 🗄️ Supabase 数据库配置

### 1. 执行 DDL 脚本
1. 在 Supabase 项目中打开 SQL Editor
2. 执行 `supabase/ddl.sql` 文件中的 SQL 语句
3. 确认所有表和约束创建成功

### 2. 配置认证设置
1. 在 Supabase Dashboard 中进入 Authentication > Settings
2. 配置以下设置：
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: 添加 `https://your-app.vercel.app/auth/callback`
   - **Email Templates**: 自定义邮件模板（可选）

## 📱 部署后验证

### 1. 检查部署状态
- 访问 Vercel Dashboard 查看部署日志
- 确保构建成功且无错误

### 2. 功能测试
- [ ] 首页 3D 场景正常显示
- [ ] 用户注册和登录功能正常
- [ ] 记忆博物馆功能正常
- [ ] AI 对话功能正常
- [ ] 移动端响应式正常

### 3. 性能监控
- 使用 Vercel Analytics 监控性能
- 检查 Core Web Vitals 指标

## 🔧 常见问题

### 构建失败
1. 检查环境变量是否正确配置
2. 查看 Vercel 构建日志中的错误信息
3. 确保所有依赖项在 package.json 中

### 数据库连接失败
1. 验证 Supabase URL 和 API Key
2. 检查 Supabase 项目状态
3. 确认数据库表已正确创建

### API 调用失败
1. 验证 DEEPSEEK_API_KEY 是否有效
2. 检查 API 配额和限制
3. 查看浏览器控制台和网络请求

## 📊 监控和维护

### 1. 日志监控
- Vercel Logs: 实时查看应用日志
- Supabase Logs: 监控数据库操作

### 2. 性能优化
- 定期检查 Vercel Analytics
- 优化数据库查询
- 监控 API 响应时间

### 3. 备份策略
- Supabase 自动备份
- 定期导出重要数据

## 🎯 下一步

部署完成后，你可以：
1. 自定义域名配置
2. 设置 CDN 和缓存策略
3. 配置错误监控（如 Sentry）
4. 添加分析和用户追踪
5. 实现更多功能特性

## 📞 支持

如遇到问题，请检查：
1. [Vercel 文档](https://vercel.com/docs)
2. [Supabase 文档](https://supabase.com/docs)
3. [Next.js 文档](https://nextjs.org/docs)
4. 项目 GitHub Issues

---

祝你部署顺利！🎉