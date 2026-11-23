import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "./",
  publicDir: "public",
  server: {
    port: 5174,
    open: false
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        episodes: resolve(__dirname, "episodes.html"),
        hosts: resolve(__dirname, "hosts.html"),
        guests: resolve(__dirname, "guests.html"),
        videos: resolve(__dirname, "videos.html"),
        about: resolve(__dirname, "about.html"),
        mission: resolve(__dirname, "mission.html"),
        resources: resolve(__dirname, "resources.html"),
        requestEpisode: resolve(__dirname, "request-episode.html"),
        becomeAGuest: resolve(__dirname, "become-a-guest.html"),
        contact: resolve(__dirname, "contact.html"),
        admin: resolve(__dirname, "admin.html")
      }
    }
  }
});
