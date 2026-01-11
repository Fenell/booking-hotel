import sideBarStyle from "./Sidebar.module.css";

const SidebarSkeleton = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className={sideBarStyle.skeletonItem} />
      ))}
    </>
  );
};

export default SidebarSkeleton;
