import React, { useState } from 'react'
import { _chosen, OPTIONS_HEIGHT, OPTIONS_WIDTH } from './globalValues'

export default function Options() {
    const [chosenOption, setChosenOption] = useState('')

    function changeOption(option = '') {
        _chosen.option = chosenOption === option ? '' : option
        setChosenOption(_chosen.option)
    }

    /**
     * @type {JSX.Element[]}
     */
    const buttons = [
        'selection'
    ].map((name) => {
        return (
            <button
            key={name}
            style={{
                filter: chosenOption === name ? 'brightness(0.5)' : 'none'
            }}
            onClick={() => changeOption(name)}
            >
            </button>
        )
    })

    return (
        <div className='options_container' style={{width: OPTIONS_WIDTH, height: OPTIONS_HEIGHT}}>
            {...buttons}
        </div>
    )
}