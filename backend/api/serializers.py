from django.contrib.auth.models import User
from rest_framework import serializers
from .models import DataSiswa

class UserSiswaSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'first_name']


class DataSiswaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSiswa
        fields = ['Nis', 'Nama', 'Kelas', 'Jurusan']
        extra_kwargs = {
            'Nis': {'required': True},
            'Nama': {'required': True},
            'Jurusan': {'required': True},
            'Kelas': {'required': True},
            'Nisn': {'allow_null': True, 'required': False},
            'JenisKelamin': {'allow_null': True, 'required': False},
            'TanggalLahir': {'allow_null': True, 'required': False},
            'TempatLahir': {'allow_null': True, 'required': False},
            'Agama': {'allow_null': True, 'required': False},
            'Alamat': {'allow_null': True, 'required': False},
            'NoTelepon': {'allow_null': True, 'required': False},
        }
        

