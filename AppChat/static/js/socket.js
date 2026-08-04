import { socket, currentReceiver, currentUser, setSocket, setCurrentReceiver } from './state.js';
import { addMessage, addAudioMessage } from './chatUI.js';
import { addChatToSidebar, updateSidebar } from './sidebar.js';

/* =========================
   💬 SOCKET DE CHAT
========================= */
async function loadMessages(user, other_user) {

    const response = await fetch(
        `/messages/${user}/${other_user}/`
    );

    const messages = await response.json();

    messages.forEach(msg => {

        const type = msg.sender === user 
            ? "received" 
            : "sent";

        addMessage(
            msg.message,
            type
        );

    });
}

export function openChat(receiver) {
    const sender = currentUser;

    document.getElementById("chat-username-open").textContent = receiver;
    setCurrentReceiver(receiver);
    document.querySelector(".conversation-wrapper").innerHTML = "";

    if (socket) {
        socket.close();
    }

    loadMessages(sender, receiver);

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

/* =========================
   📤 ENVIAR MENSAJES
========================= */

export function sendMessage(data) {

    if (!socket) {
        console.log("❌ No hay socket");
        return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
        console.log("❌ Socket no está abierto:", socket.readyState);
        return;
    }

    socket.send(JSON.stringify(data));
}


/* =========================
   🔔 SOCKET DE NOTIFICACIONES
========================= */

let notifications = null;

export function initNotifications() {
    console.log("🔥 INIT NOTIFICATIONS");
    notifications = new WebSocket(
        `ws://127.0.0.1:8000/ws/notifications/${currentUser}/`
    );

    notifications.onopen = () => {
        console.log("🔔 Notifications conectado");
    };

    notifications.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log("🔔 Notificación recibida:", data);

        handleNotification(data);
    };

    notifications.onclose = (e) => {
        console.log("❌ Notifications cerrado:", e.code);
    };
}

/* =========================
   🧠 MANEJO DE NOTIFICACIONES
========================= */

function handleNotification(data) {

    //  esperado:
    // { type: "chat_message", from: "Tomas", message: "hola" }
    if (!data.from) return;

    // si ya estás en ese chat → ignorar
    if (data.from === currentReceiver) return;

    console.log("📌 Nuevo mensaje de:", data.from);

    // si no existe → crear
    const existing = document.querySelector(`[data-user="${data.from}"]`);

    if (!existing) {
        addChatToSidebar(data.from, data.message);
    } else {
        updateSidebar(data.from, data.message);
    }
}