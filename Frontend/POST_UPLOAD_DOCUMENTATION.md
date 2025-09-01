# 📝 **Post Upload System Documentation**

## 🎯 **Tổng quan chức năng Upload Post**

Hệ thống upload post đã được hoàn thiện với các tính năng:

### **✨ Tính năng chính:**
- ✅ Upload multiple files (tối đa 5 files)
- ✅ Hỗ trợ images (JPG, PNG, GIF) và videos (MP4, MOV, AVI)
- ✅ Drag & drop files
- ✅ Preview files trước khi upload
- ✅ Validation file size và type
- ✅ Integration với Cloudinary
- ✅ JWT Authentication
- ✅ Real-time error handling
- ✅ Loading states

## 🔧 **Components đã tạo:**

### **1. PostService.js**
Service để xử lý các API calls liên quan đến posts:

```javascript
// Tạo bài viết
PostService.createPost(postData)

// Lấy tất cả bài viết
PostService.getAllPosts(page, limit)

// Like/Unlike bài viết
PostService.toggleLikePost(postId)

// Validate file
PostService.validateFile(file)
```

### **2. PostUploadPage.jsx**
Component chính để tạo bài viết:

```jsx
// State management
const [postText, setPostText] = useState("")
const [selectedFiles, setSelectedFiles] = useState([])
const [filePreviews, setFilePreviews] = useState([])
const [isPosting, setIsPosting] = useState(false)
const [error, setError] = useState("")

// Authentication check
const { user, isAuthenticated } = useAuth()
if (!isAuthenticated) {
  navigate('/auth')
  return null
}
```

### **3. PostList.jsx**
Component hiển thị danh sách bài viết:

```jsx
// Features:
- Infinite scroll / Load more
- Like functionality
- Media preview (images/videos)
- Time formatting
- Error handling
```

## 🚀 **Cách sử dụng:**

### **1. Setup trong App**
```jsx
import { AuthProvider } from './contexts/AuthContext'
import PostUploadPage from './pages/PostUploadPage'
import PostList from './components/PostList'

// Trong routes
<Route path="/upload" element={
  <ProtectedRoute>
    <PostUploadPage />
  </ProtectedRoute>
} />

<Route path="/posts" element={<PostList />} />
```

### **2. Environment Setup**
Đảm bảo có các environment variables:
```env
# Backend
JWT_ACCESS_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### **3. Test Flow**

#### **A. Upload Post:**
1. User đăng nhập ✅
2. Navigate to `/upload` ✅
3. Nhập text content (optional) ✅
4. Drag & drop hoặc click để chọn files ✅
5. Preview files trước khi upload ✅
6. Click "Đăng bài" ✅
7. Files upload lên Cloudinary ✅
8. Post data lưu vào MongoDB ✅
9. Redirect về home/posts ✅

#### **B. View Posts:**
1. Navigate to `/posts` hoặc component PostList ✅
2. Load danh sách posts với pagination ✅
3. Like/unlike posts ✅
4. View media (images/videos) ✅

## 🔄 **API Endpoints đã implement:**

### **Backend Routes:**
```javascript
// Public routes
GET /api/posts                    // Lấy tất cả posts
GET /api/posts/:postId            // Lấy post theo ID
GET /api/posts/user/:userId       // Lấy posts của user

// Protected routes (cần JWT)
POST /api/posts                   // Tạo post mới
PUT /api/posts/:postId            // Cập nhật post
DELETE /api/posts/:postId         // Xóa post
POST /api/posts/:postId/like      // Like/unlike post
POST /api/posts/:postId/comment   // Thêm comment
```

### **Frontend Service Calls:**
```javascript
// Upload post với media
const postData = {
  content: "Text content",
  media: [file1, file2, file3] // Array of File objects
}
const result = await PostService.createPost(postData)

// Get posts với pagination
const result = await PostService.getAllPosts(page, limit)

// Like post
const result = await PostService.toggleLikePost(postId)
```

## 🛡️ **Security Features:**

### **1. File Validation:**
```javascript
const validation = PostService.validateFile(file)
// Checks:
- File type (images/videos only)
- File size (max 50MB)
- Malicious content prevention
```

### **2. Authentication:**
```javascript
// Auto-added to requests
headers: {
  'Authorization': `Bearer ${accessToken}`
}

// Auto-refresh expired tokens
// Auto-redirect nếu unauthorized
```

### **3. Error Handling:**
```javascript
// Comprehensive error handling
try {
  const result = await PostService.createPost(postData)
  if (!result.success) {
    setError(result.message)
  }
} catch (error) {
  setError("Có lỗi xảy ra")
}
```

## 📱 **UI/UX Features:**

### **1. Responsive Design:**
- Mobile-first approach
- Grid layout cho multiple images
- Touch-friendly controls

### **2. Interactive Elements:**
- Drag & drop zone
- File preview với remove buttons
- Progress indicators
- Loading states
- Error messages

### **3. Visual Feedback:**
- Hover effects
- Click animations
- Color-coded states (success/error)
- Gradient backgrounds

## 🔧 **Customization Options:**

### **1. File Limits:**
```javascript
// Trong PostService.js
const maxFiles = 5 // Tối đa 5 files
const maxSize = 50 * 1024 * 1024 // 50MB per file
```

### **2. Supported Formats:**
```javascript
const allowedTypes = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
  'video/mp4', 'video/quicktime', 'video/x-msvideo'
]
```

### **3. UI Themes:**
CSS variables có thể customize:
```css
--accent-color: purple-to-pink gradient
--border-radius: 12px
--shadow-depth: multiple levels
```

## 🚀 **Performance Optimizations:**

### **1. Image/Video Handling:**
- Client-side file validation
- Preview generation in browser
- Cloudinary auto-optimization
- Lazy loading for media

### **2. API Optimizations:**
- Pagination cho posts
- Conditional loading
- Auto-retry failed requests
- Token refresh handling

### **3. User Experience:**
- Instant feedback
- Optimistic updates
- Background uploads
- Smooth transitions

## 🔍 **Debugging & Monitoring:**

### **1. Console Logs:**
```javascript
// Service calls có detailed logging
console.log('Upload attempt:', fileData)
console.log('Upload result:', result)
```

### **2. Error Tracking:**
```javascript
// Error states hiển thị cho user
// Detailed error logs cho developers
```

### **3. Performance Metrics:**
- Upload time tracking
- File size monitoring
- Success/failure rates

Hệ thống upload post đã sẵn sàng để sử dụng trong production! 🎉
