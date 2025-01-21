const express = require('express');
const taskRoute = require('./task.route')
const authRoute = require('./auth.route');

const router = express.Router();

const defaultRoutes = [
    {
        path:"/task",
        route: taskRoute
    },
    {
        path:"/auth",
        route: authRoute
    }
];

defaultRoutes.forEach((route)=>{
    router.use(route.path, route.route)
});

module.exports = router;