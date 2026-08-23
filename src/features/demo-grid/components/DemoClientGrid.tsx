import { useMemo } from "react";
import { DataGrid } from "@shared/components/DataGrid";
import type { ColumnDef } from "@shared/components/DataGrid";
import demoStyle from "../style/demoGrid.module.css";
import type { DemoServiceRow } from "./demoServiceCols";
import { generateFakeServices } from "./fakeData";

/**
 * MẪU CHUẨN — Grid CLIENT-SIDE + CỘT MAP ĐỘNG, chiều cao cố định.
 *
 * Truyền cả 1.000 dòng vào `data` MỘT lần; grid tự sort / lọc / phân trang
 * trong bộ nhớ — không phát request nào khi thao tác.
 * KHÔNG truyền `columns`: cột tự sinh từ keys của dữ liệu, chỉnh bằng
 * `columnOverrides`. Áp dụng thật: thay generateFakeServices bằng một lần
 * fetch (React Query) rồi truyền response vào `data`.
 */
const overrides: Record<string, Partial<ColumnDef<DemoServiceRow>>> = {
  serviceCode: { headerText: "Mã dịch vụ", width: 130, pinned: "left" },
  serviceName: { headerText: "Tên dịch vụ", width: 220 },
  iconCode: {
    headerText: "Icon",
    width: 70,
    align: "center",
    sortable: false,
    filter: false,
    cell: (row) =>
      row.iconCode ? (
        <i
          className={`fa-light fa-${row.iconCode}`}
          style={{ color: row.color || undefined }}
        />
      ) : null,
  },
  iconName: { headerText: "Nhóm", width: 120 },
  isActive: { headerText: "Hoạt động", width: 100 },
  createdDate: { headerText: "Ngày tạo", width: 120 },
  description: { headerText: "Ghi chú", width: 220 },
  color: { visible: false },
};

const DemoClientGrid = () => {
  // Fake 1.000 dịch vụ — tạo một lần cho cả vòng đời component
  const data = useMemo(() => generateFakeServices(1000), []);

  return (
    <section className={demoStyle.section}>
      <h2 className={demoStyle.sectionTitle}>
        Grid 2 — Client-side, cột map động (1.000 dịch vụ fake)
      </h2>
      <p className={demoStyle.sectionNote}>
        Không khai báo cột — grid tự sinh từ keys của dữ liệu (boolean →
        Có/Không, ngày ISO → vi-VN), chỉnh tên + template icon bằng
        columnOverrides. Sort / lọc / phân trang chạy client, không phát
        request. Chiều cao cố định 480px.
      </p>

      <DataGrid<DemoServiceRow>
        gridKey="demo-client"
        data={data}
        columnOverrides={overrides}
        getRowId={(row) => row.id}
        pageSizeOptions={[20, 50, 100]}
        height={480}
      />
    </section>
  );
};

export default DemoClientGrid;
