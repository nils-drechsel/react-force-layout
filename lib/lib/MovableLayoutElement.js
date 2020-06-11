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
const uuid_1 = require("uuid");
const react_use_animationframe_1 = require("react-use-animationframe");
const react_draggable_1 = __importDefault(require("react-draggable"));
const react_spring_1 = require("react-spring");
exports.MovableLayoutElement = ({ children, x, y, setRect, calculateForceVector, removeComponent, drag, setDrag }) => {
    const sizeRef = react_1.useRef(null);
    const sizes = component_size_1.default(sizeRef);
    const sizesRef = react_1.useRef(null);
    const posRef = react_1.useRef({ x, y });
    posRef.current = { x, y };
    const [id] = react_1.useState(uuid_1.v4());
    const dragRef = react_1.useRef(drag);
    dragRef.current = drag;
    react_use_animationframe_1.useAnimationFrame((time) => {
        if (dragRef.current)
            return;
        const v = calculateForceVector(id);
        if (v.x || v.y) {
            console.log("force", id, v);
            const rect = {
                x: posRef.current.x + v.x,
                y: posRef.current.y + v.y,
                width: sizesRef.current ? sizesRef.current.width : 0,
                height: sizesRef.current ? sizesRef.current.height : 0,
            };
            setRect(id, rect);
        }
    }, 150);
    react_1.useEffect(() => {
        if (sizes && (!sizesRef.current || sizes.height !== sizesRef.current.height || sizes.width !== sizesRef.current.width)) {
            sizesRef.current = sizes;
            const rect = {
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
        const rect = { x: data.x, y: data.y, width: sizesRef.current ? sizesRef.current.width : 0, height: sizesRef.current ? sizesRef.current.height : 0 };
        setRect(id, rect);
    };
    const handleDragStart = (e, data) => {
        setDrag(true);
    };
    const handleDragStop = (e, data) => {
        setDrag(false);
    };
    const style = {
        padding: 0,
        margin: 0,
        position: "absolute",
        zIndex: 1000,
        pointerEvents: "auto",
        touchAction: "auto",
    };
    return (react_1.default.createElement(react_draggable_1.default, { onStart: handleDragStart, onDrag: handleDrag, onStop: handleDragStop, position: { x: x, y: y } },
        react_1.default.createElement("div", { ref: sizeRef, style: style }, children)));
};
exports.default = react_spring_1.animated(exports.MovableLayoutElement);
