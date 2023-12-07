<template>
  <!-- Main container for the task manager -->
  <v-container class="container">
    <!-- Title for the Task Manager -->
    <h1>Task Manager Decoupled Drupal/Vue3</h1>

    <!-- Button to create a new task -->
    <v-btn class="button-create" color="success" @click="createTask">Create Task</v-btn>

    <!-- Row for organizing the task columns -->
    <v-row class="row">

      <!-- Column for Pending Tasks -->
      <v-col cols="12" md="4">
        <!-- Card for Pending Tasks -->
        <v-card class="task-card">
          <!-- Card title with dynamic task count -->
          <v-card-title class="task-title" style="color:red">Pending Tasks ({{ countTasks('pending') }})</v-card-title>

          <!-- Card text/content -->
          <v-card-text>
            <!-- List for pending tasks -->
            <v-list id="pending-tasks-list">
              <!-- Draggable list for tasks -->
              <vue-draggable-next v-model="pendingTasks" group="tasks" @end="onDrop">
                <!-- Iterating over each task -->
                <v-list-item class="task-item" v-for="task in pendingTasks" :key="task.id">
                  <!-- Draggable item area -->
                  <div class="drag-item">
                    <!-- Task details -->
                    <v-row class="task-details">
                      <!-- Task title -->
                      <v-col cols="12" class="task-title">{{ task.attributes.title }}</v-col>
                      <!-- Red line below task title -->
                      <div class="red-line"></div>
                      <!-- Task description -->
                      <v-col cols="12" class="task-description"><i>{{ task.attributes.field_description.value }}</i></v-col>
                      <!-- Task priority and due date -->
                      <v-col cols="12" class="task-priority-due">
                        <span class="font-weight-bold">{{ task.attributes.field_priority.toUpperCase() }}</span>
                        <span class="due-date">{{ formatDate(task.attributes.field_due_date) }}</span>
                      </v-col>
                    </v-row>
                  </div>
                  <!-- Task action buttons -->
                  <v-list-item-action>
                    <v-btn small class="button-spacing" color="blue" @click="editTask(task)">Edit</v-btn>
                    <v-btn small class="button-spacing" color="red" @click="() => deleteTask(task.id)">Delete</v-btn>
                  </v-list-item-action>
                </v-list-item>
              </vue-draggable-next>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Column for In Progress Tasks -->
      <v-col cols="12" md="4">
        <!-- Card for In Progress Tasks -->
        <v-card class="task-card">
          <!-- Card title with dynamic task count -->
          <v-card-title class="task-title" style="color:blue">In Progress Tasks ({{ countTasks('inProgress') }})</v-card-title>

          <!-- Card text/content -->
          <v-card-text>
            <!-- List for in-progress tasks -->
            <v-list id="in-progress-tasks-list">
              <!-- Draggable list for tasks -->
              <vue-draggable-next v-model="inProgressTasks" group="tasks" @end="onDrop">
                <!-- Iterating over each task -->
                <v-list-item class="task-item" v-for="task in inProgressTasks" :key="task.id">
                  <!-- Draggable item area -->
                  <div class="drag-item">
                    <!-- Task details -->
                    <v-row class="task-details">
                      <!-- Task title -->
                      <v-col cols="12" class="task-title">{{ task.attributes.title }}</v-col>
                      <!-- Blue line below task title -->
                      <div class="blue-line"></div>
                      <!-- Task description -->
                      <v-col cols="12" class="task-description"><i>{{ task.attributes.field_description.value }}</i></v-col>
                      <!-- Task priority and due date -->
                      <v-col cols="12" class="task-priority-due">
                        <span class="font-weight-bold">{{ task.attributes.field_priority.toUpperCase() }}</span>
                        <span class="due-date">{{ formatDate(task.attributes.field_due_date) }}</span>
                      </v-col>
                    </v-row>
                  </div>
                  <!-- Task action buttons -->
                  <v-list-item-action>
                    <v-btn small class="button-spacing" color="blue" @click="editTask(task)">Edit</v-btn>
                    <v-btn small class="button-spacing" color="red" @click="() => deleteTask(task.id)">Delete</v-btn>
                  </v-list-item-action>
                </v-list-item>
              </vue-draggable-next>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Column for Completed Tasks -->
      <v-col cols="12" md="4">
        <!-- Card for Completed Tasks -->
        <v-card class="task-card">
          <!-- Card title with dynamic task count -->
          <v-card-title class="task-title" style="color:green">Completed Tasks ({{ countTasks('completed') }})</v-card-title>

          <!-- Card text/content -->
          <v-card-text>
            <!-- List for completed tasks -->
            <v-list id="completed-tasks-list">
              <!-- Draggable list for tasks -->
              <vue-draggable-next v-model="completedTasks" group="tasks" @end="onDrop">
                <!-- Iterating over each task -->
                <v-list-item class="task-item" v-for="task in completedTasks" :key="task.id">
                  <!-- Draggable item area -->
                  <div class="drag-item">
                    <!-- Task details -->
                    <v-row class="task-details">
                      <!-- Task title -->
                      <v-col cols="12" class="task-title">{{ task.attributes.title }}</v-col>
                      <!-- Green line below task title -->
                      <div class="green-line"></div>
                      <!-- Task description -->
                      <v-col cols="12" class="task-description"><i>{{ task.attributes.field_description.value }}</i></v-col>
                      <!-- Task priority and due date -->
                      <v-col cols="12" class="task-priority-due">
                        <span class="font-weight-bold">{{ task.attributes.field_priority.toUpperCase() }}</span>
                        <span class="due-date">{{ formatDate(task.attributes.field_due_date) }}</span>
                      </v-col>
                    </v-row>
                  </div>
                  <!-- Task action buttons -->
                  <v-list-item-action>
                    <v-btn small class="button-spacing" color="blue" @click="editTask(task)">Edit</v-btn>
                    <v-btn small class="button-spacing" color="red" @click="() => deleteTask(task.id)">Delete</v-btn>
                  </v-list-item-action>
                </v-list-item>
              </vue-draggable-next>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
// Importing necessary components from Vue and Vuetify
import { defineComponent } from 'vue';
import {
  VContainer, VRow, VCol, VCard, VCardTitle, VCardText, VList,
  VListItem, VListItemAction, VBtn
} from 'vuetify/lib/components';
import { VueDraggableNext } from "vue-draggable-next";

export default defineComponent({
  name: 'TaskListDrag', // Component name
  components: {
    // Registering components used in this Vue component
    VueDraggableNext,
    VContainer,
    VRow,
    VCol,
    VCard,
    VCardTitle,
    VCardText,
    VList,
    VListItem,
    VListItemAction,
    VBtn
  },

  data() {
    return {
      // Initializing data properties
      tasks: { data: [] }, // Stores all tasks
      pendingTasks: [],    // Stores tasks with 'Pending' status
      inProgressTasks: [], // Stores tasks with 'In Progress' status
      completedTasks: []   // Stores tasks with 'Completed' status
    };
  },

  mounted() {
    // Fetch tasks when component is mounted
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      // Async method to fetch tasks from the server
      try {
        const response = await this.$http.get('http://to-do-list.ddev.site/jsonapi/node/Task/');
        this.tasks = response.data.data.map(task => ({
          id: task.id,
          attributes: task.attributes
        }));

        // Filter tasks based on their status
        this.pendingTasks = this.tasks.filter(task => task.attributes.field_status === 'Pending');
        this.inProgressTasks = this.tasks.filter(task => task.attributes.field_status === 'In Progress');
        this.completedTasks = this.tasks.filter(task => task.attributes.field_status === 'Completed');

        // Logging loaded tasks for debugging
        console.log('Tasks Loaded debugging:', this.tasks);
      } catch (error) {
        console.error(error);
      }
    },
    createTask() {
      // Navigate to the task creation page
      this.$router.push({ path: '/task' });
    },

    editTask(task) {
      // Navigate to the task editing page with the task's id
      this.$router.push({ name: 'editTask', params: { id: task.id } });
    },
    deleteTask(taskId) {
      // Method to delete a task
      if (confirm("Are you sure you want to delete this task?")) {
        this.$http.delete(`http://to-do-list.ddev.site/jsonapi/node/Task/${taskId}`)
            .then(() => {
              this.fetchTasks(); // Refetch tasks after deletion
            })
            .catch(error => {
              console.error(error);
            });
      }
    },
    formatDate(date) {
      // Method to format date strings
      if (!date) return '';
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('-');
    },
    onDrop(event) {
      // Method to handle drag-and-drop task updating
      let movedTaskId = event.item.id;
      let newStatus;

      // Determine new status based on drop location
      switch(event.to.id) {
        case 'pending-tasks-list':
          newStatus = 'Pending';
          break;
        case 'in-progress-tasks-list':
          newStatus = 'In Progress';
          break;
        case 'completed-tasks-list':
          newStatus = 'Completed';
          break;
        default:
          return; // Do nothing if the drop target is unrecognized
      }

      // Find and update the task in tasks.data
      const taskIndex = this.tasks.data.findIndex(task => task.id === movedTaskId);
      if (taskIndex !== -1) {
        this.tasks.data[taskIndex].attributes.field_status = newStatus;
      }
    },
    countTasks(category) {
      // Method to count tasks based on their category
      if (category === 'pending') {
        return this.pendingTasks.length;
      } else if (category === 'inProgress') {
        return this.inProgressTasks.length;
      } else if (category === 'completed') {
        return this.completedTasks.length;
      }
      return 0;
    },
  }
});
</script>

<style scoped>
/* Styles for the main container */
.container {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 60%;
  justify-items: center;
}

/* Style for draggable items to indicate they are movable */
.drag-item {
  cursor: pointer;
}

/* Styling for each task card */
.task-card {
  margin-top: 30px;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2); /* Adds subtle shadow for depth */
  border: 1px solid #ccc; /* Border color */
}

/* Styling for individual task list items */
.task-item {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 20px;
}

/* Style for the task title */
.task-title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  margin-top: 10px;
}

/* Style for task description */
.task-description {
  font-style: italic;
  margin-bottom: 5px;
}

/* Flexbox styling for task details */
.task-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Margin styling for the priority and due date section */
.task-priority-due {
  margin-bottom: 10px;
}

/* Styling for the due date */
.due-date {
  margin-left: 10px;
  font-weight: bold;
}

/* Common button styling for consistent spacing */
.button-spacing {
  margin: 10px;
  width: 40%;
  text-align: center;
}

/* Additional styling for the 'Create Task' button */
.button-create {
  margin: 20px;
  text-align: center;
}

/* Styling for the red line below task title */
.red-line {
  height: 3mm;
  background-color: red;
  width: 100%;
  margin-top: 2px;
}

/* Styling for the blue line below task title */
.blue-line {
  height: 3mm;
  background-color: blue;
  width: 100%;
  margin-top: 2px;
}

/* Styling for the green line below task title */
.green-line {
  height: 3mm;
  background-color: green;
  width: 100%;
  margin-top: 2px;
}
</style>

