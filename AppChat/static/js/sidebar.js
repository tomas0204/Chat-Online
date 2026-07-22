import {openChat} from "./socket.js";
import {recentMessagesContainer, currentReceiver} from "./state.js";

export function addToRecent(username, message) {
    // evitar duplicados
    const existing = recentMessagesContainer.querySelector(`[data-username="${username}"]`);
    
    if (existing) {
        const li = existing.closest("li");

        // 🔥 actualizar mensaje también aquí
        const text = li.querySelector(".content-message-text");
        if (text) text.textContent = message;

        recentMessagesContainer.insertBefore(li, recentMessagesContainer.children[1]);
        return;
    }

    // <li>
    const li = document.createElement("li");

    // <a>
    const a = document.createElement("a");
    a.classList.add("agree-chat");
    a.dataset.conversation = "#conversation-1";
    a.dataset.username = username;
    a.href = "#";

    // <img>
    const img = document.createElement("img");
    img.classList.add("content-message-image");
    img.src = "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg";
    img.alt = "";

    // <span class="content-message-info">
    const info = document.createElement("span");
    info.classList.add("content-message-info");

    // <span class="content-message-name">
    const name = document.createElement("span");
    name.classList.add("content-message-name");
    name.textContent = username;

    // <span class="content-message-text">
    const text = document.createElement("span");
    text.classList.add("content-message-text");
    text.textContent = message;
    console.log("MENSAJE: " + message)

    info.appendChild(name);
    info.appendChild(text);

    // <span class="content-message-more">
    const more = document.createElement("span");
    more.classList.add("content-message-more");
    more.style.display = "flex";
    more.style.flexDirection = "column";
    more.style.alignItems = "flex-end";
    more.style.gap = "4px";

    // unread
    const unread = document.createElement("span");
    unread.classList.add("content-message-unread");
    unread.textContent = "5"; // igual que tu ejemplo

    // time
    const time = document.createElement("span");
    time.classList.add("content-message-time");
    time.textContent = "12:30"; // igual que tu ejemplo

    more.appendChild(unread);
    more.appendChild(time);

    // armar estructura final
    a.appendChild(img);
    a.appendChild(info);
    a.appendChild(more);

    li.appendChild(a);
    openChat(username);
    // insertar debajo del título
    recentMessagesContainer.insertBefore(li, recentMessagesContainer.children[1]);
}

export function handleNewChat(data) {
    const user = data.from;

    // ❓ ya existe en sidebar?
    const exists = document.querySelector(`[data-user="${user}"]`);

    if (!exists) {
        addChatToSidebar(user, data.message);
    } else {
        updateChatPreview(user, data.message);
    }
}

// Notifications

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function addChatToSidebar(user, message) {

    // 🔍 buscar si ya existe
    const existing = recentMessagesContainer.querySelector(
        `[data-username="${user}"]`
    );

    // ✅ SI YA EXISTE → actualizar + mover arriba
    if (existing) {
        const li = existing.closest("li");

        // actualizar último mensaje
        const text = li.querySelector(".content-message-text");
        if (text) text.textContent = message;

        // incrementar unread
        const unread = li.querySelector(".content-message-unread");
        if (unread) {
            let count = parseInt(unread.textContent) || 0;
            unread.textContent = count + 1;
        }

        // mover arriba
        recentMessagesContainer.appendChild(li);

        return;
    }

    addToRecent(user, message)
}

export function updateSidebar(user, message) {
    addChatToSidebar(user, message);
}
