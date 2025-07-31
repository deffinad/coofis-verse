export const routesConfig = [
  {
    id: "dashboard",
    title: "Dashboard",
    messageId: "Dashboard",
    type: "group", 
    url: "/dashboard",
    icon: "Dashboard",
    children: [
      {
        id: "dashboard-main",
        title: "Main Dashboard",
        messageId: "Main Dashboard",
        type: "item",
        url: "/dashboard",
      },
      // Published pages will be dynamically added here by the Navbar
    ],
  },
  {
    id: "layout",
    title: "Layout",
    messageId: "page layout",
    type: "nonGroup",
    url: "/layout",
    icon: "Layout",
  },
];