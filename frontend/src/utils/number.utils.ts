/**
 * Tiện ích định dạng số sang tiền tệ VND an toàn, chống crash layout
 * @param value Số cần định dạng (có thể nhận vào undefined hoặc null)
 * @returns Chuỗi đã định dạng kèm chữ VND (Ví dụ: 1.000.000 VND)
 */
export function formatMoney(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "0 VND";
  }
  return `${value.toLocaleString("vi-VN")} VND`;
}