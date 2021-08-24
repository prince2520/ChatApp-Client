import io from 'socket.io-client';

let socket;

const serverUrl = 'https://chatapp-cli.herokuapp.com';

export const initiateSocket = (userName) => {
    socket = io(serverUrl, {transports: ['websocket', 'polling', 'flashsocket']});
    socket.emit('user_connected', userName);
}

export const joinGroupHandler = (groupId) => {
    if(socket && groupId){
        console.log('socket')
        socket.emit('join', {groupId});
    }
}

export const sendGroupMessage = (groupId,message,userName) => {
    if(socket){
        socket.emit('sendGroupMsg',{groupId,message,userName})
    }
};

export const sendPrivateMessage = (sender,receiver,sendMessage) => {
    if(socket){
        console.log(sendMessage)

        socket.emit('send_message', {
            sender: sender,
            receiver: receiver,
            message: sendMessage
        });
    }
};

export const getPrivateMessage = (cb) => {
    if(!socket){
        return true
    }else{
        socket.on('new_message', ({userName, message})=>{
            console.log(message)
            return cb(null,{userName, message})
        })
    }
}

export const getGroupMessage = (cb) => {
    if(!socket){
        return true
    }else{
        socket.on('groupMsg',({userName, message,groupId})=>{
            console.log('Socket Io ',groupId)
            return cb(null,{userName, message,groupId})
        })
    }
}

export const disconnectSocket = () => {
    if(socket){
        socket.disconnect()
    }
}

