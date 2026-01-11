import toastStyle from "./Toast.module.css";

const SuccessIcon = () => (
  <i
    className="fa-light fa-circle-check fa-xl"
    style={{ color: "#63E6BE" }}
  ></i>
);

const FailureIcon = () => (
  <i
    className="fa-light fa-circle-xmark fa-xl"
    style={{ color: "#ff0000" }}
  ></i>
);

const WarningIcon = () => (
  <i
    className="fa-light fa-circle-exclamation fa-xl"
    style={{ color: "#ebb800" }}
  ></i>
);

const InfoIcon = () => (
  <i className="fa-light fa-circle-info fa-xl" style={{ color: "#74C0FC" }}></i>
);

const CloseIcon = () => <i className="fa-light fa-xmark fa-lg"></i>;

export { SuccessIcon, CloseIcon, FailureIcon, InfoIcon, WarningIcon };
