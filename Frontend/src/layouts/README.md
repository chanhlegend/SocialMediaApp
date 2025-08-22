# Layout System Guide

## 📁 Cấu trúc Layout

### Layouts Available:
- **`MainLayout`** - Layout chính cho app (Header + Content + BottomNavigation)
- **`AuthLayout`** - Layout cho trang authentication (Centered, responsive)

### Components:
- **`Header`** - Header với logo và navigation buttons
- **`BottomNavigation`** - Bottom navigation bar

## 🔧 Cách sử dụng

### 1. Cấu hình trong routes.js:

```javascript
const AppRoute = [
  {
    path: ROUTE_PATH.HOME,
    page: HomePage,
    layout: MainLayout // Sử dụng MainLayout
  },
  {
    path: ROUTE_PATH.LOGIN,
    page: AuthPage,
    layout: AuthLayout // Sử dụng AuthLayout
  },
  {
    path: ROUTE_PATH.CUSTOM,
    page: CustomPage,
    layout: null // Không sử dụng layout (fullscreen)
  }
]
```

### 2. Helper Functions:

```javascript
import { renderWithLayout, getRouteComponent } from '../config/routes'

// Render component với layout
const WrappedComponent = renderWithLayout(MyComponent, MainLayout)

// Lấy component đã wrap sẵn theo route
const RouteComponent = getRouteComponent(ROUTE_PATH.HOME)
```

### 3. Tạo Layout mới:

```jsx
const CustomLayout = ({ children }) => {
    return (
        <div className="custom-layout">
            <header>Custom Header</header>
            <main>{children}</main>
            <footer>Custom Footer</footer>
        </div>
    )
}
```

## ✅ Lợi ích

### 🔄 **Tái sử dụng:**
- Layout được định nghĩa một lần, dùng cho nhiều trang
- Components Header/Footer/Navigation có thể dùng chung

### 🧹 **Code sạch:**
- Pages chỉ tập trung vào business logic
- Layout logic tách biệt hoàn toàn

### 🎨 **Consistent UI:**
- Đảm bảo UI/UX đồng nhất across app
- Easy theming và global styling

### 🔧 **Dễ maintain:**
- Thay đổi layout chỉ cần sửa 1 file
- Thêm/xóa layout dễ dàng

## 📱 Layout Types

### **MainLayout** - App chính:
```
┌─────────────────┐
│     Header      │
├─────────────────┤
│                 │
│     Content     │
│   (Children)    │
│                 │
├─────────────────┤
│ BottomNavigation│
└─────────────────┘
```

### **AuthLayout** - Authentication:
```
┌─────────────────┐
│                 │
│   ┌─────────┐   │
│   │         │   │
│   │ Content │   │
│   │         │   │
│   └─────────┘   │
│                 │
└─────────────────┘
```

### **No Layout** - Fullscreen:
```
┌─────────────────┐
│                 │
│                 │
│    Full Page    │
│    Content      │
│                 │
│                 │
└─────────────────┘
```
