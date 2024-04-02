from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db =SQLAlchemy()

author_article_association = db.Table('author_article_association',
    db.Column('author_id', db.Integer, db.ForeignKey('authors.id')),
    db.Column('article_id', db.Integer, db.ForeignKey('articles.id'))
)

class Author(db.Model):
    __tablename__ ='authors'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    bio = db.Column(db.String, unique=True)
    
    
    articles = db.relationship('Article', secondary=author_article_association, backref='authors')

    def __repr__(self):
        return f'<Author {self.name}, Bio: {self.bio}>'


class Article(db.Model):
    __tablename__ ='articles'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    comments = db.Column(db.String)  # Change to lowercase
    body = db.Column(db.String)
    published_at = db.Column(db.DateTime, server_default=db.func.now())
    edited_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    
    article_comments = db.relationship('Comments', backref='article')  # Change backref to 'article'

    def __repr__(self):
        return f'<Article {self.title}, published at {self.published_at}.>'


class Comments(db.Model):
    __tablename__ ='comments'
    
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text)  # Use Text type for longer text fields
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # ForeignKey constraint
    article_id = db.Column(db.Integer, db.ForeignKey('articles.id'), nullable=False)
    
    
    def __repr__(self):
        return f'<Comment {self.text}, User ID {self.user_id}, Article ID {self.article_id}>'


class User(db.Model):
    __tablename__ ='users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    contact = db.Column(db.String)
    email = db.Column(db.String)
    
    # Define one-to-many relationship with Comments
    user_comments = db.relationship('Comments', backref='users')

    def __repr__(self):
        return f'<User {self.name}, contact: {self.contact}>'
