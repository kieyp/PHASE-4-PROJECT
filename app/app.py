from flask_migrate import Migrate
from flask import Flask
from models import Articles,Author,author_article_association
from db import connection_string,db


app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']=connection_string

migrate=Migrate(app,db)
db.init_app(app)



if __name__ == '__main__':
    app.run(port=5555,debug=True)