/**
 * Bot Personality Service
 * Servicio para acceder a la personalidad del bot
 */

import { botPersonality } from "@/config/botPersonality.js";

class BotPersonalityService {
  constructor() {
    this.personality = botPersonality;
  }

  getGreeting(user = null) {
    const timeKey = this.personality.utils.getGreetingByTime();
    const userName = user ? this.personality.utils.formatUserName(user) : null;

    if (!userName) {
      return this.personality.greetings.anonymous();
    }

    return this.personality.greetings[timeKey](userName);
  }

  getSearchMessage(key) {
    return this.personality.searchMessages[key] || "";
  }

  getProfileMessage(key, ...args) {
    const message = this.personality.profileMessages[key];
    return typeof message === "function" ? message(...args) : message || "";
  }

  getCreateMessage(key) {
    return this.personality.createReportMessages?.[key] || "";
  }

  getMenuMessage(key, ...args) {
    const message = this.personality.menuMessages[key];
    return typeof message === "function" ? message(...args) : message || "";
  }

  getFullName() {
    return this.personality.fullName;
  }

  getName() {
    return this.personality.name;
  }

  getAvatar() {
    return this.personality.avatar;
  }

  getEmoji() {
    return this.personality.emoji;
  }
}

const botPersonalityService = new BotPersonalityService();
export default botPersonalityService;
