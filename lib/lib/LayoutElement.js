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
const react_spring_1 = require("react-spring");
const MovableLayoutElement_1 = __importDefault(require("./MovableLayoutElement"));
exports.LayoutElement = ({ children, initialX, initialY, setRect, calculateForceVector, removeComponent }) => {
    const [rectState, setRectState] = react_1.useState({ x: initialX, y: initialY, width: 0, height: 0 });
    const [drag, setDrag] = react_1.useState(false);
    const props = react_spring_1.useSpring({ x: rectState.x, y: rectState.y, config: drag ? { duration: 1 } : { mass: 5, tension: 160, friction: 14 } });
    const updateRect = (id, rect) => {
        setRect(id, rect);
        setRectState(rect);
    };
    return (react_1.default.createElement(MovableLayoutElement_1.default, { x: props.x, y: props.y, setRect: updateRect, calculateForceVector: calculateForceVector, removeComponent: removeComponent, drag: drag, setDrag: setDrag }, children));
};
