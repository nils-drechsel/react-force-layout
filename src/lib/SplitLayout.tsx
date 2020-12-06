import React, { FunctionComponent, useState, useRef, MutableRefObject, useEffect } from 'react';
import { LayoutElement } from './LayoutElement';
import { LayoutComponent, Dimensions } from "./types";
import { splitPacking } from "./splitPacking";

type Props = {
    dimensions: Dimensions,
    bottomRight?: boolean
    logging?: boolean
}



const wrapElement = (element: React.ReactNode, componentsRef: MutableRefObject<Map<string, LayoutComponent>>, setComponents: (callback: (state: Map<string, LayoutComponent>) => Map<string, LayoutComponent>) => void,
    dimRef: MutableRefObject<Dimensions>, dragRef: MutableRefObject<string | null>, bottomRight?: boolean, logging?: boolean) => {
    
    const setRect = (id: string, rect: LayoutComponent) => {

        if (logging) console.log("setting rect", id, rect);

        setComponents((state: Map<string, LayoutComponent>) => {
            const newState = new Map(state);
            newState.set(id, rect);

            const oldRect = state.get(id)!;

            if (!oldRect || (oldRect.width !== rect.width || oldRect.height !== rect.height)) {
                splitPacking(Array.from(newState.values()), dimRef.current, bottomRight, logging);
            }

            return newState;
        })
    }

    const removeComponent = (id: string,) => {
        console.log("removing component",id)
        setComponents((state: Map<string, LayoutComponent>) => {
            const newState = new Map(state);
            newState.delete(id);
            splitPacking(Array.from(newState.values()), dimRef.current, bottomRight, logging);
            return newState;
        })
    }


    return (
        <LayoutElement
            setRect={setRect}
            dragRef={dragRef}
            componentsRef={componentsRef}
            removeComponent={removeComponent}
        >
            {element}
        </LayoutElement>
    )

}



export const SplitLayout: FunctionComponent<Props> = ({ children, dimensions, bottomRight, logging }) => {

    const [components, setComponents] = useState(new Map() as Map<string, LayoutComponent>);
    const componentsRef = useRef(components);
    componentsRef.current = components;

    const dimRef = useRef(dimensions);
    dimRef.current = dimensions;


    const dragRef = useRef(null as string | null);

    const width = dimensions.width;
    const height = dimensions.height;

    if (logging) console.log("width/height", width, height);

    useEffect(() => {


        setComponents((state: Map<string, LayoutComponent>) => {

            if (logging) console.log("refreshing components", state);

            const newState = new Map(state);
            splitPacking(Array.from(newState.values()), dimRef.current, bottomRight, logging);
            return newState;
        })        


    }, [width, height, bottomRight]);




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


    const wrappedChildren = React.Children.map(children, child => wrapElement(child, componentsRef, setComponents, dimRef, dragRef, bottomRight, logging));


    return (
        <div style={style}>
            {wrappedChildren}
        </div>
    )


}


