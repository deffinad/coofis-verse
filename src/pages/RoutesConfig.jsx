export const routesConfig = [
  {
    id: "dashboard",
    title: "Dashboard",
    messageId: "Dashboard",
    type: "group",
    url: "/dashboard",
    icon: "Home",
    children: [
      {
        id: "dashboard-main-group", 
        title: "Main Dashboard",
        messageId: "Main Dashboard",
        type: "collapse",
        url: "/dashboard",
        children: [
          {
            id: "default",
            title: "Default",
            messageId: "Default",
            type: "item",
            url: "/dashboard",
          },
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
    type: "item",
    url: "/layout",
    icon: "ViewQuilt",
    alsoActiveOn: ["/preview"],
  },
];