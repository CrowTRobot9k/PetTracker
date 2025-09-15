# Authentication System with localStorage

This document describes the new localStorage-based authentication system implemented in the PetTracker UI.

## Overview

The authentication system now uses localStorage to manage user sessions, reducing the number of API calls to the server and improving performance. User authentication state is persisted across browser sessions and page refreshes.

## Key Components

### 1. AuthStore (`src/Stores/AuthStore.tsx`)
- Centralized state management for authentication using Zustand
- Manages user data, authentication status, and loading states
- Handles localStorage operations for persistence
- Provides methods for login, logout, and authentication checks

### 2. useAuth Hook (`src/Hooks/useAuth.tsx`)
- Custom hook that provides a clean interface to the authentication store
- Exposes user state, authentication status, and actions
- Includes computed properties for easy access to user information

### 3. AuthorizeView Component (`src/Components/AuthorizeView.tsx`)
- Updated to use localStorage instead of making repeated API calls
- Initializes authentication state from localStorage on mount
- Only makes API calls when necessary (e.g., when localStorage is empty)

### 4. SignIn Component (`src/Pages/SignIn.tsx`)
- Updated to store user data in localStorage after successful login
- Fetches user information from server and persists it locally
- Uses the authentication store for state management

### 5. Logout Components
- `LogoutLink.tsx` and `AppAppBar.tsx` updated to clear localStorage on logout
- Immediate local state clearing for better user experience

## How It Works

### Login Flow
1. User submits login form
2. Server validates credentials and sets authentication cookies
3. Client fetches user data from `/getauth` endpoint
4. User data is stored in localStorage and authentication store
5. User is redirected to the main application

### Authentication Check
1. On app initialization, `AuthorizeView` checks localStorage for existing authentication
2. If valid authentication exists in localStorage, user is considered logged in
3. If no authentication in localStorage, makes a single API call to verify server-side authentication
4. If server confirms authentication, user data is stored locally

### Logout Flow
1. User clicks logout
2. localStorage is immediately cleared
3. Authentication store is updated
4. Server logout API is called (non-blocking)
5. User is redirected to sign-in page

## Benefits

- **Reduced API Calls**: Authentication state is managed locally, reducing server load
- **Better Performance**: Faster page loads and navigation
- **Persistent Sessions**: User remains logged in across browser sessions
- **Improved UX**: Immediate logout response and faster authentication checks
- **Offline Capability**: Basic authentication state persists even when offline

## Usage Examples

### Using the useAuth Hook
```tsx
import { useAuth } from '../Hooks/useAuth';

function MyComponent() {
    const { user, isAuthenticated, logout, userEmail } = useAuth();
    
    if (!isAuthenticated) {
        return <div>Please log in</div>;
    }
    
    return (
        <div>
            <p>Welcome, {userEmail}!</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
```

### Direct Store Usage
```tsx
import { useAuthStore } from '../Stores/AuthStore';

function MyComponent() {
    const { user, isAuthenticated, login, logout } = useAuthStore();
    
    // Component logic here
}
```

## localStorage Keys

- `petTracker_auth`: Boolean indicating authentication status
- `petTracker_user`: Complete user object with profile information

## Error Handling

The system includes comprehensive error handling:
- Network errors are caught and logged
- Failed authentication checks fall back to unauthenticated state
- Server logout failures don't prevent local logout
- localStorage errors are caught and logged

## Migration Notes

The new system is backward compatible with the existing authentication flow. The main changes are:
- Reduced API calls to `/getauth`
- User data persistence in localStorage
- Centralized authentication state management
- Improved error handling and user experience
