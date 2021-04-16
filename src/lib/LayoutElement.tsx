import React, { FunctionComponent, useState, useEffect, useContext, useRef, ReactElement} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SplitLayoutContext } from './SplitLayout';
import { DraggableData, Rnd } from 'react-rnd';
import { LayoutManager } from './LayoutManager';
import useResizeObserver from 'use-resize-observer';

interface Props {
}


export const LayoutElement: FunctionComponent<Props> = ({ children }) => {

    const [id] = useState(uuidv4());
    const layoutManager: LayoutManager = useContext(SplitLayoutContext);

    const [position, setPosition] = useState({ x: 0, y: 0 });
    //const [visible, setVisible] = useState(false);
    const [size, setSize] = useState(undefined as { width: number | string, height: number | string } | undefined);
    const [delta, setDelta] = useState(0);
    const [currentDelta, setCurrentDelta] = useState(0);

    const ref = useRef<HTMLDivElement | null>(null);
    
        useResizeObserver<HTMLDivElement>({ref,
        onResize: ({ width, height }) => {
            if (width && height) {
                layoutManager.updateDimensions(id, width, height);
                setSize({ width, height });
            }
        },
    });    


    useEffect(() => {

        layoutManager.registerComponent(id, setPosition);

        return () => {
            layoutManager.deregisterComponent(id);
        }

    }, [id]);


    const handleUpdatePosition = (d: DraggableData): void => {
        const position = { x: d.x, y: d.y };
        setPosition(position);
        layoutManager.updatePosition(id, position.x, position.y);
    }

    // const handleUpdateSize = (ref: HTMLElement): void => {
    //     const size = { width: ref.offsetWidth, height: ref.offsetHeight }
    //     setSize(size);
    //     //layoutManager.updateDimensions(id, size.width, size.height);
    // }

    const newElement = React.cloneElement(children as ReactElement, {
        delta: delta + currentDelta
    });

    const style = {
        width: "fit-content",
        height: "fit-content",
    }
    
    return (
        <Rnd
            size={size}
            position={position}
            onDragStop={(_e, d) => handleUpdatePosition(d)}
            onResize={(_e, _direction, _ref, delta, _position) => {
                setCurrentDelta(Math.max(delta.width, delta.height));
            }}
            onResizeStop={(_e, _direction, _ref, delta, _position) => {
                setCurrentDelta(0);
                setDelta((old) => old + Math.max(delta.width, delta.height));
            }}
            lockAspectRatio={true}
        >
            <div ref={ref} style={style}>
            {newElement}
            </div>
        </Rnd>
    )


}

