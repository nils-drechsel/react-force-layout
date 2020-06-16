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
const uuid_1 = require("uuid");
const react_spring_1 = require("react-spring");
const MovableLayoutElement_1 = __importDefault(require("./MovableLayoutElement"));
exports.LayoutElement = ({ children, initialX, initialY, componentsRef, setRect, size, removeComponent, dragRef }) => {
    const [id] = react_1.useState(uuid_1.v4());
    const rect = componentsRef.current.has(id) ? componentsRef.current.get(id) : { id: id, x: initialX, y: initialY, width: 0, height: 0 };
    const props = react_spring_1.useSpring({ x: rect.x, y: rect.y, config: dragRef.current === id ? { duration: 1 } : { mass: 1, tension: 210, friction: 20 } });
    const updateRect = (id, rect) => {
        setRect(id, rect);
    };
    return (react_1.default.createElement(MovableLayoutElement_1.default, { id: id, x: props.x, y: props.y, setRect: updateRect, removeComponent: removeComponent, size: size, dragRef: dragRef }, children));
};
