<template>
  <v-container class="container">
    <!-- Title changes based on whether it's editing or creating a new task -->
    <h1>{{ taskId ? 'Edit Task' : 'Create Task' }}</h1>
    <v-form ref="form" v-model="valid" @submit.prevent="submit">
      <!-- Input field for task title -->
      <v-text-field v-model="task.title" label="Title" :rules="requiredRules" required></v-text-field>
      <!-- Text area for task description -->
      <v-textarea v-model="task.field_description" label="Description" :rules="requiredRules"></v-textarea>

      <!-- Date picker for due date -->
      <vuepic-datepicker class="duedate" v-model="task.field_due_date" label="Due Date" format="yyyy-MM-dd"></vuepic-datepicker>

      <!-- Dropdown selector for task priority -->
      <v-select v-model="task.field_priority" :items="priorities" label="Priority" :rules="requiredRules"></v-select>
      <!-- Dropdown selector for task status -->
      <v-select v-model="task.field_status" :items="statuses" label="Status" :rules="requiredRules"></v-select>
      <!-- Submit button, text changes based on context -->
      <v-btn color="primary" type="submit">{{ taskId ? 'Update' : 'Create' }}</v-btn>
      <v-btn class="button-back" color="success" @click="backHome">back</v-btn>
    </v-form>
  </v-container>
</template>

<script>
// Importing required components from Vuetify and datepicker library
import { VContainer, VForm, VTextField, VTextarea, VSelect, VBtn } from 'vuetify/lib/components';
import VuepicDatepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
  name: 'TaskForm',
  components: {
    VContainer, VForm, VTextField, VTextarea, VuepicDatepicker, VSelect, VBtn
  },

  data() {
    return {
      // Data model for the form
      valid: false,
      task: {
        title: '',
        field_description: '',
        field_due_date: '',
        field_priority: '',
        field_status: ''
      },
      taskId: this.$route.params.id, // Task ID for edit mode
      priorities: ['High', 'Medium', 'Low'], // Priority options
      statuses: ['Pending', 'In Progress', 'Completed'], // Status options
      requiredRules: [v => !!v || 'This field is required'] // Validation rules
    };
  },
  created() {
    // Load task data if in edit mode
    if (this.taskId) {
      this.loadTask();
    }
  },
  methods: {
    // Method to fetch task data for editing
    loadTask() {
      this.$http.get(`http://to-do-list.ddev.site/jsonapi/node/Task/${this.taskId}`)
          .then(response => {
            const taskData = response.data.data.attributes;
            // Populate form fields with task data
            this.task.title = taskData.title;
            this.task.field_description = taskData.field_description.value;
            this.task.field_due_date = taskData.field_due_date;
            this.task.field_priority = taskData.field_priority;
            this.task.field_status = taskData.field_status;
          })
          .catch(error => {
            console.error(error);
          });
    },
    backHome() {
      // Navigate back to the home page
      this.$router.push({ path: '/' });
    },
    // Method to handle form submission
    submit() {
      if (this.valid) {
        // Check if creating or updating a task
        if (this.taskId) {
          this.updateTask();
        } else {
          this.createTask();
        }
      }
    },
    // Method to create a new task
    createTask() {
      const postData = {
        data: {
          type: "node--task",
          attributes: {
            // Preparing task data for creation
            title: this.task.title,
            field_description: this.task.field_description,
            field_due_date: this.formatDate(this.task.field_due_date),
            field_status: this.task.field_status,
            field_priority: this.task.field_priority
          }
        }
      };

      // Sending POST request to create a new task
      this.$http.post('http://to-do-list.ddev.site/jsonapi/node/Task/', postData)
          .then(() => {
            // Navigate to home after task creation
            this.$router.push('/');
          })
          .catch(error => {
            console.error(error);
          });
    },
    // Method to update an existing task
    updateTask() {
      const postData = {
        data: {
          id: this.taskId,
          type: "node--task",
          attributes: {
            // Preparing task data for update
            title: this.task.title,
            field_description: this.task.field_description,
            field_due_date: this.task.field_due_date,
            field_status: this.task.field_status,
            field_priority: this.task.field_priority
          }
        }
      };

      // Sending PATCH request to update the task
      this.$http.patch(`http://to-do-list.ddev.site/jsonapi/node/Task/${this.taskId}`, postData)
          .then(() => {
            // Navigate to home after task update
            this.$router.push('/');
          })
          .catch(error => {
            console.error(error);
          });
    },
    // Method to format a date into 'yyyy-MM-dd' format
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
/* Styling for the form container */
.container {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  width: 60%;
  justify-items: center;
}

/* Style for the title */
h1 {
  font-size: 30px;
  color: #333;
  margin-bottom: 20px;
}

/* Styling for datepicker */
.duedate {
  margin-bottom: 20px;
}

/* Style for the back button */
.button-back {
  margin: 10px;
}
</style>
