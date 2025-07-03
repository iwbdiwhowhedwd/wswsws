
# OneSignal Push Notifications Setup Guide

## Step 1: Create OneSignal Account
1. Visit [OneSignal.com](https://onesignal.com) and create a free account
2. Create a new app and select "Web Push" platform
3. Note down your **App ID** and **REST API Key**

## Step 2: Configure OneSignal for Web
1. In OneSignal dashboard, go to Settings > Platforms
2. Configure Web Push:
   - **Site Name**: مجوهرات أبو رميلة
   - **Site URL**: Your app's domain (e.g., https://yourapp.com)
   - **Default Icon URL**: URL to your app icon
   - **Permission Message**: "نريد إرسال إشعارات حول القطع الجديدة والعروض الخاصة"

## Step 3: Update Configuration
Replace the following values in `src/services/notificationService.ts`:

```typescript
const ONESIGNAL_APP_ID = 'YOUR_ACTUAL_ONESIGNAL_APP_ID';
// In the fetch requests, replace:
'Authorization': `Basic YOUR_ACTUAL_ONESIGNAL_REST_API_KEY`
```

## Step 4: Mobile Configuration (Android/iOS)
For Capacitor mobile apps:

### Android Setup:
1. In OneSignal dashboard, add Android platform
2. Download google-services.json
3. Place it in `android/app/` directory
4. Follow Capacitor OneSignal plugin installation

### iOS Setup:
1. In OneSignal dashboard, add iOS platform  
2. Upload your APNs certificate or key
3. Configure in Xcode project

## Step 5: Testing
1. Open your app and grant notification permission
2. Go to Admin Panel > Notifications
3. Send a test notification
4. Check that it appears in browser/device

## Features Implemented:
- ✅ Automatic notifications for new gold items
- ✅ Automatic notifications for price updates  
- ✅ Automatic notifications for new reservations
- ✅ Manual notification sending from admin panel
- ✅ User token storage and management
- ✅ Notification history tracking
- ✅ Support for web, Android, and iOS
- ✅ Permission request handling
- ✅ Device token management in database

## Database Tables Created:
- `push_tokens`: Stores user device tokens
- `notifications`: Stores notification history
- `notification_deliveries`: Tracks delivery status

## Next Steps:
1. Replace placeholder OneSignal credentials with real ones
2. Test on different devices and browsers
3. Customize notification appearance and behavior
4. Set up advanced targeting and segmentation if needed
