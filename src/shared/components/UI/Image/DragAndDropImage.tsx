import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from "react";
import styles from "./DragAndDropImage.module.css";
type FileInput = {
  id: number;
  url: string;
  name: string;
  file: File;
};

type DragAndDropImageProps = {
  onImageList?: (files: FileInput[]) => void;
};

const DragAndDropImage = ({ onImageList }: DragAndDropImageProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileInput[]>([]);

  //Dùng useEffect khi cần gọi hàm callback ngay sau khi upate state
  useEffect(() => {
    if (files.length) {
      if (files.length) {
        onImageList?.(files);
      }
    }
  }, [files, onImageList]);

  const handleGetImage = (event: ChangeEvent<HTMLInputElement>) => {
    const images = event.target.files;
    if (!images) return;
    setFiles((prev) => {
      const lstImgs: FileInput[] = [];
      Array.from(images).forEach((x) => {
        if (prev.findIndex((img) => img.name === x.name) === -1) {
          lstImgs.push({
            id: Math.random(),
            url: URL.createObjectURL(x),
            name: x.name,
            file: x,
            // size: (x.size / 1024 / 1024).toFixed(1),
          });
        }
      });
      const newArr = [...prev, ...lstImgs];
      return newArr;
    });
  };

  const handleRemoveImage = (
    event: MouseEvent<HTMLButtonElement>,
    idImg: number,
  ) => {
    setFiles((prev) => {
      const newArr = prev.filter((img) => img.id !== idImg);
      return newArr;
    });
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <>
      <div
        className={styles["drop-image"]}
        onClick={() => inputFileRef.current && inputFileRef.current.click()}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          hidden
          ref={inputFileRef}
          onChange={handleGetImage}
        />
        {files.length === 0 && (
          <div className={styles["drop-image__title"]}>
            <p>Thêm một ảnh vào đây </p>
            <p>Kéo thả ảnh vào đây, hoặc bấm để chọn ảnh</p>
          </div>
        )}
        <div className={styles["drop-image__list-image"]}>
          {files.map((file) => (
            <div className={styles["drop-image__item"]} key={file.id}>
              <div className={styles["drop-image__image"]}>
                <img src={file.url} alt="image" />
              </div>
              <div className={styles["drop-image_item-prop"]}>
                <p>{file.name}</p>
                {/* <p>{file.size} MB</p> */}
              </div>
              <div className={styles["drop-image_item-action"]}>
                <button onClick={(e) => handleRemoveImage(e, file.id)}>
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DragAndDropImage;
