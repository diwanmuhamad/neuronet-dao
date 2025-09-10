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
        path: "/marketplace/prompt",
      },
      {
        title: "Datasets",
        path: "/marketplace/dataset",
      },
      {
        title: "AI Outputs",
        path: "/marketplace/ai_output",
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
