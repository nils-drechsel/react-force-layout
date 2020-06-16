import { LayoutComponent, Dimensions, SubStrip } from "./types";



export const splitPacking = (components: Array<LayoutComponent>, dimensions: Dimensions, inverted?: boolean) => {

    console.log("COMPONENTS START:", JSON.stringify(components));

    // sort deterministacally into nonincreasing order

    const I = [...components];

    I.sort((a, b) => {
        const cmp = a.width - b.width;
        if (cmp !== 0) return cmp;
        return a.id > b.id ? 1 : -1;
    })

    const initialS: SubStrip = {
        x: 0,
        y: 0,
        width: dimensions.width,
        lower: 0,
        upper: 0,
        itemWidth: dimensions.width,
    }

    let S: Array<SubStrip> = [initialS];


    while (I.length > 0) {
        const i: LayoutComponent = I.shift()!;

        const S2 = S.filter(s => s.width - s.itemWidth >= i.width);

        if (S2.length === 0) {
            const targetS = S.reduce((minS, s) => s.upper < minS.upper ? s : minS, S[0]);
            i.x = inverted ? dimensions.width - (targetS.x + i.width) : targetS.x;
            i.y = inverted ? dimensions.height - (targetS.upper + i.height) : targetS.upper;
            targetS.lower = targetS.upper;
            targetS.upper = targetS.upper + i.height;
            targetS.itemWidth = i.width;
        } else {
            const targetS = S.reduce((minS, s) => s.lower < minS.lower ? s : minS, S[0]);
            i.x = inverted ? dimensions.width - (targetS.x + targetS.itemWidth + i.width) : targetS.x + targetS.itemWidth;
            i.y = inverted ? dimensions.height - (targetS.lower + i.height) : targetS.lower;
            S = S.filter(s => s !== targetS);
            S.push({
                x: targetS.x,
                y: targetS.upper,
                width: targetS.itemWidth,
                lower: targetS.upper,
                upper: targetS.upper,
                itemWidth: targetS.itemWidth
            })
            S.push({
                x: targetS.x + targetS.itemWidth,
                y: targetS.lower,
                width: targetS.width - targetS.itemWidth,
                lower: targetS.lower,
                upper: i.height,
                itemWidth: i.width
            })

        }
    }

    console.log("COMPONENTS:", components);


}