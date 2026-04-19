import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.username = self.scope['url_route']['kwargs']['username']
        self.room_group_name = f"user_{self.username}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        print(f'🟢 WebSocket conectado: {self.room_group_name}')
        self.accept()
