import { createElement as h } from "react";

const P = {
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  arrow: "M5 12h14M13 6l6 6-6 6",
  pin: "M12 21s-6-6-6-11a6 6 0 0112 0c0 5-6 11-6 11zM12 10h.01",
  flame: "M12 3c1 4 5 6 5 11a5 5 0 01-10 0c0-3 2-4 2-6 1 1 2 1 3-5z",
  alert: "M12 4l9 16H3zM12 10v4M12 17h.01",
  ban: "M5 5l14 14M12 3a9 9 0 100 18 9 9 0 000-18z",
  reset: "M4 12a8 8 0 108-8M4 4v5h5",
  upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
  expand: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",
  shrink: "M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5",
  fit: "M4 4h16v16H4z",
  globe: "M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  compass: "M12 3a9 9 0 100 18 9 9 0 000-18zM15 9l-2 6-4 0 2-6z",
  nav: "M12 3l7 18-7-4-7 4z",
  door: "M6 21V4h12v17M14 12h.01",
  route: "M6 19a2 2 0 100-4 2 2 0 000 4zM18 9a2 2 0 100-4 2 2 0 000 4zM8 17h6a4 4 0 000-8h-4",
  map: "M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14",
  building: "M5 21V4h9v17M14 9h5v12M8 8h3M8 12h3M8 16h3",
  tag: "M3 12V3h9l9 9-9 9z",
  barrier: "M4 8h16v5H4zM6 13v7M18 13v7",
};

export const Ic = (name, cls = "") =>
  h(
    "svg",
    {
      className: ("ic " + cls).trim(),
      width: 16,
      height: 16,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": true,
    },
    h("path", { d: P[name] || "" })
  );