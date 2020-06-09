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
const react_draggable_1 = __importDefault(require("react-draggable"));
exports.LayoutElement = ({ children, initialX, initialY, setRect, calculateForceVector, removeComponent }) => {
    const sizeRef = react_1.useRef(null);
    const sizes = component_size_1.default(sizeRef);
    const sizesRef = react_1.useRef(null);
    const [id] = react_1.useState(uuid_1.v4());
    const [rectState, setRectState] = react_1.useState({ x: initialX, y: initialY, width: 0, height: 0 });
    react_1.useEffect(() => {
        if (sizes && (!sizesRef.current || sizes.height !== sizesRef.current.height || sizes.width !== sizesRef.current.width)) {
            sizesRef.current = sizes;
            const v = calculateForceVector(id);
            const rect = {
                x: rectState.x + v.x,
                y: rectState.y + v.y,
                width: sizes.width,
                height: sizes.height,
            };
            setRectState(rect);
            setRect(id, rect);
        }
    }, [sizes]);
    react_1.useEffect(() => {
        return () => {
            removeComponent(id);
        };
    }, []);
    const style = {
        padding: 0,
        margin: 0,
        position: "absolute",
        tansform: "translate(" + rectState.x + "px, " + rectState.y + "px)",
    };
    return (react_1.default.createElement(react_draggable_1.default, null,
        react_1.default.createElement("div", { ref: sizeRef, style: style }, children)));
};
