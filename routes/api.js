var express = require('express');
var router = express.Router();


/* Post api home page. */
router.post('/', function(req, res, next) {
    var urlToCheck = req.body.url;
    var url = checkUrl(urlToCheck)
    if (!url) {
        returnError(res,"Not a valid url, it should be in the format http://example.com/example")}
    else {
        checkGoogle(req, url, function(g){
            var p = checkPhistank(req, url);
            var o = checkOpenphish(req, url);

            if ( g || p || o) {
                var match = { google: g, phishtank: p, openphish: o}
                res.json({url: url, match: match});
            } else {
                res.json({url: url });
            }
        });

    }
});

function returnError(res, error){
    res.json({error: error});
}

function checkUrl(url)
{   url = url.trim()
    var r = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
    if (!(url.toLowerCase().indexOf("http") === 0)) {
        url = "http://" + url;
    }
    if (!(r.test(url))){
        return false
    } else {
        return url
    }
}

function searchInArray(req, s_array, string){
    var s_array = req.app.get(s_array);
    if(s_array.indexOf(string)>-1){
       return true
    } else { return false}
}

function checkPhistank(req, url){
    return searchInArray(req, "ptArray", url)
}

function checkOpenphish(req, url){
        return searchInArray(req, "opArray", url)
}

function checkGoogle(req, url, callback){

    var googleKey = req.app.get("googleKey");

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
    //console.log("Making request to " + googleAPI)
    request({
        url: googleAPI,
        method: "POST",
        json: requestData
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            if(body.hasOwnProperty('matches')) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            // Error handle required
            callback(false);
        }
    })
}

module.exports = router;
