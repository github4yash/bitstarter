#!/usr/local/bin/node

var request = require('request');

if(!process.argv[2]) {
    console.log('usage : node track.js url');
    process.exit(1);
}
var social = [  
    ['YCombinator'  , 'http://api.thriftdb.com/api.hnsearch.com/items/_search?q='           , /points": (\d*),/],
    ['Facebook'     , 'http://api.facebook.com/restserver.php?method=links.getStats&urls='  , /<share_count>(\d*)<\/share_count>/],
    ['Google+'      , 'https://plusone.google.com/u/0/_/+1/fastbutton?url='                 , /window.__SSR = {c: (\d*).0 ,/],
    ['Twitter'      , 'http://urls.api.twitter.com/1/urls/count.json?url='                  , /count":(\d*),/],
    ['LinkedIn'     , 'http://www.linkedin.com/countserv/count/share?url='                  , /count":(\d*),/],
    ['Dzone'        , 'http://widgets.dzone.com/links/widgets/zoneit.html?t=1&url='         , />(\d*)<\/a>/],
    ['Digg'         , 'http://widgets.digg.com/buttons/count?url='                          , /diggs": (\d*)/],
    ['Delicious'    , 'http://feeds.delicious.com/v2/json/urlinfo/data?url='                , /total_posts": (\d*)/],
    ['Pintrest'     , 'http://api.pinterest.com/v1/urls/count.json?url='                    , /count": (\d*)/] 
];
social.forEach(function(val) {
    var url = val[1]+process.argv[2];
    var headers = {'user-agent': 'node.js'};
    request({url:url, headers:headers}, function(error, response, body) {
       var reg= new RegExp(val[2]);
       var match=reg.exec(body);
       if(match && match[1]!=='') {
           console.log(val[0]+': '+match[1]);
       }
       else {
           console.log(val[0]+': 0');
       }
    });
});
