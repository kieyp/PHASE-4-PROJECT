#!/usr/bin/env python3

from flask import Flask, jsonify, request, make_response
from flask_migrate import Migrate
from models import db, Hero, Power, HeroPower
from sqlalchemy.exc import IntegrityError

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)
db.init_app(app)

@app.route('/')
def home():
    return "I am a super hero"

# Route to get all heroes
@app.route('/heroes', methods=['GET'])
def get_heroes():
    heroes = Hero.query.all()
    heroes_data = [{'id': hero.id, 'name': hero.name, 'super_name': hero.super_name} for hero in heroes]
    return jsonify(heroes_data)

# Route to get a specific hero by ID
@app.route('/heroes/<int:id>', methods=['GET'])
def get_hero_by_id(id):
    hero = Hero.query.get(id)
    if hero:
        hero_data = {
            'id': hero.id,
            'name': hero.name,
            'super_name': hero.super_name,
            'powers': [{'id': power.id, 'name': power.name, 'description': power.description} for power in hero.powers]
        }
        response = make_response(jsonify(hero_data), 200)
    else:
        response = make_response(jsonify({'error': 'Hero not found'}), 404)
    return response

# Route to get all powers
@app.route('/powers', methods=['GET'])
def get_powers():
    powers = Power.query.all()
    powers_data = [{'id': power.id, 'name': power.name, 'description': power.description} for power in powers]
    return jsonify(powers_data)

# Route to get a specific power by ID
@app.route('/powers/<int:id>', methods=['GET'])
def get_power(id):
    power = Power.query.get(id)
    if power:
        power_data = {
            'id': power.id,
            'name': power.name,
            'description': power.description
        }
        return jsonify(power_data)
    else:
        return jsonify({'error': 'Power not found'}), 404

# Route to update a power by ID
@app.route('/powers/<int:id>', methods=['PATCH'])
def update_power(id):
    power = Power.query.get(id)
    if power:
        data = request.get_json()
        if 'description' in data:
            description = data['description']
            power.description = description
            try:
                db.session.commit()
                return jsonify({'id': power.id, 'name': power.name, 'description': power.description})
            except:
                db.session.rollback()
                return jsonify({'errors': ['validation errors']}), 400
        else:
            return jsonify({'error': 'Missing description field'}), 400
    else:
        return jsonify({'error': 'Power not found'}), 404

# Route to create a new HeroPower
@app.route('/hero_powers', methods=['POST'])
# def create_hero_power():
#     data = request.get_json()
#     if all(key in data for key in ('strength', 'power_id', 'hero_id')):
#         strength = data['strength']
#         power_id = data['power_id']
#         hero_id = data['hero_id']
#         hero_power = HeroPower(strength=strength, power_id=power_id, hero_id=hero_id)
#         try:
#             db.session.add(hero_power)
#             db.session.commit()
#             hero = Hero.query.get(hero_id)
#             hero_data = {
#                 'id': hero.id,
#                 'name': hero.name,
#                 'super_name': hero.super_name,
#                 'powers': [{'id': hero_power.power.id, 'name': hero_power.power.name, 'description': hero_power.power.description} for hero_power in hero.hero_powers]
#             }
#             return jsonify(hero_data), 201
#         except:
#             db.session.rollback()
#             return jsonify({'errors': ['validation errors']}), 400
#     else:
#         return jsonify({'error': 'Missing required fields (strength, power_id, hero_id)'}), 400



def create_hero_power():
    data = request.json
    strength = data.get('strength')
    power_id = data.get('power_id')
    hero_id = data.get('hero_id')

    # Check if all required fields are present
    if not (strength and power_id and hero_id):
        return jsonify({"errors": ["Missing required fields"]}), 400

    try:
        # Create a new HeroPower instance
        hero_power = HeroPower(strength=strength, power_id=power_id, hero_id=hero_id)
        db.session.add(hero_power)
        db.session.commit()
        
        # Retrieve the hero data after the HeroPower creation
        hero = Hero.query.get(hero_id)
        if hero:
            hero_data = {
                "id": hero.id,
                "name": hero.name,
                "super_name": hero.super_name,
                "powers": [{"id": power.id, "name": power.name, "description": power.description} for power in hero.powers]
            }
            return jsonify(hero_data), 201  # Return hero data with status code 201 for successful creation
        else:
            return jsonify({"errors": ["Hero not found"]}), 404

    except IntegrityError:
        db.session.rollback()
        return jsonify({"errors": ["Integrity error occurred"]}), 400
    except Exception as e:
        return jsonify({"errors": [str(e)]}), 500

if __name__ == '__main__':
    app.run(port=5555)