export declare type Dimensions = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export interface ComponentPositionSetter {
    (position: {
        x: number;
        y: number;
    }): void;
}
export interface ComponentConfiguration {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    setConfiguration: ComponentPositionSetter;
}
export interface ComponentPosition {
    x: number;
    y: number;
}
export declare class LayoutManager {
    components: Map<string, ComponentConfiguration>;
    dim: Dimensions;
    invert: boolean;
    logging: boolean;
    autoLayoutIsOn: boolean;
    constructor(dim: Dimensions, invert: boolean, logging?: boolean);
    setDimensions(dim: Dimensions): void;
    setAutoLayout(turnOn: boolean): void;
    registerComponent(id: string, setConfiguration: ComponentPositionSetter): void;
    deregisterComponent(id: string): void;
    updatePosition(id: string, x: number, y: number): void;
    updateDimensions(id: string, width: number, height: number): void;
    autoLayout(): void;
    layout(): void;
}
