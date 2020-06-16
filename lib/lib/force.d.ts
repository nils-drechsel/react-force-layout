import { LayoutComponent, Dimensions, Vector } from "./types";
import { MutableRefObject } from "react";
export declare const vectorLength: (v: Vector) => number;
export declare const vectorMult: (v: Vector, s: number) => Vector;
export declare const vectorAdd: (v0: Vector, v1: Vector) => Vector;
export declare const calculateForceVectors: (componentsRef: MutableRefObject<Map<string, LayoutComponent>>, forceConstant: number, dimensions: Dimensions) => Map<string, Vector>;
