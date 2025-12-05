/**
 * Servicio de Usuarios de Prueba
 * Proporciona usuarios ficticios para testing del foro
 * TODO: Reemplazar con datos reales de autenticación
 */

const testUsers = [
  // Norte
  { id: 1, name: "Carlos Fernández", location: "Arica, Norte", avatar: "👨‍💼" },
  { id: 2, name: "Patricia Rojas", location: "Iquique, Norte", avatar: "👩‍💼" },
  {
    id: 3,
    name: "Miguel Vargas",
    location: "Antofagasta, Norte",
    avatar: "👨",
  },
  { id: 4, name: "Camila Torres", location: "Calama, Norte", avatar: "👩" },

  // Centro
  { id: 5, name: "Andrés Silva", location: "Santiago, Centro", avatar: "👨‍🦱" },
  {
    id: 6,
    name: "Valentina Muñoz",
    location: "Valparaíso, Centro",
    avatar: "👩‍🦰",
  },
  {
    id: 7,
    name: "Diego Morales",
    location: "Viña del Mar, Centro",
    avatar: "👨‍🦳",
  },
  {
    id: 8,
    name: "Francisca Pérez",
    location: "La Serena, Centro",
    avatar: "👱‍♀️",
  },
  {
    id: 9,
    name: "Sebastián Campos",
    location: "Rancagua, Centro",
    avatar: "🧔",
  },
  { id: 10, name: "Isidora González", location: "Talca, Centro", avatar: "👩‍🦱" },

  // Sur
  { id: 11, name: "Matías López", location: "Concepción, Sur", avatar: "👨‍🎓" },
  { id: 12, name: "Javiera Castro", location: "Temuco, Sur", avatar: "👩‍🎓" },
  { id: 13, name: "Felipe Soto", location: "Valdivia, Sur", avatar: "👨‍💻" },
  {
    id: 14,
    name: "Daniela Ortiz",
    location: "Puerto Montt, Sur",
    avatar: "👩‍💻",
  },
  {
    id: 15,
    name: "Benjamín Ríos",
    location: "Punta Arenas, Sur",
    avatar: "🧑",
  },
];

// Usuario actual simulado (rotará aleatoriamente)
let currentUser = null;

export const testUsersService = {
  /**
   * Obtener todos los usuarios de prueba
   */
  getAllUsers() {
    return testUsers;
  },

  /**
   * Obtener un usuario aleatorio
   */
  getRandomUser() {
    const randomIndex = Math.floor(Math.random() * testUsers.length);
    return testUsers[randomIndex];
  },

  /**
   * Obtener usuario actual (simula sesión)
   * Si no hay usuario, selecciona uno aleatorio
   */
  getCurrentUser() {
    if (!currentUser) {
      currentUser = this.getRandomUser();
      // Guardar en localStorage para persistencia durante la sesión
      localStorage.setItem("currentTestUser", JSON.stringify(currentUser));
    }
    return currentUser;
  },

  /**
   * Cambiar usuario actual (simula cambio de sesión)
   */
  setCurrentUser(userId) {
    const user = testUsers.find((u) => u.id === userId);
    if (user) {
      currentUser = user;
      localStorage.setItem("currentTestUser", JSON.stringify(user));
      return user;
    }
    return null;
  },

  /**
   * Cargar usuario desde localStorage (simula sesión persistente)
   */
  loadCurrentUser() {
    const savedUser = localStorage.getItem("currentTestUser");
    if (savedUser) {
      currentUser = JSON.parse(savedUser);
      return currentUser;
    }
    return this.getCurrentUser(); // Si no hay, crear uno nuevo
  },

  /**
   * Cerrar sesión (limpiar usuario actual)
   */
  logout() {
    currentUser = null;
    localStorage.removeItem("currentTestUser");
  },

  /**
   * Obtener usuario por ID
   */
  getUserById(userId) {
    return testUsers.find((u) => u.id === userId);
  },

  /**
   * Obtener usuarios por región
   */
  getUsersByRegion(region) {
    return testUsers.filter((u) => u.location.includes(region));
  },
};

export default testUsersService;
