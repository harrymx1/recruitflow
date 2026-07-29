const companyRepository = require('../repositories/company.repository');
const { hashPassword } = require('../utils/password');
const { sendEmail } = require('../config/mailer');

class CompaniesService {
  async inviteTeamMember(companyId, data) {
    const { name, email, role, password } = data;
    
    // Check if email exists
    const existingMember = await companyRepository.getMemberByEmail(email);
    if (existingMember) {
      const err = new Error('Email already registered');
      err.statusCode = 400;
      throw err;
    }
    
    const passwordHash = await hashPassword(password);
    
    const memberId = await companyRepository.addTeamMember(companyId, {
      name,
      email,
      passwordHash,
      role
    });
    
    // Mock send email
    await sendEmail({
      to: email,
      subject: 'Undangan Bergabung ke Workspace RecruitFlow',
      body: `Halo ${name},\n\nAnda telah diundang untuk bergabung ke workspace perusahaan Anda di RecruitFlow sebagai ${role}.\nPassword sementara Anda adalah: ${password}\n\nSilakan login dan ubah password Anda segera.`
    });
    
    return { memberId };
  }

  async toggleMemberStatus(companyId, memberId, isActive) {
    const updatedMember = await companyRepository.updateMemberStatus(companyId, memberId, isActive);
    if (!updatedMember) {
      const err = new Error('Member not found');
      err.statusCode = 404;
      throw err;
    }
    return updatedMember;
  }
  
  async getTeamMembers(companyId) {
    return await companyRepository.getMembersByCompanyId(companyId);
  }

  async getProfile(companyId) {
    const company = await companyRepository.getCompanyById(companyId);
    if (!company) {
      const err = new Error('Company not found');
      err.statusCode = 404;
      throw err;
    }
    return company;
  }

  async getPublicProfile(slug) {
    const company = await companyRepository.getCompanyBySlug(slug);
    if (!company) {
      const err = new Error('Company not found');
      err.statusCode = 404;
      throw err;
    }
    company.locations = await companyRepository.getLocations(company.id);
    return company;
  }

  async getLocations(companyId) {
    return await companyRepository.getLocations(companyId);
  }

  async addLocation(companyId, data) {
    if (data.is_headquarters) {
      await companyRepository.setHeadquarters(companyId, null); // Just clearing the old one logic is handled in setHeadquarters, but setHeadquarters needs an ID.
      // Wait, if we are adding a new location and it's headquarters, we can just insert it, then call setHeadquarters
    }
    const location = await companyRepository.addLocation(companyId, data);
    if (data.is_headquarters) {
      await companyRepository.setHeadquarters(companyId, location.id);
    }
    return location;
  }

  async removeLocation(companyId, locationId) {
    const success = await companyRepository.removeLocation(companyId, locationId);
    if (!success) {
      const err = new Error('Location not found');
      err.statusCode = 404;
      throw err;
    }
  }

  async setHeadquarters(companyId, locationId) {
    return await companyRepository.setHeadquarters(companyId, locationId);
  }

  async updateProfile(companyId, updateData) {
    const allowedFields = [
      'name', 'logo_url', 'banner_url', 'tagline', 'industry',
      'size_range', 'founded_year', 'website', 'description',
      'socials', 'benefits'
    ];
    
    const dataToUpdate = {};
    for (const key of Object.keys(updateData)) {
      if (allowedFields.includes(key)) {
        // stringify objects for JSONB columns if necessary, but pg driver usually handles it if passed as object
        if ((key === 'socials' || key === 'benefits') && typeof updateData[key] !== 'string') {
          dataToUpdate[key] = JSON.stringify(updateData[key]);
        } else {
          dataToUpdate[key] = updateData[key];
        }
      }
    }

    // Determine completeness (very basic logic: requires description and tagline)
    if (dataToUpdate.description && dataToUpdate.tagline) {
      dataToUpdate.is_profile_complete = true;
    }

    const updatedCompany = await companyRepository.updateCompany(companyId, dataToUpdate);
    return updatedCompany;
  }
}

module.exports = new CompaniesService();
