#!/usr/bin/env python3
"""
Test Strapi endpoints and verify data is correctly available for frontend
"""

import requests
import json
import os
from typing import Dict, List, Any

# Strapi configuration
STRAPI_URL = os.getenv("STRAPI_URL", "https://bright-smile-1f47bc9d67.strapiapp.com")
STRAPI_TOKEN = os.getenv("STRAPI_TOKEN") or os.getenv("STRAPI_API_TOKEN")

HEADERS = {
    "Content-Type": "application/json"
}

if STRAPI_TOKEN:
    HEADERS["Authorization"] = f"Bearer {STRAPI_TOKEN}"

SITE_ID = "geldgeregeld"

def test_endpoint(name: str, url: str, use_auth: bool = False) -> Dict[str, Any]:
    """Test a single endpoint"""
    print(f"\n{'='*60}")
    print(f"Testing: {name}")
    print(f"URL: {url}")
    
    headers = HEADERS.copy()
    if not use_auth:
        headers.pop("Authorization", None)
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        
        result = {
            "status": response.status_code,
            "success": response.status_code == 200,
            "has_data": False,
            "data_count": 0,
            "error": None
        }
        
        if response.status_code == 200:
            try:
                data = response.json()
                result["has_data"] = True
                
                # Handle different response formats
                if isinstance(data, dict):
                    if "data" in data:
                        data_array = data["data"]
                        if isinstance(data_array, list):
                            result["data_count"] = len(data_array)
                            if result["data_count"] > 0:
                                result["sample"] = data_array[0]
                        elif isinstance(data_array, dict):
                            result["data_count"] = 1
                            result["sample"] = data_array
                    else:
                        result["data_count"] = 1
                        result["sample"] = data
                elif isinstance(data, list):
                    result["data_count"] = len(data)
                    if result["data_count"] > 0:
                        result["sample"] = data[0]
                
                print(f"✅ Status: {result['status']}")
                print(f"   Data count: {result['data_count']}")
                if result["data_count"] > 0 and "sample" in result:
                    print(f"   Sample keys: {list(result['sample'].keys()) if isinstance(result['sample'], dict) else 'N/A'}")
                
            except json.JSONDecodeError:
                result["error"] = "Invalid JSON response"
                print(f"❌ Invalid JSON response")
                print(f"   Response: {response.text[:200]}")
        else:
            result["error"] = response.text[:200]
            print(f"❌ Status: {result['status']}")
            print(f"   Error: {result['error']}")
        
        return result
        
    except Exception as e:
        print(f"❌ Exception: {e}")
        return {
            "status": 0,
            "success": False,
            "has_data": False,
            "data_count": 0,
            "error": str(e)
        }

def test_testimonials():
    """Test testimonials endpoints"""
    print("\n" + "="*60)
    print("TESTIMONIALS ENDPOINTS")
    print("="*60)
    
    results = {}
    
    # Test 1: All testimonials (public)
    results["all_public"] = test_endpoint(
        "All Testimonials (Public)",
        f"{STRAPI_URL}/api/testimonials?populate=*",
        use_auth=False
    )
    
    # Test 2: Filtered by siteId (public)
    results["by_site"] = test_endpoint(
        f"Testimonials by siteId={SITE_ID} (Public)",
        f"{STRAPI_URL}/api/testimonials?filters[siteId][$eq]={SITE_ID}&populate=*",
        use_auth=False
    )
    
    # Test 3: Filtered by sector (if available)
    results["by_sector"] = test_endpoint(
        "Testimonials by sector=horeca (Public)",
        f"{STRAPI_URL}/api/testimonials?filters[siteId][$eq]={SITE_ID}&filters[sector][$eq]=horeca&populate=*",
        use_auth=False
    )
    
    return results

def test_navigation():
    """Test navigation endpoints"""
    print("\n" + "="*60)
    print("NAVIGATION ENDPOINTS")
    print("="*60)
    
    results = {}
    
    results["navigation"] = test_endpoint(
        f"Navigation for siteId={SITE_ID}",
        f"{STRAPI_URL}/api/navigation-items?filters[siteId][$eq]={SITE_ID}&populate=*",
        use_auth=False
    )
    
    return results

def test_pages():
    """Test pages endpoints"""
    print("\n" + "="*60)
    print("PAGES ENDPOINTS")
    print("="*60)
    
    results = {}
    
    # Test homepage
    results["homepage"] = test_endpoint(
        "Homepage",
        f"{STRAPI_URL}/api/pages?filters[slug][$eq]=home&filters[siteId][$eq]={SITE_ID}&populate=*",
        use_auth=False
    )
    
    # Test about page
    results["about"] = test_endpoint(
        "About Page",
        f"{STRAPI_URL}/api/pages?filters[slug][$eq]=over-ons&filters[siteId][$eq]={SITE_ID}&populate=*",
        use_auth=False
    )
    
    return results

def test_sectors():
    """Test sector pages"""
    print("\n" + "="*60)
    print("SECTOR PAGES ENDPOINTS")
    print("="*60)
    
    results = {}
    
    sectors = ["horeca", "retail", "transport", "bouw", "zzp"]
    
    for sector in sectors:
        results[sector] = test_endpoint(
            f"Sector: {sector}",
            f"{STRAPI_URL}/api/pages?filters[slug][$eq]=sectoren/{sector}&filters[siteId][$eq]={SITE_ID}&populate=*",
            use_auth=False
        )
    
    return results

def test_footer():
    """Test footer content"""
    print("\n" + "="*60)
    print("FOOTER ENDPOINTS")
    print("="*60)
    
    results = {}
    
    results["footer"] = test_endpoint(
        f"Footer for siteId={SITE_ID}",
        f"{STRAPI_URL}/api/footers?filters[siteId][$eq]={SITE_ID}&populate=*",
        use_auth=False
    )
    
    return results

def analyze_testimonial_data(testimonials_result: Dict) -> Dict[str, Any]:
    """Analyze testimonial data structure"""
    if not testimonials_result.get("success") or not testimonials_result.get("has_data"):
        return {"error": "No testimonial data available"}
    
    sample = testimonials_result.get("sample", {})
    
    # Check for required fields
    analysis = {
        "has_name": "name" in sample or ("attributes" in sample and "name" in sample.get("attributes", {})),
        "has_company": "company" in sample or ("attributes" in sample and "company" in sample.get("attributes", {})),
        "has_text": "text" in sample or ("attributes" in sample and "text" in sample.get("attributes", {})),
        "has_role": "role" in sample or ("attributes" in sample and "role" in sample.get("attributes", {})),
        "has_sector": "sector" in sample or ("attributes" in sample and "sector" in sample.get("attributes", {})),
        "has_rating": "rating" in sample or ("attributes" in sample and "rating" in sample.get("attributes", {})),
        "has_image": "image" in sample or ("attributes" in sample and "image" in sample.get("attributes", {})),
        "has_siteId": "siteId" in sample or ("attributes" in sample and "siteId" in sample.get("attributes", {})),
    }
    
    # Get actual values
    attrs = sample.get("attributes", sample) if "attributes" in sample else sample
    
    analysis["sample_data"] = {
        "name": attrs.get("name", "N/A"),
        "company": attrs.get("company", "N/A"),
        "role": attrs.get("role", "N/A"),
        "sector": attrs.get("sector", "N/A"),
        "siteId": attrs.get("siteId", "N/A"),
        "has_role_value": bool(attrs.get("role")),
    }
    
    return analysis

def main():
    print("="*60)
    print("STRAPI ENDPOINTS TEST SUITE")
    print("="*60)
    print(f"Strapi URL: {STRAPI_URL}")
    print(f"Site ID: {SITE_ID}")
    print(f"Has Token: {'Yes' if STRAPI_TOKEN else 'No (using public access)'}")
    
    all_results = {}
    
    # Test all endpoints
    all_results["testimonials"] = test_testimonials()
    all_results["navigation"] = test_navigation()
    all_results["pages"] = test_pages()
    all_results["sectors"] = test_sectors()
    all_results["footer"] = test_footer()
    
    # Analyze testimonial data
    print("\n" + "="*60)
    print("TESTIMONIAL DATA ANALYSIS")
    print("="*60)
    
    if all_results["testimonials"].get("by_site", {}).get("success"):
        analysis = analyze_testimonial_data(all_results["testimonials"]["by_site"])
        print("\nField Availability:")
        for field, available in analysis.items():
            if field != "sample_data":
                status = "✅" if available else "❌"
                print(f"  {status} {field}: {available}")
        
        if "sample_data" in analysis:
            print("\nSample Testimonial Data:")
            for key, value in analysis["sample_data"].items():
                print(f"  {key}: {value}")
    
    # Summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    
    total_tests = 0
    passed_tests = 0
    
    for category, results in all_results.items():
        if isinstance(results, dict):
            for test_name, result in results.items():
                total_tests += 1
                if result.get("success"):
                    passed_tests += 1
                    status = "✅"
                else:
                    status = "❌"
                print(f"{status} {category}.{test_name}: {result.get('data_count', 0)} items")
    
    print(f"\nTotal: {passed_tests}/{total_tests} tests passed")
    
    # Frontend compatibility check
    print("\n" + "="*60)
    print("FRONTEND COMPATIBILITY CHECK")
    print("="*60)
    
    # Check if testimonials have required fields for frontend
    if all_results["testimonials"].get("by_site", {}).get("success"):
        testimonial_count = all_results["testimonials"]["by_site"].get("data_count", 0)
        print(f"✅ Testimonials available: {testimonial_count}")
        
        analysis = analyze_testimonial_data(all_results["testimonials"]["by_site"])
        required_fields = ["has_name", "has_company", "has_text"]
        missing_fields = [field for field in required_fields if not analysis.get(field, False)]
        
        if missing_fields:
            print(f"⚠️  Missing required fields: {missing_fields}")
        else:
            print("✅ All required fields present")
        
        if not analysis.get("has_role", False) or not analysis["sample_data"].get("has_role_value", False):
            print("⚠️  Role field missing or empty - frontend may show company name instead")
        else:
            print("✅ Role field present")
    
    # Check navigation
    if all_results["navigation"].get("navigation", {}).get("success"):
        nav_count = all_results["navigation"]["navigation"].get("data_count", 0)
        print(f"✅ Navigation items: {nav_count}")
    else:
        print("❌ Navigation not available")
    
    # Check pages
    if all_results["pages"].get("homepage", {}).get("success"):
        print("✅ Homepage available")
    else:
        print("⚠️  Homepage not found in Strapi (using fallback)")
    
    print("\n" + "="*60)
    print("Test completed!")
    print("="*60)

if __name__ == "__main__":
    main()
