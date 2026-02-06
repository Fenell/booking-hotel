import DragAndDropImage, {
  type FileInput,
} from "@shared/components/UI/Image/DragAndDropImage";
import classNames from "classnames";
import Editor from "@shared/components/UI/RichText/RichText";
import roomStlye from "../style/room.module.css";
import type { RoomImage } from "@shared/types/roomImage";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { RoomCreateRequest } from "../types/room.type";

const MoreInfoInput = ({ roomImages }: { roomImages?: RoomImage[] }) => {
  const [images, setImages] = useState<FileInput[]>([]);
  const methods = useFormContext<RoomCreateRequest>();
  const { control } = methods;
  useEffect(() => {
    const imgs: FileInput[] = roomImages?.map((image) => ({
      id: image.id,
      fileName: image.fileName,
      url: image.url,
    }));
    setImages(imgs);
  }, [roomImages]);

  return (
    <div>
      <DragAndDropImage images={images} />
      <div className={classNames(roomStlye.fullField, roomStlye.inputField)}>
        <label htmlFor="description">Mô tả</label>
        <Controller
          control={control}
          name="description"
          render={({ field }) => <Editor key="description" />}
        />
      </div>
    </div>
  );
};

export default MoreInfoInput;
