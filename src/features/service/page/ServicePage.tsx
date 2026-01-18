import ServicePageContent from "../components/ServicePageContent";
import { ServiceContextProvider } from "../store/serviceContext";

const ServicePage = () => {
  return (
    <ServiceContextProvider>
      <ServicePageContent></ServicePageContent>
    </ServiceContextProvider>
  );
};

export default ServicePage;
