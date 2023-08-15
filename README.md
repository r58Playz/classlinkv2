# classlinkv2

"LMFAO THE CODE DOESNT EXPIRE SO YOU CAN GET A TOKEN AS MANY TIMES AS YOU WANT" -r58 (i was wrong it expires in 5 minutes)
"ARE THESE DEVS FUCKING MENTAL WHO THE FUCK USES A FUCKING SPRITESHEET FOR ICONS IN A FUCKING WEB APP" -r58
"what if i spam the analytics launch apis" -r58

### gist of how to launch an app:
 - `https://applications.apis.classlink.com/v1/startSession` no idea if this is needed
 - `https://applications.apis.classlink.com/exchangeCode?code=<some long code>&response_type=code` gives you a bearer token
   - `JSON.parse(res).token`
 - `https://applications.apis.classlink.com/v1/applicationsPageLoad` gives you the apps you are allowed to use, use bearer token as auth
 - supposedly to launch an app you just... open the `url` attribute in a new tab. it's magic.


### type reference:
 - `30`: apps with some sort of classlink-sso api endpoint, open `url[0]`
 - `31`: apps that use `idp.classlink.com`, open `url[0]`
 - `16`: `https://launchpad.classlink.com/ltisso/<id>`
 - `15`: `https://launchpad.classlink.com/browsersso/<id>` - requires classlink sso extension


### Random API endpoints
 - spam your app launch analytics: https://analytics-log.classlink.io/launch/v1p0/appLaunch?applicationId=<id>
 - RESET THE FUCKING SESSION TIMEOUT: https://applications.apis.classlink.com/v1/resetSessionTimeout 


### My Backpack
sourcedId is the id for some reason

 - enabled: `https://nodeapi.classlink.com/tenant/customization/backpack`
 - class list `https://myclasses.apis.classlink.com/v1/classes`
 - icon location for class list `https://filescdn.classlink.com/resources/icons/default/`
 - more info about class `https://myclasses.apis.classlink.com/v1/classes/<id>`
 - school year info ?? `https://analytics-data.classlink.io/teacherConsole/v1p0/schoolyear`


### My Analytics
startDate & endDate can be used for all of these

 - get logins: `https://analytics-data.classlink.io/my/v1p0/logins[?limit=<int>]`
 - get logins data: `https://analytics-data.classlink.io/my/v1p0/logins/{daily,weekly,monthly,yearly,records}`
    - daily, weekly, monthly, yearly: [{Date, Logins}]
    - records: {daily, month, weeks, yearly}
       - daily, month, yearly: {Logins, endDate, startDate}
       - weeks: {Logins, Week, Year, endDate, startDate}
 - get apps logins: `https://analytics-data.classlink.io/my/v1p0/apps[?limit=<int>]`
    - {Browser, Date, IP, Id, OS, Resolution}
 - get apps logins data: `https://analytics-data.classlink.io/my/v1p0/apps/top[?order=Count&sort=DESC&limit=<int>]`
    - {AppId, AppName, Count, HireIconPath, IconPath, activeS} - activeS = active seconds
 - get apps logins data: `https://analytics-data.classlink.io/my/v1p0/apps/top/history` - this 500'd 
 - get apps logins data: `https://analytics-data.classlink.io/my/v1p0/apps/records` - this 500'd

no idea how apptimer works - r58 (a few days ago)

### The downfall of apptimer
They use this shitty ass extension to track the user, every 10 fucking milliseconds
 - Activity: `https://analytics-log.classlink.io/activity/v1p0/activity?launchToken=&activeS=` - appends to the time & requires gws
 - Close: `https://analytics-log.classlink.io/activity/v1p0/close?launchToken=&activeS=` - records a close event, marking launch token as invalid and appends to the time


### App Library
 - `application-autocomplete.apis.classlink.com/v1/paged/appLibrary/<id>?limit=<int>&subject_id=` (max 100)
 - `applications.apis.classlink.com/v1/applibrary/[un]assignApp/[id]` POST if assigning DELETE if unassigning
 - `https://applications.apis.classlink.com/v1/applibrary/getCategories` to get the ID for #1 use a category in `enterpriseCategories`, subject_id = anything in `categorylist`
