import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, InputNumber, Switch, Button, message, Card, Space } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  createLessonAPI,
  updateLessonAPI,
  getLessonByIdAPI,
} from '../../services/adminService';

const LessonEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Nếu có id thì là edit, không thì là create
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const isEditMode = !!id;

  // Load lesson data nếu là edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchLesson();
    }
  }, [id]);

  const fetchLesson = async () => {
    setLoading(true);
    try {
      const response = await getLessonByIdAPI(id);
      const lesson = response.data;

      form.setFieldsValue({
        chapter_id: lesson.chapter_id,
        title: lesson.title,
        thumbnail_url: lesson.thumbnail_url,
        is_free: lesson.is_free,
        order: lesson.order,
      });

      setDescription(lesson.description || '');
    } catch (error) {
      message.error(error.message || 'Lỗi khi lấy thông tin lesson');
      navigate('/admin/lessons');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý submit form
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        description: description,
      };

      if (isEditMode) {
        await updateLessonAPI(id, data);
        message.success('Cập nhật bài học thành công!');
      } else {
        await createLessonAPI(data);
        message.success('Tạo bài học thành công!');
      }

      navigate('/admin/lessons');
    } catch (error) {
      message.error(error.message || 'Lỗi khi lưu bài học');
    } finally {
      setLoading(false);
    }
  };

  // React Quill modules và formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'color',
    'background',
    'align',
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/lessons')}>
            Quay lại
          </Button>
          <h1 style={{ margin: 0 }}>{isEditMode ? 'Sửa bài học' : 'Thêm bài học mới'}</h1>
        </Space>
      </div>

      {/* Form */}
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            is_free: false,
            order: 0,
          }}
        >
          {/* Tiêu đề */}
          <Form.Item
            name="title"
            label="Tiêu đề bài học"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài học' }]}
          >
            <Input placeholder="Ví dụ: Bài 1 - Phép cộng trong phạm vi 100" size="large" />
          </Form.Item>

          {/* Chapter ID */}
          <Form.Item
            name="chapter_id"
            label="Chapter ID"
            tooltip="ID của chapter mà bài học này thuộc về (có thể để trống)"
          >
            <InputNumber
              placeholder="Ví dụ: 1"
              style={{ width: '100%' }}
              min={1}
            />
          </Form.Item>

          {/* Mô tả / Nội dung (React Quill) */}
          <Form.Item
            label="Nội dung bài học"
            tooltip="Sử dụng editor để soạn thảo nội dung bài học"
          >
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              modules={modules}
              formats={formats}
              placeholder="Nhập nội dung bài học tại đây... Bạn có thể định dạng văn bản, chèn ảnh, video, v.v."
              style={{ height: 400, marginBottom: 60 }}
            />
          </Form.Item>

          {/* Thumbnail URL */}
          <Form.Item
            name="thumbnail_url"
            label="URL Thumbnail"
            tooltip="Link ảnh thumbnail cho bài học"
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          {/* Link Video/Game */}
          <Form.Item
            label="Link Video / Game Module"
            tooltip="Bạn có thể thêm link Youtube hoặc link game module vào phần mô tả bên trên"
          >
            <Input.TextArea
              placeholder="Ghi chú: Bạn có thể nhúng video/game bằng cách sử dụng editor bên trên (nút 'video' trên toolbar)"
              disabled
              rows={2}
            />
          </Form.Item>

          {/* Is Free */}
          <Form.Item
            name="is_free"
            label="Miễn phí"
            valuePropName="checked"
            tooltip="Cho phép học sinh học thử miễn phí?"
          >
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>

          {/* Order */}
          <Form.Item
            name="order"
            label="Thứ tự"
            tooltip="Số thứ tự để sắp xếp bài học (0 = đầu tiên)"
          >
            <InputNumber
              placeholder="0"
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                size="large"
              >
                {isEditMode ? 'Cập nhật' : 'Tạo bài học'}
              </Button>
              <Button onClick={() => navigate('/admin/lessons')} size="large">
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LessonEditor;
