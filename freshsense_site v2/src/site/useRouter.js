import { useEffect, useState } from "react";

const normalizePath = (path) => path.replace(/\/$/, "") || "/";

export function useRouter() {
  const [path, setPath] = useState(() =>
    normalizePath(window.location.pathname),
  );

  useEffect(() => {
    const navigate = () => setPath(normalizePath(window.location.pathname));
    const handleClick = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;

      const link = event.target.closest("a[href]");
      if (
        !link ||
        link.hasAttribute("download") ||
        (link.target && link.target !== "_self") ||
        link.origin !== window.location.origin
      )
        return;

      const href = link.getAttribute("href");
      if (!href?.startsWith("/") || href.startsWith("//")) return;

      event.preventDefault();
      window.history.pushState({}, "", href);
      navigate();
    };

    window.addEventListener("popstate", navigate);
    document.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("popstate", navigate);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return path;
}
