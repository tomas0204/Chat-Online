from django import views
from django.contrib import admin
from django.urls import path
from AppChat.views import *
from ChatOnlineP import settings
from django.conf.urls.static import static

urlpatterns = [
    path("",nickname, name="nickname"),
    # path("",hellologin,name="hellologin"),
    # path("register",helloregister,name="helloregister"),
    path("chat",hellochat,name="hellochat"),
    # path("users",searchuser, name="searchuser")
    path("users", search_users, name="search_users"),
    path("user/<str:username>/", user_profile, name="user_profile"),
    path("upload-audio/", upload_audio),
    path("search_users", search_users, name="search_users"),
    path("messages/<str:user>/<str:other_user>/", get_messages, name="get_messages")
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
