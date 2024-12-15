from django.contrib.auth.hashers import make_password
from .models import DataSiswa
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth.models import User
from datetime import datetime
from .serializers import DataSiswaSerializer, UserSiswaSerializer


#=================================================Login=================================================
class LoginViewAdmin(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = User.objects.filter(username=username).first()

        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)

            if user.is_superuser:
                request.session['last_login_date'] = datetime.now().date().isoformat()

                return Response({
                    'id': user.id,
                    'name': user.username,
                    'email': user.email,
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'is_superuser': user.is_superuser,
                    'message': "Login Admin Berhasil",
                    'redirect': '/admin',
                })
            else:
                return Response({'error': 'Akun Anda Tidak Terdaftar'}, status=401)

        return Response({'error': 'Login Gagal'}, status=401)


class LoginViewSiswa(APIView):
    permission_classes = [AllowAny]  

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username dan password harus diisi'}, status=400)

        user = User.objects.filter(username=username).first()

        if not user:
            return Response({'error': 'Akun Belum Terdaftar'}, status=401)

        if not user.check_password(password):
            return Response({'error': 'Kata Sandi Salah'}, status=401)

        refresh = RefreshToken.for_user(user)

        request.session['last_login_date'] = datetime.now().date().isoformat()

        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'access': str(refresh.access_token),  
            'refresh': str(refresh),             
            'redirect': '/e-learning',
            'message': "Login Berhasil",
        })


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()

            if 'last_login_date' in request.session:
                del request.session['last_login_date']
            if 'last_active_time' in request.session:
                del request.session['last_active_time']

            return Response({'message': 'Logout successfully'})
        except TokenError as e:
            return Response({'error': str(e)}, status=400)


#=================================================Login=================================================


#=================================================Token=================================================
class TokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response({'error': 'Refresh token tidak diberikan.'}, status=400)

        try:
            refresh = RefreshToken(refresh_token)
            new_access = refresh.access_token

            current_time = datetime.now()
            request.session['last_active_time'] = current_time.isoformat()

            return Response({'access': str(new_access), 'refresh': str(refresh)})
        except TokenError as e:
            return Response({'error': str(e)}, status=400)

#=================================================Token=================================================

#=================================================Siswa=================================================

class AddSiswaView(APIView):
    def post(self, request):
        try:
  
            if User.objects.filter(username=request.data.get('Nis')).exists():
                return Response({
                    'error': 'NIS already exists as a username',
                    'message': 'Nis Sudah Terdaftar'
                }, status=status.HTTP_400_BAD_REQUEST)

            nis = request.data.get('Nis')
            nama = request.data.get('Nama')
            jurusan = request.data.get('Jurusan')
            kelas = request.data.get('Kelas')

            default_password = make_password(nis)

            user_serializer = UserSiswaSerializer(data={
                'username': nis,
                'password': default_password,
                'first_name': nama,
            })

            if user_serializer.is_valid():
                user_serializer.save()
            else:
                return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            siswa_serializer = DataSiswaSerializer(data={
                'id': nis,
                'Nis': nis,
                'Nama': nama,
                'Jurusan': jurusan,
                'Kelas': kelas,
                'Nisn': '',
                'JenisKelamin': '',
                'TanggalLahir': '',
                'TempatLahir': '',
                'Agama': '',
                'Alamat': '',
                'NoTelepon': '',
            })

            if siswa_serializer.is_valid():
                siswa_serializer.save()
                return Response({
                    'message': 'Data berhasil disimpan',
                    'redirect': '/admin/akun/siswa',
                }, status=status.HTTP_201_CREATED)
            else:
                print("Siswa serializer errors:", siswa_serializer.errors)
                return Response(siswa_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print("Exception error:", e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class GetAllDataSiswaView(APIView):
    def get(self, request):
        sort_by_jurusan = request.query_params.get('jurusan', None)
        sort_by_kelas = request.query_params.get('kelas', None)
        get_unique = request.query_params.get('unique', 'false').lower() == 'true'

  
        if get_unique:
            unique_jurusan = DataSiswa.objects.values_list('Jurusan', flat=True).distinct()
            unique_kelas = DataSiswa.objects.values_list('Kelas', flat=True).distinct()
            return Response(
                {
                    "jurusan": list(unique_jurusan),
                    "kelas": list(unique_kelas),
                },
                status=status.HTTP_200_OK,
            )

        siswa_queryset = DataSiswa.objects.all()

        if sort_by_jurusan:
            siswa_queryset = siswa_queryset.filter(Jurusan__istartswith=sort_by_jurusan).order_by('Jurusan')

        if sort_by_kelas:
            siswa_queryset = siswa_queryset.filter(Kelas=sort_by_kelas).order_by('Kelas')

        serializer = DataSiswaSerializer(siswa_queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UpdateSiswaView(APIView):
    def get(self, request, Nis):
        try:
            siswa = DataSiswa.objects.filter(Nis=Nis).first()
            if not siswa:
                return Response({
                    'error': 'not_found',
                    'message': 'Data siswa tidak ditemukan'
                }, status=status.HTTP_404_NOT_FOUND)

            serializer = DataSiswaSerializer(siswa)
            return Response({
                'message': 'Data siswa ditemukan',
                'data': serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            
            return Response({
                'error': 'server_error',
                'message': 'Terjadi kesalahan saat mengambil data siswa',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, Nis):
        try:
            siswa = DataSiswa.objects.filter(Nis=Nis).first()
            if not siswa:
                return Response({
                    'error': 'not_found',
                    'message': 'Data siswa tidak ditemukan'
                }, status=status.HTTP_404_NOT_FOUND)

            serializer = DataSiswaSerializer(siswa, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'Data siswa berhasil diperbarui',
                    'redirect': '/admin/akun/siswa',
                    'data': serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'validation_error',
                    'message': 'Data tidak valid',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'error': 'server_error',
                'message': 'Terjadi kesalahan saat memperbarui data siswa',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DeleteSiswaView(APIView):
    def delete(self, request, Nis):
        try:
            siswa = DataSiswa.objects.filter(Nis=Nis).first()
            if siswa:
                siswa.delete()
            else:
                return Response({
                    'error': 'Data siswa tidak ditemukan'
                }, status=status.HTTP_404_NOT_FOUND)

            user = User.objects.filter(username=Nis).first()
            if user:
                user.delete()
            else:
                return Response({
                    'error': 'User tidak ditemukan'
                }, status=status.HTTP_404_NOT_FOUND)

            return Response({
                'message': 'Data siswa berhasil dihapus'
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print("Error during delete:", e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#=================================================Siswa=================================================

#=================================================Guru==================================================