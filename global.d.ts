import React from "react";

declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "pixel-canvas": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                "data-gap"?: number;
                "data-speed"?: number;
                "data-colors"?: string;
                "data-variant"?: string;
                "data-no-focus"?: string | boolean;
            };
        }
    }
}
