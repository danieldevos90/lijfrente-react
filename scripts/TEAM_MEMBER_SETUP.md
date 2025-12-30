# Team Member Content Type Setup

Since Strapi Cloud doesn't allow programmatic content type creation, you need to create the `team-member` content type manually.

## Steps to Create Team Member Content Type

1. **Go to Strapi Admin**
   - Visit: https://bright-smile-1f47bc9d67.strapiapp.com/admin
   - Log in with your credentials

2. **Create New Collection Type**
   - Navigate to: **Content-Type Builder** (left sidebar)
   - Click: **"Create new collection type"**
   - Display name: **"Team Member"**
   - API ID (singular): **"team-member"**
   - API ID (plural): **"team-members"**
   - Click: **"Continue"**

3. **Add Fields**
   Click **"Add another field"** for each field:

   - **siteId** (Text)
     - Type: Text
     - Required: ✅ Yes
     - Default value: (leave empty)
   
   - **name** (Text)
     - Type: Text
     - Required: ✅ Yes
     - Default value: (leave empty)
   
   - **role** (Text)
     - Type: Text
     - Required: ✅ Yes
     - Default value: (leave empty)
   
   - **bio** (Text)
     - Type: Long text
     - Required: ✅ Yes
     - Default value: (leave empty)
   
   - **email** (Email)
     - Type: Email
     - Required: ❌ No
     - Default value: (leave empty)
   
   - **linkedin** (Text)
     - Type: Text
     - Required: ❌ No
     - Default value: (leave empty)
   
   - **image** (Media)
     - Type: Media
     - Multiple: ❌ No (Single)
     - Required: ❌ No
     - Allowed types: Images only
   
   - **order** (Number)
     - Type: Number
     - Required: ❌ No
     - Default value: 0
     - Min: 0

4. **Save the Content Type**
   - Click: **"Save"** (top right)
   - Wait for Strapi to restart

5. **Enable Permissions**
   - Navigate to: **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
   - Find: **Team-member** section
   - Enable:
     - ✅ `find`
     - ✅ `findOne`
     - ❌ `create` (leave disabled)
     - ❌ `update` (leave disabled)
     - ❌ `delete` (leave disabled)
   - Click: **"Save"**

6. **Create Team Members**
   After the content type is created, run:
   ```bash
   cd scripts
   export STRAPI_TOKEN='your-token-here'
   python3 create_team_members.py
   ```

   Or create them manually in Strapi Admin:
   - Navigate to: **Content Manager** → **Team Member**
   - Click: **"Create new entry"**
   - Fill in the fields for Erik de Vos and Jan Dijkerman
   - Click: **"Save"** and **"Publish"**

## Field Summary

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| siteId | Text | Yes | Site identifier (e.g., "geldgeregeld") |
| name | Text | Yes | Full name of team member |
| role | Text | Yes | Job title/role |
| bio | Long text | Yes | Biography/description |
| email | Email | No | Email address |
| linkedin | Text | No | LinkedIn profile URL |
| image | Media | No | Profile photo |
| order | Number | No | Display order (0, 1, 2, ...) |

## Verification

After setup, verify the API works:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://bright-smile-1f47bc9d67.strapiapp.com/api/team-members?filters[siteId][$eq]=geldgeregeld"
```

You should see the team members in the response.
