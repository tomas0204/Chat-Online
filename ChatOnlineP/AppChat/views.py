from django.shortcuts import render
from django.shortcuts import render, redirect
from .models import *
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, render

def nickname(request):
    if request.method == "POST":
        username = request.POST.get("username")
        request.session['username'] = username
        if username:  # Verifica si el nombre de usuario no está vacío
            user = Users(username=username)
            user.save()  # Guarda el nuevo usuario en la base de datos
            print (user)
            return redirect('hellochat')  # Redirige a la vista hellochat
        else:
            print("No se proporcionó un nombre de usuario válido")
    return render(request, "nickname.html")

def hellochat(request):
    username = request.session.get('username')  # Obtiene el nombre de usuario de la sesión
    usuarios = Users.objects.all()
    return render(request, "chat.html", {'username': username})

def send_message(request):
    if request.method == 'POST':
        form = MessageForm(request.POST)
        if form.is_valid():
            form.save()  # Guardar el mensaje en la base de datos
            return redirect('hellochat')  # Suponiendo que tienes una URL llamada 'chat'
    else:
        form = MessageForm()
    return render(request, 'chat.html', {'form': form})

def search_users(request):
    query = request.GET.get('query', '')
    users = Users.objects.filter(username__icontains=query) if query else []
    return render(request, 'chat.html', {'users': users, 'query': query})

def user_profile(request, username):
    user = get_object_or_404(Users, username=username)
    query = request.GET.get('query', '')
    users = Users.objects.filter(username__icontains=query) if query else []
    return render(request, 'user_profile.html', {'user': user})

