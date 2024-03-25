from db import db  # Assuming db is correctly imported from your Flask application
from .associations import author_article_association

class Author(db.Model):
    __tablename__ ='authors'
    
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String)
    username = db.Column(db.String, unique=True)
    
    # Define the relationship with Article using the association table
    articles = db.relationship('Article', secondary=author_article_association, backref='authors')

    def __repr__(self):
        return f'<Author {self.fullname}, username: {self.username}>'
