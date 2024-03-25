from db import db

author_article_association = db.Table('author_article_association',
    db.Column('author_id', db.Integer, db.ForeignKey('authors.id')),
    db.Column('article_id', db.Integer, db.ForeignKey('articles.id'))
)
