const currentUser = document.body.dataset.username;
const recentMessagesContainer = document.getElementById("recent-messages");
const input = document.querySelector(".conversation-form-input");
const sendBtn = document.querySelector(".conversation-form-submit");
console.log("Usuario logueado:", currentUser);
let socket = null;
let currentReceiver = null;

function openChat(receiver) {
    const sender = currentUser;

    currentReceiver = receiver;

    // cerrar anterior
    if (socket) {
        socket.close();
    }

    // abrir nuevo
    socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${sender}/${receiver}/`);

    socket.onopen = () => console.log("✅ conectado");

    socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        const isMe = data.sender === currentUser;
        addMessage(data.message, isMe ? "received" : "sent");
    };
}

function addToRecent(username) {
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
    a.classList.add("open-chat");
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

    // insertar debajo del título
    recentMessagesContainer.insertBefore(li, recentMessagesContainer.children[1]);
}

function addMessage(message, type) {
    const container = document.querySelector(".conversation-wrapper");

    if (!container) {
        console.error("❌ No existe .conversation-wrapper");
        return;
    }

    const li = document.createElement("li");
    li.classList.add("conversation-item");

    if (type === "sent") {
        li.classList.add("me");
    }

    // Imagen
    const side = document.createElement("div");
    side.classList.add("conversation-item-side");

    const img = document.createElement("img");
    img.classList.add("conversation-item-image");
    img.src = "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg";
    img.alt = "";

    side.appendChild(img);

    // Contenido
    const content = document.createElement("div");
    content.classList.add("conversation-item-content");

    const wrapper = document.createElement("div");
    wrapper.classList.add("conversation-item-wrapper");

    const box = document.createElement("div");
    box.classList.add("conversation-item-box");

    const text = document.createElement("div");
    text.classList.add("conversation-item-text");

    const p = document.createElement("p");
    p.textContent = message;

    const time = document.createElement("div");
    time.classList.add("conversation-item-time");
    time.textContent = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    // 🔽 DROPDOWN
    const dropdown = document.createElement("div");
    dropdown.classList.add("conversation-item-dropdown");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("conversation-item-dropdown-toggle");
    btn.innerHTML = '<i class="ri-more-2-line"></i>';

    const ul = document.createElement("ul");
    ul.classList.add("conversation-item-dropdown-list");

    const liForward = document.createElement("li");
    const aForward = document.createElement("a");
    aForward.href = "#";
    aForward.innerHTML = '<i class="ri-share-forward-line"></i> Forward';

    const liDelete = document.createElement("li");
    const aDelete = document.createElement("a");
    aDelete.href = "#";
    aDelete.innerHTML = '<i class="ri-delete-bin-line"></i> Delete';

    liForward.appendChild(aForward);
    liDelete.appendChild(aDelete);

    ul.appendChild(liForward);
    ul.appendChild(liDelete);

    dropdown.appendChild(btn);
    dropdown.appendChild(ul);

    // 📦 Estructura final
    text.appendChild(p);
    text.appendChild(time);

    box.appendChild(text);
    box.appendChild(dropdown); // 🔥 acá agregás el dropdown

    wrapper.appendChild(box);
    content.appendChild(wrapper);

    li.appendChild(side);
    li.appendChild(content);

    container.appendChild(li);

    container.scrollTop = container.scrollHeight;
}
document.addEventListener("click", function (e) {
    if (e.target.closest(".conversation-item-dropdown-toggle")) {
        const dropdown = e.target.closest(".conversation-item-dropdown");
        dropdown.classList.toggle("active");
    } else {
        document.querySelectorAll(".conversation-item-dropdown").forEach(d => {
            d.classList.remove("active");
        });
    }
});

document.querySelectorAll(".open-chat").forEach(item => {
    item.addEventListener("click", function (e) {
        e.preventDefault();

        let receiver = this.dataset.username;

        if (!receiver) {
            console.error("❌ No se encontró el receptor");
            return;
        }
        openChat(receiver);
    });
});

document.addEventListener("click", function(e) {
    const el = e.target.closest(".agree-chat");
    if (!el) return;

    e.preventDefault();

    const username = el.dataset.username;

    addToRecent(username);
    openChat(username);
});

sendBtn.addEventListener("click", function () {
    const message = input.value.trim();

    if (!message || !socket) {
        console.log("❌ No hay socket o mensaje vacío");
        return;
    }

    socket.send(JSON.stringify({
        message: message,
        to: currentReceiver
    }));

    input.value = "";
});

input.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
    }
});

// start: Sidebar
document.querySelector('.chat-sidebar-profile-toggle').addEventListener('click', function (e) {
    e.preventDefault()
    this.parentElement.classList.toggle('active')
})

document.addEventListener('click', function (e) {
    if (!e.target.matches('.chat-sidebar-profile, .chat-sidebar-profile *')) {
        document.querySelector('.chat-sidebar-profile').classList.remove('active')
    }
})
// end: Sidebar



// start: Coversation
document.querySelectorAll('.conversation-item-dropdown-toggle').forEach(function (item) {
    item.addEventListener('click', function (e) {
        e.preventDefault()
        if (this.parentElement.classList.contains('active')) {
            this.parentElement.classList.remove('active')
        } else {
            document.querySelectorAll('.conversation-item-dropdown').forEach(function (i) {
                i.classList.remove('active')
            })
            this.parentElement.classList.add('active')
        }
    })
})

document.addEventListener('click', function (e) {
    if (!e.target.matches('.conversation-item-dropdown, .conversation-item-dropdown *')) {
        document.querySelectorAll('.conversation-item-dropdown').forEach(function (i) {
            i.classList.remove('active')
        })
    }
})

document.querySelectorAll('.conversation-form-input').forEach(function (item) {
    item.addEventListener('input', function () {
        this.rows = this.value.split('\n').length
    })
})

document.addEventListener("click", function(e) {
    const item = e.target.closest("[data-conversation]");
    if (!item) return;

    e.preventDefault();

    document.querySelectorAll('.conversation').forEach(function (i) {
        i.classList.remove('active');
    });

    const target = document.querySelector(item.dataset.conversation);
    if (target) {
        target.classList.add('active');
    }
});

document.querySelectorAll('.conversation-back').forEach(function (item) {
    item.addEventListener('click', function (e) {
        e.preventDefault()
        this.closest('.conversation').classList.remove('active')
        document.querySelector('.conversation-default').classList.add('active')
    })
})
// end: Coversation