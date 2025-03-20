import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/view/LoginPage.vue";
import RegisterPage from "@/view/RegisterPage.vue";
import AdminDashboard from "@/view/AdminDashboard.vue";
import ClientDashboard from "@/view/ClientDashboard.vue";

const routes = [
  { path: "/", name: "Login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  { 
    path: "/admin-dashboard", 
    component: AdminDashboard, 
    meta: { requiresAuth: true, role: "ROLE_ADMIN" } 
  },
  { 
    path: "/client-dashboard", 
    component: ClientDashboard, 
    meta: { requiresAuth: true, role: "ROLE_CLIENT" } 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("authToken"); 
  const userRole = localStorage.getItem("userRole"); 

  
  if (to.meta.requiresAuth) {
    if (!token) {
     
      return next({ path: "/" });
    }

    if (to.meta.role && to.meta.role !== userRole) {
      
      if (userRole === "ROLE_CLIENT") {
        return next({ path: "/client-dashboard" });
      } else if (userRole === "ROLE_ADMIN") {
        return next({ path: "/admin-dashboard" });
      } else {
        return next({ path: "/" }); 
      }
    }
  }

  next(); 
});

export default router;
