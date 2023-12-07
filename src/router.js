import { createRouter, createWebHistory } from 'vue-router'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import TaskListDrag from './components/TaskListDrag';

// Creating a router instance
const router = createRouter({
    history: createWebHistory(), // Using HTML5 history mode

    // Defining the routes for the application
    routes: [
        {
            path: '/',
            component: TaskListDrag // Route for the draggable task list component
        },
        {
            path: '/task/list',
            component: TaskList // Route for displaying the task list
        },
        {
            path: '/task/:id?',
            component: TaskForm // Route for task creation/editing form, id is optional
        },
        {
            path: '/task/:id',
            name: 'editTask',
            component: TaskForm // Named route for editing a task with a specific id
        },
    ]
})

// Exporting the router to be used in the Vue app
export default router;
