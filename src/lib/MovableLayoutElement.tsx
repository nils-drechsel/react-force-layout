import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import useComponentSize, { ComponentSize } from '@rehooks/component-size'
import { v4 as uuidv4 } from 'uuid';
import { Rect, Vector } from "./ForceLayout";
import { useAnimationFrame } from "react-use-animationframe";
import Draggable, { DraggableData, DraggableEventHandler } from 'react-draggable';
import { useSpring, animated } from 'react-spring'

type Props = {
    x: number,
    y: number,
    setRect: (id: string, rect: Rect) => void,
    calculateForceVector: (id: string) => Vector;
    removeComponent: (id: string) => void,
    drag: boolean,
    setDrag: (drag: boolean) => void,
}


export const MovableLayoutElement: FunctionComponent<Props> = ({ children, x, y, setRect, calculateForceVector, removeComponent, drag, setDrag }) => {

    const sizeRef = useRef(null);
    const sizes = useComponentSize(sizeRef);
    const sizesRef = useRef(null as ComponentSize | null);

    const posRef = useRef({ x, y });
    posRef.current = { x, y };

    const [id] = useState(uuidv4());


    const dragRef = useRef(drag);
    dragRef.current = drag;



    useAnimationFrame((time) => {
        if (dragRef.current) return;

        const v = calculateForceVector(id);
        if (v.x || v.y) {
            console.log("force", id, v);

            const rect: Rect = {
                x: posRef.current.x + v.x,
                y: posRef.current.y + v.y,
                width: sizesRef.current ? sizesRef.current.width : 0,
                height: sizesRef.current ? sizesRef.current.height : 0,
            }

            setRect(id, rect);
        }

    }, 150);

    useEffect(() => {
        if (sizes && (!sizesRef.current || sizes.height !== sizesRef.current.height || sizes.width !== sizesRef.current.width)) {
            sizesRef.current = sizes;

            const rect: Rect = {
                x: posRef.current.x,
                y: posRef.current.y,
                width: sizesRef.current.width,
                height: sizesRef.current.height,
            }

            setRect(id, rect);
        }

    }, [sizes])

    useEffect(() => {

        return () => {
            removeComponent(id);
        }

    }, []);




    const handleDrag = (e: Event, data: DraggableData) => {
        e.preventDefault();
        const rect = { x: data.x, y: data.y, width: sizesRef.current ? sizesRef.current.width : 0, height: sizesRef.current ? sizesRef.current.height : 0 }
        setRect(id, rect);
    }

    const handleDragStart = (e: Event, data: DraggableData) => {
        setDrag(true);
    }

    const handleDragStop = (e: Event, data: DraggableData) => {
        setDrag(false);
    }



    const style = {
        padding: 0,
        margin: 0,
        position: "absolute",
        zIndex: 1000,
        pointerEvents: "auto",
        touchAction: "auto",
    } as React.CSSProperties;



    return (
        <Draggable
            onStart={handleDragStart as DraggableEventHandler}
            onDrag={handleDrag as DraggableEventHandler}
            onStop={handleDragStop as DraggableEventHandler}
            position={{ x: x, y: y }}
        >
            <div
                ref={sizeRef}
                style={style}
            >
                {children}
            </div>
        </Draggable >
    )


}



export default animated(MovableLayoutElement);