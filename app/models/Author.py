from db import db  # Assuming db is correctly imported from your Flask application
from .associations import author_article_association
from werkzeug.security import generate_password_hash, check_password_hash

class Author(db.Model):
    __tablename__ ='authors'
    
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String)
    username = db.Column(db.String, unique=True)
    email = db.Column(db.String, unique=True)
    password_hash = db.Column(db.String)
    bio = db.Column(db.Text)
    location = db.Column(db.String)
    
    # Define the relationship with Article using the association table
    articles = db.relationship('Article', secondary=author_article_association, backref='authors')

    def __repr__(self):
        return f'<Author {self.fullname}, username: {self.username}>'

    def set_password(self, password):
        """
        Generate and set the password hash for the author.
        """
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """
        Check if the provided password matches the stored password hash.
        """
        return check_password_hash(self.password_hash, password)
