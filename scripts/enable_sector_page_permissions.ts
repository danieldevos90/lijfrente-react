#!/usr/bin/env ts-node
/**
 * Enable permissions for sector-page content type via Strapi Admin API
 * This script uses the admin API to enable permissions programmatically
 */

import fetch from 'node-fetch';

const STRAPI_URL = process.env.STRAPI_URL || 'https://bright-smile-1f47bc9d67.strapiapp.com';
const STRAPI_ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN || process.env.STRAPI_TOKEN;

if (!STRAPI_ADMIN_TOKEN) {
  throw new Error('Missing STRAPI_ADMIN_TOKEN (or STRAPI_TOKEN). Refusing to run without an explicit admin token.');
}

interface Permission {
  action: string;
  subject: string | null;
  properties: Record<string, any>;
  conditions: string[];
  role: number;
}

async function enableSectorPagePermissions() {
  console.log('🔐 Enabling permissions for sector-page content type...');
  console.log(`Strapi URL: ${STRAPI_URL}\n`);

  try {
    // Step 1: Get the Public role ID
    console.log('1. Fetching Public role...');
    const rolesResponse = await fetch(`${STRAPI_URL}/api/users-permissions/roles`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_ADMIN_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!rolesResponse.ok) {
      throw new Error(`Failed to fetch roles: ${rolesResponse.status} ${rolesResponse.statusText}`);
    }

    const rolesData = await rolesResponse.json() as { roles: Array<{ id: number; type: string; name: string }> };
    const publicRole = rolesData.roles.find(r => r.type === 'public');

    if (!publicRole) {
      throw new Error('Public role not found');
    }

    console.log(`✅ Found Public role (ID: ${publicRole.id})\n`);

    // Step 2: Get current permissions for Public role
    console.log('2. Fetching current permissions...');
    const permissionsResponse = await fetch(`${STRAPI_URL}/api/users-permissions/roles/${publicRole.id}`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_ADMIN_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!permissionsResponse.ok) {
      throw new Error(`Failed to fetch permissions: ${permissionsResponse.status} ${permissionsResponse.statusText}`);
    }

    const roleData = await permissionsResponse.json() as {
      role: { id: number; permissions: Permission[] };
    };

    console.log(`✅ Found ${roleData.role.permissions.length} existing permissions\n`);

    // Step 3: Add sector-page permissions
    console.log('3. Adding sector-page permissions...');
    const sectorPageActions = [
      'api::sector-page.sector-page.find',
      'api::sector-page.sector-page.findOne',
      'api::sector-page.sector-page.create',
      'api::sector-page.sector-page.update',
    ];

    const newPermissions = sectorPageActions.map(action => ({
      action,
      subject: null,
      properties: {},
      conditions: [],
      role: publicRole.id,
    }));

    // Merge with existing permissions
    const existingPermissionActions = new Set(roleData.role.permissions.map(p => p.action));
    const permissionsToAdd = newPermissions.filter(p => !existingPermissionActions.has(p.action));

    if (permissionsToAdd.length === 0) {
      console.log('✅ All sector-page permissions already exist\n');
    } else {
      console.log(`Adding ${permissionsToAdd.length} new permissions...`);
      const allPermissions = [...roleData.role.permissions, ...permissionsToAdd];

      // Step 4: Update role with new permissions
      const updateResponse = await fetch(`${STRAPI_URL}/api/users-permissions/roles/${publicRole.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${STRAPI_ADMIN_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permissions: allPermissions,
        }),
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`Failed to update permissions: ${updateResponse.status} ${updateResponse.statusText}\n${errorText}`);
      }

      console.log('✅ Successfully added sector-page permissions\n');
    }

    // Step 5: Verify permissions
    console.log('4. Verifying permissions...');
    const verifyResponse = await fetch(`${STRAPI_URL}/api/users-permissions/roles/${publicRole.id}`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_ADMIN_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const verifyData = await verifyResponse.json() as {
      role: { permissions: Permission[] };
    };

    const sectorPagePerms = verifyData.role.permissions.filter(p => 
      p.action.startsWith('api::sector-page.sector-page.')
    );

    console.log(`✅ Found ${sectorPagePerms.length} sector-page permissions:`);
    sectorPagePerms.forEach(p => {
      console.log(`   - ${p.action}`);
    });

    console.log('\n🎉 Permissions enabled successfully!');
    console.log('\nYou can now create sector pages via API.');
    console.log('Run: python3 scripts/create_sector_page.py');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run the script
enableSectorPagePermissions();

