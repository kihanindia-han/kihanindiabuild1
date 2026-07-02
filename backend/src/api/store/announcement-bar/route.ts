import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ANNOUNCEMENT_BAR_MODULE } from "../../../modules/announcement-bar/index"
import AnnouncementBarModuleService from "../../../modules/announcement-bar/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const svc = req.scope.resolve<AnnouncementBarModuleService>(ANNOUNCEMENT_BAR_MODULE)
  const config = await svc.getConfig()
  res.json(config)
}
