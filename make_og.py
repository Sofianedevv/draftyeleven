import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def make_og_image():
    print("Loading fonts...")
    font_path = 'scratch/Outfit.ttf'

    print("Loading images...")
    # Base background (the gorgeous AI one)
    bg_path = r'C:\Users\Sofia\.gemini\antigravity\brain\f80ea61a-e94d-432a-8f04-f8275d4d7ae3\premium_bg_1788555599322.jpg'
    bg = Image.open(bg_path).convert('RGBA')
    bg = bg.resize((1200, 630), Image.Resampling.LANCZOS)
    
    # Very slight dark overlay to ensure text readability
    overlay = Image.new('RGBA', bg.size, (11, 15, 25, 120))
    bg = Image.alpha_composite(bg, overlay)
    
    draw = ImageDraw.Draw(bg)

    logo = Image.open('public/logo.jpg').convert('RGBA')

    # Fonts
    title_font = ImageFont.truetype(font_path, 95)
    desc_font = ImageFont.truetype(font_path, 30)
    cta_font = ImageFont.truetype(font_path, 24)

    # --- 1. App Icon Style Logo (Center Top) ---
    logo_size = 140
    logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    
    # Create mask for rounded corners
    mask = Image.new('L', logo.size, 0)
    draw_mask = ImageDraw.Draw(mask)
    draw_mask.rounded_rectangle([(0, 0), logo.size], radius=32, fill=255)
    
    # Create the actual logo with transparent corners
    app_icon = Image.new('RGBA', logo.size)
    app_icon.paste(logo, (0, 0), mask)
    
    # Add a sleek border to the logo
    border_draw = ImageDraw.Draw(app_icon)
    border_draw.rounded_rectangle([(1, 1), (logo_size-2, logo_size-2)], radius=32, outline=(255, 255, 255, 80), width=3)

    logo_x = (1200 - logo_size) // 2
    logo_y = 90
    
    # Logo drop shadow
    shadow_offset = 10
    shadow = Image.new('RGBA', bg.size, (0,0,0,0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle([(logo_x, logo_y + shadow_offset), (logo_x + logo_size, logo_y + logo_size + shadow_offset)], radius=32, fill=(0,0,0, 180))
    shadow = shadow.filter(ImageFilter.GaussianBlur(15))
    bg = Image.alpha_composite(bg, shadow)
    
    bg.paste(app_icon, (logo_x, logo_y), app_icon)

    # --- 2. Title (Center) ---
    text_part1 = "DRAFTY "
    text_part2 = "ELEVEN"
    accent_color = (59, 130, 246, 255) # #3b82f6
    text_primary = (255, 255, 255, 255)
    
    left, top, right, bottom = draw.textbbox((0, 0), text_part1, font=title_font)
    w1 = right - left
    left, top, right, bottom = draw.textbbox((0, 0), text_part2, font=title_font)
    w2 = right - left
    
    total_title_w = w1 + w2
    title_x = (1200 - total_title_w) // 2
    title_y = logo_y + logo_size + 40
    
    # Crisp drop shadow for title
    shadow_y = title_y + 4
    draw.text((title_x, shadow_y), text_part1, font=title_font, fill=(0,0,0,150))
    draw.text((title_x + w1, shadow_y), text_part2, font=title_font, fill=(0,0,0,150))
    
    # Draw title
    draw.text((title_x, title_y), text_part1, font=title_font, fill=text_primary)
    draw.text((title_x + w1, title_y), text_part2, font=title_font, fill=accent_color)

    # --- 3. Description (Center Bottom) ---
    desc_text = "Affronte tes amis sur des mini-jeux de football.\nDraft, Devinettes, Juste Prix et bien plus !"
    
    lines = desc_text.split('\n')
    desc_y = title_y + 130
    
    for line in lines:
        left, top, right, bottom = draw.textbbox((0, 0), line, font=desc_font)
        w = right - left
        
        # Line shadow
        draw.text(((1200 - w) // 2, desc_y + 2), line, font=desc_font, fill=(0,0,0,200))
        # Line text
        draw.text(((1200 - w) // 2, desc_y), line, font=desc_font, fill=(241, 245, 249, 255)) # slate-100
        desc_y += 45

    # --- 4. Call to action (Absolute Bottom) ---
    cta_text = "JOUEZ GRATUITEMENT • DRAFTYELEVEN.FR"
    left, top, right, bottom = draw.textbbox((0, 0), cta_text, font=cta_font)
    cta_w = right - left
    cta_y = desc_y + 40
    
    # CTA Shadow
    draw.text(((1200 - cta_w) // 2, cta_y + 2), cta_text, font=cta_font, fill=(0,0,0,150))
    draw.text(((1200 - cta_w) // 2, cta_y), cta_text, font=cta_font, fill=accent_color)

    print("Saving...")
    bg = bg.convert('RGB')
    bg.save('public/og-image.jpg', quality=100)
    print("Done!")

if __name__ == '__main__':
    make_og_image()
