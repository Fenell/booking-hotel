import { describe, expect, it } from "vitest";
import type { ColumnDef } from "../types/column";
import type { ServerGridState } from "../types/props";
import { buildServerFieldMap, mapRequest } from "./mapRequest";

const baseState: ServerGridState = {
  pageNumber: 2,
  pageSize: 50,
  sorts: [],
  filters: [],
};

describe("buildServerFieldMap", () => {
  it("chỉ gom những cột có khai báo serverField", () => {
    const columns: ColumnDef<unknown>[] = [
      { field: "roomName", headerText: "Tên" },
      { field: "createDate", headerText: "Ngày tạo", serverField: "created_date" },
    ];
    expect(buildServerFieldMap(columns)).toEqual({ createDate: "created_date" });
  });
});

describe("mapRequest", () => {
  const opts = { tableNames: "view_service_with_icon" };

  it("giữ nguyên phân trang và bỏ sorts/filters khi rỗng", () => {
    const req = mapRequest(opts, baseState);
    expect(req).toMatchObject({
      tableNames: "view_service_with_icon",
      pageNumber: 2,
      pageSize: 50,
    });
    expect(req.sorts).toBeUndefined();
    expect(req.filters).toBeUndefined();
  });

  it("đổi tên field sang snake_case khi sort", () => {
    const req = mapRequest(opts, {
      ...baseState,
      sorts: [{ field: "roomName", direction: "desc" }],
    });
    expect(req.sorts).toEqual([{ name: "room_name", direction: "desc" }]);
  });

  it("ưu tiên serverFields hơn camelToSnake", () => {
    const req = mapRequest(
      { ...opts, serverFields: { createDate: "created_date" } },
      { ...baseState, sorts: [{ field: "createDate", direction: "asc" }] },
    );
    expect(req.sorts).toEqual([{ name: "created_date", direction: "asc" }]);
  });

  it("contains → ILIKE và bọc %...%", () => {
    const req = mapRequest(opts, {
      ...baseState,
      filters: [{ field: "roomName", operator: "contains", value: "deluxe" }],
    });
    expect(req.filters).toEqual([
      { field: "room_name", operator: "ILIKE", value: "%deluxe%" },
    ]);
  });

  it("escape wildcard của LIKE để tìm đúng chuỗi người dùng gõ", () => {
    const req = mapRequest(opts, {
      ...baseState,
      filters: [{ field: "note", operator: "contains", value: "giảm 50% a_b" }],
    });
    expect(req.filters?.[0].value).toBe("%giảm 50\\% a\\_b%");
  });

  it("không bọc % cho toán tử số", () => {
    const req = mapRequest(opts, {
      ...baseState,
      filters: [{ field: "price", operator: "gt", value: "500" }],
    });
    expect(req.filters).toEqual([
      { field: "price", operator: ">", value: "500" },
    ]);
  });

  it("filter cố định đứng trước filter của grid", () => {
    const req = mapRequest(
      { ...opts, staticFilters: [{ field: "isActive", operator: "eq", value: "true" }] },
      {
        ...baseState,
        filters: [{ field: "price", operator: "lt", value: "100" }],
      },
    );
    expect(req.filters).toEqual([
      { field: "is_active", operator: "=", value: "true" },
      { field: "price", operator: "<", value: "100" },
    ]);
  });
});
