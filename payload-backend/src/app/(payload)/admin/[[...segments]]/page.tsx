import type { Metadata } from "next"
import { RootPage, generatePageMetadata } from "@payloadcms/next/views"
import config from "@payload-config"

export const generateMetadata = (): Promise<Metadata> =>
  generatePageMetadata({ config })

const Page = ({ params, searchParams }: { params: { segments: string[] }; searchParams: Record<string, string> }) =>
  RootPage({ config, params, searchParams })

export default Page
