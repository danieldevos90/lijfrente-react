#!/usr/bin/env python3
"""
Test all Strapi endpoints and verify data is returned.
This script tests every content type endpoint in the Strapi CMS.
Tests both public access and authenticated access.
"""

import requests
import json
import os
from datetime import datetime
from typing import Dict, Any, Optional, List

# Configuration
STRAPI_URL = os.getenv('STRAPI_URL', 'https://bright-smile-1f47bc9d67.strapiapp.com')
STRAPI_TOKEN = os.getenv('STRAPI_API_TOKEN', '')
SITE_ID = 'geldgeregeld'

# Define all content type endpoints to test
# Core endpoints without deep population (for clean testing)
ENDPOINTS = [
    {
        'name': 'Pages',
        'endpoint': '/api/pages',
        'params': {'filters[siteId][$eq]': SITE_ID, 'populate': 'sections'},
    },
    {
        'name': 'Navigation Items',
        'endpoint': '/api/navigation-items',
        'params': {'filters[siteId][$eq]': SITE_ID, 'sort': 'order:asc'},
    },
    {
        'name': 'Testimonials',
        'endpoint': '/api/testimonials',
        'params': {'filters[siteId][$eq]': SITE_ID},
    },
    {
        'name': 'Sites',
        'endpoint': '/api/sites',
        'params': {'filters[siteId][$eq]': SITE_ID},
    },
    {
        'name': 'Token Sets',
        'endpoint': '/api/token-sets',
        'params': {'filters[siteId][$eq]': SITE_ID},
    },
    {
        'name': 'Team Members',
        'endpoint': '/api/team-members',
        'params': {'filters[siteId][$eq]': SITE_ID, 'populate': 'image', 'sort': 'order:asc'},
    },
    {
        'name': 'Benefits',
        'endpoint': '/api/benefits',
        'params': {'filters[siteId][$eq]': SITE_ID, 'sort': 'order:asc'},
    },
    {
        'name': 'Sector Pages',
        'endpoint': '/api/sector-pages',
        'params': {'filters[siteId][$eq]': SITE_ID},
    },
    {
        'name': 'Leads',
        'endpoint': '/api/leads',
        'params': {},
        'note': 'Expected to be protected (not public)',
    },
]


def test_endpoint(endpoint_config: Dict[str, Any], use_auth: bool = False) -> Dict[str, Any]:
    """Test a single endpoint and return results."""
    name = endpoint_config['name']
    endpoint = endpoint_config['endpoint']
    params = endpoint_config.get('params', {})
    
    url = f"{STRAPI_URL}{endpoint}"
    
    headers = {'Content-Type': 'application/json'}
    if use_auth and STRAPI_TOKEN:
        headers['Authorization'] = f'Bearer {STRAPI_TOKEN}'
    
    result = {
        'name': name,
        'endpoint': endpoint,
        'url': url,
        'params': params,
        'auth_used': use_auth and bool(STRAPI_TOKEN),
        'status': 'unknown',
        'status_code': None,
        'data_count': 0,
        'error': None,
        'sample_fields': None,
        'access_type': 'public' if not use_auth else 'authenticated',
    }
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=30)
        result['status_code'] = response.status_code
        
        if response.status_code == 200:
            data = response.json()
            if 'data' in data:
                items = data['data']
                if isinstance(items, list):
                    result['data_count'] = len(items)
                    result['status'] = '✅ SUCCESS' if len(items) > 0 else '⚠️ EMPTY'
                    if len(items) > 0:
                        # Get sample data (first item, limited fields)
                        sample = items[0]
                        if 'attributes' in sample:
                            result['sample_fields'] = list(sample.get('attributes', {}).keys())[:10]
                        else:
                            result['sample_fields'] = list(sample.keys())[:10]
                elif items is not None:
                    result['data_count'] = 1
                    result['status'] = '✅ SUCCESS'
                    if 'attributes' in items:
                        result['sample_fields'] = list(items.get('attributes', {}).keys())[:10]
                    else:
                        result['sample_fields'] = list(items.keys())[:10]
                else:
                    result['status'] = '⚠️ NO DATA'
                    result['data_count'] = 0
            elif 'error' in data:
                result['status'] = '❌ ERROR'
                result['error'] = data['error'].get('message', 'Unknown error')
            else:
                result['status'] = '⚠️ UNEXPECTED FORMAT'
                result['error'] = f'Unexpected response format: {list(data.keys())}'
        elif response.status_code == 401:
            result['status'] = '❌ UNAUTHORIZED'
            result['error'] = 'Authentication required or invalid token'
        elif response.status_code == 403:
            result['status'] = '❌ FORBIDDEN'
            result['error'] = 'Access denied - check permissions'
        elif response.status_code == 404:
            result['status'] = '❌ NOT FOUND'
            result['error'] = 'Endpoint not found'
        else:
            result['status'] = f'❌ HTTP {response.status_code}'
            try:
                error_data = response.json()
                result['error'] = error_data.get('error', {}).get('message', response.text[:200])
            except:
                result['error'] = response.text[:200]
                
    except requests.exceptions.Timeout:
        result['status'] = '❌ TIMEOUT'
        result['error'] = 'Request timed out after 30 seconds'
    except requests.exceptions.ConnectionError as e:
        result['status'] = '❌ CONNECTION ERROR'
        result['error'] = str(e)[:200]
    except Exception as e:
        result['status'] = '❌ EXCEPTION'
        result['error'] = str(e)[:200]
    
    return result


def print_results(results: List[Dict[str, Any]]):
    """Print test results in a formatted way."""
    print("\n" + "=" * 80)
    print("STRAPI ENDPOINTS TEST REPORT")
    print("=" * 80)
    print(f"\n📍 Strapi URL: {STRAPI_URL}")
    print(f"🔑 Token: {'Present (' + str(len(STRAPI_TOKEN)) + ' chars)' if STRAPI_TOKEN else 'Not set'}")
    print(f"🏢 Site ID: {SITE_ID}")
    print(f"📅 Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("\n" + "-" * 80)
    
    # Summary stats
    success = sum(1 for r in results if r['status'].startswith('✅'))
    empty = sum(1 for r in results if r['status'].startswith('⚠️'))
    failed = sum(1 for r in results if r['status'].startswith('❌'))
    
    print(f"\n📊 SUMMARY: {success} success, {empty} empty/warning, {failed} failed out of {len(results)} endpoints\n")
    
    # Print results table
    print("-" * 80)
    print(f"{'Endpoint':<25} {'Status':<15} {'Items':<8} {'Access':<10} {'Fields'}")
    print("-" * 80)
    
    for result in results:
        status_short = result['status'].split()[0]
        items_str = str(result['data_count']) if result['data_count'] > 0 else '-'
        access = result.get('access_type', 'public')
        fields = ', '.join(result.get('sample_fields', [])[:5]) if result.get('sample_fields') else ''
        if len(fields) > 30:
            fields = fields[:27] + '...'
        print(f"{result['name']:<25} {status_short:<15} {items_str:<8} {access:<10} {fields}")
        
        if result['error']:
            print(f"  └─ Error: {result['error']}")
    
    print("-" * 80)
    print(f"\n✅ = Success  ⚠️ = Empty/Warning  ❌ = Failed")
    print("\n" + "=" * 80 + "\n")
    
    return success, empty, failed


def main():
    """Run all endpoint tests - public access only (no auth token needed)."""
    print("\n🚀 Starting Strapi endpoint tests...")
    print(f"   Testing {len(ENDPOINTS)} endpoints (public access)...")
    print(f"   Note: Testing without authentication token")
    print()
    
    results = []
    for i, endpoint_config in enumerate(ENDPOINTS, 1):
        print(f"   [{i}/{len(ENDPOINTS)}] Testing: {endpoint_config['name']:<25}", end=' ')
        result = test_endpoint(endpoint_config, use_auth=False)
        results.append(result)
        items_info = f"({result['data_count']} items)" if result['data_count'] > 0 else ""
        print(f"{result['status']} {items_info}")
    
    success, empty, failed = print_results(results)
    
    # Overall assessment
    print("\n📝 ASSESSMENT:")
    if success == len(ENDPOINTS):
        print("   ✅ All endpoints are working and returning data!")
    elif success > 0:
        print(f"   ⚠️ {success}/{len(ENDPOINTS)} endpoints working. Some endpoints need attention.")
    else:
        print("   ❌ No endpoints are working. Check Strapi connection or permissions.")
    
    # Return exit code based on results
    if failed > 0:
        return 1
    return 0


if __name__ == '__main__':
    exit(main())
