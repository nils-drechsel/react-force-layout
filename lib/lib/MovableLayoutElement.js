"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const component_size_1 = __importDefault(require("@rehooks/component-size"));
const react_draggable_1 = __importDefault(require("react-draggable"));
const react_spring_1 = require("react-spring");
exports.MovableLayoutElement = ({ children, id, x, y, setRect, removeComponent, dragRef, size }) => {
    const sizeRef = react_1.useRef(null);
    const sizes = component_size_1.default(sizeRef);
    const sizesRef = react_1.useRef(null);
    const posRef = react_1.useRef({ x, y });
    posRef.current = { x, y };
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
    }, [sizes]);
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
    const handleDragStart = (e, data) => {
        dragRef.current = id;
    };
    const handleDragStop = (e, data) => {
        dragRef.current = null;
    };
    const style = {
        padding: "8px",
        margin: "0",
        position: "absolute",
        zIndex: 1000,
        pointerEvents: "auto",
        touchAction: "auto",
        width: sizes && size && sizes.width >= sizes.height ? "" + size + "%" : "auto",
        height: sizes && size && sizes.width < sizes.height ? "" + size + "%" : "auto",
    };
    return (react_1.default.createElement(react_draggable_1.default, { onStart: handleDragStart, onDrag: handleDrag, onStop: handleDragStop, position: { x: x, y: y } },
        react_1.default.createElement("div", { ref: sizeRef, style: style }, children)));
};
exports.default = react_spring_1.animated(exports.MovableLayoutElement);
