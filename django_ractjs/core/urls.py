from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FilesViewSet, upload_files_data, upload_files_data1, filter_files_data, start_transformation, start_loading, getTables, getTableData
from . import views

router = DefaultRouter()
router.register('files', FilesViewSet, basename="files")

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/upload-files-data1/', upload_files_data1, name='upload-files-data1'),
    path('api/upload-files-data/<int:title>/',
         upload_files_data, name='show-single-file'),
    path('api/filter-files-data/<int:title>/',
         filter_files_data, name='filter-files-data'),
    path('api/start-transformation/<int:title>/',
         start_transformation, name='start-transformation'),
    path('api/start-loading', start_loading, name='start-loading'),
    path("api/tables", getTables, name="Load-Tables"),
    path("api/visualize-tables/<str:tableName>/", getTableData, name="Table-Data"),

]
