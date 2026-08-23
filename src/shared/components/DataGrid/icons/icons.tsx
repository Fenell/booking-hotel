// SVG inline — grid KHÔNG phụ thuộc Font Awesome CDN của app
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number | undefined, props: IconProps) => ({
  width: size ?? 14,
  height: size ?? 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

export const SortAscIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M12 19V5" />
    <path d="m5 12 7-7 7 7" />
  </svg>
);

export const SortDescIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </svg>
);

export const CheckIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)} strokeWidth={3}>
    <path d="m5 12 5 5L20 7" />
  </svg>
);

export const MinusIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)} strokeWidth={3}>
    <path d="M5 12h14" />
  </svg>
);

export const ChevronLeftIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ChevronRightIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const ChevronsLeftIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="m11 17-5-5 5-5" />
    <path d="m18 17-5-5 5-5" />
  </svg>
);

export const ChevronsRightIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <path d="m6 17 5-5-5-5" />
    <path d="m13 17 5-5-5-5" />
  </svg>
);

export const ColumnsIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size, p)}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
  </svg>
);
