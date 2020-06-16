import { FunctionComponent, MutableRefObject } from 'react';
import { LayoutComponent } from "./types";
declare type Props = {
    initialX: number;
    initialY: number;
    setRect: (id: string, rect: LayoutComponent) => void;
    removeComponent: (id: string) => void;
    size: number | null;
    dragRef: MutableRefObject<string | null>;
    componentsRef: MutableRefObject<Map<string, LayoutComponent>>;
};
export declare const LayoutElement: FunctionComponent<Props>;
export {};
