const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, clientController.getClients);
router.post('/', authMiddleware, clientController.createClient);
router.get('/:id', authMiddleware, clientController.getClientById);
router.put('/:id', authMiddleware, clientController.updateClient);
router.delete('/:id', authMiddleware, clientController.deleteClient);
router.post('/:id/visits', authMiddleware, clientController.createVisit);

module.exports = router;
