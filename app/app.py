

from flask import Flask, jsonify, request, redirect
from flask_restful import Api, Resource
from flask_migrate import Migrate
from models import Article, Author, Comments, User
from db import connection_string, db
from sqlalchemy.orm import joinedload
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
from werkzeug.security import check_password_hash,generate_password_hash
# from flask_cors import CORS

=======
>>>>>>> be3f550 (Update on Articles Resource)
=======
from flask_jwt_extended import JWTManager,jwt_required,create_access_token,get_jwt_identity
import secrets
secret_key = secrets.token_hex(32)
>>>>>>> e7623f4 (Modifications on all the code)

=======
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import secrets
>>>>>>> 686b9b9 (updated Blog list)

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = connection_string
app.config['SECRET_KEY'] = secrets.token_hex(32)

api = Api(app)
db.init_app(app)
<<<<<<< HEAD

<<<<<<< HEAD
migrate=Migrate(app,db)
# CORS(app)
=======


migrate=Migrate(app,db)
=======
migrate = Migrate(app, db)
>>>>>>> 686b9b9 (updated Blog list)
jwt = JWTManager(app)

>>>>>>> e7623f4 (Modifications on all the code)

class HomePage(Resource):
    def get(self):
        return {'message': 'Welcome to TECH2DAY Back-End'}


class AuthorsResource(Resource):
    def get(self):
        authors = Author.query.all()
        return jsonify([{'username': author.username, 'fullname': author.fullname} for author in authors])

    def post(self):
        data = request.json
        author = Author(username=data['username'], fullname=data['fullname'])
        db.session.add(author)
        db.session.commit()
        return jsonify({'message': 'Author created successfully'})


class AuthorResource(Resource):
    def get(self, username):
        author = Author.query.filter_by(username=username).first()
        if author:
            return jsonify({'fullname': author.fullname, 'username': author.username})
        return jsonify({'message': 'Author not found'}), 404

    def delete(self, username):
        author = Author.query.filter_by(username=username).first()
        if author:
            db.session.delete(author)
            db.session.commit()
            return jsonify({'message': 'Author deleted successfully'})
        return jsonify({'message': 'Author not found'}), 404

    def patch(self, username):
        data = request.json
        author = Author.query.filter_by(username=username).first()
        if author:
            author.fullname = data.get('fullname', author.fullname)
            db.session.commit()
            return jsonify({'message': 'Author updated successfully'})
        return jsonify({'message': 'Author not found'}), 404


class ArticlesResource(Resource):

    def get(self):
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        articles = Article.query.options(joinedload(Article.comments).joinedload(Comments.user)) \
            .paginate(page=page, per_page=per_page)

        articles_data = []
        for article in articles.items:
            article_data = {
                'id': article.id,
                'title': article.title,
                'body': article.body,
                'comments': [
                    {
                        'id': comment.id,
                        'text': comment.text,
                        'user': {
                            'id': comment.user.id,
                            'name': comment.user.name,
                            'contact': comment.user.contact,
                            'email': comment.user.email
                        }
                    } for comment in article.comments
                ]
            }
            articles_data.append(article_data)

        return jsonify({
            'articles': articles_data,
            'total_pages': articles.pages
        })

    @jwt_required()
    def post(self):
        data = request.json
        article = Article(title=data['title'], body=data['body'])
        db.session.add(article)
        db.session.commit()
        return jsonify({'message': 'Article created successfully'})


class ArticleResource(Resource):
    def get(self, article_id):
        article = Article.query.get(article_id)
        if article:
            return jsonify({'title': article.title, 'body': article.body})
        return jsonify({'message': 'Article not found'}), 404

    @jwt_required()
    def delete(self, article_id):
        article = Article.query.get(article_id)
        if article:
            db.session.delete(article)
            db.session.commit()
            return jsonify({'message': 'Article deleted successfully'})
        return jsonify({'message': 'Article not found'}), 404

    @jwt_required()
    def patch(self, article_id):
        data = request.json
        article = Article.query.get(article_id)
        if article:
            article.title = data.get('title', article.title)
            article.body = data.get('body', article.body)
            db.session.commit()
            return jsonify({'message': 'Article updated successfully'})
        return jsonify({'message': 'Article not found'}), 404


class CommentsResource(Resource):
    def get(self):
        comments = Comments.query.all()
        return jsonify([{'text': comment.text} for comment in comments])

    @jwt_required()
    def post(self):
        data = request.json
        comment = Comments(text=data['text'])
        db.session.add(comment)
        db.session.commit()
        return jsonify({'message': 'Comment created successfully'})


class CommentResource(Resource):
    def get(self, comment_id):
        comment = Comments.query.get(comment_id)
        if comment:
            return jsonify({'text': comment.text})
        return jsonify({'message': 'Comment not found'}), 404

    @jwt_required()
    def delete(self, comment_id):
        comment = Comments.query.get(comment_id)
        if comment:
            db.session.delete(comment)
            db.session.commit()
            return jsonify({'message': 'Comment deleted successfully'})
        return jsonify({'message': 'Comment not found'}), 404

    @jwt_required()
    def patch(self, comment_id):
        data = request.json
        comment = Comments.query.get(comment_id)
        if comment:
            comment.text = data.get('text', comment.text)
            db.session.commit()
            return jsonify({'message': 'Comment updated successfully'})
        return jsonify({'message': 'Comment not found'}), 404


<<<<<<< HEAD
class UserResource(Resource):
    def get(self, user_id):
        user = User.query.get(user_id)
        if user:
            return jsonify({'name': user.name, 'contact': user.contact, 'email': user.email})
        return jsonify({'message': 'User not found'}), 404

    def delete(self, user_id):
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return jsonify({'message': 'User deleted successfully'})
        return jsonify({'message': 'User not found'}), 404

    def patch(self, user_id):
        data = request.json
        user = User.query.get(user_id)
        if user:
            user.name = data.get('name', user.name)
            user.contact = data.get('contact', user.contact)
            user.email = data.get('email', user.email)
            db.session.commit()
            return jsonify({'message': 'User updated successfully'})
        return jsonify({'message': 'User not found'}), 404
    
class LoginResource(Resource):
    def post(self):
        data = request.json  # Assuming the request contains JSON data
        email = data.get('email')
        password = data.get('password')

        # Check if email and password are provided
        if not email or not password:
            return {'message': 'Email and password are required'}, 400

        # Query the database to find the user by email
        user = User.query.filter_by(email=email).first()

        # If user not found, return error message
        if not user:
            return {'message': 'User not found'}, 404

        # If the user has a password hash stored
        if user.password_hash:
            # Check if the provided password matches the stored password hash
            if not user.check_password(password):
                return {'message': 'Invalid password'}, 401
        else:
            # If password is not hashed, directly compare with stored password
            if user.password != password:
                return {'message': 'Invalid password'}, 401

        # If email and password are correct, return success message
        return {'message': 'Login successful'}, 200

class RegisterResource(Resource):
    def post(self):
        # Parse JSON data from request
        data = request.json
        name = data.get('name')
        contact = data.get('contact')
        email = data.get('email')
        password = data.get('password')

        # Check if the email is already registered
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return {'message': 'Email is already registered'}, 400

        # Create a new user object
        new_user = User(name=name, contact=contact, email=email)
        new_user.set_password(password)  # Hash the password

        # Add the new user to the database
        db.session.add(new_user)
        db.session.commit()

        return {'message': 'User registered successfully'}, 201

class ArticlesCommentsResource(Resource):
    def post(self, article_id):
        data = request.json
        text = data.get('text')
        if not text:
            return jsonify({'message': 'Text is required for creating a comment'}), 400

        # Extract user information from headers
        user_id = request.headers.get('user_id')  # Assuming the header contains the user ID

        # Check if user_id is provided in headers
        if not user_id:
            return jsonify({'message': 'User ID is required in headers'}), 400

        # Assuming you want to associate the comment with the specified article_id
        article = Article.query.get(article_id)
        if not article:
            return jsonify({'message': 'Article not found'}), 404

        # Associate user_id with the comment
        comment = Comments(text=text, article_id=article_id, user_id=user_id)

        db.session.add(comment)
        db.session.commit()

        # Return a JSON response indicating success
        return jsonify({'message': 'Comment created successfully'})

    
    
    
=======
>>>>>>> 686b9b9 (updated Blog list)
class LoginResource(Resource):
    def post(self):
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return {'message': 'Email and password are required'}, 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return {'message': 'User not found'}, 404

        if user.password_hash:
            if not user.check_password(password):
                return {'message': 'Invalid password'}, 401
        else:
            if user.password != password:
                return {'message': 'Invalid password'}, 401

        access_token = create_access_token(identity=user.id, additional_claims={"name": user.name})

        return {'message': 'Login successful', 'access_token': access_token}, 200


class RegisterResource(Resource):
    def post(self):
        data = request.json
        name = data.get('name')
        contact = data.get('contact')
        email = data.get('email')
        password = data.get('password')

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return {'message': 'Email is already registered'}, 400

        new_user = User(name=name, contact=contact, email=email)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        return {'message': 'User registered successfully'}, 201


class ArticlesCommentsResource(Resource):
    @jwt_required()
    def post(self, article_id):
        current_user_id = get_jwt_identity()
        data = request.json
        text = data.get('text')

        if not text:
            return jsonify({'message': 'Text is required for creating a comment'}), 400

        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404

        article = Article.query.get(article_id)
        if not article:
            return jsonify({'message': 'Article not found'}), 404

        comment = Comments(text=text, article_id=article_id, user_id=current_user_id)

        db.session.add(comment)
        db.session.commit()

        return jsonify({'message': 'Comment created successfully', 'user_name': user.name})


class UserDataResource(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if user:
            return jsonify({'name': user.name, 'contact': user.contact, 'email': user.email})
        return jsonify({'message': 'User not found'}), 404

# class ArticlesDataResource(Resource):
#     def get(self):
#         articles = Article.query.all()
#         articles_data = []

#         for article in articles:
#             article_data = {
#                 'id': article.id,
#                 'title': article.title,
#                 'body': article.body,
#                 'comments': []
#             }
#             for comment in article.comments:
#                 comment_data = {
#                     'id': comment.id,
#                     'text': comment.text,
#                     'user': {  # Include user information for the commenter
#                         'id': comment.user.id,
#                         'name': comment.user.name,
#                         'contact': comment.user.contact,
#                         'email': comment.user.email
#                     }
#                 }
#                 article_data['comments'].append(comment_data)
#             articles_data.append(article_data)

#         return jsonify(articles_data)

class ArticlesDataResource(Resource):
    def get(self):
        articles = Article.query.all()
        articles_data = []

        for article in articles:
            article_data = {
                'id': article.id,
                'title': article.title,
                'body': article.body,
                'authors': [author.fullname for author in article.authors],  # Access the fullname of all authors
                'comments': []
            }
            for comment in article.comments:
                comment_data = {
                    'id': comment.id,
                    'text': comment.text,
                    'user': {  # Include user information for the commenter
                        'id': comment.user.id,
                        'name': comment.user.name,
                        'contact': comment.user.contact,
                        'email': comment.user.email
                    }
                }
                article_data['comments'].append(comment_data)
            articles_data.append(article_data)

        return jsonify(articles_data)



api.add_resource(HomePage, '/')
api.add_resource(ArticlesResource, '/articles')
api.add_resource(ArticleResource, '/articles/<int:article_id>')
api.add_resource(CommentsResource, '/comments')
api.add_resource(CommentResource, '/comments/<int:comment_id>')
api.add_resource(AuthorsResource, '/authors')
api.add_resource(AuthorResource, '/authors/<string:username>')
api.add_resource(LoginResource, '/login')
api.add_resource(RegisterResource, '/register')
<<<<<<< HEAD
<<<<<<< HEAD
api.add_resource(ArticlesCommentsResource, '/articles/<int:article_id>/comments')

=======
>>>>>>> e7623f4 (Modifications on all the code)




if __name__ == '__main__':
    app.run(port=5555,debug=True)
=======
api.add_resource(ArticlesCommentsResource, '/articles/<int:article_id>/comments')
api.add_resource(UserDataResource, '/api/user')
api.add_resource(ArticlesDataResource, '/articleslist')



if __name__ == '__main__':
    app.run(port=5555, debug=True)
>>>>>>> 686b9b9 (updated Blog list)
