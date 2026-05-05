import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  }
};

export const taskService = {
  getAllTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },
  getRecommendedTasks: async (volunteerId) => {
    const response = await api.get(`/tasks/recommended/${volunteerId}`);
    return response.data;
  },
  applyForTask: async (taskId, volunteerId) => {
    const response = await api.post(`/tasks/${taskId}/apply?volunteerId=${volunteerId}`);
    return response.data;
  }
};

export const applicationService = {
  getVolunteerApplications: async (volunteerId) => {
    const response = await api.get(`/applications/volunteer/${volunteerId}`);
    return response.data;
  },
  checkIn: async (appId) => {
    const response = await api.post(`/applications/${appId}/checkin`);
    return response.data;
  },
  updateStatus: async (appId, status) => {
    const response = await api.put(`/applications/${appId}/status?status=${status}`);
    return response.data;
  }
};

export const eventService = {
  getOrganizerEvents: async (organizerId) => {
    // Note: Backend might need findByOrganizerId, but for now we'll use /events
    const response = await api.get('/events');
    return response.data;
  },
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },
  getEventTasks: async (eventId) => {
    const response = await api.get(`/events/${eventId}/tasks`);
    return response.data;
  },
  createTask: async (eventId, taskData) => {
    const response = await api.post(`/events/${eventId}/tasks`, taskData);
    return response.data;
  },
  getPendingApplications: async () => {
    // In a real app, this would be filtered by organizer. 
    // We'll add a general endpoint or use task-based fetching.
    const response = await api.get('/applications/all'); // Need to add this to backend
    return response.data;
  }
};

export const userService = {
  getUserProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  }
};

export default api;
