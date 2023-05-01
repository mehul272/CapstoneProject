from .models import Files
from rest_framework import viewsets
from rest_framework.decorators import api_view
from .serializers import FilesSerializer
import csv
from django.http import JsonResponse
from django.core.files.storage import default_storage
import json
import csv
import pandas as pd

import numpy as np
from django.views.decorators.csrf import csrf_exempt
import pypyodbc as odbc
from django.shortcuts import render, HttpResponse
import re
import math

DRIVER = "SQL Server"
SERVER_NAME = "LAPTOP-H3TEL2C9\SQLEXPRESS"
DATABASE_NAME = "database1"


def connection_string(driver, server_name, db_name):
    conn_string = f"""
        DRIVER={{{driver}}};
        SERVER={server_name};
        DATABASE={db_name};
        Trust_Connection=yes;
    """
    return conn_string


try:
    conn = odbc.connect(connection_string(DRIVER, SERVER_NAME, DATABASE_NAME))
except odbc.DatabaseError as e:
    print("Database Error")
    print(str(e.value[1]))
except odbc.Error as e:
    print("Connection Error")
    print(str(e.value[1]))


def select_table_query(tableName):
    sql_select_all = f"""SELECT * FROM {tableName};"""
    return sql_select_all


def get_column_name(df):
    columns = []
    dataTypes = {}
    tableCols = []
    for columnName in df:
        tableColName = re.sub("[^0-9a-zA-Z]+", "_", columnName)
        tableColName = tableColName + tableColName[-1]
        columns.append(columnName)
        tableCols.append(tableColName)

        if df[columnName].dtype == "Int64":
            dataTypes[tableColName] = "NVARCHAR(MAX)"

        elif df[columnName].dtype == "string" or df[columnName].dtype == "boolean":
            dataTypes[tableColName] = "VARCHAR(MAX)"

        elif df[columnName].dtype == "datetime64[ns]":
            dataTypes[tableColName] = "DATETIME"

        elif df[columnName].dtype == "Float64":
            dataTypes[tableColName] = "FLOAT"

    return columns, dataTypes, tableCols


def get_all_tables():
    tableName = []
    cursor = conn.cursor()

    cursor.execute("SELECT table_name FROM information_schema.tables")
    for table_name in cursor:
        temp = str(table_name)
        temp = temp[2: len(temp) - 3]
        tableName.append(temp)
    cursor.commit()

    print("Got All Tables")
    cursor.close()
    return tableName


def create_table_query(tableName, dataTypes):
    sql_createTable = f"""
    CREATE TABLE dbo.{tableName} ("""

    for key in dataTypes:
        sql_createTable += f"""
            {key} {dataTypes[key]},"""

    sql_createTable = sql_createTable[: len(sql_createTable) - 1]

    sql_createTable += f"""
    );"""

    return sql_createTable


def insert_sql_query(tableName, columns):
    sql_insert = f"""
        INSERT INTO {tableName}("""

    for columnName in columns:
        sql_insert += f"""{columnName}, """

    sql_insert = sql_insert[: len(sql_insert) - 2]
    sql_insert += f""") VALUES ("""

    for columnName in columns:
        sql_insert += "?, "

    sql_insert = sql_insert[: len(sql_insert) - 2]
    sql_insert += ");"

    return sql_insert


def get_non_null_cols_and_record(columns, singleRec):
    new_cols = []
    new_singleRec = []
    i = 0
    for eachCol in singleRec:
        if not pd.isna(eachCol):
            new_cols.append(columns[i])
            new_singleRec.append(eachCol)
        i += 1

    return new_cols, new_singleRec


def getTables(request):
    returnObj = {}
    tables = get_all_tables()
    returnObj["status"] = True
    returnObj["data"] = tables

    return HttpResponse(json.dumps(returnObj), content_type="application/json")


def getTableData(request, tableName):
    jsonDataArray = []
    columns = []
    returnObj = {}
    print("Table Name is: " + tableName)
    sql_get_all_data = select_table_query(tableName)

    print(sql_get_all_data)

    cursor = conn.cursor()
    cursor.execute(sql_get_all_data)
    sql_table_data = cursor.fetchall()

    data = pd.DataFrame(sql_table_data)
    data = data.to_dict("split")

    columns = [i[0] for i in cursor.description]
    data = data["data"]

    for row in data:
        jsonData = {}
        i = 0
        for eachData in row:
            jsonData[columns[i]] = eachData
            i += 1
        jsonDataArray.append(jsonData)

    returnObj["status"] = True
    returnObj["data"] = jsonDataArray

    cursor.close()

    return HttpResponse(json.dumps(returnObj), content_type="application/json")


def sort_dataframe(df, sortColumn):
    if sortColumn == "All":
        sorted_df = df.apply(lambda col: pd.to_numeric(
            col, errors="coerce")).fillna(df)
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

    no_of_rows = request.GET.get('numRows')

    filtered_df = get_file_data(request, title, no_of_rows)
        
    
    # Tranformation Steps:

    if not len(transformationOptions) == 0:
        filtered_df = transform_dataframe(
            filtered_df, json.loads(transformationOptions), sortColumn)


    filtered_data = filtered_df.to_dict('records')
    
    for d in filtered_data:
        for key, value in d.items():
            if isinstance(value, float) and math.isnan(value):
                d[key] = None
                
    print(filtered_data)

    return JsonResponse({'result': filtered_data})



@api_view(['GET'])
def start_loading(request):
    string_array_str = request.GET.get('stringArray')
    tableName = request.GET.get('tableName')
    
    print("TableName: ",tableName)

    string_array = json.loads(string_array_str)

    df = pd.DataFrame(string_array)

    print(df)

    df = df.convert_dtypes()
    
    tableName = re.sub("[^0-9a-zA-Z]+", "_", tableName)

    columns, dataTypes, tableCols = get_column_name(df)

    df_data = df[columns]
    records = df_data.values.tolist()

    result = ""
    returnObj = {}
    ## * Cheching if table already exists *

    tables = get_all_tables()

    if tableName in tables:
        print("Yes it exists")
        result = "Table already Exists"
        returnObj["status"] = False
        returnObj["data"] = result

    else:
        ## * Creting the Table *
        sql_createTable = create_table_query(tableName, dataTypes)

        print(sql_createTable)
        cursor = conn.cursor()

        try:
            cursor.execute(sql_createTable)
            cursor.commit()

        except Exception as e:
            cursor.rollback()
            result = str(e)

        finally:
            print("Table is Created")

        ## * Inserting the Data *
        sql_insert = insert_sql_query(tableName, tableCols)
        print(sql_insert)
        try:
            for singleRecord in records:
                if pd.isna(singleRecord).sum() > 0:
                    new_cols, new_rec = get_non_null_cols_and_record(
                        tableCols, singleRecord
                    )
                    new_sql_insert = insert_sql_query(tableName, new_cols)
                    cursor.execute(new_sql_insert, new_rec)

                else:
                    cursor.execute(sql_insert, singleRecord)
                    cursor.commit()

            result = "Data Has been Loaded"

        except Exception as e:
            cursor.rollback()
            result = str(e)

        finally:
            if result == "Data Has been Loaded":
                returnObj["status"] = True
            else:
                returnObj["status"] = False

            returnObj["data"] = result
            cursor.close()

    return HttpResponse(json.dumps(returnObj), content_type="application/json")
