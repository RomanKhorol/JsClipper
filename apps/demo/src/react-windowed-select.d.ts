declare module "react-windowed-select/dist/main.js" {
  import type { ComponentType } from "react";
  import type { Props } from "react-select";

  const WindowedSelect: ComponentType<Props & { windowThreshold: number }>;

  export default WindowedSelect;
}
