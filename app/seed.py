from faker import Faker
from models import db,Author, Article, User, Comments
from app import app

fake = Faker()

def create_author():
    name = fake.name()
    bio = fake.text()
    author = Author(name=name, bio=bio)
    db.session.add(author)
    db.session.commit()
    return author

def create_article(authors):
    title = fake.sentence()
    comments = fake.text()
    body = fake.paragraph()
    author = fake.random_element(authors)
    article = Article(title=title, comments=comments, body=body, authors=[author])
    db.session.add(article)
    db.session.commit()
    return article

def create_user():
    name = fake.name()
    contact = fake.phone_number()
    email = fake.email()
    user = User(name=name, contact=contact, email=email)
    db.session.add(user)
    db.session.commit()
    return user

def create_comment(articles, users):
    text = fake.paragraph()
    article_id = fake.random_element(articles).id
    user_id = fake.random_element(users).id
    comment = Comments(text=text, article_id=article_id, user_id=user_id)
    db.session.add(comment)
    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        authors = [create_author() for _ in range(50)]  
        articles = [create_article(authors) for _ in range(200)]  
        
        users = [create_user() for _ in range(80)]  
        
        for _ in range(50):  
            create_comment(articles, users)

    print("Seed data inserted successfully.")
