import {useState} from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {IconButton, Tooltip} from '@mui/material';
import { ContentCopy, Delete, MoreVert } from '@mui/icons-material';
import EditIcon from "@mui/icons-material/Edit";

const MenuIcon = ({isOwner, onCopy, onDelete}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (func) => {
      return () => {
          func();
          setAnchorEl(null);
      }
  };

  return (
      <div>
          {/*<IconButton onClick={handleClick}><MoreVert/></IconButton>*/}
          {/*{false &&*/}
          {/*    <Button*/}
          {/*      id="basic-button"*/}
          {/*      aria-controls={open ? 'basic-menu' : undefined}*/}
          {/*      aria-haspopup="true"*/}
          {/*      aria-expanded={open ? 'true' : undefined}*/}
          {/*      onClick={handleClick}*/}
          {/*    >*/}
          {/*      ...*/}
          {/*    </Button>*/}
          {/*}*/}
          {/*<Menu*/}
          {/*  id="basic-menu"*/}
          {/*  anchorEl={anchorEl}*/}
          {/*  open={open}*/}
          {/*  onClose={handleClose(() => {})}*/}
          {/*  MenuListProps={{*/}
          {/*    'aria-labelledby': 'basic-button',*/}
          {/*  }}*/}
          {/*>*/}

          {/*</Menu>*/}

          <div style={{display: 'flex'}}>
              <Tooltip placement="bottom" title="Copy Session">
                  <MenuItem onClick={handleClose(onCopy)}
                            style={{fontSize: "12px", padding: 0, paddingRight: "10px"}}>
                      <ContentCopy fontSize='small' style={{color: 'gray'}}/>
                  </MenuItem>
              </Tooltip>

              <Tooltip placement="bottom" title="Delete Session">
                  {!isOwner && <MenuItem onClick={handleClose(onDelete)}
                                           style={{fontSize: "12px", padding: 0, paddingRight: "10px"}}><Delete
                      fontSize='small' style={{color: 'gray'}}/></MenuItem>}
              </Tooltip>
          </div>

          {/*<IconButton onClick={handleClose(onCopy)} style={{fontSize: "12px", paddingTop: "10px", paddingBottom: "10px"}}><ContentCopy fontSize='small' style={{marginRight: '6px', color: 'gray'}}/></IconButton>*/}
          {/*{ !isOwner && <IconButton onClick={handleClose(onDelete)} style={{fontSize: "12px", paddingTop: "10px", paddingBottom: "10px"}}><Delete fontSize='small' style={{marginRight: '6px', color: 'gray'}}/></IconButton> }*/}
      </div>
  );
}

export default MenuIcon;
