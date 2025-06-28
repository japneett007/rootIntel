import base64
import json

def image_to_json(image_path, output_json_path):
    # Read the image file in binary mode
    with open(image_path, "rb") as image_file:
        # Encode the image as Base64
        base64_image = base64.b64encode(image_file.read()).decode('utf-8')
    
    # Create a dictionary to hold the image data
    image_data = {
        "image_name": image_path.split("/")[-1],  # Get the image file name
        "image_base64": base64_image
    }
    
    # Write the dictionary
    with open(output_json_path, "w") as json_file:
        json.dump(image_data, json_file, indent=4)
    
    print(f"✅ Image has been saved to JSON: {output_json_path}")

# Example usage
image_to_json("download.jpg", "image.json")