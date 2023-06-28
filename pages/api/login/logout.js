import fetchWithBearer, { apiRouteHelper } from '@/lib/classlink.js';

export default async function handler(req, res) {
  return await apiRouteHelper(req, res, { cookies: ":3" }, async (req, res, data) => {
    const resp = await fetchWithBearer("https://applications.apis.classlink.com/v1/endSession?", data.cookies.t);
  });
}
