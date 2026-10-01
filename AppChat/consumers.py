import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        sender = self.scope["url_route"]["kwargs"]["sender"]
        receiver = self.scope["url_route"]["kwargs"]["receiver"]
        self.room_name = "_".join(sorted([sender, receiver]))
        self.room_group_name = f"chat_{self.room_name}" 

        # Unirse al grupo
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        print(f"✅ Connected to room: {self.room_name}")

        await self.accept()

    async def disconnect(self, close_code):
        print("Socket cerrado con código:", close_code)
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # 📩 recibir mensaje desde JS
    async def receive(self, text_data):

        data = json.loads(text_data)

        msg_type = data.get("type", "text")
        sender = self.scope["url_route"]["kwargs"]["sender"]

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'data': data,
                'sender': sender,
                'msg_type': msg_type,
            }
        )
        
        receiver = data.get("to")
        
        await self.channel_layer.group_send(
            f"user_{receiver}",
            {
                "type": "notify",
                "data": {
                    "type": "chat_message",
                    "from": sender,
                    "message": data.get("message"),
                    "audio_url": data.get("audio_url"),
                }
            }
        )
        
        await self.save_message(sender, receiver, data.get("message"))
            
        print(f"📩 Mensaje enviado al grupo {self.room_group_name}: {data.get('message')} de {self.scope['user'].username}")

                
    @database_sync_to_async
    def save_message(self, sender, receiver, content):
        return Message.objects.create(
            sender=sender,
            receiver=receiver,
            content=content
    )
    
    # 📤 enviar mensaje al frontend
    async def chat_message(self, event):
        try:
            await self.send(text_data=json.dumps({
                'message': event['data'].get('message'),
                'sender': event['sender'],
                'msg_type': event['msg_type'],
                "audio_url": event['data'].get('audio_url', None)
            }))
        except Exception as e:
            print("❌ Error enviando mensaje:", e)

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.username = self.scope["url_route"]["kwargs"]["username"]
        self.room_group_name = f"user_{self.username}"
        print(f"✅ Connected to notifications for user: {self.username}")
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
        )

    async def notify(self, event):
        print(f"Notificación recibida 🔵, {event}")
        await self.send(text_data=json.dumps(event["data"]))