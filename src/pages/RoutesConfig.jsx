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
        id: "dashboard-main-group", 
        title: "Main Dashboard",
        messageId: "Main Dashboard",
        type: "collapse",
        url: "/dashboard",
        children: [
          {
            id: "create-portal",
            title: "Create Portal",
            messageId: "Create Portal",
            type: "item",
            url: "/dashboard/create-portal",
          },
        ],
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
    alsoActiveOn: ["/preview"],
  },
];