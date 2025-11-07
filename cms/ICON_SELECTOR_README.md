# Icon Selector Field Type for Strapi

This custom field type allows content editors to easily select icons from the `/frontend/public/icons/SVG` folder directly in the Strapi admin panel.

## Features

- 🎨 Visual icon browser with preview
- 🔍 Search functionality to find icons quickly
- 📁 Category filtering (arrows, finance, interface, etc.)
- ✏️ Manual path input still available
- 📱 Responsive grid layout

## Setup

### 1. Generate Icon List

The icon list is automatically generated from the icons folder. Run this script whenever you add new icons:

```bash
python3 scripts/generate_icon_list.py
```

This creates `/cms/public/icons.json` with all available icons.

### 2. Rebuild Strapi Admin

After making changes to the admin panel, rebuild Strapi:

```bash
cd cms
npm run build
npm run develop
```

## Usage

### In Content-Type Builder

1. Go to **Content-Type Builder** in Strapi admin
2. Select a component or content type
3. Add a new field
4. Choose **Icon Selector** as the field type
5. Configure the field (required, etc.)
6. Save

### For Content Editors

1. When editing content, click the **"Browse Icons"** button
2. Use the search bar to find icons by name
3. Filter by category using the dropdown
4. Click an icon to select it
5. The icon path will be automatically filled in

## Updated Components

The following components now use the Icon Selector field type:

- `sections.hero-section` - `iconPath` field
- `shared.benefit-item` - `iconPath` field
- `shared.bento-item` - `iconPath` field
- `shared.service-item` - `icon` field
- `shared.trust-badge` - `icon` field
- `shared.button` - `icon` field

## Icon Paths

Icons are stored at `/icons/SVG/[category]/[name].svg` and are accessible from the frontend at `/icons/SVG/...`.

Example paths:
- `/icons/SVG/interface/zap.svg`
- `/icons/SVG/finance/wallet.svg`
- `/icons/SVG/arrows/arrow-right.svg`

## Technical Details

### Custom Field Registration

The field is registered in `/cms/src/admin/app.tsx`:

```typescript
app.addCustomField({
  name: 'icon-selector',
  pluginId: 'icon-selector',
  type: 'string',
  components: {
    Input: async () => {
      const component = await import('./components/IconSelector');
      return component.default;
    },
  },
});
```

### Component Schema

Components use the custom field type like this:

```json
{
  "iconPath": {
    "type": "customField",
    "customField": "plugin::icon-selector.icon-selector",
    "required": true,
    "description": "Icon SVG path"
  }
}
```

## Troubleshooting

### Icons not loading

1. Make sure `/cms/public/icons.json` exists
2. Run `python3 scripts/generate_icon_list.py` to regenerate it
3. Check browser console for fetch errors
4. Ensure Strapi is serving files from `/public` folder

### Field not appearing

1. Rebuild Strapi admin: `npm run build`
2. Restart Strapi: `npm run develop`
3. Clear browser cache
4. Check that the component schema uses `customField` type correctly

### Icon paths incorrect

- Icons should start with `/icons/SVG/`
- Check that the icon exists in `/frontend/public/icons/SVG/`
- Verify the path matches the frontend public folder structure

