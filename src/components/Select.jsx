import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export function MuiSelect({name, value, options, handleChange, styles, ...rest}) {

  return (
    <Box sx={ styles ? styles : { minWidth: 120 }} >
      <FormControl fullWidth>
        <InputLabel id="select-label">{name}</InputLabel>
        <Select
          labelId={`${name}-label`}
          id={`${name}-id`}
          value={value}
          sx={{maxHeight: '40px'}}
          label={name}
          onChange={handleChange}
          {...rest}
        >
            {options.map((option) => {
                return <MenuItem value={option.value}>{option.label}</MenuItem>
            })}
        </Select>
      </FormControl>
    </Box>
  );
}