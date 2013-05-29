    
$('<div class="fb-button fb-nologin hide"></div><div class="fb-friends"></div>').appendTo( $(document.body) );

var $fbButton = $('.fb-button')
,   $fbFriends = $('.fb-friends')
,   loginStatus = false
,   me = {}
,   friends = {}

function debug(){
    console.debug.apply(console, arguments);
}
function sendRequest(method, callback, data){

    var sender = {
        method : method
    };
    if(data){
        sender = $.extend(sender, data);
    }

    chrome.extension.sendRequest(sender, callback);

}
function addUser(user){
    ((user.id===user.id) ? $fbButton : $fbFriends).append('<div id="ff-'+user.id+'" class="user" title="'+user.name+'"><img src="http://graph.facebook.com/'+user.id+'/picture?type=square" width="50" height="50"></div>');
}


function loginButtonHandler(){

    if(loginStatus){

        if(confirm('로그아웃 하실래용?')){
            sendRequest("logout", function(response){
                location.reload();
            });
        }
    }
    else {
        sendRequest("login", function(response){



            location.reload();

        });
    }

};

function checkNewsViewPage(){

    //뉴스,스포츠,연예,라이프 
    if((/[0-9]{17}/).test(location.href) && 
        $('#newsBody').length===1  || $("#news_content").length===1 ||
        $(".news_contents").length===1 || $("#newsView").length===1 ){

        debug("newsview page!!");
        setTimeout(saveNewsView, 1000 * 3);
    }

}
function saveNewsView(){
    var newsid = location.href.replace(/.+([0-9]{17}).*/g,"$1");

    sendRequest("saveNewsView", function(response){
        debug("saveNewsView", response);
    },{newsid:newsid});   
}

//로그인 여부 체크 
sendRequest("loginCheck", function(response){

    loginStatus = response.status;
    me = response.me;
    friends = response.friends;

    if(loginStatus){

        // debug("me:",me);

        addUser(me);
        $fbButton.removeClass('fb-nologin');

        $fbButton.find(".user").click(loginButtonHandler);
    }
    else {
        $fbButton.click(loginButtonHandler);
    }

    $fbButton.show();
    

    checkNewsViewPage();
});







