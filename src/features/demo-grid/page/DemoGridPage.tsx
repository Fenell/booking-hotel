import DemoClientGrid from "../components/DemoClientGrid";
import DemoServerGrid from "../components/DemoServerGrid";
import demoStyle from "../style/demoGrid.module.css";

/** Trang demo DataGrid tự dựng — truy cập trực tiếp /demo-grid */
const DemoGridPage = () => (
  <div className={demoStyle.page}>
    <title>Demo DataGrid</title>
    <DemoServerGrid />
    <DemoClientGrid />
  </div>
);

export default DemoGridPage;
