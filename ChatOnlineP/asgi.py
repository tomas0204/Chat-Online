import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import AppChat.routing 

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ChatOnlineP.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            AppChat.routing.websocket_urlpatterns
        )
    ),
})
