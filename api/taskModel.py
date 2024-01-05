from main import db

# table database task
class Tasks(db.Model):
    task_id = db.Column(db.Integer, primary_key = True)
    task_name = db.Column(db.String(100), nullable=False)
    task_desc = db.Column(db.String(1024))
    undone = db.Column(db.String(1), default = 'Y')
    username = db.Column(db.Integer, db.ForeignKey('users.username'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.project_id'))

    # fungsi serialize untuk mengembalikan data dictionary
    def serialize(self): 
        return {
            "task_id": self.task_id,
            "task_name": self.task_name,
            "task_desc":self.task_desc,
            "undone": self.undone,
            "username":self.username,
            "project_id":self.project_id
        }