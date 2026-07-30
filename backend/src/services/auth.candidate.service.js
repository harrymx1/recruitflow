const candidateRepository = require('../repositories/candidate.repository');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, generateResetToken, verifyResetToken } = require('../utils/jwt');
const crypto = require('crypto');
const { sendEmail } = require('../config/mailer');

class AuthCandidateService {
  async register(data) {
    const { email, password } = data;
    
    // Check if email exists
    const existingCandidate = await candidateRepository.getCandidateByEmail(email);
    if (existingCandidate) {
      const err = new Error('Email already registered');
      err.statusCode = 400;
      throw err;
    }
    
    const passwordHash = await hashPassword(password);
    const candidateId = await candidateRepository.createCandidate(email, passwordHash);
    
    return { candidateId };
  }

  async login(data) {
    const { email, password } = data;
    
    const candidate = await candidateRepository.getCandidateByEmail(email);
    if (!candidate) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }
    
    const isValid = await comparePassword(password, candidate.password_hash);
    if (!isValid) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }
    
    const payload = {
      id: candidate.id,
      type: 'candidate'
    };
    
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    
    // Store refresh token hash
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await candidateRepository.storeRefreshToken(candidate.id, tokenHash, expiresAt);
    
    return { accessToken, refreshToken, candidate: { id: candidate.id, email: candidate.email, role: 'candidate' } };
  }

  async refresh(refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      
      const validToken = await candidateRepository.checkRefreshToken(tokenHash);
      if (!validToken) {
        throw new Error('Invalid refresh token');
      }
      
      const candidate = await candidateRepository.getCandidateById(decoded.id);
      if (!candidate) {
        throw new Error('Candidate not found');
      }
      
      const payload = {
        id: candidate.id,
        type: 'candidate'
      };
      
      const newAccessToken = generateAccessToken(payload);
      return { accessToken: newAccessToken };
    } catch (e) {
      const err = new Error('Unauthorized');
      err.statusCode = 401;
      throw err;
    }
  }

  async logout(refreshToken) {
    if (refreshToken) {
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      await candidateRepository.revokeRefreshToken(tokenHash);
    }
  }

  async forgotPassword(email) {
    const candidate = await candidateRepository.getCandidateByEmail(email);
    if (!candidate) {
      return; 
    }

    const token = generateResetToken({ candidateId: candidate.id, email: candidate.email, type: 'candidate_reset' });
    const resetLink = `http://localhost:5173/candidate/reset-password?token=${token}`;

    await sendEmail({
      to: email,
      subject: 'Reset Password - RecruitFlow',
      body: `Halo,\n\nKlik link berikut untuk melakukan reset password Anda sebagai kandidat: \n${resetLink}\n\nLink ini akan kadaluwarsa dalam 1 jam.`
    });
  }

  async resetPassword(token, newPassword) {
    try {
      const decoded = verifyResetToken(token);
      if (decoded.type !== 'candidate_reset') {
        throw new Error('Token tidak valid');
      }

      const passwordHash = await hashPassword(newPassword);
      await candidateRepository.updateCandidatePassword(decoded.candidateId, passwordHash);
    } catch (err) {
      const error = new Error('Token reset password tidak valid atau sudah kadaluwarsa');
      error.statusCode = 400;
      throw error;
    }
  }
}

module.exports = new AuthCandidateService();
