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
} from "@fortawesome/free-solid-svg-icons";

// Regular icons
// import { farHeart, farUser } from "@fortawesome/free-regular-svg-icons";

// Brand icons
// import {
//   faFacebook,
//   faTwitter,
//   faInstagram,
//   faLinkedin,
//   faGithub,
// } from "@fortawesome/free-brands-svg-icons";

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
  faChevronRight
);

export default FontAwesomeIcon;
