from django.shortcuts import render
from django.shortcuts import render, redirect
from .models import Message
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from django.core.files.storage import default_storage
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

# INICIO: Maneja el formulario inicial, guarda el username en sesión y en la DB, y redirige al chat
def nickname(request):
    if request.method == "POST":
        username = request.POST.get("username")
        
        if username: # Verifica si el nombre de usuario no está vacío
            user, created = User.objects.get_or_create(username=username)
            if created: 
                user.set_unusable_password() 
                user.save()
                print(f"Usuario creado: {username}")
            else:
                print(f"Usuario existente: {username}")
            
            login(request, user)  # Inicia sesión para el usuario
            request.session['username'] = username  # Guarda el nombre de usuario en la sesión
    
            return redirect('hellochat') # Redirige a la vista hellochat
        else:
            print("No se proporcionó un nombre de usuario válido")
    return render(request, "nickname.html")


# VIEW 1: Carga la página principal del chat con el username desde sesión
def hellochat(request):
    username = request.session.get('username')
    return render(request, "chat.html", {'username': username})


# BUSCA USUARIOS: Busca usuarios por texto (query) y devuelve resultados al template

def get_recent_chats(user):
    from .models import Message

    # Trae todos los mensajes donde participa el usuario
    messages = Message.objects.filter(
        sender=user.username
    ) | Message.objects.filter(
        receiver=user.username
    )

    messages = messages.order_by("-timestamp")

    chats = {}
    
    for msg in messages:
        # identificar el otro usuario
        other = msg.receiver if msg.sender == user.username else msg.sender

        if other not in chats:
            chats[other] = {
                "username": other,
                "last_message": msg.content,
                "time": msg.timestamp.strftime("%H:%M"),
                "unread": 0  # después lo mejoramos
            }

    return chats.values()

def search_users(request):
    username = request.session.get('username')
    query = request.GET.get('query', '')
    users = User.objects.filter(username__icontains=query) if query else []
    recent_chats = list(get_recent_chats(request.user))
    print("💭 CHATS RECIENTES")
    print(recent_chats)
    return render(request, 'chat.html',{'username': username, 'users': users, 'recent_chats': recent_chats, 'query': query})


# VIEW 3: Muestra el perfil de un usuario específico según el username recibido
def user_profile(request, username):
    receiver = get_object_or_404(User, username=username)
    username = request.session.get('username')
    return render(request, 'user_profile.html', {'receiver': receiver, 'username': username})

@csrf_exempt
def upload_audio(request):
    if request.method == "POST":
        audio = request.FILES["audio"]

        path = default_storage.save(f"audios/{audio.name}", audio)

        return JsonResponse({
            "url": f"/media/{path}"
        })

def get_messages(request, user, other_user):

    messages = Message.objects.filter(
        Q(sender=user, receiver=other_user) |
        Q(sender=other_user, receiver=user)
    ).order_by("timestamp")

    data = [
        {
            "sender": msg.sender,
            "message": msg.content,
            "timestamp": msg.timestamp.strftime("%H:%M")
        }
        for msg in messages
    ]

    return JsonResponse(data, safe=False)