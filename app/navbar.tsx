import React, { useState } from 'react';
import { HomeOutlined, MailOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useNavigate } from 'react-router';

type MenuItem = Required<MenuProps>['items'][number];

// https://ant.design/components/menu#examples
const items: MenuItem[] = [
    {
        label: 'Home',
        key: '',
        icon: <HomeOutlined />,
        disabled: false,
    },
    {
        label: 'Welcome',
        key: 'welcome',
        icon: <MailOutlined />,
        disabled: false,
    },
    {
        label: 'Canvas Test',
        key: 'canvasTest',
        // icon: <MailOutlined />,
        disabled: false,
    },
];

export const Navbar: React.FC = () => {
    const [current, setCurrent] = useState('');
    const navigate = useNavigate();

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
        navigate(e.key);
    };

    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};
