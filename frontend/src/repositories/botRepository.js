import httpService from '../services/httpService.js'

/**
 * Repository para manejar validaciones y sugerencias del chatbot
 */
export class BotRepository {
  
  /**
   * Validar un campo específico
   * @param {string} field - Nombre del campo (nombre, apellido, telefono, etc.)
   * @param {string} value - Valor a validar
   * @param {string} type - Tipo específico (opcional, ej: rut, cedula, pasaporte)
   * @param {Object} context - Contexto adicional (opcional)
   * @returns {Promise} Resultado de validación
   */
  async validateField(field, value, type = null, context = {}) {
    try {
      console.log(`🔍 BotRepository: Validando campo ${field}...`)
      
      const requestData = {
        field,
        value,
        type,
        context
      }
      
      const response = await httpService.post('/bot/validate-field', requestData)
      
      console.log(`✅ BotRepository: Validación de ${field} completada`)
      return {
        success: true,
        validation: response.data
      }
    } catch (error) {
      console.error(`❌ BotRepository: Error validando ${field}:`, error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        validation: {
          isValid: false,
          message: 'Error al validar el campo'
        }
      }
    }
  }

  /**
   * Obtener sugerencias para un campo
   * @param {string} field - Nombre del campo (nacionalidad, nombre, telefono, etc.)
   * @param {string} query - Texto de búsqueda
   * @param {number} limit - Límite de sugerencias (default: 5)
   * @param {string} sessionId - ID de sesión para tracking (opcional)
   * @returns {Promise} Lista de sugerencias
   */
  async getSuggestions(field, query = '', limit = 5, sessionId = null) {
    try {
      console.log(`💡 BotRepository: Obteniendo sugerencias para ${field}...`)
      
      const params = {
        field,
        query,
        limit
      }
      
      // NUEVO: Agregar sessionId si existe (para tracking)
      if (sessionId) {
        params.sessionId = sessionId
      }
      
      const response = await httpService.get('/bot/suggestions', { params })
      
      console.log(`✅ BotRepository: ${response.data.count} sugerencias obtenidas para ${field}`)
      return {
        success: true,
        suggestions: response.data.suggestions,
        count: response.data.count,
        field: response.data.field,
        query: response.data.query
      }
    } catch (error) {
      console.error(`❌ BotRepository: Error obteniendo sugerencias para ${field}:`, error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        suggestions: [],
        count: 0
      }
    }
  }

  /**
   * Validar RUT específicamente
   * @param {string} rut - RUT a validar
   * @returns {Promise} Resultado de validación de RUT
   */
  async validateRUT(rut) {
    return this.validateField('rut', rut)
  }

  /**
   * Validar teléfono específicamente
   * @param {string} phone - Teléfono a validar
   * @returns {Promise} Resultado de validación de teléfono
   */
  async validatePhone(phone) {
    return this.validateField('telefono', phone)
  }

  /**
   * Validar email específicamente
   * @param {string} email - Email a validar
   * @returns {Promise} Resultado de validación de email
   */
  async validateEmail(email) {
    return this.validateField('email', email)
  }

  /**
   * Validar nombre específicamente
   * @param {string} name - Nombre a validar
   * @returns {Promise} Resultado de validación de nombre
   */
  async validateName(name) {
    return this.validateField('nombre', name)
  }

  /**
   * Obtener sugerencias de nacionalidades
   * @param {string} query - Texto de búsqueda
   * @param {number} limit - Límite de sugerencias
   * @returns {Promise} Lista de nacionalidades
   */
  async getNacionalidadSuggestions(query = '', limit = 5) {
    return this.getSuggestions('nacionalidad', query, limit)
  }

  /**
   * Obtener sugerencias de nombres
   * @param {string} query - Texto de búsqueda
   * @param {number} limit - Límite de sugerencias
   * @returns {Promise} Lista de nombres
   */
  async getNameSuggestions(query = '', limit = 5) {
    return this.getSuggestions('nombre', query, limit)
  }

  /**
   * Obtener sugerencias de códigos de teléfono
   * @param {string} query - Texto de búsqueda
   * @param {number} limit - Límite de sugerencias
   * @returns {Promise} Lista de códigos de país
   */
  async getPhoneSuggestions(query = '', limit = 5) {
    return this.getSuggestions('telefono', query, limit)
  }

  /**
   * Obtener sugerencias de ubicaciones
   * @param {string} query - Texto de búsqueda
   * @param {number} limit - Límite de sugerencias
   * @returns {Promise} Lista de ubicaciones
   */
  async getLocationSuggestions(query = '', limit = 5) {
    return this.getSuggestions('ubicacion', query, limit)
  }

  /**
   * Validar múltiples campos a la vez
   * @param {Array} fields - Array de objetos con {field, value, type}
   * @returns {Promise} Resultados de validación para todos los campos
   */
  async validateMultipleFields(fields) {
    try {
      console.log(`🔍 BotRepository: Validando ${fields.length} campos...`)
      
      const validationPromises = fields.map(fieldData => 
        this.validateField(fieldData.field, fieldData.value, fieldData.type)
      )
      
      const results = await Promise.all(validationPromises)
      
      const successCount = results.filter(r => r.success).length
      console.log(`✅ BotRepository: ${successCount}/${fields.length} campos validados exitosamente`)
      
      return {
        success: true,
        results,
        summary: {
          total: fields.length,
          success: successCount,
          failed: fields.length - successCount
        }
      }
    } catch (error) {
      console.error('❌ BotRepository: Error en validación múltiple:', error)
      return {
        success: false,
        error: error.message,
        results: [],
        summary: {
          total: fields.length,
          success: 0,
          failed: fields.length
        }
      }
    }
  }

  // ============ NUEVOS MÉTODOS PARA TRACKING (NO MODIFICAN LÓGICA EXISTENTE) ============

  /**
   * Crear nueva conversación/sesión del bot
   * @param {Object} context - Contexto de la sesión
   * @returns {Promise} Resultado con sessionId
   */
  async createConversation(context = {}) {
    try {
      console.log('🆕 BotRepository: Creando sesión de chatbot...')
      
      const response = await httpService.post('/bot/conversations', { context })
      
      console.log('✅ BotRepository: Sesión creada:', response.data.sessionId)
      return {
        success: true,
        sessionId: response.data.sessionId,
        conversation: response.data.conversation
      }
    } catch (error) {
      console.error('❌ BotRepository: Error creando sesión:', error.response?.data || error.message)
      return {
        success: false,
        error: error.message,
        sessionId: null
      }
    }
  }

  /**
   * Completar conversación exitosamente
   * @param {string} sessionId - ID de la sesión
   * @param {string} reportId - ID del reporte creado
   * @returns {Promise} Resultado
   */
  async completeConversation(sessionId, reportId) {
    try {
      if (!sessionId) return { success: false }
      
      console.log(`✅ BotRepository: Completando sesión ${sessionId}`)
      
      const response = await httpService.post(`/bot/conversations/${sessionId}/complete`, {
        reportId
      })
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('❌ BotRepository: Error completando conversación:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Abandonar conversación
   * @param {string} sessionId - ID de la sesión
   * @returns {Promise} Resultado
   */
  async abandonConversation(sessionId) {
    try {
      if (!sessionId) return { success: false }
      
      console.log(`⚠️ BotRepository: Abandonando sesión ${sessionId}`)
      
      const response = await httpService.post(`/bot/conversations/${sessionId}/abandon`)
      
      return { success: true, data: response.data }
    } catch (error) {
      console.error('❌ BotRepository: Error abandonando conversación:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Enviar feedback del usuario
   * @param {Object} feedbackData - Datos del feedback
   * @returns {Promise} Resultado
   */
  async submitFeedback(feedbackData) {
    try {
      console.log('📝 BotRepository: Enviando feedback...')
      
      const response = await httpService.post('/bot/feedback', feedbackData)
      
      console.log('✅ BotRepository: Feedback enviado')
      return { success: true, feedbackId: response.data.feedbackId }
    } catch (error) {
      console.error('❌ BotRepository: Error enviando feedback:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Registrar uso de sugerencia
   * @param {string} sessionId - ID de la sesión
   * @param {string} field - Campo donde se usó la sugerencia
   * @param {string} suggestion - Sugerencia seleccionada
   * @returns {Promise} Resultado
   */
  async recordSuggestionUsed(sessionId, field, suggestion) {
    try {
      if (!sessionId) return { success: false }
      
      await httpService.post('/bot/suggestion-used', {
        sessionId,
        field,
        suggestion
      })
      
      return { success: true }
    } catch (error) {
      console.error('❌ BotRepository: Error registrando sugerencia:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Obtener métricas del bot (para admins)
   * @param {Date} startDate - Fecha inicio
   * @param {Date} endDate - Fecha fin
   * @returns {Promise} Métricas
   */
  async getAnalytics(startDate = null, endDate = null) {
    try {
      const params = {}
      if (startDate) params.startDate = startDate.toISOString()
      if (endDate) params.endDate = endDate.toISOString()
      
      const response = await httpService.get('/bot/analytics/metrics', { params })
      
      return {
        success: true,
        metrics: response.data.metrics,
        period: response.data.period
      }
    } catch (error) {
      console.error('❌ BotRepository: Error obteniendo analytics:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Validar datos completos de un reporte
   * @param {Object} reportData - Datos del reporte a validar
   * @param {string} reportType - Tipo de reporte ('standard' o 'express')
   * @returns {Promise} Resultado de validación completa
   */
  async validateReportData(reportData, reportType = 'standard') {
    try {
      console.log(`🔍 BotRepository: Validando datos de reporte ${reportType}...`)
      
      const fieldsToValidate = [
        { field: 'nombre', value: reportData.nombre },
        { field: 'apellido', value: reportData.apellido },
        { field: 'identificacion', value: reportData.identificacion, type: reportData.idType }
      ]
      
      // Agregar campos opcionales si existen
      if (reportData.telefono) {
        fieldsToValidate.push({ field: 'telefono', value: reportData.telefono })
      }
      
      if (reportData.email) {
        fieldsToValidate.push({ field: 'email', value: reportData.email })
      }
      
      const validationResult = await this.validateMultipleFields(fieldsToValidate)
      
      // Analizar resultados
      const invalidFields = validationResult.results
        .filter(result => !result.validation.isValid)
        .map(result => result.validation.field)
      
      const isValid = invalidFields.length === 0
      
      console.log(`${isValid ? '✅' : '❌'} BotRepository: Validación de reporte ${isValid ? 'exitosa' : 'falló'}`)
      
      return {
        success: true,
        isValid,
        invalidFields,
        validationResults: validationResult.results,
        summary: validationResult.summary
      }
      
    } catch (error) {
      console.error('❌ BotRepository: Error en validación de reporte:', error)
      return {
        success: false,
        error: error.message,
        isValid: false,
        invalidFields: [],
        validationResults: []
      }
    }
  }
}

// Crear instancia singleton
const botRepository = new BotRepository()

export default botRepository