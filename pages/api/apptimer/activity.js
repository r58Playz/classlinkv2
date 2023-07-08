import { postNoBodyWithGws, apiRouteHelper } from '@/lib/classlink.js';

export default async function handler(req, res) {
  return await apiRouteHelper(req, res, {cookies: ":3", queryString: ["launchToken","time"]}, async (req, res, data) => {
    const resp = await postNoBodyWithGws(`https://analytics-log.classlink.io/activity/v1p0/activity?launchToken=${data.queryString.launchToken}&activeS=${data.queryString.time}`,data.cookies.g);
    const json = await resp.json();
    if(!json.activeS) throw new Error(JSON.stringify(json));
    res.status(200).json({classlinkv2:"nya!",activeS:json.activeS});
  });
}
