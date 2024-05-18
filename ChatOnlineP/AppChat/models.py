from django.db import models
from django import forms
# Create your models here.

class Users(models.Model):
    username = models.CharField(max_length=100)

    def __str__(self):
        return self.username    

class UsersForm(forms.ModelForm):
    username = forms.CharField(max_length=100, label='Username', widget=forms.TextInput(attrs={'autocomplete': 'off'}))

    class Meta:
        model = Users
        fields = ['username']


class Message(models.Model):
    message = models.CharField(max_length=10000)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message

class MessageForm(forms.ModelForm):
    class Meta:
        model = Message
        fields = ['message']
        labels = {
            'message': 'Message',
        }
