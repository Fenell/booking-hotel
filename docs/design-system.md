# Design system — CMS Đặt phòng

Nguồn sự thật về màu, chữ, khoảng cách và chuyển động của toàn bộ FE.
File token: [`src/styles/tokens.css`](../src/styles/tokens.css) — nạp đầu tiên trong `src/index.css`.

> **Một quy tắc duy nhất phải nhớ**: component đọc token **tầng semantic**
> (`--color-*`, `--space-*`, `--text-*`…). Không viết hex, không viết `12px`
> thẳng trong file `.module.css`.

---

## 1. Vì sao có file này

Trước đây FE có 173 giá trị màu viết thẳng trong CSS, khoảng 25 mã hex cho cùng
vài vai trò (riêng "trắng" có `#fff`, `#ffffff`, `white`), 12 cỡ chữ lẫn lộn kể
cả `12.5px` và `11.5px`, cùng 4 hệ biến rời rạc không liên quan gì nhau
(`--base-clr`, `--dg-*`, `--toast-*`, `--switch-*`). Có cả biến viết sai cú pháp
(`--side-bar-item-active: .d6e3fb`, thiếu dấu `#`) nên mục menu đang mở nhiều
tháng nay **không có nền** mà không ai để ý.

Hệ quả thực tế: đổi một màu phải sửa hàng chục chỗ, và không có cách nào biết
"xanh này" với "xanh kia" có cùng ý nghĩa hay không.

---

## 2. Kiến trúc 3 tầng

```
Tầng 1 — PRIMITIVE    --blue-800: #1e40af       giá trị thô, KHÔNG dùng trực tiếp
       ↓
Tầng 2 — SEMANTIC     --color-primary: var(--blue-800)    vai trò — component dùng tầng này
       ↓
Tầng 3 — ALIAS        --accent-clr: var(--color-primary)  tên cũ, chỉ để file cũ không vỡ
```

Lý do tách tầng: đổi màu thương hiệu chỉ sửa **một dòng** ở tầng 2; làm dark mode
chỉ định nghĩa lại tầng 2 trong khối `[data-theme="dark"]`, không đụng tầng 1 và
không đụng bất kỳ component nào.

**Tầng 3 nằm trong chính component, không nằm ở `:root`.** Mỗi component khai
biến riêng ở scope của nó: `.button { --btn-bg: var(--color-primary) }`,
`.root { --dg-border: var(--color-border, …) }`. Với CSS Modules thì như vậy gọn
hơn: component tự khép kín và `:root` không phình lên hàng trăm biến.

Tầng alias tên-biến-cũ (`--base-clr`, `--border-clr`, `--nav-height`…) **đã bị
xoá ngày 05/09/2026** sau khi 35 file CSS dọn xong — không còn file nào đọc tới.
Đừng thêm lại.

---

## 3. Bảng màu

Hướng đã chốt: **navy chuyên nghiệp** — hợp màn hình vận hành nhiều dữ liệu, đọc
lâu không mỏi. Mọi cặp chữ/nền dưới đây đều đạt tối thiểu 4.5:1 (WCAG AA).

### Nền và bề mặt

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--color-bg` | `#f8fafc` | nền trang |
| `--color-surface` | `#ffffff` | thẻ, bảng, modal |
| `--color-surface-raised` | `#ffffff` | popover, dropdown (kèm shadow) |
| `--color-surface-sunken` | `#f1f5f9` | header bảng, vùng lõm |
| `--color-surface-hover` | `#f1f5f9` | hàng lưới khi rê chuột |
| `--color-surface-active` | `#eff6ff` | hàng đang chọn |
| `--color-overlay` | `rgba(15,23,42,.55)` | lớp phủ sau modal |

### Chữ

| Token | Giá trị | Tương phản trên nền trắng | Dùng cho |
|---|---|---|---|
| `--color-text` | `#0f172a` | 17.9:1 | chữ chính |
| `--color-text-secondary` | `#475569` | 8.6:1 | nhãn, mô tả |
| `--color-text-muted` | `#64748b` | 4.8:1 | chú thích |
| `--color-text-disabled` | `#94a3b8` | 2.8:1 | **chỉ** cho phần tử đã vô hiệu hoá |
| `--color-text-inverse` | `#ffffff` | — | chữ trên nền đậm |

### Thương hiệu và trạng thái nghiệp vụ

| Token | Giá trị | Nghĩa trong nghiệp vụ |
|---|---|---|
| `--color-primary` | `#1e40af` | hành động chính, mục menu đang mở |
| `--color-secondary` | `#2563eb` | link, nhấn phụ, sort đang bật |
| `--color-success` | `#047857` | đã xác nhận, đã thanh toán, phòng trống |
| `--color-warning` | `#b45309` | chờ xử lý, **sắp hết hạn giữ chỗ 15 phút** |
| `--color-danger` | `#dc2626` | huỷ đơn, xoá, quá hạn |
| `--color-info` | `#2563eb` | thông báo trung tính |
| `--color-neutral` | `#475569` | nút phụ |

Mỗi màu trạng thái có thêm biến thể `-soft` (nền nhạt cho tag/toast) và
`-border`. Chữ trên nền `-soft` luôn dùng `--color-text`, không dùng chính màu đó.

> **Màu không bao giờ là tín hiệu duy nhất.** Trạng thái đơn, kết quả thao tác,
> cảnh báo — luôn kèm chữ hoặc icon. Người mù màu đỏ/lục chiếm ~8% nam giới, và
> đây là phần mềm vận hành: nhầm "đã thanh toán" với "đã huỷ" là mất tiền thật.

### Quy tắc cho bề mặt tối (sidebar, màn đăng nhập)

Trên nền tối, **không dùng nguyên màu đã chọn cho nền sáng** — nhấc lên một bậc
sáng hơn thì mới nổi. Cụ thể: nút chính ở màn đăng nhập dùng `--color-secondary`
(`#2563eb`) chứ không phải `--color-primary` (`#1e40af`), vì navy đặt trên thẻ
kính mờ nền navy sẽ chìm. Đây cũng là nguyên tắc sẽ áp dụng khi làm dark mode.

Tiêu điểm bàn phím trên nền tối phải đảo chiều: viền **trắng** đặc kèm quầng
trắng mờ, thay cho viền xanh của nền sáng.

### Sidebar (bề mặt tối, có bộ token riêng)

`--color-sidebar-bg` `#16233e` · `--color-sidebar-text` `#e2e8f0` ·
`--color-sidebar-active` `#1d4ed8` · `--color-sidebar-hover` trắng 8%.

Sidebar là nền tối nên **không được dùng `--color-primary` cho chữ** ở đây —
navy trên navy không đọc được. Đó chính là lỗi có sẵn trong bản cũ
(`li.active a { color: var(--accent-clr) }`), nay đã sửa.

---

## 4. Chữ

Giữ **Inter** — đã dùng sẵn, chữ số phân biệt rõ, hợp màn hình dày dữ liệu.
Không đổi sang font khác chỉ vì lý do thẩm mỹ: đổi font nền là đổi bề rộng mọi
cột lưới.

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--text-2xs` | 11px | badge, nhãn siêu nhỏ |
| `--text-xs` | 12px | chú thích, nút nhỏ |
| `--text-sm` | 13px | ô lưới, chữ trong nút |
| `--text-md` | **14px** | cỡ nền của CMS |
| `--text-lg` | 16px | tiêu đề modal |
| `--text-xl` / `--text-2xl` | 18 / 20px | tiêu đề mục, breadcrumb |
| `--text-3xl` / `--text-4xl` | 24 / 32px | tiêu đề trang, số liệu lớn |

Độ đậm: `--weight-regular` 400 · `--weight-medium` 500 (nhãn) ·
`--weight-semibold` 600 (tiêu đề, mục đang chọn) · `--weight-bold` 700.

**Cột số phải dùng class `.tabular-nums`** (khai trong `index.css`). Không có nó,
chữ số Inter rộng khác nhau nên cột tiền/số đêm nhảy qua nhảy lại mỗi lần dữ liệu
đổi.

---

### Màu dữ liệu không phải màu giao diện

Màu do người dùng chọn và lưu trong DB (`icons.color`) **không** lấy từ token —
token là chuyện của giao diện, còn cái này là dữ liệu. Nhưng giá trị mặc định
phải có một chỗ duy nhất: `DEFAULT_ICON_COLOR` trong `features/icon/`. Trước đây
ba nơi dùng ba màu khác nhau (`#2796fd`, `#21a9e4`, `#5fb2ed`) nên cùng một icon
hiện ra ba sắc xanh tuỳ màn hình.

Cùng lý do đó, logo Google/GitHub/Facebook ở màn đăng nhập giữ nguyên mã màu
thương hiệu — token hoá chúng là sai.

## 5. Khoảng cách

Thang bậc 4px, thiên về **dày** vì đây là màn vận hành chứ không phải trang
giới thiệu:

`--space-3xs` 2 · `--space-2xs` 4 · `--space-xs` 6 · `--space-sm` 8 ·
`--space-md` 12 · `--space-lg` 16 · `--space-xl` 20 · `--space-2xl` 24 ·
`--space-3xl` 32 · `--space-4xl` 40

Bo góc: `--radius-xs` 4 (ô nhỏ) · `--radius-sm` 6 (input, nút) ·
`--radius-md` 8 (thẻ, popover) · `--radius-lg` 12 (modal) · `--radius-full`.

Đổ bóng 4 bậc theo độ nổi: `--shadow-xs` (viền nhẹ) → `--shadow-sm` (thẻ) →
`--shadow-md` (dropdown, toast) → `--shadow-lg` (modal). Đừng chế bóng mới.

Chiều cao control: `--control-height-sm` 26 · `--control-height-md` 32 (input và
nút mặc định) · `--control-height-lg` 38.

---

## 6. Z-index — 8 bậc, không dùng số ngoài thang

| Token | Giá trị | Lớp |
|---|---|---|
| `--z-base` | 0 | nội dung |
| `--z-sticky` | 100 | header dính, breadcrumb |
| `--z-nav` | 200 | thanh điều hướng |
| `--z-dropdown` | 300 | popover, menu select |
| `--z-overlay` | 900 | lớp phủ |
| `--z-modal` | 1000 | modal |
| `--z-toast` | 1100 | toast |
| `--z-tooltip` | 1200 | tooltip (luôn trên cùng) |

Bản cũ có `z-index: 9999` ở 3 chỗ khác nhau và `z-index: 9` cho backdrop nằm
dưới `z-index: 10` của modal — đúng nhưng chỉ là may. Nay thứ tự do thang quyết định.

**Ngoại lệ có chủ đích**: `--dg-z-*` của DataGrid (1–6) là thang **cục bộ** bên
trong stacking context của `.root`, không so sánh với thang app. Đừng gộp hai cái.

---

## 7. Chuyển động

`--duration-instant` 80ms (phản hồi bấm) · `--duration-fast` 150ms (hover, đổi
màu) · `--duration-normal` 220ms (mở dropdown) · `--duration-slow` 320ms (modal).
Easing: `--ease-out` cho thứ đi vào, `--ease-in-out` cho thứ di chuyển.

Bản cũ có `transition: all 0.5s ease` trên input — nửa giây để đổi màu viền là
quá chậm, cảm giác như trang bị lag. Nay mọi tương tác nhỏ đều ≤150ms.

`index.css` đã cắt gần hết animation khi người dùng bật **giảm chuyển động** của
hệ điều hành (`prefers-reduced-motion`). Đừng viết animation bỏ qua điều này.

---

## 8. Tiêu điểm bàn phím

`:focus-visible` toàn cục vẽ viền `--focus-outline` (2px xanh, offset 2px).
Ô nhập dùng thêm `--focus-ring` (quầng sáng 3px).

**Không bao giờ viết `outline: none`** mà không thay bằng dấu hiệu khác. Lễ tân
nhập liệu bằng bàn phím cả ngày — mất viền tiêu điểm là mất khả năng làm việc.

Rê chuột và tiêu điểm bàn phím phải khác nhau: hover chỉ đậm viền, focus mới có
quầng sáng. Bản cũ gộp `:hover, :focus` chung nên không phân biệt được.

---

## 9. DataGrid nối vào hệ token thế nào

DataGrid cố ý **khép kín** (xem `src/shared/components/DataGrid/README.md`).
Nay mỗi biến `--dg-*` đọc token của app **nhưng luôn kèm giá trị dự phòng**:

```css
--dg-border: var(--color-border, #e2e8f0);
```

Nhúng grid vào trang không có `tokens.css` thì nó vẫn hiển thị đúng; nằm trong
app thì tự ăn theo bảng màu chung. Muốn đổi giao diện grid thì đổi token app,
đừng sửa từng file trong `DataGrid/styles/`. Cỡ chữ trong grid cũng đi qua token
theo đúng kiểu đó (`var(--text-xs, 12px)`).

**Cột căn phải tự có chữ số cùng bề rộng.** `.alignRight` của grid đã kèm
`font-variant-numeric: tabular-nums`, nên khai `align: "right"` cho cột số là đủ
— không phải nhớ gắn thêm class `.tabular-nums` (class đó dành cho số nằm ngoài
lưới: thẻ thống kê, hoá đơn, ô tiền trong form).

---

## 10. Dark mode — khung đã sẵn, chưa bật

`tokens.css` có sẵn khối `:root[data-theme="dark"]` (đang comment). Khi làm:

1. Bỏ comment, định nghĩa lại **chỉ token tầng 2**.
2. Gắn `data-theme="dark"` lên `<html>`, đổi `color-scheme` theo.
3. **Cân lại tương phản riêng cho tông tối** — không đảo ngược giá trị của tông
   sáng. Màu bão hoà cao trên nền tối bị chói; phải dùng biến thể nhạt/xỉn hơn.
4. Kiểm cả trạng thái hover/focus/disabled ở tông tối, không chỉ trạng thái nghỉ.

Không đụng tới component nào — đó là mục đích của việc tách 3 tầng.

---

## 11. Một cái bẫy của CSS Modules

CSS Modules **chỉ băm tên class**, không băm selector phần tử. Viết `h2 { ... }`
trong một file `.module.css` là khai báo **toàn cục** cho cả app.

Bản trước `Login.module.css` có `h2 { color: white; font-size: 32px }` — quy tắc
này áp cho mọi `<h2>` ở mọi màn, nên tiêu đề trong `demo-grid` (chỉ khai
`font-size`, không khai `color`) thành chữ trắng trên nền trắng. Nay đã đổi
thành class `.title`.

Cái bẫy này đã cắn hai lần. Lần thứ hai: `NavBar.module.css` mở đầu bằng
`nav { position: fixed; left: 240px }` — khi thanh menu bên trái đổi sang thẻ
`<nav>` cho đúng ngữ nghĩa, nó lập tức bị đẩy sang phải và chồng lên nội dung.
Nay quy tắc đó đã đổi thành `#nav-bar` (id được băm nên có scope).

Quy tắc: trong `.module.css` **chỉ viết selector class hoặc id**. Cần đặt kiểu
cho thẻ trần thì lồng nó dưới một class (`.form-group label { ... }`).

## 12. Checklist khi thêm màn hình mới

- [ ] Không có hex nào trong file `.module.css` mới
- [ ] Khoảng cách lấy từ `--space-*`, không có số lẻ
- [ ] Cột số có `.tabular-nums`
- [ ] Mỗi màn chỉ **một** nút chính; còn lại là `outline` hoặc `default`
- [ ] Trạng thái có chữ/icon kèm màu
- [ ] Tab được qua mọi control, viền tiêu điểm luôn thấy
- [ ] Ô nhập có nhãn thật, lỗi hiện ngay dưới ô (không chỉ toast)
- [ ] Hành động xoá dùng `--color-danger` và tách khỏi nhóm nút thường
