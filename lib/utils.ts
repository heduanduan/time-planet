// ============================================================
// 日期和工具函数
// ============================================================

/**
 * 计算离开天数
 * @param departedAt 离开日期 (YYYY-MM-DD 或 ISO 字符串)
 * @returns 离开的天数
 */
export function calculateDepartedDays(departedAt: string | null): number | null {
  if (!departedAt) return null;

  const startDate = new Date(departedAt);
  const today = new Date();

  // 重置时间为 0:0:0，避免时间差影响天数计算
  startDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 0 ? diffDays : 0;
}

/**
 * 格式化日期为 "YYYY年MM月DD日"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

/**
 * 格式化日期为 "YYYY-MM-DD"
 */
export function formatDateISO(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 获取月份的第一天
 */
export function getFirstDayOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1);
}

/**
 * 获取月份的最后一天
 */
export function getLastDayOfMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 0);
}

/**
 * 获取月份的天数
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * 判断两个日期是否为同一天
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * 获取星期几的中文名称
 */
export function getWeekdayName(dayOfWeek: number): string {
  const weekdayNames = ['日', '一', '二', '三', '四', '五', '六'];
  return weekdayNames[dayOfWeek] || '';
}

/**
 * 获取月份的中文名称
 */
export function getMonthName(month: number): string {
  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];
  return monthNames[month] || '';
}

/**
 * 生成唯一 ID (用于前端临时状态)
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * 格式化时间为 "YYYY-MM-DD HH:mm:ss"
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 相对时间格式化 (例如 "3小时前")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 30) {
    return formatDate(dateString);
  } else if (diffDays > 0) {
    return `${diffDays}天前`;
  } else if (diffHours > 0) {
    return `${diffHours}小时前`;
  } else if (diffMins > 0) {
    return `${diffMins}分钟前`;
  } else {
    return '刚刚';
  }
}
