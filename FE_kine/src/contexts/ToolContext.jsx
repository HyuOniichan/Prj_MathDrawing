import React, { createContext, ReactNode, useContext, useState } from "react";

export class ToolContextValue {
    /**
     * current active tool
     * @type {String}
     */
    activeToolName = ''
    /**
     * active another tool
     * @param {String} name 
     */
    setActiveTool = (name) => {}
}

/**@type {React.Context<ToolContextValue | null>} */
const ToolContext = createContext(null)

/**
 * Tool Provider, default tool is pen
 * @param {{children: ReactNode}}
 * @returns {JSX.Element}
 */
export function ToolProvider({children}) {
    const [ToolName, setToolName] = useState('Pen') //defaut tool: pen

    return (
        <ToolContext.Provider value={{
            activeToolName: ToolName,
            setActiveTool: (name = '') => {
                setToolName(name)
            }
        }}>
        {children}
        </ToolContext.Provider>
    )
}

/**
 * get the active tool
 * @returns {{activeToolName: String, setActiveTool: (toolName: String) => React.Dispatch<React.SetStateAction<string>>}}
 */
export function useTool() {
    const ctx = useContext(ToolContext)
    if(!ctx) {
        console.error('No Tool Found!')
    }
    return ctx
}