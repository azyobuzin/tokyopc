import react from "@vitejs/plugin-react";
import { type Plugin, defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    cssCodeSplit: false,
    modulePreload: {
      polyfill: false,
    },
  },
  plugins: [react(), preloadDynamicModules()],
});

/// indexから参照されるdynamic importをすべてpreloadする
function preloadDynamicModules(): Plugin {
  return {
    name: "preload-dynamic-modules",
    transformIndexHtml: {
      order: "post",
      handler(_html, ctx) {
        return Object.values(ctx.bundle ?? {})
          .flatMap((bundle) =>
            bundle.type === "chunk" && bundle.isEntry
              ? bundle.dynamicImports
              : [],
          )
          .map((path) => ({
            tag: "link",
            attrs: {
              rel: "modulepreload",
              crossorigin: true,
              href: `/${path}`,
            },
            injectTo: "head",
          }));
      },
    },
  };
}
