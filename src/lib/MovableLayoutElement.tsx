import React, { FunctionComponent, useEffect, useRef, MutableRefObject } from 'react';
import useComponentSize, { ComponentSize } from '@rehooks/component-size'
import Draggable, { DraggableData, DraggableEventHandler } from 'react-draggable';
import { animated } from 'react-spring'
import { LayoutComponent } from "./types";

type Props = {
    id: string,
    x: number,
    y: number,
    setRect: (id: string, rect: LayoutComponent) => void,
    removeComponent: (id: string) => void,
    dragRef: MutableRefObject<string | null>
}


export const MovableLayoutElement: FunctionComponent<Props> = ({ children, id, x, y, setRect, removeComponent, dragRef }) => {

    const sizeRef = useRef(null);
    const sizes = useComponentSize(sizeRef);
    const sizesRef = useRef(null as ComponentSize | null);

    const posRef = useRef({ x, y });
    posRef.current = { x, y };


    const elWidth = sizes.width;
    const elHeight = sizes.height;

    useEffect(() => {
        if (sizes && (!sizesRef.current || sizes.height !== sizesRef.current.height || sizes.width !== sizesRef.current.width)) {
            sizesRef.current = sizes;

            const rect: LayoutComponent = {
                id: id,
                x: posRef.current.x,
                y: posRef.current.y,
                width: sizesRef.current.width,
                height: sizesRef.current.height,
            }

            setRect(id, rect);
        }

    }, [elWidth, elHeight])

    useEffect(() => {

        return () => {
            removeComponent(id);
        }

    }, []);


    const handleDrag = (e: Event, data: DraggableData) => {
        e.preventDefault();
        const rect = { id: id, x: data.x, y: data.y, width: sizesRef.current ? sizesRef.current.width : 0, height: sizesRef.current ? sizesRef.current.height : 0 }
        setRect(id, rect);
    }

    const handleDragStart = (_e: Event, _data: DraggableData) => {
        dragRef.current = id;
    }

    const handleDragStop = (_e: Event, _data: DraggableData) => {
        dragRef.current = null;
    }

    const style = {
        padding: "8px",
        margin: "0",
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