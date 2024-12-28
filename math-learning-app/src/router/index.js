// Composables
import {createRouter, createWebHistory} from 'vue-router';
import {jwtDecode} from "jwt-decode";

const routes = [
  {
    path: '/',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/no-access',
    component: () => import('@/components/shared/NoAccess.vue'), // Import komponentu z komunikatem o braku dostępu
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
  {
    path: '/chatgpt-test',
    component: () => import('@/components/student/ChatGptTest.vue'),
    meta: {requiresAuth: true, role: 'ROLE_STUDENT'}
  },
  {
    path: '/create-test',
    component: () => import('@/components/CreateTest.vue'),
    meta: {requiresAuth: true, role: 'ROLE_TEACHER'}
  }
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});


// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('userToken');
//
//   if (token && token.split('.').length === 3) { // Sprawdzenie formatu tokena JWT
//     try {
//       const decodedToken = jwtDecode(token);
//       console.log('decoded Token' + token);
//       const userRole = decodedToken.roles; // Zakładamy, że backend wysyła rolę w polu 'roles'
//
//       if (to.matched.some(record => record.meta.requiresAuth)) {
//         if (to.meta.role && userRole !== to.meta.role) {
//           setAccessDenied(true); // Zapisz stan "brak dostępu"
//           setAccessMessage('Nie masz uprawnień do tej zawartości.');
//           next({ path: '/no-access' }); // Przekierowanie do strony "brak dostępu"
//         } else {
//           next();
//         }
//       } else {
//         next(); // Ścieżka nie wymaga autoryzacji
//       }
//     } catch (error) {
//       console.error('Błąd dekodowania tokena:', error);
//       setAccessMessage('Błąd autoryzacji. Zaloguj się ponownie.');
//       next({ path: '/' }); // Przekierowanie do strony głównej w przypadku błędu
//     }
//   } else if (to.matched.some(record => record.meta.requiresAuth)) {
//     setAccessMessage('Nie jesteś zalogowany. Zaloguj się, aby uzyskać dostęp.');
//     next({ path: '/' }); // Przekierowanie do strony głównej, jeśli brak tokena
//   } else {
//     next(); // Ścieżka nie wymaga autoryzacji
//   }
// });

export default router;
