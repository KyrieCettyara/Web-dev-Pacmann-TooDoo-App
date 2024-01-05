from main import db

# table database task
class Projects(db.Model):
    project_id = db.Column(db.Integer, primary_key = True)
    project_name = db.Column(db.String(100), nullable=False)
    project_desc = db.Column(db.String(1024))

    # fungsi serialize untuk mengembalikan data dictionary
    def serialize(self): 
        return {
            "project_id": self.project_id,
            "project_name": self.project_name,
            "project_desc":self.project_desc
        }