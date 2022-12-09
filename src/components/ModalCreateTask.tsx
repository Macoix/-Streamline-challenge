import React, {useEffect, useState} from 'react';
import Select, { SingleValue } from 'react-select';
import { Select as SelectInterface } from '../interfaces/select.interfaces';
import fetchSelectTasks from '../hooks/fetchSelectTask';
import { v4 as uuiv4 } from 'uuid';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    Textarea,
    Text,
    Box
  } from '@chakra-ui/react';

const ModalCreateTask = ({modalIsOpen, toggleModal}: {modalIsOpen: boolean, toggleModal: () => void}) => {

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [parent_id, setParent_id] = useState<string>('');
    const selects = fetchSelectTasks(modalIsOpen);


    const handleSubmit = () => {
        const task = {
          id: uuiv4(),
          title,
          description,
          parent_id,
          "children": []
        };

          
        fetch('http://localhost:3001/task', {
          method: "POST",
          body: JSON.stringify(task),
          headers: {"Content-type": "application/json; charset=UTF-8"}
        }).then(response => {
          setTitle(''),
          setDescription('');
          setParent_id('');
          toggleModal();
        }).catch(response => {
          console.log(response);
        })
    }
    return (
        <>
            <Modal isOpen={modalIsOpen} onClose={toggleModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Task</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box mb={5}>
                          <Text mb='8px'>Title</Text>                        
                          <Input onChange={(e) => setTitle(e.target.value)} value={title} placeholder="title example"/>
                        </Box>
                        <Box mb={5}>
                          <Text mb='8px'>Description</Text>                        
                          <Textarea onChange={(e) => setDescription(e.target.value)} placeholder="description example"/>
                        </Box>
                        <Box mb={5}>
                          <Text mb='8px'>Parent Task (optional)</Text>                        
                          <Select 
                            onChange={(event: SingleValue<SelectInterface>) => setParent_id(event?.value) }
                            isClearable={true}
                            options={selects}
                            placeholder='Select a task parent'
                          />  
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={toggleModal}>
                        Cancel
                    </Button>
                    <Button colorScheme='green' onClick={() => handleSubmit()}>Send</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalCreateTask;