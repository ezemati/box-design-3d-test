import { HomeOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { type JSX } from 'react';

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
        label: 'Canvas Test',
        key: 'canvasTest',
        // icon: <MailOutlined />,
        disabled: false,
    },
];

export interface NavbarProps {
    currentRoute: string;
    onMenuItemClick: MenuProps['onClick'];
}

export function Navbar({
    currentRoute,
    onMenuItemClick,
}: NavbarProps): JSX.Element {
    return (
        <Menu
            onClick={onMenuItemClick}
            selectedKeys={[currentRoute]}
            mode="horizontal"
            items={items}
            style={{ flex: 1, minWidth: 0 }}
            theme="light"
        />
    );
}
