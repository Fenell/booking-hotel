import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

/**
 * Cấu hình test — kế thừa nguyên vite.config.ts (plugin React + alias @shared,
 * @features…) nên không phải khai báo alias lần thứ ba.
 * LƯU Ý: có file này thì Vitest ĐỌC NÓ và bỏ qua vite.config.ts, vì vậy phải
 * mergeConfig chứ không viết đè.
 */
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // Component test cần DOM; test hàm thuần chạy trong đó cũng không sao
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      // Test đặt CẠNH file nguồn (Button.tsx ↔ Button.test.tsx)
      include: ["src/**/*.{test,spec}.{ts,tsx}"],
      clearMocks: true,
      restoreMocks: true,
      coverage: {
        provider: "v8",
        reporter: ["text", "html"],
        include: ["src/**/*.{ts,tsx}"],
        exclude: [
          "src/**/*.{test,spec}.{ts,tsx}",
          "src/test/**",
          "src/**/*.d.ts",
          "src/main.tsx",
          "src/**/types/**",
        ],
      },
    },
  }),
);
