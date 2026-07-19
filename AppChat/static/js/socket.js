import { socket, currentReceiver, currentUser, setSocket, setCurrentReceiver } from './state.js';
import { addMessage, addAudioMessage } from './chatUI.js';

export function openChat(receiver) {
    const sender = currentUser;

    setCurrentReceiver(receiver);
    document.getElementById("chat-username-open").textContent = receiver;

    // cerrar anterior
    if (socket) {
        socket.close();
    }

    // abrir nuevo
    let newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${sender}/${receiver}/`);
    setSocket(newSocket);

    newSocket.onopen = () => console.log("✅ conectado");

    newSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        const isMe = data.sender === currentUser;
        console.log("📩 Mensaje recibido:", data);
        if (data.msg_type === "text") {
            addMessage(data.message, isMe ? "received" : "sent");
        }

        if (data.msg_type === "audio") {
            addAudioMessage(data.audio_url, isMe ? "received" : "sent");
        }
    };
}