import React, { FunctionComponent, useEffect, useRef, useState, MutableRefObject } from 'react';
import useComponentSize, { ComponentSize } from '@rehooks/component-size'
import { v4 as uuidv4 } from 'uuid';
import { useAnimationFrame } from "react-use-animationframe";
import Draggable, { DraggableData, DraggableEventHandler } from 'react-draggable';
import { useSpring, config } from 'react-spring'
import MovableLayoutElement from './MovableLayoutElement';
import { LayoutComponent, Dimensions, Vector } from "./types";

type Props = {
    initialX: number,
    initialY: number,
    setRect: (id: string, rect: LayoutComponent) => void,
    removeComponent: (id: string) => void,
    size: number | null,
    dragRef: MutableRefObject<string | null>
    componentsRef: MutableRefObject<Map<string, LayoutComponent>>
}


export const LayoutElement: FunctionComponent<Props> = ({ children, initialX, initialY, componentsRef, setRect, size, removeComponent, dragRef }) => {

    const [id] = useState(uuidv4());

    const rect = componentsRef.current.has(id) ? componentsRef.current.get(id)! : { id: id, x: initialX, y: initialY, width: 0, height: 0 };



    const props = useSpring({ x: rect.x, y: rect.y, config: dragRef.current === id ? { duration: 1 } : { mass: 1, tension: 210, friction: 20 } });



    const updateRect = (id: string, rect: LayoutComponent) => {
        setRect(id, rect);
    }


    return (
        <MovableLayoutElement
            id={id}
            x={props.x}
            y={props.y}
            setRect={updateRect}
            removeComponent={removeComponent}
            size={size}
            dragRef={dragRef}
        >

            {children}

        </MovableLayoutElement>
    )


}

