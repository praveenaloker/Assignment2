let express = require('express');
let router = express.Router();
 
const customers = require('../controllers/controller.js');

router.post('/api/customers/create', customers.create);
router.get('/api/customers/pagination', customers.pagination);//api/customers/pagination?page=0&limit=3



module.exports = router;