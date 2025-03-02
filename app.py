from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure PostgreSQL database
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:755853@localhost/assign'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define the Data model
class Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    end_year = db.Column(db.String(50), nullable=True)
    intensity = db.Column(db.Integer, nullable=True)
    sector = db.Column(db.String(200), nullable=True)
    topic = db.Column(db.String(200), nullable=True)
    insight = db.Column(db.String(1000), nullable=True)
    url = db.Column(db.String(500), nullable=True)
    region = db.Column(db.String(200), nullable=True)
    start_year = db.Column(db.String(50), nullable=True)
    impact = db.Column(db.String(200), nullable=True)
    added = db.Column(db.String(100), nullable=True)
    published = db.Column(db.String(100), nullable=True)
    country = db.Column(db.String(200), nullable=True)
    relevance = db.Column(db.Integer, nullable=True)
    pestle = db.Column(db.String(200), nullable=True)
    source = db.Column(db.String(200), nullable=True)
    title = db.Column(db.String(1000), nullable=True)
    likelihood = db.Column(db.Integer, nullable=True)
    city = db.Column(db.String(200), nullable=True)
    swot = db.Column(db.String(200), nullable=True)  # Ensure this column exists

# Create the database tables
def create_tables():
    with app.app_context():
        db.create_all()

# Manually call create_tables() when the app starts
create_tables()

# API endpoint to fetch filtered data
@app.route('/api/data', methods=['GET'])
def get_data():
    filters = request.args.to_dict()
    query = Data.query
    
    # Handle each filter separately for better flexibility
    for key, value in filters.items():
        if not value or value == "All":
            continue
            
        if key == 'topic':
            query = query.filter(Data.topic == value)
        elif key == 'end_year':
            query = query.filter(Data.end_year == value)
        elif key == 'sector':
            query = query.filter(Data.sector == value)
        elif key == 'region':
            query = query.filter(Data.region == value)
        elif key == 'pestle':
            query = query.filter(Data.pestle == value)
        elif key == 'source':
            query = query.filter(Data.source == value)
        elif key == 'country':
            query = query.filter(Data.country == value)
        elif key == 'city':
            query = query.filter(Data.city == value)
        elif key == 'swot':
            query = query.filter(Data.swot == value)
    
    results = query.all()
    return jsonify([{
        'end_year': r.end_year,
        'intensity': r.intensity,
        'sector': r.sector,
        'topic': r.topic,
        'insight': r.insight,
        'url': r.url,
        'region': r.region,
        'start_year': r.start_year,
        'impact': r.impact,
        'added': r.added,
        'published': r.published,
        'country': r.country,
        'relevance': r.relevance,
        'pestle': r.pestle,
        'source': r.source,
        'title': r.title,
        'likelihood': r.likelihood,
        'city': r.city,
        'swot': r.swot
    } for r in results])

# API endpoint to fetch unique filter values
@app.route('/api/filters', methods=['GET'])
def get_filters():
    filters = {
        'end_year': [row[0] for row in db.session.query(Data.end_year).distinct().filter(Data.end_year != None, Data.end_year != "").all()],
        'topic': [row[0] for row in db.session.query(Data.topic).distinct().filter(Data.topic != None, Data.topic != "").all()],
        'sector': [row[0] for row in db.session.query(Data.sector).distinct().filter(Data.sector != None, Data.sector != "").all()],
        'region': [row[0] for row in db.session.query(Data.region).distinct().filter(Data.region != None, Data.region != "").all()],
        'pestle': [row[0] for row in db.session.query(Data.pestle).distinct().filter(Data.pestle != None, Data.pestle != "").all()],
        'source': [row[0] for row in db.session.query(Data.source).distinct().filter(Data.source != None, Data.source != "").all()],
        'country': [row[0] for row in db.session.query(Data.country).distinct().filter(Data.country != None, Data.country != "").all()],
        'city': [row[0] for row in db.session.query(Data.city).distinct().filter(Data.city != None, Data.city != "").all()],
        'swot': [row[0] for row in db.session.query(Data.swot).distinct().filter(Data.swot != None, Data.swot != "").all()]
    }
    return jsonify(filters)

# API endpoint to get aggregated data for visualizations
@app.route('/api/visualization-data', methods=['GET'])
def get_visualization_data():
    # Intensity by region
    intensity_by_region = db.session.query(
        Data.region, 
        db.func.avg(Data.intensity).label('avg_intensity')
    ).filter(
        Data.region != None, 
        Data.region != "",
        Data.intensity != None
    ).group_by(Data.region).all()
    
    # Likelihood by topic
    likelihood_by_topic = db.session.query(
        Data.topic, 
        db.func.avg(Data.likelihood).label('avg_likelihood')
    ).filter(
        Data.topic != None, 
        Data.topic != "",
        Data.likelihood != None
    ).group_by(Data.topic).all()
    
    # Relevance by country
    relevance_by_country = db.session.query(
        Data.country, 
        db.func.avg(Data.relevance).label('avg_relevance')
    ).filter(
        Data.country != None, 
        Data.country != "",
        Data.relevance != None
    ).group_by(Data.country).all()
    
    # Intensity by year
    intensity_by_year = db.session.query(
        Data.end_year, 
        db.func.avg(Data.intensity).label('avg_intensity')
    ).filter(
        Data.end_year != None, 
        Data.end_year != "",
        Data.intensity != None
    ).group_by(Data.end_year).all()
    
    # Topic distribution
    topic_distribution = db.session.query(
        Data.topic, 
        db.func.count(Data.id).label('count')
    ).filter(
        Data.topic != None, 
        Data.topic != ""
    ).group_by(Data.topic).all()
    
    return jsonify({
        'intensity_by_region': [{'region': r[0], 'avg_intensity': r[1]} for r in intensity_by_region],
        'likelihood_by_topic': [{'topic': r[0], 'avg_likelihood': r[1]} for r in likelihood_by_topic],
        'relevance_by_country': [{'country': r[0], 'avg_relevance': r[1]} for r in relevance_by_country],
        'intensity_by_year': [{'year': r[0], 'avg_intensity': r[1]} for r in intensity_by_year],
        'topic_distribution': [{'topic': r[0], 'count': r[1]} for r in topic_distribution]
    })

if __name__ == '__main__':
    app.run(debug=True)