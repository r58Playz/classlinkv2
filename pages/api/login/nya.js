import { apiRouteHelper } from "@/lib/classlink.js";

export default async function handler(req, res) {
  return await apiRouteHelper(req, res, {cookies: "femboy", queryString: ["code","token","gws"]}, async (req, res, data) => {
    const userData = await fetchWithBearer("https://nodeapi.classlink.com/v2/my/info", data.queryString.token).then(r=>r.json());
    if(userData.message === "Invalid or expired access token") {
      throw new Error("classlink server refused femboy request: invalid token") 
    }
    data.cookies.cookies.set("cl-token", data.queryString.token)
    data.cookies.cookies.set("cl-code", data.queryString.code)
    data.cookies.cookies.set("cl-gws", data.queryString.gws)
    res.redirect(307, '/dashboard');
  });
}
