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
  faChevronDown,
  faArrowTurnDown,
  faCheckCircle,
  faCreditCard,
  faClock,
  faNewspaper,
  faFile,
  faMapPin,
  faArrowRight,
  faMagnifyingGlass,
  faEye,
  faEyeSlash,
  faUniversalAccess,
  faCircleHalfStroke,
  faTextHeight,
  faSun,
  faMoon,
  faPause,
  faBook,
  faPlus,
  faMinus,
  faPaperPlane,
  faStar,
  faBroom,
} from "@fortawesome/free-solid-svg-icons";

// Regular icons
import {
  faHeart as farHeart,
  faStar as farStar,
} from "@fortawesome/free-regular-svg-icons";

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
  faChevronDown,
  faArrowTurnDown,
  faCheckCircle,
  faCreditCard,
  faClock,
  faNewspaper,
  faFile,
  faMapPin,
  faArrowRight,
  faMagnifyingGlass,
  faEye,
  faEyeSlash,
  faUniversalAccess,
  faCircleHalfStroke,
  faTextHeight,
  faSun,
  faMoon,
  faPause,
  faBook,
  faPlus,
  faMinus,
  faPaperPlane,
  faStar,
  // Regular
  farHeart,
  farStar,
  // Brands
  faWhatsapp,
  faBroom
);

export default FontAwesomeIcon;
