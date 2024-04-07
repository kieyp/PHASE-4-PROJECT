from db import db
from models import Author, Article, User, Comments
from faker import Faker
from werkzeug.security import generate_password_hash
import random
from app import app

fake = Faker()

def clear_database():
    # Delete all existing data from the tables
    db.session.query(Comments).delete()
    db.session.query(Article).delete()
    db.session.query(User).delete()
    db.session.query(Author).delete()
    db.session.commit()

def create_author():
    fullname = fake.name()
    username = fake.user_name()
    password_hash = generate_password_hash(fake.password())  # Generate hashed password
    bio = fake.paragraph()
    location = fake.city()
    author = Author(fullname=fullname, username=username, password_hash=password_hash, bio=bio, location=location)
    db.session.add(author)
    db.session.commit()
    return author

def create_user():
    username = fake.user_name()
    email = fake.email()
    contact = fake.phone_number()  # Generate a fake phone number
    password = 'password123'  # Set a default password for simplicity
    user = User(name=username, contact=contact, email=email, password=password)
    db.session.add(user)
    db.session.commit()
    return user

def generate_technology_article_title():
    # Generate a random technology-related article title
    technology_keywords = ['technology', 'software', 'engineering', 'computer', 'development', 'programming']
    return fake.sentence(ext_word_list=technology_keywords)

def generate_article_body():
    # Generate a coherent and realistic article body
    num_paragraphs = random.randint(3, 7)
    article_body = ''
    for _ in range(num_paragraphs):
        paragraph = fake.paragraph(nb_sentences=random.randint(3, 7))
        article_body += paragraph + '\n\n'
    return article_body

def create_technology_article(authors):
    title = generate_technology_article_title()
    body = generate_article_body()
    
    # Create the article
    article = Article(title=title, body=body)
    
    # Associate the article with one or more authors
    num_authors = random.randint(1, 3)
    selected_authors = random.sample(authors, num_authors)
    article.authors.extend(selected_authors)
    
    # Add the article to the session and commit
    db.session.add(article)
    db.session.commit()
    
    return article

def create_comment(articles, users):
    text = fake.paragraph()
    article = random.choice(articles)
    user = random.choice(users)
    comment = Comments(text=text, article_id=article.id, user_id=user.id)
    db.session.add(comment)
    db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        clear_database()

        # Create authors
        authors = [create_author() for _ in range(20)]

        # Create users
        users = [create_user() for _ in range(20)]

        # Create technology articles
        articles = [create_technology_article(authors) for _ in range(20)]

        # Create comments
        for _ in range(50):
            create_comment(articles, users)

    print("Seed data inserted successfully.")
