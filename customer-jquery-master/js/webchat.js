//发送消息内容
$(".send_btn").on('click', function() {
    sendMessage();

});

//获取当前的时间
function time() {
    return new Date().toLocaleTimeString({
        hour12: false
    });
}



var orignalSetItem = localStorage.setItem;
localStorage.setItem = function(key, newValue) {
    var setItemEvent = new Event("setItemEvent");
    setItemEvent.key = key;
    setItemEvent.newValue = newValue;
    setItemEvent.oldValue = localStorage.getItem(key);
    window.dispatchEvent(setItemEvent);
    orignalSetItem.apply(this, arguments);
}
window.addEventListener("setItemEvent", function(e) {
    console.log('key: ' + e.key);
    console.log('newValue: ' + e.newValue);
    console.log('oldValue: ' + e.oldValue);
});
localStorage.setItem("nm", "1234");

var app_72b76c84_9c47_49d6_9caa_634ad54dd95b = {
        init: function() {

        },
        clientid: '',
        targetClientId: '',
        msg: '',
        //1:clientid,2:targetClientId
        flag: 0,
        saveUserChatHistory: function(clientid, targetClientId, msg, flag) {
            var chatkey = "chat_" + clientid;
            var chatHistoryListStr = sessionStorage.getItem(chatkey);
            var chatHistoryList = [];
            if (chatHistoryListStr != null && chatHistoryListStr != undefined) {
                chatHistoryList = JSON.parse(chatHistoryListStr)
            } else {
                chatHistoryList = [];
            }

            var singleMsg = new this.ChatHistory(clientid, null, msg, flag);
            chatHistoryList.push(singleMsg);
            sessionStorage.setItem(chatkey, JSON.stringify(chatHistoryList));

        },
        getUserChatHistory: function(clientid, targetClientId) {
            var chatkey = "chat_" + clientid;
            var chatHistoryListStr = sessionStorage.getItem(chatkey);
            var chatHistoryList;
            if (chatHistoryListStr != null && chatHistoryListStr != undefined) {
                chatHistoryList = JSON.parse(chatHistoryListStr)
            } else {
                chatHistoryList = [];
            }

            return chatHistoryList;
        },
        removeUserChatHistory: function(clientid, targetClientId) {
            var chatkey = "chat_" + clientid;
            sessionStorage.removeItem(chatkey);
        },
        ChatHistory: function(clientid, targetClientId, msg, flag) {
            this.clientid = clientid;
            this.targetClientId = targetClientId;
            this.msg = msg;
            this.flag = flag;
        }
    }
    // 初始化用户聊天
function initChatHistory() {
    var clientid = localStorage.getItem("cd85c4bc-1986-4a9c-8524-6ee1174436e1");
    // var targetClientId = localStorage.getItem("e48065da-987e-4e51-9d7c-a8f46beabefa");
    var chatHistoryList = app_72b76c84_9c47_49d6_9caa_634ad54dd95b.getUserChatHistory(clientid, null);
    for (let index = 0; index < chatHistoryList.length; index++) {
        var singleMsg = chatHistoryList[index];
        // alert("singleMsg.flag = " + singleMsg.flag + ";" + "singleMsg.msg= " + singleMsg.msg)
        if (singleMsg.flag == 1) {
            var divmsg = rightMsgtext(null, null, singleMsg.msg);
            output(singleMsg.msg, divmsg);
        } else {
            var divmsg = leftMsgtext(null, null, singleMsg.msg);
            output(singleMsg.msg, divmsg);
        }


    }
}

//生成xx位，16进制的UUID
function getUuid(len, radix) {           
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');           
    var uuid = [],
        i;           
    radix = radix || chars.length;           
    if (len) {            
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];           
    } else {            
        var r;            
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';            
        uuid[14] = '4';            
        for (i = 0; i < 36; i++) {             
            if (!uuid[i]) {              
                r = 0 | Math.random() * 16;              
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];             
            }            
        }           
    }           
    return uuid.join('');         
};

$(function() {
    initChatHistory();
})
var clientid = localStorage.getItem("cd85c4bc-1986-4a9c-8524-6ee1174436e1");
var targetClientId = 'testclient1';

if (clientid == null || clientid == undefined) {
    var clientid = getUuid(36, 16);
    localStorage.setItem("cd85c4bc-1986-4a9c-8524-6ee1174436e1", clientid);
}

var socket = io.connect('http://localhost:8081?clientid=' + clientid);

socket.on('connect', function() {
    output('<span class="connect-msg">欢迎使用最新的netty-socketIO设备!</span>');
});

socket.on('messageevent', function(data) {
    var divmsg = '';
    if (data.sourceClientId == clientid) {
        divmsg = rightMsgtext(null, null, data.msgContent);
    } else {
        divmsg = leftMsgtext(null, null, data.msgContent);
    }
    output(data.msgContent, divmsg);

    localStorage.setItem("e48065da-987e-4e51-9d7c-a8f46beabefa", data.sourceClientId);
    if (data.sourceClientId == clientid) {
        app_72b76c84_9c47_49d6_9caa_634ad54dd95b.saveUserChatHistory(clientid, null, data.msgContent, 1);
    } else {
        app_72b76c84_9c47_49d6_9caa_634ad54dd95b.saveUserChatHistory(clientid, null, data.msgContent, 2);
    }
});
socket.on('disconnect', function() {
    alert("已下线");
    localStorage.removeItem("cd85c4bc-1986-4a9c-8524-6ee1174436e1");
    app_72b76c84_9c47_49d6_9caa_634ad54dd95b.removeUserChatHistory(clientid, null);
});

function sendDisconnect() {
    socket.disconnect();
}


function output(msg, divmsg) {
    if (msg.length != 0) {
        $("#inputAreaValue").empty();
        $(".dialog_wrap_box").append(divmsg);
        scrollBarBottom();
    }
}

function rightMsgtext(username, headimg, msg) {
    var divmsg = '<div class="dialog_right">' +
        '<div class="dialog_right_box">' +
        '<p class="dialog-time"><span>我 </span>' + time() + '</p>' +
        '<div class="dialog-top">' +
        '<div class="dialog_right_card skinColor">' +
        '<div class="textMess">' + msg + '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
    return divmsg;
}

function leftMsgtext(username, headimg, msg) {
    var divmsg = '<div class="dialog_left">' +
        '<img class="dialog_user_profile" src="./images/kefu.png" />' +
        '<div class="dialog_left_box">' +
        '<p class="dialog-time"><span>wjw</span>' + time() + '</p>' +
        '<div class="dialog-top">' +
        '<div class="dialog_left_card">' +
        '<div class="textMess">' + msg + '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'

    return divmsg;
}

function sendMessage() {
    var message = $("#inputAreaValue").html();
    var jsonObject = {
        "sourceClientId": clientid,
        "targetClientId": targetClientId,
        "msgType": 'chat',
        "msgContent": message
    };
    socket.emit('messageevent', jsonObject);

}