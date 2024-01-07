from flask import Flask,jsonify, request
from models import get_user, get_all_project, get_undone_user_task, add_user_task, add_project
from models import get_task_byId, update_task_byId, delete_task_byId
from flask_cors import CORS



app = Flask(__name__)
CORS(app)

@app.route('/todoos', methods=['GET'])
def get_todoos():
    return jsonify({'toodos':"helloww"})

##get user based on username and password
@app.route('/user', methods=['POST'])
def get_user_route():
    data = request.get_json()
    username = data['username']
    password = data['password']
    result = get_user(username, password)
    response = {'results': result}
    return jsonify(response)

##get all project 
@app.route('/projects', methods=['GET'])
def get_projects_route():
    result = get_all_project()
    response = {'data':result}
    return jsonify(response)

##get task based on username
@app.route('/UndoneUserTask/<username>', methods=['GET'])
def get_undone_user_task_route(username):
    result = get_undone_user_task(username)
    response = {'data': result}
    return jsonify(response)

##get task based on task_id
@app.route('/UserTask/<task_id>', methods=['GET'])
def get_user_task_byId_route(task_id):
    result = get_task_byId(task_id)
    response = {'data': result}
    return jsonify(response)

##update task based on task_id
@app.route('/UserTask/<task_id>', methods=['PUT'])
def update_user_task_byId_route(task_id):
    data = request.get_json()
    task_name = data['task_name']
    task_desc = data['task_desc']
    username = data['username']
    undone = data['undone']
    print(data)
    result = update_task_byId(task_name,task_desc, username,undone,task_id)
    response = {'data': result}
    return jsonify(response)

##delete task based on task_id
@app.route('/UserTask/<task_id>', methods=['DELETE'])
def delete_user_task_byId_route(task_id):
    result = delete_task_byId(task_id)
    response = {'data': result}
    return jsonify(response)


##add new task
@app.route('/AddUserTask', methods=['POST'])
def get_add_user_task_route():
    data = request.get_json()
    task_name = data['task_name']
    task_desc = data['task_desc'] 
    project_id = data['project_id']
    username = data ['username']
    result = add_user_task(task_name, task_desc, project_id, username)
    response = {'data' :result}
    return jsonify(response)

##add new project
@app.route('/AddProject', methods=['POST'])
def get_add_project_route():
    data = request.get_json()
    project_name = data['project_name']
    project_desc = data['project_desc']
    result = add_project(project_name, project_desc)
    response = result
    return jsonify(response)

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=5000,debug=True)


