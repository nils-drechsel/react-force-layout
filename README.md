# react-split-layout

A react layout based on the [Split Algorithm](https://en.wikipedia.org/wiki/Strip_packing_problem#The_split_algorithm_(SP)) by Golan et al. [doi](https://doi.org/10.1137%2F0210042). It's functional, though still being developed. Child components are packed from either the top left or the bottom reight whereas it is attempted to minimise the hight.


## Install

```bash
npm install react-split-layout
```

## Usage

The main layout component is `<SplitLayout>`. All its children are subject of the layout algorithm and are wrapped by divs that are draggable and resizable. The resize is done by giving the children some of the following properties:
1. `splitLayoutWidth`: Defines the extend in the horizontal direction
2. `splitLayoutHeight`: Defines the extend in the vertical direction
3. `splitLayoutFlip`: If true, and if the component is vertical (`height > width`), then `splitLayoutWidth` and `splitLayoutHeight` are flipped (i.e. then `splitLayoutWidth` defines the height and `splitLayoutHeight` the width)




```js
import React from 'react';
import { SplitLayout, Dimensions } from "react-split-layout";

export const Component: FunctionComponent = () => {

    // the dimensions of the container in which the layout will happen
    const dimensions: Dimensions = {width: 1200, height: 800};

    const width = "10%"; // this component's width will use 10% of the container size
    const height = "auto";
    const flip = true; // if the component is vertical, instead of the component's width
                       // using 10% of the container size, the component's height will

    const components = [
        <SomeComponent 
            splitLayoutWidth={width}
            splitLayoutHeight={height}
            splitLayoutFlip={flip}
        />,
        <AnotherComponent />
    ];

    return (
        <SplitLayout
            dimensions={dimensions}
        >
            {components}
        </SplitLayout>
    )
   
}
```


## License

MIT
