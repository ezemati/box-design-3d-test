import type { JSX } from 'react';
import type { MetaDescriptor } from 'react-router';
import type { Route } from './+types/home';

export function meta(routeArgs: Route.MetaArgs): MetaDescriptor[] {
    console.log({ routeArgs });
    return [
        { title: 'New React Router App' },
        { name: 'description', content: 'Welcome to React Router!' },
    ];
}

export default function Home(): JSX.Element {
    return <p>Home works!</p>;
}
