import TextField from "@mui/material/TextField";
import { IconTrash, IconGripVertical } from "@tabler/icons";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

const TextInput = ({
  text,
  name,
  onChange,
  idx,
  removeNode,
  placeholder,
  dragger,
  errIdx = true,
  showRemoveIcon,
}) => {
  return (
    <>
      <TextField
        fullWidth
        placeholder={placeholder}
        variant="outlined"
        multiline
        value={text}
        name={name}
        onChange={(e) => onChange(e, idx)}
        InputProps={{
          endAdornment: showRemoveIcon && (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                color="primary"
                onClick={() => removeNode(idx)}
              >
                <IconTrash size="18px" color="#DC143C" />
              </IconButton>
            </InputAdornment>
          ),
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                edge="start"
                color="primary"
                {...dragger}
                style={{ padding: 0, paddingLeft: "4px" }}
              >
                <IconGripVertical
                  size="16px"
                  color="gray"
                  style={{ padding: 0 }}
                />
              </IconButton>
            </InputAdornment>
          ),
          sx: { fontSize: "15px" },
        }}
        sx={{
          border: "none",
          fontWeight: 500,
          fontFamily: "Inter",
          "& .MuiOutlinedInput-root": {
            "&.MuiInputBase-root fieldset": {
              border: errIdx == idx ? "1px solid red" : "1px solid #dfe5ef",
              borderRadius: "7px",
            },
          },
        }}
      />
    </>
  );
};

export default TextInput;
