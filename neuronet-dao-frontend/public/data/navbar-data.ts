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
    title: "Shop",
    submenu: [
      {
        title: "Shop",
        path: "/shop",
      },
      {
        title: "Product Details",
        path: "/product-single",
      },
      {
        title: "Cart",
        path: "/cart",
      },
      {
        title: "Checkout",
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
