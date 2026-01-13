import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vite.dev/configs/
export default defineConfig({
  plugins: [react(), eslint({ fix: false, failOnError: false })],
});
