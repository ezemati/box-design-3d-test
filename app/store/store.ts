import { canvasReducer } from '@/features/canvas/canvasSlice';
import type { ThunkAction, UnknownAction } from '@reduxjs/toolkit';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

const rootReducer = combineReducers({ canvas: canvasReducer });

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['canvas/setCanvasInstance'],
                ignoredPaths: ['canvas.canvas'],
            },
        }),
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = AppStore['dispatch'];

export type AppThunk<ThunkReturnType = void> = ThunkAction<
    ThunkReturnType,
    RootState,
    unknown,
    UnknownAction
>;
