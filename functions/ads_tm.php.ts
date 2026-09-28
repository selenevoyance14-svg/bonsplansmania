import { serveAdsTxt } from "./_shared/ads-txt";

export const onRequestGet: PagesFunction = serveAdsTxt;
export const onRequestHead: PagesFunction = async (context) => {
  const response = await serveAdsTxt(context);
  return new Response(null, { status: response.status, headers: response.headers });
};
