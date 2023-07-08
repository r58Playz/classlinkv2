# Troll Classlink
# The launch app frequency. This will also run the internal poll rate clock to refresh tokens and send app timer data.
launchAppFrequency = 2.0
# The app ID to launch.
launchAppId = 2017938
verbose = True



import time
import requests
import sys
from datetime import datetime as datetime

if not len(sys.argv) == 3:
    print("usage: python3 trollAPI.py bearerToken gwsToken")
    sys.exit(1)

bearerToken=sys.argv[1]
gwsToken=sys.argv[2]

if launchAppFrequency != 1.0 and launchAppFrequency % 2.0 != 0:
    print("error: launchAppFrequency is not even or 1.0")
    sys.exit(1)
if launchAppFrequency < 1.0:
    print("error: launchAppFrequency is less than 1.0")
    sys.exit(1)

starttime = time.time()
currentLaunchToken = ""
dayCount = -1
firstLoopIteration = True

def requestsWrapper(method, url, queryString, headers):
    return requests.request(method, url, params=queryString, headers=headers)

def postWithBearer(url, queryString, token):
    return requestsWrapper("POST", url, queryString, {"Authorization":"Bearer "+token,"Content-Type":"application/json"});

def postWithGws(url, queryString, token):
    return requestsWrapper("POST", url, queryString, {"Authorization":"gws "+token,"Content-Type":"application/json"});

def getWithBearer(url, queryString, token):
    return requestsWrapper("GET", url, queryString, {"Authorization":"Bearer "+token});



def startSession():
    postWithBearer("https://applications.apis.classlink.com/v1/startSession", None, bearerToken)

def resetTimeout():
    postWithBearer("https://applications.apis.classlink.com/v1/resetSessionTimeout", None, bearerToken)

def endSession():
    postWithBearer("https://applications.apis.classlink.com/v1/endSession", None, bearerToken)

def sendAppLaunch():
    postWithGws("https://analytics-log.classlink.io/launch/v1p0/appLaunch", {"applicationId":launchAppId}, gwsToken)
    jsonOutput = postWithGws("https://analytics-log.classlink.io/launch/v1p0/launch", {"applicationId":launchAppId}, gwsToken).json()
    return jsonOutput['launchToken']

def sendAppActivity():
    postWithGws("https://analytics-log.classlink.io/activity/v1p0/activity", {"launchToken":currentLaunchToken,"activeS":300}, gwsToken);

def sendCloseApp():
    postWithGws("https://analytics-log.classlink.io/activity/v1p0/close", {"launchToken":currentLaunchToken,"activeS":300}, gwsToken);

def printStats():
    dateToday = datetime.today().strftime("%Y-%m-%d")
    topApps = getWithBearer("https://analytics-data.classlink.io/my/v1p0/apps/top",{"order":"Count","sort":"DESC","limit":3},bearerToken).json()
    recordLogins = getWithBearer("https://analytics-data.classlink.io/my/v1p0/logins/records",None,bearerToken).json()
    todayLogins = getWithBearer("https://analytics-data.classlink.io/my/v1p0/logins/daily",{"startDate":dateToday,"endDate":dateToday},bearerToken).json()
    print("Top apps:")
    for app in topApps:
        print(f"{app['AppName']} ({app['AppId']}): {app['Count']}, {app['activeS']} seconds active")
    print(f"Today's login count: {todayLogins[0]['Logins']}")
    print("Record logins:")
    print(f"Daily: {recordLogins['daily']['Logins']} on {recordLogins['daily']['Date']}")
    print(f"Weekly: {recordLogins['weeks']['Logins']} on {recordLogins['weeks']['startDate']} - {recordLogins['weeks']['endDate']}")
    print(f"Monthly: {recordLogins['month']['Logins']} on {recordLogins['month']['Date']}")
    print(f"Yearly: {recordLogins['yearly']['Logins']} on {recordLogins['yearly']['startDate']} - {recordLogins['yearly']['endDate']}")

while True:
    deltaFromStart = time.time() - starttime
    timeMod23H = deltaFromStart % (60.0 * 60.0 * 3.75) 
    timeMod24H = deltaFromStart % (60.0 * 60.0 * 4) 
    timeMod300S = deltaFromStart % 300.0
    startSession()
    if timeMod23H < 1:
        if not firstLoopIteration: 
            if verbose: print("Sending close app")
            sendCloseApp()
        resetTimeout()
        if verbose: print("Reset timeout of token")
        currentLaunchToken = sendAppLaunch()
        if verbose: print("Current launch token:", currentLaunchToken)
    if timeMod24H < 1:
        dayCount += 1
        print(f"{dayCount} days since this script was started")
        printStats()
    if timeMod300S < 1:
        sendAppActivity()
        if verbose: print("Sent app activity")
    if verbose: print("Sending app launch")
    sendAppLaunch()
    endSession()
    if(firstLoopIteration): firstLoopIteration = False
    time.sleep(launchAppFrequency - ((time.time() - starttime) % launchAppFrequency))


