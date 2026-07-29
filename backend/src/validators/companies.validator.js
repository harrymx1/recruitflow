const { z } = require('zod');

const inviteTeamMemberSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['admin', 'hr']),
  // In a real app we might not pass password directly but send an invite link.
  // For this MVP per US-1.2, we assume we might set a default password or require it.
  // We'll require it for now to simplify auth.
  password: z.string().min(8)
});

const toggleStatusSchema = z.object({
  isActive: z.boolean()
});

module.exports = {
  inviteTeamMemberSchema,
  toggleStatusSchema
};
