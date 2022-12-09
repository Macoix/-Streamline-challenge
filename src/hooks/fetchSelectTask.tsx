import {useEffect, useState} from 'react';
import { Select as SelectInterface } from '../interfaces/select.interfaces';


const fetchSelectTasks = (modalIsOpen: boolean) => {
    const [select, setSelect] = useState<SelectInterface[]>([]);

    useEffect(() => {
        fetch(`http://localhost:3001/tasks/select`)
            .then((response) => response.json())
            .then((json) => {
                setSelect(json);
            });
    }, [modalIsOpen]);

    return select;
    
}

export default fetchSelectTasks;