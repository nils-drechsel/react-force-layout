"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayoutManager = void 0;
const splitPacking_1 = require("./splitPacking");
class LayoutManager {
    constructor(dim, invert, logging = true) {
        this.components = new Map();
        this.autoLayoutIsOn = true;
        this.dim = dim;
        this.invert = invert;
        this.logging = logging;
    }
    setDimensions(dim) {
        this.dim = dim;
        this.autoLayout();
    }
    setAutoLayout(turnOn) {
        this.autoLayoutIsOn = turnOn;
    }
    registerComponent(id, setConfiguration) {
        if (this.logging)
            console.log("registering component", id);
        const configuration = {
            id,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            setConfiguration: setConfiguration,
        };
        this.components.set(id, configuration);
        this.autoLayout();
    }
    deregisterComponent(id) {
        if (this.logging)
            console.log("deregistering component", id);
        this.components.delete(id);
        this.autoLayout();
    }
    updatePosition(id, x, y) {
        if (!this.components.has(id))
            return;
        const config = this.components.get(id);
        config.x = x;
        config.y = y;
        config.setConfiguration({ x: x, y: y, visible: !!config.width && !!config.height });
    }
    updateDimensions(id, width, height) {
        if (!this.components.has(id))
            return;
        if (!width || !height)
            return;
        const config = this.components.get(id);
        config.width = width;
        config.height = height;
        if (this.logging)
            console.log("update dimensions", id, width, height);
        this.autoLayout();
    }
    autoLayout() {
        if (this.autoLayoutIsOn)
            this.layout();
    }
    layout() {
        const comps = Array.from(this.components.values()).filter(comp => !!comp.width && !!comp.height);
        if (this.logging)
            console.log("performing layout", this.components.size, comps.length);
        splitPacking_1.splitPacking(comps, this.dim, this.invert, this.logging);
        comps.forEach(comp => comp.setConfiguration({ x: comp.x, y: comp.y, visible: true }));
    }
}
exports.LayoutManager = LayoutManager;
//# sourceMappingURL=LayoutManager.js.map