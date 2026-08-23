import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import ServicesInput from "./ServicesInput";
import type { RoomCreateRequest, RoomService } from "../types/room.type";

vi.mock("@features/service", () => ({
  useServiceOptions: () => ({
    options: [
      { value: "s1", label: "Wifi" },
      { value: "s2", label: "Ăn sáng" },
      { value: "s3", label: "Đưa đón" },
    ],
    isPending: false,
  }),
}));

let captured: RoomService[] = [];

const Harness = ({ initial }: { initial: RoomService[] }) => {
  const methods = useForm<RoomCreateRequest>({
    defaultValues: { roomServices: initial },
  });
  return (
    <FormProvider {...methods}>
      <ServicesInput />
      <button
        type="button"
        onClick={() => {
          captured = methods.getValues("roomServices");
        }}
      >
        capture
      </button>
    </FormProvider>
  );
};

const readFormValue = () => {
  fireEvent.click(screen.getByText("capture"));
  return captured;
};

describe("ServicesInput — nút chọn/bỏ chọn tất cả", () => {
  const chonHet: RoomService[] = [
    { serviceId: "s1" },
    { serviceId: "s2" },
    { serviceId: "s3" },
  ];
  const chonMotPhan: RoomService[] = [{ serviceId: "s1" }];

  it("đang trống thì nhãn là 'Chọn tất cả'", () => {
    render(<Harness initial={[]} />);
    screen.getByText("Chọn tất cả");
  });

  it("bấm khi đang trống thì chọn hết", () => {
    render(<Harness initial={[]} />);
    fireEvent.click(screen.getByText("Chọn tất cả"));
    expect(readFormValue()).toEqual(chonHet);
  });

  it("đang chọn hết thì nhãn là 'Bỏ chọn tất cả'", () => {
    render(<Harness initial={chonHet} />);
    screen.getByText("Bỏ chọn tất cả");
  });

  it("bấm khi đang chọn hết thì gỡ sạch", () => {
    render(<Harness initial={chonHet} />);
    fireEvent.click(screen.getByText("Bỏ chọn tất cả"));
    expect(readFormValue()).toEqual([]);
  });

  // Trường hợp thực tế hay gặp nhất: phòng chỉ gắn vài dịch vụ trong số tất cả
  // dịch vụ của hệ thống. Bản sửa trước sai đúng ở đây — nút hiện "Chọn tất cả"
  // nên bấm vào lại gắn thêm toàn bộ dịch vụ vào phòng.
  it("đang chọn một phần thì nhãn vẫn là 'Bỏ chọn tất cả'", () => {
    render(<Harness initial={chonMotPhan} />);
    screen.getByText("Bỏ chọn tất cả");
  });

  it("bấm khi đang chọn một phần thì gỡ sạch, KHÔNG gắn thêm", () => {
    render(<Harness initial={chonMotPhan} />);
    fireEvent.click(screen.getByText("Bỏ chọn tất cả"));
    expect(readFormValue()).toEqual([]);
  });

  it("bỏ tick từng ô cho tới hết", () => {
    render(<Harness initial={chonHet} />);
    fireEvent.click(screen.getByLabelText("Wifi"));
    fireEvent.click(screen.getByLabelText("Ăn sáng"));
    fireEvent.click(screen.getByLabelText("Đưa đón"));
    expect(readFormValue()).toEqual([]);
  });

  it("gỡ hết bằng tay thì nhãn quay về 'Chọn tất cả'", () => {
    render(<Harness initial={chonMotPhan} />);
    fireEvent.click(screen.getByLabelText("Wifi"));
    screen.getByText("Chọn tất cả");
  });
});
