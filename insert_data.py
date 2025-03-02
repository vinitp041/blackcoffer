import json
from app import app, db, Data

# Function to extract SWOT from insight or title
def extract_swot(text):
    if not text:
        return None
    
    text = text.lower()
    if 'strength' in text:
        return 'Strength'
    elif 'weakness' in text:
        return 'Weakness'
    elif 'opportunit' in text:
        return 'Opportunity'
    elif 'threat' in text:
        return 'Threat'
    return None

# Function to safely convert to integer
def safe_int(value):
    if value is None or value == '':
        return None
    try:
        return int(value)
    except (ValueError, TypeError):
        return None

# Load JSON data
with open('jsondata.json', 'r') as file:
    data = json.load(file)

# Insert data into the database
with app.app_context():
    # First, clear existing data
    db.session.query(Data).delete()
    db.session.commit()
    
    for entry in data:
        # Safely handle integer fields
        intensity = safe_int(entry.get('intensity'))
        relevance = safe_int(entry.get('relevance'))
        likelihood = safe_int(entry.get('likelihood'))
        end_year = safe_int(entry.get('end_year'))  # Handle end_year
        start_year = safe_int(entry.get('start_year'))  # Handle start_year
        
        # Extract city from country if not present
        city = entry.get('city')
        
        # Extract SWOT analysis type from insight or title
        swot = extract_swot(entry.get('insight')) or extract_swot(entry.get('title'))
        
        # Modify the impact field to use safe_int
        impact = safe_int(entry.get('impact'))

        # Create a new Data entry
        new_entry = Data(
            end_year=end_year,
            intensity=intensity,
            sector=entry.get('sector'),
            topic=entry.get('topic'),
            insight=entry.get('insight'),
            url=entry.get('url'),
            region=entry.get('region'),
            start_year=start_year,
            impact=impact,  # Treat impact as an integer
            added=entry.get('added'),
            published=entry.get('published'),
            country=entry.get('country'),
            relevance=relevance,
            pestle=entry.get('pestle'),
            source=entry.get('source'),
            title=entry.get('title'),
            likelihood=likelihood,
            city=city,
            swot=swot
        )
        db.session.add(new_entry)
    
    db.session.commit()
    print("Data import completed successfully!")