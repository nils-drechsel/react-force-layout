"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitPacking = void 0;
const splitPacking = (components, dimensions, inverted, logging) => {
    if (logging)
        console.log("creating split packing on " + components.length + " components using dimensions ", dimensions, inverted);
    // sort deterministacally into nonincreasing order
    const remainingComponents = [...components];
    remainingComponents.sort((a, b) => {
        const cmp = a.width - b.width;
        if (cmp !== 0)
            return cmp;
        return a.id > b.id ? 1 : -1;
    });
    const initialS = {
        x: 0,
        y: 0,
        width: dimensions.width,
        lower: 0,
        upper: 0,
        itemWidth: dimensions.width,
    };
    let strip = [initialS];
    while (remainingComponents.length > 0) {
        const component = remainingComponents.shift();
        const usableStrips = strip.filter(s => s.width - s.itemWidth >= component.width);
        if (usableStrips.length === 0) {
            const targetStrip = strip.reduce((minStrip, s) => s.upper < minStrip.upper ? s : minStrip, strip[0]);
            component.x = inverted ? dimensions.width - (targetStrip.x + component.width) : targetStrip.x;
            component.y = inverted ? dimensions.height - (targetStrip.upper + component.height) : targetStrip.upper;
            targetStrip.lower = targetStrip.upper;
            targetStrip.upper = targetStrip.upper + component.height;
            targetStrip.itemWidth = component.width;
        }
        else {
            const targetStrip = strip.reduce((minStrip, s) => s.lower < minStrip.lower ? s : minStrip, strip[0]);
            component.x = inverted ? dimensions.width - (targetStrip.x + targetStrip.itemWidth + component.width) : targetStrip.x + targetStrip.itemWidth;
            component.y = inverted ? dimensions.height - (targetStrip.lower + component.height) : targetStrip.lower;
            strip = strip.filter(s => s !== targetStrip);
            strip.push({
                x: targetStrip.x,
                y: targetStrip.upper,
                width: targetStrip.itemWidth,
                lower: targetStrip.upper,
                upper: targetStrip.upper,
                itemWidth: targetStrip.itemWidth
            });
            strip.push({
                x: targetStrip.x + targetStrip.itemWidth,
                y: targetStrip.lower,
                width: targetStrip.width - targetStrip.itemWidth,
                lower: targetStrip.lower,
                upper: component.height,
                itemWidth: component.width
            });
        }
    }
    if (logging)
        console.log("component layout", components);
};
exports.splitPacking = splitPacking;
//# sourceMappingURL=splitPacking.js.map