// vite.config.ts
import { defineConfig } from "file:///Users/jackshelton/dev/playground/meta-glob-repro/node_modules/.pnpm/vite@5.3.5_@types+node@20.14.11/node_modules/vite/dist/node/index.js";
import { qwikVite } from "file:///Users/jackshelton/dev/playground/meta-glob-repro/node_modules/.pnpm/@builder.io+qwik@1.8.0_@types+node@20.14.11/node_modules/@builder.io/qwik/dist/optimizer.mjs";
import { qwikCity } from "file:///Users/jackshelton/dev/playground/meta-glob-repro/node_modules/.pnpm/@builder.io+qwik-city@1.8.0_@types+node@20.14.11_rollup@4.20.0/node_modules/@builder.io/qwik-city/lib/vite/index.mjs";

// src/mdx/recma-provide-comp.ts
function isNamedFunction(node, name) {
  return Boolean(node.id?.name === name);
}
var recmaProvideComponents = () => {
  let id = 0;
  return (tree) => {
    const replacement = [];
    for (const _node of tree.body) {
      const node = _node;
      if (node.type === "FunctionDeclaration" && node.id) {
        if (isNamedFunction(node, "MDXContent") || isNamedFunction(node, "_createMdxContent")) {
          const symbolName = `${node.id?.name || "mdx"}_${id++}`;
          const declarations = [
            {
              id: node.id,
              type: "VariableDeclarator",
              init: {
                type: "CallExpression",
                callee: {
                  type: "Identifier",
                  name: "_componentQrl"
                },
                arguments: [
                  {
                    type: "CallExpression",
                    callee: {
                      type: "Identifier",
                      name: "_inlinedQrl"
                    },
                    arguments: [
                      {
                        type: "ArrowFunctionExpression",
                        id: null,
                        params: node.params,
                        body: node.body,
                        async: node.async,
                        generator: node.generator
                      },
                      {
                        type: "Literal",
                        value: symbolName,
                        raw: String.raw`"${symbolName}"`
                      },
                      {
                        type: "ArrayExpression",
                        elements: []
                      }
                    ]
                  }
                ]
              }
            }
          ];
          const newNode = {
            type: "VariableDeclaration",
            kind: "const",
            declarations
          };
          replacement.push(newNode);
          continue;
        }
      }
      replacement.push(_node);
    }
    tree.body = replacement;
    tree.body.unshift({
      type: "ImportDeclaration",
      specifiers: [
        {
          type: "ImportSpecifier",
          imported: { type: "Identifier", name: "componentQrl" },
          local: { type: "Identifier", name: "_componentQrl" }
        },
        {
          type: "ImportSpecifier",
          imported: { type: "Identifier", name: "inlinedQrl" },
          local: { type: "Identifier", name: "_inlinedQrl" }
        }
      ],
      source: { type: "Literal", value: "@builder.io/qwik" }
    });
  };
};

// vite.config.ts
import tsconfigPaths from "file:///Users/jackshelton/dev/playground/meta-glob-repro/node_modules/.pnpm/vite-tsconfig-paths@4.3.2_typescript@5.4.5_vite@5.3.5_@types+node@20.14.11_/node_modules/vite-tsconfig-paths/dist/index.mjs";

// package.json
var package_default = {
  name: "qwik-design-system-docs",
  description: "Blank project with routing included",
  engines: {
    node: "^18.17.0 || ^20.3.0 || >=21.0.0"
  },
  "engines-annotation": "Mostly required by sharp which needs a Node-API v9 compatible runtime",
  private: true,
  trustedDependencies: [
    "sharp"
  ],
  "trustedDependencies-annotation": "Needed for bun to allow running install scripts",
  type: "module",
  scripts: {
    build: "qwik build",
    "build.client": "vite build",
    "build.preview": "vite build --ssr src/entry.preview.tsx",
    "build.types": "tsc --incremental --noEmit",
    deploy: `echo 'Run "npm run qwik add" to install a server adapter'`,
    dev: "vite --mode ssr",
    "dev.debug": "node --inspect-brk ./node_modules/vite/bin/vite.js --mode ssr --force",
    preview: "qwik build preview && vite preview --open",
    start: "vite --open --mode ssr",
    qwik: "qwik"
  },
  devDependencies: {
    "@builder.io/qwik": "1.8",
    "@builder.io/qwik-city": "1.8",
    "@qwik-ui/headless": "^0.5.1",
    "@types/estree-jsx": "1.0.5",
    "@types/node": "20.14.11",
    autoprefixer: "^10.4.20",
    postcss: "^8.4.41",
    shiki: "^1.12.1",
    tailwindcss: "^3.4.10",
    typescript: "5.4.5",
    undici: "*",
    unified: "^11.0.4",
    vite: "5.3.5",
    "vite-tsconfig-paths": "^4.2.1"
  },
  dependencies: {
    clsx: "^2.1.1",
    "rehype-pretty-code": "^0.13.2",
    "tailwind-merge": "^2.5.0"
  }
};

// vite.config.ts
var { dependencies = {}, devDependencies = {} } = package_default;
errorOnDuplicatesPkgDeps(devDependencies, dependencies);
var vite_config_default = defineConfig(({ command, mode }) => {
  return {
    plugins: [
      qwikCity({
        mdx: {
          providerImportSource: "~/mdx/provider",
          recmaPlugins: [recmaProvideComponents]
        }
      }),
      qwikVite(),
      tsconfigPaths()
    ],
    // This tells Vite which dependencies to pre-build in dev mode.
    optimizeDeps: {
      // Put problematic deps that break bundling here, mostly those with binaries.
      // For example ['better-sqlite3'] if you use that in server functions.
      exclude: []
    },
    ssr: command === "build" && mode === "production" ? {
      // All dev dependencies should be bundled in the server build
      noExternal: Object.keys(devDependencies),
      // Anything marked as a dependency will not be bundled
      // These should only be production binary deps (including deps of deps), CLI deps, and their module graph
      // If a dep-of-dep needs to be external, add it here
      // For example, if something uses `bcrypt` but you don't have it as a dep, you can write
      // external: [...Object.keys(dependencies), 'bcrypt']
      external: Object.keys(dependencies)
    } : void 0,
    server: {
      headers: {
        // Don't cache the server response in dev mode
        "Cache-Control": "public, max-age=0"
      }
    },
    preview: {
      headers: {
        // Do cache the server response in preview (non-adapter production build)
        "Cache-Control": "public, max-age=600"
      }
    }
  };
});
function errorOnDuplicatesPkgDeps(devDependencies2, dependencies2) {
  let msg = "";
  const duplicateDeps = Object.keys(devDependencies2).filter(
    (dep) => dependencies2[dep]
  );
  const qwikPkg = Object.keys(dependencies2).filter(
    (value) => /qwik/i.test(value)
  );
  msg = `Move qwik packages ${qwikPkg.join(", ")} to devDependencies`;
  if (qwikPkg.length > 0) {
    throw new Error(msg);
  }
  msg = `
    Warning: The dependency "${duplicateDeps.join(
    ", "
  )}" is listed in both "devDependencies" and "dependencies".
    Please move the duplicated dependencies to "devDependencies" only and remove it from "dependencies"
  `;
  if (duplicateDeps.length > 0) {
    throw new Error(msg);
  }
}
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21keC9yZWNtYS1wcm92aWRlLWNvbXAudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2phY2tzaGVsdG9uL2Rldi9wbGF5Z3JvdW5kL21ldGEtZ2xvYi1yZXByb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2phY2tzaGVsdG9uL2Rldi9wbGF5Z3JvdW5kL21ldGEtZ2xvYi1yZXByby92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvamFja3NoZWx0b24vZGV2L3BsYXlncm91bmQvbWV0YS1nbG9iLXJlcHJvL3ZpdGUuY29uZmlnLnRzXCI7LyoqXG4gKiBUaGlzIGlzIHRoZSBiYXNlIGNvbmZpZyBmb3Igdml0ZS5cbiAqIFdoZW4gYnVpbGRpbmcsIHRoZSBhZGFwdGVyIGNvbmZpZyBpcyB1c2VkIHdoaWNoIGxvYWRzIHRoaXMgZmlsZSBhbmQgZXh0ZW5kcyBpdC5cbiAqL1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCB0eXBlIFVzZXJDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgcXdpa1ZpdGUgfSBmcm9tIFwiQGJ1aWxkZXIuaW8vcXdpay9vcHRpbWl6ZXJcIjtcbmltcG9ydCB7IHF3aWtDaXR5IH0gZnJvbSBcIkBidWlsZGVyLmlvL3F3aWstY2l0eS92aXRlXCI7XG5pbXBvcnQgeyByZWNtYVByb3ZpZGVDb21wb25lbnRzIH0gZnJvbSBcIi4vc3JjL21keC9yZWNtYS1wcm92aWRlLWNvbXBcIjtcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XG5pbXBvcnQgcGtnIGZyb20gXCIuL3BhY2thZ2UuanNvblwiO1xuXG50eXBlIFBrZ0RlcCA9IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4vLyBiaW9tZS1pZ25vcmUgbGludC9zdXNwaWNpb3VzL25vRXhwbGljaXRBbnk6IDxleHBsYW5hdGlvbj5cbmNvbnN0IHsgZGVwZW5kZW5jaWVzID0ge30sIGRldkRlcGVuZGVuY2llcyA9IHt9IH0gPSBwa2cgYXMgYW55IGFzIHtcbiAgZGVwZW5kZW5jaWVzOiBQa2dEZXA7XG4gIGRldkRlcGVuZGVuY2llczogUGtnRGVwO1xuICBba2V5OiBzdHJpbmddOiB1bmtub3duO1xufTtcbmVycm9yT25EdXBsaWNhdGVzUGtnRGVwcyhkZXZEZXBlbmRlbmNpZXMsIGRlcGVuZGVuY2llcyk7XG5cbi8qKlxuICogTm90ZSB0aGF0IFZpdGUgbm9ybWFsbHkgc3RhcnRzIGZyb20gYGluZGV4Lmh0bWxgIGJ1dCB0aGUgcXdpa0NpdHkgcGx1Z2luIG1ha2VzIHN0YXJ0IGF0IGBzcmMvZW50cnkuc3NyLnRzeGAgaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUgfSk6IFVzZXJDb25maWcgPT4ge1xuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHF3aWtDaXR5KHtcbiAgICAgICAgbWR4OiB7XG4gICAgICAgICAgcHJvdmlkZXJJbXBvcnRTb3VyY2U6IFwifi9tZHgvcHJvdmlkZXJcIixcbiAgICAgICAgICByZWNtYVBsdWdpbnM6IFtyZWNtYVByb3ZpZGVDb21wb25lbnRzXSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgcXdpa1ZpdGUoKSxcbiAgICAgIHRzY29uZmlnUGF0aHMoKSxcbiAgICBdLFxuICAgIC8vIFRoaXMgdGVsbHMgVml0ZSB3aGljaCBkZXBlbmRlbmNpZXMgdG8gcHJlLWJ1aWxkIGluIGRldiBtb2RlLlxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgLy8gUHV0IHByb2JsZW1hdGljIGRlcHMgdGhhdCBicmVhayBidW5kbGluZyBoZXJlLCBtb3N0bHkgdGhvc2Ugd2l0aCBiaW5hcmllcy5cbiAgICAgIC8vIEZvciBleGFtcGxlIFsnYmV0dGVyLXNxbGl0ZTMnXSBpZiB5b3UgdXNlIHRoYXQgaW4gc2VydmVyIGZ1bmN0aW9ucy5cbiAgICAgIGV4Y2x1ZGU6IFtdLFxuICAgIH0sXG4gICAgc3NyOlxuICAgICAgY29tbWFuZCA9PT0gXCJidWlsZFwiICYmIG1vZGUgPT09IFwicHJvZHVjdGlvblwiXG4gICAgICAgID8ge1xuICAgICAgICAgICAgLy8gQWxsIGRldiBkZXBlbmRlbmNpZXMgc2hvdWxkIGJlIGJ1bmRsZWQgaW4gdGhlIHNlcnZlciBidWlsZFxuICAgICAgICAgICAgbm9FeHRlcm5hbDogT2JqZWN0LmtleXMoZGV2RGVwZW5kZW5jaWVzKSxcbiAgICAgICAgICAgIC8vIEFueXRoaW5nIG1hcmtlZCBhcyBhIGRlcGVuZGVuY3kgd2lsbCBub3QgYmUgYnVuZGxlZFxuICAgICAgICAgICAgLy8gVGhlc2Ugc2hvdWxkIG9ubHkgYmUgcHJvZHVjdGlvbiBiaW5hcnkgZGVwcyAoaW5jbHVkaW5nIGRlcHMgb2YgZGVwcyksIENMSSBkZXBzLCBhbmQgdGhlaXIgbW9kdWxlIGdyYXBoXG4gICAgICAgICAgICAvLyBJZiBhIGRlcC1vZi1kZXAgbmVlZHMgdG8gYmUgZXh0ZXJuYWwsIGFkZCBpdCBoZXJlXG4gICAgICAgICAgICAvLyBGb3IgZXhhbXBsZSwgaWYgc29tZXRoaW5nIHVzZXMgYGJjcnlwdGAgYnV0IHlvdSBkb24ndCBoYXZlIGl0IGFzIGEgZGVwLCB5b3UgY2FuIHdyaXRlXG4gICAgICAgICAgICAvLyBleHRlcm5hbDogWy4uLk9iamVjdC5rZXlzKGRlcGVuZGVuY2llcyksICdiY3J5cHQnXVxuICAgICAgICAgICAgZXh0ZXJuYWw6IE9iamVjdC5rZXlzKGRlcGVuZGVuY2llcyksXG4gICAgICAgICAgfVxuICAgICAgICA6IHVuZGVmaW5lZCxcblxuICAgIHNlcnZlcjoge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICAvLyBEb24ndCBjYWNoZSB0aGUgc2VydmVyIHJlc3BvbnNlIGluIGRldiBtb2RlXG4gICAgICAgIFwiQ2FjaGUtQ29udHJvbFwiOiBcInB1YmxpYywgbWF4LWFnZT0wXCIsXG4gICAgICB9LFxuICAgIH0sXG4gICAgcHJldmlldzoge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICAvLyBEbyBjYWNoZSB0aGUgc2VydmVyIHJlc3BvbnNlIGluIHByZXZpZXcgKG5vbi1hZGFwdGVyIHByb2R1Y3Rpb24gYnVpbGQpXG4gICAgICAgIFwiQ2FjaGUtQ29udHJvbFwiOiBcInB1YmxpYywgbWF4LWFnZT02MDBcIixcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbn0pO1xuXG4vLyAqKiogdXRpbHMgKioqXG5cbi8qKlxuICogRnVuY3Rpb24gdG8gaWRlbnRpZnkgZHVwbGljYXRlIGRlcGVuZGVuY2llcyBhbmQgdGhyb3cgYW4gZXJyb3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXZEZXBlbmRlbmNpZXMgLSBMaXN0IG9mIGRldmVsb3BtZW50IGRlcGVuZGVuY2llc1xuICogQHBhcmFtIHtPYmplY3R9IGRlcGVuZGVuY2llcyAtIExpc3Qgb2YgcHJvZHVjdGlvbiBkZXBlbmRlbmNpZXNcbiAqL1xuZnVuY3Rpb24gZXJyb3JPbkR1cGxpY2F0ZXNQa2dEZXBzKFxuICBkZXZEZXBlbmRlbmNpZXM6IFBrZ0RlcCxcbiAgZGVwZW5kZW5jaWVzOiBQa2dEZXBcbikge1xuICBsZXQgbXNnID0gXCJcIjtcbiAgLy8gQ3JlYXRlIGFuIGFycmF5ICdkdXBsaWNhdGVEZXBzJyBieSBmaWx0ZXJpbmcgZGV2RGVwZW5kZW5jaWVzLlxuICAvLyBJZiBhIGRlcGVuZGVuY3kgYWxzbyBleGlzdHMgaW4gZGVwZW5kZW5jaWVzLCBpdCBpcyBjb25zaWRlcmVkIGEgZHVwbGljYXRlLlxuICBjb25zdCBkdXBsaWNhdGVEZXBzID0gT2JqZWN0LmtleXMoZGV2RGVwZW5kZW5jaWVzKS5maWx0ZXIoXG4gICAgKGRlcCkgPT4gZGVwZW5kZW5jaWVzW2RlcF1cbiAgKTtcblxuICAvLyBpbmNsdWRlIGFueSBrbm93biBxd2lrIHBhY2thZ2VzXG4gIGNvbnN0IHF3aWtQa2cgPSBPYmplY3Qua2V5cyhkZXBlbmRlbmNpZXMpLmZpbHRlcigodmFsdWUpID0+XG4gICAgL3F3aWsvaS50ZXN0KHZhbHVlKVxuICApO1xuXG4gIC8vIGFueSBlcnJvcnMgZm9yIG1pc3NpbmcgXCJxd2lrLWNpdHktcGxhblwiXG4gIC8vIFtQTFVHSU5fRVJST1JdOiBJbnZhbGlkIG1vZHVsZSBcIkBxd2lrLWNpdHktcGxhblwiIGlzIG5vdCBhIHZhbGlkIHBhY2thZ2VcbiAgbXNnID0gYE1vdmUgcXdpayBwYWNrYWdlcyAke3F3aWtQa2cuam9pbihcIiwgXCIpfSB0byBkZXZEZXBlbmRlbmNpZXNgO1xuXG4gIGlmIChxd2lrUGtnLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgfVxuXG4gIC8vIEZvcm1hdCB0aGUgZXJyb3IgbWVzc2FnZSB3aXRoIHRoZSBkdXBsaWNhdGVzIGxpc3QuXG4gIC8vIFRoZSBgam9pbmAgZnVuY3Rpb24gaXMgdXNlZCB0byByZXByZXNlbnQgdGhlIGVsZW1lbnRzIG9mIHRoZSAnZHVwbGljYXRlRGVwcycgYXJyYXkgYXMgYSBjb21tYS1zZXBhcmF0ZWQgc3RyaW5nLlxuICBtc2cgPSBgXG4gICAgV2FybmluZzogVGhlIGRlcGVuZGVuY3kgXCIke2R1cGxpY2F0ZURlcHMuam9pbihcbiAgICAgIFwiLCBcIlxuICAgICl9XCIgaXMgbGlzdGVkIGluIGJvdGggXCJkZXZEZXBlbmRlbmNpZXNcIiBhbmQgXCJkZXBlbmRlbmNpZXNcIi5cbiAgICBQbGVhc2UgbW92ZSB0aGUgZHVwbGljYXRlZCBkZXBlbmRlbmNpZXMgdG8gXCJkZXZEZXBlbmRlbmNpZXNcIiBvbmx5IGFuZCByZW1vdmUgaXQgZnJvbSBcImRlcGVuZGVuY2llc1wiXG4gIGA7XG5cbiAgLy8gVGhyb3cgYW4gZXJyb3Igd2l0aCB0aGUgY29uc3RydWN0ZWQgbWVzc2FnZS5cbiAgaWYgKGR1cGxpY2F0ZURlcHMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICB9XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9qYWNrc2hlbHRvbi9kZXYvcGxheWdyb3VuZC9tZXRhLWdsb2ItcmVwcm8vc3JjL21keFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2phY2tzaGVsdG9uL2Rldi9wbGF5Z3JvdW5kL21ldGEtZ2xvYi1yZXByby9zcmMvbWR4L3JlY21hLXByb3ZpZGUtY29tcC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvamFja3NoZWx0b24vZGV2L3BsYXlncm91bmQvbWV0YS1nbG9iLXJlcHJvL3NyYy9tZHgvcmVjbWEtcHJvdmlkZS1jb21wLnRzXCI7aW1wb3J0IHR5cGUge1xuICBDYWxsRXhwcmVzc2lvbixcbiAgRnVuY3Rpb25EZWNsYXJhdGlvbixcbiAgTGl0ZXJhbCxcbiAgTm9kZSxcbiAgUHJvZ3JhbSxcbiAgVmFyaWFibGVEZWNsYXJhdGlvbixcbiAgVmFyaWFibGVEZWNsYXJhdG9yLFxufSBmcm9tIFwiZXN0cmVlLWpzeFwiO1xuXG5pbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gXCJ1bmlmaWVkXCI7XG5cbmZ1bmN0aW9uIGlzTmFtZWRGdW5jdGlvbihub2RlOiBGdW5jdGlvbkRlY2xhcmF0aW9uLCBuYW1lOiBzdHJpbmcpIHtcbiAgcmV0dXJuIEJvb2xlYW4obm9kZS5pZD8ubmFtZSA9PT0gbmFtZSk7XG59XG5cbi8vIGJpb21lLWlnbm9yZSBsaW50L3N1c3BpY2lvdXMvbm9FeHBsaWNpdEFueTogPGV4cGxhbmF0aW9uPlxuZXhwb3J0IGNvbnN0IHJlY21hUHJvdmlkZUNvbXBvbmVudHM6IFBsdWdpbjxhbnksIFByb2dyYW0+ID0gKCkgPT4ge1xuICBsZXQgaWQgPSAwO1xuICByZXR1cm4gKHRyZWUpID0+IHtcbiAgICBjb25zdCByZXBsYWNlbWVudCA9IFtdO1xuICAgIGZvciAoY29uc3QgX25vZGUgb2YgdHJlZS5ib2R5KSB7XG4gICAgICBjb25zdCBub2RlID0gX25vZGUgYXMgTm9kZTtcbiAgICAgIGlmIChub2RlLnR5cGUgPT09IFwiRnVuY3Rpb25EZWNsYXJhdGlvblwiICYmIG5vZGUuaWQpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGlzTmFtZWRGdW5jdGlvbihub2RlLCBcIk1EWENvbnRlbnRcIikgfHxcbiAgICAgICAgICBpc05hbWVkRnVuY3Rpb24obm9kZSwgXCJfY3JlYXRlTWR4Q29udGVudFwiKVxuICAgICAgICApIHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBUcmFuc2Zvcm1zIGZ1bmN0aW9uIE1EWENvbnRlbnQgKHByb3BzID0ge30pIHsuLi59XG4gICAgICAgICAgICogdG8gY29uc3QgTURYQ29udGVudCA9IF9jb21wb25lbnRRcmwoX2lubGluZWRRcmwoZnVuY3Rpb24gKHByb3BzID0ge30pIHsuLi59LCAnc3ltYm9sTmFtZScsIFtdKSlcbiAgICAgICAgICAgKiBhbGxvd3MgdXNpbmcgUXdpayBob29rcyBpbnNpZGVcbiAgICAgICAgICAgKiAgKi9cbiAgICAgICAgICBjb25zdCBzeW1ib2xOYW1lID0gYCR7bm9kZS5pZD8ubmFtZSB8fCBcIm1keFwifV8ke2lkKyt9YDtcbiAgICAgICAgICBjb25zdCBkZWNsYXJhdGlvbnM6IFZhcmlhYmxlRGVjbGFyYXRvcltdID0gW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZDogbm9kZS5pZCxcbiAgICAgICAgICAgICAgdHlwZTogXCJWYXJpYWJsZURlY2xhcmF0b3JcIixcbiAgICAgICAgICAgICAgaW5pdDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiQ2FsbEV4cHJlc3Npb25cIixcbiAgICAgICAgICAgICAgICBjYWxsZWU6IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6IFwiSWRlbnRpZmllclwiLFxuICAgICAgICAgICAgICAgICAgbmFtZTogXCJfY29tcG9uZW50UXJsXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhcmd1bWVudHM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJDYWxsRXhwcmVzc2lvblwiLFxuICAgICAgICAgICAgICAgICAgICBjYWxsZWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIklkZW50aWZpZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcIl9pbmxpbmVkUXJsXCIsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50czogW1xuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiQXJyb3dGdW5jdGlvbkV4cHJlc3Npb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBub2RlLnBhcmFtcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IG5vZGUuYm9keSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jOiBub2RlLmFzeW5jLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdG9yOiBub2RlLmdlbmVyYXRvcixcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiTGl0ZXJhbFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHN5bWJvbE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICByYXc6IFN0cmluZy5yYXdgXCIke3N5bWJvbE5hbWV9XCJgLFxuICAgICAgICAgICAgICAgICAgICAgIH0gYXMgTGl0ZXJhbCxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkFycmF5RXhwcmVzc2lvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9IGFzIENhbGxFeHByZXNzaW9uLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0gYXMgQ2FsbEV4cHJlc3Npb24sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF07XG4gICAgICAgICAgY29uc3QgbmV3Tm9kZTogVmFyaWFibGVEZWNsYXJhdGlvbiA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwiVmFyaWFibGVEZWNsYXJhdGlvblwiLFxuICAgICAgICAgICAga2luZDogXCJjb25zdFwiLFxuICAgICAgICAgICAgZGVjbGFyYXRpb25zLFxuICAgICAgICAgIH07XG4gICAgICAgICAgcmVwbGFjZW1lbnQucHVzaChuZXdOb2RlKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmVwbGFjZW1lbnQucHVzaChfbm9kZSk7XG4gICAgfVxuICAgIHRyZWUuYm9keSA9IHJlcGxhY2VtZW50O1xuICAgIHRyZWUuYm9keS51bnNoaWZ0KHtcbiAgICAgIHR5cGU6IFwiSW1wb3J0RGVjbGFyYXRpb25cIixcbiAgICAgIHNwZWNpZmllcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiSW1wb3J0U3BlY2lmaWVyXCIsXG4gICAgICAgICAgaW1wb3J0ZWQ6IHsgdHlwZTogXCJJZGVudGlmaWVyXCIsIG5hbWU6IFwiY29tcG9uZW50UXJsXCIgfSxcbiAgICAgICAgICBsb2NhbDogeyB0eXBlOiBcIklkZW50aWZpZXJcIiwgbmFtZTogXCJfY29tcG9uZW50UXJsXCIgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6IFwiSW1wb3J0U3BlY2lmaWVyXCIsXG4gICAgICAgICAgaW1wb3J0ZWQ6IHsgdHlwZTogXCJJZGVudGlmaWVyXCIsIG5hbWU6IFwiaW5saW5lZFFybFwiIH0sXG4gICAgICAgICAgbG9jYWw6IHsgdHlwZTogXCJJZGVudGlmaWVyXCIsIG5hbWU6IFwiX2lubGluZWRRcmxcIiB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIHNvdXJjZTogeyB0eXBlOiBcIkxpdGVyYWxcIiwgdmFsdWU6IFwiQGJ1aWxkZXIuaW8vcXdpa1wiIH0sXG4gICAgfSk7XG4gIH07XG59O1xuIiwgIntcbiAgXCJuYW1lXCI6IFwicXdpay1kZXNpZ24tc3lzdGVtLWRvY3NcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkJsYW5rIHByb2plY3Qgd2l0aCByb3V0aW5nIGluY2x1ZGVkXCIsXG4gIFwiZW5naW5lc1wiOiB7XG4gICAgXCJub2RlXCI6IFwiXjE4LjE3LjAgfHwgXjIwLjMuMCB8fCA+PTIxLjAuMFwiXG4gIH0sXG4gIFwiZW5naW5lcy1hbm5vdGF0aW9uXCI6IFwiTW9zdGx5IHJlcXVpcmVkIGJ5IHNoYXJwIHdoaWNoIG5lZWRzIGEgTm9kZS1BUEkgdjkgY29tcGF0aWJsZSBydW50aW1lXCIsXG4gIFwicHJpdmF0ZVwiOiB0cnVlLFxuICBcInRydXN0ZWREZXBlbmRlbmNpZXNcIjogW1xuICAgIFwic2hhcnBcIlxuICBdLFxuICBcInRydXN0ZWREZXBlbmRlbmNpZXMtYW5ub3RhdGlvblwiOiBcIk5lZWRlZCBmb3IgYnVuIHRvIGFsbG93IHJ1bm5pbmcgaW5zdGFsbCBzY3JpcHRzXCIsXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYnVpbGRcIjogXCJxd2lrIGJ1aWxkXCIsXG4gICAgXCJidWlsZC5jbGllbnRcIjogXCJ2aXRlIGJ1aWxkXCIsXG4gICAgXCJidWlsZC5wcmV2aWV3XCI6IFwidml0ZSBidWlsZCAtLXNzciBzcmMvZW50cnkucHJldmlldy50c3hcIixcbiAgICBcImJ1aWxkLnR5cGVzXCI6IFwidHNjIC0taW5jcmVtZW50YWwgLS1ub0VtaXRcIixcbiAgICBcImRlcGxveVwiOiBcImVjaG8gJ1J1biBcXFwibnBtIHJ1biBxd2lrIGFkZFxcXCIgdG8gaW5zdGFsbCBhIHNlcnZlciBhZGFwdGVyJ1wiLFxuICAgIFwiZGV2XCI6IFwidml0ZSAtLW1vZGUgc3NyXCIsXG4gICAgXCJkZXYuZGVidWdcIjogXCJub2RlIC0taW5zcGVjdC1icmsgLi9ub2RlX21vZHVsZXMvdml0ZS9iaW4vdml0ZS5qcyAtLW1vZGUgc3NyIC0tZm9yY2VcIixcbiAgICBcInByZXZpZXdcIjogXCJxd2lrIGJ1aWxkIHByZXZpZXcgJiYgdml0ZSBwcmV2aWV3IC0tb3BlblwiLFxuICAgIFwic3RhcnRcIjogXCJ2aXRlIC0tb3BlbiAtLW1vZGUgc3NyXCIsXG4gICAgXCJxd2lrXCI6IFwicXdpa1wiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBidWlsZGVyLmlvL3F3aWtcIjogXCIxLjhcIixcbiAgICBcIkBidWlsZGVyLmlvL3F3aWstY2l0eVwiOiBcIjEuOFwiLFxuICAgIFwiQHF3aWstdWkvaGVhZGxlc3NcIjogXCJeMC41LjFcIixcbiAgICBcIkB0eXBlcy9lc3RyZWUtanN4XCI6IFwiMS4wLjVcIixcbiAgICBcIkB0eXBlcy9ub2RlXCI6IFwiMjAuMTQuMTFcIixcbiAgICBcImF1dG9wcmVmaXhlclwiOiBcIl4xMC40LjIwXCIsXG4gICAgXCJwb3N0Y3NzXCI6IFwiXjguNC40MVwiLFxuICAgIFwic2hpa2lcIjogXCJeMS4xMi4xXCIsXG4gICAgXCJ0YWlsd2luZGNzc1wiOiBcIl4zLjQuMTBcIixcbiAgICBcInR5cGVzY3JpcHRcIjogXCI1LjQuNVwiLFxuICAgIFwidW5kaWNpXCI6IFwiKlwiLFxuICAgIFwidW5pZmllZFwiOiBcIl4xMS4wLjRcIixcbiAgICBcInZpdGVcIjogXCI1LjMuNVwiLFxuICAgIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiOiBcIl40LjIuMVwiXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImNsc3hcIjogXCJeMi4xLjFcIixcbiAgICBcInJlaHlwZS1wcmV0dHktY29kZVwiOiBcIl4wLjEzLjJcIixcbiAgICBcInRhaWx3aW5kLW1lcmdlXCI6IFwiXjIuNS4wXCJcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUlBLFNBQVMsb0JBQXFDO0FBQzlDLFNBQVMsZ0JBQWdCO0FBQ3pCLFNBQVMsZ0JBQWdCOzs7QUNNekIsU0FBUyxnQkFBZ0IsTUFBMkIsTUFBYztBQUNoRSxTQUFPLFFBQVEsS0FBSyxJQUFJLFNBQVMsSUFBSTtBQUN2QztBQUdPLElBQU0seUJBQStDLE1BQU07QUFDaEUsTUFBSSxLQUFLO0FBQ1QsU0FBTyxDQUFDLFNBQVM7QUFDZixVQUFNLGNBQWMsQ0FBQztBQUNyQixlQUFXLFNBQVMsS0FBSyxNQUFNO0FBQzdCLFlBQU0sT0FBTztBQUNiLFVBQUksS0FBSyxTQUFTLHlCQUF5QixLQUFLLElBQUk7QUFDbEQsWUFDRSxnQkFBZ0IsTUFBTSxZQUFZLEtBQ2xDLGdCQUFnQixNQUFNLG1CQUFtQixHQUN6QztBQU1BLGdCQUFNLGFBQWEsR0FBRyxLQUFLLElBQUksUUFBUSxLQUFLLElBQUksSUFBSTtBQUNwRCxnQkFBTSxlQUFxQztBQUFBLFlBQ3pDO0FBQUEsY0FDRSxJQUFJLEtBQUs7QUFBQSxjQUNULE1BQU07QUFBQSxjQUNOLE1BQU07QUFBQSxnQkFDSixNQUFNO0FBQUEsZ0JBQ04sUUFBUTtBQUFBLGtCQUNOLE1BQU07QUFBQSxrQkFDTixNQUFNO0FBQUEsZ0JBQ1I7QUFBQSxnQkFDQSxXQUFXO0FBQUEsa0JBQ1Q7QUFBQSxvQkFDRSxNQUFNO0FBQUEsb0JBQ04sUUFBUTtBQUFBLHNCQUNOLE1BQU07QUFBQSxzQkFDTixNQUFNO0FBQUEsb0JBQ1I7QUFBQSxvQkFDQSxXQUFXO0FBQUEs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
