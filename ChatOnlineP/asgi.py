import os

from django.core.asgi import get_asgi_application
from django.contrib.staticfiles.handlers import ASGIStaticFilesHandler

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

# ✅ PRIMERO settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ChatOnlineP.settings')

# ✅ DESPUÉS inicializar Django
django_asgi_app = get_asgi_application()

# ✅ RECIÉN AHORA importar routing
import AppChat.routing

application = ProtocolTypeRouter({
    
    "http": ASGIStaticFilesHandler(django_asgi_app),

    "websocket": AuthMiddlewareStack(
        URLRouter(
            AppChat.routing.websocket_urlpatterns
        )
    ),
})