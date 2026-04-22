# 📝 Personal Blog Application

A modern, fully-featured personal blog application built with React, TypeScript, and Ant Design.

## ✨ Features Implemented

### 1. **Home Page** 📖
- **Blog Card Display**: Posts displayed as beautiful cards with:
  - Cover image
  - Title
  - Excerpt
  - Publication date
  - View count
  - Tags
- **Search Functionality**: 
  - Search by title or excerpt
  - Debounced search (300ms)
  - Real-time filtering
- **Tag Filtering**: 
  - Click tags to filter posts
  - View all posts or filter by specific tag
- **Pagination**: 
  - 9 posts per page
  - Navigate through pages
  - Dynamic pagination based on filtered results

### 2. **Post Detail Page** 📄
- **Full Post Display**:
  - Complete Markdown rendering
  - Cover image
  - Title and metadata
- **Author Information**:
  - Author avatar
  - Author name
  - Publication date
  - View counter (auto-increments)
- **Related Posts**:
  - Shows up to 3 related posts (same tags)
  - Clickable to view other posts
  - Excludes current post
- **Navigation**: Back button to return to home

### 3. **About Page** 👤
- **Author Profile**:
  - Large avatar display
  - Author name
  - Biography
  - List of skills with tags
- **Social Links**:
  - GitHub
  - Twitter
  - LinkedIn
  - Email contact
- **Professional Layout**: Responsive grid layout

### 4. **Post Management (Admin)** ⚙️
- **Data Table**:
  - Title
  - Status (Draft/Published)
  - Tags
  - View count
  - Creation date
- **Actions**:
  - **Add New Post**: Create posts with form modal
  - **Edit Post**: Modify existing posts inline
  - **Delete Post**: Confirm deletion with popover
- **Filtering**:
  - Search by title
  - Filter by status (Draft/Published)
- **Post Form Fields**:
  - Title (required)
  - Slug (required)
  - Excerpt (required)
  - Markdown content (required)
  - Cover image URL (required, with validation)
  - Tags (multi-select)
  - Status (Draft/Published)

### 5. **Tag Management** 🏷️
- **Tag List with Table**:
  - Tag name
  - Number of posts using the tag
  - Edit and delete actions
- **Add Tags**: Modal form to create new tags
- **Edit Tags**: Update tag names
- **Delete Tags**: Confirm deletion
- **Tag Filtering**: Used across blogs for filtering

## 🏗️ Project Structure

```
src/
├── components/
│   └── bai1th7/
│       ├── index.tsx          # Main blog component
│       └── blog.less          # Blog-specific styles
├── models/
│   └── blog.ts               # Types and initial data
```

## 💾 Data Structure

### Post Type
```typescript
interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;           // Markdown content
  excerpt: string;
  coverImage: string;        // URL to image
  status: 'draft' | 'published';
  views: number;
  tags: string[];
  createdAt: string;         // YYYY-MM-DD format
  author: string;
}
```

### Tag Type
```typescript
interface Tag {
  id: string;
  name: string;
}
```

### Author Type
```typescript
interface Author {
  name: string;
  avatar: string;
  bio: string;
  skills: string[];
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
}
```

## 🎨 UI Components Used

- **Ant Design 4.21.0**
  - Layout
  - Menu
  - Card
  - Table
  - Modal
  - Form
  - Button
  - Tag
  - Avatar
  - Pagination
  - Popconfirm
  - And more...

## 🔧 Technologies

- **React 17.0.0**: Core framework
- **TypeScript**: Type safety
- **Ant Design 4.21.0**: UI components
- **React Markdown**: Markdown rendering
- **Lodash Debounce**: Search debouncing
- **React Icons**: Icon library

## 📋 Features Breakdown

### Search & Filter
- ✅ Debounced search (300ms)
- ✅ Tag-based filtering
- ✅ Status filtering (admin)
- ✅ Title search (admin)

### State Management
- ✅ useState for local state
- ✅ useMemo for performance optimization
- ✅ useCallback for memoized functions

### CRUD Operations
- ✅ Create: Add new posts and tags
- ✅ Read: Display posts and tags
- ✅ Update: Edit posts and tags
- ✅ Delete: Remove posts and tags with confirmation

### Layout & Responsive
- ✅ Responsive grid layout
- ✅ Mobile-friendly sidebar (collapsible)
- ✅ Professional styling
- ✅ Icon-based navigation
- ✅ Color-coded status indicators

## 🚀 Usage

1. **Navigate** using the sidebar menu:
   - Home: Browse published posts
   - About: View author information
   - Quản lý bài viết: Manage posts (admin)
   - Quản lý thẻ: Manage tags (admin)

2. **Search & Filter** on home page:
   - Type to search posts (auto-debounced)
   - Click tags to filter by tag
   - View pagination to navigate

3. **Manage Posts** in admin panel:
   - Click "+ Thêm bài viết" to create new
   - Click edit icon to modify
   - Click trash icon to delete (with confirmation)

4. **Manage Tags** in tag management:
   - Click "+ Thêm thẻ mới" to add tag
   - Click edit to modify tag name
   - Click delete to remove tag

## 📊 Performance Optimizations

- **Memoization**: `useMemo` for filtered and paginated posts
- **Debounced Search**: 300ms delay to reduce re-renders
- **Callback Memoization**: `useCallback` for stable function references
- **Lazy Rendering**: Only render visible posts on current page

## 🎯 Requirements Met

✅ Home page with cards, pagination, tag filtering, and search
✅ Detail page with markdown rendering and view count
✅ About page with author information and social links
✅ Post management with full CRUD operations
✅ Tag management with add/edit/delete
✅ Professional UI with Ant Design
✅ Responsive design
✅ Vietnamese language support
✅ Initial mock data with 7 blog posts
✅ All required functionality implemented
