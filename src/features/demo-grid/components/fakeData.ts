import type { ServerGridState, ServerPage } from "@shared/components/DataGrid";
import type { DemoRoom } from "./demoRoomCols";
import type { DemoServiceRow } from "./demoServiceCols";

/**
 * PRNG seed cố định (mulberry32) — dữ liệu fake GIỐNG NHAU giữa các lần
 * reload/render, để test sort/lọc/phân trang có thể lặp lại được.
 */
const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const ROOM_TYPES = ["Deluxe", "Superior", "Suite", "Villa", "Standard", "Family"];
const VIEWS = ["hướng biển", "hướng phố", "hướng hồ bơi", "hướng vườn", "hướng núi"];

export const generateFakeRooms = (count = 1000): DemoRoom[] => {
  const rand = mulberry32(2026);
  return Array.from({ length: count }, (_, i) => {
    const basePrice = (Math.floor(rand() * 46) + 5) * 100_000; // 500k → 5tr
    const createdAt =
      new Date(2024, 0, 1).getTime() + Math.floor(rand() * 900) * 86_400_000;
    return {
      id: `room-${i + 1}`,
      roomTypeId: "",
      roomNumber: 100 + i,
      roomName: `${ROOM_TYPES[i % ROOM_TYPES.length]} ${VIEWS[Math.floor(rand() * VIEWS.length)]} ${i + 1}`,
      status: Math.floor(rand() * 3),
      currentPrice: basePrice,
      priceWeekend: Math.round(basePrice * 1.3),
      acreage: Math.floor(rand() * 60) + 20,
      numberAdults: Math.floor(rand() * 3) + 1,
      numberChild: Math.floor(rand() * 3),
      numberBedroom: Math.floor(rand() * 3) + 1,
      numberBathroom: Math.floor(rand() * 2) + 1,
      numberBed: Math.floor(rand() * 4) + 1,
      description:
        rand() > 0.5 ? "Phòng có ban công, đầy đủ tiện nghi" : undefined,
      createdDate: new Date(createdAt).toISOString(),
    };
  });
};

const ICONS = [
  { code: "wifi", name: "Wifi", color: "#21a9e4" },
  { code: "mug-hot", name: "Cà phê", color: "#8b5e3c" },
  { code: "car", name: "Đưa đón", color: "#4b5563" },
  { code: "bell-concierge", name: "Lễ tân", color: "#b45309" },
  { code: "dumbbell", name: "Gym", color: "#dc2626" },
  { code: "utensils", name: "Ăn uống", color: "#15803d" },
  { code: "spa", name: "Spa", color: "#7c3aed" },
];

export const generateFakeServices = (count = 1000): DemoServiceRow[] => {
  const rand = mulberry32(7);
  return Array.from({ length: count }, (_, i) => {
    const icon = ICONS[i % ICONS.length];
    const createdAt =
      new Date(2024, 0, 1).getTime() + Math.floor(rand() * 900) * 86_400_000;
    return {
      id: `svc-${i + 1}`,
      serviceCode: `SP${String(i + 1).padStart(6, "0")}`,
      serviceName: `${icon.name} gói ${i + 1}`,
      isActive: rand() > 0.25,
      createdDate: new Date(createdAt).toISOString(),
      iconCode: icon.code,
      iconName: icon.name,
      color: icon.color,
      description: rand() > 0.6 ? "Dịch vụ tiêu chuẩn của khách sạn" : undefined,
    };
  });
};

// "Database" giả nằm trong bộ nhớ — tạo một lần cho cả phiên
const ROOM_DB = generateFakeRooms(1000);

/**
 * SERVER GIẢ LẬP — mẫu chuẩn cho option `fetcher` của useServerGrid:
 * nhận nguyên ServerGridState (operator FE thô: contains/eq/gt/lt),
 * tự áp lọc → sort → phân trang rồi trả { data, total } sau độ trễ mạng giả.
 * Nối API thật: thay ruột hàm này bằng axios của bạn, giữ nguyên chữ ký.
 */
export const fetchFakeRooms = async (
  state: ServerGridState,
): Promise<ServerPage<DemoRoom>> => {
  await new Promise((resolve) => setTimeout(resolve, 350)); // độ trễ mạng giả

  let rows: DemoRoom[] = ROOM_DB;

  // 1. Lọc
  for (const f of state.filters) {
    rows = rows.filter((row) => {
      const raw = (row as unknown as Record<string, unknown>)[f.field];
      if (raw == null) return false;
      switch (f.operator) {
        case "contains":
          return String(raw).toLowerCase().includes(f.value.toLowerCase());
        case "eq":
          return Number(raw) === Number(f.value);
        case "gt":
          return Number(raw) > Number(f.value);
        case "lt":
          return Number(raw) < Number(f.value);
        default:
          return true;
      }
    });
  }

  // 2. Sort (một cột — khớp hành vi get_data)
  const sort = state.sorts[0];
  if (sort) {
    const dir = sort.direction === "desc" ? -1 : 1;
    rows = [...rows].sort((a, b) => {
      const va = (a as unknown as Record<string, unknown>)[sort.field];
      const vb = (b as unknown as Record<string, unknown>)[sort.field];
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "number" && typeof vb === "number")
        return (va - vb) * dir;
      return String(va).localeCompare(String(vb), "vi") * dir;
    });
  }

  // 3. Phân trang
  const total = rows.length;
  const start = (state.pageNumber - 1) * state.pageSize;
  return { data: rows.slice(start, start + state.pageSize), total };
};
