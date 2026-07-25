from django.db import models
from django import forms
import logging
# Create your models here.

class Users(models.Model):
    username = models.CharField(max_length=100)

    def __str__(self):
        return self.username    

class UsersForm(forms.ModelForm):
    username = forms.CharField(max_length=100, label='Username', widget=forms.TextInput(attrs={'autocomplete': 'off'}))
    logging.info(username)
    class Meta:
        model = Users
        fields = ['username']

class Message(models.Model):
    sender = models.CharField(max_length=100)
    receiver = models.CharField(max_length=100)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)