import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RootIntel - AI Plant Care & Education",
    short_name: "RootIntel",
    description:
      "Your magical AI-powered plant care companion with Ghibli-inspired design. Diagnose plant issues, run simulations, and learn through interactive quests.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#16a34a",
    orientation: "portrait-primary",
    categories: ["education", "lifestyle", "utilities"],
    lang: "en",
    dir: "ltr",
    scope: "/",
    icons: [
      {
        src: "/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable any",
      },
    ],
    screenshots: [
      {
        src: "/screenshot-mobile-1.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "Plant diagnosis with AI-powered analysis",
      },
      {
        src: "/screenshot-mobile-2.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
        label: "Interactive plant simulation controls",
      },
      {
        src: "/screenshot-desktop-1.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "Complete dashboard view with all features",
      },
    ],
    shortcuts: [
      {
        name: "Diagnose Plant",
        short_name: "Diagnose",
        description: "Quickly diagnose plant issues with AI",
        url: "/?tab=diagnosis",
        icons: [
          {
            src: "/shortcut-diagnosis.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
      {
        name: "Plant Simulation",
        short_name: "Simulate",
        description: "Run plant growth simulations",
        url: "/?tab=simulation",
        icons: [
          {
            src: "/shortcut-simulation.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
      {
        name: "My Journal",
        short_name: "Journal",
        description: "Access your plant care journal",
        url: "/?tab=journal",
        icons: [
          {
            src: "/shortcut-journal.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
    ],
  }
}
