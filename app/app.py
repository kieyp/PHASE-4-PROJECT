from flask import Flask, jsonify
from flask_restful import Api, Resource, reqparse
from flask_migrate import Migrate
from models import Article, Author, Comments, User
from db import connection_string, db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = connection_string
api = Api(app)
db.init_app(app)

class AuthorsResource(Resource):
    def get(self):
        authors = Author.query.all()
        return jsonify([{'username': author.username, 'fullname': author.fullname} for author in authors])

class AuthorResource(Resource):
    def get(self, username):
        author = Author.query.filter_by(username=username).first()
        if author:
            return jsonify({'fullname': author.fullname, 'username': author.username})
        return jsonify({'message': 'Author not found'}), 404

class ArticlesResource(Resource):
    def get(self):
        articles = Article.query.all()
        return jsonify([{'title': article.title, 'body': article.body} for article in articles])

class ArticleResource(Resource):
    def get(self, article_id):
        article = Article.query.get(article_id)
        if article:
            return jsonify({'title': article.title, 'body': article.body})
        return jsonify({'message': 'Article not found'}), 404

class CommentsResource(Resource):
    def get(self):
        comments = Comments.query.all()
        return jsonify([{'text': comment.text} for comment in comments])

class CommentResource(Resource):
    def get(self, comment_id):
        comment = Comments.query.get(comment_id)
        if comment:
            return jsonify({'text': comment.text})
        return jsonify({'message': 'Comment not found'}), 404

class UsersResource(Resource):
    def get(self):
        users = User.query.all()
        return jsonify([{'name': user.name, 'contact': user.contact, 'email': user.email} for user in users])

class UserResource(Resource):
    def get(self, user_id):
        user = User.query.get(user_id)
        if user:
            return jsonify({'name': user.name, 'contact': user.contact, 'email': user.email})
        return jsonify({'message': 'User not found'}), 404

api.add_resource(AuthorsResource, '/authors')
api.add_resource(AuthorResource, '/authors/<username>')
api.add_resource(ArticlesResource, '/articles')
api.add_resource(ArticleResource, '/articles/<int:article_id>')
api.add_resource(CommentsResource, '/comments')
api.add_resource(CommentResource, '/comments/<int:comment_id>')
api.add_resource(UsersResource, '/users')
api.add_resource(UserResource, '/users/<int:user_id>')

if __name__ == '__main__':
    app.run(debug=True)
