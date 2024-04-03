from faker import Faker
from models import Author, Article, User, Comments
from db import db  # Import 'app' from 'db' module
from app import app
fake = Faker()

def create_author():
    fullname = fake.name()
    username = fake.user_name()
    author = Author(fullname=fullname, username=username)
    db.session.add(author)
    db.session.commit()
    return author

def create_article(authors):
    title = fake.sentence()
    body = '\n\n'.join(fake.paragraphs(nb=5))  # Join paragraphs into a single string
    author = fake.random_element(authors)
    article = Article(title=title, body=body, authors=[author])
    db.session.add(article)
    db.session.commit()
    return article


def create_user():
    username = fake.user_name()
    email = fake.email()
    user = User(name=username, email=email)
    db.session.add(user)
    db.session.commit()
    return user

def create_comment(articles, users):
    text = fake.paragraph()
    article = fake.random_element(articles)
    user = fake.random_element(users)
    comment = Comments(text=text, article=article, user=user)
    db.session.add(comment)
    db.session.commit()

if __name__ == '__main__':
    with app.app_context():  # Use 'app.app_context()' instead of 'db.app.app_context()'
        db.create_all()
        
        authors = [create_author() for _ in range(5)]  # Create 5 authors
        articles = [create_article(authors) for _ in range(10)]  # Create 10 articles
        
        users = [create_user() for _ in range(20)]  # Create 20 users
        
        for _ in range(50):  # Create 50 comments
            create_comment(articles, users)

    print("Seed data inserted successfully.")
