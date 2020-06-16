import React, { FunctionComponent, MutableRefObject } from 'react';
import { LayoutComponent } from "./types";
declare type Props = {
    id: string;
    x: number;
    y: number;
    setRect: (id: string, rect: LayoutComponent) => void;
    removeComponent: (id: string) => void;
    size: number | null;
    dragRef: MutableRefObject<string | null>;
};
export declare const MovableLayoutElement: FunctionComponent<Props>;
declare const _default: React.ForwardRefExoticComponent<React.PropsWithChildren<Props>>;
export default _default;
