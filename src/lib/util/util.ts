export const join = (...paths: string[]) => paths.join("/").replace(/\/{2,}/g, "/");
