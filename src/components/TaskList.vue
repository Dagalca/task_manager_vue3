<template>
  <v-container class="container">
    <h1>Task Manager</h1>
    <!-- Button to create a new task -->
    <v-btn class="button-create" color="success" @click="createTask">Create Task</v-btn>
    <v-btn class="button-drag" color="success" @click="dragTask">Drag&Drop</v-btn>
    <!-- Boards for task statuses -->
    <v-row class="row">
      <!-- Pending Tasks Board -->
      <v-col cols="12" md="4">
        <v-card class="task-card">
          <v-card-title class="task-title">Pending Tasks ({{ pendingCount }})</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item class="task-item"
                           v-for="task in pendingTasks"
                           :key="task.id"
              >
                <v-list-item-content>
                  <!-- Grid layout for the task details -->
                  <v-row class="task-details">
                    <v-col cols="12" class="task-title">
                      <!-- Title -->
                      {{ task.attributes.title }}
                    </v-col>
                    <v-col cols="12" class="task-description">
                      <!-- Description (italic) -->
                      <i>{{ task.attributes.field_description.value }}</i>
                    </v-col>
                    <v-col cols="12" class="task-priority-due">
                      <!-- Priority (uppercase and bold) -->
                      <span class="font-weight-bold">{{ task.attributes.field_priority.toUpperCase() }}</span>
                      <!-- Due Date -->
                      <span class="due-date">{{ formatDate(task.attributes.field_due_date) }}</span>
                    </v-col>
                  </v-row>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn small class="button-spacing" color="blue" @click="editTask(task)">Edit</v-btn>
                  <v-btn small class="button-spacing"  color="red" @click="() => deleteTask(task.id)">Delete</v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- In Progress Tasks Board (similar structure) -->
      <v-col cols="12" md="4">
        <v-card class="task-card">
          <v-card-title class="task-title">In Progress Tasks ({{ inProgressCount }})</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item class="task-item"
                           v-for="task in inProgressTasks"
                           :key="task.id"
              >
                <v-list-item-content>
                  <!-- Grid layout for the task details -->
                  <v-row class="task-details">
                    <v-col cols="12" class="task-title">
                      <!-- Title -->
                      {{ task.attributes.title }}
                    </v-col>
                    <v-col cols="12" class="task-description">
                      <!-- Description (italic) -->
                      <i>{{ task.attributes.field_description.value }}</i>
                    </v-col>
                    <v-col cols="12" class="task-priority-due">
                      <!-- Priority (uppercase and bold) -->
                      <span class="font-weight-bold">{{ task.attributes.field_priority.toUpperCase() }}</span>
                      <!-- Due Date -->
                      <span class="due-date">{{ formatDate(task.attributes.field_due_date) }}</span>
                    </v-col>
                  </v-row>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn small class="button-spacing" color="blue" @click="editTask(task)">Edit</v-btn>
                  <v-btn small class="button-spacing" color="red" @click="() => deleteTask(task.id)">Delete</v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Completed Tasks Board (similar structure) -->
      <v-col cols="12" md="4">
        <v-card class="task-card">
          <v-card-title class="task-title">Completed Tasks ({{ completedCount }})</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item class="task-item"
                           v-for="task in completedTasks"
                           :key="task.id"
              >
                <v-list-item-content>
                  <!-- Grid layout for the task details -->
                  <v-row class="task-details">
                    <v-col cols="12" class="task-title">
                      <!-- Title -->
                      {{ task.attributes.title }}
                    </v-col>
                    <v-col cols="12" class="task-description">
                      <!-- Description (italic) -->
                      <i>{{ task.attributes.field_description.value }}</i>
                    </v-col>
                    <v-col cols="12" class="task-priority-due">
                      <!-- Priority (uppercase and bold) -->
                      <span class="font-weight-bold">{{ task.attributes.field_priority.toUpperCase() }}</span>
                      <!-- Due Date -->
                      <span class="due-date">{{ formatDate(task.attributes.field_due_date) }}</span>
                    </v-col>
                  </v-row>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn small class="button-spacing" color="blue" @click="editTask(task)">Edit</v-btn>
                  <v-btn small class="button-spacing" color="red" @click="() => deleteTask(task.id)">Delete</v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { VContainer, VRow, VCol, VCard, VCardTitle, VCardText, VList, VListItem, VListItemContent, VListItemAction, VBtn } from 'vuetify/lib/components';

export default {
  name: 'TaskList',
  components: {
    VContainer,
    VRow,
    VCol,
    VCard,
    VCardTitle,
    VCardText,
    VList,
    VListItem,
    VListItemContent,
    VListItemAction,
    VBtn
  },
  data() {
    return {
      tasks: { data: [] } // This will hold the list of tasks
    };
  },
  computed: {
    pendingCount() {
      return this.pendingTasks.length;
    },
    inProgressCount() {
      return this.inProgressTasks.length;
    },
    completedCount() {
      return this.completedTasks.length;
    },
    // Compute tasks by their status
    pendingTasks() {
      return this.tasks.data.filter(task => task.attributes.field_status === 'Pending');
    },
    inProgressTasks() {
      return this.tasks.data.filter(task => task.attributes.field_status === 'In Progress');
    },
    completedTasks() {
      return this.tasks.data.filter(task => task.attributes.field_status === 'Completed');
    },
  },
  mounted() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      try {
        const response = await this.$http.get('http://to-do-list.ddev.site/jsonapi/node/Task/');
        this.tasks = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    createTask() {
      this.$router.push({ path: '/task' });
    },
    editTask(task) {
      this.$router.push({ name: 'editTask', params: { id: task.id } });
    },
    dragTask() {
      this.$router.push({ path: '/tasks/drag' });
    },
    deleteTask(taskId) {
      if (confirm("Are you sure you want to delete this task?")) {
        this.$http.delete(`http://to-do-list.ddev.site/jsonapi/node/Task/${taskId}`)
            .then(() => {
              this.fetchTasks(); // Reload the task list
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
  }
};
</script>

<style scoped>
.container{
  margin-top: 30px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  width:60%;
  justify-items: center;
}

.task-card {
  margin-top: 30px;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  border: 1px solid #ccc;
}
.task-item {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 20px;
}

.task-title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  margin-top: 10px;
}

.task-description {
  font-style: italic;
  margin-bottom: 5px;
}

.task-details {
  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;
}

.task-priority-due {
  margin-bottom: 10px;

}

.due-date {
  margin-left: 10px;
  font-weight: bold;
}
.button-create {
  margin: 20px; /* Espacio entre los botones */
  text-align: center; /* Centrado del texto en el botón */
}
.button-spacing {
  margin: 10px; /* Espacio entre los botones */
  width: 40%;
  text-align: center; /* Centrado del texto en el botón */
}
</style>
