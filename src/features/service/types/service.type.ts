// ---------------------------------------------------------------------------
// PHẦN CÔNG BỐ RA NGOÀI (re-export ở features/service/index.ts)
// Feature khác chỉ được dùng những type trong khối này.
// ---------------------------------------------------------------------------

/**
 * Shape tối giản để feature khác đổ dịch vụ vào ô chọn (checkbox, select).
 * Cố ý không mang tên field của Service: nơi dùng chỉ cần "chọn cái gì" chứ
 * không cần biết dịch vụ có icon, giá hay loại gì.
 */
export type ServiceOption = {
  value: string;
  label: string;
};

// ---------------------------------------------------------------------------
// PHẦN NỘI BỘ — chỉ dùng trong feature Dịch vụ, KHÔNG export ra ngoài feature.
// ---------------------------------------------------------------------------

export type ServiceResponse = ServiceCreateAndUpdateModel & {
  createDate: Date;
  isActive: boolean;
  id: string;
  iconCode?: string;
  sizeIcon?: string;
  color?: string;
  nameTypeService: string;
};

/**
 * Bản chất hành xử của một dòng dịch vụ — khớp enum ServiceKind bên BE.
 * Tiện nghi không có giá và gắn vào phòng; hàng hóa/dịch vụ có giá và bán được.
 * Phần chia nhỏ theo nghiệp vụ (Đồ uống, Đồ ăn, Spa…) nằm ở nhóm (type_services).
 */
export const SERVICE_KIND = {
  amenity: 0,
  goods: 1,
  service: 2,
} as const;

export const SERVICE_KIND_LABEL: Record<number, string> = {
  [SERVICE_KIND.amenity]: "Tiện nghi",
  [SERVICE_KIND.goods]: "Hàng hóa",
  [SERVICE_KIND.service]: "Dịch vụ",
};

export type ServiceCreateAndUpdateModel = {
  serviceCode?: string;
  serviceName: string;
  description?: string;
  /** 0 Tiện nghi | 1 Hàng hóa | 2 Dịch vụ */
  kind: number;
  price?: number | null;
  unit?: string | null;
  /** Hàng của cơ sở nào; để trống = dùng chung mọi cơ sở */
  propertyId?: string | null;
  /** Khách chọn được lúc đặt phòng */
  isBookable: boolean;
  /** Gọi thêm được trong kỳ lưu trú */
  isOrderable: boolean;
  sortOrder?: number;
  idIcon?: string | null;
  idTypeService: string;
};

export type ServiceUpdateRequest = ServiceCreateAndUpdateModel & {
  id: string;
};

export type ServiceType = {
  id: string;
  codeTypeService: string;
  nameTypeService: string;
  /** Nhóm này dành cho loại nào — chỉ chọn được nhóm cùng kind với dịch vụ */
  kind: number;
};

// id": "019b8497-de44-745a-a0ff-4995cd9c5ff0",
//             "id_icon": "f566d6ab-6cd5-41a7-8f5c-25f55448fea8",
//             "icon_code": "wifi",
//             "icon_name": "Wifi",
//             "is_active": false,
//             "created_by": "admin",
//             "modified_by": "admin",
//             "created_date": "2026-01-03T23:01:44.070822",
//             "service_code": "wifi",
//             "service_name": "WIFI",
//             "modified_date": "2026-
