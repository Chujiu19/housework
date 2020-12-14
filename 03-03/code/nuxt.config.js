export default {
  router: {
    linkExactActiveClass: "text-primary",
    extendRoutes(routes, resolve) {
      routes.splice(0);
      routes.push({
        path: "/",
        component: resolve(__dirname, "layouts/Default"),
        children: [
            {
                path: "",
                name: "Home",
                component: resolve(__dirname, 'pages/Home')
            },
            {
                path: "/edit",
                name: "Edit",
                component: resolve(__dirname, 'pages/Edit')
            },
            {
                path: "/settings",
                name: "Settings",
                component: resolve(__dirname, 'pages/Settings')
            },
            {
                path: "/login",
                name: "Login",
                component: resolve(__dirname, 'pages/Login')
            },
            {
                path: "/register",
                name: "Register",
                component: resolve(__dirname, 'pages/Login')
            }
        ]
      });
    },
  },
};
