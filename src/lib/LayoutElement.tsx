import React, { FunctionComponent, useState, MutableRefObject, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSpring } from 'react-spring'
import MovableLayoutElement from './MovableLayoutElement';
import { LayoutComponent } from "./types";

type Props = {
    setRect: (id: string, rect: LayoutComponent) => void,
    removeComponent: (id: string) => void,
    width: any,
    height: any,
    flip: boolean,
    dragRef: MutableRefObject<string | null>
    componentsRef: MutableRefObject<Map<string, LayoutComponent>>
}


export const LayoutElement: FunctionComponent<Props> = ({ children, componentsRef, setRect, width, height, flip, removeComponent, dragRef }) => {

    const [id] = useState(uuidv4());
    const [visible, setVisible] = useState(false);

    const rect = componentsRef.current.has(id) ? componentsRef.current.get(id)! : { id: id, x: -1, y: -1, width: 0, height: 0 };

    const props = useSpring({ x: rect.x, y: rect.y, config: dragRef.current === id || !visible ? { duration: 1, mass: 0, tension: 10000, friction: 0 } : { mass: 1, tension: 210, friction: 20 } });

    useEffect(() => {
        if (!visible && rect.x !== -1 && rect.y !== -1) {
            setVisible(true);
        }
    }, [visible, rect.x, rect.y]);



    const updateRect = (id: string, rect: LayoutComponent) => {
        setRect(id, rect);
    }


    return (
        <MovableLayoutElement
            id={id}
            x={visible ? props.x : rect.x}
            y={visible ? props.y : rect.y}
            setRect={updateRect}
            removeComponent={removeComponent}
            width={width}
            height={height}
            flip={flip}
            dragRef={dragRef}
        >

            {children}

        </MovableLayoutElement>
    )


}

