from flask_sqlalchemy import SQLAlchemy
from db import db

class Article(db.Model):
    __tablename__ = 'articles'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    body = db.Column(db.String)
    published_at = db.Column(db.DateTime, server_default=db.func.now())
    edited_at = db.Column(db.DateTime, onupdate=db.func.now())

    # Define the one-to-many relationship with comments
    comments = db.relationship('Comments', backref='article')

    def __repr__(self):
        return f'<Article {self.title}, published at {self.published_at}.>'
