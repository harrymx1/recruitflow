const authCompanyService = require('../services/auth.company.service');

class AuthCompanyController {
  async register(req, res, next) {
    try {
      const result = await authCompanyService.register(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { accessToken, refreshToken, member } = await authCompanyService.login(req.body);
      
      // Set refresh token in httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
      
      res.status(200).json({
        success: true,
        data: { accessToken, member }
      });
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'Refresh token required' });
      }
      
      const { accessToken } = await authCompanyService.refresh(refreshToken);
      res.status(200).json({
        success: true,
        data: { accessToken }
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      await authCompanyService.logout(refreshToken);
      
      res.clearCookie('refreshToken');
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await authCompanyService.forgotPassword(email);
      res.json({ success: true, message: 'If email exists, reset link has been sent' });
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      await authCompanyService.resetPassword(token, newPassword);
      res.json({ success: true, message: 'Password has been reset successfully' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthCompanyController();
