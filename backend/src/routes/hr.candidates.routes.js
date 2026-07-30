const express = require('express');
const router = express.Router();
const hrCandidatesController = require('../controllers/hr.candidates.controller');
const hrNotesController = require('../controllers/hr.notes.controller');
const hrScoresController = require('../controllers/hr.scores.controller');
const authenticateCompany = require('../middlewares/authenticateCompany');

router.get('/', authenticateCompany, hrCandidatesController.getAllCandidates);
router.get('/:id', authenticateCompany, hrCandidatesController.getApplicationDetail);

// E12: Notes & Scoring
router.get('/:id/notes', authenticateCompany, hrNotesController.getNotes);
router.post('/:id/notes', authenticateCompany, hrNotesController.addNote);
router.get('/:id/scores', authenticateCompany, hrScoresController.getScores);
router.post('/:id/scores', authenticateCompany, hrScoresController.upsertScore);

// E10: Decision
router.patch('/:id/decision', authenticateCompany, hrCandidatesController.makeDecision);

module.exports = router;
