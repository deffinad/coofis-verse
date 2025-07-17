export const LayoutTemplates = [
  {
    id: "template-dashboard",
    name: "Dashboard / Portal",
    layout: [
      // Baris 1: Header Utama
      {
        id: "container-dash-header",
        name: "Container",
        properties: { size: 12, height: "80px" },
        children: [
          {
            id: "grid-header",
            name: "Layout",
            properties: { size: 12, height: "80px" },
            children: [], // Tempat untuk komponen Navbar
          },
        ],
      },
      // Baris 2: KPI Cards (4 Kolom)
      {
        id: "container-kpi-cards",
        name: "Container",
        properties: { size: 12, height: "150px" },
        children: [
          {
            id: "grid-kpi-1",
            name: "Layout",
            properties: { size: 3, height: "150px" },
            children: [],
          },
          {
            id: "grid-kpi-2",
            name: "Layout",
            properties: { size: 3, height: "150px" },
            children: [],
          },
          {
            id: "grid-kpi-3",
            name: "Layout",
            properties: { size: 3, height: "150px" },
            children: [],
          },
          {
            id: "grid-kpi-4",
            name: "Layout",
            properties: { size: 3, height: "150px" },
            children: [],
          },
        ],
      },
      // Baris 3: Main Chart dan Sidebar Kanan
      {
        id: "container-main-content",
        name: "Container",
        properties: { size: 12, height: "400px" },
        children: [
          {
            id: "grid-main-chart",
            name: "Layout",
            properties: { size: 8, height: "400px" },
            children: [], // Tempat untuk grafik/tabel utama
          },
          {
            id: "grid-activity-feed",
            name: "Layout",
            properties: { size: 4, height: "400px" },
            children: [], // Tempat untuk notifikasi/aktivitas terbaru
          },
        ],
      },
      // Baris 4: Tabel Data
      {
        id: "container-data-table",
        name: "Container",
        properties: { size: 12, height: "300px" },
        children: [
          {
            id: "grid-data-table",
            name: "Layout",
            properties: { size: 12, height: "300px" },
            children: [], // Tempat untuk tabel data
          },
        ],
      },
    ],
  },
  {
    id: "template-landing-page",
    name: "Beranda / Landing Page",
    layout: [
      // Baris 1: Hero Section (Banner Utama)
      {
        id: "container-hero",
        name: "Container",
        properties: { size: 12, height: "450px" },
        children: [
          {
            id: "grid-hero",
            name: "Layout",
            properties: { size: 12, height: "450px" },
            children: [], // Tempat untuk gambar besar dan Call-to-Action
          },
        ],
      },
      // Baris 2: Features Section (3 Kolom)
      {
        id: "container-features",
        name: "Container",
        properties: { size: 12, height: "250px" },
        children: [
          {
            id: "grid-feature-1",
            name: "Layout",
            properties: { size: 4, height: "250px" },
            children: [],
          },
          {
            id: "grid-feature-2",
            name: "Layout",
            properties: { size: 4, height: "250px" },
            children: [],
          },
          {
            id: "grid-feature-3",
            name: "Layout",
            properties: { size: 4, height: "250px" },
            children: [],
          },
        ],
      },
      // Baris 3: Content Kiri, Gambar Kanan
      {
        id: "container-content-image",
        name: "Container",
        properties: { size: 12, height: "350px" },
        children: [
          {
            id: "grid-content-left",
            name: "Layout",
            properties: { size: 7, height: "350px" },
            children: [], // Tempat untuk teks penjelasan detail
          },
          {
            id: "grid-image-right",
            name: "Layout",
            properties: { size: 5, height: "350px" },
            children: [], // Tempat untuk gambar ilustrasi
          },
        ],
      },
      // Baris 4: Footer dengan 4 Kolom
      {
        id: "container-footer",
        name: "Container",
        properties: { size: 12, height: "200px" },
        children: [
          {
            id: "grid-footer-1",
            name: "Layout",
            properties: { size: 3, height: "200px" },
            children: [], // Misal: Logo dan deskripsi singkat
          },
          {
            id: "grid-footer-2",
            name: "Layout",
            properties: { size: 3, height: "200px" },
            children: [], // Misal: Link navigasi
          },
          {
            id: "grid-footer-3",
            name: "Layout",
            properties: { size: 3, height: "200px" },
            children: [], // Misal: Link bantuan
          },
          {
            id: "grid-footer-4",
            name: "Layout",
            properties: { size: 3, height: "200px" },
            children: [], // Misal: Kontak dan media sosial
          },
        ],
      },
    ],
  },
];
