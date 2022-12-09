import { Status, Task as TaskInterface } from '../interfaces/task.interface';
import {
  Text,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Stack,
  Checkbox,
  CheckboxGroup,
} from '@chakra-ui/react';
import { 
  CheckIcon,
  CheckCircleIcon,
  TimeIcon
 } from '@chakra-ui/icons'
import RadioGroup from './RadiosGroup';
import { useState } from 'react';
import fetchTasks from '../hooks/fetchTasks';

function Task({ task, child, setTasks}: {task: TaskInterface, child: boolean, setTasks: any }) {
  // const [selectedInput, setSelectedInput] = useState(task.status);
    const icon = () => {
      if(task?.status === Status.inProgress){
        return (
          <TimeIcon boxSize={6} color="orange.500" mr='5'/>
        )
      } else if(task?.status === Status.done) {
        return (
          <CheckCircleIcon boxSize={6} color="green.300" mr='5'/>
        )
      } else {
        return (
          <CheckIcon boxSize={6} color="green.500" mr='5'/>
        )
      }
    }
    const status = () => {
      if(task?.status === Status.inProgress){
        return (
          <Text as='b'>{Status.inProgress}</Text>
        )
      } else if(task?.status === Status.done) {
        return (
          <Text as='b'>{Status.done}</Text>
        )
      } else {
        return (
          <Text as='b'>{Status.complete}</Text>
        )
      }
    }
    const nestedTasks = (task.children || []).map((task) => {
      return (
        <Task key={task.id} task={task} child={true} setTasks={setTasks}/>
      )
    });

    const handleChange = async (inputValue: any, id: any) => {  
        const item = {
          id,
          value: inputValue,
        }  
       const response = await fetch('http://localhost:3001/task/edit', {
          method: "POST",
          body: JSON.stringify(item),
          headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        const data = await response.json();
        setTasks(data.tasks)
        // setSelectedInput(inputValue);
    };
    return (
      <Box 
        position='relative'
        key={task.id} 
        w='100%' 
        boxShadow={child ? '' : 'base'} 
        borderRadius={child ? '' : 'lg'}  
        mb='0' 
        px='4' 
        py='6' 
        bg='#fff'
      >
        <Accordion allowMultiple>
          <AccordionItem 
            border={0} 
            pl={child ? 10 : 0}
            borderRadius='lg'            
          >
            <h2>
              <AccordionButton 
                bg={child ? 'gray.200' : ''} 
                borderRadius='lg'
                _hover={child ?               
                {
                  background: 'teal.200',
                  borderRadius: 'lg',
                } : 
                {background: '#fff'}}
                mb='0'
              >
                <Box flex='1' textAlign='left'>
                {icon()}<Text fontSize='16px' as='b'>{task.title}</Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Flex justifyContent='space-between' mb={5} alignItems='center'>
                <Text as='h5' fontSize='lg'>Status: {status()}</Text>
                <RadioGroup idItem={task.id} taskStatus={task.status} handleChange={handleChange}/>
              </Flex>
              {task.description}<br />
              {nestedTasks}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    );
  }

  export default Task;