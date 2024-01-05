from main import db

# table database user
class Users(db.Model):
    username = db.Column(db.String(10), primary_key=True)

    # fungsi serialize untuk mengembalikan data dictionary
    def serialize(self): 
        return {
            "username": self.username
        }