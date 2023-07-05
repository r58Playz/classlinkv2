import { postNoBodyWithGws, apiRouteHelper } from '@/lib/classlink.js';

export default async function handler(req, res) {
  return await apiRouteHelper(req, res, {cookies: ":3", queryString: ["id"]}, async (req, res, data) => {
    const resp = await postNoBodyWithGws("https://analytics-log.classlink.io/launch/v1p0/appLaunch?applicationId="+data.queryString.id,data.cookies.g);
    if(!(await resp.json()).AppId) throw new Error(await resp.text());
    res.status(200).send("nya~");
  });
}
