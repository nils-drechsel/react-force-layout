import { FunctionComponent } from 'react';
import { Rect, Vector } from "./ForceLayout";
declare type Props = {
    initialX: number;
    initialY: number;
    setRect: (id: string, rect: Rect) => void;
    calculateForceVector: (id: string) => Vector;
    removeComponent: (id: string) => void;
    size: number | null;
};
export declare const LayoutElement: FunctionComponent<Props>;
export {};
