export async function onRequest(context: {
  request: Request;
}): Promise<Response> {
  const incoming = new URL(context.request.url);

  const target = new URL(
    incoming.pathname + incoming.search,
    "https://creova-backend-k3jw.onrender.com",
  );

  const headers = new Headers(context.request.headers);
  headers.delete("host");

  return fetch(
    new Request(target.toString(), {
      method: context.request.method,
      headers,
      body:
        context.request.method === "GET" || context.request.method === "HEAD"
          ? undefined
          : context.request.body,
      redirect: "manual",
    }),
  );
}
