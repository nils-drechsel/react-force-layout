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
const splitPacking_1 = require("./splitPacking");
const wrapElement = (element, componentsRef, setComponents, forceConstant, dimRef, dragRef) => {
    const setRect = (id, rect) => {
        setComponents((state) => {
            const newState = new Map(state);
            newState.set(id, rect);
            const oldRect = state.get(id);
            if (!oldRect || (oldRect.width !== rect.width || oldRect.height !== rect.height)) {
                splitPacking_1.splitPacking(Array.from(newState.values()), dimRef.current, true);
            }
            return newState;
        });
    };
    const removeComponent = (id) => {
        setComponents((state) => {
            const newState = new Map(state);
            newState.delete(id);
            splitPacking_1.splitPacking(Array.from(newState.values()), dimRef.current, true);
            return newState;
        });
    };
    const e = element;
    const initialPosition = "forceLayoutInitialPosition" in e.props ? e.props.forceLayoutInitialPosition : { x: 0, y: 0 };
    const size = "forceLayoutSize" in e.props ? e.props.forceLayoutSize : null;
    console.log("initialPosition", initialPosition);
    return (react_1.default.createElement(LayoutElement_1.LayoutElement, { initialX: initialPosition.x, initialY: initialPosition.y, setRect: setRect, dragRef: dragRef, componentsRef: componentsRef, removeComponent: removeComponent, size: size }, element));
};
exports.ForceLayout = ({ children, forceConstant, dimensions }) => {
    const [components, setComponents] = react_1.useState(new Map());
    const componentsRef = react_1.useRef(components);
    componentsRef.current = components;
    const dimRef = react_1.useRef(dimensions);
    dimRef.current = dimensions;
    const dragRef = react_1.useRef(null);
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
    const wrappedChildren = react_1.default.Children.map(children, child => wrapElement(child, componentsRef, setComponents, forceConstant, dimRef, dragRef));
    return (react_1.default.createElement("div", { style: style }, wrappedChildren));
};
