import { model } from "@medusajs/framework/utils"

const AnnouncementBar = model.define("announcement_bar", {
  id: model.id().primaryKey(),
  messages: model.json(),
  rotation_speed: model.number().default(3500),
  background_color: model.text().default("#1C1C1C"),
  text_color: model.text().default("#FAF9F6"),
  font_family: model.text().default("Jost"),
})

export default AnnouncementBar
