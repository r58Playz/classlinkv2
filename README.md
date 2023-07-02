# classlink-frontend

"LMFAO THE CODE DOESNT EXPIRE SO YOU CAN GET A TOKEN AS MANY TIMES AS YOU WANT" -r58 (i was wrong it expires in 5 minutes)

gist of how to launch an app:
 - `https://applications.apis.classlink.com/v1/startSession` no idea if this is needed
 - `https://applications.apis.classlink.com/exchangeCode?code=<some long code>&response_type=code` gives you a bearer token
   - `JSON.parse(res).token`
 - `https://applications.apis.classlink.com/v1/applicationsPageLoad` gives you the apps you are allowed to use, use bearer token as auth
 - supposedly to launch an app you just... open the `url` attribute in a new tab. it's magic.


type reference:
 - 30: apps with some sort of classlink-sso api endpoint, open `url[0]`
 - 31: apps that use `idp.classlink.com`, open `url[0]`
 - 16: `https://launchpad.classlink.com/ltisso/<id>`
 - 15: `https://launchpad.classlink.com/browsersso/<id>`
