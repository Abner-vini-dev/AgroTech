import { useEffect } from "react";
import { AppLayout } from "./layout/AppLayout";
import { NotFoundPage } from "../pages/not-found/NotFoundPage";
import { appRoutes, findRoute } from "./routes";
import { useRouter } from "./useRouter";

export default function App() {
  const path = useRouter();
  const route = findRoute(path);
  const Page = route?.Component ?? NotFoundPage;

  useEffect(() => {
    document.title = route
      ? `${route.title} | FreshSense`
      : "Página não encontrada | FreshSense";
  }, [route]);

  return (
    <AppLayout currentPath={path} routes={appRoutes}>
      <Page />
    </AppLayout>
  );
}
