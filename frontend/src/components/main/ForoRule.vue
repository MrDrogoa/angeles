<script setup>
import { ref } from "vue";
import Button2Components from "@/components/buttons/Button2Components.vue";

// Estado del modal
const isOpen = ref(false);

// Abrir modal
const open = () => {
  isOpen.value = true;
};

// Cerrar modal
const close = () => {
  isOpen.value = false;
};

// Exponer método open para ser llamado desde el padre
defineExpose({
  open,
});

// Datos dinámicos de las tarjetas del reglamento
const reglamentoSections = ref([
  {
    id: 1,
    type: "info",
    icon: "id-card",
    bgColor: "bg-[#1a1a1a]",
    borderColor: "border-[#FFD700]/30",
    iconBgColor: "bg-[#FFD700]/20",
    iconColor: "text-[#FFD700]",
    title: "🔞 Solo Mayores de 18 Años",
    content:
      "Este foro está exclusivamente dirigido a personas mayores de edad. Al participar, confirmas que tienes 18 años o más según la legislación chilena.",
  },
  {
    id: 2,
    type: "info",
    icon: "user-shield",
    bgColor: "bg-[#1a1a1a]",
    borderColor: "border-[#FFD700]/30",
    iconBgColor: "bg-[#FFD700]/20",
    iconColor: "text-[#FFD700]",
    title: "⚖️ Responsabilidad Personal",
    content: `<strong class="text-[#FFD700]">Importante:</strong> Todo el contenido publicado en el foro es responsabilidad exclusiva de quien lo publica. Ángeles y Demonios actúa únicamente como plataforma y no se hace responsable de las opiniones, experiencias o información compartida por los usuarios.`,
  },
  {
    id: 3,
    type: "warning",
    icon: "ban",
    bgColor: "bg-red-900/20",
    borderColor: "border-red-500/40",
    iconBgColor: "bg-red-500/20",
    iconColor: "text-red-500",
    title: "🚫 Contenido Estrictamente Prohibido",
    isList: true,
    items: [
      {
        label: "Menores de edad:",
        description:
          "Cualquier mención, referencia o contenido relacionado con menores de edad será sancionado inmediatamente y reportado a las autoridades.",
        color: "text-red-400",
      },
      {
        label: "Violencia y amenazas:",
        description:
          "No se toleran mensajes violentos, amenazas de cualquier tipo o incitación al odio.",
        color: "text-red-400",
      },
      {
        label: "Discriminación:",
        description:
          "Prohibido contenido discriminatorio por raza, género, orientación sexual, religión, nacionalidad o cualquier otra característica personal.",
        color: "text-red-400",
      },
      {
        label: "Datos personales:",
        description:
          "No compartas teléfonos, direcciones, RUT u otra información personal identificable de terceros sin consentimiento.",
        color: "text-red-400",
      },
    ],
  },
  {
    id: 4,
    type: "info",
    icon: "eye",
    bgColor: "bg-[#1a1a1a]",
    borderColor: "border-[#FFD700]/30",
    iconBgColor: "bg-[#FFD700]/20",
    iconColor: "text-[#FFD700]",
    title: "👁️ Moderación del Contenido",
    content: `Todos los posts y comentarios son <strong class="text-[#FFD700]">revisados por moderadores antes de publicarse</strong>. Esto nos permite mantener un ambiente seguro y respetuoso para todos.<br><br><span class="text-gray-400 text-xs md:text-sm">⏱️ El tiempo de revisión suele ser de 24-48 horas hábiles. Agradecemos tu paciencia.</span>`,
  },
  {
    id: 5,
    type: "alert",
    icon: "flag",
    bgColor: "bg-orange-900/20",
    borderColor: "border-orange-500/40",
    iconBgColor: "bg-orange-500/20",
    iconColor: "text-orange-400",
    title: "🚩 Reporta Contenido Inapropiado",
    content: `Si encuentras contenido que viole estas normas, puedes reportarlo. Cada reporte es revisado por nuestro equipo de moderación.<br><br><span class="text-orange-300 text-xs md:text-sm"><strong>Importante:</strong> Los reportes falsos o malintencionados también serán sancionados.</span>`,
  },
  {
    id: 6,
    type: "sanctions",
    icon: "gavel",
    bgColor: "bg-red-900/20",
    borderColor: "border-red-500/40",
    iconBgColor: "bg-red-500/20",
    iconColor: "text-red-400",
    title: "⚠️ Sistema de Sanciones",
    intro: "Las violaciones al reglamento se gestionan en 3 niveles:",
    sanctions: [
      {
        level: 1,
        color: "orange",
        title: "Primera infracción: Advertencia",
        description:
          "Se notifica al usuario y se elimina el contenido inapropiado.",
      },
      {
        level: 2,
        color: "orange",
        title: "Segunda infracción: Suspensión Temporal",
        description:
          "Se suspende el acceso al foro por un período determinado (7-30 días).",
      },
      {
        level: 3,
        color: "red",
        title: "Tercera infracción: Baneo Permanente",
        description:
          "Se elimina permanentemente el acceso al foro. No hay apelaciones.",
      },
    ],
    note: "<strong>Nota:</strong> Infracciones graves (como contenido relacionado con menores) resultan en baneo inmediato sin advertencias previas y se reportan a las autoridades.",
  },
  {
    id: 7,
    type: "info",
    icon: "lock",
    bgColor: "bg-purple-900/20",
    borderColor: "border-purple-500/40",
    iconBgColor: "bg-purple-500/20",
    iconColor: "text-purple-400",
    title: "🔒 Privacidad y Protección de Datos",
    intro: "Tu información es importante para nosotros:",
    isList: true,
    items: [
      {
        description:
          "Los datos personales se almacenan de forma segura y se utilizan exclusivamente para el funcionamiento del foro.",
        color: "text-purple-400",
      },
      {
        description:
          "No compartimos tu información con terceros, excepto cuando sea requerido por ley.",
        color: "text-purple-400",
      },
      {
        description:
          "Puedes solicitar la eliminación de tus datos en cualquier momento contactando al equipo de soporte.",
        color: "text-purple-400",
      },
    ],
  },
  {
    id: 8,
    type: "info",
    icon: "balance-scale",
    bgColor: "bg-amber-900/20",
    borderColor: "border-amber-500/40",
    iconBgColor: "bg-amber-500/20",
    iconColor: "text-amber-400",
    title: "⚖️ Cooperación Legal",
    content: `Ángeles y Demonios se reserva el derecho de <strong class="text-amber-400">colaborar con las autoridades competentes</strong> cuando se detecte actividad ilegal en el foro.<br><br><span class="text-amber-300 text-xs md:text-sm">Esto incluye, pero no se limita a: contenido relacionado con menores, trata de personas, extorsión, amenazas o cualquier delito tipificado en la legislación chilena.</span>`,
  },
  {
    id: 9,
    type: "legal",
    icon: "bookmark",
    bgColor: "bg-[#1a1a1a]",
    borderColor: "border-[#FFD700]/30",
    iconBgColor: "bg-[#FFD700]/20",
    iconColor: "text-[#FFD700]",
    title: "📋 Legislación Aplicable",
    intro: "Este foro opera bajo la legislación chilena vigente:",
    laws: [
      {
        name: "Ley 19.628:",
        description: "Protección de la vida privada y datos personales",
      },
      {
        name: "Ley 20.084:",
        description:
          "Responsabilidad penal adolescente (protección de menores)",
      },
      {
        name: "Código Penal:",
        description: "Delitos de injurias, calumnias y amenazas",
      },
      {
        name: "Ley 20.005:",
        description: "Tipifica y sanciona el acoso sexual",
      },
      {
        name: "Ley 21.430:",
        description:
          "Sobre garantías y protección integral de los derechos de la niñez y adolescencia",
      },
      {
        name: "Ley 20.393:",
        description: "Responsabilidad penal de personas jurídicas",
      },
    ],
  },
  {
    id: 10,
    type: "info",
    icon: "hands-helping",
    bgColor: "bg-teal-900/20",
    borderColor: "border-teal-500/40",
    iconBgColor: "bg-teal-500/20",
    iconColor: "text-teal-400",
    title: "🤝 Derechos de los Usuarios",
    intro: "Como usuario del foro, tienes derecho a:",
    isList: true,
    items: [
      {
        description: "Acceder, rectificar o eliminar tus datos personales",
        color: "text-teal-400",
        bullet: "✓",
      },
      {
        description: "Ser notificado de cualquier sanción aplicada a tu cuenta",
        color: "text-teal-400",
        bullet: "✓",
      },
      {
        description:
          "Reportar contenido que viole el reglamento de forma anónima",
        color: "text-teal-400",
        bullet: "✓",
      },
      {
        description:
          "Recibir un trato respetuoso por parte de moderadores y otros usuarios",
        color: "text-teal-400",
        bullet: "✓",
      },
      {
        description:
          "Conocer el motivo específico de cualquier sanción recibida",
        color: "text-teal-400",
        bullet: "✓",
      },
    ],
  },
  {
    id: 11,
    type: "limitation",
    icon: "exclamation-triangle",
    bgColor: "bg-gray-800/40",
    borderColor: "border-gray-600/40",
    iconBgColor: "bg-gray-600/20",
    iconColor: "text-gray-400",
    title: "⚠️ Limitación de Responsabilidad",
    intro: "Ángeles y Demonios no se hace responsable por:",
    isList: true,
    items: [
      {
        description:
          "La veracidad de las experiencias compartidas por los usuarios",
        color: "text-gray-500",
      },
      {
        description:
          "Transacciones, acuerdos o encuentros realizados fuera de la plataforma",
        color: "text-gray-500",
      },
      {
        description:
          "Daños directos o indirectos derivados del uso de la información del foro",
        color: "text-gray-500",
      },
      {
        description:
          "Contenido publicado antes de ser moderado (se revisa en un máximo de 48 horas)",
        color: "text-gray-500",
      },
    ],
    note: "<strong>Importante:</strong> Este foro es únicamente un espacio de intercambio de opiniones y experiencias. Úsalo con criterio propio.",
  },
  {
    id: 12,
    type: "info",
    icon: "edit",
    bgColor: "bg-indigo-900/20",
    borderColor: "border-indigo-500/40",
    iconBgColor: "bg-indigo-500/20",
    iconColor: "text-indigo-400",
    title: "📝 Modificaciones al Reglamento",
    content:
      "Ángeles y Demonios se reserva el derecho de modificar este reglamento en cualquier momento. Los cambios serán notificados a través del foro y entrarán en vigencia inmediatamente después de su publicación. Se recomienda revisar este reglamento periódicamente.",
  },
  {
    id: 13,
    type: "contact",
    icon: "envelope",
    bgColor: "bg-cyan-900/20",
    borderColor: "border-cyan-500/40",
    iconBgColor: "bg-cyan-500/20",
    iconColor: "text-cyan-400",
    title: "📧 Contacto y Soporte",
    content:
      "Si tienes dudas sobre el reglamento, necesitas reportar una situación grave o solicitar la eliminación de tus datos, puedes contactarnos:",
    contactInfo: {
      email: "soporte@angelesydemonios.cl",
      responseTime: "24-48 horas hábiles",
    },
  },
  {
    id: 14,
    type: "info",
    icon: "check-circle",
    bgColor: "bg-green-900/20",
    borderColor: "border-green-500/40",
    iconBgColor: "bg-green-500/20",
    iconColor: "text-green-400",
    title: "✅ Aceptación de Términos",
    content:
      "Al publicar en el foro, aceptas automáticamente este reglamento y te comprometes a cumplirlo. El incumplimiento puede resultar en las sanciones descritas anteriormente.",
  },
]);
</script>

<template>
  <!-- Modal del Reglamento -->
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      @click.self="close"
    >
      <div
        class="mode-card bg-gray-900/50 border-2 border-[#FFD700] rounded-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto mode-card"
      >
        <!-- Header del modal -->
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-white mode-title">
              Reglamento del Foro
            </h2>
            <p class="text-gray-400 text-sm md:text-base mt-1 mode-paragraph">
              Normas para una convivencia respetuosa
            </p>
          </div>
          <button
            @click="close"
            class="text-gray-400 lg:hover:text-white transition-colors text-xl cursor-pointer mode-icon"
            aria-label="Cerrar modal"
          >
            <font-awesome-icon icon="times" />
          </button>
        </div>

        <!-- Contenido del reglamento -->
        <div class="space-y-4">
          <!-- Iterar sobre las secciones dinámicamente -->
          <div
            v-for="section in reglamentoSections"
            :key="section.id"
            :class="[section.bgColor, section.borderColor]"
            class="border rounded-lg p-4 mode-card"
          >
            <div class="flex items-start gap-3">
              <div
                :class="[section.iconBgColor]"
                class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              >
                <font-awesome-icon
                  :icon="section.icon"
                  :class="[section.iconColor]"
                  class="text-lg mode-icon"
                />
              </div>
              <div class="flex-1">
                <h3
                  class="text-white font-bold text-base md:text-lg mb-2 mode-title"
                >
                  {{ section.title }}
                </h3>

                <!-- Contenido simple -->
                <p
                  v-if="
                    section.content && !section.isList && !section.sanctions
                  "
                  class="text-gray-300 text-sm md:text-base mode-paragraph"
                  v-html="section.content"
                ></p>

                <!-- Intro text -->
                <p
                  v-if="section.intro"
                  class="text-gray-300 text-sm md:text-base mb-3 mode-paragraph"
                >
                  {{ section.intro }}
                </p>

                <!-- Lista de items -->
                <ul
                  v-if="section.isList && section.items"
                  class="text-gray-300 text-sm md:text-base space-y-2 mode-paragraph"
                >
                  <li
                    v-for="(item, idx) in section.items"
                    :key="idx"
                    class="flex items-start gap-2"
                  >
                    <span
                      :class="[item.color || 'text-gray-500']"
                      class="shrink-0 mt-1"
                      >{{ item.bullet || "•" }}</span
                    >
                    <span>
                      <strong v-if="item.label" :class="[item.color]">{{
                        item.label
                      }}</strong>
                      {{ item.description }}
                    </span>
                  </li>
                </ul>

                <!-- Sistema de sanciones -->
                <div v-if="section.sanctions" class="space-y-3">
                  <div
                    v-for="sanction in section.sanctions"
                    :key="sanction.level"
                    class="flex items-start gap-2"
                  >
                    <div
                      :class="[
                        `bg-${sanction.color}-500/20`,
                        'shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5',
                      ]"
                    >
                      <span
                        :class="[`text-${sanction.color}-400`]"
                        class="text-xs font-bold"
                        >{{ sanction.level }}</span
                      >
                    </div>
                    <div class="flex-1">
                      <p
                        :class="[`text-${sanction.color}-400`]"
                        class="font-semibold text-sm md:text-base"
                      >
                        {{ sanction.title }}
                      </p>
                      <p class="text-gray-400 text-xs md:text-sm">
                        {{ sanction.description }}
                      </p>
                    </div>
                  </div>
                  <div
                    v-if="section.note"
                    class="mt-3 p-2 bg-red-950/50 rounded border border-red-500/30"
                  >
                    <p
                      class="text-red-300 text-xs md:text-sm mode-paragraph"
                      v-html="section.note"
                    ></p>
                  </div>
                </div>

                <!-- Leyes (legislación) -->
                <ul
                  v-if="section.laws"
                  class="text-gray-400 text-xs md:text-sm space-y-1 mode-paragraph"
                >
                  <li
                    v-for="(law, idx) in section.laws"
                    :key="idx"
                    class="flex items-start gap-2"
                  >
                    <span class="text-[#FFD700] shrink-0">→</span>
                    <span
                      ><strong>{{ law.name }}</strong>
                      {{ law.description }}</span
                    >
                  </li>
                </ul>

                <!-- Info de contacto -->
                <div
                  v-if="section.contactInfo"
                  class="bg-cyan-950/30 rounded p-2 mt-2"
                >
                  <p class="text-cyan-300 text-xs md:text-sm mode-paragraph">
                    <strong>Email de soporte:</strong>
                    {{ section.contactInfo.email }}
                  </p>
                  <p class="text-gray-400 text-xs mt-1 mode-paragraph">
                    Tiempo de respuesta: {{ section.contactInfo.responseTime }}
                  </p>
                </div>

                <!-- Nota adicional para limitación -->
                <div
                  v-if="section.type === 'limitation' && section.note"
                  class="mt-3 p-2 bg-gray-900/50 rounded border border-gray-700/30"
                >
                  <p
                    class="text-gray-400 text-xs mode-paragraph"
                    v-html="section.note"
                  ></p>
                </div>
              </div>
            </div>
          </div>

          <!-- Separador visual -->
          <div class="border-t-2 border-[#FFD700]/20 my-4"></div>

          <!-- Tarjeta Final: Compromiso -->
          <div
            class="bg-linear-to-r from-[#FFD700]/10 to-[#FFB200]/10 border-2 border-[#FFD700]/50 rounded-lg p-5 mode-card"
          >
            <div class="text-center">
              <div class="mb-3">
                <font-awesome-icon
                  icon="shield-alt"
                  class="text-[#FFD700] text-4xl mode-icon"
                />
              </div>
              <h3
                class="text-white font-bold text-lg md:text-xl mb-3 mode-title"
              >
                🛡️ Nuestro Compromiso Contigo
              </h3>
              <p class="text-gray-300 text-sm md:text-base mb-4 mode-paragraph">
                En Ángeles y Demonios nos comprometemos a mantener un foro
                seguro, respetuoso y útil para todos. Trabajamos constantemente
                para proteger a nuestra comunidad y garantizar que este sea un
                espacio de confianza.
              </p>
              <p
                class="text-[#FFD700] text-xs md:text-sm font-semibold mode-paragraph"
              >
                Última actualización: Diciembre 2025 | Válido en todo Chile
              </p>
            </div>
          </div>

          <!-- Botón Aceptar Reglamento -->
          <div class="mt-6 flex justify-center">
            <button-2-components @click="close">
              <font-awesome-icon icon="check-circle" class="mode-icon" />
              He Leído y Acepto el Reglamento
            </button-2-components>
          </div>

          <p class="text-center text-gray-500 text-xs mt-3 mode-paragraph">
            Al cerrar esta ventana, confirmas haber leído y aceptado estos
            términos
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped></style>
