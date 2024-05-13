from django.db import models
from django import forms
# Create your models here.

class Users(models.Model):
    username = models.CharField(max_length=100)

class UsersForm(forms.ModelForm):
    username = forms.CharField(max_length=100, label='Username', widget=forms.TextInput(attrs={'autocomplete': 'off'}))

    class Meta:
        model = Users
        fields = ['username']
