import React, { ChangeEvent } from 'react';
import { useRadio, Box } from '@chakra-ui/react';

const RadioCard = ({ name, label, value, isChecked, handleChange, idItem }: {name: string, label: string, value: string, isChecked: boolean, handleChange: any, idItem: string}) => {
    const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget;
      const id = event.target.getAttribute('data-id');
      handleChange(value, id);
    };
    
    return (
      <div>
        {/* Target this input: opacity 0 */}
        <input
          type="checkbox"
          className="custom-radio"
          name={name}
          id={value} // htlmlFor targets this id.
          checked={isChecked}
          data-id={idItem}
          onChange={handleRadioChange}
          value={value}
        />
        <label htmlFor={value}>
          <span>{label}</span>
        </label>
      </div>
    );
  };

  export default RadioCard;