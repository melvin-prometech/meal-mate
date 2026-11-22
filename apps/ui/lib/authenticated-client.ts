import "server-only";

import { getAuth } from "@/features/auth/auth";
import { apiClient } from "@/lib/api-client";

export const authenticatedClient = {
  async fetch(path: string, options: RequestInit = {}) {
    const auth = await getAuth();
    if (!auth) throw new Error("Sign in is required to make this request.");

    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${auth.accessToken}`);

    return apiClient.fetch(path, { ...options, headers });
  },
};
