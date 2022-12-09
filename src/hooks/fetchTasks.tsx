import { useEffect, useState } from "react";
import { Task } from "../interfaces/task.interface";


const fetchTasks = (page: Number = 1) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    
    useEffect(() => {
        fetch(`http://localhost:3001/tasks?_page=${page}&_limit=20`)
            .then((response) => response.json())
            .then((json) => {
                const tasks = json.tasks;
                setTasks(tasks);
            });
    }, [page])

    return tasks;
    
}

export default fetchTasks;