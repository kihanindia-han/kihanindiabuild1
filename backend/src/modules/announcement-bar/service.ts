import { MedusaService } from "@medusajs/framework/utils"
import AnnouncementBar from "./models/announcement-bar"

export type AnnouncementMessage = {
  id: string
  text: string
  linkText?: string
  linkUrl?: string
}

export type AnnouncementBarConfig = {
  messages: AnnouncementMessage[]
  rotation_speed: number
  background_color: string
  text_color: string
  font_family: string
}

const DEFAULT_CONFIG: AnnouncementBarConfig = {
  messages: [
    { id: "1", text: "FREE SHIPPING ON ALL ORDERS" },
    { id: "2", text: "NEW COLLECTION — SHOP NOW", linkText: "SHOP NOW", linkUrl: "/collections" },
    { id: "3", text: "HANDCRAFTED IN INDIA" },
  ],
  rotation_speed: 3500,
  background_color: "#1C1C1C",
  text_color: "#FAF9F6",
  font_family: "Jost",
}

class AnnouncementBarModuleService extends MedusaService({
  AnnouncementBar,
}) {
  async getConfig(): Promise<AnnouncementBarConfig> {
    const records = await (this as any).listAnnouncementBars({}, { take: 1 })
    if (records.length === 0) {
      return DEFAULT_CONFIG
    }
    const r = records[0]
    return {
      messages: (r.messages as AnnouncementMessage[]) ?? DEFAULT_CONFIG.messages,
      rotation_speed: r.rotation_speed ?? DEFAULT_CONFIG.rotation_speed,
      background_color: r.background_color ?? DEFAULT_CONFIG.background_color,
      text_color: r.text_color ?? DEFAULT_CONFIG.text_color,
      font_family: r.font_family ?? DEFAULT_CONFIG.font_family,
    }
  }

  async saveConfig(config: AnnouncementBarConfig): Promise<AnnouncementBarConfig> {
    const svc = this as any
    const records = await svc.listAnnouncementBars({}, { take: 1 })
    if (records.length === 0) {
      await svc.createAnnouncementBars({
        messages: config.messages,
        rotation_speed: config.rotation_speed,
        background_color: config.background_color,
        text_color: config.text_color,
        font_family: config.font_family,
      })
    } else {
      await svc.updateAnnouncementBars(
        { id: records[0].id },
        {
          messages: config.messages,
          rotation_speed: config.rotation_speed,
          background_color: config.background_color,
          text_color: config.text_color,
          font_family: config.font_family,
        }
      )
    }
    return config
  }
}

export default AnnouncementBarModuleService
