import "quill/dist/quill.snow.css";
import Quill from "quill/core";
import Toolbar from "quill/modules/toolbar";
import Snow from "quill/themes/snow";
import Bold from "quill/formats/bold";
import Italic from "quill/formats/italic";
import Header from "quill/formats/header";
import { ImageHandler, AttachmentHandler } from "quill-upload";

// Check if a module already exists to avoid overwrite warnings
const registerIfNotExist = (name, module) => {
  if (!Quill.imports[name]) {
    Quill.register(name, module);
  }
};

registerIfNotExist("modules/toolbar", Toolbar);
registerIfNotExist("themes/snow", Snow);
registerIfNotExist("formats/bold", Bold);
registerIfNotExist("formats/italic", Italic);
registerIfNotExist("formats/header", Header);

//Register custom modules from quill-upload
Quill.register("modules/imageHandler", ImageHandler); 
Quill.register("modules/attachmentHandler", AttachmentHandler);

export default Quill;
