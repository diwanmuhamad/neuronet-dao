const NavbarData = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "About Us",
    path: "/about-us",
  },
  {
    title: "Marketplace",
    submenu: [
      {
        title: "Prompts",
        path: "/shop",
      },
      {
        title: "Datasets",
        path: "/product-single",
      },
      {
        title: "AI Outputs",
        path: "/checkout",
      },
    ],
  },
  // {
  //   title: "Pages",
  //   submenu: [
  //     {
  //       title: "Error",
  //       path: "/error",
  //     },
  //     {
  //       title: "Sign In",
  //       path: "/sign-in",
  //     },
  //   ],
  // },
  {
    title: "Contact Us",
    path: "/contact-us",
  },
];

export default NavbarData;
