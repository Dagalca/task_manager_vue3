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
              <vue-draggable-next v-model="pendingTasks" group="tasks" >
                <!-- Iterating over each task -->
                <v-list-item v-for="task in pendingTasks" :key="task.id" :data-id="task.id">
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
                        <span class="font-weight-bold">Priority: {{ task.attributes.field_priority.toUpperCase() }}</span>
                        <span class="due-date">Due date: {{ formatDate(task.attributes.field_due_date) }}</span>
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
              <vue-draggable-next v-model="inProgressTasks" group="tasks" >
                <!-- Iterating over each task -->
                <v-list-item v-for="task in inProgressTasks" :key="task.id" :data-id="task.id">
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
                        <span class="font-weight-bold">Priority: {{ task.attributes.field_priority.toUpperCase() }}</span>
                        <span class="due-date">Due Date: {{ formatDate(task.attributes.field_due_date) }}</span>
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
              <vue-draggable-next v-model="completedTasks" group="tasks">
                <!-- Iterating over each task -->

                  <v-list-item v-for="task in completedTasks" :key="task.id" :data-id="task.id">
                    <!-- Contenido del item -->
                  <!-- Draggable item area <v-list id="pending-tasks-list">-->
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
                        <span class="font-weight-bold">Priority: {{ task.attributes.field_priority.toUpperCase() }}</span>
                        <span class="due-date">Due Date: {{ formatDate(task.attributes.field_due_date) }}</span>
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
import { defineComponent } from 'vue';
import {
  VContainer, VRow, VCol, VCard, VCardTitle, VCardText, VList,
  VListItem, VListItemAction, VBtn
} from 'vuetify/lib/components';
import { VueDraggableNext } from "vue-draggable-next";

export default defineComponent({
  name: 'TaskListDrag',
  components: {
    VueDraggableNext, VContainer, VRow, VCol, VCard, VCardTitle, VCardText,
    VList, VListItem, VListItemAction, VBtn
  },
  data() {
    return {
      tasks: { data: [] },
      pendingTasks: [],
      inProgressTasks: [],
      completedTasks: []
    };
  },
  mounted() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      try {
        const response = await this.$http.get('http://to-do-list.ddev.site/jsonapi/node/Task/');
        this.tasks = response.data.data.map(task => ({
          id: task.id,
          attributes: task.attributes
        }));
        this.classifyTasks();
      } catch (error) {
        console.error(error);
      }
    },
    classifyTasks() {
      this.pendingTasks = this.tasks.filter(task => task.attributes.field_status === 'Pending');
      this.inProgressTasks = this.tasks.filter(task => task.attributes.field_status === 'In Progress');
      this.completedTasks = this.tasks.filter(task => task.attributes.field_status === 'Completed');
    },
    createTask() {
      this.$router.push({ path: '/task' });
    },
    editTask(task) {
      this.$router.push({ name: 'editTask', params: { id: task.id } });
    },
    deleteTask(taskId) {
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
      if (!date) return '';
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('-');
    },
    updateTaskStatuses(tasks, newStatus) {
      tasks.forEach(async task => {
        if (task.attributes.field_status !== newStatus) {
          task.attributes.field_status = newStatus;
          await this.updateTaskOnServer(task);
        }
      });
    },
    async updateTaskOnServer(task) {
      try {
        const response = await this.$http.patch(`http://to-do-list.ddev.site/jsonapi/node/Task/${task.id}`, {
          data: {
            type: 'node--task',
            id: task.id,
            attributes: {
              field_status: task.attributes.field_status
            }
          }
        });

        if (response.status === 200) {
          console.log('Tarea actualizada con éxito');
        } else {
          console.error('Error al actualizar la tarea');
        }
      } catch (error) {
        console.error('Error al actualizar la tarea en el servidor:', error);
      }
    },
    countTasks(category) {
      if (category === 'pending') {
        return this.pendingTasks.length;
      } else if (category === 'inProgress') {
        return this.inProgressTasks.length;
      } else if (category === 'completed') {
        return this.completedTasks.length;
      }
      return 0;
    },
  },
  watch: {
    pendingTasks: {
      deep: true,
      handler(newList) {
        this.updateTaskStatuses(newList, 'Pending');
      }
    },
    inProgressTasks: {
      deep: true,
      handler(newList) {
        this.updateTaskStatuses(newList, 'In Progress');
      }
    },
    completedTasks: {
      deep: true,
      handler(newList) {
        this.updateTaskStatuses(newList, 'Completed');
      }
    }
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

