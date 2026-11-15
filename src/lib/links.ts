/** True for anything that leaves the app: absolute http(s) URLs, mailto:, and static files such as /resume.pdf. */
export function isExternalHref(href: string): boolean {
  return /^(https?:|mailto:)/.test(href) || /\.[a-z0-9]{2,4}$/i.test(href);
}

/** Props that open a link in a new tab safely. Empty for in-app routes and mailto links. */
export function externalLinkProps(href: string) {
  if (href.startsWith("mailto:") || !isExternalHref(href)) return {};
  return { target: "_blank", rel: "noopener noreferrer" } as const;
}
