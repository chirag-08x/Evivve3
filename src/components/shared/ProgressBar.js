import styled from '@emotion/styled';
import React from 'react';

// components

const Container = styled("div")`
    width: ${props => props.width || "100%"};
    background: transparent;
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
`

const ProgressContainer = styled("div")`
    width: ${props => props.width ? ("calc("+props.width+" - 35px)") : "calc(100% - 35px)"};
    height: 8px;
    border-radius: 4px;
    background: #F2F4F7;
    transition: width 0.5s ease;
    position: relative;
    display: flex;
`

const ProgressValueComponent = styled("div")`
    border-radius: 4px;
    background: #7F56D9;
    height: 8px;
    width: ${props => props.width || 0}%;
    transition: width 0.5s ease;
`

const ProgressText = styled("div")`
    color: #FFF;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px; /* 142.857% */
`

const ProgressBar = ({
    value = 0, // 0-100 as percentage
    width = "400px",
    hideValue = false,
}) => {


    return (
        <Container>
            <ProgressContainer width={width} >
                <ProgressValueComponent 
                    width={value}
                />
            </ProgressContainer>
            {!hideValue &&
            <ProgressText>
                {parseInt(value)+"%"}
            </ProgressText>}
        </Container>
    )
}

export default ProgressBar;
