import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';

// keyframes

const typing = keyframes({
    from: {
        width: 0
    },
    to: {
        width: "100%"
    }
})

const blink = keyframes({
    "50%": {
        borderColor: "inherit"
    }
})

// components

const TypingConatiner = styled("div")`
    display: grid;
    place-items: center;
    background: transparent;
`
const TypingText = styled("span")`
    font-size: inherit;
    color: inherit;
    letter-spacing: 0.1em;
    ${props => props.textStyle}
    white-space: nowrap;
    overflow: hidden;
    border-right: 0.1em solid transparent;
    white-space: nowrap;
    overflow: hidden;
    animation: ${typing} ${props => props.step*0.1}s steps(${props => props.step}), ${blink} .1s step-end ${props => props.step+1} alternate;
`

const TypingEffectText = ({
    text,
    textStyle,
    onAnimationEnd = () => {}
}) => {


    return (
        <TypingConatiner>
            <TypingText 
                onAnimationEnd={onAnimationEnd} 
                textStyle={textStyle} 
                step={text.length} 
            >
                {text}
            </TypingText>
        </TypingConatiner>
    )
}

export default TypingEffectText;
