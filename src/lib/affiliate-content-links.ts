/** Replace a complete destination, never the prefix of a different URL. */
export function replaceExactAffiliateUrl(content: string, url: string, redirect: string): string {
  const variants = new Set([url, url.replaceAll("&", "\\&"), url.replaceAll("&", "&amp;")]);
  for (const variant of variants) {
    const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    content = content.replace(new RegExp(`${escaped}(?=[\\s"'<>)]|$)`, "g"), () => redirect);
  }
  return content;
}
