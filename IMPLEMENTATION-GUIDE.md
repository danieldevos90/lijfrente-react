# Implementation Guide: Drawer-Based Lead Form with Progress Persistence

## Overview
This guide outlines the implementation of a minimal, drawer-based lead form that slides from right to left, with automatic progress saving via cookies/localStorage.

---

## 1. Architecture Changes

### Component Structure
```
App
└── HomePage
    ├── StickyCTA (bottom button)
    └── LeadFormDrawer (slides from right)
        ├── DrawerHeader (close button, title)
        ├── DrawerProgress (dot indicators)
        ├── DrawerBody (scrollable content)
        │   └── StepContent (dynamic based on currentStep)
        └── DrawerFooter (back/next buttons, auto-save indicator)
```

---

## 2. Drawer Component Implementation

### Basic Drawer Structure

```typescript
// components/LeadFormDrawer.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { saveFormProgress, loadFormProgress, clearFormProgress } from '@/lib/formStorage';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadFormDrawer({ isOpen, onClose }: DrawerProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => loadFormProgress());
  
  // Auto-save on form data change
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      saveFormProgress(formData, currentStep);
    }
  }, [formData, currentStep]);
  
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay (desktop only) */}
      <div 
        className="drawer-overlay" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer Container */}
      <div className="drawer-container">
        <DrawerHeader onClose={onClose} />
        <DrawerProgress currentStep={currentStep} totalSteps={6} />
        <DrawerBody 
          currentStep={currentStep}
          formData={formData}
          setFormData={setFormData}
        />
        <DrawerFooter
          currentStep={currentStep}
          onBack={() => setCurrentStep(prev => prev - 1)}
          onNext={() => setCurrentStep(prev => prev + 1)}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
```

---

## 3. Progress Persistence (Cookie/LocalStorage)

### Storage Utility Functions

```typescript
// lib/formStorage.ts
const STORAGE_KEY = 'lead_form_progress';
const COOKIE_EXPIRY_DAYS = 7;

interface FormProgress {
  step: number;
  data: FormData;
  timestamp: number;
}

// Save to both localStorage and cookie for redundancy
export function saveFormProgress(data: FormData, step: number): void {
  const progress: FormProgress = {
    step,
    data,
    timestamp: Date.now()
  };
  
  // Save to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('localStorage unavailable', e);
  }
  
  // Save to cookie as backup
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);
  document.cookie = `${STORAGE_KEY}=${encodeURIComponent(JSON.stringify(progress))}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
}

export function loadFormProgress(): FormData {
  // Try localStorage first
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const progress: FormProgress = JSON.parse(stored);
      // Check if data is not too old (7 days)
      const daysSinceLastSave = (Date.now() - progress.timestamp) / (1000 * 60 * 60 * 24);
      if (daysSinceLastSave < 7) {
        return progress.data;
      }
    }
  } catch (e) {
    console.warn('Failed to load from localStorage', e);
  }
  
  // Fallback to cookie
  try {
    const cookies = document.cookie.split(';');
    const formCookie = cookies.find(c => c.trim().startsWith(`${STORAGE_KEY}=`));
    if (formCookie) {
      const value = decodeURIComponent(formCookie.split('=')[1]);
      const progress: FormProgress = JSON.parse(value);
      return progress.data;
    }
  } catch (e) {
    console.warn('Failed to load from cookie', e);
  }
  
  return {} as FormData;
}

export function clearFormProgress(): void {
  // Clear localStorage
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear localStorage', e);
  }
  
  // Clear cookie
  document.cookie = `${STORAGE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function getLastSavedStep(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const progress: FormProgress = JSON.parse(stored);
      return progress.step;
    }
  } catch (e) {
    // Silent fail
  }
  return 1;
}
```

---

## 4. CSS Styling (Minimal Drawer)

```css
/* components/LeadFormDrawer.css */

/* Overlay (desktop only) */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

@media (max-width: 768px) {
  .drawer-overlay {
    display: none; /* No overlay on mobile */
  }
}

/* Drawer Container */
.drawer-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 480px;
  background: white;
  box-shadow: -8px 0 40px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.3s ease-out;
}

@media (max-width: 768px) {
  .drawer-container {
    width: 100vw;
    box-shadow: none;
  }
}

/* Animations */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Drawer Header */
.drawer-header {
  padding: 1.5rem;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.drawer-header h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #0F172A;
}

.drawer-close-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #64748B;
  border-radius: 6px;
  transition: background 0.15s ease;
}

.drawer-close-btn:hover {
  background: #f8fafc;
}

/* Progress Dots */
.drawer-progress {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: white;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #E2E8F0;
  transition: all 0.2s ease;
}

.progress-dot.active {
  background: #000000;
  width: 24px;
  border-radius: 4px;
}

.step-counter {
  margin-left: auto;
  font-size: 13px;
  color: #64748B;
}

/* Drawer Body */
.drawer-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 2rem 1.5rem;
}

@media (max-width: 768px) {
  .drawer-body {
    padding: 1.5rem 1rem;
  }
}

.drawer-body h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 0.75rem;
  color: #0F172A;
}

.drawer-body .description {
  font-size: 14px;
  color: #64748B;
  margin: 0 0 1.5rem;
}

/* Form Options (Single Column) */
.option-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 1.5rem;
}

.option-item {
  padding: 1rem;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.15s ease;
  font-size: 16px;
  color: #0F172A;
}

.option-item:hover {
  border-color: #000000;
  background: #f8fafc;
}

.option-item.selected {
  border-color: #000000;
  border-width: 2px;
  background: #f8fafc;
  font-weight: 600;
  padding: calc(1rem - 1px); /* Compensate for thicker border */
}

.option-radio {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-item.selected .option-radio {
  border-color: #000000;
}

.option-item.selected .option-radio::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #000000;
}

/* Drawer Footer */
.drawer-footer {
  padding: 1.5rem;
  border-top: 1px solid #E2E8F0;
  background: white;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
}

.footer-buttons {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .footer-buttons {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
  
  .footer-buttons.next-only {
    grid-template-columns: 1fr;
  }
}

.drawer-footer button {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
}

.btn-back {
  background: white;
  color: #0F172A;
  border: 1px solid #E2E8F0;
}

.btn-back:hover {
  border-color: #000000;
}

.btn-next {
  background: #000000;
  color: white;
}

.btn-next:hover {
  background: #1a1a1a;
}

.auto-save-indicator {
  font-size: 12px;
  color: #64748B;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

@media (max-width: 768px) {
  .drawer-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }
}
```

---

## 5. Key Features Implementation

### Auto-Save Debouncing

```typescript
// Hook for debounced auto-save
import { useEffect, useRef } from 'react';

export function useDebouncedAutoSave<T>(
  value: T,
  delay: number = 500,
  onSave: (value: T) => void
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      onSave(value);
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, onSave]);
}

// Usage in drawer component
useDebouncedAutoSave(formData, 500, (data) => {
  saveFormProgress(data, currentStep);
  setShowSaveIndicator(true);
  setTimeout(() => setShowSaveIndicator(false), 2000);
});
```

### Resume Progress on Return

```typescript
// In LeadFormDrawer component
useEffect(() => {
  if (isOpen) {
    const savedData = loadFormProgress();
    const savedStep = getLastSavedStep();
    
    if (Object.keys(savedData).length > 0 && savedStep > 1) {
      // Show option to resume
      setShowResumePrompt(true);
    }
  }
}, [isOpen]);

// Resume prompt component
{showResumePrompt && (
  <div className="resume-prompt">
    <p>Wilt u doorgaan waar u gebleven was?</p>
    <button onClick={() => {
      setCurrentStep(savedStep);
      setShowResumePrompt(false);
    }}>
      Doorgaan vanaf stap {savedStep}
    </button>
    <button onClick={() => {
      clearFormProgress();
      setFormData({});
      setCurrentStep(1);
      setShowResumePrompt(false);
    }}>
      Opnieuw beginnen
    </button>
  </div>
)}
```

---

## 6. Accessibility Considerations

- **Focus trap**: Keep focus within drawer when open
- **Keyboard navigation**: ESC to close, Tab to navigate
- **ARIA labels**: `role="dialog"`, `aria-labelledby`, `aria-describedby`
- **Screen reader announcements**: Announce step changes
- **Touch targets**: Minimum 44x44px on mobile

---

## 7. Performance Optimizations

- Lazy load drawer content
- Virtualize long option lists if needed
- Debounce auto-save to reduce writes
- Use CSS transforms for animations (GPU acceleration)
- Minimize re-renders with React.memo on sub-components

---

## 8. Testing Checklist

- [ ] Drawer slides in/out smoothly
- [ ] Progress saves on field change
- [ ] Progress persists after page reload
- [ ] Resume prompt appears correctly
- [ ] Mobile view is full-width
- [ ] Desktop view is 480px
- [ ] Overlay closes drawer when clicked
- [ ] ESC key closes drawer
- [ ] Auto-save indicator shows confirmation
- [ ] Cookie/localStorage fallback works
- [ ] Old data expires after 7 days
- [ ] Form validation works per step
- [ ] Navigation buttons disabled appropriately
- [ ] Responsive at all breakpoints

---

## Next Steps

1. Update existing modal components to drawer layout
2. Implement storage utilities
3. Add auto-save functionality
4. Test on desktop and mobile
5. Update Stitch prompts for drawer design
6. Implement minimal styling
7. Add accessibility features
8. Performance testing

