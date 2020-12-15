import React, { FunctionComponent, useState, useEffect, useContext, useRef, MutableRefObject } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SplitLayoutContext } from './SplitLayout';
import { ComponentPosition, LayoutManager } from './LayoutManager';
import useResizeObserver from "use-resize-observer/polyfilled";

interface Props {
}


export const LayoutElement: FunctionComponent<Props> = ({ children }) => {

    const [id] = useState(uuidv4());
    const layoutManager: LayoutManager = useContext(SplitLayoutContext);
    const [config, setConfig] = useState({ x: 0, y: 0, visible: false } as ComponentPosition);

    const ref = useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>;
    
        useResizeObserver<HTMLDivElement>({ref,
        onResize: ({ width, height }) => {
            if (width && height) layoutManager.updateDimensions(id, width, height);
        },
    });

    useEffect(() => {

        layoutManager.registerComponent(id, setConfig);

        return () => {
            layoutManager.deregisterComponent(id);
        }

    }, [id]);

    const setPosition = (x: number, y: number, store: boolean) => {
        ref.current.style.top = y + "px";
        ref.current.style.left = x + "px";
        if (store) {
            layoutManager.updatePosition(id, x, y)
        }
    };


    const setAutoLayout = (turnOn: boolean) => {
        layoutManager.setAutoLayout(turnOn);
    }

    const newElement = React.cloneElement(children as any, {
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

    } as React.CSSProperties;

    return (
        <div
            ref={ref}
            style={style}
        >
            {newElement}
        </div>
    )


}

