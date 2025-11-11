import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Importa los iconos que necesites aquí
// Solid icons
import {
  faHome,
  faUser,
  faBars,
  faSearch,
  faHeart,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faXmark,
  faArrowRightFromBracket,
  faDollarSign,
  faChevronLeft,
  faChevronRight,
  faArrowTurnDown,
  faCheckCircle,
  faCreditCard,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

// Regular icons
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";

// Brands icons
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

// Agrega los iconos a la librería
library.add(
  // Solid
  faHome,
  faUser,
  faBars,
  faSearch,
  faHeart,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faXmark,
  faArrowRightFromBracket,
  faDollarSign,
  faChevronLeft,
  faChevronRight,
  faArrowTurnDown,
  faCheckCircle,
  faCreditCard,
  faClock,
  // Regular
  farHeart,
  // Brands
  faWhatsapp
);

export default FontAwesomeIcon;
