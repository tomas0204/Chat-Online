from django.shortcuts import render

def hellochat(request):
    return render(request, "chat.html")

