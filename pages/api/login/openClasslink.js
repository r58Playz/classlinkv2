import { apiRouteHelper } from '@/lib/classlink.js';

export default async function handler(req, res) {
  return await apiRouteHelper(req, res, {cookies: ":3"}, async (req, res, data)=>{
    res.redirect(307, `https://myapps.classlink.com/oauth/?code=${data.cookies.c}&responseType=code&skipIntercept=femboy`);
  });
}
