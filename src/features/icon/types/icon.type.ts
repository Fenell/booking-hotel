export type IconResponse = IconCreateUpDateModel & {
  id: string;
  isActive: boolean;
  createdDate: Date;
};

export type IconCreateUpDateModel = {
  iconCode: string;
  iconName?: string;
  description?: string;
  color?: string;
  sizeIcon?: string;
};
