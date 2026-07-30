import { recentMessagesContainer } from "./state.js";

const RECENT_STORAGE_KEY = "chat-recent-sidebar";

function ensureRecentListMarkers() {
    if (!recentMessagesContainer) return;

    recentMessagesContainer.querySelectorAll("li").forEach((li) => {
        if (!li.classList.contains("content-message-title") && !li.hasAttribute("data-recent-entry")) {
            li.setAttribute("data-recent-entry", "true");
        }
    });
}

function getSavedRecentChats() {
    try {
        const saved = localStorage.getItem(RECENT_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.warn("No se pudieron restaurar los chats recientes:", error);
        return [];
    }
}

function saveRecentChats() {
    if (!recentMessagesContainer) return;

    const entries = Array.from(recentMessagesContainer.querySelectorAll("li[data-recent-entry]"))
        .map((li) => {
            const link = li.querySelector("a[data-username]");
            const username = link?.dataset.username;

            if (!username) return null;

            return {
                username,
                message: li.querySelector(".content-message-text")?.textContent || "",
                time: li.querySelector(".content-message-time")?.textContent || "",
                unread: parseInt(li.querySelector(".content-message-unread")?.textContent || "0", 10),
            };
        })
        .filter(Boolean);

    try {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
        console.warn("No se pudieron guardar los chats recientes:", error);
    }
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function createRecentItem(username, message, time, unread) {
    const li = document.createElement("li");
    li.setAttribute("data-recent-entry", "true");

    const a = document.createElement("a");
    a.classList.add("agree-chat");
    a.dataset.conversation = "#conversation-1";
    a.dataset.username = username;
    a.href = "#";

    const img = document.createElement("img");
    img.classList.add("content-message-image");
    img.src = "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg";
    img.alt = "";

    const info = document.createElement("span");
    info.classList.add("content-message-info");

    const name = document.createElement("span");
    name.classList.add("content-message-name");
    name.textContent = username;

    const text = document.createElement("span");
    text.classList.add("content-message-text");
    text.textContent = message || "";

    info.appendChild(name);
    info.appendChild(text);

    const more = document.createElement("span");
    more.classList.add("content-message-more");
    more.style.display = "flex";
    more.style.flexDirection = "column";
    more.style.alignItems = "flex-end";
    more.style.gap = "4px";

    const unreadEl = document.createElement("span");
    unreadEl.classList.add("content-message-unread");
    unreadEl.textContent = unread ?? 0;

    const timeEl = document.createElement("span");
    timeEl.classList.add("content-message-time");
    timeEl.textContent = time || getCurrentTime();

    more.appendChild(unreadEl);
    more.appendChild(timeEl);

    a.appendChild(img);
    a.appendChild(info);
    a.appendChild(more);
    li.appendChild(a);

    return li;
}

function updateRecentItem(li, username, message, time, unread) {
    if (!li) return;

    const link = li.querySelector("a[data-username]");
    if (link) {
        link.dataset.username = username;
        link.querySelector(".content-message-name").textContent = username;
    }

    const text = li.querySelector(".content-message-text");
    if (text && message !== undefined && message !== null) {
        text.textContent = message;
    }

    const timeEl = li.querySelector(".content-message-time");
    if (timeEl && time) {
        timeEl.textContent = time;
    }

    const unreadEl = li.querySelector(".content-message-unread");
    if (unreadEl && unread !== undefined && unread !== null) {
        unreadEl.textContent = unread;
    }
}

export function initializeRecentSidebar() {
    if (!recentMessagesContainer) return;

    ensureRecentListMarkers();

    const savedChats = getSavedRecentChats();
    const title = recentMessagesContainer.querySelector(".content-message-title");

    if (savedChats.length > 0) {
        recentMessagesContainer.querySelectorAll("li[data-recent-entry]").forEach((entry) => entry.remove());

        savedChats.forEach((chat) => {
            const li = createRecentItem(chat.username, chat.message, chat.time, chat.unread);
            recentMessagesContainer.insertBefore(li, title?.nextSibling || null);
        });
    }

    saveRecentChats();
}

export function addToRecent(username, message = "") {
    if (!recentMessagesContainer) return;

    ensureRecentListMarkers();

    const existing = recentMessagesContainer.querySelector(`li[data-recent-entry] a[data-username="${username}"]`);

    if (existing) {
        const li = existing.closest("li");
        const currentText = li.querySelector(".content-message-text")?.textContent || "";
        const currentTime = li.querySelector(".content-message-time")?.textContent || getCurrentTime();
        const currentUnread = li.querySelector(".content-message-unread")?.textContent || "0";

        updateRecentItem(
            li,
            username,
            message !== "" ? message : currentText,
            currentTime,
            currentUnread
        );

        recentMessagesContainer.insertBefore(li, recentMessagesContainer.children[1]);
        saveRecentChats();
        return;
    }

    const li = createRecentItem(username, message, getCurrentTime(), 0);
    const title = recentMessagesContainer.querySelector(".content-message-title");
    recentMessagesContainer.insertBefore(li, title?.nextSibling || null);
    saveRecentChats();
}

export function handleNewChat(data) {
    const user = data.from;

    const exists = document.querySelector(`[data-user="${user}"]`);

    if (!exists) {
        addChatToSidebar(user, data.message);
    } else {
        updateChatPreview(user, data.message);
    }
}

export function addChatToSidebar(user, message) {
    const existing = recentMessagesContainer?.querySelector(`li[data-recent-entry] a[data-username="${user}"]`);

    if (existing) {
        const li = existing.closest("li");
        const currentText = li.querySelector(".content-message-text")?.textContent || "";
        const currentUnread = parseInt(li.querySelector(".content-message-unread")?.textContent || "0", 10);

        updateRecentItem(li, user, message || currentText, getCurrentTime(), currentUnread + 1);
        recentMessagesContainer.appendChild(li);
        saveRecentChats();
        return;
    }

    addToRecent(user, message);
}

export function updateSidebar(user, message) {
    addChatToSidebar(user, message);
}

initializeRecentSidebar();
