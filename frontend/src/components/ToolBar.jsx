import React from 'react';
import {
    Lock,
    Hand,
    MousePointer,
    Square,
    Diamond,
    Circle,
    ArrowRight,
    Minus,
    Pencil,
    Type,
    Image,
    Eraser,
    Combine
} from 'lucide-react';

const iconSize = 18; 

const tools = [
    { id: 'lock', icon: <Lock size={iconSize} />, label: 'Lock' },
    { id: 'hand', icon: <Hand size={iconSize} />, label: 'Hand Tool' },
    { id: 'select', icon: <MousePointer size={iconSize} />, label: 'Select' },
    { id: 'rectangle', icon: <Square size={iconSize} />, label: 'Rectangle' },
    { id: 'diamond', icon: <Diamond size={iconSize} />, label: 'Diamond' },
    { id: 'circle', icon: <Circle size={iconSize} />, label: 'Circle' },
    { id: 'arrow', icon: <ArrowRight size={iconSize} />, label: 'Arrow' },
    { id: 'line', icon: <Minus size={iconSize} />, label: 'Line' },
    { id: 'pen', icon: <Pencil size={iconSize} />, label: 'Pen' },
    { id: 'text', icon: <Type size={iconSize} />, label: 'Text' },
    { id: 'image', icon: <Image size={iconSize} />, label: 'Image' },
    { id: 'eraser', icon: <Eraser size={iconSize} />, label: 'Eraser' },
    { id: 'group', icon: <Combine size={iconSize} />, label: 'Group' },
];

const ToolBar = ({ selectedTool, setSelectedTool }) => {

    const handleToolSelect = (toolId) => {
        setSelectedTool(toolId);
    };

    return (
        <div className="toolbar-container">
            <div className="toolbar">
                {tools.map((tool, index) => {
                    const showDivider = [1, 2, 8, 11].includes(index);

                    return (
                        <React.Fragment key={tool.id}>
                            {showDivider && <div className="divider"></div>}
                            <button
                                className={`tool-button ${selectedTool === tool.id ? 'selected' : ''}`}
                                onClick={() => handleToolSelect(tool.id)}
                                title={tool.label}
                                aria-label={tool.label}
                            >
                                {tool.icon}
                                {index + 1 <= 9 && (
                                    <span className="shortcut">{index + 1}</span>
                                )}
                                {index + 1 === 10 && (
                                    <span className="shortcut">0</span>
                                )}
                            </button>
                        </React.Fragment>
                    );
                })}
            </div>
            <p className="instruction">
                To move canvas, hold mouse wheel or spacebar while dragging, or use the hand tool
            </p>
        </div>
    );
};

export default ToolBar;