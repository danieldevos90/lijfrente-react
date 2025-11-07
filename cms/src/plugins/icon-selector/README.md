# Icon Selector Plugin

A Strapi v5 plugin that provides a custom field type for selecting icons from the icon library.

## Structure

```
icon-selector/
├── package.json              # Plugin metadata
├── server/
│   └── src/
│       └── index.ts         # Server-side custom field registration
└── admin/
    └── src/
        └── index.tsx        # Admin UI component registration
```

## How It Works

1. **Server-side** (`server/src/index.ts`):
   - Registers the custom field type `plugin::icon-selector.icon-selector`
   - Makes it available during schema validation
   - Runs before schemas are loaded

2. **Admin-side** (`admin/src/index.tsx`):
   - Registers the admin UI component
   - Provides the visual icon selector interface
   - Uses the IconSelector component from `src/admin/components/IconSelector`

## Usage in Schemas

Components can use this custom field:

```json
{
  "iconPath": {
    "type": "customField",
    "customField": "plugin::icon-selector.icon-selector",
    "required": true
  }
}
```

## Icon Component Location

The IconSelector React component is located at:
- `src/admin/components/IconSelector/index.tsx`

This component provides:
- Visual icon browser
- Search functionality
- Category filtering
- Icon preview

## Deployment

The plugin is automatically discovered by Strapi when placed in `src/plugins/`. No additional configuration needed.

