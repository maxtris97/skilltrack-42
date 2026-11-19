/**
 * SkillTrack 42 — Master 42-Day Curriculum (Nov 20 – Dec 31, 2026)
 *
 * Features:
 * - Exactly 42 sequential days across 6 organized learning weeks
 * - Stable curriculum_task_key for every original task (e.g. D01-T01)
 * - Primary programming language: Java (for DSA & OOP)
 * - Secondary programming language: Python
 * - Full-Stack architecture tracing in Week 5
 */

export const CURRICULUM_42_DAYS = [
  {
    "day_number": 1,
    "study_date": "2026-11-20",
    "week_number": 1,
    "week_title": "Week 1: Java & Python Fundamentals",
    "title": "Development Setup, Variables, Data Types & Memory Model",
    "subject": "Java & Python",
    "topic": "Variables & Data Types",
    "outcome": "Master variable declarations, primitive vs reference types, and stack vs heap memory mechanics.",
    "tasks": [
      {
        "task_title": "Environment Verification & First Programs",
        "description": "Verify JDK 21 and Python 3.10+ in terminal. Write, compile, and run Hello World in both Java (public static void main) and Python.",
        "estimated_minutes": 30,
        "subject": "Java & Python",
        "topic": "Variables & Data Types",
        "curriculum_task_key": "D01-T01"
      },
      {
        "task_title": "Java Primitive Data Types & Memory Sizes",
        "description": "Code examples for byte, short, int, long, float, double, char, boolean. Document their bit-widths, minimum and maximum values, and stack memory behavior.",
        "estimated_minutes": 45,
        "subject": "Java",
        "topic": "Variables & Data Types",
        "curriculum_task_key": "D01-T02"
      },
      {
        "task_title": "Python Dynamic Typing vs Java Static Typing",
        "description": "Compare type inference in Python with strong static typing in Java. Practice explicit type casting, widening, and narrowing with precision loss examples.",
        "estimated_minutes": 45,
        "subject": "Python",
        "topic": "Variables & Data Types",
        "curriculum_task_key": "D01-T03"
      }
    ]
  },
  {
    "day_number": 2,
    "study_date": "2026-11-21",
    "week_number": 1,
    "week_title": "Week 1: Java & Python Fundamentals",
    "title": "Standard Input/Output & Fast I/O Operations",
    "subject": "Java & Python",
    "topic": "Input & Output",
    "outcome": "Efficiently read console input, parse different tokens, handle delimiters, and format outputs.",
    "tasks": [
      {
        "task_title": "Java Scanner vs BufferedReader for Competitive I/O",
        "description": "Implement console input using java.util.Scanner and java.io.BufferedReader with StringTokenizer. Benchmark performance on large line inputs.",
        "estimated_minutes": 45,
        "subject": "Java",
        "topic": "Input & Output",
        "curriculum_task_key": "D02-T01"
      },
      {
        "task_title": "Python sys.stdin.readline and String Formatting",
        "description": "Use input() and sys.stdin.readline for fast reading. Practice formatted string output using Python f-strings and Java System.out.printf with specifiers.",
        "estimated_minutes": 45,
        "subject": "Python",
        "topic": "Input & Output",
        "curriculum_task_key": "D02-T02"
      }
    ]
  },
  {
    "day_number": 3,
    "study_date": "2026-11-22",
    "week_number": 1,
    "week_title": "Week 1: Java & Python Fundamentals",
    "title": "Operators, Bitwise Manipulations & Precedence",
    "subject": "Logical Thinking",
    "topic": "Operators",
    "outcome": "Solve logic puzzles using arithmetic, relational, logical short-circuit, and bitwise shift operators.",
    "tasks": [
      {
        "task_title": "Arithmetic, Relational & Short-Circuit Operators",
        "description": "Demonstrate prefix vs postfix increment (++i vs i++). Write test cases showing logical short-circuit evaluation with AND (&&) and OR (||).",
        "estimated_minutes": 45,
        "subject": "Logical Thinking",
        "topic": "Operators",
        "curriculum_task_key": "D03-T01"
      },
      {
        "task_title": "Bitwise Operators & Common Bit Tricks",
        "description": "Implement AND (&), OR (|), XOR (^), bitwise NOT (~), and shift operators (<<, >>, >>>). Solve: check if integer is even/odd, and check if power of 2 using (n & (n - 1)).",
        "estimated_minutes": 60,
        "subject": "Logical Thinking",
        "topic": "Operators",
        "curriculum_task_key": "D03-T02"
      }
    ]
  },
  {
    "day_number": 4,
    "study_date": "2026-11-23",
    "week_number": 1,
    "week_title": "Week 1: Java & Python Fundamentals",
    "title": "Conditional Branching & Multi-Way Decisions",
    "subject": "Logical Thinking",
    "topic": "Conditions",
    "outcome": "Structure clean decision logic with nested if-else, Java enhanced switch, and Python match-case.",
    "tasks": [
      {
        "task_title": "Nested if-else Decision Trees & Boundary Conditions",
        "description": "Solve leap year determination, quadratic equation roots, and triangle validity with rigorous edge-case boundary checks.",
        "estimated_minutes": 45,
        "subject": "Logical Thinking",
        "topic": "Conditions",
        "curriculum_task_key": "D04-T01"
      },
      {
        "task_title": "Java Enhanced Switch vs Python Match-Case",
        "description": "Implement menu-driven calculator using Java 17+ switch expressions (arrow syntax, no fallthrough) and Python 3.10+ pattern matching.",
        "estimated_minutes": 45,
        "subject": "Java & Python",
        "topic": "Conditions",
        "curriculum_task_key": "D04-T02"
      }
    ]
  },
  {
    "day_number": 5,
    "study_date": "2026-11-24",
    "week_number": 1,
    "week_title": "Week 1: Java & Python Fundamentals",
    "title": "Iteration Mechanics: For, While & Do-While Loops",
    "subject": "Java & Python",
    "topic": "Loops",
    "outcome": "Construct robust loops with correct boundary termination, loop invariants, and avoidance of off-by-one errors.",
    "tasks": [
      {
        "task_title": "Java For, While & Do-While Implementations",
        "description": "Write loop programs: reverse an integer, calculate sum of digits, and find greatest common divisor (Euclidean GCD algorithm).",
        "estimated_minutes": 50,
        "subject": "Java",
        "topic": "Loops",
        "curriculum_task_key": "D05-T01"
      },
      {
        "task_title": "Loop Control: break, continue & Labeled Breaks in Java",
        "description": "Compare Python while-else / for-else construct with Java labeled break and continue statements in nested search loops.",
        "estimated_minutes": 40,
        "subject": "Java & Python",
        "topic": "Loops",
        "curriculum_task_key": "D05-T02"
      }
    ]
  },
  {
    "day_number": 6,
    "study_date": "2026-11-25",
    "week_number": 1,
    "week_title": "Week 1: Java & Python Fundamentals",
    "title": "Nested Loops & Matrix Pattern Printing",
    "subject": "Logical Thinking",
    "topic": "Patterns",
    "outcome": "Translate spatial 2D patterns into coordinate row-column loop equations.",
    "tasks": [
      {
        "task_title": "Pyramid, Inverted & Diamond Star Patterns",
        "description": "Derive mathematical row/column space and star formulas. Code full pyramid, inverted pyramid, and diamond patterns in Java.",
        "estimated_minutes": 60,
        "subject": "Logical Thinking",
        "topic": "Patterns",
        "curriculum_task_key": "D06-T01"
      },
      {
        "task_title": "Numeric & Floyd Triangle Patterns",
        "description": "Implement Floyd triangle, Pascal triangle row generation, and hollow square/diamond patterns. Trace index mappings on paper.",
        "estimated_minutes": 60,
        "subject": "Logical Thinking",
        "topic": "Patterns",
        "curriculum_task_key": "D06-T02"
      }
    ]
  },
  {
    "day_number": 7,
    "study_date": "2026-11-26",
    "week_number": 1,
    "week_title": "Week 1: Java & Python Fundamentals",
    "title": "Week 1 Fundamental Revision & Independent Assessment",
    "subject": "Revision Test",
    "topic": "Fundamentals Test",
    "outcome": "Verify syntactical fluency and dry-run execution speed without IDE autocompletion.",
    "tasks": [
      {
        "task_title": "Syntax & Logical Tracing Paper Test",
        "description": "Dry-run 8 tricky code snippets containing post-increments, nested loops, bit shifts, and type casts. Write predicted output on paper.",
        "estimated_minutes": 60,
        "subject": "Revision Test",
        "topic": "Fundamentals Test",
        "curriculum_task_key": "D07-T01"
      },
      {
        "task_title": "Independent Coding Speedrun",
        "description": "Implement 3 timed problems from scratch: Prime factorization, Armstrong number check, and Fibonacci series up to N in both Java and Python.",
        "estimated_minutes": 60,
        "subject": "Revision Test",
        "topic": "Fundamentals Test",
        "curriculum_task_key": "D07-T02"
      }
    ]
  },
  {
    "day_number": 8,
    "study_date": "2026-11-27",
    "week_number": 2,
    "week_title": "Week 2: Functions, Strings, Arrays & OOP",
    "title": "Methods, Functions, Pass-by-Value & Call Stack",
    "subject": "Java & Python",
    "topic": "Methods & Functions",
    "outcome": "Understand method signatures, parameter passing mechanics, and memory frames in the JVM call stack.",
    "tasks": [
      {
        "task_title": "Java Methods & Pass-by-Value Mechanics",
        "description": "Demonstrate that Java is strictly pass-by-value, even for object references. Write swapping methods to prove reference vs primitive behavior.",
        "estimated_minutes": 50,
        "subject": "Java",
        "topic": "Methods & Functions",
        "curriculum_task_key": "D08-T01"
      },
      {
        "task_title": "Python Functions, Default Args & *args/**kwargs",
        "description": "Write Python functions demonstrating positional-only, keyword-only, variable arguments (*args, **kwargs), and mutable default argument traps.",
        "estimated_minutes": 40,
        "subject": "Python",
        "topic": "Methods & Functions",
        "curriculum_task_key": "D08-T02"
      }
    ]
  },
  {
    "day_number": 9,
    "study_date": "2026-11-28",
    "week_number": 2,
    "week_title": "Week 2: Functions, Strings, Arrays & OOP",
    "title": "Function Overloading, Scope & Recursion Prelude",
    "subject": "Java & Python",
    "topic": "Scope & Recursion",
    "outcome": "Master compile-time method overloading, lexical variable scoping, and introductory recursive stack frames.",
    "tasks": [
      {
        "task_title": "Method Overloading in Java vs Variable Arguments in Python",
        "description": "Implement overloaded methods with different parameter types, counts, and orders in Java. Compare with Python dynamic argument handling.",
        "estimated_minutes": 45,
        "subject": "Java & Python",
        "topic": "Scope & Recursion",
        "curriculum_task_key": "D09-T01"
      },
      {
        "task_title": "Call Stack Visualization with Basic Recursion",
        "description": "Write recursive functions for factorial and sum of natural numbers. Draw activation record stack frames showing push and pop sequence.",
        "estimated_minutes": 45,
        "subject": "Logical Thinking",
        "topic": "Scope & Recursion",
        "curriculum_task_key": "D09-T02"
      }
    ]
  },
  {
    "day_number": 10,
    "study_date": "2026-11-29",
    "week_number": 2,
    "week_title": "Week 2: Functions, Strings, Arrays & OOP",
    "title": "Strings, String Constant Pool & StringBuilder Internals",
    "subject": "Java & Python",
    "topic": "Strings",
    "outcome": "Prevent string concatenation performance bottlenecks by understanding immutability and mutable builders.",
    "tasks": [
      {
        "task_title": "Java String Immutability & String Constant Pool",
        "description": "Analyze string allocation with literals vs new String(). Verify identity equality (==) vs semantic equality (.equals()).",
        "estimated_minutes": 50,
        "subject": "Java",
        "topic": "Strings",
        "curriculum_task_key": "D10-T01"
      },
      {
        "task_title": "StringBuilder vs StringBuffer Performance Benchmarking",
        "description": "Benchmark appending 100,000 characters using String (+ operator) vs StringBuilder vs StringBuffer. Record execution time differences.",
        "estimated_minutes": 40,
        "subject": "Java",
        "topic": "Strings",
        "curriculum_task_key": "D10-T02"
      },
      {
        "task_title": "Python String Slicing, Inversion & Built-ins",
        "description": "Practice string slicing [start:stop:step], palindrome checks, strip(), split(), join(), and regex match basics in Python.",
        "estimated_minutes": 30,
        "subject": "Python",
        "topic": "Strings",
        "curriculum_task_key": "D10-T03"
      }
    ]
  },
  {
    "day_number": 11,
    "study_date": "2026-11-30",
    "week_number": 2,
    "week_title": "Week 2: Functions, Strings, Arrays & OOP",
    "title": "1D Arrays, Contiguous Memory & Dynamic Lists",
    "subject": "Programming",
    "topic": "Arrays & Lists",
    "outcome": "Understand contiguous index memory addressing, time complexities of array insertions, and dynamic list growth.",
    "tasks": [
      {
        "task_title": "Java 1D Arrays: Memory Layout & Primitive Traversals",
        "description": "Declare, allocate, and initialize primitive arrays. Implement linear traversal, element insertion at index, and element deletion with shifting.",
        "estimated_minutes": 50,
        "subject": "Java",
        "topic": "Arrays & Lists",
        "curriculum_task_key": "D11-T01"
      },
      {
        "task_title": "Java ArrayList vs Python List Dynamic Resizing",
        "description": "Study geometric resizing mechanics (growth factor 1.5 in Java, amortized O(1) appending). Implement CRUD operations on ArrayList.",
        "estimated_minutes": 45,
        "subject": "Programming",
        "topic": "Arrays & Lists",
        "curriculum_task_key": "D11-T02"
      }
    ]
  },
  {
    "day_number": 12,
    "study_date": "2026-12-01",
    "week_number": 2,
    "week_title": "Week 2: Functions, Strings, Arrays & OOP",
    "title": "2D Arrays, Matrices & Spatial Coordinate Traversals",
    "subject": "Programming",
    "topic": "2D Arrays",
    "outcome": "Navigate multidimensional arrays, row-major vs column-major orders, and matrix transformations.",
    "tasks": [
      {
        "task_title": "2D Array Representation: Row-Major & Jagged Arrays",
        "description": "Create rectangular and jagged (ragged) arrays in Java. Calculate row-wise sum, column-wise sum, and main/anti-diagonal sums.",
        "estimated_minutes": 50,
        "subject": "Java",
        "topic": "2D Arrays",
        "curriculum_task_key": "D12-T01"
      },
      {
        "task_title": "Matrix Operations: Transpose & Boundary Traversal",
        "description": "Implement in-place square matrix transposition. Write an algorithm to print the boundary elements of an N x M matrix clockwise.",
        "estimated_minutes": 50,
        "subject": "Programming",
        "topic": "2D Arrays",
        "curriculum_task_key": "D12-T02"
      }
    ]
  },
  {
    "day_number": 13,
    "study_date": "2026-12-02",
    "week_number": 2,
    "week_title": "Week 2: Functions, Strings, Arrays & OOP",
    "title": "OOP Foundations: Classes, Objects, this & Constructors",
    "subject": "OOP Core",
    "topic": "Classes & Objects",
    "outcome": "Model real-world entities into classes, enforce constructor initialization, and manage object references.",
    "tasks": [
      {
        "task_title": "Java Class Architecture, Heap Instantiation & this Keyword",
        "description": "Design a Student class with fields, default and parameterized constructors, constructor chaining using this(), and toString() override.",
        "estimated_minutes": 60,
        "subject": "Java",
        "topic": "Classes & Objects",
        "curriculum_task_key": "D13-T01"
      },
      {
        "task_title": "Python OOP: __init__, self & Class vs Instance Variables",
        "description": "Implement the equivalent class in Python using __init__ and self. Demonstrate the crucial difference between class-level and instance-level attributes.",
        "estimated_minutes": 45,
        "subject": "Python",
        "topic": "Classes & Objects",
        "curriculum_task_key": "D13-T02"
      }
    ]
  },
  {
    "day_number": 14,
    "study_date": "2026-12-03",
    "week_number": 2,
    "week_title": "Week 2: Functions, Strings, Arrays & OOP",
    "title": "Encapsulation, Inheritance & Week 2 Coding Test",
    "subject": "OOP Core",
    "topic": "OOP Mastery Test",
    "outcome": "Implement data hiding with private fields and getters/setters, build inheritance hierarchies with super(), and verify with a test.",
    "tasks": [
      {
        "task_title": "Encapsulation & Access Modifiers (public, protected, default, private)",
        "description": "Enforce invariants in a BankAccount class using private fields, validation inside setters, and controlled withdrawal logic.",
        "estimated_minutes": 40,
        "subject": "OOP Core",
        "topic": "OOP Mastery Test",
        "curriculum_task_key": "D14-T01"
      },
      {
        "task_title": "Inheritance Hierarchies & super Constructor Calls",
        "description": "Extend BankAccount into SavingsAccount and CheckingAccount. Use super() for constructor propagation and override calculateInterest().",
        "estimated_minutes": 40,
        "subject": "OOP Core",
        "topic": "OOP Mastery Test",
        "curriculum_task_key": "D14-T02"
      },
      {
        "task_title": "Week 2 Comprehensive Coding Assessment",
        "description": "Build a small CLI Library Management System in Java: Book class, Member class, and Library catalog with borrow/return business logic.",
        "estimated_minutes": 60,
        "subject": "Revision Test",
        "topic": "OOP Mastery Test",
        "curriculum_task_key": "D14-T03"
      }
    ]
  },
  {
    "day_number": 15,
    "study_date": "2026-12-04",
    "week_number": 3,
    "week_title": "Week 3: DSA Arrays & Strings",
    "title": "Array Traversal, Extreme Values & In-Place Reversal",
    "subject": "DSA (Java)",
    "topic": "Arrays Traversal",
    "outcome": "Solve fundamental linear array problems in O(n) time and O(1) auxiliary space.",
    "tasks": [
      {
        "task_title": "Maximum & Minimum Element in Single Pass",
        "description": "Find max and min values in array using minimum number of comparisons (divide and conquer or pairwise comparison approach).",
        "estimated_minutes": 45,
        "subject": "DSA (Java)",
        "topic": "Arrays Traversal",
        "curriculum_task_key": "D15-T01"
      },
      {
        "task_title": "In-Place Array Reversal with Two Pointers",
        "description": "Implement array reversal swapping elements at low and high indices until convergence. Prove O(n/2) time and O(1) space.",
        "estimated_minutes": 45,
        "subject": "DSA (Java)",
        "topic": "Arrays Traversal",
        "curriculum_task_key": "D15-T02"
      }
    ]
  },
  {
    "day_number": 16,
    "study_date": "2026-12-05",
    "week_number": 3,
    "week_title": "Week 3: DSA Arrays & Strings",
    "title": "Second Largest Element & Array Rotations",
    "subject": "DSA (Java)",
    "topic": "Array Rotation",
    "outcome": "Extract second order statistics in a single pass without sorting and rotate arrays efficiently.",
    "tasks": [
      {
        "task_title": "Second Largest & Second Smallest Element (Single Pass)",
        "description": "Find second largest element in O(n) without sorting. Handle arrays with duplicate maximum values and edge cases (size < 2).",
        "estimated_minutes": 50,
        "subject": "DSA (Java)",
        "topic": "Array Rotation",
        "curriculum_task_key": "D16-T01"
      },
      {
        "task_title": "Rotate Array by K Elements (Reversal Algorithm)",
        "description": "Rotate array to the right by K steps in O(n) time and O(1) space using the 3-step reversal algorithm: reverse all, reverse first K, reverse remaining.",
        "estimated_minutes": 50,
        "subject": "DSA (Java)",
        "topic": "Array Rotation",
        "curriculum_task_key": "D16-T02"
      }
    ]
  },
  {
    "day_number": 17,
    "study_date": "2026-12-06",
    "week_number": 3,
    "week_title": "Week 3: DSA Arrays & Strings",
    "title": "Frequency Counting, In-Place Hashing & Majority Element",
    "subject": "DSA (Java/Python)",
    "topic": "Frequency Counting",
    "outcome": "Tally frequencies using fixed-size direct-address tables and Boyer-Moore voting logic.",
    "tasks": [
      {
        "task_title": "Character & Integer Frequency Arrays",
        "description": "Tally lowercase character frequencies using int[26] array. Solve: First non-repeating character in a string in O(n) time.",
        "estimated_minutes": 45,
        "subject": "DSA (Java)",
        "topic": "Frequency Counting",
        "curriculum_task_key": "D17-T01"
      },
      {
        "task_title": "Boyer-Moore Majority Voting Algorithm",
        "description": "Solve LeetCode 169 (Majority Element > N/2) in O(n) time and O(1) space using candidate counter cancellation. Prove correctness mathematically.",
        "estimated_minutes": 55,
        "subject": "DSA (Java)",
        "topic": "Frequency Counting",
        "curriculum_task_key": "D17-T02"
      }
    ]
  },
  {
    "day_number": 18,
    "study_date": "2026-12-07",
    "week_number": 3,
    "week_title": "Week 3: DSA Arrays & Strings",
    "title": "Two Pointers: Converging Boundaries Pattern",
    "subject": "DSA (Java)",
    "topic": "Two Pointers",
    "outcome": "Eliminate nested loops using opposite-direction two pointers on sorted and monotonic arrays.",
    "tasks": [
      {
        "task_title": "Two Sum II on Sorted Array",
        "description": "Implement two-pointer search for target sum on a sorted array in O(n) time and O(1) space. Explain why sorting enables monotonic pointer movement.",
        "estimated_minutes": 45,
        "subject": "DSA (Java)",
        "topic": "Two Pointers",
        "curriculum_task_key": "D18-T01"
      },
      {
        "task_title": "Container With Most Water (LeetCode 11)",
        "description": "Implement two pointers starting at opposite boundaries. Move the pointer with the shorter vertical line inward. Write formal proof of greedy choice.",
        "estimated_minutes": 55,
        "subject": "DSA (Java)",
        "topic": "Two Pointers",
        "curriculum_task_key": "D18-T02"
      }
    ]
  },
  {
    "day_number": 19,
    "study_date": "2026-12-08",
    "week_number": 3,
    "week_title": "Week 3: DSA Arrays & Strings",
    "title": "Two Pointers: Partitioning & Dutch National Flag",
    "subject": "DSA (Java)",
    "topic": "Partitioning & Sorting Colors",
    "outcome": "Partition arrays in place using three-way pointers and multi-index partitioning.",
    "tasks": [
      {
        "task_title": "Move Zeroes to End in Place",
        "description": "Maintain relative order of non-zero elements while moving all zeros to end. Solve in O(n) time with single pass reader-writer pointers.",
        "estimated_minutes": 40,
        "subject": "DSA (Java)",
        "topic": "Partitioning & Sorting Colors",
        "curriculum_task_key": "D19-T01"
      },
      {
        "task_title": "Dutch National Flag Algorithm (Sort Colors - 0s, 1s, 2s)",
        "description": "Implement 3-pointer partition (low, mid, high) to sort an array of 0s, 1s, and 2s in single pass O(n) time and O(1) space (LeetCode 75).",
        "estimated_minutes": 60,
        "subject": "DSA (Java)",
        "topic": "Partitioning & Sorting Colors",
        "curriculum_task_key": "D19-T02"
      }
    ]
  },
  {
    "day_number": 20,
    "study_date": "2026-12-09",
    "week_number": 3,
    "week_title": "Week 3: DSA Arrays & Strings",
    "title": "Sliding Window Pattern: Fixed Window Size K",
    "subject": "DSA (Java)",
    "topic": "Sliding Window (Fixed)",
    "outcome": "Avoid redundant recalculations across sub-arrays by adding incoming and subtracting outgoing elements.",
    "tasks": [
      {
        "task_title": "Maximum Sum Subarray of Size K",
        "description": "Calculate first window sum of size K. Slide window by adding array[i] and subtracting array[i-K]. Compare O(n) sliding with O(n*k) brute force.",
        "estimated_minutes": 45,
        "subject": "DSA (Java)",
        "topic": "Sliding Window (Fixed)",
        "curriculum_task_key": "D20-T01"
      },
      {
        "task_title": "First Negative Integer in Every Window of Size K",
        "description": "Use a sliding window with a queue or pointer to track the index of the first negative number in each continuous window of size K.",
        "estimated_minutes": 55,
        "subject": "DSA (Java)",
        "topic": "Sliding Window (Fixed)",
        "curriculum_task_key": "D20-T02"
      }
    ]
  },
  {
    "day_number": 21,
    "study_date": "2026-12-10",
    "week_number": 3,
    "week_title": "Week 3: DSA Arrays & Strings",
    "title": "Sliding Window (Variable Size) & Anagram Verification",
    "subject": "DSA (Java)",
    "topic": "Sliding Window & Anagrams",
    "outcome": "Dynamically expand and shrink windows to solve longest/shortest substring constraints.",
    "tasks": [
      {
        "task_title": "Longest Substring Without Repeating Characters (LeetCode 3)",
        "description": "Implement variable sliding window with a character index map. When duplicate is seen, slide left pointer past its last occurrence.",
        "estimated_minutes": 60,
        "subject": "DSA (Java)",
        "topic": "Sliding Window & Anagrams",
        "curriculum_task_key": "D21-T01"
      },
      {
        "task_title": "Find All Anagrams in a String (LeetCode 438)",
        "description": "Use a fixed window of pattern length with two frequency arrays. Compare character frequencies in O(1) per slide step.",
        "estimated_minutes": 60,
        "subject": "DSA (Java)",
        "topic": "Sliding Window & Anagrams",
        "curriculum_task_key": "D21-T02"
      }
    ]
  },
  {
    "day_number": 22,
    "study_date": "2026-12-11",
    "week_number": 4,
    "week_title": "Week 4: Core DSA Patterns",
    "title": "Linear & Binary Search Fundamentals",
    "subject": "DSA (Java)",
    "topic": "Binary Search Core",
    "outcome": "Implement overflow-safe binary search and identify upper and lower bound insertion points.",
    "tasks": [
      {
        "task_title": "Binary Search Implementation & Integer Overflow Safe Mid",
        "description": "Implement iterative and recursive binary search on sorted arrays. Explain why mid = low + (high - low)/2 prevents integer overflow in Java.",
        "estimated_minutes": 45,
        "subject": "DSA (Java)",
        "topic": "Binary Search Core",
        "curriculum_task_key": "D22-T01"
      },
      {
        "task_title": "Lower Bound & Upper Bound Algorithms",
        "description": "Code lower_bound (first element >= target) and upper_bound (first element > target). Solve: Find first and last position of element in sorted array.",
        "estimated_minutes": 55,
        "subject": "DSA (Java)",
        "topic": "Binary Search Core",
        "curriculum_task_key": "D22-T02"
      }
    ]
  },
  {
    "day_number": 23,
    "study_date": "2026-12-12",
    "week_number": 4,
    "week_title": "Week 4: Core DSA Patterns",
    "title": "Advanced Binary Search: Search in Rotated Sorted Arrays",
    "subject": "DSA (Java)",
    "topic": "Binary Search Advanced",
    "outcome": "Detect sorted vs unsorted halves in rotated arrays to maintain O(log n) time.",
    "tasks": [
      {
        "task_title": "Search in Rotated Sorted Array (LeetCode 33)",
        "description": "Determine which half (left or right) is strictly sorted. Check if target falls within the sorted half boundaries to prune search space.",
        "estimated_minutes": 60,
        "subject": "DSA (Java)",
        "topic": "Binary Search Advanced",
        "curriculum_task_key": "D23-T01"
      },
      {
        "task_title": "Find Minimum in Rotated Sorted Array & Peak Element",
        "description": "Implement binary search for inflection pivot point (LeetCode 153). Solve LeetCode 162 (Find Peak Element) using slope comparison.",
        "estimated_minutes": 50,
        "subject": "DSA (Java)",
        "topic": "Binary Search Advanced",
        "curriculum_task_key": "D23-T02"
      }
    ]
  },
  {
    "day_number": 24,
    "study_date": "2026-12-13",
    "week_number": 4,
    "week_title": "Week 4: Core DSA Patterns",
    "title": "Elementary Sorting Algorithms: Bubble, Selection & Insertion",
    "subject": "DSA (Java)",
    "topic": "Elementary Sorting",
    "outcome": "Analyze stability, in-place sorting properties, and best/average/worst case complexities.",
    "tasks": [
      {
        "task_title": "Bubble Sort with Early Exit Flag & Selection Sort",
        "description": "Code Bubble Sort with a swapped boolean flag (O(n) best case). Code Selection Sort and explain why it is inherently unstable.",
        "estimated_minutes": 50,
        "subject": "DSA (Java)",
        "topic": "Elementary Sorting",
        "curriculum_task_key": "D24-T01"
      },
      {
        "task_title": "Insertion Sort & Stability Mechanics",
        "description": "Implement Insertion Sort by shifting elements into sorted sub-array. Explain why it is preferred for small or nearly sorted arrays.",
        "estimated_minutes": 45,
        "subject": "DSA (Java)",
        "topic": "Elementary Sorting",
        "curriculum_task_key": "D24-T02"
      }
    ]
  },
  {
    "day_number": 25,
    "study_date": "2026-12-14",
    "week_number": 4,
    "week_title": "Week 4: Core DSA Patterns",
    "title": "Divide & Conquer: Merge Sort Implementation & Complexity",
    "subject": "DSA (Java)",
    "topic": "Merge Sort",
    "outcome": "Implement recursive merge sort, merge two sorted halves in O(n), and prove O(n log n) complexity.",
    "tasks": [
      {
        "task_title": "Merge Subroutine Implementation",
        "description": "Write the standalone merge(arr, low, mid, high) method with temporary buffer arrays. Handle remaining left and right array elements.",
        "estimated_minutes": 50,
        "subject": "DSA (Java)",
        "topic": "Merge Sort",
        "curriculum_task_key": "D25-T01"
      },
      {
        "task_title": "Recursive MergeSort & Recurrence Tree Analysis",
        "description": "Write recursive mergeSort(arr, low, high). Draw recurrence tree T(n) = 2T(n/2) + O(n). Analyze O(n) auxiliary space requirement.",
        "estimated_minutes": 55,
        "subject": "DSA (Java)",
        "topic": "Merge Sort",
        "curriculum_task_key": "D25-T02"
      }
    ]
  },
  {
    "day_number": 26,
    "study_date": "2026-12-15",
    "week_number": 4,
    "week_title": "Week 4: Core DSA Patterns",
    "title": "Hash Tables, Collision Resolution & Two Sum",
    "subject": "DSA (Java/Python)",
    "topic": "Hashing Internals",
    "outcome": "Understand hash codes, bucket indexing, collision resolution (chaining vs open addressing), and load factor.",
    "tasks": [
      {
        "task_title": "Java HashMap Internals: Hash, Buckets, Treeify Threshold",
        "description": "Study how Java HashMap handles collisions with linked list nodes and treeifies into Red-Black trees when bucket length >= 8.",
        "estimated_minutes": 50,
        "subject": "Java",
        "topic": "Hashing Internals",
        "curriculum_task_key": "D26-T01"
      },
      {
        "task_title": "Two Sum & Longest Consecutive Sequence (LeetCode 128)",
        "description": "Solve LeetCode 1 (Two Sum) with one-pass HashMap in O(n). Solve LeetCode 128 using HashSet lookup only checking streak roots (num - 1 not in set).",
        "estimated_minutes": 60,
        "subject": "DSA (Java)",
        "topic": "Hashing Internals",
        "curriculum_task_key": "D26-T02"
      }
    ]
  },
  {
    "day_number": 27,
    "study_date": "2026-12-16",
    "week_number": 4,
    "week_title": "Week 4: Core DSA Patterns",
    "title": "Recursion Fundamentals & Backtracking Prelude",
    "subject": "DSA (Java)",
    "topic": "Recursion",
    "outcome": "Construct unambiguous base cases, trust recursive sub-problems, and explore search trees.",
    "tasks": [
      {
        "task_title": "Recursion Call Stack & Tail Recursion",
        "description": "Trace recursive calculations for power(x, n) in O(log n) time. Contrast tail call optimization in compilers vs JVM non-tail optimization.",
        "estimated_minutes": 45,
        "subject": "DSA (Java)",
        "topic": "Recursion",
        "curriculum_task_key": "D27-T01"
      },
      {
        "task_title": "Subsets & Subsequences Generation (Pick / Don't Pick)",
        "description": "Generate all subsequences of a string or array using the binary inclusion/exclusion tree pattern. Verify 2^n total leaf states.",
        "estimated_minutes": 55,
        "subject": "DSA (Java)",
        "topic": "Recursion",
        "curriculum_task_key": "D27-T02"
      }
    ]
  },
  {
    "day_number": 28,
    "study_date": "2026-12-17",
    "week_number": 4,
    "week_title": "Week 4: Core DSA Patterns",
    "title": "Singly Linked Lists: Node Class, Traversal & Reversal",
    "subject": "DSA (Java)",
    "topic": "Linked Lists",
    "outcome": "Manipulate heap pointers without losing head references, detect cycles, and reverse nodes.",
    "tasks": [
      {
        "task_title": "Singly Linked List CRUD Operations",
        "description": "Implement ListNode class. Write methods to insert at head, insert at tail, delete by value, and traverse nodes iteratively.",
        "estimated_minutes": 50,
        "subject": "DSA (Java)",
        "topic": "Linked Lists",
        "curriculum_task_key": "D28-T01"
      },
      {
        "task_title": "Reverse a Linked List (Iterative 3-Pointer Approach)",
        "description": "Reverse linked list in O(n) time and O(1) space maintaining prev, curr, and next pointers (LeetCode 206). Write iterative and recursive solutions.",
        "estimated_minutes": 40,
        "subject": "DSA (Java)",
        "topic": "Linked Lists",
        "curriculum_task_key": "D28-T02"
      },
      {
        "task_title": "Middle of Linked List & Floyd's Cycle Detection",
        "description": "Find middle node using slow and fast pointers. Solve LeetCode 141 (Linked List Cycle detection) using Floyd's Tortoise and Hare algorithm.",
        "estimated_minutes": 45,
        "subject": "DSA (Java)",
        "topic": "Linked Lists",
        "curriculum_task_key": "D28-T03"
      }
    ]
  },
  {
    "day_number": 29,
    "study_date": "2026-12-18",
    "week_number": 5,
    "week_title": "Week 5: Web & Full-Stack Architecture",
    "title": "Git Version Control & GitHub Collaborative Workflows",
    "subject": "Web Fundamentals",
    "topic": "Git & GitHub",
    "outcome": "Execute professional branching models, resolve merge conflicts, and manage repository state cleanly.",
    "tasks": [
      {
        "task_title": "Git Internal Architecture: Commits, Blobs, Trees & HEAD",
        "description": "Explore the .git directory. Practice staging, unstaging, atomic committing, commit hashing (SHA-1), and log inspection with graph format.",
        "estimated_minutes": 45,
        "subject": "Web Fundamentals",
        "topic": "Git & GitHub",
        "curriculum_task_key": "D29-T01"
      },
      {
        "task_title": "Branching, Merging & Merge Conflict Resolution",
        "description": "Create feature branches. Deliberately induce a merge conflict on the same file lines across two branches, resolve markers, and commit merge.",
        "estimated_minutes": 45,
        "subject": "Web Fundamentals",
        "topic": "Git & GitHub",
        "curriculum_task_key": "D29-T02"
      }
    ]
  },
  {
    "day_number": 30,
    "study_date": "2026-12-19",
    "week_number": 5,
    "week_title": "Week 5: Web & Full-Stack Architecture",
    "title": "Node.js Runtime, npm Ecosystem & Project File Organization",
    "subject": "Web Fundamentals",
    "topic": "Node.js & npm",
    "outcome": "Understand event loop non-blocking I/O, semantic versioning in package.json, and structured repository modularity.",
    "tasks": [
      {
        "task_title": "Node.js Modules: CommonJS (require) vs ES Modules (import)",
        "description": "Build modular scripts demonstrating exports and module.exports vs export default and named imports. Understand package.json \"type\": \"module\".",
        "estimated_minutes": 40,
        "subject": "Web Fundamentals",
        "topic": "Node.js & npm",
        "curriculum_task_key": "D30-T01"
      },
      {
        "task_title": "Optional Project Tracing: Analyzing Real Repository Layouts",
        "description": "Pick an open-source or personal web project. Inspect its root folder: package.json dependencies vs devDependencies, client vs server directories, and config files.",
        "estimated_minutes": 50,
        "subject": "Web Fundamentals",
        "topic": "Node.js & npm",
        "curriculum_task_key": "D30-T02"
      }
    ]
  },
  {
    "day_number": 31,
    "study_date": "2026-12-20",
    "week_number": 5,
    "week_title": "Week 5: Web & Full-Stack Architecture",
    "title": "React Core: JSX, Virtual DOM & Component Hierarchy",
    "subject": "Frontend",
    "topic": "React Core",
    "outcome": "Build declarative UIs with JSX, pass props immutably, and maintain clean component trees.",
    "tasks": [
      {
        "task_title": "JSX Compilation & Virtual DOM Reconciliation",
        "description": "Examine how JSX compiles to React.createElement. Understand Virtual DOM diffing algorithm and why key props are mandatory for lists.",
        "estimated_minutes": 45,
        "subject": "Frontend",
        "topic": "React Core",
        "curriculum_task_key": "D31-T01"
      },
      {
        "task_title": "Component Decomposition & Props Passing",
        "description": "Create a reusable card component accepting props (title, subtitle, badge, children). Practice conditional rendering using ternary operators and logical AND (&&).",
        "estimated_minutes": 45,
        "subject": "Frontend",
        "topic": "React Core",
        "curriculum_task_key": "D31-T02"
      }
    ]
  },
  {
    "day_number": 32,
    "study_date": "2026-12-21",
    "week_number": 5,
    "week_title": "Week 5: Web & Full-Stack Architecture",
    "title": "React State Management: useState, useEffect & Controlled Forms",
    "subject": "Frontend",
    "topic": "React Hooks",
    "outcome": "Manage local state immutably and coordinate side-effects with proper dependency arrays.",
    "tasks": [
      {
        "task_title": "useState Batching & Functional Updates",
        "description": "Demonstrate asynchronous state updates in React. Write counter and list mutation examples using functional state updates (prev => ...).",
        "estimated_minutes": 45,
        "subject": "Frontend",
        "topic": "React Hooks",
        "curriculum_task_key": "D32-T01"
      },
      {
        "task_title": "useEffect Lifecycle, Dependency Pitfalls & Cleanup Functions",
        "description": "Implement an active window resize listener and an interval timer. Write cleanup functions to prevent memory leaks. Explain empty [] vs dependent arrays.",
        "estimated_minutes": 55,
        "subject": "Frontend",
        "topic": "React Hooks",
        "curriculum_task_key": "D32-T02"
      }
    ]
  },
  {
    "day_number": 33,
    "study_date": "2026-12-22",
    "week_number": 5,
    "week_title": "Week 5: Web & Full-Stack Architecture",
    "title": "React Hook Optimization & Service API Integration",
    "subject": "Frontend",
    "topic": "API Integration & Hooks",
    "outcome": "Decouple network fetch logic into reusable service layers and optimize renders with useMemo/useCallback.",
    "tasks": [
      {
        "task_title": "useRef, useMemo & useCallback Performance Roles",
        "description": "Use useRef for persisting DOM element focus without triggering re-render. Demonstrate when useMemo and useCallback genuinely prevent child re-evaluations.",
        "estimated_minutes": 50,
        "subject": "Frontend",
        "topic": "API Integration & Hooks",
        "curriculum_task_key": "D33-T01"
      },
      {
        "task_title": "Decoupled API Service Layer & Custom useFetch Hook",
        "description": "Write a clean custom hook useFetch(url) that encapsulates loading, error, and data states. Practice aborting unmounted requests with AbortController.",
        "estimated_minutes": 50,
        "subject": "Frontend",
        "topic": "API Integration & Hooks",
        "curriculum_task_key": "D33-T02"
      }
    ]
  },
  {
    "day_number": 34,
    "study_date": "2026-12-23",
    "week_number": 5,
    "week_title": "Week 5: Web & Full-Stack Architecture",
    "title": "Express Server Architecture, Routes & Middleware",
    "subject": "Backend",
    "topic": "Express Server & Routes",
    "outcome": "Construct an HTTP REST API server with modular routing, body parsing, and centralized error handling.",
    "tasks": [
      {
        "task_title": "Express Server Initialization & Route Handlers",
        "description": "Initialize an Express application with express.json(). Define GET, POST, PUT, DELETE endpoints with route parameters (req.params) and query strings (req.query).",
        "estimated_minutes": 50,
        "subject": "Backend",
        "topic": "Express Server & Routes",
        "curriculum_task_key": "D34-T01"
      },
      {
        "task_title": "Middleware Execution Pipeline & Error Handling",
        "description": "Write custom logging middleware, auth check middleware (bearer token verification), and a 4-parameter centralized error-handling middleware (err, req, res, next).",
        "estimated_minutes": 50,
        "subject": "Backend",
        "topic": "Express Server & Routes",
        "curriculum_task_key": "D34-T02"
      }
    ]
  },
  {
    "day_number": 35,
    "study_date": "2026-12-24",
    "week_number": 5,
    "week_title": "Week 5: Web & Full-Stack Architecture",
    "title": "Full-Stack Data Flow & Request-to-Response Tracing",
    "subject": "Full-Stack Architecture",
    "topic": "Full-Stack Request Lifecycle",
    "outcome": "Trace and document the complete lifecycle of a web request from browser interaction through database and back.",
    "tasks": [
      {
        "task_title": "End-to-End Request Lifecycle Tracing",
        "description": "Map out the 7 stages: User Action in UI -> Service API call -> HTTP Network Packet -> Express Route -> Controller Logic -> Database Query -> JSON Response -> State update.",
        "estimated_minutes": 50,
        "subject": "Full-Stack Architecture",
        "topic": "Full-Stack Request Lifecycle",
        "curriculum_task_key": "D35-T01"
      },
      {
        "task_title": "Optional Hands-On Code Tracing Practice",
        "description": "Pick any full-stack feature from a codebase you have access to. Trace its exact file-to-file path: Component -> API service -> Route file -> Controller file -> Model file.",
        "estimated_minutes": 50,
        "subject": "Full-Stack Architecture",
        "topic": "Full-Stack Request Lifecycle",
        "curriculum_task_key": "D35-T02"
      }
    ]
  },
  {
    "day_number": 36,
    "study_date": "2026-12-25",
    "week_number": 6,
    "week_title": "Week 6: Databases, Spring Boot & LLD",
    "title": "Relational Database Foundations & SQL CRUD",
    "subject": "Databases",
    "topic": "SQL Fundamentals",
    "outcome": "Design normalized tables with primary/foreign keys and execute DDL/DML SQL statements.",
    "tasks": [
      {
        "task_title": "Relational Schemas, Constraints & DDL Commands",
        "description": "Write CREATE TABLE statements with PRIMARY KEY, FOREIGN KEY, NOT NULL, UNIQUE, and CHECK constraints. Practice ALTER TABLE and DROP TABLE.",
        "estimated_minutes": 45,
        "subject": "Databases",
        "topic": "SQL Fundamentals",
        "curriculum_task_key": "D36-T01"
      },
      {
        "task_title": "DML Core Operations: INSERT, SELECT, UPDATE & DELETE",
        "description": "Execute parameterized INSERT queries, conditional UPDATE statements with WHERE clauses, and safe DELETE operations. Understand the difference between DELETE and TRUNCATE.",
        "estimated_minutes": 45,
        "subject": "Databases",
        "topic": "SQL Fundamentals",
        "curriculum_task_key": "D36-T02"
      }
    ]
  },
  {
    "day_number": 37,
    "study_date": "2026-12-26",
    "week_number": 6,
    "week_title": "Week 6: Databases, Spring Boot & LLD",
    "title": "Advanced SQL: Filtering, Aggregations & Joins",
    "subject": "Databases",
    "topic": "SQL Joins & Aggregates",
    "outcome": "Write multi-table relational queries using INNER, LEFT, RIGHT JOINs and grouped aggregations.",
    "tasks": [
      {
        "task_title": "Aggregate Functions, GROUP BY & HAVING Clauses",
        "description": "Write queries combining COUNT, SUM, AVG, MIN, MAX with GROUP BY. Explain the critical difference between WHERE (row filter) and HAVING (group filter).",
        "estimated_minutes": 50,
        "subject": "Databases",
        "topic": "SQL Joins & Aggregates",
        "curriculum_task_key": "D37-T01"
      },
      {
        "task_title": "Relational Joins: INNER, LEFT, RIGHT & FULL OUTER",
        "description": "Join two tables (Customers and Orders). Write queries matching customers with orders, customers without orders (LEFT JOIN with WHERE orders.id IS NULL), and self-joins.",
        "estimated_minutes": 55,
        "subject": "Databases",
        "topic": "SQL Joins & Aggregates",
        "curriculum_task_key": "D37-T02"
      }
    ]
  },
  {
    "day_number": 38,
    "study_date": "2026-12-27",
    "week_number": 6,
    "week_title": "Week 6: Databases, Spring Boot & LLD",
    "title": "NoSQL Architecture & MongoDB CRUD Operations",
    "subject": "Databases",
    "topic": "MongoDB & NoSQL",
    "outcome": "Model flexible document data structures in BSON and execute database queries using MongoDB syntax.",
    "tasks": [
      {
        "task_title": "Document Model vs Relational Tables",
        "description": "Compare BSON documents and collections against relational rows and tables. Contrast embedding (denormalization) vs referencing (normalization).",
        "estimated_minutes": 40,
        "subject": "Databases",
        "topic": "MongoDB & NoSQL",
        "curriculum_task_key": "D38-T01"
      },
      {
        "task_title": "MongoDB CRUD: insertOne, find, updateOne & deleteOne",
        "description": "Execute MongoDB queries with comparison operators ($gt, $in), logical operators ($and, $or), and atomic update operators ($set, $push, $inc).",
        "estimated_minutes": 50,
        "subject": "Databases",
        "topic": "MongoDB & NoSQL",
        "curriculum_task_key": "D38-T02"
      }
    ]
  },
  {
    "day_number": 39,
    "study_date": "2026-12-28",
    "week_number": 6,
    "week_title": "Week 6: Databases, Spring Boot & LLD",
    "title": "Spring Boot Foundations: IoC, Dependency Injection & Maven",
    "subject": "Backend (Java)",
    "topic": "Spring Boot & Maven",
    "outcome": "Understand Spring Framework core concepts: IoC container, bean lifecycles, and Maven project coordination.",
    "tasks": [
      {
        "task_title": "Spring Inversion of Control (IoC) & Dependency Injection (@Autowired)",
        "description": "Explain how the Spring IoC container instantiates and injects beans. Contrast constructor injection, setter injection, and field injection.",
        "estimated_minutes": 50,
        "subject": "Backend (Java)",
        "topic": "Spring Boot & Maven",
        "curriculum_task_key": "D39-T01"
      },
      {
        "task_title": "Maven pom.xml, Starters & Application Properties",
        "description": "Inspect pom.xml dependencies (spring-boot-starter-web, test). Configure server port, datasource, and active profiles in application.properties.",
        "estimated_minutes": 45,
        "subject": "Backend (Java)",
        "topic": "Spring Boot & Maven",
        "curriculum_task_key": "D39-T02"
      }
    ]
  },
  {
    "day_number": 40,
    "study_date": "2026-12-29",
    "week_number": 6,
    "week_title": "Week 6: Databases, Spring Boot & LLD",
    "title": "Spring Boot 3-Tier Layered Architecture & JPA Entities",
    "subject": "Backend (Java)",
    "topic": "Spring Boot Layers & JPA",
    "outcome": "Separate concerns across Controller, Service, and Repository layers using Spring Data JPA.",
    "tasks": [
      {
        "task_title": "Controller, Service & Repository Separation of Concerns",
        "description": "Implement @RestController with request mappings. Delegate business logic to a dedicated @Service class. Delegate database queries to a @Repository interface.",
        "estimated_minutes": 55,
        "subject": "Backend (Java)",
        "topic": "Spring Boot Layers & JPA",
        "curriculum_task_key": "D40-T01"
      },
      {
        "task_title": "JPA Entities & Spring Data JpaRepository",
        "description": "Map an entity with @Entity, @Id, @GeneratedValue, and @Column. Extend JpaRepository<Entity, Long> to access built-in findAll, findById, and save methods.",
        "estimated_minutes": 55,
        "subject": "Backend (Java)",
        "topic": "Spring Boot Layers & JPA",
        "curriculum_task_key": "D40-T02"
      }
    ]
  },
  {
    "day_number": 41,
    "study_date": "2026-12-30",
    "week_number": 6,
    "week_title": "Week 6: Databases, Spring Boot & LLD",
    "title": "Spring Boot REST CRUD API & Authentication Concepts",
    "subject": "Backend (Java)",
    "topic": "Spring Boot REST & Auth",
    "outcome": "Build production-style RESTful endpoints with DTO validation and understand stateless JWT authentication.",
    "tasks": [
      {
        "task_title": "RESTful CRUD Endpoints with ResponseEntity & DTOs",
        "description": "Implement full CRUD: POST (/api/items), GET (/api/items/{id}), PUT, and DELETE. Use ResponseEntity to return explicit HTTP status codes (201 Created, 404 Not Found).",
        "estimated_minutes": 60,
        "subject": "Backend (Java)",
        "topic": "Spring Boot REST & Auth",
        "curriculum_task_key": "D41-T01"
      },
      {
        "task_title": "Authentication Concepts: Session-Based vs Stateless JWT",
        "description": "Study how stateless token authentication works: Header, Payload, Signature. Trace how an Authorization: Bearer <token> header protects REST resources.",
        "estimated_minutes": 45,
        "subject": "Backend (Java)",
        "topic": "Spring Boot REST & Auth",
        "curriculum_task_key": "D41-T02"
      }
    ]
  },
  {
    "day_number": 42,
    "study_date": "2026-12-31",
    "week_number": 6,
    "week_title": "Week 6: Databases, Spring Boot & LLD",
    "title": "Low-Level System Design (LLD), UML & SOLID Principles",
    "subject": "System Design",
    "topic": "LLD & SOLID Principles",
    "outcome": "Synthesize all 42 days of preparation by modeling extensible software systems using OOP relationships and SOLID principles.",
    "tasks": [
      {
        "task_title": "Class Relationships: Association, Aggregation & Composition",
        "description": "Illustrate UML relationships with Java code: \"Uses-a\" (Dependency), \"Has-a\" (Aggregation vs strict lifecycle Composition), and \"Is-a\" (Inheritance).",
        "estimated_minutes": 50,
        "subject": "System Design",
        "topic": "LLD & SOLID Principles",
        "curriculum_task_key": "D42-T01"
      },
      {
        "task_title": "SOLID Principles in Practice",
        "description": "Code practical examples violating and resolving each SOLID rule: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.",
        "estimated_minutes": 50,
        "subject": "System Design",
        "topic": "LLD & SOLID Principles",
        "curriculum_task_key": "D42-T02"
      },
      {
        "task_title": "Final Placement Preparation Review & 42-Day Milestone Reflection",
        "description": "Complete comprehensive self-audit: Review DSA problem bank, check topics needing revision, log final study hours, and review progress reports.",
        "estimated_minutes": 40,
        "subject": "System Design",
        "topic": "LLD & SOLID Principles",
        "curriculum_task_key": "D42-T03"
      }
    ]
  }
];
