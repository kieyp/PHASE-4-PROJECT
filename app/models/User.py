from db import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ ='users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    contact = db.Column(db.String)
    email = db.Column(db.String(120), unique=True)
    password_hash = db.Column(db.String)
    
    # Establishing one-to-many relationship with comments
    comments = db.relationship('Comments', backref='user')
    
    def __init__(self, name, contact, email, password=None):
        self.name = name
        self.contact = contact
        self.email = email
        if password:
            self.set_password(password)
    
    def __repr__(self):
        return f'<User {self.name}, contact: {self.contact}>'
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        if self.password_hash is not None:
            # Password is hashed, use check_password_hash
            return check_password_hash(self.password_hash, password)
        else:
            # Password is not hashed, return False
            return False