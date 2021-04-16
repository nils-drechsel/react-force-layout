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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
const SplitLayout_1 = require("./SplitLayout");
const react_rnd_1 = require("react-rnd");
const use_resize_observer_1 = __importDefault(require("use-resize-observer"));
const LayoutElement = ({ children }) => {
    const [id] = react_1.useState(uuid_1.v4());
    const layoutManager = react_1.useContext(SplitLayout_1.SplitLayoutContext);
    const [position, setPosition] = react_1.useState({ x: 0, y: 0 });
    //const [visible, setVisible] = useState(false);
    const [size, setSize] = react_1.useState(undefined);
    const [delta, setDelta] = react_1.useState(0);
    const [currentDelta, setCurrentDelta] = react_1.useState(0);
    const ref = react_1.useRef(null);
    use_resize_observer_1.default({ ref,
        onResize: ({ width, height }) => {
            if (width && height) {
                layoutManager.updateDimensions(id, width, height);
                setSize({ width, height });
            }
        },
    });
    react_1.useEffect(() => {
        layoutManager.registerComponent(id, setPosition);
        return () => {
            layoutManager.deregisterComponent(id);
        };
    }, [id]);
    const handleUpdatePosition = (d) => {
        const position = { x: d.x, y: d.y };
        setPosition(position);
        layoutManager.updatePosition(id, position.x, position.y);
    };
    // const handleUpdateSize = (ref: HTMLElement): void => {
    //     const size = { width: ref.offsetWidth, height: ref.offsetHeight }
    //     setSize(size);
    //     //layoutManager.updateDimensions(id, size.width, size.height);
    // }
    const newElement = react_1.default.cloneElement(children, {
        delta: delta + currentDelta
    });
    const style = {
        width: "fit-content",
        height: "fit-content",
    };
    return (react_1.default.createElement(react_rnd_1.Rnd, { size: size, position: position, onDragStop: (_e, d) => handleUpdatePosition(d), onResize: (_e, _direction, _ref, delta, _position) => {
            setCurrentDelta(Math.max(delta.width, delta.height));
        }, onResizeStop: (_e, _direction, _ref, delta, _position) => {
            setCurrentDelta(0);
            setDelta((old) => old + Math.max(delta.width, delta.height));
        }, lockAspectRatio: true },
        react_1.default.createElement("div", { ref: ref, style: style }, newElement)));
};
exports.LayoutElement = LayoutElement;
//# sourceMappingURL=LayoutElement.js.map