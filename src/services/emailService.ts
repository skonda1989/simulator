import { Course } from '../types';

export const sendCourseCreationEmail = async (email: string, course: Course, appUrl: string) => {
  const courseLink = `${appUrl}/?courseId=${course.id}`;
  
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: `Your New Course is Ready: ${course.title}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; rounded: 12px;">
            <h1 style="color: #4f46e5; margin-bottom: 20px;">Your Learning Path is Ready!</h1>
            <p style="font-size: 16px; color: #374151; line-height: 1.5;">
              Hello! Your custom curriculum <strong>"${course.title}"</strong> has been architected and is ready for you to explore.
            </p>
            <div style="margin: 30px 0;">
              <a href="${courseLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                Access Your Course
              </a>
            </div>
            <p style="font-size: 14px; color: #6b7280;">
              This course includes ${course.lessons.length} core modules designed to help you master the subject.
            </p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 12px; color: #9ca3af;">
              If the button above doesn't work, copy and paste this link into your browser:<br/>
              <a href="${courseLink}" style="color: #4f46e5;">${courseLink}</a>
            </p>
          </div>
        `,
      }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};
