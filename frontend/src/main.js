import { createApp } from "vue";
import "./style.css";
import "vue3-carousel/carousel.css";
import App from "./App.vue";
import router from "./router";
import FontAwesomeIcon from "./icons/icon.js";

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(router);
app.mount("#app");
