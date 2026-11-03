import { businessWebsites } from "./content/business-websites"
import { ecommerceRetail } from "./content/ecommerce-retail"
import { enterpriseIt } from "./content/enterprise-it"
import { financialServices } from "./content/financial-services"
import { nonprofits } from "./content/nonprofits"
import type { IndustryContent } from "./types"

export type { IndustryContent } from "./types"

/** Every industry content file, in hub order. Add new pages here. */
export const allIndustries: IndustryContent[] = [businessWebsites, ecommerceRetail, enterpriseIt, nonprofits, financialServices]

export const publishedIndustries = allIndustries.filter((i) => i.published)

/** Published and indexable: what goes in the sitemap. */
export const indexableIndustries = publishedIndustries.filter((i) => i.index)

export function getPublishedIndustry(slug: string): IndustryContent | undefined {
  return publishedIndustries.find((i) => i.slug === slug)
}

export { INDUSTRIES_HUB_PATH, START_PROJECT_PATH, industryPath, startProjectHref } from "./paths"
