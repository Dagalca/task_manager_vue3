<template>
  <v-container>
    <h1>Task Manager - Boards</h1>

    <v-row>
      <!-- Pending Tasks Board -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title class="font-weight-bold">Pending Tasks</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                  v-for="task in pendingTasks"
                  :key="task.id"
              >
                <v-list-item-content>
                  <div class="font-italic">{{ task.attributes.field_description.value }}</div>
                  <div class="font-weight-bold">Priority: {{ task.attributes.field_priority.toUpperCase() }}</div>
                  <div>Due: {{ formatDate(task.attributes.field_due_date) }}</div>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn small color="blue" @click="editTask(task)">Edit</v-btn>
                  <v-btn small color="red" @click="() => deleteTask(task.id)">Delete</v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- In Progress Tasks Board -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title class="font-weight-bold">In Progress Tasks</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                  v-for="task in inProgressTasks"
                  :key="task.id"
              >
                <v-list-item-content>
                  <div class="font-italic">{{ task.attributes.field_description.value }}</div>
                  <div class="font-weight-bold">Priority: {{ task.attributes.field_priority.toUpperCase() }}</div>
                  <div>Due: {{ formatDate(task.attributes.field_due_date) }}</div>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn small color="blue" @click="editTask(task)">Edit</v-btn>
                  <v-btn small color="red" @click="() => deleteTask(task.id)">Delete</v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Completed Tasks Board -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title class="font-weight-bold">Completed Tasks</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                  v-for="task in completedTasks"
                  :key="task.id"
              >
                <v-list-item-content>
                  <div class="font-italic">{{ task.attributes.field_description.value }}</div>
                  <div class="font-weight-bold">Priority: {{ task.attributes.field_priority.toUpperCase() }}</div>
                  <div>Due: {{ formatDate(task.attributes.field_due_date) }}</div>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn small color="blue" @click="editTask(task)">Edit</v-btn>
                  <v-btn small color="red" @click="() => deleteTask(task.id)">Delete</v-btn>
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
  name: 'Board',
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
  props: ['tasks'],
  computed: {
    // Compute tasks by their status
    pendingTasks() {
      return this.tasks.filter(task => task.attributes.field_status === 'Pending');
    },
    inProgressTasks() {
      return this.tasks.filter(task => task.attributes.field_status === 'In Progress');
    },
    completedTasks() {
      return this.tasks.filter(task => task.attributes.field_status === 'Completed');
    },
  },
  methods: {
    editTask(task) {
      this.$emit('edit-task', task);
    },
    deleteTask(taskId) {
      if (confirm("Are you sure you want to delete this task?")) {
        this.$emit('delete-task', taskId);
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
    }
  }
};
</script>

<style scoped>
.font-italic {
  font-style: italic;
}
.font-weight-bold {
  font-weight: bold;
}
</style>

