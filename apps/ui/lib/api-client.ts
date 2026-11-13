export const apiClient = {
  fetch(path: string, options?: RequestInit) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_API_URL is not configured.");
    }

    return globalThis.fetch(
      `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`,
      options,
    );
  },
};
