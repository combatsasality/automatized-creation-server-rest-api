import { ConfigProvider, theme } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';

import { LoginView } from './containers/LoginView';

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: '#ff33fc' },
        algorithm: theme.darkAlgorithm,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginView />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
