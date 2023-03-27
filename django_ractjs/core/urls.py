from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FilesViewSet, upload_files_data,upload_files_data1
from . import views

router = DefaultRouter()
router.register('files', FilesViewSet, basename="files")

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/upload-files-data1/', upload_files_data1, name='upload-files-data1'),
    path('api/upload-files-data/<int:title>/', upload_files_data, name='show-single-file'),
]
