import AnnouncementBarModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const ANNOUNCEMENT_BAR_MODULE = "announcement_bar"

export default Module(ANNOUNCEMENT_BAR_MODULE, {
  service: AnnouncementBarModuleService,
})
