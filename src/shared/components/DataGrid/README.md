# DataGrid — Grid tự dựng (lõi TanStack Table v8, giao diện kiểu AG Grid)

Grid dùng chung của dự án, thay thế Syncfusion Grid cho các màn danh sách.
Toàn bộ nằm trong thư mục này, **CSS độc lập hoàn toàn** với phần còn lại của app
(tokens `--dg-*` riêng, không bị theme Syncfusion CDN hay `index.css` tác động).

Trang demo sống: `/demo-grid` (source: `src/features/demo-grid/`) — là **mẫu
chuẩn để copy áp dụng**: Grid 1 = server-side 1.000 dòng giả lập (option
`fetcher`), Grid 2 = client-side 1.000 dòng + cột map động; cả hai cố định
chiều cao qua prop `height`, resize cột vượt khung tự hiện thanh cuộn ngang.

```
DataGrid/
├── index.ts        # Public API duy nhất — CHỈ import từ đây
├── DataGrid.tsx    # Component gốc
├── types/          # ColumnDef, DataGridProps, ServerGridState, DataGridRef...
├── core/           # constants (OPERATORS...), buildColumns, inferColumns, gridContext
├── header/ filters/ body/ footer/ pagination/ toolbar/ icons/
├── hooks/          # useServerGrid, useGridPersistence, useDebouncedCallback, useGridRef
├── utils/          # mapRequest, persist, pinning, formatCell...
└── styles/         # CSS Modules, mọi token nằm trong root.module.css
```

```ts
import {
  DataGrid, useServerGrid, buildServerFieldMap,
  type ColumnDef, type DataGridRef, type ServerGridState,
} from "@shared/components/DataGrid";
```

---

## 1. Hai chế độ hoạt động

### Server-side (khuyên dùng cho danh sách lớn)

Grid là **controlled component** theo `ServerGridState` — mọi thao tác đổi
trang / sort / lọc phát qua `onStateChange`, dữ liệu do bạn đưa vào qua `data`.
Cách nối chuẩn là hook `useServerGrid` (React Query + `POST /dynamic/get-data`):

```tsx
const grid = useServerGrid<RoomRow>({
  tableNames: "rooms",              // bảng hoặc view Postgres
  queryKey: "room-grid",            // prefix queryKey React Query
  initialPageSize: 20,
  serverFields: buildServerFieldMap(columns), // map field FE → cột snake_case
});

<DataGrid<RoomRow>
  columns={columns}
  data={grid.data}
  getRowId={(r) => r.id}
  rowCount={grid.total}
  state={grid.gridState}
  onStateChange={grid.setGridState}
  isLoading={grid.isLoading}
  isFetching={grid.isFetching}
/>
```

Grid tự nhận diện server mode khi có `onStateChange` (hoặc ép bằng `serverSide`).

**Nối với API bất kỳ (không qua endpoint dynamic)** — truyền `fetcher` thay
cho `tableNames`; hàm nhận nguyên `ServerGridState` (operator FE thô:
`contains`/`eq`/`gt`/`lt`) và trả `{ data, total }`:

```tsx
const grid = useServerGrid<RoomRow>({
  queryKey: "room-grid",
  fetcher: async (state) => {
    const res = await axiosInstance.post("/my-api/rooms", state);
    return { data: res.data.items, total: res.data.total };
  },
});
```

Toàn bộ phần còn lại (updateRow, refetch, keepPreviousData…) giữ nguyên.
Mẫu chạy được: `src/features/demo-grid/components/fakeData.ts` — server giả
lập 1.000 dòng, đúng chữ ký `fetcher`, chỉ cần thay ruột bằng axios.

### Client-side

Truyền **toàn bộ** dataSource vào `data`, KHÔNG truyền `state`/`onStateChange` —
grid tự sort / lọc / phân trang trong bộ nhớ, không phát request nào:

```tsx
<DataGrid<ServiceRow>
  data={allRows}
  getRowId={(r) => r.id}
  pageSizeOptions={[10, 20, 50]}
/>
```

---

## 2. Khai báo cột

### Khai báo tay

```tsx
const columns: ColumnDef<RoomRow>[] = [
  { field: "roomName", headerText: "Tên phòng", width: 220,
    pinned: "left", filter: { type: "text" } },
  { field: "currentPrice", headerText: "Giá", align: "right",
    format: "N0", filter: { type: "number" }, aggregate: "sum" },
  { field: "roomType.typeName", headerText: "Loại" },   // dot-path OK
  { field: "createdDate", headerText: "Ngày tạo",
    serverField: "created_date",                        // xem mục 3
    cell: (row) => new Date(row.createdDate).toLocaleDateString("vi-VN") },
  { field: "actions", headerText: "Thao tác", pinned: "right",
    sortable: false, cell: (row) => <MyActions row={row} /> },
];
```

Các thuộc tính chính của `ColumnDef<T>`:

| Thuộc tính | Ý nghĩa |
|---|---|
| `field` | dot-path trên dữ liệu camelCase, đồng thời là **id cột** trong mọi state |
| `headerText` | tiêu đề cột |
| `serverField` | tên cột thật (snake_case) gửi BE — chỉ cần khi camelToSnake không khớp |
| `width` / `minWidth` / `maxWidth` | px |
| `visible` | mặc định `true` |
| `align` | `"left" \| "center" \| "right"` |
| `format` | `"N0"` — số kiểu vi-VN (10.000) |
| `pinned` | `"left" \| "right"` — ghim cột |
| `sortable` / `resizable` | mặc định `true` |
| `filter` | `{ type: "text" }` (contains) hoặc `{ type: "number", operators?: ["eq","gt","lt"] }` |
| `tooltip` | `false` để tắt tooltip nội dung tràn của riêng cột (mặc định theo grid) |
| `cell` | template — `(row: T) => ReactNode` |
| `aggregate` | `"sum" \| "avg" \| "count"` hoặc hàm — fallback client cho dòng tổng |

### Map động từ dữ liệu (không cần khai báo cột)

Bỏ trống `columns` — grid tự sinh cột từ record đầu tiên của `data`:
number → căn phải + N0 + lọc số; boolean → Có/Không; chuỗi ISO date → ngày
vi-VN; field `id` → ẩn; object lồng → bỏ qua. Chỉnh từng cột bằng
`columnOverrides` (dùng được cả khi khai báo tay):

```tsx
<DataGrid<ServiceRow>
  data={rows}
  getRowId={(r) => r.id}
  columnOverrides={{
    serviceName: { headerText: "Tên dịch vụ", width: 220 },
    idIcon: { visible: false },
    iconCode: { cell: (r) => <i className={`fa-light fa-${r.iconCode}`} /> },
  }}
/>
```

---

## 3. Lọc / sort server — những điều PHẢI biết

- Request đi **thẳng vào Postgres** (`public.get_data`) nên `field` trong
  `filters`/`sorts` phải là **tên cột thật snake_case**. Grid tự chuyển
  camelCase → snake_case; ca lệch quy tắc phải khai `serverField`
  (ví dụ thật: `createdDate` → cột `created_date`, camelToSnake ra `create_date` là sai).
- Operator BE chấp nhận (kiểm chứng 2026-08-23): `=`, `>`, `<`, `>=`, `<=`,
  `LIKE`, `ILIKE` — chuỗi lạ fallback về `=`. Map FE→BE nằm **duy nhất** ở
  `core/constants.ts` (`OPERATORS`). Lọc text dùng `ILIKE` (không phân biệt
  hoa/thường — cần script `BE/db/2026-08-23_them-ilike-vao-build-where-clause.sql`
  đã apply vào DB), value tự bọc `%...%` ở `mapRequest`.
- Chỉ **một** sort được áp dụng (function DB lấy phần tử đầu) — grid đã đặt
  `enableMultiSort: false`. Chu trình click header: asc → desc → bỏ sort.
- Đổi sort / lọc / cỡ trang đều tự reset về trang 1.
- Response của `get_data`: `{ pageNumber, pageSize, total, data }` (sau
  camelcaseKeys) — tổng bản ghi là **`total`**.

---

## 4. Dòng tổng (footer)

Ưu tiên `footerData` (số do server hoặc bạn tính) — key theo `field`;
thiếu key nào thì rơi về `aggregate` của cột đó (tính client trên `data`):

```tsx
<DataGrid footerData={{ currentPrice: 123_000_000 }} footerLabel="Tổng" ... />
```

Hiện `get_data` chưa trả aggregate — muốn tổng toàn tập dữ liệu (không chỉ
trang hiện tại) phải sửa function trong DB rồi truyền vào `footerData`.

## 5. Chọn dòng

```tsx
<DataGrid enableSelection onSelectionChange={(ids) => ...} ... />
```

Selection key theo `getRowId` nên **giữ nguyên khi chuyển trang / refetch**.
Truyền `selectedRowIds` nếu muốn controlled. Checkbox header = chọn cả trang hiện tại.

## 6. Cập nhật dòng KHÔNG refetch (server mode)

`useServerGrid` trả các hàm ghi vào **React Query cache** — refetch/invalidate
sau đó không làm mất thay đổi (đừng bao giờ mutate mảng `data` trực tiếp):

```tsx
grid.updateRow(id, { status: 1 });   // merge một phần
grid.replaceRow(id, newRow);
grid.addRow(row);                    // optimistic, total + 1
grid.removeRow(id);                  // total - 1 — nên grid.refetch() sau khi server xác nhận
gridRef.current?.flashRow(id);       // nháy vàng dòng vừa đổi
```

## 7. API qua ref

```tsx
const gridRef = useRef<DataGridRef<RoomRow>>(null);
<DataGrid ref={gridRef} ... />
```

| Nhóm | Method |
|---|---|
| Selection | `getSelectedRowIds` `getSelectedRows` `setRowSelected` `selectAllCurrentPage` `deselectAll` |
| Cột | `setColumnVisible` `showColumns` `hideColumns` `pinColumn` `setColumnWidth` `getColumnState` `applyColumnState` `resetColumns` |
| Sort/Lọc/Trang | `setSort` `setFilter` `clearFilter` `clearAllFilters` `goToPage` `setPageSize` `getPageInfo` |
| Row | `getRowNode` `getDisplayedRowNodes` `getRowElement` `scrollToRow` `flashRow` |
| Tiện ích | `getRows` `getRow` `exportCsv` `scrollToTop` |

Ở server mode, `setSort`/`setFilter`/`goToPage`… đi qua `onStateChange`
(không tự ý đổi dữ liệu). `setFilter` qua ref tự đồng bộ vào ô floating filter.
`exportCsv` xuất các dòng đang hiển thị, BOM UTF-8 để Excel đọc tiếng Việt đúng.

## 8. Row props

```tsx
<DataGrid
  onRowClick={(row, e) => ...}
  onRowDoubleClick={(row, e) => ...}
  rowClassName={(row) => (row.status === 2 ? myStyle.rowStopped : undefined)}
  rowHeight={36}
/>
```

## 9. Tooltip nội dung bị cắt

Ô (và tiêu đề cột) nào bị `text-overflow: ellipsis` cắt mất chữ thì hover vào
sẽ hiện tooltip nội dung đầy đủ sau **300ms**. Ô hiển thị vừa đủ thì **không**
hiện gì — grid đo `scrollWidth > clientWidth` ngay lúc hover chứ không đoán
theo độ dài chuỗi.

```tsx
<DataGrid
  enableTooltip          // mặc định true, đặt false để tắt cả grid
  tooltipDelay={300}     // ms, mặc định 300
  columns={[
    { field: "note", headerText: "Ghi chú" },
    { field: "action", headerText: "", cell: renderButtons, tooltip: false },
  ]}
/>
```

Chi tiết cài đặt:

- Nội dung tooltip lấy từ `textContent` của ô → cell template cũng dùng được;
  ô chỉ có icon (không có chữ) thì bỏ qua, không hiện tooltip rỗng.
- Cả grid dùng **một** tooltip duy nhất (`tooltip/useCellTooltip.ts`), render
  qua portal ra `document.body` vì `.root` có `overflow: hidden` sẽ cắt mất nó.
  Vì nằm ngoài `.root`, style của nó (`styles/tooltip.module.css`) tự khai
  báo màu/kích thước, **không** đọc token `--dg-*`.
- Vị trí đo lại đúng lúc sắp hiện (không phải lúc hover), tự lật xuống dưới khi
  sát mép trên và tự kẹp lại cho khỏi tràn ngang màn hình.
- Cuộn body/cuộn trang/resize cửa sổ → tooltip ẩn ngay để không bị "mồ côi".
- Hiệu ứng: mờ dần + trượt nhẹ 120ms; tôn trọng `prefers-reduced-motion`.

## 10. Lưu cấu hình cột

Truyền `gridKey` ⇒ tự lưu **thứ tự + ẩn/hiện + độ rộng** cột vào
`localStorage["grid:<gridKey>"]` (debounce 500ms, schema có `version` để
migrate sau). Cột mới thêm vào code tự nối cuối; cột bị xóa khỏi code tự bỏ.
`ref.resetColumns()` xóa bản lưu và về mặc định. Không truyền `gridKey` = không lưu.

## 11. Đặt grid vào layout — tránh thanh cuộn ngang "nhảy" ra page

Grid tự cuộn ngang bên trong (`.scrollArea` overflow auto). Nhưng nếu một
**tổ tiên** của grid là flex/grid item mà không có `min-width: 0`, min-content
của bảng sẽ lan ngược lên làm tổ tiên phình rộng → thanh cuộn xuất hiện ở
page thay vì trong grid (bệnh kinh điển của `minmax(auto, 1fr)` /
`min-width: auto`).

Quy tắc: **mọi flex/grid item trên đường từ grid lên viewport phải có
`min-width: 0`** (hoặc track khai báo `minmax(0, 1fr)`). Layout `Main` của
app đã được sửa (`main { min-width: 0 }` trong `Main.module.css`); nếu bạn
dựng layout con mới (flex-row, grid) hãy nhớ quy tắc này.

Tương tự chiều dọc: truyền prop `height` để cố định chiều cao **vùng dữ liệu**
(grid tự cuộn dọc bên trong); không truyền thì grid `flex: 1` — giãn theo
container cha đã giới hạn chiều cao.

**Cấu trúc cuộn (kiểu AG Grid)**: grid gồm 3 viewport — header (kèm hàng
filter) và dòng tổng nằm trong viewport `overflow: hidden` cố định, vùng dữ
liệu là viewport cuộn duy nhất → thanh cuộn dọc/ngang luôn nằm TRONG vùng dữ
liệu, không chạy suốt cả grid. Cuộn ngang đồng bộ `scrollLeft` từ body sang
header/footer; bề rộng thanh cuộn dọc được bù bằng một spacer thật đặt cạnh
header/footer viewport, đo qua ResizeObserver vào biến `--dg-sbw`.

Vùng dữ liệu để `overflow-y: scroll` (luôn hiện thanh cuộn dọc) chứ **không**
dùng `auto` hay `scrollbar-gutter: stable`. Lý do: dải bên phải phải luôn là
thanh cuộn thật do trình duyệt vẽ. Để `auto` thì cột ghim phải nhảy 15px khi
đổi giữa trang có và không có thanh cuộn; để `stable` thì có chừa chỗ nhưng
không ai vẽ lên dải đó, mà nội dung cuộn ngang vẫn tràn qua → lộ dữ liệu ngay
bên phải cột ghim.

**Vì sao `overflow-y: scroll` là bắt buộc, không phải tùy chọn thẩm mỹ** —
Chrome neo `position: sticky; right: 0` theo hai kiểu khác nhau:

| Dải bên phải vùng cuộn | Chrome neo `right: 0` vào |
|---|---|
| Thanh cuộn **thật** | scrollport (đã trừ thanh cuộn) — đúng spec |
| Chỗ trống do `scrollbar-gutter: stable` | padding box, **tính cả** dải trống |

`getPinnedStyle` dùng chung cho `th`/`td`/`tfoot` nên chỉ đúng khi hai bên neo
giống nhau. Header luôn `overflow: hidden` (không có thanh cuộn) nên neo ở mép
phải viewport của nó; body chỉ neo trùng chỗ đó khi có thanh cuộn **thật**. Để
body ở `auto` hoặc `scrollbar-gutter: stable` là rơi vào hàng thứ hai của bảng
trên: cột ghim ở header và body lệch nhau đúng bề rộng thanh cuộn, và dải trống
đó còn để lộ nội dung cột phía sau khi cuộn ngang.

Đã thử bù bằng `right: calc(<offset>px + var(--dg-sbw, 0px))` cho riêng body —
**không dùng được**, vì nó chỉ đúng cho hàng thứ hai; khi body có thanh cuộn
thật thì thành lùi quá 15px và hở khe. Cách đúng là làm cho dải bên phải luôn
là thanh cuộn thật, tức `overflow-y: scroll`.

## 12. Tùy biến giao diện

Toàn bộ token nằm trong `.root` của `styles/root.module.css` (`--dg-accent`,
`--dg-header-bg`, `--dg-row-height`, `--dg-font-size`…). Muốn theme khác cho
một instance: truyền `className` và override biến `--dg-*` trong class đó.
**Không** style bằng cách đánh vào class đã hash của grid từ ngoài.

Quy tắc giữ tính độc lập khi sửa grid: không dùng biến CSS của repo, không
class `e-*` (đụng theme Syncfusion CDN), không `fa-*` bên trong grid — icon
là SVG inline trong `icons/icons.tsx`. (Cell template ở tầng page thì dùng
Font Awesome thoải mái.)

---

## Định hướng v2 (đã chốt, chưa làm): batch edit + điều hướng phím kiểu Excel

Khi làm v2, các mấu neo sau ĐÃ có sẵn — đừng phá:

- Mọi `<td>` render qua **một** component `BodyCell`, gắn `data-row-id` /
  `data-col-id` / `rowIndex` / `colIndex` → focus manager định vị theo tọa độ.
- Giá trị hiển thị đọc qua **một** hàm `utils/formatCell.ts` → chèn draft
  overlay của batch edit vào đúng một chỗ.
- Vùng cuộn có `tabIndex={0}` → gắn listener phím Ở CONTAINER, không per-cell.
- `core/gridContext.ts` là điểm mở rộng state (`focusedCell`, `editingCell`,
  `draftChanges` sẽ thêm vào đây).
- Nguyên `ColumnDef` nằm trong `meta.gridColDef` của TanStack → thêm
  `editable`/`editor` vào type là pipeline tự mang theo.
- Mọi state key theo `getRowId`, không theo index.

## Ghi chú phiên bản & hạn chế đã biết

- Pin `@tanstack/react-table@^8.21.3`. **Đừng nâng lên v9** khi chưa chủ đích
  migrate — v9 đổi kiến trúc (feature-based + store reactivity), đã đo thử:
  106 lỗi compile nếu nâng thẳng. Thời điểm hợp lý để nâng là lúc làm v2.
- Virtualization, kéo-thả đổi thứ tự cột, multi-sort: chưa có (v2).
- `addRow`/`removeRow` làm số dòng trang hiện tại lệch `pageSize` — chấp nhận
  cho optimistic UI, gọi `refetch()` sau khi server xác nhận.
