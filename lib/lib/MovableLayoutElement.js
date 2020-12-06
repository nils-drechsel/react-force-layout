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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovableLayoutElement = void 0;
const react_1 = __importStar(require("react"));
const component_size_1 = __importDefault(require("@rehooks/component-size"));
const react_draggable_1 = __importDefault(require("react-draggable"));
const react_spring_1 = require("react-spring");
exports.MovableLayoutElement = ({ children, id, x, y, setRect, removeComponent, dragRef }) => {
    const sizeRef = react_1.useRef(null);
    const sizes = component_size_1.default(sizeRef);
    const sizesRef = react_1.useRef(null);
    const posRef = react_1.useRef({ x, y });
    posRef.current = { x, y };
    const elWidth = sizes.width;
    const elHeight = sizes.height;
    react_1.useEffect(() => {
        if (sizes && (!sizesRef.current || sizes.height !== sizesRef.current.height || sizes.width !== sizesRef.current.width)) {
            sizesRef.current = sizes;
            const rect = {
                id: id,
                x: posRef.current.x,
                y: posRef.current.y,
                width: sizesRef.current.width,
                height: sizesRef.current.height,
            };
            setRect(id, rect);
        }
    }, [elWidth, elHeight]);
    react_1.useEffect(() => {
        return () => {
            removeComponent(id);
        };
    }, []);
    const handleDrag = (e, data) => {
        e.preventDefault();
        const rect = { id: id, x: data.x, y: data.y, width: sizesRef.current ? sizesRef.current.width : 0, height: sizesRef.current ? sizesRef.current.height : 0 };
        setRect(id, rect);
    };
    const handleDragStart = (_e, _data) => {
        dragRef.current = id;
    };
    const handleDragStop = (_e, _data) => {
        dragRef.current = null;
    };
    const style = {
        padding: "8px",
        margin: "0",
        position: "absolute",
        zIndex: 1000,
        pointerEvents: "auto",
        touchAction: "auto",
    };
    return (react_1.default.createElement(react_draggable_1.default, { onStart: handleDragStart, onDrag: handleDrag, onStop: handleDragStop, position: { x: x, y: y } },
        react_1.default.createElement("div", { ref: sizeRef, style: style }, children)));
};
exports.default = react_spring_1.animated(exports.MovableLayoutElement);
//# sourceMappingURL=MovableLayoutElement.js.map