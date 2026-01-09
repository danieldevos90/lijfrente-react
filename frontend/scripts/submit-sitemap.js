#!/usr/bin/env node

/**
 * Google Search Console Sitemap Submission Script
 * 
 * This script submits your sitemap to Google Search Console using the Google Search Console API.
 * 
 * Prerequisites:
 * 1. Install Google APIs client library: npm install googleapis
 * 2. Set up Google Cloud Project and enable Search Console API
 * 3. Create OAuth2 credentials and download JSON file
 * 4. Set GOOGLE_APPLICATION_CREDENTIALS environment variable pointing to credentials JSON
 * 
 * Usage:
 *   node scripts/submit-sitemap.js [sitemap-url] [site-url]
 * 
 * Example:
 *   node scripts/submit-sitemap.js https://geldgeregeld.nl/sitemap.xml https://geldgeregeld.nl
 */

const { google } = require('googleapis');
const path = require('path');

async function submitSitemap(sitemapUrl, siteUrl) {
  try {
    // Authenticate using service account or OAuth2
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/webmasters'],
    });

    const searchConsole = google.searchconsole({
      version: 'v1',
      auth,
    });

    // Extract site URL from sitemap URL (remove protocol and path)
    const siteUrlToUse = siteUrl || sitemapUrl.replace(/\/sitemap\.xml$/, '');

    console.log(`Submitting sitemap: ${sitemapUrl}`);
    console.log(`For site: ${siteUrlToUse}`);

    // Submit sitemap
    const response = await searchConsole.sitemaps.submit({
      siteUrl: siteUrlToUse,
      feedpath: sitemapUrl,
    });

    console.log('✅ Sitemap submitted successfully!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ Error submitting sitemap:', error.message);
    
    if (error.code === 'ENOENT') {
      console.error('\n⚠️  Credentials file not found.');
      console.error('Please set GOOGLE_APPLICATION_CREDENTIALS environment variable.');
      console.error('Example: export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json');
    } else if (error.code === 401) {
      console.error('\n⚠️  Authentication failed.');
      console.error('Please check your credentials file and ensure Search Console API is enabled.');
    } else if (error.code === 404) {
      console.error('\n⚠️  Site not found in Search Console.');
      console.error('Please add your site to Google Search Console first.');
    }
    
    process.exit(1);
  }
}

// Get command line arguments
const sitemapUrl = process.argv[2] || process.env.SITEMAP_URL || 'https://geldgeregeld.nl/sitemap.xml';
const siteUrl = process.argv[3] || process.env.SITE_URL || 'https://geldgeregeld.nl';

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('⚠️  GOOGLE_APPLICATION_CREDENTIALS environment variable not set.');
  console.error('\nTo use this script:');
  console.error('1. Set up Google Cloud Project');
  console.error('2. Enable Search Console API');
  console.error('3. Create service account credentials');
  console.error('4. Download JSON credentials file');
  console.error('5. Set: export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json');
  console.error('\nAlternatively, submit sitemap manually:');
  console.error('1. Go to https://search.google.com/search-console');
  console.error('2. Select your property');
  console.error('3. Go to Sitemaps');
  console.error(`4. Enter: ${sitemapUrl}`);
  process.exit(1);
}

submitSitemap(sitemapUrl, siteUrl);
