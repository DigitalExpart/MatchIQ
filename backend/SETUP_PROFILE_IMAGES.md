# Profile Images Setup Guide

## 📦 **Step 1: Create Storage Bucket in Supabase**

### **Option A: Using SQL Editor (Recommended)**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/xvicydrqtddctywkvyge
2. Click **SQL Editor** in the left sidebar
3. Copy and paste the contents from `backend/migrations/004_create_profile_images_bucket.sql`
4. Click **Run**

### **Option B: Using Supabase UI**

1. Go to **Storage** in Supabase Dashboard
2. Click **"New Bucket"**
3. Name: `profile-images`
4. Set **Public bucket**: ON (enabled)
5. Click **Create Bucket**
6. Then run the policies from the SQL file

---

## 🔐 **What This Sets Up:**

### **1. Storage Bucket**
- Bucket Name: `profile-images`
- Public: Yes (for viewing images)
- Organized by user ID: `profile-images/{user_id}/avatar.jpg`

### **2. Security Policies**
✅ **Upload**: Users can only upload to their own folder  
✅ **Read**: Everyone can view profile images (public)  
✅ **Update**: Users can only update their own images  
✅ **Delete**: Users can only delete their own images  

### **3. Database Column**
- Adds `profile_image_url` column to `users` table
- Stores the public URL of the uploaded image

---

## 🔧 **Step 2: Update Frontend Code**

### **Install Supabase Client (if not already installed)**

```bash
cd MyMatchIQ
npm install @supabase/supabase-js
```

### **Update ProfileScreen.tsx**

Replace the current image upload logic with Supabase storage upload:

```typescript
// Add at the top of the file
import { supabase } from '../../lib/supabase';

// Replace handleImageUpload function
const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file || !profile?.id) return;

  try {
    // Show loading state
    setShowImageUploadModal(false);
    
    // Create file path: profile-images/{userId}/avatar.jpg
    const fileExt = file.name.split('.').pop();
    const fileName = `${profile.id}/avatar.${fileExt}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true // Replace if exists
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName);

    // Update state and save to database
    setProfileImage(publicUrl);
    
    // Update user profile in database
    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_image_url: publicUrl })
      .eq('id', profile.id);

    if (updateError) throw updateError;

    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);

  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Failed to upload image. Please try again.');
  }
};
```

---

## 📝 **Step 3: Load Existing Profile Image**

Add this useEffect to load the profile image when component mounts:

```typescript
useEffect(() => {
  if (profile?.profile_image_url) {
    setProfileImage(profile.profile_image_url);
  }
}, [profile]);
```

---

## 🧪 **Testing**

1. **Run the SQL** in Supabase SQL Editor
2. **Verify bucket exists**: Go to Storage → Should see `profile-images` bucket
3. **Update frontend code** as shown above
4. **Test upload**:
   - Go to Profile → Edit Profile
   - Click pencil icon
   - Upload an image
   - Should see it appear immediately
5. **Check storage**: Go to Storage → profile-images → Should see your image

---

## 🗂️ **File Structure in Storage**

```
profile-images/
├── {user-id-1}/
│   └── avatar.jpg
├── {user-id-2}/
│   └── avatar.png
└── {user-id-3}/
    └── avatar.jpg
```

---

## 🔍 **Troubleshooting**

### **"Row Level Security policy violation"**
- Make sure you ran ALL the policies from the SQL file
- Check that the user is authenticated

### **"Bucket not found"**
- Run the INSERT INTO storage.buckets command
- Or create bucket manually in Supabase UI

### **Images not showing**
- Make sure bucket is set to **Public**
- Check the `profile_image_url` is saved in users table
- Verify the public URL is correct

---

## 📊 **File Size Limits**

Consider adding client-side validation:

```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

if (file.size > MAX_FILE_SIZE) {
  alert('Image must be less than 5MB');
  return;
}
```

---

## 🎨 **Image Optimization (Optional)**

For better performance, consider compressing images before upload:

```bash
npm install browser-image-compression
```

```typescript
import imageCompression from 'browser-image-compression';

const compressedFile = await imageCompression(file, {
  maxSizeMB: 1,
  maxWidthOrHeight: 1024,
  useWebWorker: true
});
```

---

## ✅ **Checklist**

- [ ] Run SQL migration in Supabase SQL Editor
- [ ] Verify `profile-images` bucket exists
- [ ] Install `@supabase/supabase-js` if needed
- [ ] Create `lib/supabase.ts` with Supabase client
- [ ] Update `handleImageUpload` function
- [ ] Add `useEffect` to load existing image
- [ ] Test upload functionality
- [ ] Test image display
- [ ] Verify images are public

---

## 🔗 **Next Steps**

After setup, you can enhance with:
- Image cropping before upload
- Multiple image uploads (gallery)
- Image filters/effects
- Progress indicators during upload
- Retry logic for failed uploads

