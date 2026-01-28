import roomStlye from "../style/room.module.css";
import classNames from "classnames";
import { Controller, useFormContext } from "react-hook-form";
import type { RoomCreateRequest } from "../types/room.type";
import { Input } from "@shared/components/UI/Input";
import Editor from "@shared/components/UI/RichText/RichText";

const BaseInfoInput = () => {
  const methods = useFormContext<RoomCreateRequest>();
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
          <label htmlFor="roomStatus">Trạng thái</label>
          <Input />
        </div>
        <div style={{ width: "100%" }}>
          <label htmlFor="roomType">Loại phòng</label>
          <Input />
        </div>
      </div>
      <div className={classNames(roomStlye.halfField, roomStlye.inputField)}>
        <div style={{ width: "100%" }}>
          <label htmlFor="currentPrice">Giá phòng (VNĐ)</label>
          <Controller
            control={control}
            name="currentPrice"
            render={({ field }) => (
              <Input id="currentPrice" type="number" {...field} />
            )}
          />
        </div>
        <div style={{ width: "100%" }}>
          <label htmlFor="priceWeekend">Giá phòng cuối tuần (VNĐ)</label>
          <Controller
            control={control}
            name="priceWeekend"
            render={({ field }) => (
              <Input id="priceWeekend" type="number" {...field} />
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
              <Input id="acreage" type="number" {...field} />
            )}
          />
        </div>
        <div style={{ width: "100%" }}>
          <label htmlFor="numberAdults">Số người lớn</label>
          <Controller
            control={control}
            name="numberAdults"
            render={({ field }) => (
              <Input id="numberAdults" type="number" {...field} />
            )}
          />
        </div>
        <div style={{ width: "100%" }}>
          <label htmlFor="numberChild">Số trẻ em</label>
          <Controller
            control={control}
            name="numberChild"
            render={({ field }) => (
              <Input id="numberChild" type="number" {...field} />
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
              <Input id="numberBathRoom" type="number" {...field} />
            )}
          />
        </div>
        <div style={{ width: "100%" }}>
          <label htmlFor="numberBedroom">Số phòng ngủ</label>
          <Controller
            control={control}
            name="numberBedroom"
            render={({ field }) => (
              <Input id="numberBedroom" type="number" {...field} />
            )}
          />
        </div>
        <div style={{ width: "100%" }}>
          <label htmlFor="numberBed">Số giường</label>
          <Controller
            control={control}
            name="numberBed"
            render={({ field }) => (
              <Input id="numberBed" type="number" {...field} />
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
