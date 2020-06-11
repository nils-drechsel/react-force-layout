import { FunctionComponent } from 'react';
declare type Props = {
    forceConstant: number;
    dimensions?: Rect;
};
export declare type Vector = {
    x: number;
    y: number;
};
export declare const vectorLength: (v: Vector) => number;
export declare const vectorMult: (v: Vector, s: number) => Vector;
export declare const vectorAdd: (v0: Vector, v1: Vector) => Vector;
export declare type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare const ForceLayout: FunctionComponent<Props>;
export {};
