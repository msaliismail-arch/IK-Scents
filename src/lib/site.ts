export const BRAND = "ASSIL";
export const INSTAGRAM_URL = "https://www.instagram.com/assill.parfums/";

export const resolveImg = (url: string) =>
  url && url.startsWith("/uploads/") ? `/api${url}` : url;
