import { postNoBodyWithGws, apiRouteHelper } from '@/lib/classlink.js';

export default async function handler(req, res) {
  return await apiRouteHelper(req, res, {cookies: ":3", queryString: ["id"]}, async (req, res, data) => {
    const resp = await postNoBodyWithGws("https://analytics-log.classlink.io/launch/v1p0/launch?applicationId="+data.queryString.id,data.cookies.g);
    await postNoBodyWithGws("https://analytics-log.classlink.io/launch/v1p0/appLaunch?applicationId="+data.queryString.id,data.cookies.g);
    const json = await resp.json();
    if(!json.launchToken) throw new Error(JSON.stringify(json));
    res.status(200).json({classlinkv2:"nya~", launchToken:json.launchToken});
  });
}
