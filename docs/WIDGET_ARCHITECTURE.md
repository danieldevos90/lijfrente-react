# Widget Global Architecture

## Component Hierarchy

```
┌─────────────────────────────────────────────┐
│           app/layout.tsx (Root)             │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │   GlobalWidgetProvider (Context)      │ │
│  │                                       │ │
│  │  State: isDrawerOpen, openDrawer(),  │ │
│  │         closeDrawer()                 │ │
│  │                                       │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │     All Pages (children)        │ │ │
│  │  │                                 │ │ │
│  │  │  - page.tsx (homepage)          │ │ │
│  │  │  - over-ons/page.tsx            │ │ │
│  │  │  - contact/page.tsx             │ │ │
│  │  │  - hoe-werkt-het/page.tsx       │ │ │
│  │  │  - faq/page.tsx                 │ │ │
│  │  │  - Any other pages...           │ │ │
│  │  │                                 │ │ │
│  │  │  Each uses: useWidget() hook    │ │ │
│  │  └─────────────────────────────────┘ │ │
│  │                                       │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │   DrawerWidget Component        │ │ │
│  │  │   (Rendered Once at Root)       │ │ │
│  │  └─────────────────────────────────┘ │ │
│  └───────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## Data Flow

### Opening the Widget

```
1. User clicks CTA button on any page
        ↓
2. Page calls: openDrawer('page_source')
        ↓
3. GlobalWidgetProvider updates state
        ↓
4. GTM tracking event fired
        ↓
5. DrawerWidget receives isOpen=true
        ↓
6. Widget slides in from right
```

### Closing the Widget

```
1. User clicks close button / overlay / ESC key
        ↓
2. DrawerWidget calls: onClose()
        ↓
3. GlobalWidgetProvider updates state
        ↓
4. GTM tracking event fired
        ↓
5. DrawerWidget receives isOpen=false
        ↓
6. Widget slides out
```

## Example Usage

### Homepage (app/page.tsx)
```tsx
"use client";
import { useWidget } from '../components/GlobalWidgetProvider';

export default function HomePage() {
  const { openDrawer } = useWidget();
  
  return (
    <button onClick={() => openDrawer('hero_primary')}>
      Start aanvraag
    </button>
  );
}
```

### Over Ons (app/over-ons/page.tsx)
```tsx
"use client";
import { useWidget } from '../../components/GlobalWidgetProvider';

export default function OverOnsPage() {
  const { openDrawer } = useWidget();
  
  const handleCtaClick = () => {
    openDrawer('over_ons_page');
  };
  
  return (
    <CTASection onButtonClick={handleCtaClick} />
  );
}
```

### Contact (app/contact/page.tsx)
```tsx
"use client";
import { useWidget } from '../../components/GlobalWidgetProvider';

export default function ContactPage() {
  const { openDrawer } = useWidget();
  
  return (
    <TransparentHeader 
      onCtaClick={() => openDrawer('contact_page')} 
    />
  );
}
```

## Benefits

### Single Source of Truth
- ✅ Widget state managed in one place
- ✅ Consistent behavior across all pages
- ✅ No duplicate widget instances

### Performance
- ✅ Widget loaded once, not per page
- ✅ React Context prevents unnecessary re-renders
- ✅ Faster page transitions

### Developer Experience
- ✅ Simple `useWidget()` hook
- ✅ No need to import DrawerWidget on every page
- ✅ Centralized tracking logic

### User Experience
- ✅ Form data persists across page navigation
- ✅ Seamless experience throughout site
- ✅ Widget available on every page

## Tracking Integration

All widget interactions are tracked via GTM:

```javascript
// Widget opened
dataLayer.push({
  event: 'cta_drawer_open',
  source: 'hero_primary' // Unique per page/button
});

// Widget closed
dataLayer.push({
  event: 'cta_drawer_close'
});

// Step completed
dataLayer.push({
  event: 'drawer_step_complete',
  step: 1
});

// Form submitted
dataLayer.push({
  event: 'form_submit',
  form_type: 'drawer_widget'
});
```

## Adding Widget to New Pages

To add the widget to any new page:

1. **Make it a Client Component**
   ```tsx
   "use client";
   ```

2. **Import the hook**
   ```tsx
   import { useWidget } from '../components/GlobalWidgetProvider';
   ```

3. **Use the hook**
   ```tsx
   const { openDrawer } = useWidget();
   ```

4. **Trigger on button click**
   ```tsx
   <button onClick={() => openDrawer('new_page_source')}>
     Open Widget
   </button>
   ```

That's it! The widget is now available everywhere.



