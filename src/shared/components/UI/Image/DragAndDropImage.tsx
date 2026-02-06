import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from "react";
import styles from "./DragAndDropImage.module.css";
import { useFancybox } from "@shared/hooks/useFancybox";
export type FileInput = {
  id: number;
  url: string;
  fileName: string;
  file?: File;
};

type DragAndDropImageProps = {
  onImageList?: (files: FileInput[]) => void;
  images?: FileInput[];
};

const DragAndDropImage = ({
  onImageList,
  images = [],
}: DragAndDropImageProps) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileInput[]>([]);
  //Dùng useEffect khi cần gọi hàm callback ngay sau khi upate state
  // console.log(images);
  useEffect(() => {
    if (files.length) {
      if (files.length) {
        onImageList?.(files);
      }
    }
  }, [files, onImageList]);

  useEffect(() => {
    if (images) {
      setFiles(images);
    }
  }, [images]);
  console.log(files);
  const [fancyboxRef] = useFancybox();

  const handleGetImage = (event: ChangeEvent<HTMLInputElement>) => {
    const images = event.target.files;
    if (!images) return;
    setFiles((prev) => {
      const lstImgs: FileInput[] = [];
      Array.from(images).forEach((x) => {
        if (prev.findIndex((img) => img.fileName === x.name) === -1) {
          lstImgs.push({
            id: Math.random(),
            url: URL.createObjectURL(x),
            fileName: x.name,
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
      <div className={styles["drop-image"]}>
        <div
          className={styles["drop-box"]}
          onClick={() => inputFileRef.current && inputFileRef.current.click()}
        >
          <div className={styles["drop-image__title"]}>
            <p>Kéo thả tệp vào đây </p>
            {/* <p>Kéo thả ảnh vào đây, hoặc bấm để chọn ảnh</p> */}
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            hidden
            ref={inputFileRef}
            onChange={handleGetImage}
          />
        </div>

        <div ref={fancyboxRef} className={styles["drop-image__list-image"]}>
          {files.map((file) => (
            <div className={styles["drop-image__item"]} key={file.id}>
              <div className={styles["drop-image_item-action"]}>
                <button onClick={(e) => handleRemoveImage(e, file.id)}>
                  {/* <i className="fa-regular fa-xmark"></i> */}
                  <i
                    className="fa-solid fa-circle-x fa-lg"
                    style={{ color: "#fe3442" }}
                  ></i>
                </button>
              </div>
              <div className={styles["drop-image__image"]}>
                <a data-fancybox="gallery" href={file.url}>
                  <img src={file.url} alt="image" />
                </a>
              </div>
              {/* <div className={styles["drop-image_item-prop"]}>
                <p>{file.fileName}</p>
                <p>{file.size} MB</p>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DragAndDropImage;
