const auth = require('./auth.routes.js');
const metrics = require('./metrics.routes.js');
const user = require('./user.routes.js');

module.exports = {
    auth,
    metrics,
    user,
};
