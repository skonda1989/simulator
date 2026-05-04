import { Course, UserProfile } from '../types';

export async function generateCertificate(course: Course, profile: UserProfile | null, userName?: string | null) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set high resolution for printing
  canvas.width = 1600;
  canvas.height = 1200;

  // Draw Background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#f9fafb');
  gradient.addColorStop(1, '#f3f4f6');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = '#4f46e5';
  ctx.lineWidth = 40;
  ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

  // Decorative Inner Border
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.strokeRect(100, 100, canvas.width - 200, canvas.height - 200);

  // Content
  ctx.textAlign = 'center';
  ctx.fillStyle = '#111827';

  // Title
  ctx.font = 'bold 32px monospace';
  ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 250);

  // "This certifies that"
  ctx.font = '24px sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText('This is to certify that', canvas.width / 2, 350);

  // User Name
  ctx.font = 'bold 64px serif';
  ctx.fillStyle = '#1e1b4b';
  ctx.fillText(userName || profile?.name || 'Valued Learner', canvas.width / 2, 450);

  // "Has successfully completed"
  ctx.font = '24px sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText('has successfully completed the curriculum', canvas.width / 2, 550);

  // Course Title
  ctx.font = 'italic bold 48px sans-serif';
  ctx.fillStyle = '#4f46e5';
  ctx.fillText(course.title, canvas.width / 2, 650);

  // ID and Date
  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const completionId = `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  ctx.font = '18px monospace';
  ctx.fillStyle = '#9ca3af';
  ctx.fillText(`Issued on ${date}`, canvas.width / 2, 850);
  ctx.fillText(`Verification ID: ${completionId}`, canvas.width / 2, 900);

  // Seal (Simple circle for visual)
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 1050, 40, 0, Math.PI * 2);
  ctx.fillStyle = '#4f46e5';
  ctx.fill();
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('SC', canvas.width / 2, 1058);

  // Download
  const link = document.createElement('a');
  link.download = `Certificate-${course.title.replace(/\s+/g, '-')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
