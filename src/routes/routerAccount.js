import express from 'express';
import controller from '../controllers/accountController.js';

const app = express.Router();

app.get('/', controller.getAll);

app.get('/balance/:agencia/:conta', controller.getBalance);

app.post('/', controller.insert);

app.patch('/', controller.update);

app.patch('/transfer', controller.transfer);

app.delete('/:id', controller.remove);

app.delete('/balance/:agencia/:conta', controller.removeCount);

export { app as accountRouter };
