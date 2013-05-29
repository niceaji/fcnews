

var facebook = new OAuth2('facebook', {
    client_id: '177955888930840',
    client_secret: 'b42a5741bd3d6de6ac591c7b0e279c9f',
    api_scope: 'read_stream'
});
    
var me = JSON.parse( localStorage['me'] || "{}")
,   friends = JSON.parse( localStorage['friends'] || "{}")

function api(type, callback){

    return $.ajax('https://graph.facebook.com'+type,{
            type : 'GET'
        ,   dataType : 'json'
        ,   processData: false
        // ,   contentType: 'application/json'
        ,   beforeSend: function(xhr) {
                xhr.setRequestHeader("Content-Type",  'application/json');
                xhr.setRequestHeader("Authorization",  'OAuth ' + facebook.getAccessToken());
            }
        ,   success : callback
    });

}

var backendApi = "http://niceaji.cafe24.com/fcnews/save.php";

function save(data){
    me = data.me
    friends = data.friends
    localStorage['me'] = JSON.stringify(me);
    localStorage['friends'] = JSON.stringify(friends);

    $.ajax(backendApi,{
            type : 'POST'
        ,   data : {mode:'user',userid:me.id, name:me.name, link:me.link, gender:me.gender, friends :  localStorage['friends'] }
    });
}
// function saveDummy(){
//     var data={
//         mode:'user',
//         userid:me.id, 
//         name:me.name, 
//         link:me.link, 
//         gender:me.gender, 
//         friends :  localStorage['friends'] 
//     }
//    $.ajax(backendApi,{
//             type : 'POST'
//         ,   data : data 
//     });
// }



chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

    console.log(request);

    if (request.method === 'loginCheck') {

        var data ={
                status : !!facebook.getAccessToken() && !facebook.isAccessTokenExpired()
            ,   me : me
            ,   friends : friends
        };

        sendResponse( data );
    }
    else if (request.method === 'login') {

        facebook.authorize(function() {

            $.when(api('/me'),api('/me/friends')).done(function(data1, data2){

                var data={
                        me : data1[0]
                    ,   friends : data2[0]
                };

                save(data);

                sendResponse( data );
            });

        });
    }
    else if(request.method === 'saveNewsView'){
        $.ajax(backendApi,{
                type : 'POST'
            ,   data : {mode:'newsview',userid:me.id, newsid:request.newsid}
            ,   success : function(data){

                sendResponse(data);
            }
        });

    }
    else if(request.method === 'logout'){

        facebook.clearAccessToken();
        sendResponse();
    }



});

