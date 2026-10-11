import { registerHooks } from "node:module"
import { existsSync } from "node:fs"
import { fileURLToPath, pathToFileURL } from "node:url"

const root = fileURLToPath(new URL("../../", import.meta.url))
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const path = root + specifier.slice(2)
      for (const extension of [".ts", ".tsx", "/index.ts"]) {
        if (existsSync(path + extension)) {
          return nextResolve(pathToFileURL(path + extension).href, context)
        }
      }
    }
    if (specifier === "next/server" || specifier === "next/headers") {
      return nextResolve(specifier + ".js", context)
    }
    return nextResolve(specifier, context)
  },
})
