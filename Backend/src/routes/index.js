const userRouter = require('./userRouter')
const authenRouter = require('./authenRouter')

function route(app) {
    app.use('/api/user', userRouter);
    app.use('/api/authen', authenRouter);
}

module.exports = route;