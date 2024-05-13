from django.db import models
from django import forms
# Create your models here.

class Users(models.Model):
    nombre = models.CharField(max_length=100)

class UsersFrom(forms.ModelForm):
    class Meta:
        model = Users
        fields = ["nombre"]

