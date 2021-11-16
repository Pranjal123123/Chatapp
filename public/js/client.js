const socket = io();
var username;

//calling classes and ids through jquery
var chats =document.querySelector(".chats");
var user_msg=document.querySelector("#user-msg");
var msg_send=document.querySelector("#user-send");
do{
    username=prompt("Enter Your name");
}while(!username);

//it will be called when user will join
socket.emit("new-user-joined",username);
//client receives user-connected notification that was called in server side
socket.on('user-connected',(socket_name) =>{
    userJoinLeft(socket_name,'joined');
});

// function to create joined/left status
function userJoinLeft(name,status){
let div=document.createElement("div");
div.classList.add('user-join');
let content=`<p><b>${name}</b> ${status} the chat</p>`;
div.innerHTML=content;
chats.appendChild(div);
}

//client receives user-disconnected notification that was called in server side
socket.on('user-disconnected',(user) =>{
    userJoinLeft(user,'left');
});

// for sending message
msg_send.addEventListener('click',()=>{
    let data={
        user:username,
        msg:user_msg.value
    }
    if(user_msg.value!='')
    {
        //call a function,with keyword
        appendMessage(data,'outgoing');
        //emit means we r informing server that some messages are coming
        socket.emit('message',data);
        //after sending message blank the messag again
        user_msg.value='';
    }
});
function appendMessage(data,status)
{
    let div=document.createElement("div");
    div.classList.add('message',status);
    let content=`
    <h5>${data.user}</h5>
    <p>${data.msg}</p>
    `;
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop=chats.scrollHeight;
}

socket.on('message',(data)=>{
    appendMessage(data,'incoming');
})