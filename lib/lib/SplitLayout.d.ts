import React, { FunctionComponent } from 'react';
import { Dimensions, LayoutManager } from './LayoutManager';
declare type Props = {
    dimensions: Dimensions;
    bottomRight?: boolean;
    logging?: boolean;
};
export declare const SplitLayoutContext: React.Context<LayoutManager>;
export declare const SplitLayout: FunctionComponent<Props>;
export {};
