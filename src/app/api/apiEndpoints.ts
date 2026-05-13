// apiEndpoints.ts
import { API_BASE_URL, formator } from "./apiConfig";

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/health`,

  collection: (collection: string , limit: number) =>
    `${API_BASE_URL}/api/${collection}?limit=${limit ? `${limit}` : ""}`, 

  itemById: (collection: string, id: string | number) =>
    `${API_BASE_URL}/api/${collection}/${id}`,

  search: (searchTerm: string) =>
    `${API_BASE_URL}/api/search/${encodeURIComponent(searchTerm)}`,

  trending: (type:String , limit?: number) =>
    `${API_BASE_URL}/api/trending/${type}?limit=${limit ? `${limit}` : ""}`,

  recent: (contentType?: string, limit?: number) =>
    `${API_BASE_URL}/api/recent${contentType ? `/${contentType}?limit=${limit ? `${limit}` : ""}` : ""}`,

  Stream: (collection: string, id: string | number) =>
    `${formator}/${collection}/${id}`,

  Plateform: (genres?: string, limit?: number) =>
    `https://api.hicine.info/rpc/platform/${genres}?limit=${limit ? `${limit}` : ""}`,

  stats: `${API_BASE_URL}/api/stats`,
} as const;
