import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from '@arco-design/web-react';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import Layout from './components/Layout';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/calendar" replace />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="*" element={<Navigate to="/calendar" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
