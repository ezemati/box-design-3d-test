import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CanvasState {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CanvasActions {}

export const useStore = create<CanvasState & CanvasActions>()(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    devtools(immer((set) => ({}))),
);
