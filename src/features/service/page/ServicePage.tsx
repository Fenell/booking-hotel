import ServiceListView from "./ServiceListView";
import { ServiceContextProvider } from "../context/ServiceContext";

const ServicePage = () => {
  return (
    <ServiceContextProvider>
      <title>Quản lý dịch vụ</title>
      <ServiceListView />
    </ServiceContextProvider>
  );
};

export default ServicePage;
