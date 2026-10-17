interface Env {
  RENDER_API_ORIGIN?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const origin =
    context.env.RENDER_API_ORIGIN || "https://creova-backend-k3jw.onrender.com";

  const incoming = new URL(context.request.url);
  const target = new URL(incoming.pathname + incoming.search, origin);

  const request = new Request(target.toString(), context.request);

  return fetch(request, { redirect: "manual" });
};
