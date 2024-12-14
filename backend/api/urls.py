from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/admin', views.LoginViewAdmin.as_view(), name='login'),
    path('auth/login/siswa', views.LoginViewSiswa.as_view(), name='login'),
    path('auth/refresh/', views.TokenRefreshView.as_view(), name='refresh'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
#=====================================================================================
    path('auth/addSiswa', views.AddSiswaView.as_view(), name='addSiswa'),
    path('auth/GetdataSiswa', views.GetDataSiswaView.as_view(), name='dataSiswa'),
]
