import { describe, expect, it } from "vitest";
import { camelToSnake } from "./caseConvert";

describe("camelToSnake", () => {
  it("đổi camelCase thành snake_case", () => {
    expect(camelToSnake("roomName")).toBe("room_name");
    expect(camelToSnake("priceWeekend")).toBe("price_weekend");
  });

  it("giữ nguyên chuỗi vốn đã snake_case", () => {
    expect(camelToSnake("room_name")).toBe("room_name");
  });

  it("chuyển từng đoạn của dot-path", () => {
    expect(camelToSnake("roomType.typeName")).toBe("room_type.type_name");
  });
});
