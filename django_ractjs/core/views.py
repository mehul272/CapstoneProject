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
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import LabelEncoder

def data_validation(df):
    
    # replace null values with 'N/A'
    df.replace(['', ' ', None, np.nan], 'N/A', inplace=True, regex=True)
    
    df = pd.get_dummies(df, dummy_na=True)
    
    numeric_columns = df.select_dtypes(include=np.number).columns
    
    print(numeric_columns)
    
    df[numeric_columns] = (df[numeric_columns] - df[numeric_columns].mean()) / df[numeric_columns].std()
    
    return df


class FilesViewSet(viewsets.ModelViewSet):
    queryset = Files.objects.all()
    serializer_class = FilesSerializer


def get_file_data(request, title, no_of_rows):

    files = Files.objects.get(id=title)

    file_path = files.pdf.path

    string_array_str = request.GET.get('stringArray')

    string_array = json.loads(string_array_str)

    data = []

    with open(file_path, newline='') as csvfile:

        reader = csv.DictReader(csvfile)
        for row in reader:
            data.append(row)

        df = pd.DataFrame(data)

        if no_of_rows != "All":
            filtered_df = df[string_array].head(int(no_of_rows))
        else:
            filtered_df = df[string_array]

    return filtered_df


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

    no_of_rows = request.GET.get('numRows')

    filtered_df = get_file_data(request, title, no_of_rows)

    filtered_data = filtered_df.to_dict('records')

    return JsonResponse({'result': filtered_data})


@api_view(['GET'])
def start_transformation(request, title):

    transformationType = request.GET.get('transformation')
    columns_str = request.GET.get('stringArray')

    columns = json.loads(columns_str)

    no_of_rows = request.GET.get('numRows')

    filtered_df = get_file_data(request, title, no_of_rows)

    # Tranformation Steps:

    new_Data = data_validation(filtered_df)

    print("New Data: ", new_Data)

    # Imputer in data for Missing Values

    if isinstance(filtered_df, list):
        filtered_df = pd.DataFrame(filtered_df)

    # Drop empty columns
    filtered_df = filtered_df.dropna()

    # Drop Duplicate Columns
    filtered_df = filtered_df.drop_duplicates()

    # Covert String name from Lower Case
    for col in filtered_df.columns:
        if filtered_df[col].dtype == 'object':
            filtered_df[col] = filtered_df[col].str.lower()

    filtered_df = filtered_df.reset_index(drop=True)

    print(filtered_df)

    print(new_Data)
    # for col in columns:
    #     filtered_df[col] = filtered_df[col].astype(int) * 10

    filtered_data = filtered_df.to_dict('records')
    
    return JsonResponse({'result': filtered_data})
