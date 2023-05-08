from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
import pypyodbc as odbc



def connection_string(driver, server_name, db_name):
    conn_string = f"""
        DRIVER={{{driver}}};
        SERVER={server_name};
        DATABASE={db_name};
        Trust_Connection=yes;
    """
    return conn_string
    
    
class MSSQLAuthBackend(ModelBackend):
    def authenticate(self, request, username = None, password = None, **kwargs):
        UserModel = get_user_model()
        
        DRIVER = "SQL Server"
        SERVER_NAME = "LAPTOP-H3TEL2C9\SQLEXPRESS"
        DATABASE_NAME = "database1"
        
        conn = odbc.connect(connection_string(DRIVER, SERVER_NAME, DATABASE_NAME))

        try:
            cursor = conn.cursor()
            cursor.execute(f'''SELECT * FROM RegisterTable WHERE username='{username}' AND password='{password}';''')
            row = cursor.fetchall()
            
            print("Row data: ", row)
            if row:
                User = get_user_model()
                user = User.objects.get(username= username)
                return user

        except Exception as e:
            print(e)
            return None
        
        conn.close()