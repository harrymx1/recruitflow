const profileRepository = require('../repositories/candidate.profile.repository');

class CandidateProfileController {
  async getProfile(req, res, next) {
    try {
      const candidateId = req.candidate.id;
      const profile = await profileRepository.getProfile(candidateId);
      res.json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  }

  async updateBasicProfile(req, res, next) {
    try {
      const candidateId = req.candidate.id;
      const profile = await profileRepository.updateBasicProfile(candidateId, req.body);
      res.json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  }

  async updateExperiences(req, res, next) {
    try {
      const candidateId = req.candidate.id;
      const result = await profileRepository.syncArrayEntities(candidateId, 'candidate_experiences', req.body.experiences || []);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async updateEducations(req, res, next) {
    try {
      const candidateId = req.candidate.id;
      const result = await profileRepository.syncArrayEntities(candidateId, 'candidate_educations', req.body.educations || []);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async updateCertifications(req, res, next) {
    try {
      const candidateId = req.candidate.id;
      const result = await profileRepository.syncArrayEntities(candidateId, 'candidate_certifications', req.body.certifications || []);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async updateLinks(req, res, next) {
    try {
      const candidateId = req.candidate.id;
      const result = await profileRepository.syncArrayEntities(candidateId, 'candidate_links', req.body.links || []);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async updateSkills(req, res, next) {
    try {
      const candidateId = req.candidate.id;
      const result = await profileRepository.updateSkills(candidateId, req.body.skills || []);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async addDocument(req, res, next) {
    try {
      const candidateId = req.candidate.id;
      const { label, file_url } = req.body;
      if (!label || !file_url) {
        return res.status(400).json({ success: false, message: 'Label and file_url are required' });
      }
      const result = await profileRepository.addDocument(candidateId, label, file_url);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async removeDocument(req, res, next) {
    try {
      const candidateId = req.candidate.id;
      const result = await profileRepository.removeDocument(candidateId, req.params.documentId);
      if (!result) {
        return res.status(404).json({ success: false, message: 'Document not found' });
      }
      res.json({ success: true, message: 'Document removed' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CandidateProfileController();
