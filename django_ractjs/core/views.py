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


def sort_dataframe(df, sortColumn):
    if sortColumn == "All":
        sorted_df = df.apply(lambda col: pd.to_numeric(col, errors="coerce")).fillna(df)
        sorted_df = sorted_df.sort_values(by=sorted_df.columns.tolist())
    else:
        sorted_df = df.sort_values(by=sortColumn)
    
    return sorted_df


def transform_dataframe(df, transformationOptions, sortColumn):

    df = df.apply(pd.to_numeric, errors='ignore')

    for options in transformationOptions:
        num = options[0]

        if num == "1":
            # Remove duplicate rows
            df = df.drop_duplicates()
        elif num == "2":
            # Replace missing values with the mean of each column
            for col in df.columns:
                if df[col].dtype == 'int64' or df[col].dtype == 'float64':
                    col_mean = df[col].mean()
                    df[col].fillna(col_mean, inplace=True)
            print(df)
        elif num == "3":
            # Convert string columns to uppercase
            str_cols = df.select_dtypes(include='object').columns
            df[str_cols] = df[str_cols].apply(lambda x: x.str.upper())
        elif num == "4":
            # Remove columns with all missing values
            df = df.dropna(how='all', axis=1)
        elif num == "5":
            # Convert a categorical column to numeric
            cat_col = 'category_col'
            if cat_col in df.columns:
                df[cat_col] = pd.Categorical(df[cat_col])
                df[cat_col] = df[cat_col].cat.codes
        elif num == "6":
            # replace null values with 'N/A'
            df.replace(['', ' ', None, np.nan], 'N/A',
                       inplace=True, regex=True)
        elif num == "7":
            # Convert string columns to lowercase
            str_cols = df.select_dtypes(include='object').columns
            df[str_cols] = df[str_cols].apply(lambda x: x.str.lower())
        elif num == "8":
            # Sort Dataframe
            df = sort_dataframe(df, sortColumn)
            print(df)
        else:
            print("No Option Available")

    return df


class FilesViewSet(viewsets.ModelViewSet):
    queryset = Files.objects.all()
    serializer_class = FilesSerializer


def get_file_data(request, title, no_of_rows):

    files = Files.objects.get(id=title)

    file_path = files.pdf.path

    string_array_str = request.GET.get('stringArray')

    string_array = json.loads(string_array_str)

    print(string_array)

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

    filtered_data = filtered_df.to_dict(orient='records')
    print(filtered_data)

    return JsonResponse({'result': filtered_data})


@api_view(['GET'])
def start_transformation(request, title):

    transformationOptions = request.GET.get('transformationOptions')
    sortColumn = request.GET.get('sortColumn')
    print(transformationOptions)

    no_of_rows = request.GET.get('numRows')

    filtered_df = get_file_data(request, title, no_of_rows)

    # Tranformation Steps:

    filtered_df = transform_dataframe(
        filtered_df, json.loads(transformationOptions), sortColumn)

    filtered_df = filtered_df.reset_index(drop=True)

    filtered_data = filtered_df.to_dict('records')

    return JsonResponse({'result': filtered_data})


@api_view(['GET'])
def start_loading(request):
    string_array_str = request.GET.get('stringArray')

    string_array = json.loads(string_array_str)

    df = pd.DataFrame(string_array)

    print(df)

    return JsonResponse({'result': "Done"})
