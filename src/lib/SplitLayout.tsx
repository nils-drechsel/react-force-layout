import React, { FunctionComponent, useState, useRef, MutableRefObject } from 'react';
import { LayoutElement } from './LayoutElement';
import { LayoutComponent, Dimensions } from "./types";
import { splitPacking } from "./splitPacking";

type Props = {
    dimensions: Dimensions,
    bottomRight?: boolean
}



const wrapElement = (element: React.ReactNode, componentsRef: MutableRefObject<Map<string, LayoutComponent>>, setComponents: (callback: (state: Map<string, LayoutComponent>) => Map<string, LayoutComponent>) => void,
    dimRef: MutableRefObject<Dimensions>, dragRef: MutableRefObject<string | null>, bottomRight?: boolean) => {

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
            splitPacking(Array.from(newState.values()), dimRef.current, bottomRight);
            return newState;
        })
    }

    const e = element as any;

    const width = "splitLayoutWidth" in e.props ? e.props.splitLayoutWidth : null;
    const height = "splitLayoutHeight" in e.props ? e.props.splitLayoutHeight : null;
    const flip = "splitLayoutFlip" in e.props ? e.props.splitLayoutFlip : false;

    return (
        <LayoutElement
            setRect={setRect}
            dragRef={dragRef}
            componentsRef={componentsRef}
            removeComponent={removeComponent}
            width={width}
            height={height}
            flip={flip}
        >
            {element}
        </LayoutElement>
    )

}



export const SplitLayout: FunctionComponent<Props> = ({ children, dimensions, bottomRight }) => {

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


    const wrappedChildren = React.Children.map(children, child => wrapElement(child, componentsRef, setComponents, dimRef, dragRef, bottomRight));


    return (
        <div style={style}>
            {wrappedChildren}
        </div>
    )


}


