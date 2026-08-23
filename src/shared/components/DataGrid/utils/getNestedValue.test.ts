import { describe, expect, it } from "vitest";
import { getNestedValue } from "./getNestedValue";

describe("getNestedValue", () => {
  const row = {
    roomName: "P.101",
    price: 0,
    roomType: { typeName: "Deluxe", meta: null },
  };

  it("đọc được field phẳng", () => {
    expect(getNestedValue(row, "roomName")).toBe("P.101");
  });

  it("đọc được dot-path lồng nhau", () => {
    expect(getNestedValue(row, "roomType.typeName")).toBe("Deluxe");
  });

  it("giữ nguyên giá trị 0 (không quy về undefined)", () => {
    expect(getNestedValue(row, "price")).toBe(0);
  });

  it("trả undefined khi đường dẫn đứt giữa chừng", () => {
    expect(getNestedValue(row, "roomType.meta.name")).toBeUndefined();
    expect(getNestedValue(row, "khongTonTai.abc")).toBeUndefined();
  });

  it("trả undefined khi row là null/undefined", () => {
    expect(getNestedValue(null, "roomName")).toBeUndefined();
    expect(getNestedValue(undefined, "roomName")).toBeUndefined();
  });
});
