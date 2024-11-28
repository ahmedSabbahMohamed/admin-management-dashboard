const auth = require('./auth.controllers.js');
const metrics = require('./metrics.controllers.js');
const user = require('./user.controllers.js');

module.exports = {
    auth,
    metrics,
    user,
};
