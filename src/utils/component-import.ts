import { isDev } from "@builder.io/qwik/build";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const metaGlobComponents: Record<string, any> = import.meta.glob(
  "/src/routes/**/examples/*.tsx",
  {
    import: "default",
    eager: false,
  }
);
