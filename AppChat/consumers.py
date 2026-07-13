import json
from channels.generic.websocket import AsyncWebsocketConsumer

    
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        sender = self.scope["url_route"]["kwargs"]["sender"]
        receiver = self.scope["url_route"]["kwargs"]["receiver"]

        print("USER:", self.scope["user"])
        print("AUTH:", self.scope["user"].is_authenticated)
        self.room_name = "_".join(sorted([sender, receiver]))

        print("ROOM:", self.room_name)
        self.room_group_name = f"chat_{self.room_name}"

        # Unirse al grupo
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        print(f"✅ Connected to room: {self.room_name}")

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # 📩 recibir mensaje desde JS
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']

        # enviar al grupo
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': self.scope["user"].username,
            }
        )

    # 📤 enviar mensaje al frontend
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender'],
        }))