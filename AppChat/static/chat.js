const currentUser = document.body.dataset.username;
console.log("Usuario logueado:", currentUser);
let socket = null;
let currentReceiver = null;

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
    p.textContent = message; // 🔥 seguro contra XSS


    const time = document.createElement("div");
    time.classList.add("conversation-item-time");
    time.textContent = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });


    text.appendChild(p);
    text.appendChild(time);

    box.appendChild(text);
    wrapper.appendChild(box);
    content.appendChild(wrapper);

    li.appendChild(side);
    li.appendChild(content);

    container.appendChild(li);

    container.scrollTop = container.scrollHeight;
}

document.querySelectorAll(".open-chat").forEach(item => {
    item.addEventListener("click", function (e) {
        e.preventDefault();

        const receiver = this.dataset.username;
        const sender = currentUser;

        currentReceiver = receiver; // 🔥 guardar receptor

        console.log("Quiero chatear con:", receiver);

        // 🔴 cerrar conexión anterior
        if (socket) {
            socket.close();
        }

        socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${sender}/${receiver}/`);

        console.log("Conectando:", sender, receiver);

        socket.onopen = function () {
            console.log("✅ WebSocket conectado");
        };

        socket.onmessage = function (e) {
            const data = JSON.parse(e.data);

            if (data.sender === currentUser) {
                addMessage(data.message, "sent");
            } else {
                addMessage(data.message, "received");
            }
        };
    });
});

const input = document.querySelector(".conversation-form-input");
const sendBtn = document.querySelector(".conversation-form-submit");

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

document.querySelectorAll('[data-conversation]').forEach(function (item) {
    item.addEventListener('click', function (e) {
        e.preventDefault()
        document.querySelectorAll('.conversation').forEach(function (i) {
            i.classList.remove('active')
        })
        document.querySelector(this.dataset.conversation).classList.add('active')
    })
})

document.querySelectorAll('.conversation-back').forEach(function (item) {
    item.addEventListener('click', function (e) {
        e.preventDefault()
        this.closest('.conversation').classList.remove('active')
        document.querySelector('.conversation-default').classList.add('active')
    })
})
// end: Coversation