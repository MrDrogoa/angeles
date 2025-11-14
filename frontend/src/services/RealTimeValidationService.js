/**
 * Real Time Validation Service
 * Servicio para validación en tiempo real de campos
 */

class RealTimeValidator {
  async validateField(field, value, type = null) {
    // Implementación básica de validación
    const validators = {
      nombre: this.validateName,
      apellido: this.validateName,
      ubicacion: this.validateLocation,
      precio: this.validatePrice,
      email: this.validateEmail,
      telefono: this.validatePhone,
    };

    const validator = validators[field];
    if (validator) {
      return validator.call(this, value);
    }

    return { isValid: true, value };
  }

  validateName(value) {
    if (!value || value.trim().length < 2) {
      return {
        isValid: false,
        message: "El nombre debe tener al menos 2 caracteres",
      };
    }
    return { isValid: true, value: value.trim() };
  }

  validateLocation(value) {
    if (!value || value.trim().length < 2) {
      return {
        isValid: false,
        message: "La ubicación debe tener al menos 2 caracteres",
      };
    }
    return { isValid: true, value: value.trim() };
  }

  validatePrice(value) {
    const price = parseInt(value);
    if (isNaN(price) || price < 0) {
      return {
        isValid: false,
        message: "El precio debe ser un número válido",
      };
    }
    return { isValid: true, value: price };
  }

  validateEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return {
        isValid: false,
        message: "El email no es válido",
      };
    }
    return { isValid: true, value: value.trim() };
  }

  validatePhone(value) {
    const phoneRegex = /^\d{8,12}$/;
    const cleanValue = value.replace(/[\s\-]/g, "");
    if (!phoneRegex.test(cleanValue)) {
      return {
        isValid: false,
        message: "El teléfono debe tener entre 8 y 12 dígitos",
      };
    }
    return { isValid: true, value: cleanValue };
  }
}

export const realTimeValidator = new RealTimeValidator();
export default realTimeValidator;
