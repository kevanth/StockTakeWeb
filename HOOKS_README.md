# Inventory Management Hooks

This document explains the implementation and usage of the custom hooks for managing inventory boxes and items.

## Overview

The inventory system uses two main hooks:

- `useBoxes` - Manages box operations and selection
- `useItems` - Manages item operations within a selected box

Both hooks are built on top of SWR for efficient data fetching, caching, and synchronization.

## Hooks Implementation

### useBoxes Hook

**Location**: `src/lib/hooks/useBoxes.ts`

**Features**:

- ✅ SWR integration with automatic caching
- ✅ URL-based box selection (persists across page refreshes)
- ✅ Optimistic updates for better UX
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Automatic cache invalidation

**Usage**:

```tsx
import { useBoxes } from "@/lib/hooks/useBoxes";

function MyComponent() {
  const {
    boxes, // Array of all boxes
    boxesLoading, // Loading state
    boxesError, // Error state
    activeBox, // Currently selected box
    activeBoxId, // ID of active box
    selectBox, // Function to select a box
    addBox, // Function to add a new box
    updateBox, // Function to update a box
    deleteBox, // Function to delete a box
    mutateBoxes, // Function to manually refresh cache
  } = useBoxes();

  // Example: Add a new box
  const handleAddBox = async () => {
    try {
      await addBox({ name: "New Box" });
      // Cache automatically updates
    } catch (error) {
      // Handle error
    }
  };
}
```

### useItems Hook

**Location**: `src/lib/hooks/useItems.ts`

**Features**:

- ✅ SWR integration with automatic caching
- ✅ Conditional fetching (only fetches when boxId is provided)
- ✅ Full CRUD operations for items
- ✅ Automatic cache invalidation
- ✅ Deduplication and revalidation controls

**Usage**:

```tsx
import { useItems } from "@/lib/hooks/useItems";

function MyComponent() {
  const boxId = "some-box-id";

  const {
    items, // Array of items in the box
    itemsLoading, // Loading state
    itemsError, // Error state
    addItem, // Function to add a new item
    updateItem, // Function to update an item
    deleteItem, // Function to delete an item
    mutateItems, // Function to manually refresh cache
  } = useItems(boxId);

  // Example: Add a new item
  const handleAddItem = async () => {
    try {
      await addItem({
        name: "New Item",
        boxId: boxId,
        // ... other item properties
      });
      // Cache automatically updates
    } catch (error) {
      // Handle error
    }
  };
}
```

## Key Improvements Made

### 1. **Modular Architecture**

- Separated concerns into dedicated hooks
- Removed duplicate SWR logic from components
- Made hooks reusable across different components

### 2. **URL-Based State Management**

- Box selection persists in URL parameters
- Users can bookmark specific box selections
- Browser back/forward navigation works correctly

### 3. **Optimistic Updates**

- UI updates immediately for better perceived performance
- Automatic rollback on errors
- Seamless user experience

### 4. **Shared Utilities**

- Common fetcher function in `src/lib/utils.ts`
- Consistent error handling across hooks
- DRY principle applied

### 5. **Better Error Handling**

- Comprehensive error states
- Toast notifications for user feedback
- Graceful fallbacks

### 6. **Type Safety**

- Full TypeScript support
- Proper type definitions for all operations
- IntelliSense support in IDEs

## Example Component

**Location**: `src/components/InventoryManager.tsx`

This component demonstrates the complete usage of both hooks:

- Box management (add, edit, delete, select)
- Item management (add, delete)
- Loading states and error handling
- User-friendly interface

## API Endpoints Required

The hooks expect these API endpoints to exist:

### Box API

- `GET /api/box` - Fetch all boxes
- `POST /api/box` - Create a new box
- `PUT /api/box/[id]` - Update a box
- `DELETE /api/box/[id]` - Delete a box

### Item API

- `GET /api/item?boxId=[id]` - Fetch items in a box
- `POST /api/item` - Create a new item
- `PUT /api/item/[id]` - Update an item
- `DELETE /api/item/[id]` - Delete an item

## Best Practices

### 1. **Error Boundaries**

Wrap components using these hooks in error boundaries for production use.

### 2. **Loading States**

Always handle loading states to provide good UX:

```tsx
if (boxesLoading) return <div>Loading...</div>;
if (boxesError) return <div>Error: {boxesError.message}</div>;
```

### 3. **Optimistic Updates**

The hooks handle optimistic updates automatically, but you can customize this behavior by using the `mutate` functions directly.

### 4. **Cache Management**

SWR handles most caching automatically, but you can use `mutateBoxes()` and `mutateItems()` for manual cache invalidation when needed.

## Future Enhancements

### 1. **Real-time Updates**

- WebSocket integration for live updates
- Collaborative editing support

### 2. **Advanced Caching**

- Persistent cache across sessions
- Offline support with service workers

### 3. **Search and Filtering**

- Debounced search functionality
- Advanced filtering options

### 4. **Bulk Operations**

- Multi-select functionality
- Batch delete/update operations

### 5. **Audit Trail**

- Track changes and modifications
- User activity logging

## Migration Guide

If you're migrating from the old inline SWR implementation:

1. **Replace direct SWR usage** with hook calls
2. **Update component props** to use hook return values
3. **Remove duplicate fetcher functions** (now shared in utils)
4. **Update error handling** to use hook error states
5. **Replace manual state management** with hook-provided state

## Troubleshooting

### Common Issues

1. **Items not loading**: Check if `activeBox?.id` is being passed to `useItems`
2. **Cache not updating**: Ensure you're calling the mutate functions after operations
3. **URL not updating**: Verify the `selectBox` function is being called correctly

### Debug Mode

Enable SWR debug mode for development:

```tsx
// In your app root
<SWRConfig
  value={{
    onError: (error) => console.log("SWR Error:", error),
    onSuccess: (data) => console.log("SWR Success:", data),
  }}
>
  {/* Your app */}
</SWRConfig>
```

## Performance Considerations

- **Deduplication**: SWR automatically deduplicates identical requests
- **Revalidation**: Configure revalidation intervals based on your needs
- **Cache size**: Monitor memory usage for large inventories
- **Network requests**: Hooks only fetch when necessary (conditional fetching)

This implementation provides a solid foundation for inventory management with excellent user experience and maintainable code structure.
