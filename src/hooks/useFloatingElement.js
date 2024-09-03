import React, { useEffect, useRef, useState } from 'react'

let currentZIndex = 9999; 
let position = [0,0,0,0]

const useFloatingElement = (stayInScreen, initialPos) => {
    const [isFloating, setIsFloating] = useState(false)
    const [pos, setPos] = useState(initialPos)
    const elementRef = useRef(null);
    const closeDragElement = (evt) => {
        /* stop moving when mouse button is released:*/
        evt.preventDefault();
        document.removeEventListener("mouseup", closeDragElement);
        document.removeEventListener("mousemove", elementDrag);
        setTimeout(() => {
            setIsFloating(false);
        }, 1)
    }

    const elementDrag = (e) => {
        if (!elementRef?.current) {
            return;
        }
    
        e = e || window.event;
        e.preventDefault();
        const elmnt = elementRef?.current;
        // calculate the new cursor position:
        position[0] = position[2] - e.clientX;
        position[1] = position[3] - e.clientY;
        position[2] = e.clientX;
        position[3] = e.clientY;
        if(!isFloating){
            setIsFloating(true);
        }
        // set the element's new position:
        if(stayInScreen){
            setPos({
                top: Math.min(
                    window.innerHeight - elmnt.clientHeight,
                    Math.max(0, (elmnt.offsetTop - position[1]))
                    )+ "px",
                left: Math.min(
                    window.innerWidth - elmnt.clientWidth,
                    Math.max(0, (elmnt.offsetLeft - position[0]))
                    )+ "px"
            })
        } else {
            setPos({
                top: (elmnt.offsetTop - position[1]) + "px",
                left: (elmnt.offsetLeft - position[0]) + "px",
            })
        }
    }

    const dragMouseDown = (e) => {
        e.preventDefault();
        const elmnt = elementRef?.current;
        elmnt.style.zIndex = "" + ++currentZIndex;
        elmnt.style.position = "absolute";
        e = e || window.event;
        // get the mouse cursor position at startup:
        position[2] = e.clientX;
        position[3] = e.clientY;
        document.addEventListener("mouseup", closeDragElement);
        // call a function whenever the cursor moves:
        document.addEventListener("mousemove", elementDrag);
    }

    return {elementRef, handleFloatMouseDown: dragMouseDown, isFloating, pos};
}

export default useFloatingElement;
