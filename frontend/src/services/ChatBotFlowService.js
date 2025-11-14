/**
 * ChatBot Flow Service
 * Maneja la lógica de flujos conversacionales y validaciones
 */

class ChatBotFlowService {
  constructor() {
    this.flowSteps = {
      // Definición de pasos para cada flujo
      search: {
        1: { field: 'search_type', question: '¿Cómo quieres buscar?', type: 'options' },
        2: { field: 'search_query', question: 'Ingresa el valor a buscar:', type: 'input' },
        3: { field: 'results', question: 'Resultados:', type: 'results' }
      },
      
      create_report: {
        1: { field: 'nombre', question: '¿Cuál es el nombre?', type: 'input', required: true },
        2: { field: 'apellido', question: '¿Cuál es el apellido?', type: 'input', required: true },
        3: { field: 'nickNames', question: '¿Utiliza algún apodo? (opcional)', type: 'input', required: false },
        4: { field: 'nacionalidad', question: '¿Cuál es la nacionalidad?', type: 'select', required: false },
        5: { field: 'idType', question: '¿Qué tipo de identificación tiene?', type: 'options', required: true },
        6: { field: 'identificacion', question: 'Ingresa el número de identificación:', type: 'input', required: true },
        7: { field: 'genero', question: '¿Cuál es el género?', type: 'options', required: false },
        8: { field: 'telefono', question: '¿Número de teléfono? (con código país)', type: 'input', required: false },
        9: { field: 'email', question: '¿Email? (opcional)', type: 'input', required: false }
        // Continuará con evaluaciones...
      },
      
      create_express: {
        1: { field: 'nombre', question: '¿Cuál es el nombre?', type: 'input', required: true },
        2: { field: 'apellido', question: '¿Cuál es el apellido?', type: 'input', required: true },
        3: { field: 'idType', question: '¿Qué tipo de identificación tiene?', type: 'options', required: true },
        4: { field: 'identificacion', question: 'Ingresa el número de identificación:', type: 'input', required: true },
        5: { field: 'telefono', question: '¿Número de teléfono? (opcional)', type: 'input', required: false }
        // Continuará con evaluaciones express...
      }
    }
  }

  /**
   * Validar entrada del usuario según el campo actual
   */
  validateInput(field, value, flowType) {
    const validators = {
      nombre: (val) => this.validateName(val),
      apellido: (val) => this.validateName(val),
      identificacion: (val) => this.validateIdentification(val),
      telefono: (val) => this.validatePhone(val),
      email: (val) => this.validateEmail(val)
    }

    if (validators[field]) {
      return validators[field](value)
    }

    return { isValid: true, message: null }
  }

  /**
   * Validar nombre/apellido
   */
  validateName(value) {
    if (!value || value.trim().length < 2) {
      return { 
        isValid: false, 
        message: 'El nombre debe tener al menos 2 caracteres.' 
      }
    }

    if (value.trim().length > 50) {
      return { 
        isValid: false, 
        message: 'El nombre no puede tener más de 50 caracteres.' 
      }
    }

    // Solo letras, espacios y algunos caracteres especiales
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']+$/
    if (!nameRegex.test(value.trim())) {
      return { 
        isValid: false, 
        message: 'El nombre solo puede contener letras, espacios y guiones.' 
      }
    }

    return { isValid: true, value: value.trim() }
  }

  /**
   * Validar identificación (RUT, cédula, pasaporte)
   */
  validateIdentification(value) {
    if (!value || value.trim().length < 5) {
      return { 
        isValid: false, 
        message: 'La identificación debe tener al menos 5 caracteres.' 
      }
    }

    const cleanValue = value.replace(/[.\-\s]/g, '')
    
    if (cleanValue.length < 5 || cleanValue.length > 20) {
      return { 
        isValid: false, 
        message: 'La identificación debe tener entre 5 y 20 caracteres.' 
      }
    }

    return { isValid: true, value: cleanValue }
  }

  /**
   * Validar teléfono
   */
  validatePhone(value) {
    if (!value) {
      return { isValid: true, value: '' } // Teléfono es opcional
    }

    // Remover espacios y caracteres especiales
    const cleanPhone = value.replace(/[\s\-\(\)]/g, '')
    
    // Debe empezar con + y tener números
    const phoneRegex = /^\+\d{8,15}$/
    if (!phoneRegex.test(cleanPhone)) {
      return { 
        isValid: false, 
        message: 'El teléfono debe tener formato +56912345678 (código país + número)' 
      }
    }

    return { isValid: true, value: cleanPhone }
  }

  /**
   * Validar email
   */
  validateEmail(value) {
    if (!value) {
      return { isValid: true, value: '' } // Email es opcional
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value.trim())) {
      return { 
        isValid: false, 
        message: 'Por favor ingresa un email válido (ejemplo@dominio.com)' 
      }
    }

    return { isValid: true, value: value.trim().toLowerCase() }
  }

  /**
   * Obtener opciones para campos de selección
   */
  getFieldOptions(field) {
    const options = {
      idType: [
        { id: 'rut', text: '🇨🇱 RUT (Chile)', value: 'rut' },
        { id: 'cedula', text: '🆔 Cédula', value: 'cedula' },
        { id: 'pasaporte', text: '📘 Pasaporte', value: 'pasaporte' }
      ],
      
      genero: [
        { id: 'masculino', text: '♂️ Masculino', value: 'masculino' },
        { id: 'femenino', text: '♀️ Femenino', value: 'femenino' },
        { id: 'otro', text: '🏳️‍⚧️ Otro', value: 'otro' },
        { id: 'sin_datos', text: '❓ Prefiero no decir', value: 'sin_datos' }
      ],
      
      nacionalidad: [
        'Chilena', 'Argentina', 'Brasileña', 'Colombiana', 'Peruana', 'Boliviana',
        'Ecuatoriana', 'Uruguaya', 'Paraguaya', 'Venezolana', 'Española', 'Italiana',
        'Francesa', 'Alemana', 'Estadounidense', 'Canadiense', 'Mexicana', 'Otra'
      ].map(nat => ({ id: nat.toLowerCase(), text: nat, value: nat })),
      
      evaluaciones: [
        { id: 'si', text: '✅ Sí', value: 'si' },
        { id: 'no', text: '❌ No', value: 'no' },
        { id: 'a_veces', text: '🟡 A veces', value: 'a_veces' },
        { id: 'sin_datos', text: '❓ Sin datos', value: 'sin_datos' }
      ],
      
      trato: [
        { id: 'excelente', text: '⭐⭐⭐⭐⭐ Excelente', value: 'excelente' },
        { id: 'bueno', text: '⭐⭐⭐⭐ Bueno', value: 'bueno' },
        { id: 'regular', text: '⭐⭐⭐ Regular', value: 'regular' },
        { id: 'malo', text: '⭐⭐ Malo', value: 'malo' },
        { id: 'sin_datos', text: '❓ Sin datos', value: 'sin_datos' }
      ],
      
      estrellas: [
        { id: '5', text: '⭐⭐⭐⭐⭐ (5)', value: '5' },
        { id: '4', text: '⭐⭐⭐⭐ (4)', value: '4' },
        { id: '3', text: '⭐⭐⭐ (3)', value: '3' },
        { id: '2', text: '⭐⭐ (2)', value: '2' },
        { id: '1', text: '⭐ (1)', value: '1' }
      ]
    }

    return options[field] || []
  }

  /**
   * Generar pregunta contextual
   */
  generateQuestion(field, currentData = {}) {
    const questions = {
      nombre: '¿Cuál es el **nombre** de la persona?',
      apellido: '¿Cuál es el **apellido**?',
      nickNames: '¿Utiliza algún **apodo** o nombre alternativo? (Escribe "no" si no tiene)',
      nacionalidad: '¿Cuál es la **nacionalidad**?',
      idType: '¿Qué tipo de **identificación** tiene?',
      identificacion: 'Ingresa el número de identificación:',
      genero: '¿Cuál es el **género**?',
      telefono: '¿Cuál es el **número de teléfono**? (incluye código de país, ej: +56912345678)\n\nEscribe "no" si no lo tienes.',
      email: '¿Cuál es el **email**? (opcional)\n\nEscribe "no" si no lo tienes.'
    }

    let question = questions[field] || `Información sobre ${field}:`
    
    // Agregar contexto si ya hay datos
    if (currentData.nombre && field !== 'nombre') {
      question = `Para **${currentData.nombre}${currentData.apellido ? ' ' + currentData.apellido : ''}**:\n\n${question}`
    }

    return question
  }

  /**
   * Formatear respuesta según el tipo de campo
   */
  formatResponse(field, value) {
    const formatters = {
      telefono: (val) => {
        if (!val || val.toLowerCase() === 'no') return null
        return { countryCode: val.substring(0, 3), number: val.substring(3) }
      },
      
      nickNames: (val) => {
        if (!val || val.toLowerCase() === 'no') return []
        return [val.trim()]
      },
      
      email: (val) => {
        if (!val || val.toLowerCase() === 'no') return ''
        return val.trim().toLowerCase()
      }
    }

    if (formatters[field]) {
      return formatters[field](value)
    }

    return value.trim()
  }

  /**
   * Obtener próximo paso del flujo
   */
  getNextStep(currentFlow, currentStep) {
    const maxSteps = {
      search: 3,
      create_report: 15, // Se expandirá
      create_express: 8   // Se expandirá
    }

    if (currentStep >= maxSteps[currentFlow]) {
      return null // Flujo completado
    }

    return currentStep + 1
  }

  /**
   * Obtener información del paso actual
   */
  getStepInfo(flow, step) {
    return this.flowSteps[flow]?.[step] || null
  }

  /**
   * Generar resumen de datos recopilados
   */
  generateSummary(data, type = 'report') {
    const sections = []

    if (data.nombre || data.apellido) {
      sections.push(`**👤 Persona:** ${data.nombre || ''} ${data.apellido || ''}`)
    }

    if (data.identificacion) {
      const idTypeText = data.idType === 'rut' ? 'RUT' : 
                        data.idType === 'cedula' ? 'Cédula' : 'Pasaporte'
      sections.push(`**🆔 ${idTypeText}:** ${data.identificacion}`)
    }

    if (data.telefono) {
      sections.push(`**📱 Teléfono:** ${data.telefono}`)
    }

    if (data.email) {
      sections.push(`**📧 Email:** ${data.email}`)
    }

    return sections.join('\n')
  }

  /**
   * Detectar intención del usuario (para respuestas libres)
   */
  detectIntent(message) {
    const lowerMessage = message.toLowerCase().trim()
    
    // Detectar comandos comunes
    if (['menu', 'inicio', 'volver', 'atrás'].includes(lowerMessage)) {
      return { intent: 'back_to_menu', confidence: 1.0 }
    }
    
    if (['ayuda', 'help', '?'].includes(lowerMessage)) {
      return { intent: 'help', confidence: 1.0 }
    }
    
    if (['cancelar', 'salir', 'exit'].includes(lowerMessage)) {
      return { intent: 'cancel', confidence: 1.0 }
    }
    
    if (['sí', 'si', 'yes', 'ok', 'vale'].includes(lowerMessage)) {
      return { intent: 'confirm', confidence: 0.8 }
    }
    
    if (['no', 'nope', 'nada'].includes(lowerMessage)) {
      return { intent: 'deny', confidence: 0.8 }
    }

    return { intent: 'unknown', confidence: 0.0 }
  }

  /**
   * Generar sugerencias de autocompletado
   */
  getSuggestions(field, partialValue) {
    // Implementación básica para algunos campos
    const suggestions = {
      nacionalidad: [
        'Chilena', 'Argentina', 'Brasileña', 'Colombiana', 'Peruana'
      ].filter(nat => 
        nat.toLowerCase().includes(partialValue.toLowerCase())
      ),
      
      telefono: partialValue.startsWith('+') ? [] : ['+56', '+54', '+55', '+57', '+51']
    }

    return suggestions[field] || []
  }

  /**
   * Validaciones avanzadas específicas por tipo de ID
   */
  validateRUT(rut) {
    if (!rut) return { isValid: false, message: 'RUT es requerido' }
    
    // Limpiar RUT
    const cleanRUT = rut.replace(/[.\-\s]/g, '').toUpperCase()
    
    // Verificar formato básico
    if (!/^\d{7,8}[0-9K]$/.test(cleanRUT)) {
      return { 
        isValid: false, 
        message: 'RUT debe tener formato 12345678-9 o 12345678-K' 
      }
    }

    // Extraer dígito verificador
    const digits = cleanRUT.slice(0, -1)
    const checkDigit = cleanRUT.slice(-1)
    
    // Calcular dígito verificador
    let sum = 0
    let multiplier = 2
    
    for (let i = digits.length - 1; i >= 0; i--) {
      sum += parseInt(digits[i]) * multiplier
      multiplier = multiplier === 7 ? 2 : multiplier + 1
    }
    
    const remainder = sum % 11
    const expectedDigit = remainder === 0 ? '0' : remainder === 1 ? 'K' : (11 - remainder).toString()
    
    if (checkDigit !== expectedDigit) {
      return { 
        isValid: false, 
        message: 'RUT inválido. Verifica el dígito verificador.' 
      }
    }

    return { 
      isValid: true, 
      value: `${digits.slice(0, -3)}.${digits.slice(-3)}-${checkDigit}`,
      rawValue: cleanRUT
    }
  }

  /**
   * Validar formato de cédula según país
   */
  validateCedula(cedula) {
    if (!cedula) return { isValid: false, message: 'Cédula es requerida' }
    
    const cleanCedula = cedula.replace(/[.\-\s]/g, '')
    
    // Validación básica (6-15 dígitos)
    if (!/^\d{6,15}$/.test(cleanCedula)) {
      return { 
        isValid: false, 
        message: 'Cédula debe contener entre 6 y 15 dígitos' 
      }
    }

    return { 
      isValid: true, 
      value: cleanCedula,
      formatted: cleanCedula.replace(/(\d{1,3})(\d{3})(\d{3})/, '$1.$2.$3')
    }
  }

  /**
   * Validar pasaporte
   */
  validatePassport(passport) {
    if (!passport) return { isValid: false, message: 'Pasaporte es requerido' }
    
    const cleanPassport = passport.replace(/[\s\-]/g, '').toUpperCase()
    
    // Formato básico: letras y números, 6-12 caracteres
    if (!/^[A-Z0-9]{6,12}$/.test(cleanPassport)) {
      return { 
        isValid: false, 
        message: 'Pasaporte debe tener entre 6 y 12 caracteres (letras y números)' 
      }
    }

    return { 
      isValid: true, 
      value: cleanPassport
    }
  }

  /**
   * Validación avanzada de teléfono por país
   */
  validatePhoneByCountry(phone) {
    if (!phone) return { isValid: true, value: '' }
    
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
    
    const patterns = {
      '+56': { // Chile
        regex: /^\+56[9][0-9]{8}$/,
        format: '+56 9 XXXX XXXX',
        message: 'Teléfono chileno debe ser +56 9 XXXX XXXX'
      },
      '+54': { // Argentina
        regex: /^\+54[0-9]{10,11}$/,
        format: '+54 XX XXXX XXXX',
        message: 'Teléfono argentino debe tener 10-11 dígitos después del código'
      },
      '+55': { // Brasil
        regex: /^\+55[0-9]{10,11}$/,
        format: '+55 XX XXXXX XXXX',
        message: 'Teléfono brasileño debe tener 10-11 dígitos después del código'
      },
      '+57': { // Colombia
        regex: /^\+57[0-9]{10}$/,
        format: '+57 XXX XXX XXXX',
        message: 'Teléfono colombiano debe tener 10 dígitos después del código'
      }
    }
    
    // Detectar país por código
    const countryCode = Object.keys(patterns).find(code => cleanPhone.startsWith(code))
    
    if (countryCode) {
      const pattern = patterns[countryCode]
      if (!pattern.regex.test(cleanPhone)) {
        return {
          isValid: false,
          message: pattern.message,
          suggestion: pattern.format
        }
      }
    } else {
      // Validación genérica para otros países
      if (!/^\+\d{8,15}$/.test(cleanPhone)) {
        return {
          isValid: false,
          message: 'Formato: +[código país][número] (ej: +56912345678)'
        }
      }
    }

    return { 
      isValid: true, 
      value: cleanPhone,
      country: countryCode,
      formatted: this.formatPhoneNumber(cleanPhone)
    }
  }

  /**
   * Formatear número de teléfono para mostrar
   */
  formatPhoneNumber(phone) {
    if (!phone) return ''
    
    const formats = {
      '+56': (num) => `+56 ${num.slice(3, 4)} ${num.slice(4, 8)} ${num.slice(8)}`,
      '+54': (num) => `+54 ${num.slice(3, 5)} ${num.slice(5, 9)} ${num.slice(9)}`,
      '+55': (num) => `+55 ${num.slice(3, 5)} ${num.slice(5, 10)} ${num.slice(10)}`,
      '+57': (num) => `+57 ${num.slice(3, 6)} ${num.slice(6, 9)} ${num.slice(9)}`
    }
    
    const countryCode = Object.keys(formats).find(code => phone.startsWith(code))
    return countryCode ? formats[countryCode](phone) : phone
  }

  /**
   * Manejo de errores y reintentos
   */
  handleValidationError(field, error, attempt = 1, maxAttempts = 3) {
    const errorMessages = {
      1: `❌ ${error.message}`,
      2: `⚠️ Intento ${attempt}/${maxAttempts}: ${error.message}`,
      3: `🚨 Último intento (${attempt}/${maxAttempts}): ${error.message}\n\n💡 **Ayuda:**`
    }
    
    let message = errorMessages[Math.min(attempt, 3)]
    
    // Agregar ayuda específica en el último intento
    if (attempt >= maxAttempts) {
      const helpText = {
        nombre: 'Solo letras, espacios y guiones. Mínimo 2 caracteres.',
        identificacion: 'Ejemplo: 12.345.678-9 (RUT) o 12345678 (cédula)',
        telefono: 'Formato: +56912345678 (código país + número)',
        email: 'Formato: usuario@dominio.com'
      }
      
      if (helpText[field]) {
        message += `\n• ${helpText[field]}`
      }
      
      message += '\n\nEscribe "ayuda" para más información o "menu" para volver al inicio.'
    }
    
    return {
      message,
      shouldRetry: attempt < maxAttempts,
      nextAttempt: attempt + 1
    }
  }

  /**
   * Análisis de sentimientos básico
   */
  analyzeSentiment(text) {
    const positiveWords = ['excelente', 'bueno', 'genial', 'perfecto', 'increíble', 'fantástico', 'maravilloso']
    const negativeWords = ['malo', 'terrible', 'pésimo', 'horrible', 'espantoso', 'desastroso']
    const neutralWords = ['normal', 'regular', 'común', 'estándar', 'promedio']
    
    const lowerText = text.toLowerCase()
    
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length
    const neutralCount = neutralWords.filter(word => lowerText.includes(word)).length
    
    if (positiveCount > negativeCount && positiveCount > neutralCount) {
      return { sentiment: 'positive', confidence: positiveCount / (positiveCount + negativeCount + neutralCount) }
    } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
      return { sentiment: 'negative', confidence: negativeCount / (positiveCount + negativeCount + neutralCount) }
    } else {
      return { sentiment: 'neutral', confidence: 0.5 }
    }
  }

  /**
   * Generador de preguntas dinámicas para evaluaciones
   */
  generateEvaluationQuestion(field, personalData = {}) {
    const name = personalData.nombre ? ` **${personalData.nombre}**` : ' esta persona'
    
    const questions = {
      puntualidad: `¿Cómo calificarías la **puntualidad** de${name}?`,
      amabilidad: `¿Qué tal la **amabilidad** de${name}?`,
      limpieza: `¿Cómo estuvo la **limpieza** de${name}?`,
      comunicacion: `¿Cómo fue la **comunicación** con${name}?`,
      respeto: `¿${name.replace(' ', '')} fue **respetuoso/a**?`,
      problemas: `¿${name.replace(' ', '')} causó algún **problema**?`,
      recomendacion: `¿**Recomendarías** a${name}?`,
      
      // Para reportes express con estrellas
      calificacion_general: `¿Cómo calificarías en general a${name}? (1-5 estrellas)`,
      volveria_hospedar: `¿Volverías a hospedar a${name}? (1-5 estrellas)`,
      recomendacion_express: `¿Recomendarías a${name} a otros hosts? (1-5 estrellas)`
    }
    
    return questions[field] || `Evaluación de ${field}:`
  }

  /**
   * Validador de datos completos antes de guardar
   */
  validateCompleteData(data, reportType = 'standard') {
    const errors = []
    const warnings = []
    
    // Campos obligatorios básicos
    if (!data.nombre || data.nombre.trim().length < 2) {
      errors.push('Nombre es obligatorio (mínimo 2 caracteres)')
    }
    
    if (!data.apellido || data.apellido.trim().length < 2) {
      errors.push('Apellido es obligatorio (mínimo 2 caracteres)')
    }
    
    if (!data.identificacion || data.identificacion.trim().length < 5) {
      errors.push('Identificación es obligatoria')
    }
    
    if (!data.idType) {
      errors.push('Tipo de identificación es obligatorio')
    }
    
    // Validaciones específicas por tipo de reporte
    if (reportType === 'standard') {
      // Para reportes estándar, verificar que tenga al menos algunas evaluaciones
      const evaluationFields = ['puntualidad', 'amabilidad', 'limpieza', 'comunicacion', 'respeto', 'problemas', 'recomendacion']
      const evaluationsCount = evaluationFields.filter(field => data[field] && data[field] !== 'sin_datos').length
      
      if (evaluationsCount < 3) {
        warnings.push('Se recomienda completar al menos 3 evaluaciones para un reporte más completo')
      }
    } else if (reportType === 'express') {
      // Para reportes express, verificar calificaciones
      const requiredRatings = ['calificacion_general', 'volveria_hospedar', 'recomendacion_express']
      const missingRatings = requiredRatings.filter(field => !data[field] || data[field] === '0')
      
      if (missingRatings.length > 0) {
        errors.push('Todas las calificaciones con estrellas son obligatorias en reportes express')
      }
    }
    
    // Advertencias para datos opcionales importantes
    if (!data.telefono) {
      warnings.push('Se recomienda agregar un teléfono de contacto')
    }
    
    if (!data.email) {
      warnings.push('Se recomienda agregar un email de contacto')
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      completeness: this.calculateCompleteness(data, reportType)
    }
  }

  /**
   * Calcular porcentaje de completitud de datos
   */
  calculateCompleteness(data, reportType = 'standard') {
    const fields = {
      standard: [
        'nombre', 'apellido', 'identificacion', 'idType', 'telefono', 'email', 
        'nacionalidad', 'genero', 'puntualidad', 'amabilidad', 'limpieza', 
        'comunicacion', 'respeto', 'problemas', 'recomendacion'
      ],
      express: [
        'nombre', 'apellido', 'identificacion', 'idType', 'telefono',
        'calificacion_general', 'volveria_hospedar', 'recomendacion_express'
      ]
    }
    
    const relevantFields = fields[reportType] || fields.standard
    const completedFields = relevantFields.filter(field => {
      const value = data[field]
      return value && value !== '' && value !== 'sin_datos' && value !== '0'
    }).length
    
    return Math.round((completedFields / relevantFields.length) * 100)
  }

  /**
   * Gestión de sesión y estado
   */
  saveSessionState(sessionId, state) {
    try {
      const sessionData = {
        ...state,
        timestamp: Date.now(),
        version: '1.0'
      }
      localStorage.setItem(`chatbot_session_${sessionId}`, JSON.stringify(sessionData))
      return true
    } catch (error) {
      console.error('Error saving session state:', error)
      return false
    }
  }

  loadSessionState(sessionId) {
    try {
      const sessionData = localStorage.getItem(`chatbot_session_${sessionId}`)
      if (!sessionData) return null
      
      const parsed = JSON.parse(sessionData)
      
      // Verificar que la sesión no sea muy antigua (24 horas)
      const maxAge = 24 * 60 * 60 * 1000 // 24 horas
      if (Date.now() - parsed.timestamp > maxAge) {
        this.clearSessionState(sessionId)
        return null
      }
      
      return parsed
    } catch (error) {
      console.error('Error loading session state:', error)
      return null
    }
  }

  clearSessionState(sessionId) {
    try {
      localStorage.removeItem(`chatbot_session_${sessionId}`)
      return true
    } catch (error) {
      console.error('Error clearing session state:', error)
      return false
    }
  }

  /**
   * Utilidades de texto y formato
   */
  capitalizeWords(text) {
    if (!text) return ''
    return text.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  normalizeText(text) {
    if (!text) return ''
    return text.trim()
      .replace(/\s+/g, ' ') // Múltiples espacios a uno solo
      .replace(/[^\w\s\-@.]/g, '') // Remover caracteres especiales excepto algunos
  }

  /**
   * Generador de IDs únicos para mensajes
   */
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Detección de spam o contenido inapropiado básico
   */
  detectSpam(text) {
    const spamPatterns = [
      /(.)\1{10,}/, // Caracteres repetidos
      /https?:\/\/[^\s]+/gi, // URLs
      /\b\d{4,}\b/g, // Números largos
      /(premio|ganaste|click|gratis)/gi // Palabras sospechosas
    ]
    
    const spamScore = spamPatterns.reduce((score, pattern) => {
      return score + (pattern.test(text) ? 1 : 0)
    }, 0)
    
    return {
      isSpam: spamScore >= 2,
      score: spamScore,
      confidence: spamScore / spamPatterns.length
    }
  }
}

// Instancia singleton
const chatBotFlowService = new ChatBotFlowService()

export default chatBotFlowService