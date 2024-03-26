from db import db

class User(db.Model):
    __tablename__ ='users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    contact = db.Column(db.String)  # Changed to String as it likely represents a phone number
    email = db.Column(db.String(120))  # Limited to 120 characters for email
    
    # Establishing one-to-many relationship with comments
    comments = db.relationship('Comments', backref='user')
    
    def __repr__(self):
        return f'<User {self.name}, contact: {self.contact}>'
