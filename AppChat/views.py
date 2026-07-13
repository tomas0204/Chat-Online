from django.shortcuts import render
from django.shortcuts import render, redirect
from .models import Users
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render

# INICIO: Maneja el formulario inicial, guarda el username en sesión y en la DB, y redirige al chat
def nickname(request):
    if request.method == "POST":
        username = request.POST.get("username")
        request.session['username'] = username
        if username: # Verifica si el nombre de usuario no está vacío
            user = Users(username=username)
            user.save()
            print(user)
            return redirect('hellochat') # Redirige a la vista hellochat
        else:
            print("No se proporcionó un nombre de usuario válido")
    return render(request, "nickname.html")


# VIEW 1: Carga la página principal del chat con el username desde sesión
def hellochat(request):
    username = request.session.get('username')
    return render(request, "chat.html", {'username': username})


# BUSCA USUARIOS: Busca usuarios por texto (query) y devuelve resultados al template
def search_users(request):
    username = request.session.get('username')
    query = request.GET.get('query', '')
    users = Users.objects.filter(username__icontains=query) if query else []
    print(query, users)
    return render(request, 'chat.html', {'username': username, 'users': users, 'query': query})


# VIEW 3: Muestra el perfil de un usuario específico según el username recibido
def user_profile(request, username):
    receiver = get_object_or_404(Users, username=username)
    username = request.session.get('username')
    return render(request, 'user_profile.html', {'receiver': receiver, 'username': username})
