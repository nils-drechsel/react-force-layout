import { FunctionComponent, MutableRefObject } from 'react';
import { LayoutComponent } from "./types";
declare type Props = {
    setRect: (id: string, rect: LayoutComponent) => void;
    removeComponent: (id: string) => void;
    dragRef: MutableRefObject<string | null>;
    componentsRef: MutableRefObject<Map<string, LayoutComponent>>;
};
export declare const LayoutElement: FunctionComponent<Props>;
export {};
