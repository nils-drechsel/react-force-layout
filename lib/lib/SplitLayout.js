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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitLayout = exports.SplitLayoutContext = void 0;
const react_1 = __importStar(require("react"));
const LayoutElement_1 = require("./LayoutElement");
const LayoutManager_1 = require("./LayoutManager");
const wrapElement = (element) => {
    return (react_1.default.createElement(LayoutElement_1.LayoutElement, null, element));
};
exports.SplitLayoutContext = react_1.createContext(null);
const SplitLayout = ({ children, dimensions, bottomRight, logging }) => {
    const wrappedChildren = react_1.default.Children.map(children, child => wrapElement(child));
    const managerRef = react_1.useRef();
    if (!managerRef.current) {
        console.log("creating layout manager");
        managerRef.current = new LayoutManager_1.LayoutManager(dimensions, !!bottomRight, logging);
    }
    react_1.useEffect(() => {
        managerRef.current.setDimensions({
            width: dimensions.width,
            height: dimensions.height,
            x: dimensions.x,
            y: dimensions.y,
        });
    }, [dimensions.width, dimensions.height, dimensions.x, dimensions.y]);
    return (react_1.default.createElement(exports.SplitLayoutContext.Provider, { value: managerRef.current }, wrappedChildren));
};
exports.SplitLayout = SplitLayout;
//# sourceMappingURL=SplitLayout.js.map