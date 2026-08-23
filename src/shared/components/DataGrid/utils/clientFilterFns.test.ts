import { describe, expect, it } from "vitest";
import type { Row } from "@tanstack/react-table";
import { gridClientFilterFn } from "./clientFilterFns";
import type { ClientFilterValue } from "./clientFilterFns";

/** Row giả: filter fn chỉ dùng đúng getValue */
const rowWith = (value: unknown) =>
  ({ getValue: () => value }) as unknown as Row<unknown>;

const run = (value: unknown, filter: ClientFilterValue | undefined) =>
  gridClientFilterFn(rowWith(value), "field", filter, () => {});

describe("gridClientFilterFn", () => {
  it("giữ mọi dòng khi ô lọc rỗng", () => {
    expect(run("bất kỳ", { operator: "contains", value: "" })).toBe(true);
    expect(run("bất kỳ", undefined)).toBe(true);
  });

  it("loại dòng có giá trị null", () => {
    expect(run(null, { operator: "contains", value: "a" })).toBe(false);
  });

  it("contains không phân biệt hoa thường", () => {
    expect(run("Phòng Deluxe", { operator: "contains", value: "deluxe" })).toBe(
      true,
    );
    expect(run("Phòng Deluxe", { operator: "contains", value: "vip" })).toBe(
      false,
    );
  });

  it("so sánh số với eq/gt/lt", () => {
    expect(run(500, { operator: "eq", value: "500" })).toBe(true);
    expect(run(500, { operator: "gt", value: "400" })).toBe(true);
    expect(run(500, { operator: "gt", value: "600" })).toBe(false);
    expect(run(500, { operator: "lt", value: "600" })).toBe(true);
  });

  it("giữ dòng khi operator lạ", () => {
    expect(run(500, { operator: "between", value: "1" })).toBe(true);
  });
});
