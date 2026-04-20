import tasks from './database.js';
import fs from 'fs';
import { parse } from 'csv-parse';

export const getTasks = (req, res) => {
  const { titulo, descricao } = req.query;

  let result = tasks;

  if (titulo) {
    result = result.filter(t =>
      t.titulo.toLowerCase().includes(titulo.toLowerCase())
    );
  }

  if (descricao) {
    result = result.filter(t =>
      t.descricao.toLowerCase().includes(descricao.toLowerCase())
    );
  }

  res.json(result);
};

export const createTask = (req, res) => {
  const { titulo, descricao } = req.body;

  const task = {
    id: Date.now().toString(),
    titulo,
    descricao,
    concluida: false,
    criadaEm: new Date()
  };

  tasks.push(task);
  res.status(201).json(task);
};

export const updateTask = (req, res) => {
  const { id } = req.params;
  const { titulo, descricao } = req.body;

  const task = tasks.find(t => t.id === id);

  if (!task) return res.status(404).json({ erro: 'Task não encontrada' });

  task.titulo = titulo ?? task.titulo;
  task.descricao = descricao ?? task.descricao;

  res.json(task);
};

export const deleteTask = (req, res) => {
  const { id } = req.params;

  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) return res.status(404).json({ erro: 'Task não encontrada' });

  tasks.splice(index, 1);

  res.status(204).send();
};

export const completeTask = (req, res) => {
  const { id } = req.params;

  const task = tasks.find(t => t.id === id);

  if (!task) return res.status(404).json({ erro: 'Task não encontrada' });

  task.concluida = true;

  res.json(task);
};

export const importCSV = (req, res) => {
  const results = [];

  fs.createReadStream('./uploads/tarefas.csv')
    .pipe(parse({ columns: true }))
    .on('data', (data) => {
      const task = {
        id: Date.now().toString() + Math.random(),
        titulo: data.titulo,
        descricao: data.descricao,
        concluida: false,
        criadaEm: new Date()
      };

      tasks.push(task);
      results.push(task);
    })
    .on('end', () => {
      res.json({ mensagem: 'Importação concluída', tasks: results });
    });
};