import { Fancybox, type FancyboxOptions } from "@fancyapps/ui";
import { useEffect, useState } from "react";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
export const useFancybox = (options: Partial<FancyboxOptions> = {}) => {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (root) {
      Fancybox.bind(root, "[data-fancybox]", options);
      return () => Fancybox.unbind(root);
    }
  }, [options, root]);
  return [setRoot];
};
