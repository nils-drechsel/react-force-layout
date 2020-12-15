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
const SplitLayout_1 = require("./SplitLayout");
const polyfilled_1 = __importDefault(require("use-resize-observer/polyfilled"));
exports.LayoutElement = ({ children }) => {
    const [id] = react_1.useState(uuid_1.v4());
    const layoutManager = react_1.useContext(SplitLayout_1.SplitLayoutContext);
    const [config, setConfig] = react_1.useState({ x: 0, y: 0, visible: false });
    const ref = react_1.useRef();
    polyfilled_1.default({ ref,
        onResize: ({ width, height }) => {
            if (width && height)
                layoutManager.updateDimensions(id, width, height);
        },
    });
    react_1.useEffect(() => {
        layoutManager.registerComponent(id, setConfig);
        return () => {
            layoutManager.deregisterComponent(id);
        };
    }, [id]);
    const setPosition = (x, y, store) => {
        ref.current.style.top = y + "px";
        ref.current.style.left = x + "px";
        if (store) {
            layoutManager.updatePosition(id, x, y);
        }
    };
    const setAutoLayout = (turnOn) => {
        layoutManager.setAutoLayout(turnOn);
    };
    const newElement = react_1.default.cloneElement(children, {
        setPosition,
        setAutoLayout,
        x: config.x,
        y: config.y,
    });
    const style = {
        margin: "0",
        position: "absolute",
        zIndex: 1000,
        left: config.x,
        top: config.y,
    };
    return (react_1.default.createElement("div", { ref: ref, style: style }, newElement));
};
//# sourceMappingURL=LayoutElement.js.map