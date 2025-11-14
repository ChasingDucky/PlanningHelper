import { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  Message,
  Space,
  Table,
  Tag,
  Progress,
  Badge,
  Statistic,
  Grid,
  Dropdown,
  Menu,
} from '@arco-design/web-react';
import {
  IconPlus,
  IconMoreVertical,
  IconEdit,
  IconDelete,
  IconCheck,
} from '@arco-design/web-react/icon';
import dayjs from 'dayjs';
import { useTasksStore } from '@store/tasksStore';
import { tasksApi } from '@services/tasks';
import type { Task, CreateTaskDto, TaskStatus, TaskPriority } from '@/types/tasks';
import { TaskStatus as TaskStatusEnum, TaskPriority as TaskPriorityEnum } from '@/types/tasks';
import './index.css';

const { Row, Col } = Grid;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

function TasksPage() {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { tasks, statistics, fetchTasks, fetchStatistics, addTask, updateTask, removeTask } =
    useTasksStore();

  useEffect(() => {
    loadTasks();
    loadStatistics();
  }, []);

  const loadTasks = async () => {
    try {
      await fetchTasks({ parentOnly: true });
    } catch (error) {
      Message.error('加载任务失败');
    }
  };

  const loadStatistics = async () => {
    try {
      await fetchStatistics();
    } catch (error) {
      console.error('Failed to load statistics');
    }
  };

  const handleCreate = () => {
    form.resetFields();
    setEditingTask(null);
    setModalVisible(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    form.setFieldsValue({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      progress: task.progress,
      dueDate: task.dueDate ? dayjs(task.dueDate) : undefined,
      startDate: task.startDate ? dayjs(task.startDate) : undefined,
      isImportant: task.isImportant,
      isUrgent: task.isUrgent,
      estimatedHours: task.estimatedHours,
      notes: task.notes,
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validate();
      const taskData: CreateTaskDto = {
        title: values.title,
        description: values.description,
        status: values.status || TaskStatusEnum.TODO,
        priority: values.priority || TaskPriorityEnum.MEDIUM,
        progress: values.progress || 0,
        dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
        startDate: values.startDate ? values.startDate.toISOString() : undefined,
        isImportant: values.isImportant || false,
        isUrgent: values.isUrgent || false,
        estimatedHours: values.estimatedHours,
        notes: values.notes,
      };

      if (editingTask) {
        const updated = await tasksApi.updateTask(editingTask.id, taskData);
        updateTask(editingTask.id, updated);
        Message.success('任务更新成功');
      } else {
        const created = await tasksApi.createTask(taskData);
        addTask(created);
        Message.success('任务创建成功');
      }

      setModalVisible(false);
      form.resetFields();
      loadStatistics();
    } catch (error) {
      Message.error(editingTask ? '更新失败' : '创建失败');
    }
  };

  const handleDelete = async (task: Task) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除任务"${task.title}"吗？如果有子任务也会被删除。`,
      onOk: async () => {
        try {
          await tasksApi.deleteTask(task.id);
          removeTask(task.id);
          Message.success('任务删除成功');
          loadStatistics();
        } catch (error) {
          Message.error('删除失败');
        }
      },
    });
  };

  const handleQuickComplete = async (task: Task) => {
    try {
      const updated = await tasksApi.updateTask(task.id, {
        status: TaskStatusEnum.COMPLETED,
        progress: 100,
      });
      updateTask(task.id, updated);
      Message.success('任务已完成');
      loadStatistics();
    } catch (error) {
      Message.error('操作失败');
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    const colors = {
      [TaskStatusEnum.TODO]: 'gray',
      [TaskStatusEnum.IN_PROGRESS]: 'blue',
      [TaskStatusEnum.COMPLETED]: 'green',
      [TaskStatusEnum.CANCELLED]: 'red',
    };
    return colors[status];
  };

  const getStatusText = (status: TaskStatus) => {
    const texts = {
      [TaskStatusEnum.TODO]: '待办',
      [TaskStatusEnum.IN_PROGRESS]: '进行中',
      [TaskStatusEnum.COMPLETED]: '已完成',
      [TaskStatusEnum.CANCELLED]: '已取消',
    };
    return texts[status];
  };

  const getPriorityColor = (priority: TaskPriority) => {
    const colors = {
      [TaskPriorityEnum.LOW]: 'gray',
      [TaskPriorityEnum.MEDIUM]: 'blue',
      [TaskPriorityEnum.HIGH]: 'orange',
      [TaskPriorityEnum.URGENT]: 'red',
    };
    return colors[priority];
  };

  const getPriorityText = (priority: TaskPriority) => {
    const texts = {
      [TaskPriorityEnum.LOW]: '低',
      [TaskPriorityEnum.MEDIUM]: '中',
      [TaskPriorityEnum.HIGH]: '高',
      [TaskPriorityEnum.URGENT]: '紧急',
    };
    return texts[priority];
  };

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: Task) => (
        <Space>
          {record.isImportant && <Badge status="error" />}
          <span style={{ fontWeight: record.isImportant ? 600 : 400 }}>{title}</span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: TaskStatus) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: TaskPriority) => (
        <Tag color={getPriorityColor(priority)}>{getPriorityText(priority)}</Tag>
      ),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 150,
      render: (progress: number) => <Progress percent={progress} size="small" />,
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 120,
      render: (dueDate?: string) => {
        if (!dueDate) return '-';
        const isOverdue = dayjs(dueDate).isBefore(dayjs());
        return (
          <span style={{ color: isOverdue ? 'var(--color-danger-6)' : undefined }}>
            {dayjs(dueDate).format('YYYY-MM-DD')}
          </span>
        );
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_: any, record: Task) => (
        <Space>
          {record.status !== TaskStatusEnum.COMPLETED && (
            <Button
              type="text"
              size="small"
              icon={<IconCheck />}
              onClick={() => handleQuickComplete(record)}
            />
          )}
          <Dropdown
            droplist={
              <Menu>
                <Menu.Item key="edit" onClick={() => handleEdit(record)}>
                  <IconEdit /> 编辑
                </Menu.Item>
                <Menu.Item key="delete" onClick={() => handleDelete(record)}>
                  <IconDelete /> 删除
                </Menu.Item>
              </Menu>
            }
            position="br"
          >
            <Button type="text" size="small" icon={<IconMoreVertical />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className="tasks-page">
      {statistics && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic title="总任务" value={statistics.total} />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="已完成"
                value={statistics.completed}
                valueStyle={{ color: '#0fc6c2' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="进行中"
                value={statistics.inProgress}
                valueStyle={{ color: '#165dff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="完成率"
                value={`${statistics.completionRate}%`}
                valueStyle={{ color: '#00b42a' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Card
        title="任务列表"
        extra={
          <Button type="primary" icon={<IconPlus />} onClick={handleCreate}>
            新建任务
          </Button>
        }
      >
        <Table columns={columns} data={tasks} pagination={{ pageSize: 10 }} />
      </Card>

      <Modal
        title={editingTask ? '编辑任务' : '创建任务'}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        style={{ width: 700 }}
      >
        <Form form={form} layout="vertical">
          <FormItem
            label="任务标题"
            field="title"
            rules={[{ required: true, message: '请输入任务标题' }]}
          >
            <Input placeholder="请输入任务标题" />
          </FormItem>

          <FormItem label="任务描述" field="description">
            <TextArea placeholder="请输入任务描述" rows={3} />
          </FormItem>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="状态" field="status">
                <Select placeholder="选择状态" defaultValue={TaskStatusEnum.TODO}>
                  <Option value={TaskStatusEnum.TODO}>待办</Option>
                  <Option value={TaskStatusEnum.IN_PROGRESS}>进行中</Option>
                  <Option value={TaskStatusEnum.COMPLETED}>已完成</Option>
                  <Option value={TaskStatusEnum.CANCELLED}>已取消</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="优先级" field="priority">
                <Select placeholder="选择优先级" defaultValue={TaskPriorityEnum.MEDIUM}>
                  <Option value={TaskPriorityEnum.LOW}>低</Option>
                  <Option value={TaskPriorityEnum.MEDIUM}>中</Option>
                  <Option value={TaskPriorityEnum.HIGH}>高</Option>
                  <Option value={TaskPriorityEnum.URGENT}>紧急</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="开始日期" field="startDate">
                <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="截止日期" field="dueDate">
                <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <FormItem label="进度 (%)" field="progress">
                <Input type="number" min={0} max={100} placeholder="0-100" />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="预计工时 (小时)" field="estimatedHours">
                <Input type="number" min={0} step={0.5} placeholder="8" />
              </FormItem>
            </Col>
            <Col span={8}>
              <Space style={{ marginTop: 30 }}>
                <FormItem field="isImportant" style={{ marginBottom: 0 }}>
                  <Switch>
                    <span style={{ fontSize: 12 }}>重要</span>
                  </Switch>
                </FormItem>
                <FormItem field="isUrgent" style={{ marginBottom: 0 }}>
                  <Switch>
                    <span style={{ fontSize: 12 }}>紧急</span>
                  </Switch>
                </FormItem>
              </Space>
            </Col>
          </Row>

          <FormItem label="备注" field="notes">
            <TextArea placeholder="添加备注" rows={2} />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export default TasksPage;
