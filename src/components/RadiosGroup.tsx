import React, { useState } from "react"
import { useRadioGroup, HStack} from "@chakra-ui/react"
import RadioCard from "./RadioCards"
import { Status } from "../interfaces/task.interface";

const RadioGroup = ({ idItem, handleChange, taskStatus }: {idItem: string, handleChange: (inputValue: any, id: any) => void, taskStatus: string}) => {
    return (
      <HStack>
        <RadioCard
          name="option"
          value="In progress"
          label="In progress"
          idItem={idItem}
          isChecked={taskStatus === Status.inProgress}
          handleChange={handleChange}
        />
        <RadioCard
          name="option"
          value="Done"
          label="Done"
          idItem={idItem}
          isChecked={taskStatus === Status.done}
          handleChange={handleChange}
        />
        <RadioCard
          name="option"
          value="Complete"
          label="Complete"
          idItem={idItem}
          isChecked={taskStatus === Status.complete}
          handleChange={handleChange}
        />
      </HStack>
    );
  };

export default RadioGroup;