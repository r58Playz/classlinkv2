import { apiRouteHelper } from "@/lib/classlink.js";

export default async function handler(req, res) {
  return await apiRouteHelper(req, res, {}, async (req, res, data) => {
    res.status(418).send("This server identifies as a teapot.");
  });
}
