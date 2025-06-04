import { useLayoutEffect, useState } from 'react'
import rough from 'roughjs/bundled/rough.esm.js'

const generator = rough.generator();

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
            ) < 5; // placeholder for line thickness / 2
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

        elements.forEach(({ element }) => roughCanvas.draw(element));
    }, [elements]);

    const createElement = (id, type, x1, y1, x2, y2) => {
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
            default:
                return {
                    id, type, x1, y1, x2, y2,
                    element: null
                };
        }
    }

    const getElementAt = (x, y) => {
        return elements.find(({ x1, y1, x2, y2, type }) => isInElement({ x1, y1, x2, y2, type }, x, y));
    }

    const updateElement = (id, type, x1, y1, x2, y2) => {
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

            setSelectedElement({...element, offsetX, offsetY});
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
            updateElement(id, type, dx, dy, dx + x2 - x1, dy + y2 - y1);
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