/**
 * 格式化字符串，每三位加逗号
 * @param num
 * @param separator
 * @returns
 */
export const formatNumber = (num?: number | string, separator = ',') => {
  if (!num) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};
