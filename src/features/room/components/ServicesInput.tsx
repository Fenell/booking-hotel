import Checkbox from "@shared/components/UI/Checkbox/Checkbox";
import roomStlye from "../style/room.module.css";
import { useQuery } from "@tanstack/react-query";
import type { ServiceResponse } from "@features/service/types/service.type";
import { getDynamicData } from "@shared/services/dynamic";
import type { DyanmicDataPagingRequest } from "@shared/types/dynamic";
import { Controller, set, useFormContext } from "react-hook-form";
import type { RoomCreateRequest } from "../types/room.type";
import { useState } from "react";

const servicesRequest: DyanmicDataPagingRequest = {
  tableNames: "services",
  pageNumber: 1,
  pageSize: 100,
};

const ServicesInput = () => {
  const methods = useFormContext<RoomCreateRequest>();
  const { watch, setValue } = methods;
  const [checkAll, setCheckAll] = useState(true);
  const roomServices = watch("roomServices") || [];

  const { data } = useQuery({
    queryKey: ["services"],
    queryFn: () => getDynamicData<ServiceResponse[]>(servicesRequest),
  });

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

  const handleCheckAll = () => {
    // console.log(checkAll);
    if (checkAll && data) {
      setValue(
        "roomServices",
        data.data.map((a) => ({ serviceId: a.id })),
        { shouldDirty: true },
      );
    } else {
      setValue("roomServices", []);
    }
    setCheckAll((prev) => !prev);
  };

  return (
    <div>
      <p className={roomStlye.title}> Tiện ích</p>
      <p
        style={{
          display: "inline-block",
          marginTop: "6px",
          color: "#5fb2ed",
          fontWeight: "600",
          cursor: "pointer",
        }}
        onClick={handleCheckAll}
      >
        {checkAll ? "Chọn tất cả" : "Bỏ chọn tất cả "}
      </p>
      <div className={roomStlye.unityRoom}>
        {data?.data.map((service) => {
          const checked = isChecked(service.id);
          return (
            <Checkbox
              index={service.id}
              label={service.serviceName}
              isChecked={checked}
              value={service.id}
              onChecked={() => processCheckValue(checked, service.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ServicesInput;
