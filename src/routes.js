const { Router } = require('express');
const DevController = require('./controllers/DevController.js');
const SearchController = require('./controllers/SearchController.js');

const routes = Router();

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);
routes.delete('/devs', DevController.destroy);
routes.put('/devs/:id', DevController.update);

routes.get('/search', SearchController.index);

module.exports = routes;