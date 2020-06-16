import { LayoutComponent, Dimensions, Vector } from "./types";
import { MutableRefObject } from "react";



const convertToCoordinates = (a: LayoutComponent) => {
    return ({
        x0: a.x,
        x1: a.x + a.width,
        y0: a.y,
        y1: a.y + a.height,
    })
}


const calculateOverlap = (a: LayoutComponent, b: LayoutComponent): number => {

    const xa1 = a.x;
    const xa2 = a.x + a.width;
    const ya1 = a.y;
    const ya2 = a.y + a.height;

    const xb1 = b.x;
    const xb2 = b.x + b.width;
    const yb1 = b.y;
    const yb2 = b.y + b.height;


    const intersection = Math.max(0, Math.min(xa2, xb2) - Math.max(xa1, xb1)) * Math.max(0, Math.min(ya2, yb2) - Math.max(ya1, yb1));

    return intersection / (a.width * a.height);
}



export const vectorLength = (v: Vector): number => {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

export const vectorMult = (v: Vector, s: number): Vector => {
    return {
        x: v.x * s,
        y: v.y * s
    }
}

export const vectorAdd = (v0: Vector, v1: Vector): Vector => {
    return {
        x: v0.x + v1.x,
        y: v0.y + v1.y
    }
}


const getCentre = (component: LayoutComponent): Vector => {
    return { x: component.x + component.width / 2, y: component.y + component.height / 2 }
}

const calculateVector = (centre0: Vector, centre1: Vector): Vector => {
    return { x: centre1.x - centre0.x, y: centre1.y - centre0.y };
}


const calculateForceDirection = (centre0: Vector, centre1: Vector) => {
    const v = calculateVector(centre0, centre1);
    const vl = vectorLength(v);
    return vectorMult(v, 1 / vl);
}

const calculateForce = (v: Vector, forceConstant: number) => {
    return vectorMult(v, forceConstant);
}


/*
export const calculateForceVector = (id: string, componentsRef: MutableRefObject<Map<string, LayoutComponent>>, forceConstant: number, dimRef: MutableRefObject<Dimensions | undefined>): Vector => {

    const components = componentsRef.current;

    if (!components.has(id)) return { x: 0, y: 0 };

    const component = components.get(id)!;
    const centre = getCentre(component);

    let vector: Vector = { x: 0, y: 0 };

    components.forEach((value: LayoutComponent, key: string) => {
        if (key === id) return;


        const overlap = calculateOverlap(component, value);
        if (overlap > 0) {
            vector = vectorAdd(vector, calculateForce(centre, getCentre(value), forceConstant));
        }

    });

    const dimensions = dimRef.current;


    if (dimensions) {
        if (component.x < 0) vector = vectorAdd(vector, vectorMult({ x: 1, y: 0 }, forceConstant));
        else if (component.x + component.width > dimensions.width) vector = vectorAdd(vector, vectorMult({ x: -1, y: 0 }, forceConstant));
        else if (component.x < ATTRACTION_DISTANCE && component.x > VOID_DISTANCE) vector = vectorAdd(vector, vectorMult({ x: 1, y: 0 }, forceConstant * ATTRACTION_FACTOR));
        else if (component.x + component.width > dimensions.width - ATTRACTION_DISTANCE && component.x + component.width < dimensions.width - VOID_DISTANCE) vector = vectorAdd(vector, vectorMult({ x: -1, y: 0 }, forceConstant * ATTRACTION_FACTOR));

        if (component.y < 0) vector = vectorAdd(vector, vectorMult({ x: 0, y: 1 }, forceConstant));
        else if (component.y + component.height > dimensions.height) vector = vectorAdd(vector, vectorMult({ x: 0, y: -1 }, forceConstant));
        else if (component.y < ATTRACTION_DISTANCE && component.y > VOID_DISTANCE) vector = vectorAdd(vector, vectorMult({ x: 0, y: 1 }, forceConstant * ATTRACTION_FACTOR));
        else if (component.y + component.height > dimensions.height - ATTRACTION_DISTANCE && component.y + component.height < dimensions.height - VOID_DISTANCE) vector = vectorAdd(vector, vectorMult({ x: 0, y: -1 }, forceConstant * ATTRACTION_FACTOR));
    }




    return vector;


}

*/


export const calculateForceVectors = (componentsRef: MutableRefObject<Map<string, LayoutComponent>>, forceConstant: number, dimensions: Dimensions): Map<string, Vector> => {

    const components = Array.from(componentsRef.current.values());
    const result: Map<string, Vector> = new Map();


    const addForce = (id: string, v: Vector) => {
        if (!result.has(id)) result.set(id, v);
        else result.set(id, vectorAdd(result.get(id)!, v));
    }

    for (let i = 0; i < components.length; ++i) {
        const component0 = components[i];
        let centre0 = null;
        for (let j = i + 1; j < components.length; ++j) {
            const component1 = components[j];

            const overlap0 = calculateOverlap(component0, component1);
            if (!overlap0) continue;
            const overlap1 = calculateOverlap(component1, component0);

            if (!centre0) centre0 = getCentre(component0);
            const centre1 = getCentre(component1);

            const direction = calculateForceDirection(centre0, centre1);
            const force0 = calculateForce(direction, forceConstant * overlap0);
            const force1 = calculateForce(direction, -forceConstant * overlap1);

            addForce(component0.id, force0);
            addForce(component1.id, force0);
        }



        if (dimensions) {
            if (component0.x < 0) addForce(component0.id, vectorMult({ x: 1, y: 0 }, forceConstant));
            else if (component0.x + component0.width > dimensions.width) addForce(component0.id, vectorMult({ x: -1, y: 0 }, forceConstant));

            if (component0.y < 0) addForce(component0.id, vectorMult({ x: 0, y: 1 }, forceConstant));
            else if (component0.y + component0.height > dimensions.height) addForce(component0.id, vectorMult({ x: 0, y: -1 }, forceConstant));
        }


    }

    return result;

}
