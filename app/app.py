from flask_migrate import Migrate
from flask import Flask,request,jsonify,make_response  
from flask_sqlalchemy import SQLAlchemy
from models import db,Author,Article,Comments,User 



app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


migrate=Migrate(app,db)
db.init_app(app)

@app.route('/')
def home():
    return "Welcome TO TECH2DAY Back-End"

# @app.route('/authors', methods=['GET','POST'])
# def authors():
#     authors=Author.query.all.first()
    
#     if request.method == "GET":
#         response_dict = [author.to_dict() for author in authors]
        
#         response = make_response(jsonify(response_dict),200)
#         return response
    

if __name__ == '__main__':
    app.run(port=5555,debug=True)