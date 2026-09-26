import { visualizeErrorHandler, visualizeRoute } from "../server/visualize";

/**
 * Vercel serves files in /api as serverless functions. Keep the AI key on the
 * server through Vercel environment variables; never expose it to the client.
 */
export default function handler(request: any, response: any) {
  if (request.method !== "POST") {
    response.statusCode = 405;
    response.setHeader("Allow", "POST");
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(JSON.stringify({ error: "الطريقة غير مسموحة.", code: "METHOD_NOT_ALLOWED" }));
    return;
  }

  visualizeRoute(request, response, (error: unknown) => {
    if (error) {
      visualizeErrorHandler(error, request, response, () => undefined);
    }
  });
}
