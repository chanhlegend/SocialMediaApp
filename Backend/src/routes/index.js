const userRouter = require('./userRouter')
const authenRouter = require('./authenRouter')
const postRouter = require('./postRouter')

function route(app) {
    app.use('/api/user', userRouter);
    app.use('/api/authen', authenRouter);
    app.use('/api/posts', postRouter);
}

module.exports = route;