import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RoomListView from "./RoomListView";

const phong = {
  id: "r1",
  roomName: "P101",
  roomTypeId: "rt1",
  roomNumber: 101,
  status: 1,
  currentPrice: 1_500_000,
  priceWeekend: 2_000_000,
  acreage: 20,
  numberAdults: 2,
  numberChild: 1,
  numberBedroom: 1,
  numberBathRoom: 1,
  numberBed: 1,
  description: "Phòng hướng biển",
  roomServices: [],
  roomImages: [],
  roomType: { id: "rt1", typeName: "Deluxe", typeCode: "DLX" },
};

// Phòng thứ hai để dòng tổng ra số khác mọi ô đơn lẻ — nếu chỉ có một dòng thì
// tổng trùng giá trị ô, không phân biệt được là grid cộng đúng hay chỉ lặp lại.
const phong2 = {
  ...phong,
  id: "r2",
  roomName: "P102",
  currentPrice: 300_000,
  priceWeekend: 700_000,
  roomType: { id: "rt2", typeName: "Standard", typeCode: "STD" },
};

vi.mock("../api/room.api", () => ({
  getPagingRoom: () =>
    Promise.resolve({ data: [phong, phong2], totalRecord: 2, pageSize: 100 }),
  changeStatus: vi.fn(),
}));
vi.mock("../context/RoomContext", () => ({
  useRoomContext: () => ({ isOpen: false, openDialog: vi.fn() }),
}));
vi.mock("@shared/hooks/useToast", () => ({
  useToast: () => ({ success: vi.fn(), warning: vi.fn(), error: vi.fn() }),
}));
// Dialog kéo theo leaflet/quill, không cần cho phép thử lưới
vi.mock("../components/CreateAndUpdateRoom", () => ({ default: () => null }));

const renderView = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RoomListView />
    </QueryClientProvider>,
  );

describe("RoomListView chạy trên DataGrid", () => {
  // DataGrid lưu cấu hình cột vào localStorage["grid:room"] (prop gridKey), nên
  // test nào ẩn cột sẽ rò sang test sau nếu không dọn.
  beforeEach(() => localStorage.clear());

  it("hiện đúng các cột mặc định", async () => {
    renderView();
    await screen.findByText("Tên phòng");
    screen.getByText("Loại");
    screen.getByText("Giá phòng");
    screen.getByText("Giá cuối tuần");
    screen.getByText("Trạng thái");
    screen.getByText("Thao tác");
  });

  it("cột đặt visible=false thì không hiện", async () => {
    renderView();
    await screen.findByText("Tên phòng");
    expect(screen.queryByText("Số người lớn")).toBeNull();
    expect(screen.queryByText("Diễn giải")).toBeNull();
  });

  it("đổ dữ liệu phòng, đọc được cả field lồng và format N0", async () => {
    renderView();
    await screen.findByText("P101");
    screen.getByText("P102");
    screen.getByText("Deluxe"); // dot-path roomType.typeName
    screen.getByText("Standard");
    screen.getByText("1.500.000"); // format N0 kiểu vi-VN
    screen.getByText("300.000");
  });

  it("thanh công cụ chọn cột nằm ngoài grid và ẩn/hiện được cột", async () => {
    renderView();
    await screen.findByText("Tên phòng");

    // Grid không tự vẽ nút "Cột" nữa — nút chọn cột đã dời lên thanh hành động
    expect(screen.queryByRole("button", { name: "Cột" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "" }));
    fireEvent.click(await screen.findByLabelText("Giá cuối tuần"));
    expect(screen.queryByText("2.700.000")).toBeNull();
  });

  it("dòng tổng cộng đúng tiền của cả hai phòng", async () => {
    renderView();
    await screen.findByText("P101");
    screen.getByText("Tổng");
    screen.getByText("1.800.000"); // tổng giá phòng: 1.500.000 + 300.000
    screen.getByText("2.700.000"); // tổng giá cuối tuần: 2.000.000 + 700.000
  });
});
