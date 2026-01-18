export type IconResponse = IconCreateUpdateModel & {
  id: string;
  isActive: boolean;
  createdDate: Date;
};

export type IconCreateUpdateModel = {
  iconCode: string;
  iconName?: string;
  description?: string;
  color?: string;
  sizeIcon?: string;
  isActive?: boolean;
};

export type IconUpdateRequest = {
  id: string;
  data: IconCreateUpdateModel;
};
