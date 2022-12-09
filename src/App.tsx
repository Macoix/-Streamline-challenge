import { useEffect, useState } from 'react'
import './App.css'
import { Task as TaskInterface } from './interfaces/task.interface';
import {
  Box,
  Button,
  Center
} from '@chakra-ui/react';
import { SmallAddIcon } from '@chakra-ui/icons'
import fetchTasks from './hooks/fetchTasks';
import ModalCreateTask from './components/ModalCreateTask';
import Task from './components/task';



function App() {
  const [page, setPage] = useState<Number>(1);
  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  const [modalIsOpen, setIsOpen] = useState(false);

  const tasksa: TaskInterface[] = fetchTasks(page);

  useEffect(() => {
    if(tasksa){
      setTasks(tasksa); 
    }
  }, [tasksa])


  
  const toggleModal = () => {
    setIsOpen(!modalIsOpen);
  }
  return (
    <>
      <Center>
        <Box w='60%' p='4'>
          <div>        
            <ModalCreateTask modalIsOpen={modalIsOpen} toggleModal={toggleModal}/>
            <Button 
              leftIcon={<SmallAddIcon />} 
              onClick={() => toggleModal()}
              colorScheme='blue'
              mb='5'
            >
              
              Create task
            </Button>
          </div>
          <div className='task-list'>
            {
              tasks.map(task => <Task task={task} child={false} key={task.id} setTasks={setTasks}/>)
            }
          </div>
        </Box>
      </Center>
        
    </>
  )
}
export default App;
