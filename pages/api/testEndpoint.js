import fetchWithBearer, { apiRouteHelper } from "@/lib/classlink.js";

export default async function handler(req, res) {
  return await apiRouteHelper(req, res, { cookies: ":3", queryString: ["url"] }, async (req, res, data) => {
    const resp = await fetchWithBearer("https://"+data.queryString.url, data.cookies.t).then(r=>r.json());
    res.status(200).json(resp);
  });
}
