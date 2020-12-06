import { FunctionComponent } from 'react';
import { Dimensions } from "./types";
declare type Props = {
    dimensions: Dimensions;
    bottomRight?: boolean;
    logging?: boolean;
};
export declare const SplitLayout: FunctionComponent<Props>;
export {};
