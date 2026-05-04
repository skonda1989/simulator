import { Course } from './types';

export const COURSES: Course[] = [
  {
    id: 'claude-code-mastery',
    title: 'Claude Code Mastery',
    description: 'Transform your development workflow with Anthropic\'s specialized CLI agent.',
    lessons: [
      {
        id: 'cc-foundation',
        title: 'Foundation: The Agentic Shell',
        description: 'Understand how Claude interacts with your terminal and file system.',
        points: 50,
        difficulty: 'Beginner',
        category: 'Tooling',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: Beyond Autocomplete',
            content: 'Claude Code represents a shift from "AI in the IDE" to "AI in the Shell". Unlike basic autocomplete, this agent can execute terminal commands, run your test suite, and iterate on its own code changes. It works by having a specialized set of tools for file manipulation, grep-based search, and shell execution. As a developer, your role shifts to "Manager of the Agent", providing high-level intent and verifying the outcomes.',
            interactiveType: 'none'
          },
          {
            id: 'guide-cli',
            title: 'Deep Dive: Mastering the Anthropic CLI',
            content: 'A comprehensive walkthrough of setting up and optimizing Claude Code for your local environment.',
            interactiveType: 'guide',
            guideUrl: 'https://www.anthropic.com/claude-code',
            readingReferences: [
              { title: 'The Rise of Agentic Workflows', url: 'https://www.deeplearning.ai/the-batch/how-agents-are-changing-software-development/' },
              { title: 'CLI Tools for the Modern Developer', url: 'https://dev.to/anthropic/introducing-claude-code-1ogm' }
            ]
          },
          {
            id: 'casestudy',
            title: 'Case Study: The 10-Minute Onboarding',
            content: 'A new developer used Claude Code to map a legacy codebase.',
            interactiveType: 'case-study',
            caseStudy: {
              context: 'A senior engineer joined a team with 5 years of technical debt and no documentation.',
              challenge: 'Locating the exact logic that handles user subscription cancellations amidst 200+ service files.',
              solution: 'Using the `/search` and `/explain` tools to trace state management from the UI to the database.',
              results: 'Found the bug in 8 minutes that usually takes senior devs 2 hours to locate.'
            }
          },
          {
            id: 'simulator',
            title: 'Simulator: Architectural Audit',
            content: 'In this simulation, we observe how Claude traces code dependencies. Use the knobs to adjust "Exploration Depth" and "Context Window" to see how the agent builds a mental map of the Dashboard component.',
            interactiveType: 'simulator',
            simulatorConfig: {
              type: 'agent-loops',
              data: {}
            }
          }
        ]
      },
      {
        id: 'cc-debugging',
        title: 'Agentic Debugging Loops',
        description: 'Implement a TDD workflow where the agent fixes failing tests.',
        points: 100,
        difficulty: 'Intermediate',
        category: 'Applied AI',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: The Self-Correcting Loop',
            content: 'One of the most powerful features of Claude Code is its ability to "fix and verify". When you provide a failing test path, the agent reads the error message, explores the source code, applies a fix, AND runs the test again. It will continue this loop until the test passes or it identifies a blocker. This reduces the cognitive load of the "compile-fail-fix" cycle.',
            interactiveType: 'none'
          },
          {
            id: 'guide-debugging',
            title: 'Deep Dive: Error Handling with Agents',
            content: 'Best practices for providing context to Claude when debugging complex failures.',
            interactiveType: 'guide',
            guideUrl: 'https://www.anthropic.com/claude-code',
            readingReferences: [
              { title: 'Effective Prompting for Code Repair', url: 'https://arxiv.org/abs/2311.08516' },
              { title: 'Unit Testing for AI Agents', url: 'https://www.moderlo.com/blog/testing-ai-agents' }
            ]
          },
          {
            id: 'casestudy',
            title: 'Case Study: The Midnight Incident',
            content: 'How an automated agent fixed a production-blocking race condition.',
            interactiveType: 'case-study',
            caseStudy: {
              context: 'A critical payment processing failure occurred during off-hours.',
              challenge: 'A transient race condition was causing 5% of checkouts to fail silently.',
              solution: 'An automated script triggered Claude Code to analyze logs, write a reproduction test, and apply a retry logic fix.',
              results: 'Incident resolved in 15 minutes; MTTR reduced from hours to minutes.'
            }
          },
          {
            id: 'simulator',
            title: 'Simulator: Bug Squashing',
            content: 'Simulate a self-correcting debugging loop. Watch how increasing the "Evaluation Sensitivity" helps the agent catch subtle hardcoded strings that simple regex would miss.',
            interactiveType: 'simulator',
            simulatorConfig: {
              type: 'agent-loops',
              data: {}
            }
          }
        ]
      },
      {
        id: 'cc-refactoring',
        title: 'Refiguring Codescape',
        description: 'Scale complex refactors across thousands of files with confidence.',
        points: 80,
        difficulty: 'Intermediate',
        category: 'Productivity',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: Mass Refactoring',
            content: 'Claude Code excels at "search and replace" on steroids. Instead of regex, you give it semantic instructions like "Update all API callers to use the new authentication header format". It can handle edge cases that simple text replacement misses.',
            interactiveType: 'none'
          },
          {
            id: 'guide-refactoring',
            title: 'Deep Dive: Large Scale Refactoring',
            content: 'Learn how to handle broad changes across a monorepo using agentic logic.',
            interactiveType: 'guide',
            guideUrl: 'https://www.anthropic.com/claude-code',
            readingReferences: [
              { title: 'Semantic Code Search', url: 'https://sourcegraph.com/blog/semantic-code-search' },
              { title: 'Refactoring at Scale', url: 'https://engineering.atlassian.com/refactoring-at-scale/' }
            ]
          },
          {
            id: 'simulator-refactor',
            title: 'Simulator: Pattern Migration Lab',
            content: 'Mass refactoring usually involves complex recursive logic. Watch how adjusting the "Pattern Matching" slider helps the agent identify semantic clusters for migration instead of just simple text strings.',
            interactiveType: 'simulator',
            simulatorConfig: {
              type: 'agent-loops',
              data: {}
            }
          }
        ]
      },
      {
        id: 'cc-docs',
        title: 'Documentation as First Class Citizen',
        description: 'Auto-generate and sync technical documentation from implementation.',
        points: 60,
        difficulty: 'Beginner',
        category: 'Operations',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: Living Documentation',
            content: 'Keep your READMEs and internal docs in sync with the codebase. Use Claude to scan for changes and update the corresponding documentation files automatically.',
            interactiveType: 'none'
          },
          {
            id: 'guide-docs',
            title: 'Deep Dive: AI-Driven Documentation',
            content: 'Strategies for using LLMs to keep technical docs perfectly in sync with implementation.',
            interactiveType: 'guide',
            guideUrl: 'https://www.anthropic.com/claude-code',
            readingReferences: [
              { title: 'Documentation as Code', url: 'https://www.writethedocs.org/guide/automated-community/docs-as-code/' },
              { title: 'Using AI for Tech Writing', url: 'https://idratherbewriting.com/blog/ai-for-technical-writers' }
            ]
          },
          {
            id: 'simulator-docs',
            title: 'Simulator: Automated Doc Gen',
            content: 'Experience how the agent synthesizes technical documentation. Adjust the "Verbosity" knob to see the difference between a high-level summary and an exhaustive API reference.',
            interactiveType: 'simulator',
            simulatorConfig: {
              type: 'agent-loops',
              data: {}
            }
          }
        ]
      },
      {
        id: 'cc-ci-cd',
        title: 'Agentic CI Pipelines',
        description: 'Integrate the CLI into your automated deployment flows.',
        points: 120,
        difficulty: 'Advanced',
        category: 'DevOps',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: The CI Bot',
            content: 'Run Claude Code in your GitHub Actions or GitLab CI. It can review PRs, suggest fixes for linting errors, or even verify deployment success by running smoke tests in the shell.',
            interactiveType: 'none'
          },
          {
            id: 'guide-ci-cd',
            title: 'Deep Dive: Automated Agentic Pipelines',
            content: 'Step-by-step on integrating LLMs into GitHub Actions and CircleCI.',
            interactiveType: 'guide',
            guideUrl: 'https://www.anthropic.com/claude-code',
            readingReferences: [
              { title: 'The Future of CI is Agentic', url: 'https://dev.to/anthropic/ai-in-ci-cd-4n3k' },
              { title: 'Securing AI in Deployment', url: 'https://circleci.com/blog/ai-security-in-cicd/' }
            ]
          },
          {
            id: 'simulator-pr',
            title: 'Simulator: Agentic PR Review',
            content: 'Automate your security pass. Observe how the agent flags unvalidated inputs when the "Security Sensitivity" is set to Maximum.',
            interactiveType: 'simulator',
            simulatorConfig: {
              type: 'agent-loops',
              data: {}
            }
          }
        ]
      },
      {
        id: 'cc-collaboration',
        title: 'Agentic Collaboration',
        description: 'How multiple developers can share an agentic workflow.',
        points: 70,
        difficulty: 'Intermediate',
        category: 'Teams',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: The Collective Agent',
            content: 'When a team uses Claude Code, the agent becomes a shared resource. We discuss how to version-control the agent\'s instructions, share common custom tools, and maintain consistency across different environments.',
            interactiveType: 'none'
          },
          {
            id: 'guide-collaboration',
            title: 'Deep Dive: Collaborative Agentic Workflows',
            content: 'Best practices for multi-agent and multi-human collaboration on shared codebases.',
            interactiveType: 'guide',
            guideUrl: 'https://www.anthropic.com/claude-code',
            readingReferences: [
              { title: 'Agents as Team Members', url: 'https://www.forbes.com/sites/forbestechcouncil/2024/02/15/the-rise-of-the-ai-colleague/' },
              { title: 'Sharing MCP Configs', url: 'https://github.com/modelcontextprotocol/servers' }
            ]
          },
          {
            id: 'multiple-choice',
            title: 'Team Sync',
            content: 'What is the best way to share custom agent behaviors?',
            interactiveType: 'multiple-choice',
            question: 'Where should shared MCP configurations live?',
            options: ['Local .env only', 'A shared repo/config file', 'Slack messages'],
            correctAnswer: 'A shared repo/config file'
          }
        ]
      },
      {
        id: 'cc-performance',
        title: 'Performance Tuning for Agents',
        description: 'Reduce the time it takes for Claude to solve complex tasks.',
        points: 90,
        difficulty: 'Advanced',
        category: 'Optimization',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: Latency Engineering',
            content: 'Every file Claude reads adds to the context window and the cost. Learn how to use .claudeignore and specific path instructions to keep the agent focused and fast.',
            interactiveType: 'none'
          },
          {
            id: 'guide-performance',
            title: 'Deep Dive: Optimizing Agentic Latency',
            content: 'Technical techniques to reduce token overhead and speed up agent response times.',
            interactiveType: 'guide',
            guideUrl: 'https://www.anthropic.com/claude-code',
            readingReferences: [
              { title: 'Speculative Decoding Explained', url: 'https://medium.com/@ai_research/speed-up-llms-with-speculative-decoding-e4d6a1' },
              { title: 'Context Window Optimization', url: 'https://www.pinecone.io/learn/llm-context-window/' }
            ]
          },
          {
            id: 'simulator-scope',
            title: 'Simulator: Context Budgeting',
            content: 'Tokens are limited. Test how excluding non-essential directories like /node_modules affects the agent\'s speed and success rate in large codebase analysis.',
            interactiveType: 'simulator',
            simulatorConfig: {
              type: 'agent-loops',
              data: {}
            }
          }
        ]
      },
      {
        id: 'cc-future',
        title: 'The Future of Agentic IDEs',
        description: 'Predicting the shift from "Writing Code" to "Directing Code".',
        points: 50,
        difficulty: 'Beginner',
        category: 'Strategy',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: Software 3.0',
            content: 'In the Future, we won\'t write code; we will write specs and oversee the agent that translates them into implementation. This lesson explores the shift in developer roles from execution to architecture and audit.',
            interactiveType: 'none'
          },
          {
            id: 'guide-future',
            title: 'Deep Dive: The Agentic Revolution',
            content: 'Predicting the evolution of software engineering in an AI-first world.',
            interactiveType: 'guide',
            guideUrl: 'https://www.anthropic.com/claude-code',
            readingReferences: [
              { title: 'Software 2.0 by Andrej Karpathy', url: 'https://medium.com/@karpathy/software-2-0-a64130b713c' },
              { title: 'The End of Programming as We Know It', url: 'https://pdxscholar.library.pdx.edu/cgi/viewcontent.cgi?article=1524&context=news' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ai-pm-foundations',
    title: 'AI Fundamentals for PMs',
    description: 'Master the technical vocabulary and strategic constraints of AI products.',
    lessons: [
      {
        id: 'pm-tokens',
        title: 'The Token Economy',
        description: 'Understand the unit of cost, constraints, and latency in LLMs.',
        points: 40,
        difficulty: 'Beginner',
        category: 'Economics',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: Predicting the Bill',
            content: 'For a PM, tokens aren\'t just a technical detail; they are your COGS (Cost of Goods Sold). Every feature you design has a "token price". Predicting this requires understanding prompt size, expected output length, and any Retrieval-Augmented Generation (RAG) context. This lesson covers how to balance high-quality outputs with sustainable gross margins.',
            interactiveType: 'none'
          },
          {
            id: 'guide-economics',
            title: 'Deep Dive: AI Unit Economics',
            content: 'How to build a financial model for your AI features, calculating gross margins and token efficiency.',
            interactiveType: 'guide',
            guideUrl: 'https://a16z.com/the-economic-case-for-generative-ai/',
            readingReferences: [
              { title: 'The Cost of Intelligence', url: 'https://www.sequoiacap.com/article/ai-unit-economics/' },
              { title: 'Pricing Strategies for SaaS AI', url: 'https://www.intercom.com/blog/how-to-price-ai-features/' }
            ]
          },
          {
            id: 'casestudy',
            title: 'Case Study: The $50k Error',
            content: 'How a simple loop caused a massive cloud bill.',
            interactiveType: 'case-study',
            caseStudy: {
              context: 'A startup launched a "summarize everything" feature for their enterprise users.',
              challenge: 'The system accidentally entered an infinite recursion loop during high traffic.',
              solution: 'Implemented strict token limits per request and established a "kill switch" based on real-time billing alerts.',
              results: 'Future incidents prevented, saving an estimated $20k/month in wasted compute.'
            }
          },
          {
            id: 'simulator-tokens',
            title: 'Simulator: Token Economics Lab',
            content: 'As a PM, you must balance cost vs. quality. Use the slider to see how increasing context length affects your gross margins across different models.',
            interactiveType: 'simulator',
            simulatorConfig: {
              type: 'token-cost',
              data: {}
            }
          }
        ]
      },
      {
        id: 'pm-rag-strategy',
        title: 'Strategy: RAG vs. Fine-tuning',
        description: 'Decide how to ground your model in your company\'s proprietary data.',
        points: 60,
        difficulty: 'Intermediate',
        category: 'Strategy',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: Grounding the Model',
            content: 'As a PM, you\'ll often face the choice: Should we fine-tune a model on our data, or use Retrieval-Augmented Generation (RAG)? Fine-tuning is like teaching a student a new subject over a semester, while RAG is like giving them an open-book exam with the right library of books. This lesson explores the trade-offs in accuracy, cost, and maintenance.',
            interactiveType: 'none'
          },
          {
            id: 'guide-rag',
            title: 'Deep Dive: Architecting RAG Systems',
            content: 'From chunking strategies to vector database selection: how to ground your model securely.',
            interactiveType: 'guide',
            guideUrl: 'https://pinecone.io/learn/retrieval-augmented-generation/',
            readingReferences: [
              { title: 'RAG vs Fine-tuning: A Guide for PMs', url: 'https://www.scality.com/blog/rag-vs-fine-tuning/' },
              { title: 'Chunking Strategies for LLMs', url: 'https://www.pinecone.io/learn/chunking-strategies/' }
            ]
          },
          {
            id: 'casestudy',
            title: 'Case Study: The Customer Support Agent',
            content: 'A travel app reduced hallucination by 90% using RAG.',
            interactiveType: 'case-study',
            caseStudy: {
              context: 'The AI was making up refund policies that didn\'t exist.',
              challenge: 'The model was trained on general internet data, not the specific updated 2024 policies.',
              solution: 'Hooked the model into a vector database of the latest PDF policy documents using RAG.',
              results: 'Customer satisfaction increased by 25% and support escalations dropped.'
            }
          },
          {
            id: 'rag-simulator',
            title: 'Simulator: Conflicting Policy Lab',
            content: 'In production RAG systems, you will often find documents that contradict each other. Without the right "knobs," your AI will confidently hallucinate or provide outdated information. Use this simulator to understand how Freshness and Confidence scoring resolve ambiguity.',
            interactiveType: 'simulator',
            simulatorConfig: {
              type: 'rag-conflict',
              data: {}
            }
          }
        ]
      },
      {
        id: 'pm-ethics',
        title: 'AI Ethics and Safety',
        description: 'Implement guardrails and detect bias early in the product lifecycle.',
        points: 50,
        difficulty: 'Beginner',
        category: 'Ethics',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: Building Trust',
            content: 'Users will only adopt AI if they trust it. This means preventing toxic outputs, ensuring data privacy, and being transparent about when AI is being used. As a PM, you define the "Safety Budget" of the project.',
            interactiveType: 'none'
          },
          {
            id: 'guide-ethics',
            title: 'Deep Dive: AI Safety and Bias',
            content: 'Frameworks for detecting and mitigating bias in large language models.',
            interactiveType: 'guide',
            guideUrl: 'https://www.anthropic.com/safety',
            readingReferences: [
              { title: 'AI Ethics Guidelines', url: 'https://www.unesco.org/en/artificial-intelligence/recommendation-ethics' },
              { title: 'Red Teaming for Safety', url: 'https://www.anthropic.com/news/red-teaming-claude-2' }
            ]
          },
          {
            id: 'multiple-choice',
            title: 'Policy Check',
            content: 'How to handle a model hallucination in a financial context?',
            interactiveType: 'multiple-choice',
            question: 'What is the most effective way to prevent financial advice hallucinations?',
            options: ['RAG with vetted sources', 'Ban the word "advise"', 'Larger prompt'],
            correctAnswer: 'RAG with vetted sources'
          }
        ]
      },
      {
        id: 'pm-evaluation',
        title: 'Evaluating LLM Quality',
        description: 'Move beyond "vibe checks" to rigorous automated metrics.',
        points: 80,
        difficulty: 'Intermediate',
        category: 'Quality',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: Metrics for AI',
            content: 'Standard metrics like click-through rate don\'t capture model quality. You need custom "Evaluation Sets" (Evals) using tools like ROUGE, BLEU, or even using a stronger model (LLM-as-a-judge) to score outputs.',
            interactiveType: 'none'
          },
          {
            id: 'guide-evaluation',
            title: 'Deep Dive: Building LLM Evals',
            content: 'Technical guide to creating automated evaluation sets for model quality.',
            interactiveType: 'guide',
            guideUrl: 'https://www.anthropic.com/research',
            readingReferences: [
              { title: 'Automated Evaluation of LLMs', url: 'https://github.com/openai/evals' },
              { title: 'LLM-as-a-judge', url: 'https://arxiv.org/abs/2306.05685' }
            ]
          },
          {
             id: 'simulator-evals',
             title: 'Simulator: Quality Gatekeeper',
             content: 'Set and test your quality bars. Adjust the Similarity threshold and see how it affects the "Pass/Fail" rate of your production-ready AI outputs.',
             interactiveType: 'simulator',
             simulatorConfig: {
               type: 'eval-thresholds',
               data: {}
             }
          }
        ]
      },
      {
        id: 'pm-latency',
        title: 'Latency vs. Quality',
        description: 'Optimize the user experience for streaming AI outputs.',
        points: 70,
        difficulty: 'Advanced',
        category: 'Performance',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: The Streaming Trade-off',
            content: 'Speed is a feature. Users prefer a fast model over a slightly smarter but slow one. We cover techniques like speculative decoding, model distillation, and UX patterns like "Streaming text" to handle wait times.',
            interactiveType: 'none'
          },
          {
            id: 'guide-latency',
            title: 'Deep Dive: Real-time AI performance',
            content: 'Advanced strategies for minimizing time-to-first-token in production.',
            interactiveType: 'guide',
            guideUrl: 'https://www.anthropic.com/research',
            readingReferences: [
              { title: 'Optimizing Token Latency', url: 'https://a16z.com/how-to-lower-llm-latency/' },
              { title: 'Edge Computing for AI', url: 'https://www.cloudflare.com/learning/ai/what-is-edge-ai/' }
            ]
          },
          {
             id: 'simulator-latency-tradeoff',
             title: 'Simulator: The Speed/Quality Dial',
             content: 'Optimize your user experience. Toggle Speculative Decoding and Quantization models to balance sub-100ms latency goals against output precision.',
             interactiveType: 'simulator',
             simulatorConfig: {
               type: 'latency-tradeoff',
               data: {}
             }
          }
        ]
      },
      {
        id: 'pm-fine-tuning',
        title: 'Model Fine-tuning for PMs',
        description: 'When and why to invest in specialized model training.',
        points: 100,
        difficulty: 'Advanced',
        category: 'Applied AI',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: Branding the Model',
            content: 'Fine-tuning isn\'t just for knowledge; it\'s for style, tone, and format. Learn how to identify when RAG isn\'t enough and your product requires a specialized base model behavior.',
            interactiveType: 'none'
          },
          {
            id: 'guide-fine-tuning',
            title: 'Deep Dive: Fine-tuning for Format',
            content: 'When RAG isn\'t enough: mastering model behavior through specialized training.',
            interactiveType: 'guide',
            guideUrl: 'https://www.anthropic.com/research',
            readingReferences: [
              { title: 'Practical Guide to Fine-tuning', url: 'https://towardsdatascience.com/fine-tune-your-own-llama-2-model-full-guide-d5386f5c8d1' },
              { title: 'Fine-tuning vs RAG', url: 'https://www.anyscale.com/blog/fine-tuning-llms-vs-rag' }
            ]
          },
          {
            id: 'multiple-choice',
            title: 'Tuning Check',
            content: 'When is fine-tuning better than few-shot prompting?',
            interactiveType: 'multiple-choice',
            question: 'Best use case for fine-tuning?',
            options: ['Specific output format adherence', 'Fact-based knowledge', 'Changing small text'],
            correctAnswer: 'Specific output format adherence'
          }
        ]
      },
      {
        id: 'pm-data-flywheel',
        title: 'The AI Data Flywheel',
        description: 'Creating a virtuous cycle of user feedback and model improvement.',
        points: 80,
        difficulty: 'Intermediate',
        category: 'Product Growth',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: Feedback Loops',
            content: 'Your users are your best data labelers. We explore how to design "Implicit Feedback" (did they keep the result?) and "Explicit Feedback" (thumbs up/down) to drive model performance.',
            interactiveType: 'none'
          },
          {
            id: 'guide-flywheel',
            title: 'Deep Dive: AI Feedback Loops',
            content: 'Designing systems that learn from user interactions automatically.',
            interactiveType: 'guide',
            guideUrl: 'https://www.anthropic.com/research',
            readingReferences: [
              { title: 'The AI Data Flywheel', url: 'https://www.growthunhinged.com/p/ai-data-flywheel' },
              { title: 'Reinforcement Learning from Human Feedback', url: 'https://openai.com/blog/instruction-following/' }
            ]
          },
          {
            id: 'casestudy',
            title: 'Case Study: The Proactive Suggestion',
            content: 'How an AI assistant improved its acceptance rate from 30% to 70%.',
            interactiveType: 'case-study',
            caseStudy: {
              context: 'The AI was suggesting code completions that developers often ignored.',
              challenge: 'Low signal on why suggestions were rejected.',
              solution: 'Logged the specific diff between suggested and final code to retrain the filtering model.',
              results: 'User productivity increased significantly as the AI learned from its own mistakes.'
            }
          }
        ]
      },
      {
        id: 'pm-scaling',
        title: 'Scaling AI Products',
        description: 'Moving from prototype to a production-grade AI feature.',
        points: 60,
        difficulty: 'Intermediate',
        category: 'Operations',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: Reliability at Scale',
            content: 'AI is non-deterministic. How do you guarantee a consistent experience for millions of users? We discuss fallback strategies, rate limiting, and automated regression testing for prompts.',
            interactiveType: 'none'
          },
          {
            id: 'guide-scaling',
            title: 'Deep Dive: Scaling LLM Infrastructure',
            content: 'Moving from local scripts to redundant, high-availability AI services.',
            interactiveType: 'guide',
            guideUrl: 'https://www.anthropic.com/research',
            readingReferences: [
              { title: 'Reliability Engineering for LLMs', url: 'https://www.honeycomb.io/blog/observability-llms' },
              { title: 'Rate Limiting AI APIs', url: 'https://stripe.com/blog/rate-limiters' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mcp-mastery',
    title: 'Model Context Protocol (MCP)',
    description: 'Bridge the gap between AI models and your proprietary business data.',
    lessons: [
      {
        id: 'mcp-architecture',
        title: 'MCP: The Open Bridge',
        description: 'Learn the standard that connects Claude to your private tools.',
        points: 60,
        difficulty: 'Intermediate',
        category: 'Architecture',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: Standardizing Integration',
            content: 'Historically, connecting an LLM to a database meant writing custom, brittle connector code. MCP (Model Context Protocol) provides a standardized way for models to discover and utilize external resources. It separates the "Client" (the LLM interface) from the "Server" (the data source). This lesson explores how to build and secure these connections for enterprise scale.',
            interactiveType: 'none'
          },
          {
            id: 'guide-mcp',
            title: 'Deep Dive: Setting up your first MCP Server',
            content: 'Practical steps to connect your internal APIs to Claude using the Model Context Protocol.',
            interactiveType: 'guide',
            guideUrl: 'https://modelcontextprotocol.io/introduction',
            readingReferences: [
              { title: 'Standardizing AI Integration', url: 'https://www.anthropic.com/news/model-context-protocol' },
              { title: 'MCP Servers for the Enterprise', url: 'https://github.com/modelcontextprotocol/servers' }
            ]
          },
          {
            id: 'casestudy',
            title: 'Case Study: The Multi-Tool Agent',
            content: 'How a healthcare company secured patient data while enabling AI analysis.',
            interactiveType: 'case-study',
            caseStudy: {
              context: 'Doctors needed a way to query patient records across three different legacy databases.',
              challenge: 'Maintaining HIPAA compliance while allowing an AI agent to aggregate data.',
              solution: 'Developed a read-only MCP server with strict row-level security and audit logging.',
              results: 'Reduced record retrieval time by 70% without exposing full PII to the model training set.'
            }
          },
          {
            id: 'simulator-mcp-config',
            title: 'Simulator: MCP Bridge Lab',
            content: 'Practice connecting agents to data silos. Toggle "Audit Mode" and "ReadOnly" flags to ensure your AI can analyze data without risking unauthorized state changes.',
            interactiveType: 'simulator',
            simulatorConfig: {
              type: 'mcp-security',
              data: {}
            }
          }
        ]
      },
      {
        id: 'mcp-security',
        title: 'Advanced: Securing the Protocol',
        description: 'Implement auth and permission layers for your MCP infrastructure.',
        points: 150,
        difficulty: 'Advanced',
        category: 'Security',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: The Trust Layer',
            content: 'When an agent can execute code or read data, security is paramount. This lesson covers the "Proxy Pattern" for MCP servers, where a middle layer validates every request from the LLM against the current user\'s permissions. We will discuss OAuth 2.0 integration and how to prevent "Prompt Injection" attacks that attempt to bypass data filters.',
            interactiveType: 'none'
          },
          {
            id: 'guide-mcp-security',
            title: 'Deep Dive: The Zero-Trust Agent',
            content: 'A guide to implementing RBAC and secure proxies for your MCP infrastructure.',
            interactiveType: 'guide',
            guideUrl: 'https://modelcontextprotocol.io/docs/concepts/tools#security-considerations',
            readingReferences: [
              { title: 'Preventing Prompt Injection in Tools', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/' },
              { title: 'OAuth for MCP Servers', url: 'https://medium.com/@ai_security/securing-the-model-context-protocol-c2d1b4' }
            ]
          },
          {
            id: 'casestudy',
            title: 'Case Study: The Financial Audit',
            content: 'Preventing unauthorized access in a high-compliance banking environment.',
            interactiveType: 'case-study',
            caseStudy: {
              context: 'A bank implemented an AI internal auditor to flag suspicious transactions.',
              challenge: 'The AI needed access to sensitive transaction data but must not be allow to share it with unauthorized staff prompts.',
              solution: 'Implemented "Encapsulated Responses" where the AI only receives a summary, never the raw PII.',
              results: 'Passed federal audit with zero findings on AI security.'
            }
          },
          {
            id: 'simulator-security',
            title: 'Simulator: Security Boundary Lab',
            content: 'When connecting AI to sensitive data, you need strict guardians. Simulate a "Write-Protected" environment and see how row-level security prevents unauthorized data leakage.',
            interactiveType: 'simulator',
            simulatorConfig: {
              type: 'mcp-security',
              data: {}
            }
          }
        ]
      },
      {
        id: 'mcp-custom-tools',
        title: 'Building Custom MCP Servers',
        description: 'Expose your own APIs to AI models using the TypeScript SDK.',
        points: 100,
        difficulty: 'Intermediate',
        category: 'Development',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: Code your Tools',
            content: 'Use the @modelcontextprotocol/sdk to define tools, resources, and prompts. This allows your internal systems to talk directly to Claude.',
            interactiveType: 'none'
          },
          {
            id: 'guide-custom-tools',
            title: 'Deep Dive: Building with MCP SDK',
            content: 'A hands-on guide to defining and registering your own TypeScript-based MCP tools.',
            interactiveType: 'guide',
            guideUrl: 'https://modelcontextprotocol.io/docs/concepts/tools',
            readingReferences: [
              { title: 'MCP TypeScript SDK', url: 'https://github.com/modelcontextprotocol/typescript-sdk' },
              { title: 'Tool Design Patterns', url: 'https://modelcontextprotocol.io/docs/concepts/tools#best-practices' }
            ]
          },
          {
            id: 'simulator-mcp-tools',
            title: 'Simulator: Schema Architect',
            content: 'Design instructions for your tools. Watch how making schemas too loose can lead to "Tool Misuse" while strict typing ensures predictable results.',
            interactiveType: 'simulator',
            simulatorConfig: {
              type: 'mcp-security',
              data: {}
            }
          }
        ]
      },
      {
        id: 'mcp-resources',
        title: 'MCP Resources: Beyond Tools',
        description: 'Providing static context and data streams to AI models.',
        points: 70,
        difficulty: 'Intermediate',
        category: 'Architecture',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: Living Data',
            content: 'Unlike Tools (which do things), Resources (which are things) allow you to expose logs, databases, or documentation as read-only streams. This lesson covers how to implement resource templates.',
            interactiveType: 'none'
          },
          {
            id: 'guide-resources',
            title: 'Deep Dive: MCP Resource Templates',
            content: 'Learn how to utilize URI schemes to provide dynamic, read-only data access for models.',
            interactiveType: 'guide',
            guideUrl: 'https://modelcontextprotocol.io/docs/concepts/resources',
            readingReferences: [
              { title: 'URI Schemes for AI', url: 'https://modelcontextprotocol.io/docs/concepts/resources#uri-templates' },
              { title: 'Streaming Large Resources', url: 'https://modelcontextprotocol.io/docs/concepts/resources#pagination' }
            ]
          },
          {
            id: 'simulator-mcp-resources',
            title: 'Simulator: Resource Streamer',
            content: 'Unlike tools, resources are read-only streams. Experience how "Logging Streams" provide real-time context to the model during an incident simulation.',
            interactiveType: 'simulator',
            simulatorConfig: {
              type: 'mcp-security',
              data: {}
            }
          }
        ]
      },
      {
        id: 'mcp-prompts',
        title: 'Prompt Templates via MCP',
        description: 'Standardizing agent personas and multi-step instructions.',
        points: 50,
        difficulty: 'Beginner',
        category: 'Workflow',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: Guided AI',
            content: 'MCP doesn\'t just provide data; it can provide the very instructions the model should follow. Learn how to centralize your "System Prompts" and standard operating procedures.',
            interactiveType: 'none'
          },
          {
            id: 'guide-prompts',
            title: 'Deep Dive: Standardizing Agent Personas',
            content: 'Managing complex system prompts and multi-turn instructions centrally via MCP.',
            interactiveType: 'guide',
            guideUrl: 'https://modelcontextprotocol.io/docs/concepts/prompts',
            readingReferences: [
              { title: 'The Art of the System Prompt', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/system-prompts' },
              { title: 'Template Substitution in LLMs', url: 'https://modelcontextprotocol.io/docs/concepts/prompts#arguments' }
            ]
          }
        ]
      },
      {
        id: 'mcp-cloud',
        title: 'Deploying MCP to the Cloud',
        description: 'Scalable infrastructure for agentic protocols.',
        points: 120,
        difficulty: 'Advanced',
        category: 'DevOps',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: Serverless MCP',
            content: 'Running local npx servers is great for dev, but production requires scaling. We explore deploying MCP servers as Docker containers or Cloud Run services.',
            interactiveType: 'none'
          },
          {
            id: 'guide-mcp-cloud',
            title: 'Deep Dive: Cloud Native MCP',
            content: 'Best practices for deploying MCP servers as microservices in production environments.',
            interactiveType: 'guide',
            guideUrl: 'https://modelcontextprotocol.io/docs/concepts/transports',
            readingReferences: [
              { title: 'SSE vs Stdio Transports', url: 'https://modelcontextprotocol.io/docs/concepts/transports#server-sent-events' },
              { title: 'Deploying MCP on Cloud Run', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/docker' }
            ]
          }
        ]
      },
      {
        id: 'mcp-monitoring',
        title: 'Monitoring and Debugging MCP',
        description: 'Observability for the Model Context Protocol.',
        points: 80,
        difficulty: 'Intermediate',
        category: 'Operations',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: Tracking Agent Calls',
            content: 'How do you know when a tool call fails or returns low-quality data? We discuss setting up OpenTelemetry for MCP and monitoring success rates of automated tool executions.',
            interactiveType: 'none'
          },
          {
            id: 'guide-monitoring',
            title: 'Deep Dive: Observability for Agents',
            content: 'Tracing tool execution and monitoring the quality of agent interactions at scale.',
            interactiveType: 'guide',
            guideUrl: 'https://modelcontextprotocol.io/docs/concepts/sampling',
            readingReferences: [
              { title: 'Tracing LLM Calls', url: 'https://www.arize.com/blog/monitor-llms' },
              { title: 'Success Metrics for Tools', url: 'https://www.datadoghq.com/blog/llm-application-monitoring/' }
            ]
          }
        ]
      },
      {
        id: 'mcp-ecosystem',
        title: 'The MCP Ecosystem',
        description: 'Expanding capabilities with open-source servers.',
        points: 40,
        difficulty: 'Beginner',
        category: 'Strategy',
        steps: [
          {
            id: 'writeup',
            title: 'Long-form: Build on Shoulders',
            content: 'The MCP community is growing. Learn how to leverage existing servers for GitHub, Slack, Postgres, and more to accelerate your AI adoption.',
            interactiveType: 'none'
          },
          {
            id: 'guide-ecosystem',
            title: 'Deep Dive: The Open-Source AI Layer',
            content: 'An exploration of the community-led servers that are powering the next wave of AI apps.',
            interactiveType: 'guide',
            guideUrl: 'https://github.com/modelcontextprotocol/servers',
            readingReferences: [
              { title: 'Joining the MCP Discord', url: 'https://discord.gg/anthropic' },
              { title: 'Contributing to MCP Servers', url: 'https://github.com/modelcontextprotocol/servers/blob/main/CONTRIBUTING.md' }
            ]
          }
        ]
      }
    ]
  }
];
