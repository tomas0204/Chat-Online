import { socket, currentReceiver, currentUser, setSocket, setCurrentReceiver } from './state.js';
import { addMessage, addAudioMessage } from './chatUI.js';

export function openChat(receiver) {
    const sender = currentUser;

    setCurrentReceiver(receiver);
    document.getElementById("chat-username-open").textContent = receiver;

    // 🚫 si ya estás en este chat, no abras otro socket
    if (socket && currentReceiver === receiver && socket.readyState === WebSocket.OPEN) {
        console.log("⚠️ Ya existe conexión para este chat");
        return;
    }

    setCurrentReceiver(receiver);

    if (socket) {
        socket.close();
    }

    // abrir nuevo
    let newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${sender}/${receiver}/`);
    setSocket(newSocket);

    newSocket.onopen = () => console.log("✅ conectado");

    newSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(currentUser)
        const isMe = data.sender === currentUser;
        if (data.msg_type === "text") {
            addMessage(data.message, isMe ? "received" : "sent");
        }

        if (data.msg_type === "audio") {
            addAudioMessage(data.audio_url, isMe ? "received" : "sent");
        }
    };
}

export function sendMessage(data) {
    if (!socket) {
        console.log("❌ No hay socket");
        return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
        console.log("❌ Socket cerrado:", socket.readyState);
        return;
    }

    socket.send(JSON.stringify(data));
}