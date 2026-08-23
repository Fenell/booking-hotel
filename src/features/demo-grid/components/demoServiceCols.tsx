/**
 * Dòng dữ liệu THẬT của view_service_with_icon (đã kiểm chứng với DB 2026-08-23).
 * Lưu ý: type ServiceResponse của repo có price/isFee/unit/nameTypeService
 * nhưng view KHÔNG trả các cột đó — demo dùng type riêng đúng runtime.
 */
export type DemoServiceRow = {
  id: string;
  serviceCode?: string;
  serviceName: string;
  isActive: boolean;
  createdDate?: string;
  modifiedDate?: string;
  createdBy?: string;
  modifiedBy?: string;
  idIcon?: string;
  description?: string;
  iconCode?: string;
  iconName?: string;
  color?: string;
  sizeIcon?: string;
};
