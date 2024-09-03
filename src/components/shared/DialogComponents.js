const { default: styled } = require("@emotion/styled")
const { DialogTitle, Button } = require("@mui/material")


export const DialogHeading = styled(DialogTitle)`
color: #2A3547;
text-align: center;
font-family: Inter;
font-size: 20px;
font-style: normal;
font-weight: 600;
line-height: 19.2px;
`

export const DialogActions = styled("div")`
display: flex;
width: 100%;
padding: 10px 24px 20px 24px;
align-items: center;
justify-content: center;
`

export const DialogContent = styled("div")`
display: flex;
width: 100%;
padding: 10px 24px 10px 24px;
align-items: center;
justify-content: center;
`

export const DialogSubHeading = styled(DialogTitle)`
color: #667085;
text-align: center;
font-family: Inter;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: 24px;
padding: 0px 24px 16px 24px;
`

export const DialogButton = styled(Button)`
display: flex;
width: 188px;
height: 42px;
padding: 11px 0px 12px 0px;
justify-content: center;
align-items: center;
flex-shrink: 0;
border-radius: 7px;
background: #341A5A;
color: #FFF;
text-align: center;
font-family: Inter;
font-size: 16px;
font-style: normal;
font-weight: 700;
line-height: 26.25px;
`

export const DialogButtonSecondary = styled(Button)`
display: flex;
width: 188px;
height: 42px;
padding: 11px 0px 12px 0px;
justify-content: center;
align-items: center;
flex-shrink: 0;
border-radius: 7px;
border: 1.5px solid #0D2359;
background: #FFF;
color: #0D2359;
text-align: center;
font-family: Inter;
font-size: 16px;
font-style: normal;
font-weight: 700;
line-height: 26.25px;
`