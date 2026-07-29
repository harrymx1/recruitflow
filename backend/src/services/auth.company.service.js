const companyRepository = require('../repositories/company.repository');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateAccessToken, generateRefreshToken, generateResetToken, verifyRefreshToken, verifyResetToken } = require('../utils/jwt');
const { sendEmail } = require('../config/mailer');
const crypto = require('crypto');

// Utility to create slug from company name
const createSlug = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

class AuthCompanyService {
  async register(data) {
    const { companyName, adminName, email, password } = data;
    
    // Check if email exists
    const existingMember = await companyRepository.getMemberByEmail(email);
    if (existingMember) {
      const err = new Error('Email already registered');
      err.statusCode = 400;
      throw err;
    }
    
    // Create unique slug
    let slug = createSlug(companyName);
    let counter = 1;
    while (await companyRepository.getCompanyBySlug(slug)) {
      slug = `${createSlug(companyName)}-${counter}`;
      counter++;
    }
    
    const passwordHash = await hashPassword(password);
    
    const companyId = await companyRepository.createCompany({
      name: companyName,
      slug,
      adminName,
      email,
      passwordHash
    });
    
    return { companyId, slug };
  }

  async login(data) {
    const { email, password } = data;
    
    const member = await companyRepository.getMemberByEmail(email);
    if (!member) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }
    
    if (!member.is_active) {
      const err = new Error('Account is deactivated');
      err.statusCode = 403;
      throw err;
    }
    
    const isValid = await comparePassword(password, member.password_hash);
    if (!isValid) {
      const err = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }
    
    const payload = {
      id: member.id,
      companyId: member.company_id,
      role: member.role,
      type: 'company_member'
    };
    
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    
    // Store refresh token hash
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await companyRepository.storeRefreshToken(member.id, tokenHash, expiresAt, 'company_member');
    
    const company = await companyRepository.getCompanyById(member.company_id);
    return { accessToken, refreshToken, member: { id: member.id, role: member.role, companyId: member.company_id, name: member.name, companyName: company.name } };
  }

  async refresh(refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      
      const validToken = await companyRepository.checkRefreshToken(tokenHash);
      if (!validToken) {
        throw new Error('Invalid refresh token');
      }
      
      const member = await companyRepository.getMemberById(decoded.id);
      if (!member || !member.is_active) {
        throw new Error('User not found or inactive');
      }
      
      const payload = {
        id: member.id,
        companyId: member.company_id,
        role: member.role,
        type: 'company_member'
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
      await companyRepository.revokeRefreshToken(tokenHash);
    }
  }

  async forgotPassword(email) {
    const member = await companyRepository.getMemberByEmail(email);
    if (!member) {
      // Don't throw error to prevent email enumeration
      return; 
    }

    const token = generateResetToken({ memberId: member.id, email: member.email, type: 'company_reset' });
    const resetLink = `http://localhost:5173/company/reset-password?token=${token}`;

    await sendEmail({
      to: email,
      subject: 'Reset Password - RecruitFlow',
      body: `Halo,\n\nKlik link berikut untuk melakukan reset password Anda: \n${resetLink}\n\nLink ini akan kadaluwarsa dalam 1 jam.`
    });
  }

  async resetPassword(token, newPassword) {
    try {
      const decoded = verifyResetToken(token);
      if (decoded.type !== 'company_reset') {
        throw new Error('Token tidak valid');
      }

      const passwordHash = await hashPassword(newPassword);
      await companyRepository.updateMemberPassword(decoded.memberId, passwordHash);
    } catch (err) {
      const error = new Error('Token reset password tidak valid atau sudah kadaluwarsa');
      error.statusCode = 400;
      throw error;
    }
  }
}

module.exports = new AuthCompanyService();
