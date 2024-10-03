from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import base64
from PIL import Image, ImageDraw
import os
from io import BytesIO

app = Flask(__name__)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['image_database']
collection = db['images']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/capture', methods=['POST'])
def capture():
    data = request.json
    image_data = data['image']
    filter_type = data['filter']

    # Decode base64 image data
    image_data = base64.b64decode(image_data.split(',')[1])

    # Convert the image data into a PIL Image object
    image = Image.open(BytesIO(image_data))

    # Apply the selected filter on the captured image
    if filter_type == 'grayscale':
        image = image.convert('L')  # Grayscale
    elif filter_type == 'sepia':
        # Example of sepia effect
        sepia_image = Image.new("RGB", image.size)
        pixels = image.load() 
        for y in range(image.size[1]):
            for x in range(image.size[0]):
                r, g, b = pixels[x, y]

                # Calculate sepia tone
                tr = int(0.393 * r + 0.769 * g + 0.189 * b)
                tg = int(0.349 * r + 0.686 * g + 0.168 * b)
                tb = int(0.272 * r + 0.534 * g + 0.131 * b)

                # Set new pixel color
                sepia_image.putpixel((x, y), (min(tr, 255), min(tg, 255), min(tb, 255)))
        image = sepia_image
    elif filter_type == 'heart_filter':
        # Add heart filter
        heart_filter = Image.open('static/images/heart.png').convert('RGBA')
        heart_filter = heart_filter.resize((100, 100))  # Resize if needed

        # Position heart on the image (for example, centered on the head)
        image.paste(heart_filter, (250, 50), heart_filter)  # Adjust coordinates as needed
    
    # Save the image with the filter applied
    filename = f"image_{len(os.listdir('static/images')) + 1}.png"
    image.save(f"static/images/{filename}")

    # Save image to MongoDB
    image_doc = {
        'filename': filename,
        'filter': filter_type,
        'data': base64.b64encode(image_data).decode('utf-8')
    }
    collection.insert_one(image_doc)

    return jsonify({'status': 'success', 'filename': filename})

if __name__ == '__main__':
    app.run(debug=True)
