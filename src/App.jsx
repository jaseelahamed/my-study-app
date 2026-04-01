import React, { useState, useEffect, useMemo, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";
import {
  Search,
  Plus,
  Trash2,
  Moon,
  Sun,
  Database,
  User,
  Loader2,
  BookOpen,
  Sparkles,
  Trophy,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Code2,
  Play,
  RotateCcw,
  Terminal,
  Edit3,
} from "lucide-react";

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = firebaseConfig.projectId;

const initialData = [];
/*
// const initialData = [
//   { id: 1, cat: "JS", q: "How do you check if a number is even?", a: "Use the modulo operator: num % 2 === 0", practical: true, starter: "function isEven(num) {\n  // Write your code here\n}\n\nconsole.log(isEven(4));" },
//   { id: 2, cat: "JS", q: "Variables and Identifiers", a: "Variables store data; Identifiers are names." },
//   { id: 3, cat: "JS", q: "Map and ForEach", a: "map() returns a new array; forEach() returns undefined.", practical: true, starter: "const nums = [1, 2, 3];\n// Use map to double the numbers\nconst doubled = nums.map(n => n * 2);\nconsole.log(doubled);" },
//   { id: 4, cat: "JS", q: "Reverse a String", a: "Split, reverse, and join.", practical: true, starter: "function reverseStr(str) {\n  return str.split('').reverse().join('');\n}\nconsole.log(reverseStr('hello'));" },
//   { id: 5, cat: "JS", q: "Optional Chaining", a: "obj?.prop" },
//   { id: 6, cat: "JS", q: "Filter an Array", a: "arr.filter()", practical: true, starter: "const users = [{age: 20}, {age: 15}, {age: 25}];\n// Filter users older than 18\nconsole.log(users.filter(u => u.age > 18));" }
// ];
const initialData = [
  // JAVASCRIPT (1-98)
  {
    id: 1,
    cat: "JS",
    q: "Introduction to JavaScript",
    a: "High-level, interpreted, multi-paradigm language that is the backbone of web interactivity.",
  },
  {
    id: 2,
    cat: "JS",
    q: "Variables and Identifiers",
    a: "Variables store data; Identifiers are the unique names given to them (must follow naming rules).",
  },
  {
    id: 3,
    cat: "JS",
    q: "Keywords in JavaScript",
    a: "Reserved words (like 'let', 'class', 'await') that cannot be used as variable names.",
  },
  {
    id: 4,
    cat: "JS",
    q: "Operators (Unary, Bitwise, etc.)",
    a: "Tools for data manipulation. Unary takes one operand (++); Bitwise works on binary bits (&, |).",
  },
  {
    id: 5,
    cat: "JS",
    q: "Literals",
    a: "Fixed values directly provided in the code (e.g., 42, 'text', true, {a:1}).",
  },
  {
    id: 6,
    cat: "JS",
    q: "Escape Sequences",
    a: "Backslash notation for special chars: \\n (newline), \\t (tab), \\' (quote).",
  },
  {
    id: 7,
    cat: "JS",
    q: "Implicit Type Conversion",
    a: "JS automatically changing types (Coercion), e.g., '5' + 1 = '51'.",
  },
  {
    id: 8,
    cat: "JS",
    q: "Explicit Type Casting",
    a: "Manually converting types using Number(), String(), or Boolean() functions.",
  },
  {
    id: 9,
    cat: "JS",
    q: "use strict Directive",
    a: "Ensures code is executed in 'Strict Mode' to catch errors and prevent global leaks.",
  },
  {
    id: 10,
    cat: "JS",
    q: "JSON Parsing (JSON.parse)",
    a: "Converts a JSON string into a JavaScript object.",
  },
  {
    id: 11,
    cat: "JS",
    q: "Event Bubbling",
    a: "Event starts at target and propagates UP through parent elements.",
  },
  {
    id: 12,
    cat: "JS",
    q: "Map and ForEach",
    a: "map() returns a new array; forEach() returns undefined and just iterates.",
  },
  {
    id: 13,
    cat: "JS",
    q: "Map and Hashmap",
    a: "Map is a JS object for key-value pairs; Hashmap is the general data structure concept.",
  },
  {
    id: 14,
    cat: "JS",
    q: "Pure Functions",
    a: "Same input always gives same output with no side effects.",
  },
  {
    id: 15,
    cat: "JS",
    q: "First-Class Functions",
    a: "Functions treated as variables (can be passed, returned, assigned).",
  },
  {
    id: 16,
    cat: "JS",
    q: "Generator Functions",
    a: "Pausing functions using 'yield' and 'function*'.",
  },
  {
    id: 17,
    cat: "JS",
    q: "Optional Chaining Operator (?.)",
    a: "Safely access nested properties without manual null checks.",
  },
  {
    id: 18,
    cat: "JS",
    q: "Nullish Coalescing Operator (??)",
    a: "Returns right-hand side only if left-hand side is null/undefined.",
  },
  {
    id: 19,
    cat: "JS",
    q: "Regular Expressions",
    a: "Patterns used to match character combinations in strings.",
  },
  {
    id: 20,
    cat: "JS",
    q: "Identifiers",
    a: "Names for variables, functions, and properties.",
  },
  { id: 21, cat: "JS", q: "Keywords", a: "Reserved syntax tokens in JS." },
  {
    id: 22,
    cat: "JS",
    q: "Unary Operators",
    a: "Work on single operand: ++, --, typeof, delete.",
  },
  {
    id: 23,
    cat: "JS",
    q: "Bitwise Operators",
    a: "Perform binary operations on 32-bit integers: &, |, ^, ~, <<, >>.",
  },
  {
    id: 24,
    cat: "JS",
    q: "Literals (Detailed)",
    a: "Representations of values: Numeric (10), String ('hi'), Regex (/ab+/).",
  },
  {
    id: 25,
    cat: "JS",
    q: "Escape Sequences",
    a: "Representing unprintable chars like \\r, \\b, \\v.",
  },
  {
    id: 26,
    cat: "JS",
    q: "Primitive Types",
    a: "Immutable types: Number, String, Boolean, Null, Undefined, Symbol, BigInt.",
  },
  {
    id: 27,
    cat: "JS",
    q: "User-Defined Data Types",
    a: "Complex structures created via Classes and Objects.",
  },
  {
    id: 28,
    cat: "JS",
    q: "JS vs. TypeScript",
    a: "TS adds static typing and interfaces to JavaScript.",
  },
  {
    id: 29,
    cat: "JS",
    q: "Slice vs. Splice",
    a: "slice() is immutable (returns part); splice() is mutable (adds/removes).",
  },
  {
    id: 30,
    cat: "JS",
    q: "For and While Loops",
    a: "For is used when count is known; While when condition is key.",
  },
  {
    id: 31,
    cat: "JS",
    q: "maxAge vs. Expires",
    a: "Cookie controls: maxAge (seconds from now), Expires (specific date/time).",
  },
  {
    id: 32,
    cat: "JS",
    q: "Hoisting",
    a: "Moving declarations to the top of scope during compilation.",
  },
  {
    id: 33,
    cat: "JS",
    q: "Implements and Extends",
    a: "Extends is for inheritance; Implements (in TS) is for enforcing interfaces.",
  },
  {
    id: 34,
    cat: "JS",
    q: "Closures and Scoped Variables",
    a: "Functions bundled with their lexical environment.",
  },
  {
    id: 35,
    cat: "JS",
    q: "Optional Chaining",
    a: "Safe navigation through objects: obj?.prop.",
  },
  {
    id: 36,
    cat: "JS",
    q: "Spread Operator (...)",
    a: "Expands an array or object into individual elements.",
  },
  {
    id: 37,
    cat: "JS",
    q: "While and Do-While",
    a: "Do-While executes at least once before checking the condition.",
  },
  {
    id: 38,
    cat: "JS",
    q: "Generator Function",
    a: "Function that can pause execution (yield) and resume (next).",
  },
  {
    id: 39,
    cat: "JS",
    q: "Nullish Coalescing (??)",
    a: "Avoids problems with falsy values like 0 or empty strings.",
  },
  {
    id: 40,
    cat: "JS",
    q: "Relational/Logical Expressions",
    a: "Using > < >= <= and && || ! for conditional logic.",
  },
  {
    id: 41,
    cat: "JS",
    q: "ForEach",
    a: "Array method to iterate over elements without a return value.",
  },
  {
    id: 42,
    cat: "JS",
    q: "Classes and Objects",
    a: "Blueprints for creating objects with shared properties/methods.",
  },
  {
    id: 43,
    cat: "JS",
    q: "Inheritance",
    a: "Mechanisms for a child class to acquire properties of a parent class.",
  },
  {
    id: 44,
    cat: "JS",
    q: "Set Collection",
    a: "A collection of unique values; no duplicates allowed.",
  },
  {
    id: 45,
    cat: "JS",
    q: "Higher-Order Functions",
    a: "Functions that take or return other functions.",
  },
  {
    id: 46,
    cat: "JS",
    q: "Set.has()",
    a: "Returns boolean indicating if value exists in a Set (fast O(1)).",
  },
  {
    id: 47,
    cat: "JS",
    q: "Bitwise Operators",
    a: "Efficient operations at the bit level.",
  },
  { id: 48, cat: "JS", q: "Unary Operators", a: "Single operand logic." },
  {
    id: 49,
    cat: "JS",
    q: "Abstract Functions",
    a: "Functions without implementation, meant to be overridden in children.",
  },
  {
    id: 50,
    cat: "JS",
    q: "Anonymous Functions",
    a: "Functions without a name, often used as callbacks.",
  },
  {
    id: 51,
    cat: "JS",
    q: "DOM Manipulation",
    a: "Changing HTML/CSS via JavaScript (getElementById, etc.).",
  },
  {
    id: 52,
    cat: "JS",
    q: "Type Casting",
    a: "Explicitly forcing a type change.",
  },
  {
    id: 53,
    cat: "JS",
    q: "Internal Type Casting",
    a: "Same as Coercion (automatic change).",
  },
  {
    id: 54,
    cat: "JS",
    q: "External Type Casting",
    a: "Same as Explicit Casting (manual change).",
  },
  {
    id: 55,
    cat: "JS",
    q: "Math.floor()",
    a: "Rounds a number DOWN to the nearest integer.",
  },
  {
    id: 56,
    cat: "JS",
    q: "Number.toFixed()",
    a: "Formats a number with a specific number of decimals.",
  },
  {
    id: 57,
    cat: "JS",
    q: "Sync vs Async",
    a: "Sync is blocking; Async allows code to run in background.",
  },
  {
    id: 58,
    cat: "JS",
    q: "Arrays and Array Methods",
    a: "push, pop, shift, unshift, map, filter, reduce, find.",
  },
  {
    id: 59,
    cat: "JS",
    q: "typeof Operator",
    a: "Returns a string indicating the data type of an operand.",
  },
  {
    id: 60,
    cat: "JS",
    q: "Higher-Order Arrow Functions",
    a: "Compact arrow syntax used in HO-Functions.",
  },
  {
    id: 61,
    cat: "JS",
    q: "Lexical Scope",
    a: "Variables are available based on where they were defined in the code.",
  },
  {
    id: 62,
    cat: "JS",
    q: "Math.round()",
    a: "Rounds to the nearest integer (.5 rounds up).",
  },
  {
    id: 63,
    cat: "JS",
    q: "BOM",
    a: "Browser Object Model: interactions with the browser (window, screen, history).",
  },
  {
    id: 64,
    cat: "JS",
    q: "Ternary Operator",
    a: "Short form of if-else: (condition ? trueVal : falseVal).",
  },
  {
    id: 65,
    cat: "JS",
    q: "Operator Precedence",
    a: "The order in which operators are evaluated (PEMDAS for JS).",
  },
  {
    id: 66,
    cat: "JS",
    q: "Async and Await",
    a: "Syntactic sugar for handling Promises cleaner.",
  },
  {
    id: 67,
    cat: "JS",
    q: "use strict Directive",
    a: "Eliminates some JS silent errors by changing them to throw errors.",
  },
  {
    id: 68,
    cat: "JS",
    q: "Call and Apply",
    a: "Functions to invoke methods on objects with different 'this' contexts.",
  },
  {
    id: 69,
    cat: "JS",
    q: "Event Loop",
    a: "The cycle that handles task queues and the execution stack.",
  },
  {
    id: 70,
    cat: "JS",
    q: "Reduce and Map",
    a: "Reduce transforms array to a single value; Map transforms each element.",
  },
  {
    id: 71,
    cat: "JS",
    q: "Conversion vs. Coercion",
    a: "Manual vs Automatic type changes.",
  },
  {
    id: 72,
    cat: "JS",
    q: "Switch Statement",
    a: "Multi-way branch based on a value.",
  },
  {
    id: 73,
    cat: "JS",
    q: "== vs. ===",
    a: "Abstract vs Strict equality (strict checks type).",
  },
  { id: 74, cat: "JS", q: "let vs. var", a: "Block-scope vs Function-scope." },
  {
    id: 75,
    cat: "JS",
    q: "Continue Statement",
    a: "Skips the rest of the current loop iteration.",
  },
  {
    id: 76,
    cat: "JS",
    q: "Promise.race/allSettled",
    a: "race: first to finish; allSettled: waits for all to finish (regardless of result).",
  },
  {
    id: 77,
    cat: "JS",
    q: "Exceptions Handling",
    a: "Try, Catch, Finally, Throw blocks.",
  },
  {
    id: 78,
    cat: "JS",
    q: "Immutable String",
    a: "In JS, strings cannot be changed, only new ones created.",
  },
  {
    id: 79,
    cat: "JS",
    q: "JS Fundamentals",
    a: "Scope, closures, prototypes, and async nature.",
  },
  {
    id: 80,
    cat: "JS",
    q: "Pre-Increment",
    a: "++x increments value THEN returns it.",
  },
  {
    id: 81,
    cat: "JS",
    q: "JSON.parse/stringify",
    a: "String to Object and Object to String conversions.",
  },
  {
    id: 82,
    cat: "JS",
    q: "Recursion",
    a: "A function calling itself until a base case is met.",
  },
  {
    id: 83,
    cat: "JS",
    q: "Event Bubbling",
    a: "The default event propagation phase.",
  },
  {
    id: 84,
    cat: "JS",
    q: "map vs reduce vs filter",
    a: "Transform array vs Aggregate array vs Subset array.",
  },
  {
    id: 85,
    cat: "JS",
    q: "Reference vs Value Type",
    a: "Objects stored as addresses; Primitives stored as literal values.",
  },
  {
    id: 86,
    cat: "JS",
    q: "Shallow vs Deep Copy",
    a: "One level copy vs nested clones.",
  },
  {
    id: 87,
    cat: "JS",
    q: "Constructors",
    a: "Special functions used with 'new' to create objects.",
  },
  {
    id: 88,
    cat: "JS",
    q: "Capturing vs Bubbling",
    a: "Downwards vs Upwards event propagation.",
  },
  {
    id: 89,
    cat: "JS",
    q: "Memoization",
    a: "Caching function results to improve performance.",
  },
  {
    id: 90,
    cat: "JS",
    q: "Named vs Default Export",
    a: "Exporting multiple things vs one main thing per module.",
  },
  {
    id: 91,
    cat: "JS",
    q: "Factory vs Constructor",
    a: "Functions returning objects vs Functions used with 'new' keyword.",
  },
  {
    id: 92,
    cat: "JS",
    q: "Call, Apply, Bind",
    a: "Methods to control the 'this' keyword in functions.",
  },
  {
    id: 93,
    cat: "JS",
    q: "D3.js",
    a: "A library for data-driven document visualization.",
  },
  {
    id: 94,
    cat: "JS",
    q: "WebGL",
    a: "API for rendering 2D/3D graphics in the browser.",
  },
  {
    id: 95,
    cat: "JS",
    q: "WebVR",
    a: "Legacy API for virtual reality in browsers (now WebXR).",
  },
  {
    id: 96,
    cat: "JS",
    q: "Notification API",
    a: "Allows web pages to show system-level notifications.",
  },
  {
    id: 97,
    cat: "JS",
    q: "Event vs Request Architecture",
    a: "Reactive push-based vs Imperative pull-based systems.",
  },
  {
    id: 98,
    cat: "JS",
    q: "Pure vs Impure Function",
    a: "Deterministic/No Side Effects vs Non-deterministic/Side Effects.",
  },

  // NODE.JS & EXPRESS (99-154)
  {
    id: 99,
    cat: "Node",
    q: "Callbacks and Promises",
    a: "Old-school passing functions vs modern Object-based async handling.",
  },
  {
    id: 100,
    cat: "Node",
    q: "Promise.all() vs. race()",
    a: "Wait for all successes vs first to settle.",
  },
  {
    id: 101,
    cat: "Node",
    q: "req.query vs req.params",
    a: "URL query strings (?id=1) vs route params (/user/:id).",
  },
  {
    id: 102,
    cat: "Node",
    q: "res.send vs res.write",
    a: "Send terminates response; Write allows chunking data.",
  },
  {
    id: 103,
    cat: "Node",
    q: "res.end()",
    a: "Ends the response process (useful for streams).",
  },
  {
    id: 104,
    cat: "Node",
    q: "res.json()",
    a: "Sends a JSON response with correct headers.",
  },
  {
    id: 105,
    cat: "Node",
    q: "res.redirect()",
    a: "Sends status 302 to redirect the browser to another URL.",
  },
  {
    id: 106,
    cat: "Node",
    q: "res.render()",
    a: "Renders a view template using the configured view engine.",
  },
  {
    id: 107,
    cat: "Node",
    q: "View Engine",
    a: "Tool to generate HTML from templates (EJS, Pug, Handlebars).",
  },
  {
    id: 108,
    cat: "Node",
    q: "Node Concurrency",
    a: "Uses single-threaded event loop + Worker Pool for non-blocking I/O.",
  },
  {
    id: 109,
    cat: "Node",
    q: "Static vs Dynamic Typing",
    a: "Variable types checked at compile-time vs run-time.",
  },
  {
    id: 110,
    cat: "Node",
    q: "Sessions",
    a: "Server-side storage of user data across multiple requests.",
  },
  {
    id: 111,
    cat: "Node",
    q: "MVC",
    a: "Model (Data), View (UI), Controller (Logic) separation.",
  },
  {
    id: 112,
    cat: "Node",
    q: "Cluster and Worker",
    a: "Splitting one Node process into multiple instances to use all CPU cores.",
  },
  {
    id: 113,
    cat: "Node",
    q: "Child Process vs Worker Thread",
    a: "Separate OS processes vs shared-memory threads.",
  },
  {
    id: 114,
    cat: "Node",
    q: "Event Loop",
    a: "Phases: Timers, I/O callbacks, Idle, Poll, Check, Close.",
  },
  {
    id: 115,
    cat: "Node",
    q: "Buffers",
    a: "Memory outside V8 heap used to handle binary data streams.",
  },
  {
    id: 116,
    cat: "Node",
    q: "TCP vs UDP",
    a: "Connection-oriented reliable vs Connectionless fast/unreliable.",
  },
  {
    id: 117,
    cat: "Node",
    q: "Streams",
    a: "Readable, Writable, Duplex, Transform interfaces for chunked data.",
  },
  {
    id: 118,
    cat: "Node",
    q: "HTTP vs HTTPS",
    a: "Unencrypted vs SSL/TLS encrypted web traffic.",
  },
  {
    id: 119,
    cat: "Node",
    q: "Try-Catch and Throw",
    a: "Error handling syntax.",
  },
  {
    id: 120,
    cat: "Node",
    q: "Server-Side Validation",
    a: "Crucial security step to check inputs before DB storage.",
  },
  {
    id: 121,
    cat: "Node",
    q: "REST vs GraphQL",
    a: "Fixed endpoints vs Flexible query language.",
  },
  {
    id: 122,
    cat: "Node",
    q: "require vs import",
    a: "CommonJS (synchronous) vs ES Modules (asynchronous).",
  },
  {
    id: 123,
    cat: "Node",
    q: "App-Level Middleware",
    a: "Functions bound to the 'app' instance.",
  },
  {
    id: 124,
    cat: "Node",
    q: "Router-Level Middleware",
    a: "Functions bound to a specific router instance.",
  },
  {
    id: 125,
    cat: "Node",
    q: "Error Middleware",
    a: "Middlewares with 4 arguments: (err, req, res, next).",
  },
  {
    id: 126,
    cat: "Node",
    q: "Built-In Middleware",
    a: "express.json(), express.static(), etc.",
  },
  {
    id: 127,
    cat: "Node",
    q: "Third-Party Middleware",
    a: "morgan, helmet, cookie-parser, cors.",
  },
  {
    id: 128,
    cat: "Node",
    q: "Body-parser",
    a: "Middleware used to parse incoming request bodies.",
  },
  {
    id: 129,
    cat: "Node",
    q: "Cookie-parser",
    a: "Middleware to parse the 'Cookie' header.",
  },
  {
    id: 130,
    cat: "Node",
    q: "Mongoose",
    a: "ODM (Object Data Modeling) for MongoDB.",
  },
  {
    id: 131,
    cat: "Node",
    q: "Sequelize",
    a: "ORM (Object Relational Mapping) for SQL databases.",
  },
  {
    id: 132,
    cat: "Node",
    q: "Cors",
    a: "Cross-Origin Resource Sharing security mechanism.",
  },
  {
    id: 133,
    cat: "Node",
    q: "Axios",
    a: "Promise-based HTTP client for browser and Node.",
  },
  {
    id: 134,
    cat: "Node",
    q: "Express-validator",
    a: "Set of express middlewares that wraps validator.js.",
  },
  {
    id: 135,
    cat: "Node",
    q: "HTTP Methods",
    a: "GET (read), POST (create), PUT/PATCH (update), DELETE.",
  },
  {
    id: 136,
    cat: "Node",
    q: "Mutable vs Immutable",
    a: "Ability to change object state vs static unchangeable state.",
  },
  {
    id: 137,
    cat: "Node",
    q: "HTTP Responses",
    a: "Codes like 200 (OK), 404 (Not Found), 500 (Server Error).",
  },
  {
    id: 138,
    cat: "Node",
    q: "HTTP Requests",
    a: "Comprised of Method, URL, Headers, and Body.",
  },
  {
    id: 139,
    cat: "Node",
    q: "Module Loading",
    a: "How Node resolves file paths and cached modules.",
  },
  {
    id: 140,
    cat: "Node",
    q: "Timing Features",
    a: "setTimeout, setInterval, setImmediate, process.nextTick.",
  },
  {
    id: 141,
    cat: "Node",
    q: "Cron Job",
    a: "Scheduling tasks to run at specific intervals.",
  },
  {
    id: 142,
    cat: "Node",
    q: "Pagination",
    a: "Technique to divide large datasets into pages.",
  },
  {
    id: 143,
    cat: "Node",
    q: "Architecture Concepts",
    a: "Monolithic vs Microservices designs.",
  },
  {
    id: 144,
    cat: "Node",
    q: "Database Architecture",
    a: "How data is organized, indexed, and related.",
  },
  {
    id: 145,
    cat: "Node",
    q: "ES5 vs ES6",
    a: "Legacy vs Modern JS features (Arrows, Promises, Classes).",
  },
  {
    id: 146,
    cat: "Node",
    q: "Microservices",
    a: "Breaking app into small, independent, communicating services.",
  },
  {
    id: 147,
    cat: "Node",
    q: "API Gateway",
    a: "Single entry point for all client requests in microservices.",
  },
  {
    id: 148,
    cat: "Node",
    q: "Event Emitters",
    a: "Node objects that emit named events to be handled by listeners.",
  },
  {
    id: 149,
    cat: "Node",
    q: "Exception Handling",
    a: "Process of responding to occurrence of exceptions.",
  },
  {
    id: 150,
    cat: "Node",
    q: "Blocking vs Non-Blocking",
    a: "Executing tasks sequentially vs concurrently.",
  },
  {
    id: 151,
    cat: "Node",
    q: "IIFE",
    a: "Immediately Invoked Function Expression for scoping.",
  },
  {
    id: 152,
    cat: "Node",
    q: "Core Modules",
    a: "fs, path, os, http, crypto, util.",
  },
  {
    id: 153,
    cat: "Node",
    q: "app.all vs use vs set",
    a: "Method matching vs Middleware mounting vs Config setting.",
  },
  {
    id: 154,
    cat: "Node",
    q: "maxAge vs Expires",
    a: "Relative vs Absolute time for cookie lifecycle.",
  },

  // DATABASE (155-187)
  {
    id: 155,
    cat: "DB",
    q: "MongoDB",
    a: "Document-oriented NoSQL database storing data in BSON.",
  },
  {
    id: 156,
    cat: "DB",
    q: "Database Transactions",
    a: "Logical unit of DB processing (ACID properties).",
  },
  {
    id: 157,
    cat: "DB",
    q: "Primary vs Secondary Index",
    a: "Unique key location vs additional search optimizations.",
  },
  {
    id: 158,
    cat: "DB",
    q: "Sharding",
    a: "Horizontal scaling by distributing data across multiple servers.",
  },
  {
    id: 159,
    cat: "DB",
    q: "Relational vs NoSQL",
    a: "Tables/Schemas vs flexible Documents/Collections.",
  },
  {
    id: 160,
    cat: "DB",
    q: "NoSQL Examples",
    a: "MongoDB, Cassandra, Redis, DynamoDB.",
  },
  {
    id: 161,
    cat: "DB",
    q: "Aggregation",
    a: "Processing data records and returning computed results.",
  },
  {
    id: 162,
    cat: "DB",
    q: "$in, $or, $and",
    a: "MongoDB query operators for conditional filtering.",
  },
  {
    id: 163,
    cat: "DB",
    q: "HTTP Headers",
    a: "Metadata sent with requests/responses (Content-Type, Auth).",
  },
  {
    id: 164,
    cat: "DB",
    q: "SSL",
    a: "Secure Sockets Layer for encrypted links.",
  },
  {
    id: 165,
    cat: "DB",
    q: "TLS",
    a: "Transport Layer Security (Successor to SSL).",
  },
  {
    id: 166,
    cat: "DB",
    q: "Reverse Proxy",
    a: "Forwards client requests to backend servers (Nginx).",
  },
  {
    id: 167,
    cat: "DB",
    q: "Forward Proxy",
    a: "Acts on behalf of a group of clients to access internet.",
  },
  {
    id: 168,
    cat: "DB",
    q: "WAF",
    a: "Web Application Firewall filtering HTTP traffic.",
  },
  {
    id: 169,
    cat: "DB",
    q: "Ufw",
    a: "Uncomplicated Firewall for Linux system security.",
  },
  {
    id: 170,
    cat: "DB",
    q: "UDP and TCP",
    a: "Unreliable speed vs Reliable accuracy protocols.",
  },
  {
    id: 171,
    cat: "DB",
    q: "Agile",
    a: "Iterative software development methodology.",
  },
  {
    id: 172,
    cat: "DB",
    q: "Git Conflict",
    a: "Merging different changes to same code part.",
  },
  {
    id: 173,
    cat: "DB",
    q: "Scrum",
    a: "Specific Agile framework with Sprints and Daily meetings.",
  },
  {
    id: 174,
    cat: "DB",
    q: "Docker",
    a: "Containerization platform to package apps with dependencies.",
  },
  {
    id: 175,
    cat: "DB",
    q: "Load Balancing",
    a: "Distributing traffic across multiple servers.",
  },
  {
    id: 176,
    cat: "DB",
    q: "CDN",
    a: "Content Delivery Network for fast asset delivery.",
  },
  { id: 177, cat: "DB", q: "DDoS", a: "Distributed Denial of Service attack." },
  { id: 178, cat: "DB", q: "Microservices", a: "Modular architectural style." },
  {
    id: 179,
    cat: "DB",
    q: "CI/CD",
    a: "Continuous Integration and Deployment pipelines.",
  },
  {
    id: 180,
    cat: "DB",
    q: "JWT",
    a: "Standard for secure token-based authentication.",
  },
  {
    id: 181,
    cat: "DB",
    q: "Provider/Subscriber",
    a: "Messaging pattern (Pub/Sub).",
  },
  {
    id: 182,
    cat: "DB",
    q: "Microservices Count",
    a: "Determined by business domain logic (Bounded Contexts).",
  },
  {
    id: 183,
    cat: "DB",
    q: "API Gateway",
    a: "Routing, Composition, and Protocol translation.",
  },
  { id: 184, cat: "DB", q: "Nginx", a: "Event-driven proxy and web server." },
  {
    id: 185,
    cat: "DB",
    q: "CAP Theorem",
    a: "Consistency, Availability, Partition Tolerance trade-offs.",
  },
  {
    id: 186,
    cat: "DB",
    q: "Reverse Proxy",
    a: "Security and Load Balancing gateway.",
  },
  {
    id: 187,
    cat: "DB",
    q: "Forward Proxy",
    a: "Client-side privacy and filtering.",
  },

  // PRACTICAL QUESTIONS - JAVASCRIPT
  {
    id: 188,
    cat: "JS",
    q: "Practice: Even or Odd Check",
    a: "Use the modulo operator to check if a number is even or odd.",
    practical: true,
    starter:
      'function checkEvenOdd(num) {\n  // Check if num is even or odd\n  // Return "even" or "odd"\n}\n\nconsole.log(checkEvenOdd(4));   // "even"\nconsole.log(checkEvenOdd(7));   // "odd"',
  },
  {
    id: 189,
    cat: "JS",
    q: "Practice: Reverse a String",
    a: "Split, reverse, and join the string to reverse it.",
    practical: true,
    starter:
      'function reverseString(str) {\n  // Reverse the string and return it\n}\n\nconsole.log(reverseString("hello"));     // "olleh"\nconsole.log(reverseString("JavaScript")); // "tpircSavaJ"',
  },
  {
    id: 190,
    cat: "JS",
    q: "Practice: Count Array Elements",
    a: "Use filter or reduce to count elements matching a condition.",
    practical: true,
    starter:
      "function countGreaterThan(arr, num) {\n  // Count how many elements are greater than num\n}\n\nconst numbers = [5, 10, 3, 8, 15];\nconsole.log(countGreaterThan(numbers, 7));  // 2",
  },
  {
    id: 191,
    cat: "JS",
    q: "Practice: Find Maximum",
    a: "Use Math.max() or a loop to find the largest number.",
    practical: true,
    starter:
      "function findMax(arr) {\n  // Find and return the maximum value in the array\n}\n\nconst nums = [3, 7, 2, 9, 1];\nconsole.log(findMax(nums)); // 9",
  },
  {
    id: 192,
    cat: "JS",
    q: "Practice: Filter Array",
    a: "Use array.filter() to create a new array with matching elements.",
    practical: true,
    starter:
      'function filterByAge(users, minAge) {\n  // Filter users with age >= minAge\n}\n\nconst users = [\n  { name: "Alice", age: 25 },\n  { name: "Bob", age: 17 },\n  { name: "Charlie", age: 30 }\n];\nconsole.log(filterByAge(users, 18).length); // 2',
  },
  {
    id: 193,
    cat: "JS",
    q: "Practice: Flatten Array",
    a: "Convert a nested array into a single-level array.",
    practical: true,
    starter:
      "function flattenArray(arr) {\n  // Flatten the nested array\n  // Return as a single-level array\n}\n\nconst nested = [1, [2, 3], [4, [5, 6]]];\nconsole.log(flattenArray(nested)); // [1,2,3,4,5,6]",
  },
  {
    id: 194,
    cat: "JS",
    q: "Practice: Check Palindrome",
    a: "Compare string with its reverse to check if it's a palindrome.",
    practical: true,
    starter:
      'function isPalindrome(str) {\n  // Check if the string is a palindrome\n  // Return true or false\n}\n\nconsole.log(isPalindrome("racecar"));  // true\nconsole.log(isPalindrome("hello"));    // false',
  },
  {
    id: 195,
    cat: "JS",
    q: "Practice: Sum of Array",
    a: "Use reduce() to sum all elements in an array.",
    practical: true,
    starter:
      "function sumArray(arr) {\n  // Sum all elements in the array\n}\n\nconst numbers = [1, 2, 3, 4, 5];\nconsole.log(sumArray(numbers)); // 15",
  },

  // PRACTICAL QUESTIONS - NODE.JS
  {
    id: 196,
    cat: "Node",
    q: "Practice: Parse Query Parameters",
    a: "Extract and parse query parameters from a URL string.",
    practical: true,
    starter:
      'function parseQuery(queryString) {\n  // Parse ?key1=value1&key2=value2 into an object\n}\n\nconst query = "name=John&age=30&city=NYC";\nconst result = parseQuery(query);\nconsole.log(result); // { name: "John", age: "30", city: "NYC" }',
  },
  {
    id: 197,
    cat: "Node",
    q: "Practice: Promise Chaining",
    a: "Chain promises to execute asynchronous operations sequentially.",
    practical: true,
    starter:
      'function fetchUserData() {\n  // Create promises that resolve in sequence\n  // return promise1.then(...).then(...).catch(...)\n}\n\nfetchUserData().then(data => {\n  console.log("User data fetched:", data);\n}).catch(err => {\n  console.log("Error:", err);\n});',
  },
  {
    id: 198,
    cat: "Node",
    q: "Practice: Async/Await Pattern",
    a: "Use async/await for cleaner asynchronous code.",
    practical: true,
    starter:
      'async function fetchAndProcess() {\n  try {\n    // Fetch data\n    // Process data\n    // Return result\n  } catch (error) {\n    console.error("Error:", error);\n  }\n}\n\nfetchAndProcess().then(result => console.log(result));',
  },
  {
    id: 199,
    cat: "Node",
    q: "Practice: Middleware Creation",
    a: "Create custom Express middleware to handle requests.",
    practical: true,
    starter:
      'function loggerMiddleware(req, res, next) {\n  // Log the request method and URL\n  // Call next() to pass to next middleware\n}\n\napp.use(loggerMiddleware);\napp.get("/", (req, res) => {\n  res.send("Hello!");\n});',
  },
  {
    id: 200,
    cat: "Node",
    q: "Practice: File Operations",
    a: "Read and write files using Node.js fs module.",
    practical: true,
    starter:
      'const fs = require("fs");\n\n// Read a file\nconst data = fs.readFileSync("file.txt", "utf8");\nconsole.log(data);\n\n// Write to a file\nfs.writeFileSync("output.txt", "Hello, World!");\n\nconsole.log("File written successfully!");',
  },

  // PRACTICAL QUESTIONS - DATABASE
  {
    id: 201,
    cat: "DB",
    q: "Practice: Write MongoDB Query",
    a: "Write a query to find documents matching specific criteria.",
    practical: true,
    starter:
      'db.users.find({\n  // Find users age >= 18\n  // AND status = "active"\n});\n\n// Expected result: array of matching users\n// Example: { name: "Alice", age: 25, status: "active" }',
  },
  {
    id: 202,
    cat: "DB",
    q: "Practice: SQL Join Query",
    a: "Write SQL to join multiple tables and retrieve combined data.",
    practical: true,
    starter:
      'SELECT users.name, orders.order_id, orders.total\nFROM users\nINNER JOIN orders ON users.id = orders.user_id\nWHERE orders.status = "completed"\nORDER BY orders.total DESC;',
  },
  {
    id: 203,
    cat: "DB",
    q: "Practice: Index Creation",
    a: "Create database index for query performance optimization.",
    practical: true,
    starter:
      "db.users.createIndex({ email: 1 });\ndb.users.createIndex({ createdAt: -1 });\n\n// Verify indices\ndb.users.getIndexes();\n\n// This improves query speed on these fields",
  },
*/

export default function App() {
  const [user, setUser] = useState(null);
  const [dbQuestions, setDbQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(new Set());
  const [viewMode, setViewMode] = useState("quiz"); // 'quiz', 'list', 'code'
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Code Editor State
  const [userCode, setUserCode] = useState("");
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);

  // Gemini State
  const [geminiResult, setGeminiResult] = useState(null);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);

  // Add/Edit Question State
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    category: "JS",
    question: "",
    answer: "",
    isPractical: false,
    starterCode: "",
  });
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [editingQuestionItem, setEditingQuestionItem] = useState(null);
  const [builtInQuestions, setBuiltInQuestions] = useState([]);

  // Firebase Init
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (
          typeof __initial_auth_token !== "undefined" &&
          __initial_auth_token
        ) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.warn("Firebase auth failed (continuing without auth):", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  // Load Questions from Firebase (auth optional)
  useEffect(() => {
    // Load user-added questions
    const userQuestionsRef = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "questions",
    );
    const unsubscribeUserQuestions = onSnapshot(
      userQuestionsRef,
      (snapshot) => {
        const userQuestions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isUserAdded: true,
        }));
        setDbQuestions(userQuestions);
      },
    );

    // Load built-in questions
    const builtInRef = collection(
      db,
      "artifacts",
      appId,
      "public",
      "data",
      "builtIn",
    );
    const unsubscribeBuiltIn = onSnapshot(builtInRef, (snapshot) => {
      const builtInQs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isBuiltIn: true,
      }));
      setBuiltInQuestions(builtInQs);
    });

    return () => {
      unsubscribeUserQuestions();
      unsubscribeBuiltIn();
    };
  }, [user]);

  const allData = useMemo(
    () => [...builtInQuestions, ...dbQuestions],
    [builtInQuestions, dbQuestions],
  );
  const filteredData = useMemo(() => {
    return allData.filter((item) => {
      const qText = (item.q || item.text || "").toLowerCase();
      const matchesSearch = qText.includes(search.toLowerCase());
      const matchesFilter = filter === "All" || item.cat === filter;
      return matchesSearch && matchesFilter;
    });
  }, [allData, search, filter]);

  const currentItem = filteredData[currentIndex] || null;

  // Reset code when item changes
  useEffect(() => {
    if (currentItem?.practical) {
      setUserCode(currentItem.starter || "// Start coding here...");
    } else {
      setUserCode("// Select a practical question to start coding.");
    }
    setConsoleOutput([]);
    setGeminiResult(null);
    setShowAnswer(false);
  }, [currentIndex, currentItem]);

  // Code Execution Logic
  const runCode = () => {
    setIsExecuting(true);
    const logs = [];
    const customConsole = {
      log: (...args) =>
        logs.push(
          args
            .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
            .join(" "),
        ),
      error: (...args) => logs.push(`Error: ${args.join(" ")}`),
      warn: (...args) => logs.push(`Warning: ${args.join(" ")}`),
    };

    try {
      // Create a function from the code string
      const func = new Function("console", userCode);
      func(customConsole);
    } catch (err) {
      logs.push(`Runtime Error: ${err.message}`);
    }

    setConsoleOutput(logs);
    setIsExecuting(false);
  };

  const handleAIHelp = async () => {
    if (!currentItem) return;
    setIsGeminiLoading(true);
    setGeminiResult(null);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Provide a solution code for: ${currentItem.q || currentItem.text}`,
                  },
                ],
              },
            ],
            systemInstruction: {
              parts: [
                {
                  text: "Provide ONLY a clean JavaScript code snippet with comments. No intro text.",
                },
              ],
            },
          }),
        },
      );
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      setGeminiResult(text);
    } catch (e) {
      setGeminiResult("// AI Error: Failed to fetch solution.");
    } finally {
      setIsGeminiLoading(false);
    }
  };

  const resetQuestionForm = () => {
    setNewQuestion({
      category: "JS",
      question: "",
      answer: "",
      isPractical: false,
      starterCode: "",
    });
    setEditQuestionId(null);
    setEditingQuestionItem(null);
  };

  const handleStartEdit = (item) => {
    setEditQuestionId(item.id);
    setEditingQuestionItem(item);
    setNewQuestion({
      category: item.cat || "JS",
      question: item.q || item.text || "",
      answer: item.a || item.answer || "",
      isPractical: !!item.practical,
      starterCode: item.starter || "",
    });
    setShowAddQuestion(true);
  };

  const handleDeleteQuestion = async (item) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      const collectionName = item.isBuiltIn ? "builtIn" : "questions";
      await deleteDoc(
        doc(db, "artifacts", appId, "public", "data", collectionName, item.id),
      );
      alert("Question deleted.");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete question: " + error.message);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.question.trim() || !newQuestion.answer.trim()) {
      alert("Please fill in question and answer fields!");
      return;
    }

    setIsAddingQuestion(true);
    try {
      const questionData = {
        q: newQuestion.question,
        a: newQuestion.answer,
        cat: newQuestion.category,
        practical: newQuestion.isPractical,
      };

      if (newQuestion.isPractical && newQuestion.starterCode.trim()) {
        questionData.starter = newQuestion.starterCode;
      } else {
        questionData.starter = "";
      }

      if (editQuestionId) {
        const collectionName = editingQuestionItem?.isBuiltIn
          ? "builtIn"
          : "questions";
        await updateDoc(
          doc(
            db,
            "artifacts",
            appId,
            "public",
            "data",
            collectionName,
            editQuestionId,
          ),
          questionData,
        );
        alert("Question updated successfully!");
      } else {
        await addDoc(
          collection(db, "artifacts", appId, "public", "data", "questions"),
          questionData,
        );
        alert("Question added successfully!");
      }

      resetQuestionForm();
      setShowAddQuestion(false);
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Failed to save question: " + error.message);
    } finally {
      setIsAddingQuestion(false);
    }
  };

  return (
    <div
      className={`${isDarkMode ? "dark bg-slate-900 text-white" : "bg-slate-50 text-slate-900"} min-h-screen transition-all duration-300 flex flex-col`}
    >
      {/* Nav */}
      <nav className="p-4 border-b border-slate-700/50 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Code2 className="text-blue-500" />
          <h1 className="font-black italic uppercase text-lg">
            InterviewMaster{" "}
            <span className="text-blue-500 font-bold border border-blue-500 px-1 text-[10px] rounded">
              PRO
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-1">
            {["quiz", "list", "code"].map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${viewMode === m ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "hover:bg-slate-700"}`}
              >
                {m}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddQuestion(true)}
            className="p-2 rounded-full hover:bg-blue-600/20 text-blue-400"
            title="Add Question"
          >
            <Plus size={18} />
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-slate-700/30"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col max-w-7xl mx-auto w-full p-4 gap-6">
        {/* Unified Sidebar for Quiz/Code Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* Left Column: Question/List */}
          <div
            className={`${viewMode === "code" ? "lg:col-span-4" : "lg:col-span-12"} flex flex-col gap-4`}
          >
            {/* Search/Filter Bar (Only visible in quiz/list) */}
            {viewMode !== "code" && (
              <div className="flex flex-col md:flex-row gap-2 mb-2">
                <div className="relative flex-grow">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search topics..."
                    className={`w-full pl-10 pr-4 py-3 rounded-xl outline-none border transition-all ${isDarkMode ? "bg-slate-800 border-slate-700 focus:border-blue-500" : "bg-white border-slate-200 focus:border-blue-500"}`}
                  />
                </div>
                <div className="flex gap-1">
                  {["All", "JS", "Node", "DB"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold ${filter === f ? "bg-blue-600 text-white" : "bg-slate-800"}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="text-xs opacity-60 ml-auto">
                  {builtInQuestions.length === 0 ? (
                    <span className="text-amber-400 font-bold">
                      ⚠️ Click DB icon to sync questions
                    </span>
                  ) : (
                    <span>
                      📊 {builtInQuestions.length} built-in +{" "}
                      {dbQuestions.length} custom = {allData.length} total
                    </span>
                  )}
                </div>
              </div>
            )}

            {viewMode === "quiz" ? (
              <div
                className={`p-8 rounded-3xl border shadow-xl flex flex-col items-center text-center min-h-[400px] ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white"}`}
              >
                <span className="text-[10px] font-black text-blue-500 tracking-widest uppercase mb-4">
                  {currentItem?.cat}
                </span>
                <h2 className="text-3xl font-bold mb-8 leading-tight">
                  {currentItem?.q || currentItem?.text || "No Data"}
                </h2>
                <div className="flex-grow flex flex-col justify-center w-full">
                  {showAnswer ? (
                    <div className="p-6 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-left mb-6">
                      <p className="italic text-lg opacity-90">
                        {currentItem?.a || currentItem?.answer}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAnswer(true)}
                      className="px-10 py-4 bg-blue-600 rounded-2xl font-black text-white hover:scale-105 transition-all mb-6"
                    >
                      REVEAL ANSWER
                    </button>
                  )}
                  {currentItem?.practical && (
                    <button
                      onClick={() => setViewMode("code")}
                      className="flex items-center justify-center gap-2 text-sm font-bold text-green-500 hover:bg-green-500/10 p-3 rounded-xl border border-green-500/20"
                    >
                      <Code2 size={16} /> PRACTICE WITH CODE
                    </button>
                  )}
                </div>
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() =>
                      setCurrentIndex(Math.max(0, currentIndex - 1))
                    }
                    className="p-3 bg-slate-700 rounded-full hover:bg-blue-600"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentIndex(
                        Math.min(filteredData.length - 1, currentIndex + 1),
                      )
                    }
                    className="p-3 bg-slate-700 rounded-full hover:bg-blue-600"
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>
            ) : viewMode === "list" ? (
              <div className="grid gap-3">
                {filteredData.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setViewMode("quiz");
                    }}
                    className={`p-4 rounded-xl border cursor-pointer hover:border-blue-500 transition-all ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white"}`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold">{item.q || item.text}</h4>
                      <div className="flex items-center gap-2">
                        {item.practical && (
                          <Code2 size={14} className="text-green-500" />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(item);
                          }}
                          className="p-1 rounded hover:bg-blue-500/20"
                          title="Edit question"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteQuestion(item);
                          }}
                          className="p-1 rounded hover:bg-red-500/20"
                          title="Delete question"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Code Sidebar (Question Details)
              <div
                className={`p-6 rounded-2xl border h-full ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white"}`}
              >
                <button
                  onClick={() => setViewMode("quiz")}
                  className="text-xs font-bold text-slate-500 hover:text-white flex items-center gap-1 mb-4"
                >
                  <ChevronLeft size={14} /> BACK TO QUIZ
                </button>
                <h3 className="text-xl font-bold mb-2">Practical Challenge</h3>
                <p className="text-sm opacity-70 mb-6">
                  {currentItem?.q || currentItem?.text}
                </p>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 mb-4">
                  <h4 className="text-[10px] font-black text-blue-500 uppercase mb-2 flex items-center gap-1">
                    <Sparkles size={10} /> AI Strategy
                  </h4>
                  <p className="text-xs opacity-80 leading-relaxed italic">
                    {currentItem?.a || currentItem?.answer}
                  </p>
                </div>
                <button
                  onClick={handleAIHelp}
                  disabled={isGeminiLoading}
                  className="w-full py-2 bg-slate-700 rounded-lg text-xs font-bold hover:bg-slate-600 flex items-center justify-center gap-2"
                >
                  {isGeminiLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} className="text-blue-400" />
                  )}
                  GET SOLUTION
                </button>
                {geminiResult && (
                  <div className="mt-4 p-3 bg-slate-950 border border-blue-500/30 rounded-lg">
                    <pre className="text-[10px] font-mono whitespace-pre-wrap text-blue-300">
                      {geminiResult}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Code Editor (Only in code mode) */}
          {viewMode === "code" && (
            <div className="lg:col-span-8 flex flex-col gap-4 h-[70vh] lg:h-auto">
              {/* Editor Header */}
              <div className="bg-slate-800 border border-slate-700 rounded-t-2xl p-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 mr-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    solution.js
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setUserCode(currentItem?.starter || "");
                      setConsoleOutput([]);
                    }}
                    className="p-1.5 hover:bg-slate-700 rounded text-slate-400"
                    title="Reset Code"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    onClick={runCode}
                    className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-black flex items-center gap-2 shadow-lg shadow-green-900/20"
                  >
                    <Play size={12} fill="white" /> RUN CODE
                  </button>
                </div>
              </div>

              {/* Editor Surface */}
              <div className="flex-grow relative">
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="w-full h-full bg-slate-950 p-6 font-mono text-sm border-x border-slate-700 focus:outline-none resize-none text-blue-50"
                  spellCheck="false"
                />
              </div>

              {/* Console Output */}
              <div className="h-40 bg-slate-900 border border-slate-700 rounded-b-2xl p-4 overflow-y-auto">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase mb-2">
                  <Terminal size={12} /> Console Output
                </div>
                <div className="font-mono text-xs space-y-1">
                  {consoleOutput.length === 0 ? (
                    <span className="opacity-30 italic">
                      No output. Press Run...
                    </span>
                  ) : (
                    consoleOutput.map((log, i) => (
                      <div
                        key={i}
                        className={
                          log.startsWith("Error") || log.startsWith("Runtime")
                            ? "text-red-400"
                            : "text-green-400"
                        }
                      >
                        <span className="opacity-30 mr-2">{">"}</span>
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Question Modal */}
      {showAddQuestion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-700/50 sticky top-0 bg-slate-900">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {editQuestionId ? (
                  <>
                    <Edit3 className="text-blue-400" /> Edit Question
                  </>
                ) : (
                  <>
                    <Plus className="text-blue-400" /> Add New Question
                  </>
                )}
              </h2>
              <button
                onClick={() => {
                  setShowAddQuestion(false);
                  resetQuestionForm();
                }}
                className="p-1 hover:bg-slate-700 rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleAddQuestion} className="p-6 space-y-4">
              {/* Category Select */}
              <div>
                <label className="block text-sm font-bold mb-2">Category</label>
                <select
                  value={newQuestion.category}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, category: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500"
                >
                  <option value="JS">JavaScript</option>
                  <option value="Node">Node.js</option>
                  <option value="DB">Database</option>
                  <option value="React">React</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Question Input */}
              <div>
                <label className="block text-sm font-bold mb-2">Question</label>
                <input
                  type="text"
                  value={newQuestion.question}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      question: e.target.value,
                    })
                  }
                  placeholder="Enter your question..."
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Answer/Description Input */}
              <div>
                <label className="block text-sm font-bold mb-2">
                  Answer / Description
                </label>
                <textarea
                  value={newQuestion.answer}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, answer: e.target.value })
                  }
                  placeholder="Enter answer or description..."
                  rows="4"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Practical Question Checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPractical"
                  checked={newQuestion.isPractical}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      isPractical: e.target.checked,
                    })
                  }
                  className="w-4 h-4 cursor-pointer"
                />
                <label
                  htmlFor="isPractical"
                  className="cursor-pointer font-bold"
                >
                  Make this a Practical Code Challenge
                </label>
              </div>

              {/* Starter Code (only if practical) */}
              {newQuestion.isPractical && (
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Starter Code Template
                  </label>
                  <textarea
                    value={newQuestion.starterCode}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        starterCode: e.target.value,
                      })
                    }
                    placeholder="// Enter starter code template here..."
                    rows="6"
                    className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 focus:outline-none focus:border-blue-500 resize-none font-mono text-sm"
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isAddingQuestion}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  {isAddingQuestion ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving...
                    </>
                  ) : editQuestionId ? (
                    <>
                      <Edit3 size={16} /> Update Question
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Add Question
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddQuestion(false);
                    resetQuestionForm();
                  }}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Mode Switcher */}
      <div className="fixed bottom-0 w-full md:hidden bg-slate-800 border-t border-slate-700 p-2 flex gap-1">
        {["quiz", "list", "code"].map((m) => (
          <button
            key={m}
            onClick={() => setViewMode(m)}
            className={`flex-1 py-3 text-[10px] font-black uppercase rounded-lg ${viewMode === m ? "bg-blue-600" : "bg-slate-700"}`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}
