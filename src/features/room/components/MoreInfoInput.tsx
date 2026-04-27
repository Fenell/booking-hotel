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
import { useMutation } from "@tanstack/react-query";
import { deleteImage } from "@shared/services/image";
import { useToast } from "@shared/hooks/useToast";

type MoreInfoInput = {
  roomImages?: RoomImage[];
  onAddImage?: (image: FileInput[]) => void;
};

const MoreInfoInput = ({ roomImages, onAddImage }: MoreInfoInput) => {
  const [images, setImages] = useState<FileInput[]>([]);
  const methods = useFormContext<RoomCreateRequest>();
  const toast = useToast();
  const { control } = methods;
  useEffect(() => {
    const imgs: FileInput[] = roomImages?.map((image) => ({
      id: image.id,
      fileName: image.fileName,
      url: image.url,
    }));
    setImages(imgs);
  }, [roomImages]);

  const { mutateAsync } = useMutation({
    mutationFn: deleteImage,
    onSuccess: () => toast.success("Xóa ảnh thành công"),
    onError: () => toast.warning("Xóa thất bại"),
  });

  const handleDeleteImage = async (id: string) => {
    await mutateAsync({ id, entityType: "room" });
  };

  return (
    <div>
      <DragAndDropImage
        images={images}
        onDelete={handleDeleteImage}
        onImageList={onAddImage}
      />
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
