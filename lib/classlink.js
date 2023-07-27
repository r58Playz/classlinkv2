import Cookies from 'cookies';


export async function postNoBodyWithBearer(url, token) {
  return await fetch(url, {method:"POST",headers:{"Authorization":"Bearer "+token}});
}

export async function postNoBodyWithGws(url, token) {
  return await fetch(url, {method:"POST",headers:{"Authorization":"gws "+token}});
}

export default async function fetchWithBearer(url, token) {
  return await fetch(url, {headers:{"Authorization":"Bearer "+token}});
}

export async function fetchWithGws(url, token) {
  return await fetch(url, {headers:{"Authorization":"gws "+token}});
}

export async function apiRouteHelper(req, res, options, handler) {
  if(!options) options={};
  let data = {};
  if(options.cookies) {
    let cookies = new Cookies(req, res);
    const t = cookies.get("cl-token");
    const g = cookies.get("cl-gws");
    const c = cookies.get("cl-code");
    if(options.cookies === ":3" && !t && !c && !g) { res.status(401).send("No coffee allowed, tea bags only: 'no bearer cookies or classlink code or gws cookies'"); return;};
    data.cookies = { cookies, t, c, g }
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
    res.status(500).send("Somebody used me to brew coffee and now I'm broken: '"+err+"'");
  }
}

export async function uiHelper(req, res, options, handler) {
  if(!options) options={};
  let data={};

  let cookies = new Cookies(req, res);
  const t = cookies.get("cl-token");
  const g = cookies.get("cl-gws");
  const c = cookies.get("cl-code");
  if(!(t || g || c)) {return {redirect: {permanent: false, destination: "/"}}};
  data.cookies = {cookies, t, g, c};

  if(options.queryString) {
    data.queryString = {};
    const q = req.query;
    for(const query of options.queryString) {
      if(!q[query]) {res.status(400).send("I'm a teapot, not a coffee machine: 'no value for "+query+"'"); return;};
      data.queryString[query] = q[query];
    }
  }

  const userData = await fetchWithBearer("https://nodeapi.classlink.com/v2/my/info", t).then(r=>r.json());
  if(data.userData === {"message":"Invalid or expired access token","status":0}) {
    return {redirect: {permanent: false, destination: "/"}};
  }
  data.userData = userData;
  
  const handlerData = await handler(req, res, data)
  return handlerData.redirect ? handlerData : {props: {sd: handlerData}}; 
}

// most of this taken from the chrome extension
export function app2url(app) {
  const potentialUrl2Url = nya=>new RegExp(/^(http|https):\/\//).test(nya) ? nya : `http://${nya}`
  const urlList = app.url ? app.url : [];
  const l = "https://launchpad.classlink.com";
  const id = app.id;
  const eId = encodeURIComponent(id);
  const url = potentialUrl2Url(urlList[0]);

  switch(app.type) {
    case 1:
    case 25:
    case 26:
    case 30:
    case 31:
    case 32:
    case 37:
      return url; 
    case 7:
    case 8:
      // window.CloudApp.MyApps.Controller.openRDPClient 
      return null;
    case 9:
      return `${l}/clsso/${eId}`;
    case 14:
      return url; 
    case 15:
      return `${l}/browsersso/${eId}`;
    case 16:
    case 36:
      return `${l}/ltisso/${id}`;
    case 17:
      return `${l}/focussso/${id}`;
    case 18:
      return `${l}/pearson/mathxl/${id}`;
    case 19:
      return `${l}/pearson/mymathlab/${id}`;
    case 20:
      return `${l}/custom/certification/${id}`;
    case 21:
      return `${l}/oneroster/${id}`;
    case 22:
      return `${l}/phonebook/${id}`;
    case 23:
      return `${l}/onerosterlti/${id}`;
    case 24:
      return `${l}/assignapplication/${id}`;
    case 3:
    case 27:
      // window.CloudApp.MyApps.Controller.launchLocalApp
      return null;
    case 28:
      return `${l}/custom/genericoneroster/ltilaunch/${id}`;
    case 29:
    case 33:
      return `${l}/custom/pearsonapapp/${id}`;
    case 34:
      return `${l}/custom/naviancestudentsso/${id}`;
    case 35:
      return `${l}/oneroster/manage/class/${id}`;
    default:
      return null;
  }
}
