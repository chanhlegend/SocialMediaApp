const userRouter = require('./userRouter')

function route(app) {
    app.use('/api/user', userRouter);
}

module.exports = route;