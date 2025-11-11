import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AllViews from "@/views/AllViews.vue";
import NewsViews from "@/views/NewsViews.vue";
import PremiumViews from "@/views/PremiumViews.vue";
import VipViews from "@/views/VipViews.vue";
import NormalViews from "@/views/NormalViews.vue";
import TopViews from "@/views/TopViews.vue";
import MasajistasViews from "@/views/MasajistasViews.vue";
import SocialViews from "@/views/SocialViews.vue";
import DestacadasViews from "@/views/DestacadasViews.vue";
import ProfileViews from "@/views/ProfileViews.vue";
import ComentsViews from "@/views/ComentsViews.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: {
      title: "Inicio - Angeles y Demonios",
    },
  },
  {
    path: "/all",
    name: "All",
    component: AllViews,
    meta: {
      title: "Todas las Vistas - Angeles y Demonios",
    },
  },
  {
    path: "/news",
    name: "News",
    component: NewsViews,
    meta: {
      title: "Noticias - Angeles y Demonios",
    },
  },
  {
    path: "/premium",
    name: "Premium",
    component: PremiumViews,
    meta: {
      title: "Premium - Angeles y Demonios",
    },
  },
  {
    path: "/vip",
    name: "VIP",
    component: VipViews,
    meta: {
      title: "VIP - Angeles y Demonios",
    },
  },
  {
    path: "/normal",
    name: "Normal",
    component: NormalViews,
    meta: {
      title: "Normal - Angeles y Demonios",
    },
  },
  {
    path: "/top",
    name: "Top",
    component: TopViews,
    meta: {
      title: "Top - Angeles y Demonios",
    },
  },
  {
    path: "/masajistas",
    name: "Masajistas",
    component: MasajistasViews,
    meta: {
      title: "Masajistas - Angeles y Demonios",
    },
  },
  {
    path: "/social",
    name: "Social",
    component: SocialViews,
    meta: {
      title: "Social - Angeles y Demonios",
    },
  },
  {
    path: "/destacadas",
    name: "Destacadas",
    component: DestacadasViews,
    meta: {
      title: "Destacadas - Angeles y Demonios",
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfileViews,
    meta: {
      title: "Perfil - Angeles y Demonios",
    },
  },
  {
    path: "/coments",
    name: "coments",
    component: ComentsViews,
    meta: {
      title: "Comentarios - Angeles y Demonios",
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
