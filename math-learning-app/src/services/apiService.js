import axios from 'axios';

const API_URL = 'http://localhost:8080';

export default {
  async login(loginForm) {
    try {
      const response = await axios.post(`${API_URL}/authenticate`, loginForm);
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },
  async startConversation(prompt) {
    const token = localStorage.getItem('userToken');

    try {
      const response = await axios.post(`${API_URL}/api/chatgpt/generate`, prompt, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error during API call:', error);
      throw error;
    }
  },
  async continueConversation(prompt, uuid) {
    const token = localStorage.getItem('userToken');
    uuid = null;
    try {
      const response = await axios.post(`${API_URL}/api/chatgpt/generate/${uuid}`, prompt, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error during API call:', error);
      throw error;
    }
  },
  async fetchMaterialsBySchoolType(schoolType) {
    const token = localStorage.getItem('userToken');

    try {
      const response = await axios.get(`${API_URL}/api/material/${schoolType}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error during API call:', error);
      throw error;
    }
  },
  async fetchMaterials() {
    const token = localStorage.getItem('userToken');

    try {
      const response = await axios.get(`${API_URL}/api/material/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error during API call:', error);
      throw error;
    }
  },
  async fetchClasses(teacherId) {
    const token = localStorage.getItem('userToken');

    try {
      const response = await axios.get(`${API_URL}/api/class/get/${teacherId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error during API call:', error);
      throw error;
    }
  },
  async fetchAssignments(teacherId, assignmentType) {
    const token = localStorage.getItem('userToken');
    try {
      const response = await axios.get(`${API_URL}/api/assignment/${assignmentType}/${teacherId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error during API call:', error);
      throw error;
    }
  },
  async fetchStudents(teacherId) {
    const token = localStorage.getItem('userToken');
    console.log(teacherId)
    try {
      const response = await axios.get(`${API_URL}/api/students/get/all/${teacherId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error during API call:', error);
      throw error;
    }
  }
}
