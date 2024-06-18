import "quill/dist/quill.snow.css";
import Quill from "quill/core";
import Toolbar from "quill/modules/toolbar";
import Snow from "quill/themes/snow";
import Bold from "quill/formats/bold";
import Italic from "quill/formats/italic";
import Header from "quill/formats/header";
import { ImageHandler, AttachmentHandler } from "quill-upload";
import { MinusOutlined } from '@ant-design/icons';

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

const BlockEmbed = Quill.import('blots/block/embed');

class DividerBlot extends BlockEmbed {
  static blotName = 'divider';
  static tagName = 'hr';
}

Quill.register(DividerBlot);

// Define a custom toolbar with the divider button including an icon
const toolbarOptions = [
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }, { 'font': [] }, { 'align': [] }],
  [{ 'color': [] }, { 'background': [] }, "bold", "italic", "underline", "strike"],
  ["link", "image", "video"],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  ['divider'],  // Add the custom divider button with icon
  [{ 'script': 'sub' }, { 'script': 'super' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }], 
  ['clean']
];

export { Quill, toolbarOptions };
