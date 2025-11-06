# Feature Showcase Component - Visual Guide

## 🖼️ Component Anatomy

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  ┌────────────┐  Background Image                │
│  │ 👤 +$210   │  Badge (with icon + text)        │
│  └────────────┘  Position: top-left              │
│                                                  │
│                                                  │
│            [Main Content Area]                   │
│                                                  │
│                                                  │
│  ┌──────────────────────────────────────────┐   │
│  │ ✓ Wage disbursement complete             │   │
│  └──────────────────────────────────────────┘   │
│  Bottom Overlay (optional)                       │
└──────────────────────────────────────────────────┘
```

## 🎨 Badge Positioning Options

```
┌─────────────────────────────────┐
│  top-left    top-center    top-right
│      ▪           ▪              ▪
│
│
│              center
│                ▪
│
│
│  bottom-left  bottom-center  bottom-right
│      ▪           ▪              ▪
└─────────────────────────────────┘
```

## 📐 Layout Options

### Grid-2 (Default)
```
┌──────────┐  ┌──────────┐
│  Card 1  │  │  Card 2  │
└──────────┘  └──────────┘
```

### Grid-3
```
┌─────┐  ┌─────┐  ┌─────┐
│  1  │  │  2  │  │  3  │
└─────┘  └─────┘  └─────┘
```

### Grid-4
```
┌───┐  ┌───┐  ┌───┐  ┌───┐
│ 1 │  │ 2 │  │ 3 │  │ 4 │
└───┘  └───┘  └───┘  └───┘
```

### Slider
```
┌─────┐  ┌─────┐  ┌─────┐
│  1  │  │  2  │  │  3  │  ───►
└─────┘  └─────┘  └─────┘
         [Scroll]
```

## 🎯 Badge Component Structure

```
┌─────────────────────────────────┐
│  ┌──────┐                       │
│  │  [o] │  Badge Text            │ ← Badge Container
│  └──────┘                       │   (with background color)
│     ↑                           │
│  Icon Circle                    │
│  (image or emoji)               │
└─────────────────────────────────┘
```

## 📱 Responsive Behavior

### Desktop (> 768px)
```
┌──────────────────────────────────────┐
│  ┌────────────┐    ┌────────────┐   │
│  │            │    │            │   │
│  │   Card 1   │    │   Card 2   │   │
│  │            │    │            │   │
│  └────────────┘    └────────────┘   │
└──────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────┐
│              │
│    Card 1    │
│              │
└──────────────┘

┌──────────────┐
│              │
│    Card 2    │
│              │
└──────────────┘
```

## 🔄 Data Flow

```
Strapi CMS
    ↓
[Feature Showcase Schema]
    ↓
[Feature Card Schema]
    ↓
Next.js Frontend
    ↓
[FeatureShowcase Component]
    ↓
[FeatureCard Component × N]
    ↓
Rendered HTML
```

## 🎨 Color System

```
Badge Colors:
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ #e9d │ │ #bfd │ │ #d1f │ │ #fbc │
│ Purple│ │ Blue │ │Green │ │ Pink │
└──────┘ └──────┘ └──────┘ └──────┘

Overlay Colors:
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│Success│ │ Info │ │ Warn │ │Neutra│
│ Green │ │ Blue │ │Yellow│ │ Gray │
└──────┘ └──────┘ └──────┘ └──────┘
```

## 🏗️ Component Hierarchy

```
FeatureShowcase
├── Section Header (optional)
│   ├── Title
│   └── Description
└── Grid/Slider Container
    ├── FeatureCard 1
    │   ├── Background Image
    │   ├── Badge
    │   │   ├── Icon Circle
    │   │   └── Badge Text
    │   └── Overlay (optional)
    │       ├── Icon
    │       └── Text
    ├── FeatureCard 2
    └── FeatureCard N...
```

## ⚙️ Configuration Example

```json
{
  "title": "Our Features",
  "layout": "grid-2",
  "featureCards": [
    {
      "backgroundImage": "/image1.jpg",
      "iconEmoji": "💰",
      "badgeText": "+$210.10",
      "badgeColor": "#e9d5ff",
      "badgePosition": "top-left"
    },
    {
      "backgroundImage": "/image2.jpg",
      "iconEmoji": "✓",
      "overlayText": "Complete",
      "overlayColor": "#d1fae5",
      "badgePosition": "bottom-center"
    }
  ]
}
```

## 🎭 Visual States

### Default State
```
┌──────────────┐
│  ┌─────┐     │
│  │ Icon│ Text│
│  └─────┘     │
│              │
│   Content    │
│              │
└──────────────┘
```

### Hover State
```
┌──────────────┐  ↑ Lift up
│  ┌─────┐     │  🔍 Scale badge
│  │ Icon│ Text│  ✨ Enhanced shadow
│  └─────┘     │
│              │
│   Content    │
│              │
└──────────────┘
```

### Loading State
```
┌──────────────┐
│ ░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░ │  ⟳ Shimmer effect
│ ░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░ │
└──────────────┘
```

## 🧩 Integration Points

```
Your Page Component
    ↓
┌─────────────────────────┐
│  Page Layout            │
│  ┌───────────────────┐  │
│  │ Header            │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ Hero Section      │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ Feature Showcase  │  │ ← New Component Here
│  │  ┌─────┐  ┌─────┐ │  │
│  │  │Card1│  │Card2│ │  │
│  │  └─────┘  └─────┘ │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ Footer            │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

## 📊 Use Case Matrix

| Use Case | Badge Position | Icon Type | Overlay |
|----------|---------------|-----------|---------|
| Payment Notification | top-left | Avatar | No |
| Status Update | bottom-center | Emoji | Yes |
| Feature Highlight | top-right | Emoji | No |
| Achievement | center | Image | Yes |
| Process Step | top-center | Number | Yes |

## 🎬 Animation Timeline

```
Card Enter Animation:
0ms    ────────────────────────────────►
       [Fade In + Slide]

200ms  ────────────►
       [Badge Appears]

400ms  ──────►
       [Icon Scale In]

600ms  ───────────►
       [Overlay Slide Up]
```

## 🔍 Example Scenarios

### Scenario 1: Payment App
```
Card 1:
┌─────────────────┐
│ 👤 +$210.10     │ ← Person paid
│                 │
│  Happy Couple   │
└─────────────────┘

Card 2:
┌─────────────────┐
│                 │
│ Person Working  │
│ ✓ Wage complete │ ← Task done
└─────────────────┘
```

### Scenario 2: Product Features
```
Card 1:
┌─────────────────┐
│ 🚀 2x Faster    │
│                 │
│  Speed Demo     │
└─────────────────┘

Card 2:
┌─────────────────┐
│ 🔒 Secure       │
│                 │
│ Security Image  │
└─────────────────┘
```

### Scenario 3: Process Steps
```
Card 1:
┌─────────────────┐
│ 1️⃣ Upload       │
│                 │
│ Upload Screen   │
└─────────────────┘

Card 2:
┌─────────────────┐
│                 │
│ Process Screen  │
│ ✓ Step Complete │
└─────────────────┘
```

## 📏 Recommended Dimensions

```
Background Image:
┌──────────────────┐
│                  │  800px × 600px
│     16:9 or      │  (or similar)
│     4:3 ratio    │  Min: 600px width
│                  │
└──────────────────┘

Icon Image:
┌────┐
│ 👤 │  40px × 40px
└────┘  (circular)

Badge:
┌──────────────┐
│ [o] Text     │  Auto-width
└──────────────┘  Height: ~48px

Overlay:
┌──────────────────┐
│ Text content     │  Full width
└──────────────────┘  Height: auto
```

## ✅ Quality Checklist

Before publishing:
- [ ] Images are high quality (800px+)
- [ ] Badge text is readable (< 15 chars)
- [ ] Colors have good contrast
- [ ] Tested on mobile device
- [ ] Alt text provided for images
- [ ] Preview looks correct
- [ ] No spelling errors
- [ ] Badge doesn't cover key content

---

**This visual guide complements the technical documentation.**
**For implementation details, see FEATURE_SHOWCASE_README.md**

