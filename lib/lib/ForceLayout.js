"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const LayoutElement_1 = require("./LayoutElement");
const convertToCoordinates = (a) => {
    return ({
        x0: a.x,
        x1: a.x + a.width,
        y0: a.y,
        y1: a.y + a.height,
    });
};
const calculateOverlap = (a, b) => {
    const xa1 = a.x;
    const xa2 = a.x + a.width;
    const ya1 = a.y;
    const ya2 = a.y + a.height;
    const xb1 = b.x;
    const xb2 = b.x + b.width;
    const yb1 = b.y;
    const yb2 = b.y + b.height;
    const intersection = Math.max(0, Math.min(xa2, xb2) - Math.max(xa1, xb1)) * Math.max(0, Math.min(ya2, yb2) - Math.max(ya1, yb1));
    return intersection / (a.width * a.height);
};
const calculateSeparation = (a, b) => {
    const centreA = getCentre(a);
    const centreB = getCentre(b);
    const v = calculateVector(centreA, centreB);
    v.x = Math.max(0, Math.abs(v.x) - (a.width + b.width) / 2);
    v.y = Math.max(0, Math.abs(v.y) - (a.height + b.height) / 2);
    return exports.vectorLength(v);
};
exports.vectorLength = (v) => {
    return Math.sqrt(v.x * v.x + v.y * v.y);
};
exports.vectorMult = (v, s) => {
    return {
        x: v.x * s,
        y: v.y * s
    };
};
exports.vectorAdd = (v0, v1) => {
    return {
        x: v0.x + v1.x,
        y: v0.y + v1.y
    };
};
const getCentre = (component) => {
    return { x: component.x + component.width / 2, y: component.y + component.height / 2 };
};
const calculateVector = (centre0, centre1) => {
    return { x: centre1.x - centre0.x, y: centre1.y - centre0.y };
};
const calculateForce = (centre0, centre1, forceConstant) => {
    const v = calculateVector(centre0, centre1);
    const vl = exports.vectorLength(v);
    return exports.vectorMult(v, -forceConstant / vl);
};
const ATTRACTION_DISTANCE = 250;
const VOID_DISTANCE = 25;
const ATTRACTION_FACTOR = -1 / 5;
const calculateForceVector = (id, componentsRef, forceConstant, dimRef) => {
    const components = componentsRef.current;
    if (!components.has(id))
        return { x: 0, y: 0 };
    const component = components.get(id);
    const centre = getCentre(component);
    let vector = { x: 0, y: 0 };
    components.forEach((value, key) => {
        if (key === id)
            return;
        const overlap = calculateOverlap(component, value);
        if (overlap > 0) {
            vector = exports.vectorAdd(vector, calculateForce(centre, getCentre(value), forceConstant));
        }
    });
    const dimensions = dimRef.current;
    if (dimensions) {
        if (component.x < 0)
            vector = exports.vectorAdd(vector, exports.vectorMult({ x: 1, y: 0 }, forceConstant));
        else if (component.x + component.width > dimensions.width)
            vector = exports.vectorAdd(vector, exports.vectorMult({ x: -1, y: 0 }, forceConstant));
        else if (component.x < ATTRACTION_DISTANCE && component.x > VOID_DISTANCE)
            vector = exports.vectorAdd(vector, exports.vectorMult({ x: 1, y: 0 }, forceConstant * ATTRACTION_FACTOR));
        else if (component.x + component.width > dimensions.width - ATTRACTION_DISTANCE && component.x + component.width < dimensions.width - VOID_DISTANCE)
            vector = exports.vectorAdd(vector, exports.vectorMult({ x: -1, y: 0 }, forceConstant * ATTRACTION_FACTOR));
        if (component.y < 0)
            vector = exports.vectorAdd(vector, exports.vectorMult({ x: 0, y: 1 }, forceConstant));
        else if (component.y + component.height > dimensions.height)
            vector = exports.vectorAdd(vector, exports.vectorMult({ x: 0, y: -1 }, forceConstant));
        else if (component.y < ATTRACTION_DISTANCE && component.y > VOID_DISTANCE)
            vector = exports.vectorAdd(vector, exports.vectorMult({ x: 0, y: 1 }, forceConstant * ATTRACTION_FACTOR));
        else if (component.y + component.height > dimensions.height - ATTRACTION_DISTANCE && component.y + component.height < dimensions.height - VOID_DISTANCE)
            vector = exports.vectorAdd(vector, exports.vectorMult({ x: 0, y: -1 }, forceConstant * ATTRACTION_FACTOR));
    }
    return vector;
};
const wrapElement = (element, componentsRef, setComponents, forceConstant, dimRef) => {
    const setRect = (id, rect) => {
        console.log("SET RECT", id, rect);
        setComponents((state) => {
            const newState = new Map(state);
            newState.set(id, rect);
            return newState;
        });
    };
    const removeComponent = (id) => {
        setComponents((state) => {
            const newState = new Map(state);
            newState.delete(id);
            return newState;
        });
    };
    const e = element;
    const initialPosition = "forceLayoutInitialPosition" in e.props ? e.props.forceLayoutInitialPosition : { x: 0, y: 0 };
    const size = "forceLayoutSize" in e.props ? e.props.forceLayoutSize : null;
    console.log("initialPosition", initialPosition);
    return (react_1.default.createElement(LayoutElement_1.LayoutElement, { initialX: initialPosition.x, initialY: initialPosition.y, setRect: setRect, removeComponent: removeComponent, calculateForceVector: (id) => calculateForceVector(id, componentsRef, forceConstant, dimRef), size: size }, element));
};
exports.ForceLayout = ({ children, forceConstant, dimensions }) => {
    const [components, setComponents] = react_1.useState(new Map());
    const componentsRef = react_1.useRef(components);
    componentsRef.current = components;
    const dimRef = react_1.useRef(dimensions);
    dimRef.current = dimensions;
    const style = {
        padding: 0,
        margin: 0,
        position: "relative",
        width: "100%",
        height: "100%",
        zIndex: 901,
        pointerEvents: "none",
        touchAction: "none",
    };
    const wrappedChildren = react_1.default.Children.map(children, child => wrapElement(child, componentsRef, setComponents, forceConstant, dimRef));
    return (react_1.default.createElement("div", { style: style }, wrappedChildren));
};
