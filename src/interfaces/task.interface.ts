export interface Task {
    id: string;
    title: string;
    description: string;
    parentId?: string;
    status: Status;
    children: Task[];
}

export enum Status {
    inProgress = "In progress",
    done = "Done",
    complete = "Complete"
}