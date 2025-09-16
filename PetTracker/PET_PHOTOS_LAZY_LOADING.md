# Pet Photos Lazy Loading Implementation

## Overview
This document describes the implementation of lazy loading for pet photos, similar to the owner photos implementation. This optimization reduces the initial data payload by separating pet photo retrieval into dedicated API calls and loading them only when needed.

## Changes Made

### Backend Changes

#### 1. PetService Interface (`IPetService.cs`)
- Added `Task<List<FileDownloadDto>> GetPetPhotos(int petId);` method signature

#### 2. PetService Implementation (`PetService.cs`)
- Added `GetPetPhotos` method that:
  - Uses explicit includes to load `FileUploadMappings` and `FileUpload` entities
  - Filters by `petId`
  - Returns `FileDownloadDto` objects with base64-encoded image data

#### 3. PetController (`PetController.cs`)
- Added `[HttpGet("GetPetPhotos")]` endpoint
- Returns JSON result with pet photos for the specified pet ID

#### 4. GetPetDto (`GetPetDto.cs`)
- Commented out `PetPhotos` property initialization in constructor
- Commented out `PetPhotos` property declaration
- Reduces initial payload size for pet data

### Frontend Changes

#### 1. Vite Configuration (`vite.config.ts`)
- Added proxy configuration for `/api/Pet/GetPetPhotos` endpoint

#### 2. PetsStore (`PetsStore.tsx`)
- Added `loadingPetPhotos` state
- Added `petPhotos` object to cache photos by `petId`
- Added `getPetPhotos` async method for API calls
- Added `getPetPhotosSync` method for synchronous access to cached photos

#### 3. ExistingPetStore (`ExistingPetStore.tsx`)
- Added same lazy loading functionality as PetsStore
- Supports pet photo loading for existing pets dialog

#### 4. ViewPets Component (`ViewPets.tsx`)
- Updated to use `getPetPhotos` and `getPetPhotosSync` from PetsStore
- Modified `getPetSlides` function to accept `petId` instead of `images` array
- Added `loadPetPhotos` function for lazy loading
- Updated Carousel component to use `onVisible` prop for intersection observer

#### 5. AddExistingPet Component (`AddExistingPet.tsx`)
- Updated to use `getPetPhotos` and `getPetPhotosSync` from ExistingPetStore
- Modified `getPetSlides` function for lazy loading
- Added `loadPetPhotos` function
- Updated Carousel component with `onVisible` prop

#### 6. ViewPet Dialog (`ViewPet.tsx`)
- Updated to load pet photos separately when dialog opens
- Uses `getPetPhotos` from PetsStore
- Removed dependency on `viewPet.petPhotos` property

## How It Works

### Lazy Loading Flow
1. **Initial Load**: Pet list loads without photo data (reduced payload)
2. **Intersection Observer**: When a pet carousel becomes visible, triggers photo loading
3. **API Call**: `GetPetPhotos` endpoint is called with the specific pet ID
4. **Caching**: Photos are stored in the store and cached by pet ID
5. **Display**: Photos are displayed in the carousel

### Performance Benefits
- **Reduced Initial Payload**: Pet list loads faster without photo data
- **On-Demand Loading**: Photos load only when needed (when visible)
- **Caching**: Photos are cached to avoid repeated API calls
- **Efficient Memory Usage**: Only visible pet photos are loaded

### API Endpoints
- **GET** `/api/Pet/GetPetPhotos?petId={id}` - Retrieves photos for a specific pet

### Store State Management
```typescript
// PetsStore state
{
  loadingPetPhotos: boolean,
  petPhotos: { [petId: number]: FileDownloadDto[] },
  getPetPhotos: (petId: number) => Promise<FileDownloadDto[]>,
  getPetPhotosSync: (petId: number) => FileDownloadDto[]
}
```

## Usage Examples

### Loading Pet Photos in Component
```typescript
const { getPetPhotos, getPetPhotosSync } = usePetsStore();

// Lazy load photos when carousel becomes visible
const loadPetPhotos = async (petId) => {
  const existingPhotos = getPetPhotosSync(petId);
  if (!existingPhotos || existingPhotos.length === 0) {
    await getPetPhotos(petId);
  }
};

// Get photos synchronously (from cache)
const photos = getPetPhotosSync(petId);
```

### Carousel with Lazy Loading
```typescript
<Carousel 
  cards={getPetSlides(petId, petType)} 
  onVisible={() => loadPetPhotos(petId)}
/>
```

## Benefits
1. **Improved Performance**: Faster initial page loads
2. **Reduced Bandwidth**: Only load photos when needed
3. **Better User Experience**: Faster pet list rendering
4. **Scalability**: Handles large numbers of pets with photos efficiently
5. **Consistent Pattern**: Matches the owner photos lazy loading implementation

## Future Considerations
- Consider implementing photo compression for even better performance
- Add loading indicators for photo loading states
- Implement photo preloading for better UX
- Consider implementing infinite scroll with photo lazy loading

