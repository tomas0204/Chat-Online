import 'https://cdn.jsdelivr.net/npm/emoji-picker-element@1.18.3/index.js';
import { addToRecent } from "./sidebar.js";
import {
    input, sendBtn, socket, currentReceiver, currentUser, getEmojiElements,
    getRecordButton
} from "./state.js";
import { openChat, sendMessage } from "./socket.js";

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

document.addEventListener("click", function (e) {
    const el = e.target.closest(".agree-chat");
    if (!el) return;

    e.preventDefault();

    const username = el.dataset.username;

    addToRecent(username);
    openChat(username);
});

sendBtn.addEventListener("click", function () {
    const message = input.value.trim();

    sendMessage({
        type: "text",
        message: message,
        to: currentReceiver
    });

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

document.addEventListener("click", function (e) {
    const item = e.target.closest("[data-conversation]");
    if (!item) return;

    e.preventDefault();
    openChat(item.dataset.username);
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

//EMOJIS
document.addEventListener("DOMContentLoaded", () => {
    console.log("EVENTS DOM listo");

    getEmojiElements().btn.addEventListener("click", () => {
        const picker = getEmojiElements().picker;
        picker.style.display = picker.style.display === "none" ? "block" : "none";
    });

    getEmojiElements().picker.addEventListener("emoji-click", (event) => {
        const emoji = event.detail.unicode;
        getEmojiElements().inputEmoji.value += emoji;
    });
});

//RECORD
let mediaRecorder;
let audioChunks = [];

getRecordButton().addEventListener("click", async () => {

    // 👉 iniciar grabación
    if (!mediaRecorder || mediaRecorder.state === "inactive") {

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        mediaRecorder = new MediaRecorder(stream);

        audioChunks = [];

        mediaRecorder.ondataavailable = e => {
            if (e.data.size > 0) {
                audioChunks.push(e.data);
            }
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            audioChunks = [];

            // enviar al backend
            const formData = new FormData();
            formData.append("audio", audioBlob, "audio.webm");

            const response = await fetch("/upload-audio/", {
                method: "POST",
                body: formData
            });

            // ⚠️ importante para debug
            if (!response.ok) {
                console.error("Error en upload:", await response.text());
                return;
            }

            const data = await response.json();

            console.log("URL del audio:", data.url);

            sendMessage({
                type: "audio",
                message: "Audio enviado",
                audio_url: data.url,
                to: currentReceiver
            });

            console.log("🎧 audio enviado correctamente");
        };

        mediaRecorder.start();
        console.log("🎙️ grabando...");
    }

    // 👉 detener grabación
    else {
        mediaRecorder.stop();
        console.log("⏹️ grabación detenida...");
    }
});