# Firebase Database Setup Instructions

## Current Status
✅ **Code pushed to GitHub successfully!**
✅ **Firebase configuration updated** in `lib/firebaseConfig.ts`
⚠️ **Firebase Console setup required** (follow steps below)

## Firebase Project Details
- **Project ID**: lava-pizza
- **Auth Domain**: lava-pizza.firebaseapp.com
- **Storage Bucket**: lava-pizza.firebasestorage.app

---

## Step 1: Create Firestore Composite Index

**Why needed?** The app queries orders with multiple filters (status + timestamps), which requires a composite index.

### Option A: Use Direct Link (Easiest)
Click this link to create the index automatically:
```
https://console.firebase.google.com/v1/r/project/lava-pizza/firestore/indexes?create_composite=Cl1wcm9qZWN0cy9sYXZhLXBpenphL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9vcmRlcnMvaW5kZXhlcy9fEAEaCgoGc3RhdHVzEAEaDAoIY3JlYXRlZEF0EAI
```

### Option B: Create Manually
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **lava-pizza**
3. Navigate to: **Firestore Database** → **Indexes** tab
4. Click **Create Index**
5. Enter these settings:
   - **Collection ID**: `orders`
   - **Field 1**: `status` → Ascending
   - **Field 2**: `createdAt` → Descending
6. Click **Create**
7. **Wait 2-3 minutes** for the index to build

---

## Step 2: Update Firestore Security Rules

**Why needed?** Current rules block read/write access. We need to allow authenticated users to access their data.

### Quick Development Rules (Use for Testing)
⚠️ **These rules are permissive - use only for development/testing**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **lava-pizza**
3. Navigate to: **Firestore Database** → **Rules** tab
4. Replace with these rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Allow read/write for development
    // TODO: Tighten these rules for production
    match /{document=**} {
      allow read, write: if request.auth != null;
    }

    // Orders collection - agents and customers can access their own orders
    match /orders/{orderId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }

    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Delivery agents collection
    match /deliveryAgents/{agentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == agentId;
    }
  }
}
```

5. Click **Publish**

### Production-Ready Rules (Use Later)
For production, use more restrictive rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Orders collection
    match /orders/{orderId} {
      // Customers can read their own orders
      allow read: if isSignedIn() && (
        resource.data.customerId == request.auth.uid ||
        resource.data.assignedAgentId == request.auth.uid
      );

      // Customers can create orders
      allow create: if isSignedIn() &&
        request.resource.data.customerId == request.auth.uid;

      // Agents can update orders assigned to them
      allow update: if isSignedIn() && (
        resource.data.assignedAgentId == request.auth.uid ||
        request.resource.data.customerId == request.auth.uid
      );
    }

    // Users collection
    match /users/{userId} {
      allow read, write: if isSignedIn() && isOwner(userId);
    }

    // Delivery agents collection
    match /deliveryAgents/{agentId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && isOwner(agentId);
      allow update: if isSignedIn() && isOwner(agentId);
    }

    // Customers collection
    match /customers/{customerId} {
      allow read, write: if isSignedIn() && isOwner(customerId);
    }
  }
}
```

---

## Step 3: Verify Authentication Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Navigate to: **Authentication** → **Sign-in method**
3. Verify **Email/Password** is **Enabled**
4. If not enabled:
   - Click **Email/Password**
   - Toggle **Enable**
   - Click **Save**

---

## Step 4: Test the Connection

After completing the above steps:

1. **Restart your app** (stop and start the Expo server)
2. **Try signing in** as a delivery agent
3. **Test creating an order** as a customer
4. **Check dashboard** - orders should appear

### If you still see errors:

1. **Check browser console** for detailed error messages
2. **Verify index is built**:
   - Firebase Console → Firestore Database → Indexes
   - Status should be "Enabled" (not "Building")
3. **Verify rules published**:
   - Firebase Console → Firestore Database → Rules
   - Check the rules match what you entered
4. **Clear app cache**:
   ```bash
   npx expo start -c
   ```

---

## Troubleshooting Common Issues

### Error: "Missing or insufficient permissions"
- **Cause**: Firestore rules are blocking access
- **Fix**: Update security rules (Step 2 above)

### Error: "The query requires an index"
- **Cause**: Composite index not created
- **Fix**: Create the index (Step 1 above) and wait 2-3 minutes

### Error: "Firebase Auth is not initialized"
- **Cause**: App reloaded before Firebase initialized
- **Fix**: Close and restart the app completely

### Error: "Network request failed"
- **Cause**: No internet connection
- **Fix**: Check your internet connection

---

## Features Now Working

After setup, these features will work:

✅ **Customer Features**
- Sign up and login
- Browse pizza menu
- Add items to cart
- Place orders
- Track order status

✅ **Delivery Agent Features**
- Separate agent login
- View pending orders
- Accept deliveries
- Update order status
- Track earnings
- Profile picture upload
- Notification settings
- Live chat support
- FAQ & tutorials
- Shift scheduling
- Help & support

✅ **Real-time Features**
- Order updates
- Agent availability
- Live location tracking
- Order assignments

---

## For Presentation Tomorrow

**Minimum Required Steps:**
1. ✅ Create the composite index (Step 1)
2. ✅ Update security rules to development mode (Step 2)
3. ✅ Restart your app

**This will take 5-10 minutes total!**

After these steps, all features will work for your presentation.

---

## Need Help?

If you encounter any issues:
1. Check the Firebase Console for error messages
2. Look at the browser/app console for detailed errors
3. Verify all steps were completed correctly
4. Make sure the index finished building (2-3 minutes wait time)

Good luck with your presentation! 🍕🚀
