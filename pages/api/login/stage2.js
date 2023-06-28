import { apiRouteHelper } from "@/lib/classlink.js";

export default async function handler(req, res) {
  return await apiRouteHelper(req, res, {cookies: "femboy", queryString: ["code"]}, async (req, res, data) => {
    const resp = await fetch("https://applications.apis.classlink.com/exchangeCode?code="+data.queryString.code+"&response_type=code").then(r=>r.json());
    if(!resp.token) throw new Error("classlink server refused femboy request :( :"+JSON.stringify(resp)) 
    data.cookies.cookies.set("cl-token", resp.token)
    res.status(200).json(resp);
  });
}
