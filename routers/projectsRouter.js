const express = require('express');

const router = express.Router();

const db = require('../data/helpers/projectModel');
const actionsDb = require('../data/helpers/actionModel');

router.use('/:id', validateProjectId);

router.get('/', async (req, res) => {
  try {
    const projects = await db.get();
    if (projects.length) {
      res.status(200).json(projects);
    } else {
      res.status(404).json({ message: 'There are no projects.' });
    }
  } catch {
    res.status(500).json({ error: 'There was a problem getting the projects.' });
  }
});

router.get('/:id', async (req, res) => {
  // try {
  res.status(200).json(req.project);
  // } catch {
  //   res.status(500).json({ error: 'There was a problem getting the project.' });
  // }
});

router.get('/:id/actions', async (req, res) => {
  try {
    const actions = await db.getProjectActions(req.params.id);
    res.status(200).json(actions);
  } catch {
    res.status(500).json({ error: 'There was a problem getting the projects actions.' });
  }
});

router.post('/', validateProject, async (req, res) => {
  try {
    const project = await db.insert(req.body);
    res.status(201).json(project);
  } catch {
    res.status(500).json({ error: 'There was a problem adding the project.' });
  }
});

router.post('/:id/actions', validateAction, async (req, res) => {
  try {
    const action = await actionsDb.insert(req.body);
    res.status(201).json(action);
  } catch {
    res.status(500).json({ error: 'There was a problem adding the action.' });
  }
});

router.put('/:id', validateProject, async (req, res) => {
  try {
    const project = await db.update(req.params.id, req.body);
    res.status(201).json(project);
  } catch {
    res.status(500).json({ error: 'There was a problem updating the project.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.remove(req.params.id);
    res.status(200).json(req.project);
  } catch {
    res.status(500).json({ error: 'There was a problem deleting the project.' });
  }
});

async function validateProjectId(req, res, next) {
  try {
    const project = await db.get(req.params.id);
    if (project) {
      req.project = project;
      next();
    } else {
      res.status(404).json({ message: 'There is no project with the given id.' });
    }
  } catch {
    res.status(500).json({ error: 'There was a problem getting the project.' });
  }
}

async function validateProject(req, res, next) {
  const body = req.body;
  if (!Object.keys(body).length) {
    res.status(400).json({ message: 'Missing project data.' });
  } else if (!body.name) {
    res.status(400).json({ message: 'Missing project name.' });
  } else if (!body.description) {
    res.status(400).json({ message: 'Missing project description.' });
  } else {
    next();
  }
}

async function validateAction(req, res, next) {
  const body = req.body;
  if (!Object.keys(body).length) {
    res.status(400).json({ message: 'Missing action data.' });
  } else if (!body.project_id) {
    res.status(400).json({ message: 'Missing project id.' });
  } else if (!body.description) {
    res.status(400).json({ message: 'Missing action description.' });
  } else if (body.description.length > 128) {
    res.status(400).json({ message: 'The action description exceeds 128 characters.' });
  } else if (!body.notes) {
    res.status(400).json({ message: 'Missing action notes.' });
  } else {
    next();
  }
}

module.exports = router;
