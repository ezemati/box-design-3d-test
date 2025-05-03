import { Layout, theme, type MenuProps } from 'antd';
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Navbar } from './navbar';

const { Header, Content, Footer } = Layout;

export const App: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [currentRoute, setCurrentRoute] = useState('');
    const navigate = useNavigate();

    const handleMenuItemClick: MenuProps['onClick'] = (e) => {
        setCurrentRoute(e.key);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        navigate(e.key);
    };

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo">MyLogo</div>
                <Navbar
                    currentRoute={currentRoute}
                    onMenuItemClick={handleMenuItemClick}
                />
            </Header>
            <Content style={{ padding: '0 48px' }}>
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
    );
};
