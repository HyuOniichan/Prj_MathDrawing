import { useState } from 'react';
import './App.css'
import CanvasPage from './pages/CanvasPage'
import ToolBar from './components/ToolBar';

function App() {
	
	const [selectedTool, setSelectedTool] = useState('select');
    const [elements, setElements] = useState([]);
	const [selectedElement, setSelectedElement] = useState(null);

	return (
		<>
			<ToolBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
			<CanvasPage 
				selectedTool={selectedTool} 
				elements={elements}
				setElements={setElements}
				selectedElement={selectedElement}
				setSelectedElement={setSelectedElement}
			/>
		</>
	)
}

export default App
