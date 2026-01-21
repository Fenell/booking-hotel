export type ServiceResponse = ServiceCreateAndUpdateModel & {
  createDate: Date;
  isActive: boolean;
  id: string;
  iconCode?: string;
  sizeIcon?: string;
  color?: string;
};

export type ServiceCreateAndUpdateModel = {
  serviceCode?: string;
  serviceName: string;
  description?: string;
  idIcon?: string;
};

export type ServiceUpdateRequest = ServiceCreateAndUpdateModel & {
  id: string;
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
