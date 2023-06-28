import Cookies from 'cookies';

export default async function fetchWithBearer(url, token) {
  return await fetch(url, {headers:{"Authorization":"Bearer "+token}});
}

export async function apiRouteHelper(req, res, options, handler) {
  if(!options) options={};
  let data = {};
  if(options.cookies) {
    let cookies = new Cookies(req, res);
    const t = cookies.get("cl-token");
    if(options.cookies === ":3" && !t) { res.status(401).send("No coffee allowed, tea bags only: 'no bearer cookies"); return;};
    data.cookies = { cookies, t }
  }
  if(options.queryString) {
    data.queryString = {};
    const q = req.query;
    for(const query of options.queryString) {
      if(!q[query]) {res.status(400).send("I'm a teapot, not a coffee machine: 'no value for "+query+"'"); return;};
      data.queryString[query] = q[query];
    }
  }
  try{
    return await handler(req, res, data);
  }catch(err){
    console.error(err);
    res.status(500).send("Somebody used me to brew coffee and now I'm broken.");
  }
}

export async function uiHelper(req, res, options, handler) {
  if(!options) options={};
  let data={};

  let cookies = new Cookies(req, res);
  const t = cookies.get("cl-token");
  if(!t) {return {redirect: {permanent: false, destination: "/"}}};
  data.cookies = {cookies, t};

  if(options.queryString) {
    data.queryString = {};
    const q = req.query;
    for(const query of options.queryString) {
      if(!q[query]) {res.status(400).send("I'm a teapot, not a coffee machine: 'no value for "+query+"'"); return;};
      data.queryString[query] = q[query];
    }
  }
  return {props: {sd: await handler(req, res, data)}};
}

