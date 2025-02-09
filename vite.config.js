export default defineConfig({
  plugins: [React()],
  server: {
    proxy: {
      "/api": {
        target: "https://img-gen-three.vercel.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
