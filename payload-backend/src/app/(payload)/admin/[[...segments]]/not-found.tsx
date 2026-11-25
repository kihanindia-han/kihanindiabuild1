import { NotFoundPage, generatePageMetadata } from "@payloadcms/next/views"
import { Metadata } from "next"
import config from "@payload-config"

export const generateMetadata = (): Promise<Metadata> =>
  generatePageMetadata({ config })

const NotFound = () => NotFoundPage({ config })
export default NotFound
