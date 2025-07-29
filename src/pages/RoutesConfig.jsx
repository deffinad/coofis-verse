export const routesConfig = [
  {
    id: "dashboard",
    title: "Dashboard",
    messageId: "Dashboard",
    type: "nonGroup",
    url: "/dashboard",
    icon: "Dashboard",
    children: [
      {
        id: "dashboard-cms",
        title: "Dashboard CMS",
        messageId: "Dashboard CMS",
        type: "item",
        url: "/dashboard/cms",
      },
      {
        id: "-",
        title: "-",
        messageId: "-",
        type: "item",
        exact: true,
        url: "/dashboard/",
      },
      {
        id: "-",
        title: "-",
        messageId: "-",
        type: "item",
        exact: true,
        url: "/dashboard/",
      },
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
