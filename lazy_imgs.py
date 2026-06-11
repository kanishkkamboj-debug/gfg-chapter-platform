import os
import glob
import re

for filepath in glob.glob('frontend/src/**/*.jsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add loading="lazy" to all <img tags that don't already have it
    new_content = re.sub(r'<img (?![^>]*loading=)', r'<img loading="lazy" ', content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
