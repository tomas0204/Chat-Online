from django.shortcuts import render
from django.shortcuts import render, redirect
from .models import *

def nickname(request):
    if request.method == "POST":
        username = request.POST.get("username")
        request.session['username'] = username
        return redirect('hellochat')  # Redirige a la vista hellochat sin pasar ningún argumento
    else:
        return render(request, "nickname.html")

def hellochat(request):
    username = request.session.get('username')  # Obtiene el nombre de usuario de la sesión
    print(UsersFrom.Meta)
    return render(request, "chat.html", {'username': username})


