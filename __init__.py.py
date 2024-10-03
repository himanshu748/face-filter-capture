from PIL import Image
import io

def apply_filter(image_data, filter_type):
    image = Image.open(io.BytesIO(image_data))
    
    if filter_type == 'grayscale':
        image = image.convert('L')
    elif filter_type == 'sepia':
        # Simple sepia filter
        sepia = []
        for color in image.split():
            color = color.point(lambda i: i * 0.9)
            sepia.append(color)
        image = Image.merge('RGB', sepia)
    
    output = io.BytesIO()
    image.save(output, format='PNG')
    return output.getvalue()