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
exports.LayoutElement = void 0;
const react_1 = __importStar(require("react"));
const uuid_1 = require("uuid");
const react_spring_1 = require("react-spring");
const MovableLayoutElement_1 = __importDefault(require("./MovableLayoutElement"));
exports.LayoutElement = ({ children, componentsRef, setRect, width, height, flip, removeComponent, dragRef }) => {
    const [id] = react_1.useState(uuid_1.v4());
    const [visible, setVisible] = react_1.useState(false);
    const rect = componentsRef.current.has(id) ? componentsRef.current.get(id) : { id: id, x: -1, y: -1, width: 0, height: 0 };
    const props = react_spring_1.useSpring({ x: rect.x, y: rect.y, config: dragRef.current === id || !visible ? { duration: 1, mass: 0, tension: 10000, friction: 0 } : { mass: 1, tension: 210, friction: 20 } });
    react_1.useEffect(() => {
        if (!visible && rect.x !== -1 && rect.y !== -1) {
            setVisible(true);
        }
    }, [visible, rect.x, rect.y]);
    const updateRect = (id, rect) => {
        setRect(id, rect);
    };
    return (react_1.default.createElement(MovableLayoutElement_1.default, { id: id, x: visible ? props.x : rect.x, y: visible ? props.y : rect.y, setRect: updateRect, removeComponent: removeComponent, width: width, height: height, flip: flip, dragRef: dragRef }, children));
};
