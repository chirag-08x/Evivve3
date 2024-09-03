import styled from '@emotion/styled';
import React, { useMemo, useState } from 'react';
import { ReactComponent as MenuInactiveBG } from 'src/assets/images/present/svgs/menu_bg_all.svg';
import { ReactComponent as MenuBGBottom } from 'src/assets/images/present/svgs/menu_bg_bottom.svg';
import { ReactComponent as MenuBGTop } from 'src/assets/images/present/svgs/menu_bg_top.svg';
import { ReactComponent as HelpMenu } from 'src/assets/images/present/svgs/menu_help.svg';
import { ReactComponent as ControlMenu } from 'src/assets/images/present/svgs/menu_control.svg';
import { ReactComponent as SettingMenu } from 'src/assets/images/present/svgs/menu_setting.svg';
import { ReactComponent as CloseMenu } from 'src/assets/images/present/svgs/menu_close.svg';

const MenuItemContainer = styled("div")`
width: 80px;
height: 72px;
flex-shrink: 0;
display: flex;
justify-content: center;
align-items: center;
cursor: pointer;
position: absolute;
right: ${props => props.right}px;
top: ${props => props.top}px;
`
const MenuIconContainer = styled("div")`
width: 37px;
height: 37px;
border-radius: 30px;
display: flex;
justify-content: center;
align-items: center;
position: absolute;
right: 26px;
top: 23px;
background-color: ${props => props.active ? "#00C0CA" : "#ffffff"};
transition: all 0.5s ease;
transform: ${props => props.active ? 
    props.name === "close" ? "rotate(-95deg)" : 
    "rotate(100deg)" : "rotate(0deg)"
}
`
const MenuItemBackground = styled(MenuInactiveBG)`
width: 72px;
position: absolute;
left: 0;
top: 0;
fill: ${props => props.active ? "#00C0CA" : "#D9D9D9"};
`
const MenuItemBgTop = styled(MenuBGTop)`
width: 72px;
position: absolute;
left: 0px;
top: ${props => props.active ? "12px" : "38px"};
fill: #00C0CA;
transition: all 0.5s ease;
`
const MenuItemBgBottom = styled(MenuBGBottom)`
width: 72px;
position: absolute;
left: 0px;
bottom: ${props => props.active ? "0px" : "38px"};
fill: #00C0CA;
transition: all 0.5s ease;
`

const MenuItem = ({
    name,
    top,
    right,
    onMenuClick = () => {}
}) => {
const [isHover, setIsHover] = useState(false);
const MenuIcon = useMemo(() => {
    switch(name){
        case "help": {
            return HelpMenu;
        }
        case "setting": {
            return SettingMenu;
        }
        case "close": {
            return CloseMenu;
        }
        case "control": {
            return ControlMenu;
        }
        default:
            return null;
    }
}, [name])

return (
    <MenuItemContainer
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        top={top}
        right={right}
        onClick={onMenuClick}
    >
        <MenuItemBgTop active={isHover} />
        <MenuItemBgBottom active={isHover} />
        <MenuItemBackground active={isHover}  />
        <MenuIconContainer active={isHover} name={name} >
            {name === "control" ?
                <MenuIcon  fill='#000000' />:
                <MenuIcon  stroke='#000000' />
            }
        </MenuIconContainer>
    </MenuItemContainer>
)
}

export default MenuItem;

