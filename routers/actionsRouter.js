const express = require('express');

const router = express.Router();

const db = require('../data/helpers/actionModel');

router.use('/:id', validateActionId);

router.get('/', async (req, res) => {
  try {
    const actions = await db.get();
    if (actions.length) {
      res.status(200).json(actions);
    } else {
      res.status(404).json({ message: 'There are no actions.' });
    }
  } catch {
    res.status(500).json({ error: 'There was a problem getting the actions.' });
  }
});

router.get('/:id', async (req, res) => {
  // try {
  res.status(200).json(req.action);
  // } catch {
  //   res.status(500).json({ error: 'There was a problem getting the action with the given id.' });
  // }
});

router.put('/:id', validateAction, async (req, res) => {
  try {
    const action = await db.update(req.params.id, req.body);
    res.status(201).json(action);
  } catch {
    res.status(500).json({ error: 'There was a problem updating the action.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.remove(req.params.id);
    res.status(200).json(req.action);
  } catch {
    res.status(500).json({ error: 'There was a problem deleting the action.' });
  }
});

async function validateActionId(req, res, next) {
  try {
    const action = await db.get(req.params.id);
    if (action) {
      req.action = action;
      next();
    } else {
      res.status(404).json({ message: 'There is no action with the given id.' });
    }
  } catch {
    res.status(500).json({ error: 'There was a problem getting the action.' });
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
