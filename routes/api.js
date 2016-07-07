var express = require('express');
var router = express.Router();


/* Post api home page. */
router.post('/', function(req, res, next) {
    var urlToCheck = req.body.url;
    var phishingArray = req.app.get("phishingArray");
    if(phishingArray.indexOf(urlToCheck)>-1){
        renderPage(true, "Phishing", null);
    }
    function responseAPI(foundThreat, threatName, error) {
        console.log("Trying to render " + foundThreat + " " + threatName + " " + error)
        if (!(error)){
            if (foundThreat){
                res.json({url: urlToCheck, match: threatName});
            } else {
                res.json({url: urlToCheck });
            }
        } else {
            res.json( { error: error });
        }
    }
    function googleResponse(foundThreat, threatName, error){
        console.log("test");
    }
    var googleKey = req.app.get("googleKey");
    check_google(urlToCheck, googleKey, responseAPI);


});

function check_google(url,googleKey, func_callback){
    var r = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
    if (!(url.toLowerCase().startsWith("http"))) {
        url = "http://" + url;
    }
    if (!(r.test(url))){
        var error = "Not a valid url, it should be in the format http://example.com/example"
        return func_callback(null, null, error)
    }
    var request = require("request")
    var googleAPI = "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=" + googleKey
    var requestData = {
        "client": {
          "clientId":      "eladelad",
          "clientVersion": "0.0.1"
        },
        "threatInfo": {
          "threatTypes":      ["MALWARE", "SOCIAL_ENGINEERING", "POTENTIALLY_HARMFUL_APPLICATION", "UNWANTED_SOFTWARE"],
          "platformTypes":    ["ANY_PLATFORM"],
          "threatEntryTypes": ["URL"],
          "threatEntries": [
            {"url": url}
          ]
        }
    };
    var request = require("request")
    var foundThreat = false
    var threatName = "None"
    var err = null
    console.log("Making request to " + googleAPI)
    request({
        url: googleAPI,
        method: "POST",
        json: requestData
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            if(body.hasOwnProperty('matches')) {
                console.log(body.matches)
                threatName = body.matches[0].threatType;
                foundThreat = true
                console.log("Trying to callback " + foundThreat + " " + threatName + " " + err)
                return func_callback(foundThreat, threatName, err);
            } else {
                console.log("Trying to callback " + foundThreat + " " + threatName + " " + err)
                return func_callback(foundThreat, threatName, err);
            }
        } else {
            console.log(error);
            return func_callback(foundThreat, threatName, error);
        }
    })
}

module.exports = router;
