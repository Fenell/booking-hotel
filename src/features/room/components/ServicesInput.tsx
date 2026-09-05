import Checkbox from "@shared/components/UI/Checkbox/Checkbox";
import roomStlye from "../style/room.module.css";
import { useServiceOptions } from "@features/service";
import { useFormContext, useWatch } from "react-hook-form";
import type { RoomCreateRequest } from "../types/room.type";

const ServicesInput = () => {
  const methods = useFormContext<RoomCreateRequest>();
  const { setValue } = methods;
  // const roomServices = watch("roomServices") ?? [];

  const roomServices = useWatch({
    name: "roomServices",
    control: methods.control,
  });

  // Feature Phòng không tự query bảng services nữa — hỏi thẳng feature Dịch vụ
  const { options } = useServiceOptions();

  const isChecked = (serviceId: string) => {
    return roomServices.some((c) => c.serviceId === serviceId);
  };

  const processCheckValue = (isCheck: boolean, serviceId: string) => {
    // console.log(isCheck);
    if (isCheck) {
      setValue(
        "roomServices",
        roomServices.filter((c) => c.serviceId !== serviceId),
        { shouldDirty: true },
      );
    } else {
      setValue("roomServices", [...roomServices, { serviceId }], {
        shouldDirty: true,
      });
    }
  };

  /**
   * Suy ra từ chính giá trị form, KHÔNG giữ bằng useState riêng. Bản đầu dùng
   * một state `checkAll` khởi tạo cứng bằng true nên nhãn không khớp thực tế.
   *
   * Chiều của nút cố ý ưu tiên "gỡ sạch": chỉ cần còn một tiện ích được chọn
   * thì nút là "Bỏ chọn tất cả". Nếu theo chuẩn select-all (chỉ đổi chiều khi
   * đã chọn ĐỦ hết) thì phòng gắn sẵn một phần dịch vụ sẽ hiện "Chọn tất cả",
   * bấm vào lại gắn thêm toàn bộ dịch vụ của hệ thống vào phòng — đúng cái bẫy
   * đã gặp.
   */
  const hasAnyChecked = roomServices.length > 0;

  const handleCheckAll = () => {
    setValue(
      "roomServices",
      hasAnyChecked
        ? []
        : options.map((service) => ({ serviceId: service.value })),
      { shouldDirty: true },
    );
  };

  return (
    <div>
      <p className={roomStlye.title}> Tiện ích</p>
      <p
        style={{
          display: "inline-block",
          marginTop: "6px",
          color: "var(--color-secondary)",
          fontWeight: "var(--weight-semibold)",
          cursor: "pointer",
        }}
        onClick={handleCheckAll}
      >
        {hasAnyChecked ? "Bỏ chọn tất cả" : "Chọn tất cả"}
      </p>
      <div className={roomStlye.unityRoom}>
        {options.map((service) => {
          const checked = isChecked(service.value);
          return (
            <Checkbox
              key={service.value}
              index={service.value}
              label={service.label}
              isChecked={checked}
              value={service.value}
              onChecked={() => processCheckValue(checked, service.value)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ServicesInput;
