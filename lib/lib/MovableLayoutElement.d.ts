import React, { FunctionComponent } from 'react';
import { Rect, Vector } from "./ForceLayout";
declare type Props = {
    x: number;
    y: number;
    setRect: (id: string, rect: Rect) => void;
    calculateForceVector: (id: string) => Vector;
    removeComponent: (id: string) => void;
    drag: boolean;
    setDrag: (drag: boolean) => void;
    size: number | null;
};
export declare const MovableLayoutElement: FunctionComponent<Props>;
declare const _default: React.ForwardRefExoticComponent<React.PropsWithChildren<Props>>;
export default _default;
