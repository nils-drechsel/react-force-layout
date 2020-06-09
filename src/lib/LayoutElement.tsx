import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import useComponentSize, { ComponentSize } from '@rehooks/component-size'
import { v4 as uuidv4 } from 'uuid';
import { Rect, Vector } from "./ForceLayout";
import Draggable from 'react-draggable';

type Props = {
    initialX: number,
    initialY: number,
    setRect: (id: string, rect: Rect) => void,
    calculateForceVector: (id: string) => Vector;
    removeComponent: (id: string) => void,
}


export const LayoutElement: FunctionComponent<Props> = ({ children, initialX, initialY, setRect, calculateForceVector, removeComponent }) => {

    const sizeRef = useRef(null);
    const sizes = useComponentSize(sizeRef);
    const sizesRef = useRef(null as ComponentSize | null);

    const [id] = useState(uuidv4());
    const [rectState, setRectState] = useState({ x: initialX, y: initialY, width: 0, height: 0 } as Rect)

    useEffect(() => {
        if (sizes && (!sizesRef.current || sizes.height !== sizesRef.current.height || sizes.width !== sizesRef.current.width)) {
            sizesRef.current = sizes;

            const v = calculateForceVector(id);

            const rect: Rect = {
                x: rectState.x + v.x,
                y: rectState.y + v.y,
                width: sizes.width,
                height: sizes.height,
            }

            setRectState(rect);
            setRect(id, rect);
        }

    }, [sizes])

    useEffect(() => {

        return () => {
            removeComponent(id);
        }

    }, []);


    const style = {
        padding: 0,
        margin: 0,
        position: "absolute",
        tansform: "translate(" + rectState.x + "px, " + rectState.y + "px)",
    } as React.CSSProperties;


    return (
        <Draggable>
            <div ref={sizeRef} style={style}>
                {children}
            </div>
        </Draggable>
    )


}

