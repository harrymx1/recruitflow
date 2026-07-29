/**
 * Mock Mailer Service
 * This will be replaced with a real SMTP or third-party service (e.g. Resend) in the future.
 */
const sendEmail = async ({ to, subject, body }) => {
  console.log('\n================ EMAIL MOCK ================');
  console.log(`To      : ${to}`);
  console.log(`Subject : ${subject}`);
  console.log(`Body    :\n${body}`);
  console.log('============================================\n');
  
  // Simulate network delay
  return new Promise((resolve) => setTimeout(resolve, 500));
};

module.exports = {
  sendEmail
};
