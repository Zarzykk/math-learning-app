// Composables
import {createRouter, createWebHistory} from 'vue-router';
import {jwtDecode} from "jwt-decode";

const routes = [
  {
    path: '/',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/teacher-dashboard',
    component: () => import('@/views/teacherViews/TeacherDashboard.vue'), // Powinno być TeacherDashboard.vue
    meta: {requiresAuth: true, role: 'ROLE_TEACHER'}
  },
  {
    path: '/manage-tests',
    component: () => import('@/views/teacherViews/TeacherTests.vue'),
    meta: {requiresAuth: true, role: 'ROLE_TEACHER'}
  },
  {
    path: '/student-dashboard',
    component: () => import('@/views/StudentDashboard.vue'),
    meta: {requiresAuth: true, role: 'ROLE_STUDENT'}
  },
  {
    path: '/track-progress',
    component: () => import('@/views/teacherViews/TeacherClasses.vue'),
    meta: {requiresAuth: true, role: 'ROLE_TEACHER'}
  },
  {
    path: '/assign-homework',
    component: () => import('@/views/teacherViews/TeacherHomework.vue'),
    meta: {requiresAuth: true, role: 'ROLE_TEACHER'}
  },
  {
    path: '/test-management',
    component: () => import('@/views/teacherViews/TeacherTestManagment.vue'),
    meta: {requiresAuth: true, role: 'ROLE_TEACHER'}
  },
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('userToken');

  if (token && token.split('.').length === 3) { // Dodano sprawdzenie formatu tokena
    try {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.roles; // upewnij się, że backend wysyła rolę w polu 'roles'
      if (to.matched.some(record => record.meta.requiresAuth)) {
        if (to.meta.role && !userRole === (to.meta.role)) {
          next({path: '/'}); // przekieruj na stronę logowania
        } else {
          next();
        }
      } else {
        next(); // ścieżka nie wymaga autoryzacji
      }
    } catch (error) {
      console.error('Błąd dekodowania tokena:', error);
      next({path: '/'}); // Przekieruj na stronę logowania w przypadku błędu
    }
  } else if (to.matched.some(record => record.meta.requiresAuth)) {
    next({path: '/'}); // przekieruj na stronę logowania, jeśli brak tokena
  } else {
    next(); // ścieżka nie wymaga autoryzacji
  }
});

export default router;
