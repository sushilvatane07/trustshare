/**
 * Resilient API Fetch Helper
 * Sends the JWT token via both the Authorization header AND as a ?token= query
 * parameter. This dual approach is required because Cloudflare (in front of Render)
 * strips the Authorization header from cross-origin Safari/iOS requests.
 * The backend checks the header first, then falls back to the query param.
 */

export async function fetchWithTimeout(resource, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  // Extract token from Authorization header if present and append as ?token= query param
  let urlWithToken = resource;
  const authHeader = options.headers?.Authorization || options.headers?.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const separator = resource.includes("?") ? "&" : "?";
    urlWithToken = `${resource}${separator}token=${encodeURIComponent(token)}`;
  }

  try {
    const response = await fetch(urlWithToken, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === "AbortError") {
      console.warn(`Fetch timeout (${timeoutMs}ms) for ${resource}.`);
    } else {
      console.warn(`Fetch error for ${resource}:`, error.message);
    }
    return null;
  }
}
