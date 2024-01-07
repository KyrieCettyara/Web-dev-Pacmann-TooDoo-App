# Web Dev Project Pacmann Todo APp
 
## Backgroud
 Final project untuk course Fundamental Web Development. Pada project ini siswa diminta untuk membuat aplikasi Todo App sederhana untuk dapat memantau kinerja dari karyawan.  


## Program Description
Dalam aplikasi web sederhana ini dapat pengguna dapat melakukan login, melihat list dari task, menambahkan task, menghapus task, mengedit task, dan menambahkan project.

![alt text](https://github.com/KyrieCettyara/Web-dev-Pacmann-TooDoo-App/blob/main/image/Flow%20Chart.jpg)


User dapat masuk menggunakan username dan password yang dimiliki. User akan diarahkan ke landing page, pada halaman ini user dapat menambahkan task, mengedit task ataupun menghapus task yang telah ditambahkan. User juga dapat menambahkan project.


![alt text](https://github.com/KyrieCettyara/Web-dev-Pacmann-TooDoo-App/blob/main/image/ERD.png)    

Aplikasi ini memiliki 3 table yaitu table users, projects, dan tasks.
Table users menyimpan data user, table projecs menyimpan data project, dan table tasks menyimpan data tasks. 

~~~
##get user task
def get_undone_user_task(username):
    try:
        query = """SELECT 
        tasks.task_id 
	        , tasks.task_name 
	        , tasks.task_desc 
	        , tasks.username 
	        , tasks.undone 
	        , tasks.project_id 
            , projects.project_name
        FROM tasks 
        JOIN projects USING(project_id)
        WHERE username = %s"""
        insert_data = (username,)
        db.execute(query,insert_data)
        data = db.fetchall()

        if data != None:
            return comp_task_format(data)
        else:
            return "Task kosong."
        
    except psycopg2.Error as e:
        print("Error: ", e)
        return False
~~~
Pada aplikasi ini digunakan psycopg2 untuk melakukan koneksi dengan posgresql. 

Pada file models.py tersimpan semua function untuk mengambil, menghapus, maupun mengubah data dalam dabase. 
Function get_undone_user_task() diatas akan mengambil semua project yang ada didalam database. execute() digunakan untuk mengeksekusi database operation atau queery.
Kemudian fetchall() digunakan untuk mengambil row result.
Function get_undone_user_task() akan mengembalikan nilai dari query dengan format yang di buat dalam function comp_task_format()

~~~
##get task based on username
@app.route('/UndoneUserTask/<username>', methods=['GET'])
def get_undone_user_task_route(username):
    result = get_undone_user_task(username)
    response = {'data': result}
    return jsonify(response)

~~~
Pada file main.py tersimpan semua route yang digunakan. Pada file ini akan dipetakan URL dan function yang telah dibuat sebelumnya. 

Pada potongan code diatas, URL /UndoneUserTask dengan method GET dipetakan dengan function get_undone_user_task(). Sehingga ketika URL /UndoneUserTask dengan method GET digunakan, semua task yang ada di database akan di get dan di return dalam bentuk JSON object.

~~~
const xhr = new XMLHttpRequest();
const url = API_HOST +"/UndoneUserTask/"+ username

xhr.open("GET", url, true)
    xhr.onreadystatechange = function(){
        if(this.readyState == 4 & this.status == 200){
            const tasks = JSON.parse(this.response)
            //do something
        }
    }
~~~
Untuk meng-consume API yang sudah dibuat, dimanfaatkan XMLHttpRequest(). Pertama, dilakukan instansiasi variable xhr. Kemuadian menggunakan xhr gunakan method open() untuk menentukan method('GET','POST','DEL','PUT'), url yang akan di-consume, dan parameter async. 

onreadystatechange() merupakan callback function yang akan dipanggil ketika readyState bernilai 4 (request telah selesai) dan statusnya adalah 200 (OK).


## Test Case
1. Login

![alt text](https://github.com/KyrieCettyara/Web-dev-Pacmann-TooDoo-App/blob/main/image/gambar1.png)

2. Landing Page

![alt text](https://github.com/KyrieCettyara/Web-dev-Pacmann-TooDoo-App/blob/main/image/gambar11.png)

3. Add Project

![alt text](https://github.com/KyrieCettyara/Web-dev-Pacmann-TooDoo-App/blob/main/image/gambar2.png)

4. Add Task

![alt text](https://github.com/KyrieCettyara/Web-dev-Pacmann-TooDoo-App/blob/main/image/gambar10.png)
![alt text](https://github.com/KyrieCettyara/Web-dev-Pacmann-TooDoo-App/blob/main/image/gambar3.png)
![alt text](https://github.com/KyrieCettyara/Web-dev-Pacmann-TooDoo-App/blob/main/image/gambar4.png)

5. Edit Task

![alt text](https://github.com/KyrieCettyara/Web-dev-Pacmann-TooDoo-App/blob/main/image/gambar12.png)
![alt text](https://github.com/KyrieCettyara/Web-dev-Pacmann-TooDoo-App/blob/main/image/gambar6.png)
![alt text](https://github.com/KyrieCettyara/Web-dev-Pacmann-TooDoo-App/blob/main/image/gambar7.png)

6. Delete Task

![alt text](https://github.com/KyrieCettyara/Web-dev-Pacmann-TooDoo-App/blob/main/image/gambar8.png)
![alt text](https://github.com/KyrieCettyara/Web-dev-Pacmann-TooDoo-App/blob/main/image/gambar9.png)

7. Mark Task as Done

![alt text](https://github.com/KyrieCettyara/Web-dev-Pacmann-TooDoo-App/blob/main/image/gambar4.png)
![alt text](https://github.com/KyrieCettyara/Web-dev-Pacmann-TooDoo-App/blob/main/image/gambar5.png)


