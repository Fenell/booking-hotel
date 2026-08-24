import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ServiceListView from "./ServiceListView";

const tienNghi = {
  id: "s1",
  serviceCode: "SP000001",
  serviceName: "Wifi miễn phí",
  kind: 0,
  price: null,
  unit: null,
  description: "Phủ toàn bộ toà nhà",
  nameTypeService: "Tiện nghi phòng",
  isBookable: false,
  isOrderable: false,
  idTypeService: "t1",
  isActive: true,
};

const hangHoa = {
  ...tienNghi,
  id: "s2",
  serviceCode: "SP000002",
  serviceName: "Nước suối",
  kind: 1,
  price: 15000,
  unit: "chai",
  description: "Chai 500ml",
  nameTypeService: "Đồ uống",
};

const getDynamicData = vi.fn(() =>
  Promise.resolve({
    data: [tienNghi, hangHoa],
    total: 2,
    pageNumber: 1,
    pageSize: 20,
  }),
);

vi.mock("@shared/services/dynamic", () => ({
  getDynamicData: (request: unknown) => getDynamicData(request as never),
}));
vi.mock("../context/ServiceContext", () => ({
  useServiceContext: () => ({ isOpen: false, openOrCloseDialog: vi.fn() }),
}));
// Dialog kéo theo react-select và form, không cần cho phép thử lưới
vi.mock("../components/CreateAndUpdateService", () => ({ default: () => null }));

const renderView = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ServiceListView />
    </QueryClientProvider>,
  );

describe("ServiceListView chạy trên DataGrid (server-side)", () => {
  // DataGrid lưu cấu hình cột vào localStorage["grid:service"] (prop gridKey),
  // nên test nào ẩn cột sẽ rò sang test sau nếu không dọn.
  beforeEach(() => {
    localStorage.clear();
    getDynamicData.mockClear();
  });

  it("hiện đúng các cột mặc định", async () => {
    renderView();
    await screen.findByText("Tên dịch vụ");
    screen.getByText("Nhóm");
    screen.getByText("Loại");
    screen.getByText("Giá dịch vụ");
    screen.getByText("Ghi chú");
    screen.getByText("Thao tác");
  });

  it("cột đặt visible=false thì không hiện", async () => {
    renderView();
    await screen.findByText("Tên dịch vụ");
    expect(screen.queryByText("Mã dịch vụ")).toBeNull();
    expect(screen.queryByText("Đơn vị")).toBeNull();
  });

  it("đổ dữ liệu dịch vụ, đổi kind thành nhãn và format giá kiểu N0", async () => {
    renderView();
    await screen.findByText("Wifi miễn phí");
    screen.getByText("Nước suối");
    screen.getByText("Tiện nghi"); // kind 0
    screen.getByText("Hàng hóa"); // kind 1
    screen.getByText("15.000"); // format N0 kiểu vi-VN
  });

  it("gọi get_data trên view dịch vụ với sort mặc định theo tên", async () => {
    renderView();
    await screen.findByText("Wifi miễn phí");

    expect(getDynamicData).toHaveBeenCalledWith(
      expect.objectContaining({
        tableNames: "view_service_with_icon",
        pageNumber: 1,
        pageSize: 20,
        // field FE đã chuyển sang tên cột thật của view
        sorts: [{ name: "service_name", direction: "asc" }],
      }),
    );
  });

  it("đổi sort phát request mới xuống server thay vì sắp xếp tại chỗ", async () => {
    renderView();
    await screen.findByText("Wifi miễn phí");

    fireEvent.click(screen.getByText("Tên dịch vụ"));

    await waitFor(() =>
      expect(getDynamicData).toHaveBeenCalledWith(
        expect.objectContaining({
          sorts: [{ name: "service_name", direction: "desc" }],
        }),
      ),
    );
  });

  it("thanh công cụ chọn cột nằm ngoài grid và ẩn/hiện được cột", async () => {
    renderView();
    await screen.findByText("Tên dịch vụ");

    // Grid không tự vẽ nút "Cột" — nút chọn cột đã dời lên thanh hành động
    expect(screen.queryByRole("button", { name: "Cột" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "" }));
    fireEvent.click(await screen.findByLabelText("Ghi chú"));
    expect(screen.queryByText("Chai 500ml")).toBeNull();
  });
});
