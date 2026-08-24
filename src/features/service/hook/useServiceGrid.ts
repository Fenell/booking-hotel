import { useCallback, useMemo } from "react";
import {
  buildServerFieldMap,
  useServerGrid,
} from "@shared/components/DataGrid";
import { useServiceContext } from "../context/ServiceContext";
import { serviceKeys } from "../api/service.keys";
import createServiceCol from "../components/createServiceCol";
import type { ServiceResponse } from "../types/service.type";

/**
 * Nối lưới Dịch vụ với view `view_service_with_icon` theo kiểu server-side:
 * lọc / sắp xếp / phân trang đều chạy dưới Postgres qua `POST /dynamic/get-data`.
 *
 * Khác lưới Phòng (đang phải chạy client-side vì `view_room` join sang dịch vụ
 * nên một phòng ra nhiều dòng) — view của dịch vụ mỗi dòng là một dịch vụ nên
 * đi thẳng server-side được.
 */
export const useServiceGrid = () => {
  const { openOrCloseDialog } = useServiceContext();

  const handleEditService = useCallback(
    (id: string) => openOrCloseDialog(true, id),
    [openOrCloseDialog],
  );

  const columns = useMemo(
    () => createServiceCol({ onEdit: handleEditService }),
    [handleEditService],
  );

  // Giữ tham chiếu ổn định: serviceKeys.grid() tạo mảng mới mỗi lần gọi.
  const queryKey = useMemo(() => serviceKeys.grid(), []);

  const grid = useServerGrid<ServiceResponse>({
    tableNames: "view_service_with_icon",
    queryKey,
    initialPageSize: 20,
    initialSorts: [{ field: "serviceName", direction: "asc" }],
    serverFields: buildServerFieldMap(columns),
  });

  return { columns, grid };
};
