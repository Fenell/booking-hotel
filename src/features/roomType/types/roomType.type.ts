// ---------------------------------------------------------------------------
// PHẦN CÔNG BỐ RA NGOÀI (re-export ở features/roomType/index.ts)
// ---------------------------------------------------------------------------

/**
 * Shape tối giản để feature khác đổ loại phòng vào ô chọn.
 * Cố ý không mang tên field của RoomType: nơi dùng chỉ cần "chọn cái gì".
 */
export type RoomTypeOption = {
  value: string;
  label: string;
};
