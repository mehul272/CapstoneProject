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
import numpy as np


def transform_dataframe(df):
    # Remove duplicate rows
    df = df.drop_duplicates()

    # Replace missing values with the mean of each column
    numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].mean())

    # Rename columns to lower case
    df = df.rename(columns=lambda x: x.lower())

    # Convert string columns to uppercase
    str_cols = df.select_dtypes(include='object').columns
    df[str_cols] = df[str_cols].apply(lambda x: x.str.upper())

    # Remove columns with all missing values
    df = df.dropna(how='all', axis=1)

    # Convert a categorical column to numeric
    cat_col = 'category_col'
    if cat_col in df.columns:
        df[cat_col] = pd.Categorical(df[cat_col])
        df[cat_col] = df[cat_col].cat.codes

    # Normalize numeric columns
    num_cols = df.select_dtypes(include=[np.number]).columns
        
    df[num_cols] = (df[num_cols] - df[num_cols].mean()) / df[num_cols].std()

    # replace null values with 'N/A'
    df.replace(['', ' ', None, np.nan], 'N/A', inplace=True, regex=True)

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

    filtered_df = transform_dataframe(filtered_df)
    filtered_df = filtered_df.reset_index(drop=True)

    filtered_data = filtered_df.to_dict('records')

    return JsonResponse({'result': filtered_data})
