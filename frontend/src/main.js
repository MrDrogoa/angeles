import { createApp } from "vue";
import "./style.css";
import "vue3-carousel/carousel.css";
// CSS de Accesibilidad
import "./css/accessibilityBlindness.css";
import "./css/accessibilityDyslexia.css";
import "./css/accessibilityHighContrast.css";
import "./css/accessibilityLargeText.css";
import "./css/accessibilityLight.css";
import "./css/accessibilityReduceMotion.css";
import "./css/accessibilityVisualRest.css";
import App from "./App.vue";
import router from "./router";
import FontAwesomeIcon from "./icons/icon.js";
import AccessibilityComponents from "./components/AccessiblityComponents.vue";

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.component("AccessibilityComponents", AccessibilityComponents);
app.use(router);
app.mount("#app");
