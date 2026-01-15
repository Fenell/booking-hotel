import spinnerStyle from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div className={spinnerStyle.loaderBox}>
      <span className={spinnerStyle.loader}></span>
    </div>
  );
};

export default Spinner;
