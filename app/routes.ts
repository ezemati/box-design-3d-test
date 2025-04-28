import {
    type RouteConfig,
    index,
    route
} from '@react-router/dev/routes';

export default [
    index('home/home.tsx'),
    route("canvasTest", "./canvas-test/canvas-test.tsx"),
] satisfies RouteConfig;
