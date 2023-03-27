from django.shortcuts import render
from .models import Files
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import FilesSerializer
import csv
from django.http import JsonResponse
from django.contrib import admin
from django.core.files.storage import default_storage
# Create your views here.


class FilesViewSet(viewsets.ModelViewSet):
    queryset = Files.objects.all()
    serializer_class = FilesSerializer


@api_view(['GET'])
def upload_files_data(request, title):
    print("hi")

    files = Files.objects.get(id=title)

    file_path = files.pdf.path

    with default_storage.open(file_path, 'r') as f:
        contents = f.read()

        lines = contents.split('\n')
        header_row = lines[0]
        column_names = header_row.split(',')
        
        print(column_names)

        return JsonResponse({"success": column_names})


@api_view(['GET'])
def upload_files_data1(request):

    print(request)

    print("hi")
    print(request)

    return JsonResponse({"success": False})
