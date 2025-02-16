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
  async continueConversation(prompt, uuid, taskType) {
    const token = localStorage.getItem('userToken');
    let url;
    if (uuid !== null) {
      url = `${API_URL}/api/chatgpt/generate?uuid=${uuid}&taskType=${taskType}`
    } else {
      url = `${API_URL}/api/chatgpt/generate?taskType=${taskType}`
    }
    try {
      const response = await axios.post(url, prompt, {
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
  async createLearningMaterial(materialType) {
    const token = localStorage.getItem('userToken');
    const userId = JSON.parse(localStorage.getItem('userInfo')).id
    try {
      const response = await axios.post(`${API_URL}/api/chatgpt/learning?materialType=${materialType}&studentId=${userId}`, {
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
  async fetchStudentAssignments(type) {
    const token = localStorage.getItem('userToken');
    const userId = JSON.parse(localStorage.getItem('userInfo')).id;
    try {
      const response = await axios.get(`${API_URL}/api/assignment/student/${userId}/${type}`, {
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
  async getAssignmentData(id) {
    const token = localStorage.getItem('userToken');
    try {
      const response = await axios.get(`${API_URL}/api/assignment/${id}`, {
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
  },
  async postAssignment(tests) {
    const token = localStorage.getItem('userToken');
    try {
      const response = await axios.post(`${API_URL}/api/assignment/save`,
        tests,
        {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error during API call:', error);
      throw error;
    }
  },
  async getAssigmentTasks(itemId) {
    const token = localStorage.getItem('userToken');
    try {
      const response = await axios.get(`${API_URL}/api/assignment/${itemId}/tasks`, {
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
  async postStudent(studentData) {
    const token = localStorage.getItem('userToken');
    try {
      console.log(studentData)
      const response = await axios.post(`${API_URL}/api/students/create`,
        studentData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      return response.data;
    } catch (error) {
      console.error('Error during API call:', error);
      throw error;
    }
  },
  async submitAssignment(assignment) {
    const token = localStorage.getItem('userToken');
    try {
      console.log(assignment)
      const response = await axios.post(`${API_URL}/api/assignment/result/save`,
        assignment,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      return response.data;
    } catch (error) {
      console.error('Error during API call:', error);
      throw error;
    }
  },
  async getGradings(assignmentId) {
    const token = localStorage.getItem('userToken');
    try {
      const response = await axios.get(`${API_URL}/api/assignment/result/grading?assignmentId=${assignmentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      return response.data;
    } catch (error) {
      console.error('Error during API call:', error);
      throw error;
    }
  }
}
