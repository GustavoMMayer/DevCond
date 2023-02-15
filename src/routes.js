import React from 'react';


const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Logout= React.lazy(() => import('./views/logout'));
const Wall= React.lazy(() => import('./views/wall'));
const Documents= React.lazy(() => import('./views/documents'));
const Reservations= React.lazy(() => import('./views/reservations'));
const Warnings= React.lazy(() => import('./views/warnings'));
const Foundandlost= React.lazy(() => import('./views/foundandlost'));
const Users= React.lazy(() => import('./views/users'));
const Commonareas= React.lazy(() => import('./views/commonareas'));
const Units= React.lazy(() => import('./views/units'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/logout', name: 'Logout', component: Logout },
  { path: '/wall', name: 'Wall', component: Wall },
  { path: '/documents', name: 'Documents', component: Documents },
  { path: '/reservation', name: 'Reservations', component: Reservations },
  { path: '/warnings', name: 'Warnings', component: Warnings },
  { path: '/foundandlost', name: 'Foundandlost', component: Foundandlost },
  { path: '/users', name: 'Users', component: Users },
  { path: '/commonareas', name: 'Commonareas', component: Commonareas },
  { path: '/units', name: 'Units', component: Units },
  
];

export default routes;
