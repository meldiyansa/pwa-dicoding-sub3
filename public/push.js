const webPush = require("web-push");

const vapidKeys = {
    publicKey : "BPoq-KVIKwTLh3Jfjr_bv2pXOXtoo3ZIBp5UqjUpec-x8znLxFhkyoBVzmiJd3kBAFBaUMITmU8bAru2RWfoRQA",
    privateKey : "K50qIck80ZKpCSiARHO6vOxTNUAfBCixdi9rxFmrH0A"
}
const subscription = {
    endpoint : "https://fcm.googleapis.com/fcm/send/f-eENK3RW20:APA91bFm5E-qE75muF6eITC7b0ZIXqQcXZzW0fpLN1YvuinqbcoDrDsVaWdU2rzzNosZGPdkBhAKW28PP6VHY0b-hGTyLjPJ8eJ8Xvym2RzpDVZ7eU4LT1F6qKngf25Xa99LO_FYzAPz",
    keys : {
        p256dh : "BMEldfKp8B4Ty1jg5gg+3YXnJQ30D5xWHuIp8p71dMxz4FzHKDHepVGIagknZqqmP2+wIqC9Zrgaq1LCPu/K628=",
        auth : "916jzeYD9ytyJSNmkpSG7w=="
    }
}
const options = {
    gcmAPIKey : "22954275770",
    TTL : 60
}
webPush.setVapidDetails(
    'mailto:meldiyansa@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
    )

let payloads = "Selamat datang, Salam Kenal"

webPush.sendNotification(
    subscription,
    payloads,
    options
)