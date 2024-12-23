from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/admin', views.LoginViewAdmin.as_view(), name='login'),
    path('auth/login/siswa', views.LoginViewSiswa.as_view(), name='login'),
    path('auth/refresh/', views.TokenRefreshView.as_view(), name='refresh'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
#=====================================================================================
    path('auth/addSiswa/', views.AddSiswaView.as_view(), name='addSiswa'),
    path('auth/GetAlldataSiswa', views.GetAllDataSiswaView.as_view(), name='dataSiswa'),
    path('auth/UpdateSiswa/<str:Nis>', views.UpdateSiswaView.as_view(), name='getSiswa'),
    path('auth/deleteSiswa/<str:Nis>/', views.DeleteSiswaView.as_view(), name='delete-siswa'),
#=====================================================================================
    path('auth/GetDataElearning/<str:username>', views.GetAllDataElearningView.as_view(), name='dataElearning'),
#=====================================================================================
    path('auth/addSekolah/', views.AddStrukturSekolahView.as_view(), name='addSekolah'),
    path('auth/GetAllStrukturSekolah', views.GetAllStrukturSekolahView.as_view(), name='dataSekolah'),

   

]
