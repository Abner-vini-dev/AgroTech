import { useEffect } from "react";
import { AppLayout } from "./componentes/AppLayout";
import { NaoEncontradaPage } from "./paginas/nao-encontrada/NaoEncontradaPage";
import { appRoutes, findRoute } from "./routes";
import { useRouter } from "./hooks/useRouter";

export default function App() {
  const path = useRouter();
  const route = findRoute(path);
  const Page = route?.Component ?? NaoEncontradaPage;

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
