/* ============================================
   BLOG TYPES & INITIAL DATA
   ============================================ */

export type Status = 'draft' | 'published';

export interface Tag {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  status: Status;
  views: number;
  tags: string[];
  createdAt: string;
  author: string;
}

export interface Author {
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

/* ============================================
   INITIAL DATA
   ============================================ */

export const AUTHOR_INFO: Author = {
  name: 'Nguyễn Văn A',
  avatar: 'https://i.pravatar.cc/150?img=5',
  bio: 'Frontend Developer passionate about React, TypeScript, and building amazing web experiences.',
  skills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Node.js', 'MongoDB'],
  social: {
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    email: 'author@example.com',
  },
};

export const INITIAL_TAGS: Tag[] = [
  { id: '1', name: 'React' },
  { id: '2', name: 'TypeScript' },
  { id: '3', name: 'Web Development' },
  { id: '4', name: 'JavaScript' },
  { id: '5', name: 'Tutorial' },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    title: 'Hướng dẫn React Hooks cho Người Mới Bắt Đầu',
    slug: 'react-hooks-guide',
    content: `# Hướng dẫn React Hooks

## Giới thiệu
React Hooks là một tính năng mạnh mẽ được giới thiệu trong React 16.8.

## useState Hook
\`\`\`jsx
const [count, setCount] = useState(0);

return (
  <div>
    <p>Count: {count}</p>
    <button onClick={() => setCount(count + 1)}>Increase</button>
  </div>
);
\`\`\`

## useEffect Hook
\`\`\`jsx
useEffect(() => {
  // Side effect logic
  return () => {
    // Cleanup
  };
}, [dependencies]);
\`\`\`

## Kết luận
Hooks giúp code React trở nên gọn gàng và dễ bảo dưỡng hơn.`,
    excerpt: 'Học cách sử dụng React Hooks để viết code React hiện đại và hiệu quả.',
    coverImage: 'https://picsum.photos/600/400?random=1',
    status: 'published',
    views: 245,
    tags: ['React', 'JavaScript', 'Tutorial'],
    createdAt: '2026-04-15',
    author: 'Nguyễn Văn A',
  },
  {
    id: '2',
    title: 'TypeScript Advanced Types - Union & Intersection',
    slug: 'typescript-advanced-types',
    content: `# TypeScript Advanced

## Union Types
Union types cho phép một biến có nhiều kiểu.

\`\`\`typescript
type Status = 'pending' | 'success' | 'error';
type StringOrNumber = string | number;
\`\`\`

## Intersection Types
\`\`\`typescript
interface User {
  id: number;
  name: string;
}

interface Admin {
  permissions: string[];
}

type AdminUser = User & Admin;
\`\`\`

Tìm hiểu thêm về type system của TypeScript.`,
    excerpt: 'Khám phá các loại nâng cao trong TypeScript để viết code type-safe.',
    coverImage: 'https://picsum.photos/600/400?random=2',
    status: 'published',
    views: 189,
    tags: ['TypeScript', 'Web Development'],
    createdAt: '2026-04-10',
    author: 'Nguyễn Văn A',
  },
  {
    id: '3',
    title: 'Build a REST API with Node.js',
    slug: 'nodejs-rest-api',
    content: `# Node.js REST API

## Tạo Server
\`\`\`javascript
const express = require('express');
const app = express();

app.get('/api/posts', (req, res) => {
  res.json({ message: 'GET posts' });
});
\`\`\`

## Database Connection
Kết nối với MongoDB hoặc PostgreSQL để lưu trữ dữ liệu.

## Deployment
Deploy API lên Heroku hoặc AWS.`,
    excerpt: 'Hướng dẫn chi tiết xây dựng REST API với Node.js và Express.',
    coverImage: 'https://picsum.photos/600/400?random=3',
    status: 'published',
    views: 156,
    tags: ['JavaScript', 'Web Development', 'Tutorial'],
    createdAt: '2026-04-05',
    author: 'Nguyễn Văn A',
  },
  {
    id: '4',
    title: 'CSS Grid vs Flexbox',
    slug: 'css-grid-vs-flexbox',
    content: `# CSS Grid vs Flexbox

## Flexbox
Flexbox rất tốt cho layout một chiều.

## CSS Grid
CSS Grid mạnh mẽ cho layout hai chiều.

## Khi nên dùng cái nào?
- Flexbox: Navigation, buttons, một hàng hoặc cột
- Grid: Page layout, magazine layouts`,
    excerpt: 'So sánh Flexbox và CSS Grid - khi nào dùng cái nào.',
    coverImage: 'https://picsum.photos/600/400?random=4',
    status: 'published',
    views: 312,
    tags: ['Web Development'],
    createdAt: '2026-03-28',
    author: 'Nguyễn Văn A',
  },
  {
    id: '5',
    title: 'React Performance Optimization',
    slug: 'react-performance',
    content: `# React Performance

## Code Splitting
Chia nhỏ bundle để tải nhanh hơn.

## Memoization
Dùng \`React.memo\` và \`useMemo\` để tránh re-render không cần thiết.

## Tips
1. Lazy load components
2. Use React DevTools Profiler
3. Optimize images
4. Minimize bundle size`,
    excerpt: 'Các kỹ thuật tối ưu hóa hiệu suất ứng dụng React.',
    coverImage: 'https://picsum.photos/600/400?random=5',
    status: 'published',
    views: 267,
    tags: ['React'],
    createdAt: '2026-03-20',
    author: 'Nguyễn Văn A',
  },
  {
    id: '6',
    title: 'Web Security Best Practices',
    slug: 'web-security',
    content: `# Web Security

## XSS Protection
Luôn sanitize user input.

## CSRF
Sử dụng CSRF tokens.

## HTTPS
Áp dụng HTTPS cho tất cả site.

## Headers
\`\`\`
Content-Security-Policy
X-Frame-Options
X-Content-Type-Options
\`\`\``,
    excerpt: 'Best practices để bảo vệ ứng dụng web của bạn khỏi các mối đe dọa phổ biến.',
    coverImage: 'https://picsum.photos/600/400?random=6',
    status: 'published',
    views: 198,
    tags: ['Web Development', 'Tutorial'],
    createdAt: '2026-03-15',
    author: 'Nguyễn Văn A',
  },
  {
    id: '7',
    title: 'Draft: New Blog Post',
    slug: 'draft-post',
    content: `# Draft Post

Bài viết này vẫn đang trong quá trình soạn thảo.`,
    excerpt: 'Bài viết nháp - chưa được công bố.',
    coverImage: 'https://picsum.photos/600/400?random=7',
    status: 'draft',
    views: 0,
    tags: ['Tutorial'],
    createdAt: '2026-04-20',
    author: 'Nguyễn Văn A',
  },
];
