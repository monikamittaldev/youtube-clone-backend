
import dns from 'node:dns';
// Bypass local DNS SRV block (remove in production)
dns.setServers(['1.1.1.1', '8.8.8.8']);


import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Channel from "./models/channel.model.js";
import Video from "./models/video.model.js";

dotenv.config();

// ─────────────────────────────────────────────────────────────────────────────
// 25 verified YouTube URLs — each confirmed live via search results
// All use standard format: https://www.youtube.com/watch?v=VIDEO_ID
// react-player supports YouTube natively with no extra config needed
// ─────────────────────────────────────────────────────────────────────────────
const youtubeUrls = [
  // ── React (0, 1, 2) ──────────────────────────────────────────────────────
  "https://www.youtube.com/watch?v=SqcY0GlETPk", // React Tutorial – Programming with Mosh (2023)
  "https://www.youtube.com/watch?v=UWrSMWI8wbQ", // React Hooks Crash Course – Web Dev Simplified
  "https://www.youtube.com/watch?v=Ul3y1LXxzdU", // React Router v6 in 45 min – Web Dev Simplified

  // ── JavaScript (3, 4, 5) ─────────────────────────────────────────────────
  "https://www.youtube.com/watch?v=hdI2bqOjy3c", // JS Crash Course – Traversy Media
  "https://www.youtube.com/watch?v=IGoAdn-e5II", // Async Await JS – Traversy Media
  "https://www.youtube.com/watch?v=aHrvi2zTlaU", // JS Closures Tutorial – ColorCode

  // ── Node.js (6, 7, 8) ────────────────────────────────────────────────────
  "https://www.youtube.com/watch?v=p0-_ZGxl7jQ", // Node.js JWT Auth REST API
  "https://www.youtube.com/watch?v=CnH3kAXSrmU", // Express Crash Course 2024 – Traversy Media
  "https://www.youtube.com/watch?v=mbsmsi7l3r4", // JWT Auth Deep Dive – Web Dev Simplified

  // ── Database / MongoDB (9, 10) ────────────────────────────────────────────
  "https://www.youtube.com/watch?v=p934Gm7kj_Q", // MongoDB Aggregation Pipeline – 2025
  "https://www.youtube.com/watch?v=ofme2o29ngU", // MongoDB Crash Course – Web Dev Simplified

  // ── Python (11, 12) ──────────────────────────────────────────────────────
  "https://www.youtube.com/watch?v=_uQrJ0TkZlc", // Python Tutorial – Programming with Mosh
  "https://www.youtube.com/watch?v=8124kv-632k", // Python for Beginners – freeCodeCamp (2022)

  // ── CSS (13, 14) ─────────────────────────────────────────────────────────
  "https://www.youtube.com/watch?v=ft30zcMlFao", // Tailwind CSS Course – freeCodeCamp
  "https://www.youtube.com/watch?v=RSIclWvNTdQ", // CSS Grid vs Flexbox – Academind

  // ── DevOps (15, 16) ──────────────────────────────────────────────────────
  "https://www.youtube.com/watch?v=pg19Z8LL06w", // Docker Crash Course – TechWorld with Nana (2023)
  "https://www.youtube.com/watch?v=s_o8dwzRlu4", // Kubernetes Crash Course – TechWorld with Nana

  // ── Data Structures (17, 18) ─────────────────────────────────────────────
  "https://www.youtube.com/watch?v=t2CEgPsws3U", // DSA in JavaScript – freeCodeCamp
  "https://www.youtube.com/watch?v=s4DPM8ct1pI", // Binary Search – NeetCode

  // ── Web Development (19, 20, 21) ─────────────────────────────────────────
  "https://www.youtube.com/watch?v=4ofEbImyLdY", // Frontend Developer Roadmap 2024
  "https://www.youtube.com/watch?v=CvCiNeLnZ00", // MERN Stack Full Course – Dave Gray (8 hrs)
  "https://www.youtube.com/watch?v=i7twT3x5yv8", // System Design Interview – ByteByteGo

  // ── Gaming (22) ──────────────────────────────────────────────────────────
  "https://www.youtube.com/watch?v=xIZll-xRC6I", // GTA 6 Official Gameplay Trailer (2025)

  // ── Music / LoFi (23) ────────────────────────────────────────────────────
  "https://www.youtube.com/watch?v=BMNHnL2347U", // 24/7 Lofi Hip Hop Radio – Study/Relax

  // ── Sports (24) ──────────────────────────────────────────────────────────
  "https://www.youtube.com/watch?v=Vg9I8FyEgu0", // Top 5 Moments of IPL 2024
];

const getYoutubeUrl = (index) => youtubeUrls[index % youtubeUrls.length];

// ─── Users ────────────────────────────────────────────────────────────────────
const usersData = [
  {
    username: "monikadev",
    email: "monika@example.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Monika",
  },
  {
    username: "techguru",
    email: "techguru@example.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechGuru",
  },
  {
    username: "frontendpro",
    email: "frontend@example.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Frontend",
  },
  {
    username: "jsdaily",
    email: "jsdaily@example.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JavaScript",
  },
  {
    username: "pythonhub",
    email: "python@example.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Python",
  },
  {
    username: "devopshub",
    email: "devops@example.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DevOps",
  },
  {
    username: "gamingzone",
    email: "gaming@example.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gaming",
  },
  {
    username: "lofistudio",
    email: "lofi@example.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lofi",
  },
];

// ─── Channels ─────────────────────────────────────────────────────────────────
const channelsData = [
  {
    channelName: "Code With Monika",
    handle: "@codewithmonika",
    description: "React, MERN and Full Stack tutorials.",
    channelAvatar: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
  },
  {
    channelName: "Tech Guru",
    handle: "@techguru",
    description: "Programming and software engineering content.",
    channelAvatar: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
  },
  {
    channelName: "Frontend Mastery",
    handle: "@frontendmastery",
    description: "Frontend development tutorials.",
    channelAvatar: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935",
  },
  {
    channelName: "JavaScript Daily",
    handle: "@javascriptdaily",
    description: "Everything JavaScript.",
    channelAvatar: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
  },
  {
    channelName: "Python Hub",
    handle: "@pythonhub",
    description: "Python programming tutorials.",
    channelAvatar: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935",
  },
  {
    channelName: "DevOps Hub",
    handle: "@devopshub",
    description: "Docker, Kubernetes and Cloud.",
    channelAvatar: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
  },
  {
    channelName: "Gaming Zone",
    handle: "@gamingzone",
    description: "Gaming walkthroughs and reviews.",
    channelAvatar: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
  },
  {
    channelName: "LoFi Studio",
    handle: "@lofistudio",
    description: "Music for studying and coding.",
    channelAvatar: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
  },
];

// ─── Videos ───────────────────────────────────────────────────────────────────
// Each video has a urlIndex pointing to its category-matched YouTube URL above.
// Descriptions are 300–500 words, written in a real YouTube style.
const videosData = [
  // ── React ─────────────────────────────────────────────────────────────────
  {
    title: "React Hooks Crash Course",
    description: `If you've been working with React for a while, you've probably heard about Hooks — but do you actually understand what they do under the hood? In this crash course, we cut through the confusion and walk you through every essential React Hook with clear, practical examples that you can immediately apply to your own projects.

We start with the fundamentals: useState for managing local component state, and useEffect for handling side effects like data fetching, subscriptions, and DOM updates. From there, we level things up with useRef to access DOM nodes and persist values without triggering re-renders, useContext to share state globally without prop drilling, and useReducer for managing complex state logic in a clean, predictable way.

The real power comes when you start building your own Custom Hooks. We'll show you how to extract reusable logic from components and share it across your app — this is what separates beginner React developers from intermediate ones. By the end of this tutorial you'll also understand how Hooks relate to the React lifecycle and why they completely replaced class components in modern React development.

Each section includes a hands-on mini-project so you build muscle memory, not just theoretical knowledge. We also cover the rules of Hooks, common pitfalls that trip up new developers (especially with useEffect dependencies), and debugging tips using React DevTools.

Prerequisites: You should already be comfortable with JavaScript ES6+ and basic React components. If you know how to write a functional component with JSX, you're ready for this course.

All source code is available on GitHub — link in the description. Subscribe and hit the bell so you don't miss the follow-up video on advanced patterns with useCallback and useMemo. Let's dive in!`,
    category: "React",
    views: 125000,
    urlIndex: 0,
  },
  {
    title: "Build Netflix Clone Using React",
    description: `One of the best ways to master React is by building something you actually use every day — and it doesn't get more motivating than cloning Netflix. In this project-based tutorial, we'll build a fully functional Netflix UI from scratch using React, Firebase Authentication, and the TMDB (The Movie Database) API.

Here's what we'll build together: a hero banner that cycles through trending movies, dynamic horizontal rows for each genre, a working search feature, a login and signup flow powered by Firebase, and a "My List" feature that saves your favourite movies to Firestore. The final result is a production-quality app that you can proudly add to your portfolio.

We'll start by scaffolding the project with Create React App, setting up our Firebase project, and grabbing a free TMDB API key. From there we build component by component — Header, HeroBanner, MovieRow, MovieCard, and the modal detail view. You'll learn how to use the TMDB REST API, handle async data with useEffect and axios, manage authentication state with React Context, and style everything with CSS Modules for clean, scoped styles.

Along the way you'll pick up several real-world patterns: how to protect routes with an AuthRoute component, how to debounce a search input for performance, and how to handle loading and error states gracefully with skeleton screens.

By the end, you'll be able to explain component architecture, data flow, and auth integration in a React app — all the things interviewers love to ask about. Full source code is on GitHub. If you get stuck, drop a comment below and I'll get back to you within 24 hours. Don't forget to like and subscribe for more project-based React tutorials every week!`,
    category: "React",
    views: 220000,
    urlIndex: 1,
  },
  {
    title: "React Router Complete Guide",
    description: `Routing is one of the first real-world challenges you face when building a React app, and React Router v6 changed a lot of things from the version you might have learned before. In this complete guide, we start from zero and build a solid mental model of how routing works in React, then walk through every major feature of React Router v6 with hands-on examples.

We begin with the basics — setting up BrowserRouter, defining Routes and Route components, and linking between pages with the Link and NavLink components. Then we move into the more powerful features: dynamic segments with useParams, programmatic navigation with useNavigate, and reading query strings with useLocation and URLSearchParams. 

The second half of the video covers what most tutorials skip: nested routes using the Outlet component, layout routes that share a common header and sidebar, and protected routes that redirect unauthenticated users to the login page. We also cover route-level error boundaries and the new loader and action pattern that React Router v6.4+ introduced for data fetching.

To tie everything together, we build a small multi-page app with a home page, a dynamic user profile page, a settings page behind auth, and a proper 404 not-found page. You'll see each concept applied in a realistic context rather than in isolation.

By the end of this video you'll understand the full routing lifecycle in a React SPA, and you'll be able to confidently set up routing for any project. Source code is linked below. If you're following along with this series, the next video covers state management with Redux Toolkit — see you there!`,
    category: "React",
    views: 87000,
    urlIndex: 2,
  },

  // ── JavaScript ────────────────────────────────────────────────────────────
  {
    title: "JavaScript Interview Questions",
    description: `Getting a JavaScript developer job in 2025 means being prepared for questions that go way beyond "what is a variable." In this video I walk through the 50 most commonly asked JavaScript interview questions — the exact ones that come up at top tech companies — with detailed answers, code examples, and the thinking process a strong candidate uses to break them down.

We cover the foundational topics first: variable declarations with var, let, and const, hoisting and the temporal dead zone, type coercion and equality operators, and scope — global, function, and block. Then we move into the intermediate questions that separate junior from mid-level candidates: closures, the event loop and call stack, callback hell, and how promises chain together. I'll draw the event loop diagram that every interviewer draws on a whiteboard.

The advanced section covers what senior candidates need to know: prototypal inheritance and the prototype chain, this binding rules, arrow functions vs regular functions, memory management and garbage collection, and the module system. We also hit some common algorithm-style questions — debounce, throttle, deep clone, and flattening a nested array — that are popular in take-home assessments.

Every question comes with a "how to think about this" breakdown so you're not just memorising answers but learning to reason through problems live. I also include the follow-up questions interviewers often ask, so you're not caught off guard.

This video works whether you're prepping for your first frontend role or brushing up before switching jobs. Timestamps are in the description. Download the free cheat sheet PDF using the link below. Good luck with your interviews!`,
    category: "JavaScript",
    views: 180000,
    urlIndex: 3,
  },
  {
    title: "Async Await Explained",
    description: `If asynchronous JavaScript still feels like magic — or worse, like a mystery you're afraid to break — this video is for you. We're going to demystify the entire async model of JavaScript, from the ground up, step by step, with real examples you'll actually use.

We start with the reason asynchronous code exists: JavaScript is single-threaded and non-blocking, which means it can't stop and wait. Understanding the call stack, the Web APIs layer, the callback queue, and the event loop is the foundation everything else rests on — we'll go through all of it with a clear visual diagram.

From there we trace the historical path: callbacks, then callback hell and why it's a problem, then Promises and how .then() and .catch() make the code more readable and composable. We cover Promise.all() for parallel requests, Promise.race() for the first result, and Promise.allSettled() for when you need all results regardless of outcome.

Then we introduce async/await — syntactic sugar on top of Promises that makes async code look and read like synchronous code. We cover the try/catch/finally pattern for error handling, how to fetch data from a real API with the Fetch API, and common mistakes like forgetting to await or creating accidental waterfalls of sequential requests when parallel would be faster.

We wrap up with three real-world mini projects: a weather app API call, a GitHub user profile fetcher, and a sequential vs parallel fetch comparison that shows you exactly when to use Promise.all. By the end you'll finally feel confident writing async code. Source code on GitHub, link below!`,
    category: "JavaScript",
    views: 140000,
    urlIndex: 4,
  },
  {
    title: "Closures in JavaScript",
    description: `Closures are one of those JavaScript concepts that sound scary but click instantly once you see the right explanation. In this video, I'll give you that explanation — along with the practical examples and edge cases you actually need to know, including the ones that show up in interviews.

A closure is simply a function that remembers the variables from its outer scope even after that outer function has finished executing. We'll start by building an intuition for lexical scope — the idea that where you write a function determines what variables it can access — before showing closures emerging naturally from that rule.

From there we build up complexity gradually. We start with basic examples — a counter factory function, a greeting generator — and make sure the mental model is solid before moving on. Then we tackle the classic closure-in-a-loop bug: why all your click handlers fire with the same value, and three ways to fix it (var vs let, IIFE, and factory functions).

The second half of the video is all about practical use cases. Closures are the mechanism behind memoization for caching expensive function results, the module pattern for data privacy before ES6 modules, currying and partial application for functional programming, and — as a React developer — the way hooks like useState and useCallback capture values from render cycles.

We finish with a handful of interview questions that rely on closures: "what does this log?", "fix the bug", and "implement a memoize function from scratch." By the time we're done you'll not only understand closures — you'll be able to reach for them when they're the right tool. All code examples available on GitHub, link in the description.`,
    category: "JavaScript",
    views: 95000,
    urlIndex: 5,
  },

  // ── Node.js ───────────────────────────────────────────────────────────────
  {
    title: "Node.js Authentication Tutorial",
    description: `Authentication is one of the most important and most commonly misunderstood parts of building a backend — and in this tutorial we build it properly from the ground up using Node.js, Express, MongoDB, JWT, and bcrypt. By the end you'll have a production-ready auth system you can drop into any project.

We start with the database: a Mongoose User model with a hashed password field. We use bcryptjs to hash passwords before saving them — storing plain passwords is a serious security mistake, and we'll explain exactly why and how hashing prevents it even if your database is compromised.

Next we build the register and login routes. On register, we validate the request body, check if the email is already taken, hash the password, and save the user. On login, we find the user by email, compare the submitted password against the stored hash with bcrypt.compare, and if it matches, we issue a JWT access token.

The JWT section is where things get interesting. We cover what JWTs are (header + payload + signature), how to sign them with a secret key, how to set expiry times, and how to verify them in middleware. We build an auth middleware function that reads the token from the Authorization header, verifies it, attaches the user to the request, and lets the handler run — or returns a 401 if the token is invalid or missing.

We also cover the refresh token pattern for keeping users logged in without long-lived access tokens, storing refresh tokens in the database, and rotating them on each use. This is the production pattern that large apps use, and we implement it cleanly. Source code on GitHub.`,
    category: "Node.js",
    views: 110000,
    urlIndex: 6,
  },
  {
    title: "Express.js Crash Course",
    description: `Express.js is the most popular Node.js framework in the world, and in this crash course you'll go from zero to building a fully working REST API in about an hour. No fluff — just the fundamentals you need to start building real backends.

We kick things off by explaining what Express actually does: it wraps Node's built-in http module and adds routing, middleware, and a cleaner API for handling requests and responses. Then we scaffold our first Express server, run it with nodemon, and make our first GET request return a JSON response — that satisfying moment when things just work.

Routing is the core of any Express app. We cover route methods (GET, POST, PUT, DELETE), route parameters (/users/:id), query strings (?search=name), and how to group related routes using the Router class and separate route files. We also talk about best practices for RESTful API design — naming conventions, status codes, and when to use which HTTP method.

Middleware is what makes Express powerful. We walk through built-in middleware (express.json(), express.static()), popular third-party packages (morgan for logging, cors for cross-origin requests, helmet for security headers), and how to write your own custom middleware for tasks like authentication, request logging, and input validation.

We finish by connecting to MongoDB with Mongoose and building a complete CRUD API for a simple resource — create, read (all and by ID), update, and delete — with proper error handling at every step using a global error handling middleware. By the end you'll have a solid Express foundation to build on. Source code is on GitHub.`,
    category: "Node.js",
    views: 76000,
    urlIndex: 7,
  },
  {
    title: "JWT Authentication Deep Dive",
    description: `You've probably used JWTs before — but do you actually understand how they work, where they should be stored, and what the most common security mistakes are? In this deep dive we go well beyond "just sign a token and send it" and look at JWT authentication the way a security-conscious engineer would.

We start with the structure of a JWT: the header (algorithm and type), the payload (your claims and expiry), and the signature (the part that prevents tampering). We decode a real token and explain exactly what each field means and why the signature makes JWTs trustworthy without needing to hit the database on every request.

Then we cover the access token and refresh token pattern in depth. Access tokens are short-lived (15 minutes to 1 hour) and travel in the Authorization header. Refresh tokens are long-lived, stored securely, and used only to request new access tokens. We implement this full pattern — including token rotation, where each use of a refresh token issues a new one and invalidates the old one, limiting the blast radius if a token is stolen.

The security section is where most tutorials fall short. We compare storing tokens in localStorage (vulnerable to XSS) vs HttpOnly cookies (vulnerable to CSRF, but easier to protect). We show how to implement CSRF tokens, why the SameSite cookie attribute matters, and how to build a token blacklist (using Redis) for proper logout functionality.

We wrap up with the most common JWT vulnerabilities: the "alg: none" attack, weak secrets, and over-trusting the payload without verifying the signature. If you're building authentication for a real app, this video will save you from serious mistakes.`,
    category: "Node.js",
    views: 69000,
    urlIndex: 8,
  },

  // ── Database ──────────────────────────────────────────────────────────────
  {
    title: "MongoDB Aggregation Pipeline",
    description: `If you're only using MongoDB for basic CRUD — find, insert, update, delete — you're missing the most powerful thing it can do. The Aggregation Pipeline lets you transform, group, filter, and analyse your data entirely within MongoDB, without pulling everything into your application layer. In this tutorial, we go from zero to building real analytical queries.

We start with the core concept: a pipeline is a sequence of stages, and each stage transforms the documents passing through it. We cover the essential stages you'll use in almost every pipeline: $match to filter documents (like a WHERE clause), $group to aggregate values (like GROUP BY), $project to reshape documents and compute new fields, and $sort and $limit to control output order and size.

From there we move into the more powerful stages. $lookup lets you perform the equivalent of a SQL JOIN between two collections — we use it to join videos with their channel data and comment counts. $unwind deconstructs array fields so you can work with individual array elements as separate documents. $addFields lets you compute derived values without having to fetch and process data in application code.

The second half of the video is entirely practical: we build real queries against a YouTube-style dataset. We calculate the top 5 most-viewed channels, find the average views per category, build a user engagement score, and create a paginated list of videos sorted by a weighted popularity formula. Each query builds on the last, showing how to compose stages together.

We finish with performance tips: indexing for aggregation, using $match early to reduce documents, and using explain() to inspect your pipeline's execution plan. All sample data and queries are on GitHub.`,
    category: "Database",
    views: 85000,
    urlIndex: 9,
  },
  {
    title: "MongoDB Atlas Setup",
    description: `If you've been running MongoDB locally for development but haven't deployed to the cloud yet, this tutorial is for you. MongoDB Atlas is the official cloud database for MongoDB — it's free to start, incredibly easy to set up, and it's what the vast majority of production Node.js applications use. Let's get you up and running in under 30 minutes.

We start by creating a free Atlas account and setting up your first M0 cluster — the free tier gives you 512MB of storage which is plenty for learning and small side projects. We walk through every Atlas dashboard setting that matters: choosing a cloud provider and region close to your users, configuring network access (IP allowlist vs. allowing all IPs for development), and creating a database user with a strong password.

The most important step is getting your connection string right. We show you exactly how to find it in the Atlas UI, what each part of the connection string means, and how to store it securely in a .env file so it never ends up in your GitHub repository. We then connect to the cluster from a Node.js and Mongoose application and verify the connection is working.

Next we take a tour of the Atlas Data Explorer — a GUI for browsing your collections, running queries, and inserting documents without writing any code. It's genuinely useful for debugging and exploring your data during development. We also show you Atlas Search (full-text search), the built-in Performance Advisor that recommends missing indexes, and how to set up automated daily backups.

By the end, you'll have a production-ready MongoDB setup in the cloud that you can connect to from anywhere. No more "it works on my machine" database problems.`,
    category: "Database",
    views: 45000,
    urlIndex: 10,
  },

  // ── Python ────────────────────────────────────────────────────────────────
  {
    title: "Python Full Course",
    description: `Whether you've never written a line of code in your life or you're coming from another language, this Python course will take you from complete beginner to confident Python developer. Python is the most popular programming language in the world right now — used in web development, data science, machine learning, automation, scripting, and more. And one of the main reasons is how clean and readable it is to learn.

We start right from the basics: installing Python and setting up VS Code, understanding variables and data types (strings, integers, floats, booleans), and writing your first programme. From there we cover all the core language features: string methods and formatting, lists, tuples, sets, and dictionaries, conditionals with if/elif/else, and all the loop patterns you need — for loops, while loops, break, continue, and list comprehensions.

Functions are where Python really shines. We cover defining functions, return values, default arguments, *args and **kwargs for flexible parameter lists, and scope. We then move into Object-Oriented Programming: classes, constructors, instance methods, inheritance, and the special dunder methods like __str__ and __repr__ that make Python feel magical.

The practical section covers file handling (reading and writing text files and CSVs), exception handling with try/except/finally, working with external packages using pip, and an introduction to the Python standard library. We finish with three mini-projects that tie everything together: a command-line calculator, a simple contact book with file persistence, and a number guessing game. By the end of this course, Python will feel natural. All code on GitHub.`,
    category: "Python",
    views: 550000,
    urlIndex: 11,
  },
  {
    title: "Python Automation Project",
    description: `Stop doing repetitive tasks by hand. Python is one of the best tools on the planet for automation, and in this video we build ten real automation scripts that you can start using immediately — no advanced Python knowledge required.

Project 1: Bulk File Renamer. We use the os and pathlib modules to rename hundreds of files at once based on patterns — perfect for organizing photos, downloads, or project files. Project 2: Automated Email Sender. Using Python's built-in smtplib and email libraries, we send formatted emails with attachments on a schedule — great for sending daily reports.

Project 3: Web Scraper. We use requests and BeautifulSoup to extract data from websites — product prices, news headlines, job listings — and save them to a CSV. We also cover how to handle pagination and basic anti-scraping measures. Project 4: Excel Automation. Using openpyxl, we read data from spreadsheets, apply formulas, format cells, and generate charts — all without opening Excel.

Project 5: PDF Merger and Splitter. We use PyPDF2 to combine multiple PDFs into one and split large PDFs by page range. Project 6: WhatsApp Message Scheduler. Using pywhatkit, we schedule messages to be sent automatically. Project 7: Screenshot and OCR. We capture screenshots with Pillow and extract text from images using pytesseract — useful for automating data entry from scanned documents.

Projects 8-10 cover a password generator with clipboard copy, a news aggregator that emails you daily headlines, and a file organizer that automatically sorts your Downloads folder into subdirectories by file type. Every script is beginner-friendly and fully commented. All code is on GitHub.`,
    category: "Python",
    views: 160000,
    urlIndex: 12,
  },

  // ── CSS ───────────────────────────────────────────────────────────────────
  {
    title: "Tailwind CSS Complete Guide",
    description: `Tailwind CSS has taken over the frontend world — and once you understand how it works, you'll understand why. The utility-first approach feels weird for the first hour and then you never want to write traditional CSS again. This complete guide takes you from installation to building a polished, production-ready website.

We start with the philosophy: instead of writing custom CSS classes, you compose designs directly in your HTML using small, single-purpose utility classes. We set up Tailwind with Vite (the fastest setup), configure the content paths so unused styles are purged in production, and make our first styled component in under five minutes.

The fundamentals section covers the layout utilities — flexbox and grid via Tailwind's responsive prefixes (sm:, md:, lg:, xl:), spacing (margin and padding with the consistent scale), sizing (width, height, max-width), and typography (font size, weight, line height, letter spacing). We also cover the colour system, borders, shadows, and opacity utilities.

The responsive design section shows how Tailwind's mobile-first breakpoint system makes building responsive layouts dramatically easier than writing media queries by hand. We build a card component that changes from a stacked mobile layout to a side-by-side desktop layout with just a few class changes.

Then we cover dark mode using the class strategy, custom configuration to extend the default theme with your brand colours and fonts, and the @apply directive for when you genuinely need to extract reusable components. We finish by building a complete SaaS landing page — hero section, feature grid, pricing cards, and footer — from scratch. All source code on GitHub.`,
    category: "CSS",
    views: 175000,
    urlIndex: 13,
  },
  {
    title: "CSS Grid vs Flexbox",
    description: `"Should I use Grid or Flexbox?" is one of the most common questions from developers learning CSS layout — and the answer is more nuanced than most tutorials suggest. In this video we settle the debate once and for all with real examples, clear rules of thumb, and ten layout challenges solved with both approaches so you can see exactly when each one shines.

We start by establishing the core difference: Flexbox is a one-dimensional layout system — it works along a single axis, either a row or a column. CSS Grid is a two-dimensional system — it works in both rows and columns simultaneously. That distinction drives almost every decision about which to reach for.

The Flexbox deep-dive covers the container properties (display: flex, flex-direction, flex-wrap, justify-content, align-items, align-content, gap) and the item properties (flex-grow, flex-shrink, flex-basis, the shorthand flex property, order, and align-self). We build common Flexbox patterns: a navigation bar, a card with a footer pinned to the bottom, and a centred hero section.

The CSS Grid section covers grid-template-columns and rows (including fr units and repeat()), the auto-fill and auto-fit patterns for responsive grids without media queries, grid-area for named template placement, and the gap shorthand. We build a magazine-style editorial layout that would be extremely painful with Flexbox alone.

The comparison section tackles ten real layouts — app shell, pricing cards, image gallery, dashboard sidebar — and shows which approach wins and why. The conclusion: use Flexbox for component-level layout and Grid for page-level layout. And use them together — they're complementary, not competing.`,
    category: "CSS",
    views: 93000,
    urlIndex: 14,
  },

  // ── DevOps ────────────────────────────────────────────────────────────────
  {
    title: "Docker For Beginners",
    description: `Docker completely changed the way software is built, shipped, and run — and if you haven't learned it yet, this is the tutorial that will make it click. We start from absolute zero: no prior Docker or DevOps knowledge required. By the end, you'll be containerising your own applications and using Docker Compose to run multi-service stacks.

First, we answer the fundamental question: what problem does Docker solve? Before containers, running an application meant managing dependencies, environment variables, OS-specific quirks, and "works on my machine" headaches. Docker packages everything an application needs — code, runtime, libraries, configuration — into a single portable unit called a container. We run a container for the first time with a single command and the concept instantly makes sense.

Images and containers are the core concepts. An image is a read-only blueprint; a container is a running instance of that image. We pull images from Docker Hub, explore them with docker inspect, and run containers with useful flags: port mapping (-p), environment variables (-e), detached mode (-d), and naming (--name). We also cover how to clean up containers and images.

Writing a Dockerfile is where real power comes in. We containerise a Node.js application step by step: choosing a base image, setting the working directory, copying files, installing dependencies with npm ci, exposing a port, and defining the startup command. We also cover multi-stage builds for smaller production images.

Volumes solve the data persistence problem — we show how to mount host directories and named volumes so your data survives container restarts. Docker Compose is the final piece: a single YAML file that defines and starts a Node.js API, MongoDB, and Redis together with one command. This is how real development environments work.`,
    category: "DevOps",
    views: 130000,
    urlIndex: 15,
  },
  {
    title: "Kubernetes Explained",
    description: `Kubernetes is the industry standard for running containerised applications at scale — and for good reason. Once you understand it, you'll see why every major tech company runs on it. In this beginner-friendly crash course, we explain every core Kubernetes concept with clear diagrams and a live demo app running on Minikube.

We start with the why: you have a Docker container running your app. Great. But what happens when it crashes? How do you run multiple copies for reliability? How do you update it without downtime? How do you balance traffic across instances? Kubernetes answers all of these questions, and we frame every concept in terms of the problem it solves.

The architecture section covers Clusters (the overall system), Nodes (the servers that run your workloads — either Control Plane nodes that manage everything or Worker nodes that run your apps), and Pods (the smallest deployable unit — one or more containers that run together and share a network and storage).

Above Pods, we have Deployments — the most common way to run apps — which manage a ReplicaSet that ensures the desired number of Pod replicas are always running. If a Pod crashes, the Deployment creates a new one automatically. We cover Deployment YAML configuration, rolling updates for zero-downtime releases, and rollbacks when a deployment goes wrong.

Services expose your Pods to network traffic. We explain the three main types: ClusterIP (internal only), NodePort (accessible on each node's IP), and LoadBalancer (provisions a cloud load balancer). We also cover ConfigMaps and Secrets for configuration management, Namespaces for organising workloads, and the essential kubectl commands you'll use every day. Final demo: deploying a full-stack app to a local Kubernetes cluster.`,
    category: "DevOps",
    views: 97000,
    urlIndex: 16,
  },

  // ── Data Structures ───────────────────────────────────────────────────────
  {
    title: "DSA Roadmap 2026",
    description: `Data Structures and Algorithms — DSA — is the skill that separates developers who get called back for technical interviews from those who don't. Whether your goal is to land a role at a top company or simply write better code, this roadmap gives you the clearest path from beginner to interview-ready in 2026.

We start with the fundamentals that everything else builds on: Big O notation and how to analyse time and space complexity. Understanding that a nested loop is O(n²) and a hash map lookup is O(1) is the foundation of making smart algorithmic decisions. We cover the notation, build intuition with examples, and practice simplifying complex expressions.

The core data structures section covers Arrays and Strings (the foundation), Linked Lists (singly and doubly, with all the pointer manipulation patterns), Stacks and Queues (and their monotonic variants), Hash Maps and Sets (the most useful data structure in interviews), Trees (Binary Trees, Binary Search Trees, and Tries), Heaps and Priority Queues, and Graphs (adjacency lists, BFS, DFS, and Dijkstra's algorithm for shortest paths).

For algorithms, we cover Two Pointers and Sliding Window for array/string problems, Binary Search and its variants, Merge Sort and Quick Sort, Dynamic Programming (top-down with memoization and bottom-up with tabulation), Backtracking, and Greedy Algorithms. Each topic comes with a recommended problem list on LeetCode, ordered from easy to hard.

The final section gives you a study plan: how many problems per week, how to approach a problem you've never seen, how to communicate your thinking in an interview, and what "good enough" looks like for different company tiers. Save this video — it's your complete reference for DSA in 2026.`,
    category: "Data Structures",
    views: 260000,
    urlIndex: 17,
  },
  {
    title: "Binary Search Masterclass",
    description: `Binary search is one of those algorithms that looks simple on the surface — "just check the middle, go left or right" — but actually has a dozen subtle patterns that appear across hundreds of interview problems. If you've ever gotten a binary search problem in an interview and blanked despite knowing the concept, this masterclass is exactly what you need.

We start with the classic binary search: searching for a target value in a sorted array. We go through the standard template line by line, explain the off-by-one errors that trip everyone up (lo + hi / 2 vs lo + (hi - lo) / 2, `<` vs `<=` in the while condition, lo = mid + 1 vs lo = mid), and build up a template you can rely on without thinking.

Then we go into the real patterns. Left boundary search: find the first index where a condition is true. Right boundary search: find the last index. These two patterns handle a huge number of LeetCode problems that look unrelated on the surface. We solve LeetCode #35 (Search Insert Position), #34 (Find First and Last Position), and #153 (Minimum in Rotated Sorted Array) to cement the patterns.

The most powerful insight is binary search on the answer — problems where you don't search an array but search the answer space. We solve the Koko Eating Bananas problem (#875) and Ship Within D Days (#1011) to show this pattern in action. Once you see it, you'll recognise it everywhere.

The final section covers 2D matrix binary search (#74), finding the peak element (#162), and a template comparison so you know exactly which variant to reach for. We close with a 5-minute review of all patterns with visual diagrams. Code on GitHub.`,
    category: "Data Structures",
    views: 135000,
    urlIndex: 18,
  },

  // ── Web Development ───────────────────────────────────────────────────────
  {
    title: "Frontend Developer Roadmap",
    description: `If you want to become a frontend developer but you're not sure where to start or what to learn next, this video lays out the complete, honest roadmap for 2024 and beyond. We cover every skill, every tool, and every technology — in the order you should learn them — so you can stop feeling overwhelmed and start making real progress.

We start where everyone should: the fundamentals. HTML5 semantics and accessibility aren't glamorous, but writing clean, accessible markup is what separates professional developers from beginners. Then CSS — not just basic styling but flexbox, grid, responsive design, animations, and CSS custom properties. These two skills alone will get you building real pages.

JavaScript is the big one. We go through the learning path from basic syntax and DOM manipulation to ES6+ features, async/await, and the Fetch API. We also cover the learning curve honestly — JavaScript takes time, and that's normal. We recommend resources at each level.

From there: version control with Git and GitHub is non-negotiable, and we cover the workflow every dev team uses. Then React — still the dominant frontend framework in 2024 — including the ecosystem: React Router, React Query for data fetching, and either Redux Toolkit or Zustand for state management. We also discuss when TypeScript is worth adding and how to learn it without getting overwhelmed.

The tooling section covers Vite (the modern build tool), npm/yarn, linting with ESLint, formatting with Prettier, and basic testing with Vitest and React Testing Library. We finish with deployment: Netlify, Vercel, GitHub Pages — getting your projects live in minutes. The last five minutes cover portfolio advice and how to actually land your first frontend job.`,
    category: "Web Development",
    views: 620000,
    urlIndex: 19,
  },
  {
    title: "Build MERN Stack App",
    description: `The MERN stack — MongoDB, Express, React, Node.js — is one of the most popular full-stack combinations in the industry, and this 8-hour course walks you through building a complete, deployable application from scratch. We build a full-stack task management app with user authentication, CRUD operations, dark mode, and deployment to production.

The backend section starts with setting up our Node.js and Express project, connecting to MongoDB Atlas with Mongoose, and defining our data models: a User model with hashed passwords and a Task model with validation. We build out the auth routes (register, login, logout) using JWT and bcryptjs, then protect the task routes with an auth middleware. Every route includes proper error handling and validation.

The frontend section uses React 18 with Vite for a fast development experience and Tailwind CSS for styling. We build the component tree from the top down: the App shell, authentication context, login and register forms with client-side validation, and the dashboard layout. React Query handles all data fetching, caching, and synchronisation with the backend — no useEffect soup.

State management uses Zustand for its simplicity — we create a theme store for dark mode and a user store for auth state. React Router v6 handles navigation, with protected routes that redirect to login when the user isn't authenticated. We also add optimistic updates for the task completion toggle so the UI feels instant.

Deployment is the final chapter: the Express backend goes to Render (free tier), the React frontend goes to Netlify. We set up environment variables, configure CORS correctly for the production domain, and verify the full stack is working end to end. Complete source code on GitHub with separate frontend and backend repositories.`,
    category: "Web Development",
    views: 190000,
    urlIndex: 20,
  },
  {
    title: "System Design Basics",
    description: `System design is the skill that unlocks senior engineer roles — and it's more learnable than most people think. In this beginner-friendly introduction, we cover the core concepts of distributed systems design and walk through the architecture of three systems you use every day: a URL shortener, Twitter, and YouTube. No prior experience with system design required.

We start with the vocabulary. What is scalability? Vertical scaling means adding more resources to a single server. Horizontal scaling means adding more servers and distributing the load. Load balancers sit in front of your servers and route requests so no single server gets overwhelmed. We cover round-robin, least connections, and hash-based routing strategies.

Caching is one of the most powerful techniques in system design. We explain the different layers: CDN caching for static assets at the network edge, in-memory caching with Redis for frequently accessed data, and database query caches. Cache invalidation strategies — time-to-live, write-through, write-behind — are where the nuance lives, and we explain each one.

The database section covers the SQL vs NoSQL trade-off with concrete examples, read replicas for scaling reads, database sharding for scaling writes, and when to use each. We also introduce message queues (Kafka, RabbitMQ) for decoupling services and handling traffic spikes asynchronously.

For each system design case study — URL shortener, Twitter feeds, YouTube video storage and streaming — we go through a structured approach: gather requirements, estimate scale, design the high-level architecture, identify bottlenecks, and add components to resolve them. This structured approach is exactly what interviewers expect. Download the free System Design cheat sheet — link in description.`,
    category: "Web Development",
    views: 300000,
    urlIndex: 21,
  },

  // ── Gaming ────────────────────────────────────────────────────────────────
  {
    title: "GTA 6 Gameplay Review",
    description: `GTA 6 is finally here — and we've played it. In this spoiler-free review, we cover everything you need to know before buying: graphics, performance, open world feel, story setup, and whether it actually lives up to twelve years of hype. Short answer: it does. Longer answer: watch the video.

Rockstar's new RAGE engine is doing things that genuinely made us stop and stare. The lighting in Vice City at golden hour, the way NPCs react to what you're wearing, the sheer density of the world — it's a generational leap from GTA V. On PS5 we're getting a locked 30fps in Fidelity mode and a very playable 60fps in Performance mode with some visual trade-offs. We cover exactly what those trade-offs are so you can choose the mode that suits you.

The open world is centred on Leonida — a sprawling fictional take on Miami and the Florida Everglades — and it is enormous. In our first three hours we barely scratched the surface: the Art Deco beachfront, the swamplands, the strip malls, the suburbs. Every environment feels lived-in and reactive in a way that GTA V never quite managed.

The dual-protagonist story opens with Lucia and Jason — a couple with a complicated history and an immediate chemistry — and the tone is darker and more grounded than GTA V's trio. The writing is noticeably sharper, and the heist setup in the opening hours already has us genuinely invested in where the story is going.

Driving handles better than any GTA before it, shooting is more responsive than Red Dead 2, and the wanted system has been overhauled to feel fair and challenging simultaneously. If you were on the fence: buy it. This is the game.`,
    category: "Gaming",
    views: 2100000,
    urlIndex: 22,
  },

  // ── Music ─────────────────────────────────────────────────────────────────
  {
    title: "LoFi Coding Mix",
    description: `Welcome to the LoFi Studio — your 24/7 home for chill lofi hip hop beats designed specifically for the hours when you need to focus, study, or just slow down. Whether you're deep in a coding session at midnight, grinding through coursework, working from home, or just looking for something to replace the silence, this is your channel.

Lofi hip hop works for focus sessions in a way that most music doesn't. The tempos are slow and consistent, usually between 70 and 90 BPM — just fast enough to feel alive, slow enough to fade into the background. The harmonic language is warm and unresolved: jazz chords, minor sevenths, flat nines that sit comfortably without demanding your attention. The lo-fi production aesthetic — vinyl crackle, tape hiss, muffled highs — creates a sense of comfortable distance that researchers increasingly recognise as conducive to sustained attention.

This mix runs continuously, updated regularly with new tracks from lofi producers around the world. We work with independent artists exclusively — no major label placements, no advertising-friendly background filler. Every track is selected by ear for texture, warmth, and consistency of mood. If you hear something you love, the artist name appears in the bottom corner every time a new track begins.

This is a no-ads channel. We believe that interrupting your focus session with a pre-roll ad defeats the entire purpose. The channel is supported by the community — if you'd like to support what we do, the link is in the description. Otherwise, just hit play, minimize the window, and get to work.

Subscribe and turn on notifications for new mixes every Friday. If you have a favourite lofi artist you'd like to hear featured, drop their name in the comments — we read every suggestion.`,
    category: "Music",
    views: 1800000,
    urlIndex: 23,
  },

  // ── Sports ────────────────────────────────────────────────────────────────
  {
    title: "IPL Highlights",
    description: `IPL 2024 was one of the most dramatic, high-scoring, and unpredictable seasons in the tournament's history — and in this video we count down the top moments that defined the competition, from the first ball of the tournament to the final over of the last match.

The batting records fell early and they fell hard. Sunrisers Hyderabad put on three 250-plus totals in the group stage, redefining what was possible in a T20 innings. Travis Head and Abhishek Sharma became the most feared opening pair in the competition, and their partnerships had opposing coaches in genuine tactical distress. We cover every milestone six, every boundary record, and the statistical context that makes the numbers even more jaw-dropping.

But IPL 2024 wasn't just about batting — the bowling was extraordinary too. Jasprit Bumrah's death-over performances were a masterclass in pressure cricket. We break down his mechanics, his variations, and the specific deliveries that won matches. The young spinners from multiple franchises showed that IPL is still one of the best development environments for wrist spinners in the world.

The knockout stage delivered everything you could ask for: a Qualifier 1 that went to the final over, a Qualifier 2 with a dramatic middle-order collapse and recovery, and a final that had the crowd on their feet from ball one. We cover every pivotal moment with the broadcast footage, the player reactions, and the tactical context that explains why certain decisions were made at crunch time.

Whether you watched every game live or just want to catch up on the season's best, this is your complete highlights package. Subscribe for IPL 2025 content starting next month.`,
    category: "Sports",
    views: 640000,
    urlIndex: 24,
  },
];

// ─── Seed Function ─────────────────────────────────────────────────────────────
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    await User.deleteMany({});
    await Channel.deleteMany({});
    await Video.deleteMany({});
    console.log("🗑️  Existing data removed");

    const users = [];
    for (const userData of usersData) {
      const user = await User.create(userData);
      users.push(user);
    }
    console.log(`👤 ${users.length} users created`);

    const channels = [];
    for (let i = 0; i < channelsData.length; i++) {
      const channel = await Channel.create({
        ...channelsData[i],
        owner: users[i]._id,
        channelBanner: `https://picsum.photos/seed/banner${i}/1200/300`,
      });
      channels.push(channel);
      await User.findByIdAndUpdate(users[i]._id, { channel: channel._id });
    }
    console.log(`📺 ${channels.length} channels created`);

    const createdVideos = [];
    for (let i = 0; i < videosData.length; i++) {
      const channelIndex = i % channels.length;
      const channel = channels[channelIndex];
      const owner = users[channelIndex];
      const data = videosData[i];

      const video = await Video.create({
        title: data.title,
        description: data.description,
        thumbnailUrl: `https://picsum.photos/seed/video${i}/1280/720`,
        videoUrl: getYoutubeUrl(data.urlIndex),
        channelId: channel._id,
        uploader: owner._id,
        uploaderName: channel.channelName,
        category: data.category,
        views: data.views,
      });

      createdVideos.push(video);

      await Channel.findByIdAndUpdate(channel._id, {
        $push: { videos: video._id },
      });
    }
    console.log(`🎬 ${createdVideos.length} videos created`);

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Seed completed successfully");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Test Login:");
    console.log("Email: monika@example.com");
    console.log("Password: password123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seedDB();