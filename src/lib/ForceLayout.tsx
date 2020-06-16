import React, { FunctionComponent, useEffect, useState, useRef, ReactElement, MutableRefObject } from 'react';
import { LayoutElement } from './LayoutElement';
import { useAnimationFrame } from "react-use-animationframe";
import { LayoutComponent, Dimensions, Vector } from "./types";
import { calculateForceVectors, vectorAdd } from "./force";
import { splitPacking } from "./splitPacking";

type Props = {
    forceConstant: number,
    dimensions: Dimensions,
}



const wrapElement = (element: React.ReactNode, componentsRef: MutableRefObject<Map<string, LayoutComponent>>, setComponents: (callback: (state: Map<string, LayoutComponent>) => Map<string, LayoutComponent>) => void,
    forceConstant: number, dimRef: MutableRefObject<Dimensions>, dragRef: MutableRefObject<string | null>) => {

    const setRect = (id: string, rect: LayoutComponent) => {

        setComponents((state: Map<string, LayoutComponent>) => {
            const newState = new Map(state);
            newState.set(id, rect);

            const oldRect = state.get(id)!;

            if (!oldRect || (oldRect.width !== rect.width || oldRect.height !== rect.height)) {
                splitPacking(Array.from(newState.values()), dimRef.current, true);
            }

            return newState;
        })
    }

    const removeComponent = (id: string,) => {
        setComponents((state: Map<string, LayoutComponent>) => {
            const newState = new Map(state);
            newState.delete(id);
            splitPacking(Array.from(newState.values()), dimRef.current, true);
            return newState;
        })
    }

    const e = element as any;
    const initialPosition = "forceLayoutInitialPosition" in e.props ? e.props.forceLayoutInitialPosition : { x: 0, y: 0 };

    const size = "forceLayoutSize" in e.props ? e.props.forceLayoutSize : null;

    console.log("initialPosition", initialPosition);

    return (
        <LayoutElement
            initialX={initialPosition.x}
            initialY={initialPosition.y}
            setRect={setRect}
            dragRef={dragRef}
            componentsRef={componentsRef}
            removeComponent={removeComponent}
            size={size}
        >
            {element}
        </LayoutElement>
    )

}



export const ForceLayout: FunctionComponent<Props> = ({ children, forceConstant, dimensions }) => {

    const [components, setComponents] = useState(new Map() as Map<string, LayoutComponent>);
    const componentsRef = useRef(components);
    componentsRef.current = components;

    const dimRef = useRef(dimensions);
    dimRef.current = dimensions;


    const dragRef = useRef(null as string | null);





    const style = {
        padding: 0,
        margin: 0,
        position: "relative",
        width: "100%",
        height: "100%",
        zIndex: 901,
        pointerEvents: "none",
        touchAction: "none",
    } as React.CSSProperties;


    const wrappedChildren = React.Children.map(children, child => wrapElement(child, componentsRef, setComponents, forceConstant, dimRef, dragRef));


    return (
        <div style={style}>
            {wrappedChildren}
        </div>
    )


}


