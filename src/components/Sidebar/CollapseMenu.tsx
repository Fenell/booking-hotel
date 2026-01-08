import { motion, type SVGMotionProps } from "framer-motion";

type CollapseMenuProp = {
  isExpanded: boolean;
} & SVGMotionProps<SVGSVGElement>;

const CollapseMenu = ({ isExpanded, ...props }: CollapseMenuProp) => {
  return (
    <motion.svg
      animate={{ rotate: isExpanded ? 0 : 180 }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 14"
      width="1em"
      height="1em"
      {...props}
    >
      <g
        fill="white"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7.54.5L1.4 6.65a.48.48 0 0 0 0 .7l6.14 6.15"></path>
        <path d="M12.75.5L6.6 6.65a.5.5 0 0 0 0 .7l6.15 6.15"></path>
      </g>
    </motion.svg>
  );
};

// g
//         fill="none"
//         stroke="currentColor"
//         strokeLinecap="round"
//         strokeLinejoin="round"
export default CollapseMenu;
