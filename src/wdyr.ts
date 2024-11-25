/// <reference types="@welldone-software/why-did-you-render" />
import * as React from "react";
import whyDidYouRender from "@welldone-software/why-did-you-render";

if (import.meta.env.DEV) {
  whyDidYouRender(React, {
    include: [/.*/],
    exclude: [/^BrowserRouter/, /^Link/, /^Route/],
    trackHooks: true,
    trackAllPureComponents: true,
  });
}
