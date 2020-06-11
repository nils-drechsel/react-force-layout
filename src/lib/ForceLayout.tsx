import React, { FunctionComponent, useEffect, useState, useRef, ReactElement, MutableRefObject } from 'react';
import { LayoutElement } from './LayoutElement';

type Props = {
    forceConstant: number,
    dimensions?: Rect,
}


const calculateOverlap = (a: Rect, b: Rect): number => {
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

export type Vector = {
    x: number,
    y: number,
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


const getCentre = (component: Rect): Vector => {
    return { x: component.x + component.width / 2, y: component.y + component.height / 2 }
}

const calculateVector = (centre0: Vector, centre1: Vector): Vector => {
    return { x: centre1.x - centre0.x, y: centre1.y - centre0.y };
}


const calculateForceVector = (id: string, componentsRef: MutableRefObject<Map<string, Rect>>, forceConstant: number, dimRef: MutableRefObject<Rect | undefined>): Vector => {

    const components = componentsRef.current;

    if (!components.has(id)) return { x: 0, y: 0 };

    const component = components.get(id)!;
    const centre = getCentre(component);

    let vector: Vector = { x: 0, y: 0 };

    components.forEach((value: Rect, key: string) => {
        if (key === id) return;


        const overlap = calculateOverlap(component, value);
        if (overlap > 0) {
            const otherCentre = getCentre(value);
            const v = calculateVector(centre, otherCentre);
            const vl = vectorLength(v);
            const forceVector = vectorMult(v, -forceConstant / vl);

            vector = vectorAdd(vector, forceVector);

        }

    });

    const dimensions = dimRef.current;


    if (dimensions) {
        if (component.x < 0) vector = vectorAdd(vector, vectorMult({ x: 1, y: 0 }, forceConstant));
        else if (component.x + component.width > dimensions.width) vector = vectorAdd(vector, vectorMult({ x: -1, y: 0 }, forceConstant));

        if (component.y < 0) vector = vectorAdd(vector, vectorMult({ x: 0, y: 1 }, forceConstant));
        else if (component.y + component.height > dimensions.height) vector = vectorAdd(vector, vectorMult({ x: 0, y: -1 }, forceConstant));
    }




    return vector;


}



const wrapElement = (element: React.ReactNode, componentsRef: MutableRefObject<Map<string, Rect>>, setComponents: (callback: (state: Map<string, Rect>) => Map<string, Rect>) => void, forceConstant: number, dimRef: MutableRefObject<Rect | undefined>) => {

    const setRect = (id: string, rect: Rect) => {
        setComponents((state: Map<string, Rect>) => {
            const newState = new Map(state);
            newState.set(id, rect);
            return newState;
        })
    }

    const removeComponent = (id: string,) => {
        setComponents((state: Map<string, Rect>) => {
            const newState = new Map(state);
            newState.delete(id);
            return newState;
        })
    }


    return (
        <LayoutElement
            initialX={0}
            initialY={0}
            setRect={setRect}
            removeComponent={removeComponent}
            calculateForceVector={(id: string) => calculateForceVector(id, componentsRef, forceConstant, dimRef)}
        >
            {element}
        </LayoutElement>
    )

}


export type Rect = {
    x: number,
    y: number,
    width: number,
    height: number,

}



export const ForceLayout: FunctionComponent<Props> = ({ children, forceConstant, dimensions }) => {

    const [components, setComponents] = useState(new Map() as Map<string, Rect>);
    const componentsRef = useRef(components);
    componentsRef.current = components;

    const dimRef = useRef(dimensions);
    dimRef.current = dimensions;


    const style = {
        padding: 0,
        margin: 0,
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 901,
        pointerEvents: "none",
        touchAction: "none",
    } as React.CSSProperties;


    const wrappedChildren = React.Children.map(children, child => wrapElement(child, componentsRef, setComponents, forceConstant, dimRef));


    return (
        <div style={style}>
            {wrappedChildren}
        </div>
    )


}


