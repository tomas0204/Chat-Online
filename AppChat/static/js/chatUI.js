export function addMessage(message, type) {
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

export function addAudioMessage(audioUrl, type) {
    const container = document.querySelector(".conversation-wrapper");

    if (!container) {
        console.error("❌ No existe .conversation-wrapper");
        return;
    }

    const li = document.createElement("li");
    li.classList.add("conversation-item");

    console.log("🔊 Agregando mensaje de audio:", audioUrl, "Tipo:", type);

    if (type === "sent") {
        li.classList.add("me");
    }

    // 🧍‍♂️ Imagen
    const side = document.createElement("div");
    side.classList.add("conversation-item-side");

    const img = document.createElement("img");
    img.classList.add("conversation-item-image");
    img.src = "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg";

    side.appendChild(img);

    // 📦 Contenido
    const content = document.createElement("div");
    content.classList.add("conversation-item-content");

    const wrapper = document.createElement("div");
    wrapper.classList.add("conversation-item-wrapper");

    const box = document.createElement("div");
    box.classList.add("conversation-item-box");

    const text = document.createElement("div");
    text.classList.add("conversation-item-text");

    // 🎧 AUDIO CUSTOM
    const audio = new Audio(audioUrl);

    const audioContainer = document.createElement("div");
    audioContainer.classList.add("audio-container");

    const playBtn = document.createElement("button");
    playBtn.classList.add("audio-play");
    playBtn.innerHTML = "▶";

    const progress = document.createElement("div");
    progress.classList.add("audio-progress");

    const progressBar = document.createElement("div");
    progressBar.classList.add("audio-progress-bar");
    progress.appendChild(progressBar);

    const time = document.createElement("div");
    time.classList.add("conversation-item-time");
    time.textContent = "0:00";

    // ▶ Play / Pause
    playBtn.onclick = () => {
        if (audio.paused) {
            audio.play();
            playBtn.innerHTML = "⏸";
        } else {
            audio.pause();
            playBtn.innerHTML = "▶";
        }
    };

    // ⏱ progreso
    audio.addEventListener("timeupdate", () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percent + "%";

        const mins = Math.floor(audio.currentTime / 60);
        const secs = Math.floor(audio.currentTime % 60)
            .toString()
            .padStart(2, "0");

        time.textContent = `${mins}:${secs}`;
    });

    audio.addEventListener("ended", () => {
        playBtn.innerHTML = "▶";
    });

    // 🎯 click en barra
    progress.addEventListener("click", (e) => {
        const rect = progress.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / rect.width;
        audio.currentTime = percent * audio.duration;
    });

    // 📦 armar audio UI
    audioContainer.appendChild(playBtn);
    audioContainer.appendChild(progress);
    audioContainer.appendChild(time);

    text.appendChild(audioContainer);

    // 🔽 DROPDOWN (igual que texto)
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

    // 📦 estructura final
    box.appendChild(text);
    box.appendChild(dropdown);

    wrapper.appendChild(box);
    content.appendChild(wrapper);

    li.appendChild(side);
    li.appendChild(content);

    container.appendChild(li);

    container.scrollTop = container.scrollHeight;
}