import { Tool } from "./Tool";
import { EraserTool } from "./EraserTool";
import { PenTool } from "./PenTool";
import { SelectTool } from "./SelectTool";
/**
 * available tools ? for free vs Plus vs Pro users :D
 * @type {Map<string, Tool>}
 */
export const availableTools = new Map(Object.entries({
    'Pen': new PenTool(),
    'Eraser': new EraserTool(),
    'Select': new SelectTool()
}))