import { useLayoutEffect, useState } from 'react'
import rough from 'roughjs/bundled/rough.esm.js'

const generator = rough.generator();

// hardcode 
const LINE_THICKNESS = 5;
const STROKE_COLOR = 'black';
const FILL_COLOR = 'none';
const STROKE_WIDTH = 2;

const isInElement = (element, x, y) => {
    const { x1, y1, x2, y2, type } = element;

    // If it's a point
    if (x1 === x2 && y1 === y2) {
        return x === x1 && y === y1;
    }

    // (x, y) must be within the bounding box
    if (!(x >= Math.min(x1, x2)
        && x <= Math.max(x1, x2)
        && y >= Math.min(y1, y2)
        && y <= Math.max(y1, y2)
    )) return false;

    switch (type) {
        case 'rectangle':
            // Rectangle is already the bounding box
            return true;
        case 'line':
            // Check if distance(clickPoint, line) < thickness / 2
            return (
                Math.abs((y2 - y1) * (x - x1) + (x1 - x2) * (y - y1)) /
                Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
            ) < LINE_THICKNESS / 2;
        case 'pen':
            // Create a bounding box around the path
            return true;
        default:
            return false;
    }
}

const CanvasPage = ({
    selectedTool,
    elements,
    setElements,
    selectedElement,
    setSelectedElement
}) => {

    const [action, setAction] = useState('');

    useLayoutEffect(() => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const roughCanvas = rough.canvas(canvas);

        elements.forEach(({ element }) => element && roughCanvas.draw(element));

        // Draw bounding box
        if (selectedElement) {
            const { x1, y1, x2, y2 } = selectedElement;
            const boundingBox = generator.rectangle(
                Math.min(x1, x2) - STROKE_WIDTH,
                Math.min(y1, y2) - STROKE_WIDTH,
                Math.abs(x2 - x1) + STROKE_WIDTH * 2,
                Math.abs(y2 - y1) + STROKE_WIDTH * 2,
                {
                    stroke: STROKE_COLOR,
                    strokeWidth: STROKE_WIDTH,
                    fillStyle: 'dashed',
                    strokeLineDash: [5, 5],
                    strokeLineDashOffset: 10,
                }
            )
            roughCanvas.draw(boundingBox);
        }

    }, [elements, selectedElement]);

    const createElement = (id, type, x1 = 0, y1 = 0, x2 = 0, y2 = 0) => {
        switch (type) {
            case 'rectangle':
                return {
                    id, type, x1, y1, x2, y2,
                    element: generator.rectangle(x1, y1, x2 - x1, y2 - y1)
                };
            case 'line':
                return {
                    id, type, x1, y1, x2, y2,
                    element: generator.line(x1, y1, x2, y2)
                };
            case 'pen':
                return {
                    id, type, x1, y1, x2, y2,
                    element: generator.linearPath([[x2, y2]]),
                    points: [[x2, y2]]
                };
            default:
                return {
                    id, type, x1, y1, x2, y2,
                    element: null
                };
        }
    }

    const getElementAt = (x, y) => {
        return elements.find(
            ({ x1, y1, x2, y2, type, points }) => isInElement({ x1, y1, x2, y2, type, points }, x, y)
        );
    }

    // start from [x1, y1] - end at [x2, y2] 
    const updateElement = (id, type, x1 = 0, y1 = 0, x2 = 0, y2 = 0) => {
        if (type === 'pen') {
            const element = elements[id];

            setElements(prev => {
                const newElements = [...prev];
                newElements[id] = {
                    ...element,
                    points: [...element.points, [x2, y2]],
                    // Ensure x1 and y1 is the top-left corner, and x2 and y2 is the bottom-right corner
                    x1: Math.min(element.x1, x2),
                    y1: Math.min(element.y1, y2),
                    x2: Math.max(element.x2, x2),
                    y2: Math.max(element.y2, y2),

                    element: generator.linearPath([...element.points, [x2, y2]], {
                        stroke: STROKE_COLOR,
                        fill: FILL_COLOR,
                        strokeWidth: STROKE_WIDTH
                    })
                };
                return newElements;
            })

            return;
        }

        const element = createElement(id, type, x1, y1, x2, y2);

        setElements(prev => {
            const newElements = [...prev];
            newElements[id] = element;
            return newElements;
        })
    }

    const handleMouseDown = (e) => {
        const { clientX, clientY } = e;

        if (selectedTool === 'select') {
            const element = getElementAt(clientX, clientY);
            if (!element) return;

            const offsetX = clientX - element.x1;
            const offsetY = clientY - element.y1;

            setSelectedElement({ ...element, offsetX, offsetY });
            setAction('moving');
        } else {
            const id = elements.length;
            const element = createElement(id, selectedTool, clientX, clientY, clientX, clientY);

            setElements(prev => [...prev, element]);
            setAction('drawing');
        }
    }

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;

        if (selectedTool === 'select') {
            e.target.style.cursor = getElementAt(clientX, clientY) ? 'move' : 'default';
        } else {
            e.target.style.cursor = 'default';
        }

        if (action === 'drawing') {
            const id = elements.length - 1;
            const { x1, y1 } = elements[id];
            updateElement(id, selectedTool, x1, y1, clientX, clientY);
        } else if (action === 'moving') {
            const { id, type, x1, y1, x2, y2, offsetX, offsetY } = selectedElement;
            const dx = clientX - offsetX;
            const dy = clientY - offsetY;

            if (type === 'pen') {
                const element = elements[id];
                const deltaX = dx - element.x1;
                const deltaY = dy - element.y1;
                const newPoints = element.points.map(([px, py]) => [px + deltaX, py + deltaY]);

                setElements(prev => {
                    const newElements = [...prev];
                    newElements[id] = {
                        ...element,
                        x1: dx,
                        y1: dy,
                        x2: dx + (element.x2 - element.x1),
                        y2: dy + (element.y2 - element.y1),
                        points: newPoints,
                        element: generator.linearPath(newPoints, {
                            stroke: STROKE_COLOR,
                            fill: FILL_COLOR,
                            strokeWidth: STROKE_WIDTH
                        })
                    };
                    return newElements;
                });

                setSelectedElement({
                    ...selectedElement,
                    x1: dx,
                    y1: dy,
                    x2: dx + (x2 - x1),
                    y2: dy + (y2 - y1),
                    offsetX,
                    offsetY
                });

                return; 
            }

            updateElement(id, type, dx, dy, dx + x2 - x1, dy + y2 - y1);

            // update bounding box follow the object
            setSelectedElement({
                ...selectedElement,
                x1: dx,
                y1: dy,
                x2: dx + (x2 - x1),
                y2: dy + (y2 - y1)
            });
        }
    }

    const handleMouseUp = () => {
        setAction('');
        setSelectedElement(null);
    }

    return (
        <canvas
            id='canvas'
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <p>Your browser does not support the HTML5 canvas tag.</p>
            <p>Try using a modern browser like Chrome, Firefox, or Edge.</p>
            <p>If you are using a mobile device, try rotating it to landscape mode.</p>
            <p>If you are still having issues, please contact support.</p>
            <p>Thank you for your patience!</p>
        </canvas>
    )
}

export default CanvasPage