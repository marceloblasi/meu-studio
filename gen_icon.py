from PIL import Image, ImageDraw, ImageFont
import os

size = (256, 256)
img = Image.new('RGBA', size, (255, 255, 255, 0))

draw = ImageDraw.Draw(img)
# draw pink circle
draw.ellipse((8, 8, 248, 248), fill="#FFB6C1")

# Use arial if exists, else load default
try:
    font = ImageFont.truetype("arialbd.ttf", 180)
except:
    font = ImageFont.load_default()

bbox = draw.textbbox((0, 0), "$", font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]

text_x = (256 - text_width) / 2
# manual adjustment for perfect center
text_y = (256 - text_height) / 2 - 30

draw.text((text_x, text_y), "$", fill="white", font=font)

img.save("icon.ico", format="ICO", sizes=[(256, 256), (128, 128), (64, 64), (32, 32)])
img.save("icon.png")
print("Icon created!")
