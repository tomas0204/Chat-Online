from django.shortcuts import render
from django.shortcuts import render, redirect
from .models import Users
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

def search_users(request):
    username = request.session.get('username')
    query = request.GET.get('query', '')
    users = Users.objects.filter(username__icontains=query) if query else []
    print(query, users)
    return render(request, 'chat.html', {'username': username,'users': users, 'query': query})

def user_profile(request, username):
    user = get_object_or_404(Users, username=username)
    query = request.GET.get('query', '')
    users = Users.objects.filter(username__icontains=query) if query else []
    return render(request, 'user_profile.html', {'user': user})

