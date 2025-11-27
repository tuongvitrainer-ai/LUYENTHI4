import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { getAllLessonsAPI, deleteLessonAPI } from '../../services/adminService';

const LessonManager = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Lấy danh sách lessons
  const fetchLessons = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await getAllLessonsAPI(page, pageSize);
      setLessons(response.data.lessons);
      setPagination({
        current: response.data.pagination.currentPage,
        pageSize: response.data.pagination.limit,
        total: response.data.pagination.totalLessons,
      });
    } catch (error) {
      message.error(error.message || 'Lỗi khi lấy danh sách lessons');
    } finally {
      setLoading(false);
    }
  };

  // Load lessons khi component mount
  useEffect(() => {
    fetchLessons();
  }, []);

  // Xử lý thay đổi trang
  const handleTableChange = (pagination) => {
    fetchLessons(pagination.current, pagination.pageSize);
  };

  // Xử lý xóa lesson
  const handleDelete = async (lessonId) => {
    try {
      await deleteLessonAPI(lessonId);
      message.success('Xóa bài học thành công!');
      fetchLessons(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(error.message || 'Lỗi khi xóa bài học');
    }
  };

  // Định nghĩa columns cho table
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Chapter',
      dataIndex: 'chapter_title',
      key: 'chapter_title',
      render: (text) => text || <Tag>Chưa gán</Tag>,
    },
    {
      title: 'Môn học',
      dataIndex: 'subject_name',
      key: 'subject_name',
      render: (text) => text || '-',
    },
    {
      title: 'Lớp',
      dataIndex: 'grade_name',
      key: 'grade_name',
      render: (text) => text || '-',
    },
    {
      title: 'Miễn phí',
      dataIndex: 'is_free',
      key: 'is_free',
      render: (isFree) => (
        <Tag color={isFree ? 'green' : 'orange'}>{isFree ? 'Có' : 'Không'}</Tag>
      ),
    },
    {
      title: 'Thứ tự',
      dataIndex: 'order',
      key: 'order',
      width: 100,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/lessons/edit/${record.id}`)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa bài học"
            description="Bạn có chắc chắn muốn xóa bài học này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Quản lý Bài học</h1>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchLessons(pagination.current, pagination.pageSize)}
          >
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/lessons/new')}
          >
            Thêm bài học
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={lessons}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default LessonManager;
