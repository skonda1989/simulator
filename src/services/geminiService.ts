import { GoogleGenAI, Type } from "@google/genai";
import { Course } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getTopicSuggestions(input: string): Promise<string[]> {
  if (!input || input.length < 3) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Given the starting text "${input}", suggest 4 interesting, specific technical topics for a learning module. Return ONLY a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text || "[]";
    const suggestions = JSON.parse(text);
    return Array.isArray(suggestions) ? suggestions : [];
  } catch (error) {
    console.error("Failed to get topic suggestions:", error);
    return [];
  }
}

export async function refinePrompt(input: string): Promise<string> {
  if (!input) return "";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Expand this simple learning topic into a detailed, comprehensive prompt for generating a technical course: "${input}". 
      Focus on specific technical depth, real-world relevance, and hands-on practice. 
      Result should be a single paragraph optimized for high-quality content generation.`,
    });

    return response.text || input;
  } catch (error) {
    console.error("Failed to refine prompt:", error);
    return input;
  }
}

export interface CourseOptions {
  includeLessons: boolean;
  includeQuizzes: boolean;
  includeFlashcards: boolean;
}

export async function generateCourse(topic: string, numLessons: number, difficulties: string[], options: CourseOptions): Promise<Course> {
  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
    Generate a learning course for Product Managers about the topic: "${topic}".
    The course should have ${numLessons} lessons.
    The difficulty levels for these lessons should be: ${difficulties.join(", ")}.
    
    Content requirements based on user choice:
    - Include Theory Lessons (Guides): ${options.includeLessons}
    - Include Quizzes (Multiple Choice): ${options.includeQuizzes}
    - Include Flashcards: ${options.includeFlashcards}

    Return the response as a JSON object matching this TypeScript interface:
    interface LessonStep {
      id: string;
      title: string;
      content: string;
      interactiveType: 'multiple-choice' | 'text-input' | 'sandbox' | 'video' | 'case-study' | 'guide' | 'flashcard' | 'none';
      question?: string;
      options?: string[];
      correctAnswer?: string;
      flashcards?: { front: string; back: string }[];
      videoUrl?: string;
      sandboxConfig?: {
        type: 'mcp-config' | 'mcp-tools' | 'mcp-performance' | 'claude-code';
        instructions: string;
        solution: string;
      };
    }
    
    Requirements:
    - MANDATORY: Use simple, clear, and accessible language for all explanations. Explain concepts using simple analogies where possible.
    - EVERY lesson MUST include steps based on the enabled options.
    - If 'includeFlashcards' is true, every lesson MUST have one 'flashcard' step with 5-8 cards.
    - If 'includeQuizzes' is true, every lesson MUST have at least one 'multiple-choice' step.
    - If 'includeLessons' is true, every lesson MUST have a 'guide' step with deep-dive content.
    - Every step's 'content' MUST follow this structure: 
      1. A very simple, jargon-free explanation.
      2. A concrete real-world use case or industry example (labeled "Real-World Example:").
    - Mix content types appropriately.
    - For 'sandbox', provide clear 'instructions' and a 'solution'.
    - Category should be a short string like 'Architecture', 'Strategy', 'Ethics', etc.
    - Points should be between 20 and 100 based on difficulty.
  `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          lessons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                points: { type: Type.NUMBER },
                difficulty: { type: Type.STRING },
                category: { type: Type.STRING },
                steps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      content: { type: Type.STRING },
                      interactiveType: { type: Type.STRING },
                      question: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctAnswer: { type: Type.STRING },
                      flashcards: { 
                        type: Type.ARRAY, 
                        items: { 
                          type: Type.OBJECT,
                          properties: {
                            front: { type: Type.STRING },
                            back: { type: Type.STRING }
                          }
                        } 
                      },
                      videoUrl: { type: Type.STRING },
                      sandboxConfig: {
                        type: Type.OBJECT,
                        properties: {
                          type: { type: Type.STRING },
                          instructions: { type: Type.STRING },
                          solution: { type: Type.STRING }
                        }
                      }
                    },
                    required: ["id", "title", "content", "interactiveType"]
                  }
                }
              },
              required: ["id", "title", "description", "points", "difficulty", "category", "steps"]
            }
          }
        },
        required: ["id", "title", "description", "lessons"]
      }
    }
  });

  return JSON.parse(result.text) as Course;
}

export async function generateCourseFromMaterial(material: string, type: 'text' | 'image' | 'pdf', options: CourseOptions): Promise<Course> {
  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
              I am uploading some training material (slides, notes, or documentation). 
              Generate a 3-5 lesson learning course based on this material.
              
              Content requirements based on user choice:
              - Include Theory Lessons (Guides): ${options.includeLessons}
              - Include Quizzes (Multiple Choice): ${options.includeQuizzes}
              - Include Flashcards: ${options.includeFlashcards}

              Requirements:
              - MANDATORY: Use simple, clear, and accessible language for all explanations. Explain concepts using simple analogies where possible.
              - EVERY lesson MUST include steps based on the enabled options.
              - If 'includeFlashcards' is true, every lesson MUST have a 'flashcard' step with 5-8 cards.
              - If 'includeQuizzes' is true, every lesson MUST have at least one 'multiple-choice' step.
              - If 'includeLessons' is true, every lesson MUST have a 'guide' step.
              - Every step's 'content' MUST follow this structure: 
                1. A very simple, jargon-free explanation.
                2. A concrete real-world use case or industry example (labeled "Real-World Example:").
              - Synthesize the most important technical concepts.
              - Each lesson should have 3 steps.
              - One step in every lesson MUST be a 'sandbox' step.
              - In the 'sandboxConfig', provide a 'solution'.
              
              Return the response as a JSON object matching this TypeScript interface:
              interface LessonStep {
                id: string;
                title: string;
                content: string;
                interactiveType: 'multiple-choice' | 'text-input' | 'sandbox' | 'case-study' | 'guide' | 'flashcard' | 'none';
                question?: string;
                options?: string[];
                correctAnswer?: string;
                flashcards?: { front: string; back: string }[];
                sandboxConfig?: {
                  type: 'mcp-config' | 'mcp-tools' | 'mcp-performance' | 'claude-code';
                  instructions: string;
                  solution: string;
                  initialFiles?: Record<string, string>;
                };
              }
              interface Lesson {
                id: string;
                title: string;
                description: string;
                points: number;
                steps: LessonStep[];
                difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
                category: string;
              }
              interface Course {
                id: string;
                title: string;
                description: string;
                lessons: Lesson[];
              }
            `
          },
          ...(type === 'image' || type === 'pdf' ? [{
            inlineData: {
              data: material, // base64 string
              mimeType: type === 'image' ? "image/jpeg" : "application/pdf"
            }
          }] : [{
            text: `MATERIAL CONTENT:\n\n${material}`
          }])
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          lessons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                points: { type: Type.NUMBER },
                difficulty: { type: Type.STRING },
                category: { type: Type.STRING },
                steps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      content: { type: Type.STRING },
                      interactiveType: { type: Type.STRING },
                      question: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctAnswer: { type: Type.STRING },
                      flashcards: { 
                        type: Type.ARRAY, 
                        items: { 
                          type: Type.OBJECT,
                          properties: {
                            front: { type: Type.STRING },
                            back: { type: Type.STRING }
                          }
                        } 
                      },
                      sandboxConfig: {
                        type: Type.OBJECT,
                        properties: {
                          type: { type: Type.STRING },
                          instructions: { type: Type.STRING },
                          solution: { type: Type.STRING },
                          initialFiles: { 
                            type: Type.OBJECT,
                            additionalProperties: { type: Type.STRING }
                          }
                        }
                      }
                    },
                    required: ["id", "title", "content", "interactiveType"]
                  }
                }
              },
              required: ["id", "title", "description", "points", "difficulty", "category", "steps"]
            }
          }
        },
        required: ["id", "title", "description", "lessons"]
      }
    }
  });

  return JSON.parse(result.text) as Course;
}

export async function chatWithSandboxAI(
  userMessage: string,
  context: {
    instructions: string;
    currentInput: string;
    logs: string[];
    type: string;
    solution?: string;
  }
): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{
            text: `You are an expert technical mentor helping a student with a hands-on lab in an Integrated Learning Environment.
            
            CONTEXT:
            - Lab Type: ${context.type}
            - Lab Instructions: ${context.instructions}
            - Student's Current Code/Input: ${context.currentInput || "[No input yet]"}
            - Execution Logs: ${context.logs.join("\n")}
            ${context.solution ? `- Reference Solution (DO NOT REVEAL FULLY): ${context.solution}` : ""}

            GOALS:
            1. Guide the student if they are stuck. Give hints rather than full code unless they are really struggling.
            2. Suggest "experiments" or things to try within this sandbox to deepen their understanding.
            3. Answer questions about the underlying technology (e.g., "Why do I need a transport layer?").
            4. If the student makes a mistake, explain the 'why' behind the error.

            RULES:
            - Keep responses concise and encouraging.
            - Use markdown for code snippets.
            - Do not just give the solution unless explicitly asked for a direct fix after multiple attempts.
            - Be technically accurate.
            
            USER MESSAGE: ${userMessage}`
          }]
        }
      ]
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Sandbox AI error:", error);
    return "The AI mentor is currently offline. Try running your code or checking the logs.";
  }
}
