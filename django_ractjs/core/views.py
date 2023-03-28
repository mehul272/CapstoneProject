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
import json
import csv
import pandas as pd
# Create your views here.


class FilesViewSet(viewsets.ModelViewSet):
    queryset = Files.objects.all()
    serializer_class = FilesSerializer


@api_view(['GET'])
def upload_files_data(request, title):

    files = Files.objects.get(id=title)

    file_path = files.pdf.path

    with default_storage.open(file_path, 'r') as f:
        contents = f.read()

        lines = contents.split('\n')
        header_row = lines[0]
        column_names = header_row.split(',')

        return JsonResponse({"success": column_names})


@api_view(['GET'])
def upload_files_data1(request):

    print(request)

    return JsonResponse({"success": False})


@api_view(['GET'])
def filter_files_data(request, title):

    files = Files.objects.get(id=title)

    file_path = files.pdf.path

    string_array_str = request.GET.get('stringArray')

    no_of_rows = request.GET.get('numRows')

    string_array = json.loads(string_array_str)

    data = []

    with open(file_path, newline='') as csvfile:

        reader = csv.DictReader(csvfile)
        for row in reader:
            data.append(row)

        df = pd.DataFrame(data)
        filtered_df = df[string_array].head(int(no_of_rows))

        filtered_data = filtered_df.to_dict('records')

    print(filtered_df)

    return JsonResponse({'result': filtered_data})
