

from flask import Flask, jsonify, request, redirect
from flask_restful import Api, Resource
from flask_migrate import Migrate
from models import Article, Author, Comments, User
from db import connection_string, db
from sqlalchemy.orm import joinedload
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import secrets

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = connection_string
app.config['SECRET_KEY'] = secrets.token_hex(32)

api = Api(app)
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)


class HomePage(Resource):
    def get(self):
        return {'message': 'Welcome to TECH2DAY Back-End'}

class AuthorsResource(Resource):
    def get(self):
        authors = Author.query.all()
        # Ensure that 'authors' is a list of dictionaries with JSON-serializable data
        return jsonify([{'username': author.username, 'fullname': author.fullname} for author in authors])

    def post(self):
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided in the request body'}), 400

        # Extract all fields from the request data
        username = data.get('username')
        fullname = data.get('fullname')
        bio = data.get('bio')
        contact = data.get('contact')
        location = data.get('location')

        # Check if the username already exists
        existing_author = Author.query.filter_by(username=username).first()
        if existing_author:
            return jsonify({'error': 'Username already exists'}), 400

        # Create a new Author instance with all fields
        author = Author(
            username=username,
            fullname=fullname,
            bio=bio,
            contact=contact,
            location=location
        )
        db.session.add(author)

        try:
            db.session.commit()
            return jsonify({'message': 'Author created successfully'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': f'Failed to create author: {str(e)}'}), 500



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
        current_user_id = get_jwt_identity()
        article = Article.query.get(article_id)
        if not article:
            return jsonify({'message': 'Article not found'}), 404
        if article.author_id != current_user_id:
            return jsonify({'message': 'You are not authorized to delete this article'}), 403
        db.session.delete(article)
        db.session.commit()
        return jsonify({'message': 'Article deleted successfully'})
    
    
    @jwt_required()
    def patch(self, article_id):
        current_user_id = get_jwt_identity()
        data = request.json
        article = Article.query.get(article_id)
        if not article:
            return jsonify({'message': 'Article not found'}), 404
        if article.author_id != current_user_id:
            return jsonify({'message': 'You are not authorized to edit this article'}), 403
        article.title = data.get('title', article.title)
        article.body = data.get('body', article.body)
        db.session.commit()
        return jsonify({'message': 'Article updated successfully'})


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
    
    
    
class AuthorLoginResource(Resource):
    def post(self):
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return {'message': 'Email and password are required'}, 400

        author = Author.query.filter_by(email=email).first()

        if not author:
            return {'message': 'Author not found'}, 404

        if author.password_hash:
            if not author.check_password(password):
                return {'message': 'Invalid password'}, 401
        else:
            if author.password != password:
                return {'message': 'Invalid password'}, 401

        access_token = create_access_token(identity=author.id, additional_claims={"username": author.username})

        return {'message': 'Author login successful', 'access_token': access_token}, 200


class AuthorRegistrationResource(Resource):
    def post(self):
        data = request.json
        fullname = data.get('fullname')
        username=data.get('username')
        email = data.get('email')
        password = data.get('password')
        bio = data.get('bio')
        location = data.get('location')

        existing_author = Author.query.filter_by(email=email).first()
        if existing_author:
            return {'message': 'Email is already registered'}, 400

        new_author = Author(fullname=fullname,username=username, email=email, bio=bio, location=location)
        new_author.set_password(password)

        db.session.add(new_author)
        db.session.commit()

        return {'message': 'Author registered successfully'}, 201

api.add_resource(AuthorRegistrationResource, '/author/register')
api.add_resource(HomePage, '/')
api.add_resource(ArticlesResource, '/articles')
api.add_resource(ArticleResource, '/articles/<int:article_id>')
api.add_resource(CommentsResource, '/comments')
api.add_resource(CommentResource, '/comments/<int:comment_id>')
api.add_resource(AuthorsResource, '/authors')
api.add_resource(AuthorResource, '/authors/<string:username>')
api.add_resource(LoginResource, '/login')
api.add_resource(RegisterResource, '/register')
api.add_resource(ArticlesCommentsResource, '/articles/<int:article_id>/comments')
api.add_resource(UserDataResource, '/api/user')
api.add_resource(ArticlesDataResource, '/articleslist')
api.add_resource(AuthorLoginResource, '/author-login')



if __name__ == '__main__':
    app.run(port=5555, debug=True)
