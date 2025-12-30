#!/usr/bin/env python3
"""
Master script to set up About Us page with team member profiles
This script:
1. Creates team member profiles for Jan Dijkerman and Erik de Vos
2. Updates the About Us page to include the team members section
"""

import subprocess
import sys
import os

def run_script(script_path):
    """Run a Python script and return success status"""
    print(f"\n{'='*80}")
    print(f"Running: {script_path}")
    print('='*80)
    
    try:
        result = subprocess.run(
            [sys.executable, script_path],
            cwd=os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            check=False
        )
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Error running {script_path}: {e}")
        return False

def main():
    """Main execution"""
    print("=" * 80)
    print("🚀 SETTING UP ABOUT US PAGE WITH TEAM MEMBER PROFILES")
    print("=" * 80)
    
    # Get script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Step 1: Create team members
    print("\n📝 Step 1: Creating team member profiles...")
    team_members_script = os.path.join(script_dir, "create_team_members.py")
    if not os.path.exists(team_members_script):
        print(f"❌ Script not found: {team_members_script}")
        return 1
    
    team_members_success = run_script(team_members_script)
    
    if not team_members_success:
        print("\n⚠️ Warning: Team member creation had issues, but continuing...")
    
    # Small delay between scripts
    import time
    time.sleep(2)
    
    # Step 2: Update about page
    print("\n📄 Step 2: Updating About Us page...")
    about_page_script = os.path.join(script_dir, "update_about_page.py")
    if not os.path.exists(about_page_script):
        print(f"❌ Script not found: {about_page_script}")
        return 1
    
    about_page_success = run_script(about_page_script)
    
    # Summary
    print("\n" + "=" * 80)
    print("📊 FINAL SUMMARY")
    print("=" * 80)
    
    if team_members_success and about_page_success:
        print("\n✅ All steps completed successfully!")
        print("\nTeam member profiles have been created and the About Us page has been updated.")
        return 0
    else:
        print("\n⚠️ Some steps had issues:")
        if not team_members_success:
            print("  ❌ Team member creation")
        if not about_page_success:
            print("  ❌ About page update")
        return 1

if __name__ == "__main__":
    exit(main())
