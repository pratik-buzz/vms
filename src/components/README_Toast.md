# Toast Notification System

A reusable toast notification system for success and failure messages with smooth animations and customizable styling.

## Features

- ✅ Success, Error, Warning, and Info toast types
- 🎨 Beautiful animations with slide-in/out effects
- ⏰ Auto-dismiss with customizable duration
- 🎯 Easy-to-use hook-based API
- 📱 Responsive design
- 🎨 Tailwind CSS styling

## Usage

### Basic Usage

```tsx
import { useToast } from '../contexts/ToastContext';

function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const handleSuccess = () => {
    showSuccess('Vendor added successfully!');
  };

  const handleError = () => {
    showError('Failed to add vendor. Please try again.');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Add Vendor</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
}
```

### Advanced Usage

```tsx
import { useToast } from '../contexts/ToastContext';

function MyComponent() {
  const { showToast } = useToast();

  const handleCustomToast = () => {
    showToast('Custom message', 'warning', 3000); // 3 seconds duration
  };

  return (
    <button onClick={handleCustomToast}>Show Custom Toast</button>
  );
}
```

## API Reference

### useToast Hook

The `useToast` hook provides the following methods:

#### showSuccess(message: string, duration?: number)
Shows a success toast with green styling and checkmark icon.

#### showError(message: string, duration?: number)
Shows an error toast with red styling and X icon.

#### showWarning(message: string, duration?: number)
Shows a warning toast with yellow styling and warning icon.

#### showInfo(message: string, duration?: number)
Shows an info toast with blue styling and info icon.

#### showToast(message: string, type?: 'success' | 'error' | 'warning' | 'info', duration?: number)
Generic method to show any type of toast.

### Parameters

- `message`: The text to display in the toast
- `type`: The type of toast (success, error, warning, info)
- `duration`: Auto-dismiss duration in milliseconds (default: 5000ms)

## Examples

### Success Toast
```tsx
showSuccess('Vendor added successfully!');
```

### Error Toast
```tsx
showError('Failed to add vendor. Please try again.');
```

### Warning Toast
```tsx
showWarning('Please check all required fields.');
```

### Info Toast
```tsx
showInfo('Processing your request...');
```

### Custom Duration
```tsx
showSuccess('Quick success message', 2000); // 2 seconds
```

## Styling

The toast system uses Tailwind CSS classes and includes:

- **Success**: Green background with checkmark icon
- **Error**: Red background with X icon  
- **Warning**: Yellow background with warning icon
- **Info**: Blue background with info icon

All toasts include:
- Smooth slide-in/out animations
- Auto-dismiss functionality
- Manual close button
- Responsive design
- Shadow and border styling

## Integration

The toast system is already integrated into your app layout. The `ToastProvider` wraps your entire application, making the `useToast` hook available in any component.

## File Structure

```
src/
├── components/
│   ├── Toast.tsx              # Individual toast component
│   └── ToastContainer.tsx      # Container for multiple toasts
├── contexts/
│   └── ToastContext.tsx         # Context provider and hook
└── app/
    └── layout.tsx              # ToastProvider integration
```
