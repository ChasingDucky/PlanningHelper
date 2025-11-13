import { useEffect, useState, useRef } from 'react';
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Switch,
  Message,
  Space,
} from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import zhCnLocale from '@fullcalendar/core/locales/zh-cn';
import dayjs from 'dayjs';
import { useCalendarStore } from '@store/calendarStore';
import { calendarApi } from '@services/calendar';
import type { CalendarEvent, CreateEventDto } from '@/types/calendar';
import { EventCategory as EventCategoryEnum } from '@/types/calendar';
import './index.css';

const FormItem = Form.Item;
const { TextArea } = Input;

function CalendarPage() {
  const calendarRef = useRef<any>(null);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const { events, fetchEvents, addEvent, updateEvent, removeEvent } = useCalendarStore();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      await fetchEvents();
    } catch (error) {
      Message.error('加载事件失败');
    }
  };

  const handleDateClick = (arg: any) => {
    form.resetFields();
    form.setFieldValue('startTime', dayjs(arg.date));
    form.setFieldValue('endTime', dayjs(arg.date).add(1, 'hour'));
    setEditingEvent(null);
    setModalVisible(true);
  };

  const handleEventClick = (info: any) => {
    const event = events.find((e) => e.id === info.event.id);
    if (event) {
      setEditingEvent(event);
      form.setFieldsValue({
        title: event.title,
        description: event.description,
        startTime: dayjs(event.startTime),
        endTime: dayjs(event.endTime),
        allDay: event.allDay,
        category: event.category,
        location: event.location,
        color: event.color,
      });
      setModalVisible(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validate();
      const eventData: CreateEventDto = {
        title: values.title,
        description: values.description,
        startTime: values.startTime.toISOString(),
        endTime: values.endTime.toISOString(),
        allDay: values.allDay || false,
        category: values.category || EventCategoryEnum.OTHER,
        location: values.location,
        color: values.color || '#1890ff',
      };

      if (editingEvent) {
        const updated = await calendarApi.updateEvent(editingEvent.id, eventData);
        updateEvent(editingEvent.id, updated);
        Message.success('事件更新成功');
      } else {
        const created = await calendarApi.createEvent(eventData);
        addEvent(created);
        Message.success('事件创建成功');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      Message.error(editingEvent ? '更新失败' : '创建失败');
    }
  };

  const handleDelete = async () => {
    if (!editingEvent) return;

    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个事件吗？',
      onOk: async () => {
        try {
          await calendarApi.deleteEvent(editingEvent.id);
          removeEvent(editingEvent.id);
          Message.success('事件删除成功');
          setModalVisible(false);
        } catch (error) {
          Message.error('删除失败');
        }
      },
    });
  };

  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.startTime,
    end: event.endTime,
    allDay: event.allDay,
    backgroundColor: event.color,
    borderColor: event.color,
  }));

  const categoryOptions = [
    { label: '工作', value: EventCategoryEnum.WORK },
    { label: '学习', value: EventCategoryEnum.STUDY },
    { label: '个人', value: EventCategoryEnum.PERSONAL },
    { label: '会议', value: EventCategoryEnum.MEETING },
    { label: '截止日期', value: EventCategoryEnum.DEADLINE },
    { label: '其他', value: EventCategoryEnum.OTHER },
  ];

  return (
    <div className="calendar-page">
      <Card
        title="日程管理"
        extra={
          <Button type="primary" icon={<IconPlus />} onClick={() => {
            form.resetFields();
            form.setFieldValue('startTime', dayjs());
            form.setFieldValue('endTime', dayjs().add(1, 'hour'));
            setEditingEvent(null);
            setModalVisible(true);
          }}>
            新建事件
          </Button>
        }
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          locale={zhCnLocale}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
          }}
          buttonText={{
            today: '今天',
            month: '月',
            week: '周',
            day: '日',
            list: '列表',
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={calendarEvents}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
        />
      </Card>

      <Modal
        title={editingEvent ? '编辑事件' : '创建事件'}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        style={{ width: 600 }}
        footer={
          <Space>
            {editingEvent && (
              <Button type="primary" status="danger" onClick={handleDelete}>
                删除
              </Button>
            )}
            <Button onClick={() => setModalVisible(false)}>取消</Button>
            <Button type="primary" onClick={handleSubmit}>
              {editingEvent ? '更新' : '创建'}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <FormItem label="标题" field="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="请输入事件标题" />
          </FormItem>

          <FormItem label="描述" field="description">
            <TextArea placeholder="请输入事件描述" rows={3} />
          </FormItem>

          <Space size="large" style={{ width: '100%' }}>
            <FormItem
              label="开始时间"
              field="startTime"
              rules={[{ required: true, message: '请选择开始时间' }]}
              style={{ flex: 1 }}
            >
              <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
            </FormItem>

            <FormItem
              label="结束时间"
              field="endTime"
              rules={[{ required: true, message: '请选择结束时间' }]}
              style={{ flex: 1 }}
            >
              <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
            </FormItem>
          </Space>

          <Space size="large" style={{ width: '100%' }}>
            <FormItem label="分类" field="category" style={{ flex: 1 }}>
              <Select placeholder="选择分类" options={categoryOptions} />
            </FormItem>

            <FormItem label="全天事件" field="allDay" style={{ flex: 1 }}>
              <Switch />
            </FormItem>
          </Space>

          <FormItem label="地点" field="location">
            <Input placeholder="请输入地点" />
          </FormItem>

          <FormItem label="颜色" field="color">
            <Input type="color" style={{ width: 100 }} />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}

export default CalendarPage;
