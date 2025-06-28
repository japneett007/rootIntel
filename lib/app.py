from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
import os
import json
from datetime import datetime
import uuid
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'

# Configuration for file uploads
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Create necessary directories
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs('data', exist_ok=True)

# Data file paths - This is where your data is stored locally
USER_DATA_FILE = 'data/user_data.json'
DIAGNOSES_FILE = 'data/diagnoses.json'
JOURNAL_FILE = 'data/journal_entries.json'

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def load_json_file(filepath, default_data):
    """Load data from JSON file, create if doesn't exist"""
    try:
        if os.path.exists(filepath):
            with open(filepath, 'r') as f:
                return json.load(f)
        else:
            # Create file with default data
            save_json_file(filepath, default_data)
            return default_data
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return default_data

def save_json_file(filepath, data):
    """Save data to JSON file"""
    try:
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving {filepath}: {e}")
        return False

# Initialize default data structures
DEFAULT_USER_DATA = {
    'diagnoses_count': 0,
    'journal_entries_count': 0,
    'quests_completed': 0,
    'plants_saved': 0,
    'level': 1,
    'xp': 0,
    'badges': [],
    'created_at': datetime.now().isoformat()
}

DEFAULT_DIAGNOSES = []
DEFAULT_JOURNAL = []

# Mock plant database for diagnosis
PLANT_DATABASE = {
    'yellowing': {
        'name': 'Yellowing Leaves',
        'confidence': 85,
        'diagnosis': 'Overwatering or nutrient deficiency',
        'treatment': [
            'Reduce watering frequency',
            'Check soil drainage',
            'Apply balanced fertilizer',
            'Remove affected leaves'
        ],
        'prevention': [
            'Water only when soil is dry',
            'Ensure proper drainage',
            'Regular fertilization schedule'
        ]
    },
    'brown': {
        'name': 'Brown Spots',
        'confidence': 78,
        'diagnosis': 'Fungal infection or leaf burn',
        'treatment': [
            'Remove affected leaves',
            'Apply fungicide spray',
            'Improve air circulation',
            'Reduce humidity'
        ],
        'prevention': [
            'Avoid overhead watering',
            'Maintain proper spacing',
            'Regular inspection'
        ]
    },
    'wilting': {
        'name': 'Wilting Plant',
        'confidence': 92,
        'diagnosis': 'Underwatering or root problems',
        'treatment': [
            'Check soil moisture',
            'Water thoroughly',
            'Inspect roots for damage',
            'Repot if necessary'
        ],
        'prevention': [
            'Consistent watering schedule',
            'Monitor soil moisture',
            'Use well-draining soil'
        ]
    },
    'spots': {
        'name': 'Leaf Spots',
        'confidence': 80,
        'diagnosis': 'Bacterial or fungal infection',
        'treatment': [
            'Remove infected leaves',
            'Apply copper fungicide',
            'Improve ventilation',
            'Avoid wetting leaves'
        ],
        'prevention': [
            'Water at soil level',
            'Provide good air circulation',
            'Regular plant inspection'
        ]
    }
}

@app.route('/')
def home():
    user_data = load_json_file(USER_DATA_FILE, DEFAULT_USER_DATA)
    diagnoses = load_json_file(DIAGNOSES_FILE, DEFAULT_DIAGNOSES)
    journal_entries = load_json_file(JOURNAL_FILE, DEFAULT_JOURNAL)
    
    # Update counts
    user_data['diagnoses_count'] = len(diagnoses)
    user_data['journal_entries_count'] = len(journal_entries)
    
    # Get recent activity
    recent_activity = []
    
    # Add recent diagnoses
    for diagnosis in diagnoses[-3:]:
        recent_activity.append({
            'type': 'diagnosis',
            'text': f"Diagnosed {diagnosis['diagnosis']['name']}",
            'timestamp': diagnosis['timestamp'],
            'status': 'success'
        })
    
    # Add recent journal entries
    for entry in journal_entries[-2:]:
        recent_activity.append({
            'type': 'journal',
            'text': f"Added journal entry",
            'timestamp': entry['timestamp'],
            'status': 'info'
        })
    
    # Sort by timestamp
    recent_activity.sort(key=lambda x: x['timestamp'], reverse=True)
    
    return render_template('index.html', user_data=user_data, recent_activity=recent_activity[:5])

@app.route('/diagnosis')
def diagnosis():
    return render_template('diagnosis.html')

@app.route('/simulation')
def simulation():
    return render_template('simulation.html')

@app.route('/quests')
def quests():
    user_data = load_json_file(USER_DATA_FILE, DEFAULT_USER_DATA)
    return render_template('quests.html', user_data=user_data)

@app.route('/journal')
def journal():
    journal_entries = load_json_file(JOURNAL_FILE, DEFAULT_JOURNAL)
    return render_template('journal.html', entries=journal_entries)

@app.route('/api/analyze-plant', methods=['POST'])
def analyze_plant():
    try:
        symptoms = request.form.get('symptoms', '').lower()
        image_file = request.files.get('image')
        
        # Handle image upload
        image_filename = None
        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            # Add timestamp to avoid conflicts
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_')
            filename = timestamp + filename
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image_file.save(image_path)
            image_filename = filename
        
        # Simple keyword matching for diagnosis
        diagnosis = None
        for key, plant_info in PLANT_DATABASE.items():
            if key in symptoms:
                diagnosis = plant_info
                break
        
        if not diagnosis:
            diagnosis = {
                'name': 'General Plant Care',
                'confidence': 60,
                'diagnosis': 'Unable to determine specific issue from symptoms',
                'treatment': [
                    'Check watering schedule',
                    'Ensure adequate light',
                    'Inspect for pests',
                    'Consider repotting'
                ],
                'prevention': [
                    'Regular monitoring',
                    'Proper care routine',
                    'Environmental control'
                ]
            }
        
        # Create diagnosis entry
        diagnosis_entry = {
            'id': str(uuid.uuid4()),
            'timestamp': datetime.now().isoformat(),
            'symptoms': symptoms,
            'diagnosis': diagnosis,
            'image_filename': image_filename,
            'has_image': image_filename is not None
        }
        
        # Load existing diagnoses and add new one
        diagnoses = load_json_file(DIAGNOSES_FILE, DEFAULT_DIAGNOSES)
        diagnoses.append(diagnosis_entry)
        save_json_file(DIAGNOSES_FILE, diagnoses)
        
        # Update user stats
        user_data = load_json_file(USER_DATA_FILE, DEFAULT_USER_DATA)
        user_data['plants_saved'] += 1
        user_data['xp'] += 25
        
        # Level up logic
        if user_data['xp'] >= user_data['level'] * 100:
            user_data['level'] += 1
            user_data['xp'] = 0
        
        save_json_file(USER_DATA_FILE, user_data)
        
        return jsonify({
            'success': True,
            'diagnosis': diagnosis,
            'timestamp': diagnosis_entry['timestamp'],
            'image_url': f"/static/uploads/{image_filename}" if image_filename else None
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/simulate-plant', methods=['POST'])
def simulate_plant():
    try:
        data = request.get_json()
        sunlight = int(data.get('sunlight', 50))
        water = int(data.get('water', 50))
        temperature = int(data.get('temperature', 20))
        fertilizer = int(data.get('fertilizer', 50))
        plant_type = data.get('plant_type', 'tropical')
        
        # Plant type optimal ranges
        optimal_ranges = {
            'tropical': {'sunlight': [60, 80], 'water': [70, 90], 'temp': [22, 28], 'fertilizer': [40, 60]},
            'desert': {'sunlight': [80, 100], 'water': [20, 40], 'temp': [25, 35], 'fertilizer': [20, 40]},
            'temperate': {'sunlight': [40, 70], 'water': [50, 70], 'temp': [15, 25], 'fertilizer': [30, 50]}
        }
        
        optimal = optimal_ranges.get(plant_type, optimal_ranges['tropical'])
        
        # Calculate health metrics
        def calculate_health(value, optimal_range):
            min_val, max_val = optimal_range
            if min_val <= value <= max_val:
                return 100
            elif value < min_val:
                return max(0, 100 - (min_val - value) * 2)
            else:
                return max(0, 100 - (value - max_val) * 2)
        
        growth = calculate_health(sunlight, optimal['sunlight'])
        chlorophyll = calculate_health(water, optimal['water'])
        root_health = calculate_health(temperature, optimal['temp'])
        overall_health = (growth + chlorophyll + root_health) / 3
        
        # Generate recommendations
        recommendations = []
        if sunlight < optimal['sunlight'][0]:
            recommendations.append("🌞 Increase sunlight exposure for better growth")
        elif sunlight > optimal['sunlight'][1]:
            recommendations.append("🌤️ Reduce direct sunlight to prevent burning")
            
        if water < optimal['water'][0]:
            recommendations.append("💧 Increase watering frequency")
        elif water > optimal['water'][1]:
            recommendations.append("🚰 Reduce watering to prevent root rot")
            
        if temperature < optimal['temp'][0]:
            recommendations.append("🌡️ Increase temperature for optimal growth")
        elif temperature > optimal['temp'][1]:
            recommendations.append("❄️ Provide cooling or shade")
        
        if not recommendations:
            recommendations.append("✨ Perfect conditions! Your plant is thriving!")
        
        return jsonify({
            'success': True,
            'health': {
                'growth': round(growth),
                'chlorophyll': round(chlorophyll),
                'root_health': round(root_health),
                'overall': round(overall_health)
            },
            'recommendations': recommendations,
            'status': 'Thriving' if overall_health > 80 else 'Struggling' if overall_health > 50 else 'Critical'
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/add-journal-entry', methods=['POST'])
def add_journal_entry():
    try:
        data = request.get_json()
        
        # Create new journal entry
        entry = {
            'id': str(uuid.uuid4()),
            'timestamp': datetime.now().isoformat(),
            'hypothesis': data.get('hypothesis', ''),
            'action': data.get('action', ''),
            'result': data.get('result', ''),
            'reflection': data.get('reflection', ''),
            'tags': [tag.strip() for tag in data.get('tags', '').split(',') if tag.strip()]
        }
        
        # Load existing entries and add new one
        journal_entries = load_json_file(JOURNAL_FILE, DEFAULT_JOURNAL)
        journal_entries.append(entry)
        save_json_file(JOURNAL_FILE, journal_entries)
        
        # Update user stats
        user_data = load_json_file(USER_DATA_FILE, DEFAULT_USER_DATA)
        user_data['xp'] += 50
        
        # Level up logic
        if user_data['xp'] >= user_data['level'] * 100:
            user_data['level'] += 1
            user_data['xp'] = 0
        
        save_json_file(USER_DATA_FILE, user_data)
        
        return jsonify({'success': True, 'entry': entry, 'user_data': user_data})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/complete-quest', methods=['POST'])
def complete_quest():
    try:
        data = request.get_json()
        quest_id = data.get('quest_id')
        
        # Update user stats
        user_data = load_json_file(USER_DATA_FILE, DEFAULT_USER_DATA)
        user_data['quests_completed'] += 1
        user_data['xp'] += 100
        
        # Add badge based on quest
        quest_badges = {
            'first-diagnosis': '🏅 Plant Detective',
            'sunlight-experiment': '☀️ Sun Master',
            'heal-blight': '🌹 Rose Healer',
            'perfect-sunflower': '🌻 Sunflower Champion',
            'frost-recovery': '❄️ Frost Master',
            'master-gardener': '🏆 Master Gardener'
        }
        
        if quest_id in quest_badges and quest_badges[quest_id] not in user_data['badges']:
            user_data['badges'].append(quest_badges[quest_id])
        
        # Level up logic
        if user_data['xp'] >= user_data['level'] * 100:
            user_data['level'] += 1
            user_data['xp'] = 0
        
        save_json_file(USER_DATA_FILE, user_data)
        
        return jsonify({'success': True, 'user_data': user_data})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/get-user-data')
def get_user_data():
    """Get current user data"""
    user_data = load_json_file(USER_DATA_FILE, DEFAULT_USER_DATA)
    return jsonify(user_data)

@app.route('/api/reset-data', methods=['POST'])
def reset_data():
    """Reset all user data (for testing purposes)"""
    try:
        save_json_file(USER_DATA_FILE, DEFAULT_USER_DATA)
        save_json_file(DIAGNOSES_FILE, DEFAULT_DIAGNOSES)
        save_json_file(JOURNAL_FILE, DEFAULT_JOURNAL)
        
        # Clear uploaded images
        for filename in os.listdir(UPLOAD_FOLDER):
            if filename != '.gitkeep':
                os.remove(os.path.join(UPLOAD_FOLDER, filename))
        
        return jsonify({'success': True, 'message': 'All data reset successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    print("🌱 RootIntel Flask App Starting...")
    print(f"📁 Data will be stored in: {os.path.abspath('data')}")
    print(f"🖼️ Images will be stored in: {os.path.abspath(UPLOAD_FOLDER)}")
    print("🚀 Visit http://localhost:5000 to use the app")
    app.run(debug=True, host='0.0.0.0', port=5000)
