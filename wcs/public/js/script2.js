// Initialize Firebase
var config = {
    apiKey: "AIzaSyBCbK0GsBzKCOJh7uKcFiFubj0tOUgnZP8",
    authDomain: "handson-chat.firebaseapp.com",
    databaseURL: "https://handson-chat.firebaseio.com",
    projectId: "handson-chat",
    storageBucket: "handson-chat.appspot.com",
    messagingSenderId: "310298419647"
};
firebase.initializeApp(config);

// Msg送信準備
const newPostRef = firebase.database();
let room = "room1";

const username = document.getElementById("username");
const output = document.getElementById("output");

// Msg送信処理
// send.addEventListener('click', function(){
//     newPostRef.ref(room).push({
//         username: username.value,
//         text: text.value,
//         time: time()
//     });
//     text.value = "";
// });

// Msg受信処理
function text(){
    newPostRef.ref(room).on("child_added",function(data){
        const v = data.val();
        const k = data.key;
        let str = "";

        str += '<div id="'+ k + '" class="msg_main">';
        str += '<div class="msg_left">';
        str += '<div class=""><img src="img/icon_person.png" alt="" class="icon ' + v.username + '" width="30"></div>';
        str += '<div class="msg">';
        str += '<div class="name">' + v.username + '</div>';
        str += '<div class="text">' + v.text + '</div>';
        str += '</div>';
        str += '</div>';
        str += '<div class="msg_right">';
            str += '<div class="time">' + v.time + '</div>';
        str += '</div>';
        str += '</div>';

        output.innerHTML += str;
        $("#output").scrollTop($("#output")[0].scrollHeight);
    });
}

// 時間を取得する関数
function time() {
    let date = new Date();
    let hh = ("0" + date.getHours()).slice(-2);
    let mm = ("0" + date.getMinutes()).slice(-2);
    let ss = ("0" + date.getSeconds()).slice(-2);

    let time = hh + ":" + mm + ":" + ss;
    return time;
}

// 音声認識の準備
const speech = new webkitSpeechRecognition();
speech.lang = 'ja-JP';

const join = document.getElementById('join');
const content = document.getElementById('content');

join.addEventListener('click', function(){
    room = document.getElementById('join-room').value;
    speech.start();
    text();
});

const endcall = document.getElementById('end-call');
endcall.addEventListener('click', function(){
    location.reload();
});

speech.onresult = function(e){
    speech.stop();
    if(e.results[0].isFinal){
        const autotext = e.results[0][0].transcript;
        newPostRef.ref(room).push({
            username: username.value,
            text: autotext,
            time: time()
        })
    }
};

speech.onend = () => {
        speech.start();
};