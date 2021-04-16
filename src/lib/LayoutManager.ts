import { splitPacking } from "./splitPacking";



export type Dimensions = {
    x: number,
    y: number,
    width: number,
    height: number,
}



export interface ComponentPositionSetter {
    (position: { x: number, y: number }): void;
}


export interface ComponentConfiguration {
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    setConfiguration: ComponentPositionSetter,
}

export interface ComponentPosition {
    x: number,
    y: number,
}


export class LayoutManager {

    components: Map<string, ComponentConfiguration> = new Map();
    dim: Dimensions;
    invert: boolean;
    logging: boolean;
    autoLayoutIsOn: boolean = true;

    constructor(dim: Dimensions, invert: boolean, logging = true) {
        this.dim = dim;
        this.invert = invert;
        this.logging = logging;
    }

    setDimensions(dim: Dimensions) {
        this.dim = dim;
        this.autoLayout();
    }

    setAutoLayout(turnOn: boolean) {
        this.autoLayoutIsOn = turnOn;
    }

    registerComponent(id: string, setConfiguration: ComponentPositionSetter) {

        if (this.logging) console.log("registering component", id);

        const configuration: ComponentConfiguration = {
            id,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            setConfiguration: setConfiguration,
        }

        this.components.set(id, configuration);

        this.autoLayout();

    }

    deregisterComponent(id: string) {

        if (this.logging) console.log("deregistering component", id);

        this.components.delete(id);

        this.autoLayout();

    }

    updatePosition(id: string, x: number, y: number) {
        if (!this.components.has(id)) return;

        const config = this.components.get(id)!;
        config.x = x;
        config.y = y;
        
    }

    updateDimensions(id: string, width: number, height: number) {
        if (!this.components.has(id)) return;
        if (!width || !height) return;
        const config = this.components.get(id)!;

        config.width = width;
        config.height = height;

        if (this.logging) console.log("update dimensions", id, width, height);

        this.autoLayout();
    }

    autoLayout() {
        if (this.autoLayoutIsOn) this.layout();
    }

    layout() {

        const comps = Array.from(this.components.values()).filter(comp => !!comp.width && !!comp.height);

        if (this.logging) console.log("performing layout", this.components.size, comps.length);

        splitPacking(comps, this.dim, this.invert, this.logging);

        comps.forEach(comp => comp.setConfiguration({ x: comp.x, y: comp.y}));

    }



}