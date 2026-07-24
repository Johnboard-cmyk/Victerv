import { defineConfig } from "vite";
import vinext from "vinext";
import { nitro } from "nitro/vite";

const isNetlifyBuild = process.env.NETLIFY === "true" || process.env.NITRO_PRESET === "netlify";

export default defineConfig({
  plugins: isNetlifyBuild ? [vinext(), nitro()] : [vinext()],
});
