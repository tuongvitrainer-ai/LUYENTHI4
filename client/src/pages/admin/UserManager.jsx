import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  message,
  Tag,
} from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { getAllUsersAPI, updateUserAPI, deleteUserAPI } from '../../services/adminService';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // Lấy danh sách users
  const fetchUsers = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await getAllUsersAPI(page, pageSize);
      setUsers(response.data.users);
      setPagination({
        current: response.data.pagination.currentPage,
        pageSize: response.data.pagination.limit,
        total: response.data.pagination.totalUsers,
      });
    } catch (error) {
      message.error(error.message || 'Lỗi khi lấy danh sách users');
    } finally {
      setLoading(false);
    }
  };

  // Load users khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Xử lý thay đổi trang
  const handleTableChange = (pagination) => {
    fetchUsers(pagination.current, pagination.pageSize);
  };

  // Mở modal edit user
  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      full_name: user.full_name,
      role: user.role,
      avatar_url: user.avatar_url,
    });
    setEditModalVisible(true);
  };

  // Xử lý submit form edit
  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      await updateUserAPI(editingUser.id, values);
      message.success('Cập nhật user thành công!');
      setEditModalVisible(false);
      fetchUsers(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(error.message || 'Lỗi khi cập nhật user');
    }
  };

  // Xử lý xóa user
  const handleDelete = async (userId) => {
    try {
      await deleteUserAPI(userId);
      message.success('Xóa user thành công!');
      fetchUsers(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error(error.message || 'Lỗi khi xóa user');
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
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Tên đầy đủ',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const colorMap = {
          admin: 'red',
          teacher: 'blue',
          parent: 'green',
          student: 'default',
        };
        return <Tag color={colorMap[role]}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Coins',
      dataIndex: 'coins',
      key: 'coins',
      render: (coins) => coins?.toLocaleString() || 0,
    },
    {
      title: 'Stars',
      dataIndex: 'stars',
      key: 'stars',
      render: (stars) => stars?.toLocaleString() || 0,
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
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa user"
            description="Bạn có chắc chắn muốn xóa user này?"
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
        <h1>Quản lý Users</h1>
        <Button icon={<ReloadOutlined />} onClick={() => fetchUsers(pagination.current, pagination.pageSize)}>
          Làm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      {/* Modal Edit User */}
      <Modal
        title="Sửa thông tin User"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setEditModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="full_name"
            label="Tên đầy đủ"
            rules={[{ required: true, message: 'Vui lòng nhập tên đầy đủ' }]}
          >
            <Input placeholder="Nhập tên đầy đủ" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Vui lòng chọn role' }]}
          >
            <Select placeholder="Chọn role">
              <Select.Option value="student">Student</Select.Option>
              <Select.Option value="parent">Parent</Select.Option>
              <Select.Option value="teacher">Teacher</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="avatar_url" label="Avatar URL">
            <Input placeholder="Nhập URL avatar (optional)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManager;
