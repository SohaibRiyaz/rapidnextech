/** Route helpers for the industry pages. No content imports, so it's safe for any bundle. */

export const INDUSTRIES_HUB_PATH = "/software/industries"
export const START_PROJECT_PATH = "/software/start-a-project"

export function industryPath(slug: string) {
  return `${INDUSTRIES_HUB_PATH}/${slug}`
}

/** Inquiry form link with the industry preselected. */
export function startProjectHref(industrySlug?: string) {
  return industrySlug ? `${START_PROJECT_PATH}?industry=${encodeURIComponent(industrySlug)}` : START_PROJECT_PATH
}
