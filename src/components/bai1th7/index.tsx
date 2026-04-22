import React, { useMemo, useState, useCallback } from 'react';
import {
  Layout,
  Menu,
  Button,
  Input,
  Card,
  Row,
  Col,
  Tag,
  Pagination,
  Table,
  Modal,
  Form,
  Select,
  Upload,
  Popconfirm,
  message,
  Spin,
  Avatar,
  Space,
  Divider,
  Empty,
  Tooltip,
} from 'antd';
import './blog.less';
import ReactMarkdown from 'react-markdown';
import debounce from 'lodash.debounce';
import { INITIAL_POSTS, INITIAL_TAGS, AUTHOR_INFO, Post, Tag as ITag, Status } from '@/models/blog';

const { Header, Content, Footer, Sider } = Layout;

const BlogApp: React.FC = () => {
  const [page, setPage] = useState<'home' | 'detail' | 'admin' | 'tags' | 'about'>('home');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [tags, setTags] = useState<ITag[]>(INITIAL_TAGS);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const POSTS_PER_PAGE = 9;

  const [adminSearch, setAdminSearch] = useState('');
  const [adminStatusFilter, setAdminStatusFilter] = useState<Status | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form] = Form.useForm();

  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<ITag | null>(null);
  const [tagForm] = Form.useForm();

  const debouncedSearch = useMemo(
    () =>
      debounce((val: string) => {
        setSearch(val);
        setPageIndex(1);
      }, 300),
    []
  );
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (p.status !== 'published') return false;

      const matchSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase());

      const matchTag = tagFilter ? p.tags.includes(tagFilter) : true;

      return matchSearch && matchTag;
    });
  }, [posts, search, tagFilter]);

  const paginatedPosts = useMemo(() => {
    const start = (pageIndex - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, pageIndex]);

  const adminFilteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(adminSearch.toLowerCase());
      const matchStatus = adminStatusFilter ? p.status === adminStatusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [posts, adminSearch, adminStatusFilter]);

  const openPost = useCallback(
    (post: Post) => {
      setSelectedPost(post);
      setPage('detail');

      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, views: p.views + 1 } : p))
      );
    },
    []
  );

  const deletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
    message.success('Bài viết đã bị xóa');
  };

  const addOrEditPost = (values: any) => {
    if (editingPost) {
      setPosts(
        posts.map((p) =>
          p.id === editingPost.id
            ? {
                ...p,
                ...values,
                tags: values.tags || [],
              }
            : p
        )
      );
      message.success('Bài viết đã được cập nhật');
    } else {
      const newPost: Post = {
        id: Date.now().toString(),
        title: values.title,
        slug: values.slug || values.title.toLowerCase().replace(/\s+/g, '-'),
        content: values.content,
        excerpt: values.excerpt,
        coverImage: values.coverImage,
        status: values.status || 'draft',
        views: 0,
        tags: values.tags || [],
        createdAt: new Date().toISOString().slice(0, 10),
        author: AUTHOR_INFO.name,
      };
      setPosts([newPost, ...posts]);
      message.success('Bài viết đã được tạo');
    }

    setIsModalVisible(false);
    setEditingPost(null);
    form.resetFields();
  };

  const openEditModal = (post: Post) => {
    setEditingPost(post);
    form.setFieldsValue(post);
    setIsModalVisible(true);
  };

  const addOrEditTag = (values: any) => {
    if (editingTag) {
      setTags(
        tags.map((t) => (t.id === editingTag.id ? { ...t, name: values.name } : t))
      );
      message.success('Thẻ đã được cập nhật');
    } else {
      const newTag: ITag = {
        id: Date.now().toString(),
        name: values.name,
      };
      setTags([...tags, newTag]);
      message.success('Thẻ đã được thêm');
    }

    setTagModalVisible(false);
    setEditingTag(null);
    tagForm.resetFields();
  };

  const deleteTag = (id: string) => {
    setTags(tags.filter((t) => t.id !== id));
    message.success('Thẻ đã bị xóa');
  };
  const HomePage = () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Input
          placeholder="Tìm kiếm bài viết..."
          size="large"
          onChange={(e) => debouncedSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <Space wrap>
          <span style={{ fontWeight: 'bold' }}>Thẻ:</span>
          <Tag
            color={!tagFilter ? 'red' : 'default'}
            style={{ cursor: 'pointer' }}
            onClick={() => setTagFilter(null)}
          >
            Tất cả
          </Tag>
          {tags.map((t) => (
            <Tag
              key={t.id}
              color={tagFilter === t.name ? 'red' : 'default'}
              style={{ cursor: 'pointer' }}
              onClick={() => setTagFilter(t.name)}
            >
              {t.name}
            </Tag>
          ))}
        </Space>
      </div>

      {paginatedPosts.length === 0 ? (
        <Empty description="Không có bài viết nào" />
      ) : (
        <Row gutter={[24, 24]}>
          {paginatedPosts.map((p) => (
            <Col key={p.id} xs={24} sm={12} lg={8}>
              <Card
                hoverable
                cover={<img alt={p.title} src={p.coverImage} style={{ height: 200, objectFit: 'cover' }} />}
                onClick={() => openPost(p)}
              >
                <Card.Meta
                  title={p.title}
                  description={p.excerpt}
                />
                <div style={{ marginTop: 12 }}>
                  <Space size="small" wrap>
                    {p.tags.map((t) => (
                      <Tag key={t} color="default">
                        {t}
                      </Tag>
                    ))}
                  </Space>
                </div>
                <Divider style={{ margin: '12px 0' }} />
                <Space size="small">
                  <span>{p.createdAt}</span>
                  <span>Views: {p.views}</span>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Pagination
          current={pageIndex}
          pageSize={POSTS_PER_PAGE}
          total={filteredPosts.length}
          onChange={(page) => setPageIndex(page)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
  const DetailPage = () => {
    if (!selectedPost) return null;

    const related = posts.filter(
      (p) =>
        p.status === 'published' &&
        p.id !== selectedPost.id &&
        p.tags.some((t) => selectedPost.tags.includes(t))
    );

    return (
      <div>
        <Button
          type="link"
          onClick={() => setPage('home')}
          style={{ marginBottom: 24 }}
        >
          Quay lại
        </Button>

        <Card>
          <h1>{selectedPost.title}</h1>
          <Space style={{ marginBottom: 24 }}>
            <Avatar src={AUTHOR_INFO.avatar} />
            <span>{selectedPost.author}</span>
            <span>{selectedPost.createdAt}</span>
            <span>Views: {selectedPost.views}</span>
          </Space>

          <img
            src={selectedPost.coverImage}
            alt={selectedPost.title}
            style={{ width: '100%', maxHeight: 400, objectFit: 'cover', marginBottom: 24, borderRadius: 8 }}
          />

          <div style={{ marginBottom: 24 }}>
            <ReactMarkdown>{selectedPost.content}</ReactMarkdown>
          </div>

          <Divider />

          <div style={{ marginBottom: 24 }}>
            <Space wrap>
              {selectedPost.tags.map((t) => (
                <Tag key={t} color="red">
                  {t}
                </Tag>
              ))}
            </Space>
          </div>
        </Card>

        {related.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2>Bài viết liên quan</h2>
            <Row gutter={[24, 24]}>
              {related.slice(0, 3).map((r) => (
                <Col key={r.id} xs={24} sm={12} lg={8}>
                  <Card
                    hoverable
                    cover={<img alt={r.title} src={r.coverImage} style={{ height: 150, objectFit: 'cover' }} />}
                    onClick={() => openPost(r)}
                  >
                    <Card.Meta
                      title={r.title}
                      description={
                        <Space size="small">
                          <span>{r.createdAt}</span>
                          <span>Views: {r.views}</span>
                        </Space>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    );
  };
  const AdminPage = () => {
    const columns = [
      {
        title: 'Tiêu đề',
        dataIndex: 'title',
        key: 'title',
        width: '30%',
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (status: Status) => (
          <Tag color={status === 'published' ? 'green' : 'orange'}>
            {status === 'published' ? 'Đã đăng' : 'Nháp'}
          </Tag>
        ),
      },
      {
        title: 'Thẻ',
        dataIndex: 'tags',
        key: 'tags',
        render: (tags: string[]) => (
          <Space wrap>
            {tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </Space>
        ),
      },
      {
        title: 'Lượt xem',
        dataIndex: 'views',
        key: 'views',
        width: 80,
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 120,
      },
      {
        title: 'Thao tác',
        key: 'action',
        width: 150,
        render: (_: any, record: Post) => (
          <Space size="small">
            <Tooltip title="Chỉnh sửa">
              <Button
                type="primary"
                size="small"
                onClick={() => openEditModal(record)}
              >
                Sửa
              </Button>
            </Tooltip>
            <Popconfirm
              title="Xóa bài viết?"
              description="Bạn có chắc muốn xóa bài viết này không?"
              onConfirm={() => deletePost(record.id)}
            >
              <Button
                type="primary"
                danger
                size="small"
              >
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];

    return (
      <div>
        <Space style={{ marginBottom: 24 }}>
          <Button
            type="primary"
            onClick={() => {
              setEditingPost(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            + Thêm bài viết
          </Button>
        </Space>

        <Space style={{ marginBottom: 24 }}>
          <Input
            placeholder="Tìm kiếm theo tiêu đề..."
            value={adminSearch}
            onChange={(e) => setAdminSearch(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 150 }}
            onChange={(val) => setAdminStatusFilter(val)}
            allowClear
            options={[
              { label: 'Đã đăng', value: 'published' },
              { label: 'Nháp', value: 'draft' },
            ]}
          />
        </Space>

        <Table
          columns={columns}
          dataSource={adminFilteredPosts.map((p) => ({ ...p, key: p.id }))}
          pagination={{ pageSize: 10 }}
          bordered
        />
      </div>
    );
  };
  const TagsPage = () => {
    const columns = [
      {
        title: 'Tên thẻ',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Số bài viết',
        dataIndex: 'name',
        key: 'count',
        render: (tagName: string) => posts.filter((p) => p.tags.includes(tagName)).length,
      },
      {
        title: 'Thao tác',
        key: 'action',
        render: (_: any, record: ITag) => (
          <Space size="small">
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setEditingTag(record);
                tagForm.setFieldsValue(record);
                setTagModalVisible(true);
              }}
            >
              Sửa
            </Button>
            <Popconfirm
              title="Xóa thẻ?"
              description="Bạn có chắc muốn xóa thẻ này không?"
              onConfirm={() => deleteTag(record.id)}
            >
              <Button
                type="primary"
                danger
                size="small"
              >
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];

    return (
      <div>
        <Button
          type="primary"
          style={{ marginBottom: 24 }}
          onClick={() => {
            setEditingTag(null);
            tagForm.resetFields();
            setTagModalVisible(true);
          }}
        >
          + Thêm thẻ mới
        </Button>

        <Table
          columns={columns}
          dataSource={tags.map((t) => ({ ...t, key: t.id }))}
          pagination={false}
          bordered
        />
      </div>
    );
  };
  const AboutPage = () => (
    <Card>
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
          <Avatar size={150} src={AUTHOR_INFO.avatar} />
          <h2 style={{ marginTop: 16 }}>{AUTHOR_INFO.name}</h2>
        </Col>
        <Col xs={24} sm={16}>
          <h2>Giới thiệu</h2>
          <p>{AUTHOR_INFO.bio}</p>

          <h3>Kỹ năng</h3>
          <Space wrap>
            {AUTHOR_INFO.skills.map((skill) => (
              <Tag key={skill} color="red">
                {skill}
              </Tag>
            ))}
          </Space>

          <h3 style={{ marginTop: 24 }}>Liên kết</h3>
          <Space size="large">
            {AUTHOR_INFO.social.github && (
              <a href={AUTHOR_INFO.social.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
            {AUTHOR_INFO.social.twitter && (
              <a href={AUTHOR_INFO.social.twitter} target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
            )}
            {AUTHOR_INFO.social.linkedin && (
              <a href={AUTHOR_INFO.social.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            )}
            {AUTHOR_INFO.social.email && (
              <a href={`mailto:${AUTHOR_INFO.social.email}`}>
                Email
              </a>
            )}
          </Space>
        </Col>
      </Row>
    </Card>
  );
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 999 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
          <h2 style={{ margin: 0 }}>📝 My Blog</h2>
          <span style={{ color: '#666' }}>{AUTHOR_INFO.name}</span>
        </div>
      </Header>

      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          theme="light"
          breakpoint="lg"
          collapsedWidth={0}
          onBreakpoint={(broken) => setCollapsed(broken)}
        >
          <Menu
            mode="inline"
            selectedKeys={[page]}
            onClick={(e) => setPage(e.key as any)}
          >
            <Menu.Item key="home">
              Trang chủ
            </Menu.Item>
            <Menu.Item key="about">
              Giới thiệu
            </Menu.Item>
            <Menu.Item key="admin">
              Quản lý bài viết
            </Menu.Item>
            <Menu.Item key="tags">
              Quản lý thẻ
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout>
          <Content style={{ padding: '24px' }}>
            {page === 'home' && <HomePage />}
            {page === 'detail' && <DetailPage />}
            {page === 'admin' && <AdminPage />}
            {page === 'tags' && <TagsPage />}
            {page === 'about' && <AboutPage />}
          </Content>

          <Footer style={{ textAlign: 'center' }}>
            Blog © 2026 - Created with React & Ant Design
          </Footer>
        </Layout>
      </Layout>

      <Modal
        title={editingPost ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingPost(null);
          form.resetFields();
        }}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={addOrEditPost}
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tóm tắt"
            name="excerpt"
            rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            label="Nội dung (Markdown)"
            name="content"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <Input.TextArea rows={10} />
          </Form.Item>

          <Form.Item
            label="URL ảnh bìa"
            name="coverImage"
            rules={[{ required: true, type: 'url', message: 'Vui lòng nhập URL hợp lệ' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Thẻ"
            name="tags"
          >
            <Select
              mode="multiple"
              placeholder="Chọn các thẻ"
              options={tags.map((t) => ({ label: t.name, value: t.name }))}
            />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { label: 'Nháp', value: 'draft' },
                { label: 'Đã đăng', value: 'published' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingTag ? 'Chỉnh sửa thẻ' : 'Thêm thẻ mới'}
        visible={tagModalVisible}
        onOk={() => tagForm.submit()}
        onCancel={() => {
          setTagModalVisible(false);
          setEditingTag(null);
          tagForm.resetFields();
        }}
      >
        <Form
          form={tagForm}
          layout="vertical"
          onFinish={addOrEditTag}
        >
          <Form.Item
            label="Tên thẻ"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default BlogApp;