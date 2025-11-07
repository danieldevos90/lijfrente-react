#!/usr/bin/env python3
"""
Generate a JSON file with all available icons from the icons folder.
This file is used by the Strapi icon selector field type.
"""
import os
import json
from pathlib import Path

def scan_icons(base_path):
    """Scan the icons folder and return a structured list of icons."""
    icons = []
    base_path = Path(base_path)
    
    if not base_path.exists():
        print(f"Error: Icons folder not found at {base_path}")
        return icons
    
    # Scan all SVG files
    for svg_file in base_path.rglob("*.svg"):
        # Get relative path from base_path (which is the SVG folder)
        rel_path = svg_file.relative_to(base_path)
        # Convert to forward slashes and ensure it starts with /icons/SVG/
        icon_path = "/icons/SVG/" + str(rel_path).replace("\\", "/")
        
        # Get category from folder structure
        parts = rel_path.parts
        category = "root"
        if len(parts) > 1:
            # Category is typically the folder name (e.g., "interface", "finance")
            category = parts[-2] if len(parts) > 1 else "root"
        
        # Get icon name without extension
        icon_name = svg_file.stem
        
        icons.append({
            "path": icon_path,
            "name": icon_name,
            "category": category,
            "fullPath": str(svg_file)
        })
    
    # Sort by category, then by name
    icons.sort(key=lambda x: (x["category"], x["name"]))
    
    return icons

def main():
    # Path to icons folder
    icons_folder = Path(__file__).parent.parent / "frontend" / "public" / "icons" / "SVG"
    output_file = Path(__file__).parent.parent / "cms" / "public" / "icons.json"
    
    print(f"Scanning icons from: {icons_folder}")
    
    icons = scan_icons(icons_folder)
    
    # Create output directory if it doesn't exist
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    # Write JSON file
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump({
            "icons": icons,
            "total": len(icons),
            "categories": sorted(set(icon["category"] for icon in icons))
        }, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Generated {len(icons)} icons")
    print(f"✓ Categories: {len(set(icon['category'] for icon in icons))}")
    print(f"✓ Output: {output_file}")

if __name__ == "__main__":
    main()

