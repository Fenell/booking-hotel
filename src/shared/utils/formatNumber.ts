export const formatNumber = (value: number | null) => {
  if (value == null) return "";
  return value.toLocaleString("vi-VN");
};

export const parseNumber = (value: string) => {
  const raw = value.replace(/\./g, "");
  return raw === "" ? null : Number(raw);
};
