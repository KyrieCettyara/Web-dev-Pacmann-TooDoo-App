from connection import client, db
import psycopg2

##get a user
def get_user(username, password):
   
    try:
        db.execute(
            "SELECT username FROM users WHERE username = %s and password = %s", (username, password))
        data = db.fetchone()

        if data != None:
            return data
        else:
            return "User tidak ditemukan. Pastikan kombinasi username dan password sudah benar."

    except psycopg2.Error as e:
        print("Error: ", e)
        return False
    
##get all projects
def get_all_project():
    try:
        query = """SELECT * FROM projects"""
        db.execute(query)
        data = db.fetchall()

        if data != None:
            return project_format(data) 
        else:
            return "User tidak ditemukan. Pastikan kombinasi username dan password sudah benar."

    except psycopg2.Error as e:
        print("Error: ", e)
        return False


def get_undone_user_task(username):
    try:
        db.execute(
            """SELECT * FROM tasks WHERE username = %s""", (username,))
        data = db.fetchall()

        if data != None:
            return task_format(data)
        else:
            return "Task kosong."
        
    except psycopg2.Error as e:
        print("Error: ", e)
        return False

def get_task_byId(task_id):
    try:
        db.execute(
            """SELECT * FROM tasks WHERE task_id = %s """, (task_id,))
        data = db.fetchall()

        if data != None:
            return task_format(data)
        else:
            return "Task tidak ditemukan."
        
    except psycopg2.Error as e:
        print("Error: ", e)
        return False

def update_task_byId(task_name,task_desc, username,task_id):
    try:
        query = """UPDATE tasks SET task_name = %s , task_desc = %s , username = %s WHERE task_id = %s"""
        insert_data = (task_name,task_desc, username,task_id,)
        db.execute(query,insert_data)
        client.commit()
        data = db.rowcount
        print(data)

        if data == 1:
            result ="Berhasil diubah"
            return data 
        else:
            result ="Task tidak ditemukan."
            return data
        
    except psycopg2.Error as e:
        print("Error: ", e)
        return False

def delete_task_byId(task_id):
    try:
        db.execute(
            """DELETE FROM tasks WHERE task_id = %s """, (task_id,))
        client.commit()
        
        return db.rowcount
        
    except psycopg2.Error as e:
        print("Error: ", e)
        return False

def get_done_user_task(username):
    try:
        query = """SELECT * FROM tasks WHERE username = %s AND undone = 'N'"""
        insert_data = (username,)
        db.execute(query,insert_data)
        data = db.fetchall()
        if data != None:
            return task_format(data)
        else:
            return "Task kosong."

    except psycopg2.Error as e:
        print("Error: ", e)
        return False

def get_undone_user_task_byproject(username, project):
    try:
        query = """SELECT * FROM tasks WHERE username = %s AND undone = 'Y' AND project_id = %s"""
        insert_data = (username, project)
        db.execute(query,insert_data)
        data = db.fetchall()
        if data != None:
            return task_format(data)
        else:
            return "Task kosong."
        
    except psycopg2.Error as e:
        print("Error: ", e)
        return False

def get_done_user_task_byproject(username, project):
    try:
        query = """SELECT * FROM tasks WHERE username = %s AND undone = 'N'  AND project_id = %s """
        insert_data = (username,project)
        db.execute(query,insert_data)
        data = db.fetchall()
        if data != None:
            return task_format(data)
        else:
            return "Task kosong."

    except psycopg2.Error as e:
        print("Error: ", e)
        return False

def add_user_task(task_name, task_desc, project_id, username):
    try:
        query = """INSERT INTO tasks (task_name, task_desc, project_id, username, undone) VALUES(%s,%s,%s,%s,'Y')"""
        insert_data = (task_name, task_desc, project_id, username)
        db.execute(query,insert_data)
        client.commit()
        data = db.fetchall()

        if data != None:
            return task_format(data)
        else:
            return "Task kosong."

    except psycopg2.Error as e:
        print("Error: ", e)
        return False

def add_project(project_name, project_desc):
    try:
        query = """INSERT INTO projects (project_name, project_desc) VALUES(%s,%s)"""
        insert_data = (project_name, project_desc)
        db.execute(query,insert_data)
        client.commit()
        data = db.fetchone()

        if data != None:
            return data
        else:
            return "Project kosong."

    except psycopg2.Error as e:
        print("Error: ", e)
        return False


def project_format(projects):
    return [{
        'project_id' : project['project_id'],
        'project_name' : project['project_name'],
        'project_desc' : project['project_desc']
    } for project in projects]

def task_format(tasks):
    return [{
        'task_id' : task['task_id'],
        'task_name' : task['task_name'],
        'task_desc' : task['task_desc'],
        'project_id' : task['project_id'],
        'username' : task['username']
    } for task in tasks]
           

