import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router';

const { Header, Content, Footer } = Layout;

const items: React.ComponentProps<typeof Menu>["items"] = [
    {
        key: "",
        label: "Home"
    },
    {
        key: "canvasTest",
        label: "Canvas"
    },
]

export const App: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const navigate = useNavigate();

    const menuClickHandler: React.ComponentProps<typeof Menu>["onClick"] = (e) => {
        navigate(e.key)
    }

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="demo-logo">MyLogo</div>
                <Menu
                    theme="light"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    items={items}
                    style={{ flex: 1, minWidth: 0 }}
                    onClick={menuClickHandler}
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
