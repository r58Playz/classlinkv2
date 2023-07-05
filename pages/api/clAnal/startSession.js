import { postNoBodyWithBearer, apiRouteHelper } from '@/lib/classlink.js';

export default async function handler(req, res) {
  return await apiRouteHelper(req, res, {cookies: ":3"}, async (req, res, data) => {
    const resp = await postNoBodyWithBearer("https://applications.apis.classlink.com/v1/startSession", data.cookies.t).then(r=>r.text());
    if(resp!=='"Session Started"') throw new Error(resp);
    res.status(200).send(":3");
  });
}
