// ---------------------------------------------------------------------------
// PHẦN CÔNG BỐ RA NGOÀI (re-export ở features/property/index.ts)
// ---------------------------------------------------------------------------

/**
 * Shape tối giản để feature khác đổ cơ sở cho thuê vào ô chọn.
 * Cố ý không mang tên field của Property: nơi dùng chỉ cần "chọn cái gì".
 */
export type PropertyOption = {
  value: string;
  label: string;
};

/** Loại hình cho thuê của một cơ sở — khớp enum RentalType bên BE. */
export const RENTAL_TYPE = {
  hotel: 0,
  villa: 1,
  homestay: 2,
} as const;

export const RENTAL_TYPE_LABEL: Record<number, string> = {
  [RENTAL_TYPE.hotel]: "Khách sạn",
  [RENTAL_TYPE.villa]: "Villa",
  [RENTAL_TYPE.homestay]: "Homestay",
};
