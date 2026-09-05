/*
  Icon của toast KHÔNG tự tô màu: màu do `.toast--<loại> .icon-thumb` trong
  Toast.module.css quyết định, nên đổi token là đổi theo. Trước đây mỗi icon
  gán màu inline (#63E6BE, #ff0000…) nằm ngoài hệ màu — và quy tắc trong CSS
  thì viết sai tên class (`icon--thumb`) nên không bao giờ chạy.
*/

const SuccessIcon = () => (
  <i className="fa-light fa-circle-check fa-xl" aria-hidden="true"></i>
);

const FailureIcon = () => (
  <i className="fa-light fa-circle-xmark fa-xl" aria-hidden="true"></i>
);

const WarningIcon = () => (
  <i className="fa-light fa-circle-exclamation fa-xl" aria-hidden="true"></i>
);

const InfoIcon = () => (
  <i className="fa-light fa-circle-info fa-xl" aria-hidden="true"></i>
);

const CloseIcon = () => (
  <i className="fa-light fa-xmark fa-lg" aria-hidden="true"></i>
);

export { SuccessIcon, CloseIcon, FailureIcon, InfoIcon, WarningIcon };
