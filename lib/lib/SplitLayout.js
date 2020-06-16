"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitLayout = void 0;
const react_1 = __importStar(require("react"));
const LayoutElement_1 = require("./LayoutElement");
const splitPacking_1 = require("./splitPacking");
const wrapElement = (element, componentsRef, setComponents, dimRef, dragRef, bottomRight) => {
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
            splitPacking_1.splitPacking(Array.from(newState.values()), dimRef.current, bottomRight);
            return newState;
        });
    };
    const e = element;
    const width = "splitLayoutWidth" in e.props ? e.props.splitLayoutWidth : null;
    const height = "splitLayoutHeight" in e.props ? e.props.splitLayoutHeight : null;
    const flip = "splitLayoutFlip" in e.props ? e.props.splitLayoutFlip : false;
    return (react_1.default.createElement(LayoutElement_1.LayoutElement, { setRect: setRect, dragRef: dragRef, componentsRef: componentsRef, removeComponent: removeComponent, width: width, height: height, flip: flip }, element));
};
exports.SplitLayout = ({ children, dimensions, bottomRight }) => {
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
    const wrappedChildren = react_1.default.Children.map(children, child => wrapElement(child, componentsRef, setComponents, dimRef, dragRef, bottomRight));
    return (react_1.default.createElement("div", { style: style }, wrappedChildren));
};
