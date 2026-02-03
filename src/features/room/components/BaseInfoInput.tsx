import roomStlye from "../style/room.module.css";
import classNames from "classnames";
import { Controller, useFormContext } from "react-hook-form";
import type { RoomCreateRequest } from "../types/room.type";
import { Input } from "@shared/components/UI/Input";
import Editor from "@shared/components/UI/RichText/RichText";
import { formatNumber, parseNumber } from "@shared/utils/formatNumber";
import SelectCustom from "@shared/components/UI/Select/SelectCustom";
import { useQuery } from "@tanstack/react-query";
import type { DyanmicDataPagingRequest } from "@shared/types/dynamic";
import { getDynamicData } from "@shared/services/dynamic";
import type { RoomType } from "@shared/types/roomType";

// type InputRoomFormProp = {
//   control: Control<RoomCreateRequest>;
//   inputField: keyof RoomCreateRequest;
//   typeInput?: "number";
// };
// const InputRoomForm = ({
//   control,
//   inputField,
//   typeInput,
// }: InputRoomFormProp) => {
//   return (
//     <>
//       <label htmlFor={inputField}>Diện tích (m3)</label>
//       <Controller
//         control={control}
//         name={inputField}
//         render={({ field }) => (
//           <Input
//             id={inputField}

//             {typeInput &&  type="number"}
//             {...field}
//             value={field.value ?? ""}
//           />
//         )}
//       />
//     </>
//   );
// };

const statusOption = [
  { label: "Bật hiển thị", value: 1 },
  { label: "Tắt hiển thị", value: 0 },
];

const roomTypeRequest: DyanmicDataPagingRequest = {
  tableNames: "room_types",
  pageNumber: 1,
  pageSize: 100,
};

const BaseInfoInput = () => {
  const methods = useFormContext<RoomCreateRequest>();
  const { data } = useQuery({
    queryKey: ["typeRooms"],
    queryFn: () => getDynamicData<RoomType[]>(roomTypeRequest),
  });

  const optionRoomType = data?.data.map((a) => ({
    label: a.typeName,
    value: a.id,
  }));

  const { control } = methods;
  return (
    <div className={roomStlye.baseInfo}>
      <p className={roomStlye.title}>Thông tin cơ bản</p>
      <div className={classNames(roomStlye.fullField, roomStlye.inputField)}>
        <label htmlFor="roomName">Tên phòng</label>
        <Controller
          control={control}
          name="roomName"
          render={({ field }) => <Input id="roomName" {...field} autoFocus />}
        />
      </div>
      <div className={classNames(roomStlye.halfField, roomStlye.inputField)}>
        <div style={{ width: "100%" }}>
          <label htmlFor="status">Trạng thái</label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <SelectCustom
                {...field}
                id="status"
                options={statusOption}
                value={statusOption.find((a) => a.value === field.value)}
                onChange={(e) => field.onChange(e?.value)}
              />
            )}
          />
        </div>
        <div style={{ width: "100%" }}>
          <label htmlFor="roomTypeId">Loại phòng</label>
          <Controller
            control={control}
            name="roomTypeId"
            render={({ field }) => (
              <SelectCustom
                {...field}
                id="roomTypeId"
                options={optionRoomType}
                value={optionRoomType?.find((c) => c.value === field.value)}
                onChange={(e) => field.onChange(e?.value)}
              />
            )}
          />
        </div>
      </div>
      <div className={classNames(roomStlye.halfField, roomStlye.inputField)}>
        <div style={{ width: "100%" }}>
          <label htmlFor="currentPrice">Giá phòng (VNĐ)</label>
          <Controller
            control={control}
            name="currentPrice"
            render={({ field }) => (
              <Input
                id="currentPrice"
                {...field}
                value={formatNumber(field.value)}
                onChange={(e) => field.onChange(parseNumber(e.target.value))}
              />
            )}
          />
        </div>
        <div style={{ width: "100%" }}>
          <label htmlFor="priceWeekend">Giá phòng cuối tuần (VNĐ)</label>
          <Controller
            control={control}
            name="priceWeekend"
            render={({ field }) => (
              <Input
                id="priceWeekend"
                {...field}
                value={formatNumber(field.value)}
                onChange={(e) => field.onChange(parseNumber(e.target.value))}
              />
            )}
          />
        </div>
      </div>

      <div className={classNames(roomStlye.halfField, roomStlye.inputField)}>
        <div style={{ width: "100%" }}>
          <label htmlFor="acreage">Diện tích (m3)</label>
          <Controller
            control={control}
            name="acreage"
            render={({ field }) => (
              <Input
                id="acreage"
                type="number"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
        <div style={{ width: "100%" }}>
          <label htmlFor="numberAdults">Số người lớn</label>
          <Controller
            control={control}
            name="numberAdults"
            render={({ field }) => (
              <Input
                id="numberAdults"
                type="number"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
        <div style={{ width: "100%" }}>
          <label htmlFor="numberChild">Số trẻ em</label>
          <Controller
            control={control}
            name="numberChild"
            render={({ field }) => (
              <Input
                id="numberChild"
                type="number"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
      </div>
      <div className={classNames(roomStlye.halfField, roomStlye.inputField)}>
        <div style={{ width: "100%" }}>
          <label htmlFor="numberBathRoom">Số phòng tắm</label>
          <Controller
            control={control}
            name="numberBathRoom"
            render={({ field }) => (
              <Input
                id="numberBathRoom"
                type="number"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
        <div style={{ width: "100%" }}>
          <label htmlFor="numberBedroom">Số phòng ngủ</label>
          <Controller
            control={control}
            name="numberBedroom"
            render={({ field }) => (
              <Input
                id="numberBedroom"
                type="number"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
        <div style={{ width: "100%" }}>
          <label htmlFor="numberBed">Số giường</label>
          <Controller
            control={control}
            name="numberBed"
            render={({ field }) => (
              <Input
                id="numberBed"
                type="number"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
      </div>
      <div className={classNames(roomStlye.fullField, roomStlye.inputField)}>
        <label htmlFor="location">Vị trí</label>
        <Controller
          control={control}
          name="location"
          render={({ field }) => <Input id="location" {...field} />}
        />
      </div>
      <div className={classNames(roomStlye.fullField, roomStlye.inputField)}>
        <label htmlFor="description">Mô tả</label>
        <Editor />
      </div>
    </div>
  );
};

export default BaseInfoInput;
