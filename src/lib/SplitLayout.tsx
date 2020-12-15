import React, { FunctionComponent, useRef, createContext, useEffect } from 'react';
import { LayoutElement } from './LayoutElement';
import { Dimensions, LayoutManager } from './LayoutManager';

type Props = {
    dimensions: Dimensions,
    bottomRight?: boolean
    logging?: boolean
}



const wrapElement = (element: React.ReactNode) => {
    return (
        <LayoutElement
        >
            {element}
        </LayoutElement>
    )

}



export const SplitLayoutContext = createContext<LayoutManager>(null as any);

export const SplitLayout: FunctionComponent<Props> = ({ children, dimensions, bottomRight, logging }) => {

    const wrappedChildren = React.Children.map(children, child => wrapElement(child));


    const managerRef = useRef<LayoutManager>();
    if (!managerRef.current) {
        console.log("creating layout manager");
        managerRef.current = new LayoutManager(dimensions, !!bottomRight, logging);
    }

    useEffect(() => {

        managerRef.current!.setDimensions({
            width: dimensions.width,
            height: dimensions.height,
            x: dimensions.x,
            y: dimensions.y,
        })
        
    }, [dimensions.width, dimensions.height, dimensions.x, dimensions.y]);
    

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


    return (
        <div style={style}>
        <SplitLayoutContext.Provider
                value={managerRef.current}
            >
                {wrappedChildren}
        </SplitLayoutContext.Provider>
        </div>
    )


}


