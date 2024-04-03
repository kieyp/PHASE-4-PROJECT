from db import db

class Comments(db.Model):
    __tablename__ ='comments'
    
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # ForeignKey constraint
    article_id = db.Column(db.Integer, db.ForeignKey('articles.id'), nullable=False)  # ForeignKey constraint

    
    def __repr__(self):
        return f'<Comment {self.text}, User ID {self.user_id}, Article ID {self.article_id}>'
