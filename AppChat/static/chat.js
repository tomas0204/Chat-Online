const currentUser = document.body.dataset.username;
console.log("Usuario logueado:", currentUser);

document.querySelectorAll(".open-chat").forEach(item => {
  item.addEventListener("click", function (e) {
    e.preventDefault();

    const receiver = this.dataset.username;
    const sender = currentUser;

    console.log("Quiero chatear con:", receiver);

    // 🔥 Crear socket acá
    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${sender}/${receiver}/`);

    console.log("Conectando:", sender, receiver);

    socket.onopen = function () {
      console.log("✅ WebSocket conectado");

      socket.send(JSON.stringify({
        message: "Hola!",
        to: receiver
      }));
    };

    socket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      console.log("📩 Mensaje recibido:", data.message);
    };
  });
});

// start: Sidebar
document.querySelector('.chat-sidebar-profile-toggle').addEventListener('click', function(e) {
    e.preventDefault()
    this.parentElement.classList.toggle('active')
})

document.addEventListener('click', function(e) {
    if(!e.target.matches('.chat-sidebar-profile, .chat-sidebar-profile *')) {
        document.querySelector('.chat-sidebar-profile').classList.remove('active')
    }
})
// end: Sidebar



// start: Coversation
document.querySelectorAll('.conversation-item-dropdown-toggle').forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault()
        if(this.parentElement.classList.contains('active')) {
            this.parentElement.classList.remove('active')
        } else {
            document.querySelectorAll('.conversation-item-dropdown').forEach(function(i) {
                i.classList.remove('active')
            })
            this.parentElement.classList.add('active')
        }
    })
})

document.addEventListener('click', function(e) {
    if(!e.target.matches('.conversation-item-dropdown, .conversation-item-dropdown *')) {
        document.querySelectorAll('.conversation-item-dropdown').forEach(function(i) {
            i.classList.remove('active')
        })
    }
})

document.querySelectorAll('.conversation-form-input').forEach(function(item) {
    item.addEventListener('input', function() {
        this.rows = this.value.split('\n').length
    })
})

document.querySelectorAll('[data-conversation]').forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault()
        document.querySelectorAll('.conversation').forEach(function(i) {
            i.classList.remove('active')
        })
        document.querySelector(this.dataset.conversation).classList.add('active')
    })
})

document.querySelectorAll('.conversation-back').forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault()
        this.closest('.conversation').classList.remove('active')
        document.querySelector('.conversation-default').classList.add('active')
    })
})
// end: Coversation