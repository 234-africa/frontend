
import { createRouter, createWebHistory } from 'vue-router'

import isAdmin from "@/helpers/isAdmin.js";
import isUser from "@/helpers/isUser.js";
import GoogleLoginCallback from '@/components/views/GoogleLoginCallback.vue';



const routes = [,
{
  path:'/',
  name: 'home',
  component: () => import(/* webpackChunkName: "about" */ '../components/views/Home.vue')
  
  
},
{
  path: '/about',
  name: 'about',
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () => import(/* webpackChunkName: "about" */ '../components/views/AboutView.vue')
},
{
path: '/how-it-works',
name: 'work',
component: () => import(/* webpackChunkName: "about" */ '../components/views/Work.vue')
},

{
  path: '/auth/google/callback',
  component: GoogleLoginCallback,
},


{
  path: "/dashboard",
  name: "dash",
   beforeEnter: isUser,
  component: () =>
    import( /* webpackChunkName: "about" */ "../components/dash.vue")
},

{
  path: "/admin",
  name: "admin",
  beforeEnter: isAdmin,
   
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () =>
    import( /* webpackChunkName: "about" */ "../components/Admin.vue")
  
},
{
  path: "/scanner",
  name: "scanner",
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () =>
    import( /* webpackChunkName: "about" */ "../components/scanner.vue")
},


  {
    path: "/categories/:categoryType",
    name: "category-products",

    component: () =>
      import(
        /* webpackChunkName: "about" */ "../components/CategoryProducts.vue"
      ),
  },
{
  path: '/payment-success',
  name: 'PaymentSuccess',
  component: () => import('@/components/PaymentSuccess.vue'),
},


{
  path: "/checkout",
  name: "checkout",
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () =>
    import( /* webpackChunkName: "about" */ "../components/Payment.vue")
},

{
  path: "/login",
  name: "login",
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () =>
    import( /* webpackChunkName: "about" */ "../components/auth/Login.vue")
},
  {
    path: '/confirm-email',
    name: 'ConfirmEmail',
      component: () =>
    import( /* webpackChunkName: "about" */ "../components/auth/confirmEmail.vue")

  },
{
  path: "/staff-login",
  name: "staff",
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () =>
    import( /* webpackChunkName: "about" */ "../components/auth/staffLogin.vue")
},
{
  path: "/register",
  name: "register",
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () =>
    import( /* webpackChunkName: "about" */ "../components/auth/Register.vue")
},
{
  path: "/forgot-password",
  name: "forgot-password",
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () =>
    import(
      /* webpackChunkName: "about" */
      "../components/auth/ForgotPassword.vue"
    )
},
{
  path: "/reset",
  name: "reset",
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () =>
    import( /* webpackChunkName: "about" */ "../components/auth/Reset.vue")
},
{
  path: "/profile",
  name: "profile",
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () =>
    import( /* webpackChunkName: "about" */ "../components/auth/staffLogin.vue")
},

{
  path: "/event",
  name: "product",
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  component: () =>
    import( /* webpackChunkName: "about" */ "../components/Product.vue")
},
 {
    path: "/event/:title",
    name: 'ProductDetails',
    props: true,
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../components/Product.vue"
      ),
  },



{
  path: "/events",
  name: "events",
  component: () =>
    import( /* webpackChunkName: "about" */ "../components/events.vue")
},

{
  path: "/rex",
  name: "rex",
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.

      //  beforeEnter: isAdmin,
  component: () =>
    import( /* webpackChunkName: "about" */ "../components/rex.vue")
},
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})



export default router
