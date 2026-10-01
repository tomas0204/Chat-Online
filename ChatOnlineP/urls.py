from django import views
from django.contrib import admin
from django.urls import path
from AppChat.views import *
from ChatOnlineP import settings
from django.conf.urls.static import static

urlpatterns = [
    path("",nickname, name="nickname"),
    path("chat",hellochat,name="hellochat"),
    path("users", search_users, name="search_users"),
    path("user/<str:username>/", user_profile, name="user_profile"),
    path("upload-audio/", upload_audio),
    path("search_users", search_users, name="search_users"),
    path("messages/<str:user>/<str:other_user>/", get_messages, name="get_messages"),
    path("user_profile/<str:username>/", user_profile, name="user_profile"),
    path("coming_soon/", coming_soon, name="coming_soon"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
