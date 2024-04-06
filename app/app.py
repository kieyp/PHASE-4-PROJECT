from flask import Flask, jsonify,request
from flask_restful import Api, Resource, reqparse
from flask_migrate import Migrate
from models import Article, Author, Comments, User
from db import connection_string, db
from sqlalchemy.orm import joinedload


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = connection_string
api = Api(app)
db.init_app(app)




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

        articles = Article.query.options(joinedload(Article.comments).joinedload(Comments.user))\
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
    
    

    def delete(self, article_id):
        article = Article.query.get(article_id)
        if article:
            db.session.delete(article)
            db.session.commit()
            return jsonify({'message': 'Article deleted successfully'})
        return jsonify({'message': 'Article not found'}), 404

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

    def delete(self, comment_id):
        comment = Comments.query.get(comment_id)
        if comment:
            db.session.delete(comment)
            db.session.commit()
            return jsonify({'message': 'Comment deleted successfully'})
        return jsonify({'message': 'Comment not found'}), 404

    def patch(self, comment_id):
        data = request.json
        comment = Comments.query.get(comment_id)
        if comment:
            comment.text = data.get('text', comment.text)
            db.session.commit()
            return jsonify({'message': 'Comment updated successfully'})
        return jsonify({'message': 'Comment not found'}), 404
    
class UsersResource(Resource):
    def get(self):
        users = User.query.all()
        return jsonify([{'name': user.name, 'contact': user.contact, 'email': user.email} for user in users])

    def post(self):
        data = request.json
        user = User(name=data['name'], contact=data['contact'], email=data['email'])
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'})

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
    
    

api.add_resource(HomePage, '/')
api.add_resource(ArticlesResource, '/articles')
api.add_resource(ArticleResource, '/articles/<int:article_id>')
api.add_resource(CommentsResource, '/comments')
api.add_resource(CommentResource, '/comments/<int:comment_id>')
api.add_resource(UsersResource, '/users')
api.add_resource(UserResource, '/users/<int:user_id>')
api.add_resource(AuthorsResource, '/authors')
api.add_resource(AuthorResource, '/authors/<string:username>')





if __name__ == '__main__':
    app.run(port=5555,debug=True)
