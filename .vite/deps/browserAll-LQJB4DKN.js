import {
  AccessibilitySystem,
  DOMPipe,
  EventSystem,
  FederatedContainer,
  accessibilityTarget
} from "./chunk-URM6FQHL.js";
import "./chunk-B7QLRUVF.js";
import "./chunk-AUUDYK2C.js";
import "./chunk-X4BWWRG2.js";
import {
  Container,
  extensions
} from "./chunk-MYSZM7WH.js";
import "./chunk-PLDDJCW6.js";

// node_modules/pixi.js/lib/accessibility/init.mjs
extensions.add(AccessibilitySystem);
extensions.mixin(Container, accessibilityTarget);

// node_modules/pixi.js/lib/events/init.mjs
extensions.add(EventSystem);
extensions.mixin(Container, FederatedContainer);

// node_modules/pixi.js/lib/dom/init.mjs
extensions.add(DOMPipe);
//# sourceMappingURL=browserAll-LQJB4DKN.js.map
