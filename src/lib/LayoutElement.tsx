import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import useComponentSize, { ComponentSize } from '@rehooks/component-size'
import { v4 as uuidv4 } from 'uuid';
import { Rect, Vector } from "./ForceLayout";
import { useAnimationFrame } from "react-use-animationframe";
import Draggable, { DraggableData, DraggableEventHandler } from 'react-draggable';
import { useSpring, config } from 'react-spring'
import MovableLayoutElement from './MovableLayoutElement';

type Props = {
    initialX: number,
    initialY: number,
    setRect: (id: string, rect: Rect) => void,
    calculateForceVector: (id: string) => Vector;
    removeComponent: (id: string) => void,
}


export const LayoutElement: FunctionComponent<Props> = ({ children, initialX, initialY, setRect, calculateForceVector, removeComponent }) => {

    const [rectState, setRectState] = useState({ x: initialX, y: initialY, width: 0, height: 0 } as Rect)
    const [drag, setDrag] = useState(false);



    const props = useSpring({ x: rectState.x, y: rectState.y, config: drag ? { duration: 1 } : { mass: 5, tension: 160, friction: 14 } });



    const updateRect = (id: string, rect: Rect) => {
        setRect(id, rect);
        setRectState(rect);
    }


    return (
        <MovableLayoutElement
            x={props.x}
            y={props.y}
            setRect={updateRect}
            calculateForceVector={calculateForceVector}
            removeComponent={removeComponent}
            drag={drag}
            setDrag={setDrag}
        >

            {children}

        </MovableLayoutElement>
    )


}

