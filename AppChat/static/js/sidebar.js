import {openChat} from "./socket.js";
import {recentMessagesContainer, currentReceiver} from "./state.js";

export function addToRecent(username) {
    // evitar duplicados
    const existing = recentMessagesContainer.querySelector(`[data-username="${username}"]`);
    
    if (existing) {
        const li = existing.closest("li");
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
    text.textContent = "";

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
