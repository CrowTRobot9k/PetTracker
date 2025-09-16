# Owner Photos Lazy Loading Implementation

This document describes the implementation of separate API calls for owner photos with lazy loading in the image carousel to minimize data retrieval.

## Overview

The owner photos are now loaded separately from the main owner data to reduce the payload size of the initial API call. Photos are lazy-loaded when the image carousel becomes visible using the Intersection Observer API.

## Changes Made

### 1. Backend API Changes

#### New API Endpoint
**File:** `PetTracker.Server/Controllers/OwnerController.cs`
- Added `GetOwnerPhotos(int ownerId)` endpoint
- Returns photos for a specific owner only when requested

#### Service Layer Updates
**File:** `PetTracker.Infrastucture/Services/IOwnerService.cs`
- Added `GetOwnerPhotos(int ownerId)` method signature

**File:** `PetTracker.Infrastucture/Services/OwnerService.cs`
- Implemented `GetOwnerPhotos` method
- Uses explicit includes for `FileUploadMappings` and `FileUpload`
- Returns `List<FileModelDto>` instead of including photos in owner data

#### DTO Updates
**File:** `PetTracker.Domain/DTOs/GetOwnerDto.cs`
- Removed `OwnerPhotos` property to reduce payload
- Photos are now loaded separately via dedicated API

### 2. Frontend Store Updates

#### OwnersStore Enhancement
**File:** `PetTracker.UI/src/Stores/OwnersStore.tsx`
- Added `loadingOwnerPhotos` state
- Added `ownerPhotos` object to store photos by ownerId
- Added `getOwnerPhotos(ownerId)` async method
- Added `getOwnerPhotosSync(ownerId)` sync method for immediate access

### 3. Component Updates

#### Carousel Component Enhancement
**File:** `PetTracker.UI/src/Components/Carousel/Carousel.tsx`
- Added `onVisible` prop support
- Implemented Intersection Observer for lazy loading
- Triggers callback when carousel becomes visible (10% threshold)
- Uses 50px root margin for pre-loading

#### ViewOwners Component Updates
**File:** `PetTracker.UI/src/Components/Owners/ViewOwners.tsx`
- Updated `getOwnerSlides` to use ownerId instead of photos array
- Added `loadOwnerPhotos` function for lazy loading
- Updated carousel usage to trigger photo loading on visibility
- Photos are now loaded from store instead of owner object

#### ViewOwner Component Updates
**File:** `PetTracker.UI/src/Components/Owners/ViewOwner.tsx`
- Updated to load photos separately when dialog opens
- Added `loadOwnerPhotos` function for dialog photo loading
- Removed dependency on `viewOwner.ownerPhotos`

## Benefits

### 1. **Reduced Initial Payload**
- Owner list API no longer includes photo data
- Significantly smaller response size for owner listings
- Faster initial page load

### 2. **Lazy Loading Performance**
- Photos only load when carousel becomes visible
- Uses Intersection Observer for efficient visibility detection
- Pre-loading with 50px margin for smooth user experience

### 3. **Memory Efficiency**
- Photos are cached in store by ownerId
- No duplicate photo loading for the same owner
- Efficient memory usage

### 4. **Better User Experience**
- Faster initial page load
- Smooth photo loading as user scrolls
- Placeholder images shown until photos load

## API Endpoints

### Get Owners (Updated)
```
GET /api/Owner/GetOwners
```
- Returns owner data without photos
- Reduced payload size

### Get Owner Photos (New)
```
GET /api/Owner/GetOwnerPhotos?ownerId={id}
```
- Returns photos for specific owner
- Called only when needed

## Implementation Details

### Lazy Loading Logic
```typescript
const loadOwnerPhotos = async (ownerId) => {
    const existingPhotos = getOwnerPhotosSync(ownerId);
    if (!existingPhotos || existingPhotos.length === 0) {
        await getOwnerPhotos(ownerId);
    }
}
```

### Intersection Observer Configuration
```typescript
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !hasTriggered) {
                onVisible();
                setHasTriggered(true);
                observer.disconnect();
            }
        });
    },
    {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: '50px' // Start loading 50px before visible
    }
);
```

### Store State Management
```typescript
ownerPhotos: {}, // Store photos by ownerId
loadingOwnerPhotos: false,
getOwnerPhotos: async (ownerId) => { /* API call */ },
getOwnerPhotosSync: (ownerId) => { /* Sync access */ }
```

## Migration Notes

### Breaking Changes
- `GetOwnerDto.OwnerPhotos` property removed
- Owner objects no longer contain photo data
- ViewOwners component now requires ownerId for photo loading

### Backward Compatibility
- All existing owner data remains unchanged
- Photo loading is transparent to end users
- Placeholder images shown during loading

## Testing Recommendations

1. **Performance Testing**
   - Measure initial page load time
   - Verify reduced API response size
   - Test lazy loading behavior

2. **User Experience Testing**
   - Verify smooth photo loading
   - Test placeholder image display
   - Ensure no broken images

3. **Edge Cases**
   - Test with owners having no photos
   - Test with large numbers of owners
   - Test network failure scenarios

## Future Enhancements

1. **Photo Caching**
   - Implement persistent photo caching
   - Add cache expiration logic
   - Optimize for offline scenarios

2. **Progressive Loading**
   - Load thumbnail versions first
   - Implement progressive image enhancement
   - Add loading indicators

3. **Performance Optimization**
   - Implement virtual scrolling for large owner lists
   - Add photo compression
   - Optimize image formats

The implementation successfully separates photo loading from owner data retrieval, providing better performance and user experience through lazy loading.

