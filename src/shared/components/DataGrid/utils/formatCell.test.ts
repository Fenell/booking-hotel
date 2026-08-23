import { describe, expect, it } from "vitest";
import type { ColumnDef } from "../types/column";
import { formatCell, formatN0 } from "./formatCell";

type Row = { name: string; price: number; note: string | null; day: Date };

const col = (over: Partial<ColumnDef<Row>>): ColumnDef<Row> => ({
  field: "name",
  headerText: "Tên",
  ...over,
});

describe("formatN0", () => {
  it("định dạng số kiểu vi-VN", () => {
    expect(formatN0(1000000)).toBe("1.000.000");
  });

  it("hiển thị 0 thành '0' (đây là lý do không dùng formatNumber của repo)", () => {
    expect(formatN0(0)).toBe("0");
  });
});

describe("formatCell", () => {
  const row: Row = {
    name: "P.101",
    price: 1500000,
    note: null,
    day: new Date(2026, 7, 23),
  };

  it("trả chuỗi rỗng khi giá trị null/undefined", () => {
    expect(formatCell(row, col({ field: "note" }))).toBe("");
    expect(formatCell(row, col({ field: "khongCo" }))).toBe("");
  });

  it("áp dụng format N0 cho cột số", () => {
    expect(formatCell(row, col({ field: "price", format: "N0" }))).toBe(
      "1.500.000",
    );
  });

  it("không format số khi cột không khai báo N0", () => {
    expect(formatCell(row, col({ field: "price" }))).toBe("1500000");
  });

  it("hiển thị Date theo vi-VN", () => {
    expect(formatCell(row, col({ field: "day" }))).toBe("23/8/2026");
  });
});
