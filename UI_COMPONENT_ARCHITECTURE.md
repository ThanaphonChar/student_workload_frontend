# iOS-Style UI Component System Architecture

## 📁 Folder Structure

```
/src
└── components/
    ├── common/                    # Legacy/existing components
    │   ├── Button.jsx
    │   ├── TextInput.jsx
    │   └── LoadingSpinner.jsx
    │
    ├── ui/                        # NEW: Centralized reusable UI system
    │   ├── index.js              # Central export point
    │   │
    │   └── switches/             # Switch components module
    │       ├── IOSSwitch.jsx     # iOS-style switch implementation
    │       └── index.js          # Module exports
    │
    ├── subjects/                 # Feature-specific components
    └── layout/                   # Layout components
```

---

## 🧠 Architecture Decisions

### 1. **Why `/components/ui` exists**

**Problem**: Without a dedicated UI system, teams end up with:
- Styled components scattered across pages
- Duplicate styling logic (same switch styled 5 different ways)
- No single source of truth for design system
- Difficult onboarding for new developers

**Solution**: `/components/ui` serves as the **single source of truth** for all reusable, styled UI primitives.

**Benefits**:
- ✅ Centralized: All design decisions live in one place
- ✅ Discoverable: New developers know where to find components
- ✅ Maintainable: Update styling in one file, reflect everywhere
- ✅ Scalable: Easy to add new components without refactoring

---

### 2. **Why Styling is Encapsulated**

**Design Pattern**: **Encapsulation Principle**

```jsx
// ❌ BAD: Styling leaks into consumer code
<Switch 
  sx={{ 
    width: 42, 
    height: 26,
    '& .MuiSwitch-track': { backgroundColor: '#34C759' }
  }} 
/>

// ✅ GOOD: Consumer only sees semantic props
<IOSSwitch checked={isActive} onChange={handleToggle} />
```

**Why This Matters**:
- **Separation of Concerns**: Pages handle business logic, UI components handle presentation
- **DRY Principle**: Write styling once, reuse everywhere
- **Change Isolation**: Redesigning the switch requires editing only `IOSSwitch.jsx`
- **Type Safety**: Props are documented and validated at the component level

---

### 3. **How This Prevents Style Duplication**

**Before** (without component system):
```jsx
// Page A
<Switch sx={{ width: 42, backgroundColor: '#34C759' }} />

// Page B  
<Switch sx={{ width: 42, backgroundColor: '#34C759' }} />

// Page C (inconsistent!)
<Switch sx={{ width: 40, backgroundColor: '#32C858' }} />
```

**After** (with component system):
```jsx
// Page A, B, C - all identical
<IOSSwitch checked={value} onChange={handler} />
```

**Result**: 
- 3 duplicated styled switches → 1 reusable component
- 20+ lines of styling code → 1 import statement
- 100% visual consistency across the app

---

### 4. **How This Scales**

**Current State**:
```
/ui
└── switches/
    └── IOSSwitch.jsx
```

**6 Months Later** (adding iOS-style buttons):
```
/ui
├── switches/
│   ├── IOSSwitch.jsx
│   └── IOSToggleSwitch.jsx    # New variant
│
└── buttons/
    ├── IOSButton.jsx           # New component
    └── IOSIconButton.jsx
```

**Import Path Stability**:
```jsx
// Imports never break as system grows
import { IOSSwitch, IOSButton, IOSIconButton } from '@/components/ui';
```

**Key Scalability Features**:
1. **Module-based organization**: Each component type gets its own folder
2. **Consistent naming**: `IOS` prefix signals design system membership
3. **Backward compatible**: Adding new components doesn't affect existing ones
4. **Zero refactoring**: Old code continues working as new components are added

---

## 📦 Usage Examples

### Example 1: Form Field (Current Implementation)
```jsx
// SubjectForm.jsx
import { IOSSwitch } from '../ui';

export const SubjectForm = () => {
  const [formData, setFormData] = useState({
    count_workload: true
  });

  return (
    <label className="flex items-center space-x-2">
      <IOSSwitch
        checked={formData.count_workload}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          count_workload: e.target.checked
        }))}
      />
      <span>นับชั่วโมงภาระงาน</span>
    </label>
  );
};
```

### Example 2: Settings Toggle
```jsx
// SettingsPage.jsx
import { IOSSwitch } from '@/components/ui';

export const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="setting-row">
      <span>Enable Notifications</span>
      <IOSSwitch 
        checked={notifications}
        onChange={(e) => setNotifications(e.target.checked)}
      />
    </div>
  );
};
```

### Example 3: Disabled State
```jsx
<IOSSwitch 
  checked={isPremiumFeature}
  onChange={handleToggle}
  disabled={!user.isPremium}
/>
```

---

## 🔒 Maintenance Contract

**Component Consumers Promise**:
- Never add inline styles to `IOSSwitch`
- Never wrap it with additional styled components
- Never copy-paste the internal implementation

**Component Maintainers Promise**:
- Keep the API stable (breaking changes require major version bump)
- Document all props with JSDoc
- Support backward compatibility when adding features

---

## 🚀 Future Enhancements

When the system matures, consider adding:

### 1. Size Variants
```jsx
<IOSSwitch size="small" />
<IOSSwitch size="medium" /> {/* default */}
<IOSSwitch size="large" />
```

### 2. Color Variants
```jsx
<IOSSwitch color="success" /> {/* green */}
<IOSSwitch color="error" />   {/* red */}
<IOSSwitch color="warning" /> {/* orange */}
```

### 3. Theme Integration (Optional)
```jsx
// theme/muiTheme.js
export const theme = createTheme({
  components: {
    IOSSwitch: {
      defaultProps: {
        size: 'medium',
      },
    },
  },
});
```

---

## ✅ Success Metrics

This system succeeds when:
- ✅ No styled switches exist outside `/components/ui`
- ✅ All switches look identical across the app
- ✅ New developers can add switches in < 30 seconds
- ✅ Redesigning switches requires editing only 1 file
- ✅ The codebase passes "Don't Repeat Yourself" audits

---

## 📚 Related Patterns

This architecture follows:
- **Component-Based Architecture** (React best practice)
- **Atomic Design** (UI components as building blocks)
- **Separation of Concerns** (styling vs logic)
- **Open/Closed Principle** (open for extension, closed for modification)

---

**Built with ❤️ for long-term maintainability**
