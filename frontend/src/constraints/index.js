// Header
export const headerOptions = [
  { title: "Home", url: "/" },
  { title: "Contact", url: "/contact" },
  { title: "About", url: "/about" },
  { title: "Checkout Payments", url: "/checkout" },
];

export const popupOptions = [
  {
    title: "Manage my profile",
    url: "/profile",
    icon: "fa-solid fa-circle-user mr-2",
  },
  { title: "My cart", url: "/cart", icon: "fa-solid fa-bag-shopping mr-2" },
  {
    title: "My History Purchase",
    url: "/history",
    icon: "fa-solid fa-ban mr-2",
  },
  { title: "My Reviews", url: "/", icon: "fa-regular fa-star mr-2" },
];

// Admin

export const sidebarOptions = [
  {
    title: "Home",
    baseUrl: "/admin/dashboard",
    icon: "fa-solid fa-house mr-3",
  },
  {
    title: "Notifications",
    baseUrl: "/admin/notifications",
    icon: "fa-solid fa-bell mr-3",
  },
  {
    title: "Products",
    baseUrl: "/admin/products",
    icon: "fa-solid fa-layer-group mr-3",
  },
  { title: "Users", baseUrl: "/admin/users", icon: "fa-regular fa-user mr-3" },
  {
    title: "Setting",
    baseUrl: "/admin/setting",
    icon: "fa-solid fa-gear mr-3",
  },
];
