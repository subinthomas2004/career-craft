export interface QuizQuestion {
        id: number | string;
        question: string;
        options: string[];
        correct: number; // Index 0-3
        explanation?: string;
        difficulty: "Easy" | "Medium" | "Hard";
        topic: string;
}

export const SUBJECTS = [
        { id: "dsa", name: "Data Structures & Algorithms", icon: "🔢", totalQuestions: 150, color: "text-blue-500", gradient: "from-blue-500 to-cyan-500" },
        { id: "dbms", name: "Database Management", icon: "🗃️", totalQuestions: 150, color: "text-emerald-500", gradient: "from-emerald-500 to-green-500" },
        { id: "os", name: "Operating Systems", icon: "💻", totalQuestions: 146, color: "text-purple-500", gradient: "from-purple-500 to-pink-500" },
        { id: "cn", name: "Computer Networks", icon: "🌐", totalQuestions: 146, color: "text-orange-500", gradient: "from-orange-500 to-red-500" },
        { id: "oops", name: "Object-Oriented Programming", icon: "📦", totalQuestions: 146, color: "text-yellow-500", gradient: "from-yellow-500 to-amber-500" },
        { id: "web", name: "Web Development", icon: "🌍", totalQuestions: 146, color: "text-pink-500", gradient: "from-pink-500 to-rose-500" },
        { id: "cloud", name: "Cloud Computing", icon: "☁️", totalQuestions: 146, color: "text-sky-500", gradient: "from-sky-500 to-blue-500" },
        { id: "cyber", name: "Cybersecurity", icon: "🔒", totalQuestions: 146, color: "text-red-500", gradient: "from-red-500 to-rose-500" },
        { id: "ai", name: "Artificial Intelligence", icon: "🤖", totalQuestions: 98, color: "text-violet-500", gradient: "from-violet-500 to-purple-500" },
];

const TOPICS_MAP: Record<string, string[]> = {
        dsa: ["Arrays", "Linked Lists", "Stacks", "Queues", "Trees", "Graphs", "Sorting", "Searching", "Recursion", "DP"],
        dbms: ["SQL", "Normalization", "Transactions", "Indexing", "ER Models", "Relational Algebra", "NoSQL", "ACID Properties"],
        os: ["Process Management", "Memory Management", "File Systems", "Deadlocks", "Scheduling", "Virtualization", "Threads", "Linux Commands"],
        cn: ["OSI Model", "TCP/IP", "HTTP/HTTPS", "DNS", "Routing", "Security", "Wireless", "Network Topology"],
        oops: ["Classes & Objects", "Inheritance", "Polymorphism", "Encapsulation", "Abstraction", "Constructors", "Interfaces", "Design Patterns"],
        web: ["HTML/CSS", "JavaScript", "React", "Node.js", "API Design", "Security", "Performance", "Deployment"],
        cloud: ["Virtualization", "AWS Services", "Azure", "Docker", "Kubernetes", "Serverless", "Cloud Security", "Microservices"],
        cyber: ["Cryptography", "Network Security", "Malware", "Firewalls", "Ethical Hacking", "Phishing", "Identity Management", "Compliance"],
        ai: ["Machine Learning", "Neural Networks", "NLP", "Computer Vision", "Deep Learning", "Supervised Learning", "Reinforcement Learning", "Ethics in AI"]
};

// Generator for consistent random questions
function generateQuestions(subjectId: string, count: number): QuizQuestion[] {
        const questions: QuizQuestion[] = [];
        const topics = TOPICS_MAP[subjectId] || ["General"];
        const subjectName = SUBJECTS.find(s => s.id === subjectId)?.name || subjectId;

        for (let i = 0; i < count; i++) {
                const topic = topics[i % topics.length];

                // Randomize correct answer position (0-3)
                // We use a pseudo-random based on i to keep it deterministic for this demo if needed, 
                // or just Math.random() for true randomness if the list is regenerated.
                // Let's use simple Math.floor(Math.random() * 4) since this runs once on module load.
                // Actually, to keep it consistent for "Review" mapping if we reload, let's make it deterministic based on ID.
                const correctIndex = (i * 7) % 4;

                const difficulty: "Easy" | "Medium" | "Hard" = i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard";

                const correctContent = `The correct principle of ${topic} in ${subjectName}`;
                const distractors = [
                        `A plausible but incorrect statement about ${topic}`,
                        `A common misconception regarding ${topic}`,
                        `An unrelated concept from ${subjectName}`
                ];

                // Construct options array with correct answer at correctIndex
                const options = [...distractors];
                options.splice(correctIndex, 0, correctContent);

                questions.push({
                        id: i + 1,
                        question: `What is a key characteristic of ${topic} in the context of ${subjectName}?`,
                        options: options,
                        correct: correctIndex,
                        explanation: `Option ${String.fromCharCode(65 + correctIndex)} is correct because it accurately describes ${topic}. The other options are either unrelated or common misconceptions.`,
                        difficulty,
                        topic
                });
        }
        return questions;
}

// Generate 50 questions for each subject
export const quizData: Record<string, QuizQuestion[]> = {
        "dsa": [
                {
                        "id": 1,
                        "question": "What is the time complexity of binary search in a sorted array?",
                        "options": [
                                "O(n)",
                                "O(1)",
                                "O(log n)",
                                "O(n log n)"
                        ],
                        "correct": 2,
                        "explanation": "Binary search repeatedly divides the search space into halves. This logarithmic reduction results in O(log n) comparisons even for large arrays.",
                        "difficulty": "Medium",
                        "topic": "Searching"
                },
                {
                        "id": 2,
                        "question": "Which data structure uses LIFO order?",
                        "options": [
                                "Stack",
                                "Linked List",
                                "Heap",
                                "Queue"
                        ],
                        "correct": 0,
                        "explanation": "A stack removes the most recently inserted element first. This Last-In-First-Out behavior is essential for recursion and undo operations.",
                        "difficulty": "Easy",
                        "topic": "Data Structures"
                },
                {
                        "id": 3,
                        "question": "Which traversal gives sorted order in a BST?",
                        "options": [
                                "Preorder",
                                "Inorder",
                                "Level order",
                                "Postorder"
                        ],
                        "correct": 1,
                        "explanation": "Inorder traversal visits left subtree, root, then right subtree. In a BST, this sequence naturally produces values in ascending order.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 4,
                        "question": "Time complexity to insert at beginning of a singly linked list?",
                        "options": [
                                "O(1)",
                                "O(n log n)",
                                "O(log n)",
                                "O(n)"
                        ],
                        "correct": 0,
                        "explanation": "Inserting at the head only requires updating one pointer. No traversal is needed, making it constant time.",
                        "difficulty": "Easy",
                        "topic": "Linked Lists"
                },
                {
                        "id": 5,
                        "question": "Which data structure is best for implementing recursion?",
                        "options": [
                                "Tree",
                                "Graph",
                                "Queue",
                                "Stack"
                        ],
                        "correct": 3,
                        "explanation": "Recursion relies on the call stack to store function states. Each function call pushes a frame and pops it after execution.",
                        "difficulty": "Medium",
                        "topic": "Recursion"
                },
                {
                        "id": 6,
                        "question": "Worst-case time complexity of quicksort?",
                        "options": [
                                "O(n)",
                                "O(n²)",
                                "O(n log n)",
                                "O(log n)"
                        ],
                        "correct": 1,
                        "explanation": "If the pivot consistently divides the array unevenly, partitions become highly unbalanced. This leads to quadratic comparisons.",
                        "difficulty": "Hard",
                        "topic": "Sorting"
                },
                {
                        "id": 7,
                        "question": "Which data structure is used in BFS?",
                        "options": [
                                "Stack",
                                "Heap",
                                "Queue",
                                "Array"
                        ],
                        "correct": 2,
                        "explanation": "BFS explores nodes level by level. A queue ensures nodes are processed in the order they are discovered.",
                        "difficulty": "Medium",
                        "topic": "Graphs"
                },
                {
                        "id": 8,
                        "question": "Which sorting algorithm is stable?",
                        "options": [
                                "Quick sort",
                                "Selection sort",
                                "Merge sort",
                                "Heap sort"
                        ],
                        "correct": 2,
                        "explanation": "Merge sort maintains the relative order of equal elements during merging. Stability is important for multi-key sorting.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 9,
                        "question": "What is the height of a balanced binary tree with n nodes?",
                        "options": [
                                "O(log n)",
                                "O(n log n)",
                                "O(n)",
                                "O(1)"
                        ],
                        "correct": 0,
                        "explanation": "Balanced trees ensure that the height grows logarithmically with the number of nodes. This guarantees efficient search and insertion.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 10,
                        "question": "Which collision resolution uses linked lists?",
                        "options": [
                                "Double hashing",
                                "Open addressing",
                                "Chaining",
                                "Linear probing"
                        ],
                        "correct": 2,
                        "explanation": "Chaining stores multiple elements at the same hash index using a linked list. This avoids clustering seen in probing methods.",
                        "difficulty": "Hard",
                        "topic": "Hashing"
                },
                {
                        "id": 11,
                        "question": "Which algorithm finds shortest path in weighted graph (non-negative)?",
                        "options": [
                                "Prim’s",
                                "DFS",
                                "Dijkstra’s",
                                "Kruskal’s"
                        ],
                        "correct": 2,
                        "explanation": "Dijkstra’s algorithm selects the nearest unvisited vertex each step. It guarantees shortest paths when edge weights are non-negative.",
                        "difficulty": "Hard",
                        "topic": "Algorithms"
                },
                {
                        "id": 12,
                        "question": "Time complexity of accessing element in array?",
                        "options": [
                                "O(n log n)",
                                "O(1)",
                                "O(log n)",
                                "O(n)"
                        ],
                        "correct": 1,
                        "explanation": "Arrays allow direct indexing using memory offsets. This enables constant-time access regardless of size.",
                        "difficulty": "Easy",
                        "topic": "Arrays"
                },
                {
                        "id": 13,
                        "question": "Which data structure supports priority-based removal?",
                        "options": [
                                "Queue",
                                "Priority Queue",
                                "Stack",
                                "Linked List"
                        ],
                        "correct": 1,
                        "explanation": "A priority queue removes elements based on priority rather than insertion order. It is commonly implemented using heaps.",
                        "difficulty": "Medium",
                        "topic": "Heaps"
                },
                {
                        "id": 14,
                        "question": "Which traversal uses a queue internally?",
                        "options": [
                                "Postorder",
                                "Inorder",
                                "BFS",
                                "DFS"
                        ],
                        "correct": 2,
                        "explanation": "BFS processes nodes level by level using a queue. This ensures breadth-wise exploration.",
                        "difficulty": "Medium",
                        "topic": "Graphs"
                },
                {
                        "id": 15,
                        "question": "Time complexity of heap insert?",
                        "options": [
                                "O(n)",
                                "O(n log n)",
                                "O(log n)",
                                "O(1)"
                        ],
                        "correct": 2,
                        "explanation": "After insertion, the element may move up the tree to maintain heap order. This percolation takes logarithmic time.",
                        "difficulty": "Hard",
                        "topic": "Heaps"
                },
                {
                        "id": 16,
                        "question": "Which structure is best for undo operations?",
                        "options": [
                                "Graph",
                                "Tree",
                                "Stack",
                                "Queue"
                        ],
                        "correct": 2,
                        "explanation": "Undo operations reverse the most recent action first. Stacks naturally support this LIFO behavior.",
                        "difficulty": "Easy",
                        "topic": "Stacks"
                },
                {
                        "id": 17,
                        "question": "Which sorting algorithm selects minimum element each pass?",
                        "options": [
                                "Quick sort",
                                "Bubble sort",
                                "Merge sort",
                                "Selection sort"
                        ],
                        "correct": 3,
                        "explanation": "Selection sort repeatedly finds the smallest element from the unsorted portion. It then places it at the correct position.",
                        "difficulty": "Easy",
                        "topic": "Sorting"
                },
                {
                        "id": 18,
                        "question": "In hashing, what is load factor?",
                        "options": [
                                "Table size / elements",
                                "Elements / table size",
                                "Number of collisions",
                                "Hash function output"
                        ],
                        "correct": 1,
                        "explanation": "Load factor measures how full the hash table is. Higher load factors increase collision probability.",
                        "difficulty": "Hard",
                        "topic": "Hashing"
                },
                {
                        "id": 19,
                        "question": "Which tree is self-balancing?",
                        "options": [
                                "Binary Tree",
                                "AVL Tree",
                                "Heap",
                                "BST"
                        ],
                        "correct": 1,
                        "explanation": "AVL trees maintain balance using rotations after insertions and deletions. This ensures O(log n) operations.",
                        "difficulty": "Hard",
                        "topic": "Trees"
                },
                {
                        "id": 20,
                        "question": "Time complexity of DFS?",
                        "options": [
                                "O(V²)",
                                "O(E log V)",
                                "O(V + E)",
                                "O(log V)"
                        ],
                        "correct": 2,
                        "explanation": "DFS visits each vertex and explores each edge once. This results in linear complexity relative to graph size.",
                        "difficulty": "Medium",
                        "topic": "Graphs"
                },
                {
                        "id": 21,
                        "question": "Which data structure is best for implementing BFS in a tree?",
                        "options": [
                                "Queue",
                                "Heap",
                                "Array",
                                "Stack"
                        ],
                        "correct": 0,
                        "explanation": "BFS explores nodes level by level, requiring a structure that processes elements in arrival order. A queue ensures first-in-first-out processing.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 22,
                        "question": "Which algorithm builds a Minimum Spanning Tree?",
                        "options": [
                                "Dijkstra",
                                "Floyd-Warshall",
                                "Prim’s",
                                "Bellman-Ford"
                        ],
                        "correct": 2,
                        "explanation": "Prim’s algorithm grows the spanning tree by adding the smallest edge that connects a new vertex.",
                        "difficulty": "Hard",
                        "topic": "Graphs"
                },
                {
                        "id": 23,
                        "question": "What is the time complexity of merge sort?",
                        "options": [
                                "O(n)",
                                "O(n log n)",
                                "O(log n)",
                                "O(n²)"
                        ],
                        "correct": 1,
                        "explanation": "Merge sort divides the array into halves recursively and merges them in sorted order.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 24,
                        "question": "Which data structure follows FIFO order?",
                        "options": [
                                "Tree",
                                "Graph",
                                "Queue",
                                "Stack"
                        ],
                        "correct": 2,
                        "explanation": "A queue processes elements in the order they are inserted. This First-In-First-Out behavior is used in scheduling.",
                        "difficulty": "Easy",
                        "topic": "Data Structures"
                },
                {
                        "id": 25,
                        "question": "Maximum number of nodes in a binary tree of height h?",
                        "options": [
                                "h²",
                                "2^(h+1) − 1",
                                "h log h",
                                "2^h"
                        ],
                        "correct": 1,
                        "explanation": "Each level in a full binary tree doubles the number of nodes. Summing nodes across all levels gives 2^(h+1) − 1.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 26,
                        "question": "Which data structure is used for expression evaluation?",
                        "options": [
                                "Tree",
                                "Queue",
                                "Heap",
                                "Stack"
                        ],
                        "correct": 3,
                        "explanation": "Stacks store operands and operators during postfix or prefix evaluation. They help maintain correct order of operations.",
                        "difficulty": "Medium",
                        "topic": "Stacks"
                },
                {
                        "id": 27,
                        "question": "Best-case time complexity of bubble sort?",
                        "options": [
                                "O(n)",
                                "O(log n)",
                                "O(n log n)",
                                "O(n²)"
                        ],
                        "correct": 0,
                        "explanation": "When the array is already sorted, bubble sort makes a single pass with no swaps. This results in linear time complexity.",
                        "difficulty": "Easy",
                        "topic": "Sorting"
                },
                {
                        "id": 28,
                        "question": "How does DFS detect a cycle in a graph?",
                        "options": [
                                "Using heap",
                                "Using sorting",
                                "Using queue",
                                "By detecting back edges"
                        ],
                        "correct": 3,
                        "explanation": "A back edge occurs when DFS encounters a visited node that is still in the recursion stack. This indicates a cycle.",
                        "difficulty": "Hard",
                        "topic": "Graphs"
                },
                {
                        "id": 29,
                        "question": "Which structure is best for dynamic memory allocation?",
                        "options": [
                                "Linked List",
                                "Stack",
                                "Heap tree",
                                "Array"
                        ],
                        "correct": 0,
                        "explanation": "Linked lists allocate memory as needed rather than in fixed sizes. This allows efficient use of memory.",
                        "difficulty": "Medium",
                        "topic": "Linked Lists"
                },
                {
                        "id": 30,
                        "question": "Time complexity to search in a balanced BST?",
                        "options": [
                                "O(n log n)",
                                "O(log n)",
                                "O(n)",
                                "O(1)"
                        ],
                        "correct": 1,
                        "explanation": "A balanced BST maintains a logarithmic height. Each comparison eliminates half of the remaining nodes.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 31,
                        "question": "Which sorting algorithm is in-place?",
                        "options": [
                                "Radix sort",
                                "Merge sort",
                                "Counting sort",
                                "Quick sort"
                        ],
                        "correct": 3,
                        "explanation": "Quick sort rearranges elements within the same array using partitioning. It requires minimal extra memory.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 32,
                        "question": "Which graph representation is best for sparse graphs?",
                        "options": [
                                "Incidence matrix",
                                "Adjacency matrix",
                                "Adjacency list",
                                "Edge matrix"
                        ],
                        "correct": 2,
                        "explanation": "Sparse graphs have far fewer edges than possible connections. Adjacency lists store only existing edges, saving memory.",
                        "difficulty": "Medium",
                        "topic": "Graphs"
                },
                {
                        "id": 33,
                        "question": "Which operation is costly in an array?",
                        "options": [
                                "Insert at middle",
                                "Update",
                                "Access",
                                "Traverse"
                        ],
                        "correct": 0,
                        "explanation": "Inserting in the middle requires shifting elements to make space. This results in linear time complexity.",
                        "difficulty": "Easy",
                        "topic": "Arrays"
                },
                {
                        "id": 34,
                        "question": "Which algorithm uses divide and conquer?",
                        "options": [
                                "Bubble sort",
                                "BFS",
                                "Linear search",
                                "Merge sort"
                        ],
                        "correct": 3,
                        "explanation": "Merge sort splits the problem into smaller subproblems. It then combines sorted results to produce the final output.",
                        "difficulty": "Medium",
                        "topic": "Algorithms"
                },
                {
                        "id": 35,
                        "question": "Which data structure is used in function calls?",
                        "options": [
                                "Tree",
                                "Stack",
                                "Queue",
                                "Heap"
                        ],
                        "correct": 1,
                        "explanation": "Function calls are managed using the call stack. Each call stores local variables and return addresses.",
                        "difficulty": "Medium",
                        "topic": "Stacks"
                },
                {
                        "id": 36,
                        "question": "Worst-case height of a BST?",
                        "options": [
                                "O(n log n)",
                                "O(1)",
                                "O(n)",
                                "O(log n)"
                        ],
                        "correct": 2,
                        "explanation": "If nodes are inserted in sorted order, the BST becomes skewed. This makes its height equal to the number of nodes.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 37,
                        "question": "Which algorithm is used for topological sorting?",
                        "options": [
                                "Dijkstra",
                                "Kruskal",
                                "DFS",
                                "BFS"
                        ],
                        "correct": 2,
                        "explanation": "DFS produces a topological order by recording nodes after exploring all descendants.",
                        "difficulty": "Hard",
                        "topic": "Graphs"
                },
                {
                        "id": 38,
                        "question": "Which structure is ideal for implementing an LRU cache?",
                        "options": [
                                "Stack",
                                "Queue",
                                "HashMap + Doubly Linked List",
                                "Tree"
                        ],
                        "correct": 2,
                        "explanation": "A HashMap provides O(1) access to cache entries. A doubly linked list maintains usage order for efficient eviction.",
                        "difficulty": "Hard",
                        "topic": "Data Structures"
                },
                {
                        "id": 39,
                        "question": "Which algorithm finds MST using edge sorting?",
                        "options": [
                                "Dijkstra",
                                "Kruskal’s",
                                "Prim’s",
                                "Bellman-Ford"
                        ],
                        "correct": 1,
                        "explanation": "Kruskal’s algorithm sorts edges by weight and adds them without forming cycles. This ensures a minimum spanning tree.",
                        "difficulty": "Hard",
                        "topic": "Graphs"
                },
                {
                        "id": 40,
                        "question": "Time complexity of linear search?",
                        "options": [
                                "O(n)",
                                "O(log n)",
                                "O(n log n)",
                                "O(1)"
                        ],
                        "correct": 0,
                        "explanation": "Linear search checks each element sequentially. In the worst case, all elements must be examined.",
                        "difficulty": "Easy",
                        "topic": "Searching"
                },
                {
                        "id": 41,
                        "question": "Which tree structure is used in heaps?",
                        "options": [
                                "BST",
                                "Complete binary tree",
                                "AVL tree",
                                "Binary tree"
                        ],
                        "correct": 1,
                        "explanation": "Heaps require a complete binary tree to maintain structural properties. This ensures efficient insertion and deletion.",
                        "difficulty": "Medium",
                        "topic": "Heaps"
                },
                {
                        "id": 42,
                        "question": "Which algorithm finds all-pairs shortest paths?",
                        "options": [
                                "Floyd-Warshall",
                                "DFS",
                                "Dijkstra",
                                "Prim"
                        ],
                        "correct": 0,
                        "explanation": "Floyd-Warshall computes shortest paths between every pair of vertices. It uses dynamic programming.",
                        "difficulty": "Hard",
                        "topic": "Algorithms"
                },
                {
                        "id": 43,
                        "question": "Which operation is fastest in a linked list?",
                        "options": [
                                "Access middle",
                                "Search",
                                "Insert at head",
                                "Random access"
                        ],
                        "correct": 2,
                        "explanation": "Inserting at the head only updates pointers. No traversal is needed, making it constant time.",
                        "difficulty": "Easy",
                        "topic": "Linked Lists"
                },
                {
                        "id": 44,
                        "question": "Which sorting algorithm uses gap reduction?",
                        "options": [
                                "Merge sort",
                                "Heap sort",
                                "Shell sort",
                                "Bubble sort"
                        ],
                        "correct": 2,
                        "explanation": "Shell sort improves insertion sort by comparing elements at a gap. The gap gradually reduces to 1.",
                        "difficulty": "Hard",
                        "topic": "Sorting"
                },
                {
                        "id": 45,
                        "question": "Which data structure is used in backtracking?",
                        "options": [
                                "Heap",
                                "Array",
                                "Queue",
                                "Stack"
                        ],
                        "correct": 3,
                        "explanation": "Backtracking stores previous states using a stack. This allows the algorithm to revert decisions efficiently.",
                        "difficulty": "Medium",
                        "topic": "Algorithms"
                },
                {
                        "id": 46,
                        "question": "Shortest path in an unweighted graph is found using:",
                        "options": [
                                "Dijkstra",
                                "Prim",
                                "DFS",
                                "BFS"
                        ],
                        "correct": 3,
                        "explanation": "BFS explores nodes level by level. This guarantees the shortest path in graphs with equal edge weights.",
                        "difficulty": "Medium",
                        "topic": "Graphs"
                },
                {
                        "id": 47,
                        "question": "Which structure is used for symbol tables in compilers?",
                        "options": [
                                "Stack",
                                "Queue",
                                "Tree",
                                "Hash table"
                        ],
                        "correct": 3,
                        "explanation": "Hash tables allow fast lookup of identifiers. Compilers use them to manage variables and scope efficiently.",
                        "difficulty": "Medium",
                        "topic": "Compilers"
                },
                {
                        "id": 48,
                        "question": "Which sorting algorithm is not comparison-based?",
                        "options": [
                                "Quick sort",
                                "Counting sort",
                                "Heap sort",
                                "Merge sort"
                        ],
                        "correct": 1,
                        "explanation": "Counting sort uses frequency counts instead of comparing elements. This allows linear time sorting under constraints.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 49,
                        "question": "Which data structure is best for priority scheduling?",
                        "options": [
                                "Heap",
                                "Queue",
                                "Stack",
                                "Linked list"
                        ],
                        "correct": 0,
                        "explanation": "Heaps allow efficient retrieval of the highest-priority element. Insertions and deletions occur in logarithmic time.",
                        "difficulty": "Medium",
                        "topic": "Heaps"
                },
                {
                        "id": 50,
                        "question": "Which tree traversal visits root last?",
                        "options": [
                                "Postorder",
                                "Inorder",
                                "Level order",
                                "Preorder"
                        ],
                        "correct": 0,
                        "explanation": "Postorder traversal processes left and right children before the root. This is useful in deletion and expression tree evaluation.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 51,
                        "question": "What is the time complexity of inserting an element into a hash table (average case)?",
                        "options": [
                                "O(n)",
                                "O(log n)",
                                "O(n log n)",
                                "O(1)"
                        ],
                        "correct": 3,
                        "explanation": "In a well-designed hash table, the hash function distributes keys uniformly. This allows constant-time insertion on average, assuming minimal collisions.",
                        "difficulty": "Hard",
                        "topic": "Hashing"
                },
                {
                        "id": 52,
                        "question": "Which data structure is used for level-order traversal of a tree?",
                        "options": [
                                "Array",
                                "Stack",
                                "Queue",
                                "Heap"
                        ],
                        "correct": 2,
                        "explanation": "Level-order traversal processes nodes one level at a time. A queue ensures nodes are visited in the order they are discovered.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 53,
                        "question": "What is the worst-case time complexity of searching in a hash table?",
                        "options": [
                                "O(n)",
                                "O(1)",
                                "O(n log n)",
                                "O(log n)"
                        ],
                        "correct": 0,
                        "explanation": "In the worst case, all keys collide into the same bucket. This reduces the hash table to a linked list, resulting in linear search time.",
                        "difficulty": "Hard",
                        "topic": "Searching"
                },
                {
                        "id": 54,
                        "question": "Which sorting algorithm repeatedly swaps adjacent elements?",
                        "options": [
                                "Merge sort",
                                "Selection sort",
                                "Quick sort",
                                "Bubble sort"
                        ],
                        "correct": 3,
                        "explanation": "Bubble sort compares adjacent elements and swaps them if they are in the wrong order. This process repeats until the array is sorted.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 55,
                        "question": "Which data structure is best for checking balanced parentheses?",
                        "options": [
                                "Stack",
                                "Queue",
                                "Tree",
                                "Heap"
                        ],
                        "correct": 0,
                        "explanation": "A stack tracks opening brackets and ensures each closing bracket matches the most recent opening bracket. This LIFO behavior makes validation efficient.",
                        "difficulty": "Hard",
                        "topic": "Trees"
                },
                {
                        "id": 56,
                        "question": "What is the space complexity of merge sort?",
                        "options": [
                                "O(n)",
                                "O(log n)",
                                "O(1)",
                                "O(n²)"
                        ],
                        "correct": 0,
                        "explanation": "Merge sort requires additional memory to store temporary arrays during merging. This extra space grows linearly with input size.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 57,
                        "question": "Which tree property ensures efficient search operations?",
                        "options": [
                                "Degree",
                                "Depth",
                                "Completeness",
                                "Balance"
                        ],
                        "correct": 3,
                        "explanation": "Balanced trees maintain minimal height relative to nodes. This ensures operations like search, insert, and delete remain logarithmic.",
                        "difficulty": "Medium",
                        "topic": "Searching"
                },
                {
                        "id": 58,
                        "question": "Which algorithm is used to detect cycles in an undirected graph?",
                        "options": [
                                "Floyd-Warshall",
                                "BFS with parent tracking",
                                "Prim",
                                "Dijkstra"
                        ],
                        "correct": 1,
                        "explanation": "BFS can detect cycles by checking visited nodes that are not the parent. This indicates a back connection forming a cycle.",
                        "difficulty": "Medium",
                        "topic": "Graphs"
                },
                {
                        "id": 59,
                        "question": "Which data structure allows fast minimum element retrieval?",
                        "options": [
                                "Min-Heap",
                                "Stack",
                                "Linked List",
                                "Queue"
                        ],
                        "correct": 0,
                        "explanation": "A min-heap maintains the smallest element at the root. This allows constant-time retrieval of the minimum value.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                },
                {
                        "id": 60,
                        "question": "What is the time complexity of deleting the root from a heap?",
                        "options": [
                                "O(log n)",
                                "O(n)",
                                "O(n log n)",
                                "O(1)"
                        ],
                        "correct": 0,
                        "explanation": "After removing the root, the last element moves to the root and percolates down. This process takes logarithmic time.",
                        "difficulty": "Medium",
                        "topic": "Heaps"
                },
                {
                        "id": 61,
                        "question": "Which traversal method is used to copy a tree?",
                        "options": [
                                "Level order",
                                "Postorder",
                                "Preorder",
                                "Inorder"
                        ],
                        "correct": 2,
                        "explanation": "Preorder processes the root before its children. This ensures the structure is recreated correctly during copying.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 62,
                        "question": "Which data structure is used in depth-first search?",
                        "options": [
                                "Heap",
                                "Queue",
                                "Stack",
                                "Array"
                        ],
                        "correct": 2,
                        "explanation": "DFS uses a stack (explicit or recursion) to explore as far as possible along each branch. This ensures depth-wise traversal.",
                        "difficulty": "Medium",
                        "topic": "Searching"
                },
                {
                        "id": 63,
                        "question": "What is the time complexity of selection sort?",
                        "options": [
                                "O(log n)",
                                "O(n)",
                                "O(n²)",
                                "O(n log n)"
                        ],
                        "correct": 2,
                        "explanation": "Selection sort compares each element with the remaining unsorted portion. This results in quadratic comparisons.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 64,
                        "question": "Which structure is used for implementing recursion?",
                        "options": [
                                "Queue",
                                "Tree",
                                "Stack",
                                "Graph"
                        ],
                        "correct": 2,
                        "explanation": "Recursion relies on the call stack to store intermediate states. Each function call pushes a new frame onto the stack.",
                        "difficulty": "Medium",
                        "topic": "Stacks"
                },
                {
                        "id": 65,
                        "question": "Which algorithm finds shortest path in graphs with negative weights?",
                        "options": [
                                "Kruskal",
                                "Bellman-Ford",
                                "Dijkstra",
                                "Prim"
                        ],
                        "correct": 1,
                        "explanation": "Bellman-Ford handles negative edge weights by relaxing edges repeatedly. It can also detect negative weight cycles.",
                        "difficulty": "Medium",
                        "topic": "Graphs"
                },
                {
                        "id": 66,
                        "question": "Which operation in a binary heap takes constant time?",
                        "options": [
                                "Find min/max",
                                "Heapify",
                                "Delete",
                                "Insert"
                        ],
                        "correct": 0,
                        "explanation": "The root of the heap contains the minimum or maximum element. Accessing it does not require traversal.",
                        "difficulty": "Medium",
                        "topic": "Heaps"
                },
                {
                        "id": 67,
                        "question": "Which data structure is best for implementing a queue?",
                        "options": [
                                "Array",
                                "Stack",
                                "Linked List",
                                "Tree"
                        ],
                        "correct": 2,
                        "explanation": "Linked lists allow efficient insertion at rear and deletion at front. This ensures O(1) enqueue and dequeue operations.",
                        "difficulty": "Medium",
                        "topic": "Queues"
                },
                {
                        "id": 68,
                        "question": "What is the height of a complete binary tree with n nodes?",
                        "options": [
                                "O(n)",
                                "O(1)",
                                "O(n log n)",
                                "O(log n)"
                        ],
                        "correct": 3,
                        "explanation": "Complete binary trees are filled level by level. Their height grows logarithmically with the number of nodes.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 69,
                        "question": "Which sorting algorithm is best for nearly sorted data?",
                        "options": [
                                "Heap sort",
                                "Selection sort",
                                "Insertion sort",
                                "Bubble sort"
                        ],
                        "correct": 2,
                        "explanation": "Insertion sort performs minimal shifts when elements are nearly in order. This makes it efficient for nearly sorted arrays.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 70,
                        "question": "Which algorithm uses relaxation technique?",
                        "options": [
                                "DFS",
                                "BFS",
                                "Dijkstra",
                                "Selection sort"
                        ],
                        "correct": 2,
                        "explanation": "Dijkstra updates shortest path estimates using relaxation. It improves distance values when a shorter path is found.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                },
                {
                        "id": 71,
                        "question": "Which data structure supports fast union and find operations?",
                        "options": [
                                "Stack",
                                "Queue",
                                "Disjoint Set (Union-Find)",
                                "Tree"
                        ],
                        "correct": 2,
                        "explanation": "Union-Find supports efficient merging of sets and finding representatives. Path compression and union by rank optimize operations.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                },
                {
                        "id": 72,
                        "question": "Which tree is used in database indexing?",
                        "options": [
                                "AVL Tree",
                                "B-Tree",
                                "Heap",
                                "BST"
                        ],
                        "correct": 1,
                        "explanation": "B-Trees maintain balanced multi-level indexing. They minimize disk reads, making them ideal for databases.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 73,
                        "question": "What is the time complexity of heap sort?",
                        "options": [
                                "O(n²)",
                                "O(n log n)",
                                "O(log n)",
                                "O(n)"
                        ],
                        "correct": 1,
                        "explanation": "Heap sort builds a heap in linear time and performs n deletions. Each deletion takes log n time.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 74,
                        "question": "Which graph traversal uses recursion naturally?",
                        "options": [
                                "BFS",
                                "Dijkstra",
                                "Prim",
                                "DFS"
                        ],
                        "correct": 3,
                        "explanation": "DFS explores depth-wise and can be implemented recursively. The recursion stack mirrors the traversal path.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 75,
                        "question": "Which data structure is used for scheduling tasks?",
                        "options": [
                                "Graph",
                                "Queue",
                                "Stack",
                                "Heap"
                        ],
                        "correct": 1,
                        "explanation": "Queues process tasks in arrival order. This is useful in CPU scheduling and task management.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                },
                {
                        "id": 76,
                        "question": "Which property is required for binary search?",
                        "options": [
                                "Balanced tree",
                                "Sorted data",
                                "Linked structure",
                                "Random access"
                        ],
                        "correct": 1,
                        "explanation": "Binary search relies on sorted data to eliminate half the search space. Without sorting, comparisons are meaningless.",
                        "difficulty": "Medium",
                        "topic": "Searching"
                },
                {
                        "id": 77,
                        "question": "Which algorithm finds strongly connected components?",
                        "options": [
                                "Prim",
                                "Kruskal",
                                "Kosaraju’s",
                                "Dijkstra"
                        ],
                        "correct": 2,
                        "explanation": "Kosaraju’s algorithm uses two DFS passes. It identifies strongly connected components in directed graphs.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                },
                {
                        "id": 78,
                        "question": "Which structure is best for representing hierarchical data?",
                        "options": [
                                "Stack",
                                "Tree",
                                "Array",
                                "Queue"
                        ],
                        "correct": 1,
                        "explanation": "Trees naturally represent parent-child relationships. They are used in file systems and organizational charts.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                },
                {
                        "id": 79,
                        "question": "Which sorting algorithm is based on heap data structure?",
                        "options": [
                                "Insertion sort",
                                "Merge sort",
                                "Quick sort",
                                "Heap sort"
                        ],
                        "correct": 3,
                        "explanation": "Heap sort builds a heap to repeatedly extract the largest or smallest element. This ensures efficient sorting.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 80,
                        "question": "Which data structure provides O(1) average search?",
                        "options": [
                                "Hash table",
                                "Stack",
                                "Binary tree",
                                "Linked list"
                        ],
                        "correct": 0,
                        "explanation": "Hash tables use hash functions to compute direct indices. This enables constant-time average search performance.",
                        "difficulty": "Medium",
                        "topic": "Searching"
                },
                {
                        "id": 81,
                        "question": "Which tree traversal is used in expression trees to produce postfix?",
                        "options": [
                                "Level order",
                                "Inorder",
                                "Preorder",
                                "Postorder"
                        ],
                        "correct": 3,
                        "explanation": "Postorder traversal evaluates children before the root. This produces postfix expressions used in evaluation.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 82,
                        "question": "Which algorithm is used for network routing?",
                        "options": [
                                "DFS",
                                "Selection sort",
                                "Dijkstra",
                                "Merge sort"
                        ],
                        "correct": 2,
                        "explanation": "Dijkstra computes shortest paths between nodes. It is widely used in routing protocols.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                },
                {
                        "id": 83,
                        "question": "Which data structure is used for undo-redo operations?",
                        "options": [
                                "Graph",
                                "Stack",
                                "Heap",
                                "Queue"
                        ],
                        "correct": 1,
                        "explanation": "Undo operations use one stack and redo uses another. This allows reversing and reapplying actions efficiently.",
                        "difficulty": "Medium",
                        "topic": "Stacks"
                },
                {
                        "id": 84,
                        "question": "Which algorithm is stable?",
                        "options": [
                                "Heap sort",
                                "Selection sort",
                                "Merge sort",
                                "Quick sort"
                        ],
                        "correct": 2,
                        "explanation": "Merge sort preserves the order of equal elements. Stability is important in multi-key sorting.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                },
                {
                        "id": 85,
                        "question": "Which graph representation uses more space?",
                        "options": [
                                "Adjacency matrix",
                                "Tree",
                                "Adjacency list",
                                "Edge list"
                        ],
                        "correct": 0,
                        "explanation": "Adjacency matrices store all possible edges. This results in O(V²) space usage.",
                        "difficulty": "Medium",
                        "topic": "Graphs"
                },
                {
                        "id": 86,
                        "question": "Which data structure is used in BFS for shortest path in unweighted graph?",
                        "options": [
                                "Stack",
                                "Heap",
                                "Queue",
                                "Tree"
                        ],
                        "correct": 2,
                        "explanation": "BFS uses a queue to explore nodes by distance. This ensures the shortest path in unweighted graphs.",
                        "difficulty": "Medium",
                        "topic": "Graphs"
                },
                {
                        "id": 87,
                        "question": "Which sorting algorithm has worst-case O(n log n)?",
                        "options": [
                                "Bubble sort",
                                "Quick sort",
                                "Insertion sort",
                                "Merge sort"
                        ],
                        "correct": 3,
                        "explanation": "Merge sort guarantees O(n log n) performance regardless of input. Quick sort can degrade to O(n²).",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 88,
                        "question": "Which data structure is used in compiler parsing?",
                        "options": [
                                "Queue",
                                "Stack",
                                "Heap",
                                "Graph"
                        ],
                        "correct": 1,
                        "explanation": "Parsing uses stacks to manage grammar symbols. This supports syntax analysis and expression evaluation.",
                        "difficulty": "Medium",
                        "topic": "Stacks"
                },
                {
                        "id": 89,
                        "question": "Which algorithm is used to find bridges in a graph?",
                        "options": [
                                "DFS",
                                "Prim",
                                "Dijkstra",
                                "BFS"
                        ],
                        "correct": 0,
                        "explanation": "DFS with discovery and low times identifies bridges. A bridge is an edge whose removal increases components.",
                        "difficulty": "Medium",
                        "topic": "Graphs"
                },
                {
                        "id": 90,
                        "question": "Which data structure is best for fast insertion and deletion?",
                        "options": [
                                "Linked list",
                                "Stack",
                                "Heap",
                                "Array"
                        ],
                        "correct": 0,
                        "explanation": "Linked lists allow insertion and deletion without shifting elements. Only pointer updates are required.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 91,
                        "question": "Which tree structure keeps keys sorted and balanced?",
                        "options": [
                                "Stack",
                                "Heap",
                                "AVL Tree",
                                "Queue"
                        ],
                        "correct": 2,
                        "explanation": "AVL trees maintain height balance through rotations. This ensures sorted order and efficient operations.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 92,
                        "question": "Which algorithm is used for topological sorting in DAG?",
                        "options": [
                                "Bellman-Ford",
                                "Prim",
                                "BFS (Kahn’s Algorithm)",
                                "Dijkstra"
                        ],
                        "correct": 2,
                        "explanation": "Kahn’s algorithm uses BFS and in-degree tracking. It produces a valid topological ordering.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 93,
                        "question": "Which data structure is used for memory management in OS?",
                        "options": [
                                "Heap",
                                "Queue",
                                "Stack",
                                "Linked list"
                        ],
                        "correct": 0,
                        "explanation": "The heap manages dynamic memory allocation. Operating systems use it to allocate runtime memory.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                },
                {
                        "id": 94,
                        "question": "Which sorting algorithm is adaptive?",
                        "options": [
                                "Insertion sort",
                                "Selection sort",
                                "Merge sort",
                                "Heap sort"
                        ],
                        "correct": 0,
                        "explanation": "Insertion sort adapts to existing order in data. It performs fewer operations when the array is nearly sorted.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 95,
                        "question": "Which graph algorithm detects negative cycles?",
                        "options": [
                                "BFS",
                                "Prim",
                                "Dijkstra",
                                "Bellman-Ford"
                        ],
                        "correct": 3,
                        "explanation": "Bellman-Ford detects negative cycles by checking further relaxation. If distances keep decreasing, a negative cycle exists.",
                        "difficulty": "Medium",
                        "topic": "Graphs"
                },
                {
                        "id": 96,
                        "question": "Which data structure is used in expression parsing?",
                        "options": [
                                "Stack",
                                "Tree",
                                "Queue",
                                "Graph"
                        ],
                        "correct": 0,
                        "explanation": "Stacks help manage operators and operands. They enforce precedence and associativity rules.",
                        "difficulty": "Medium",
                        "topic": "Stacks"
                },
                {
                        "id": 97,
                        "question": "Which traversal method is best for deleting a tree?",
                        "options": [
                                "Postorder",
                                "Inorder",
                                "Level order",
                                "Preorder"
                        ],
                        "correct": 0,
                        "explanation": "Postorder deletes children before the parent. This prevents dangling references.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 98,
                        "question": "Which data structure supports bidirectional traversal?",
                        "options": [
                                "Stack",
                                "Doubly linked list",
                                "Singly linked list",
                                "Queue"
                        ],
                        "correct": 1,
                        "explanation": "Doubly linked lists store pointers to both next and previous nodes. This enables forward and backward traversal.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 99,
                        "question": "Which algorithm is used in AI pathfinding (e.g., games)?",
                        "options": [
                                "A* Search",
                                "DFS",
                                "Selection sort",
                                "Merge sort"
                        ],
                        "correct": 0,
                        "explanation": "A* uses heuristics to find optimal paths efficiently. It is widely used in game AI and robotics.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                },
                {
                        "id": 100,
                        "question": "Which data structure is best for implementing a deque?",
                        "options": [
                                "Array",
                                "Stack",
                                "Tree",
                                "Doubly linked list"
                        ],
                        "correct": 3,
                        "explanation": "A doubly linked list allows insertion and deletion from both ends. This matches the requirements of a deque.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                },
                {
                        "id": 101,
                        "question": "Which data structure is best for implementing a stack?",
                        "options": [
                                "Heap",
                                "Both A and B",
                                "Array",
                                "Linked List"
                        ],
                        "correct": 1,
                        "explanation": "Stacks can be implemented using arrays or linked lists. Arrays provide fast indexing, while linked lists allow dynamic size.",
                        "difficulty": "Medium",
                        "topic": "Stacks"
                },
                {
                        "id": 102,
                        "question": "What is the time complexity of pushing an element onto a stack?",
                        "options": [
                                "O(n log n)",
                                "O(log n)",
                                "O(n)",
                                "O(1)"
                        ],
                        "correct": 3,
                        "explanation": "Push operation adds an element at the top of the stack. This requires only pointer or index update, making it constant time.",
                        "difficulty": "Medium",
                        "topic": "Stacks"
                },
                {
                        "id": 103,
                        "question": "Which data structure is ideal for breadth-first search?",
                        "options": [
                                "Stack",
                                "Tree",
                                "Queue",
                                "Heap"
                        ],
                        "correct": 2,
                        "explanation": "BFS processes nodes level by level. A queue ensures nodes are explored in the order they are discovered.",
                        "difficulty": "Medium",
                        "topic": "Searching"
                },
                {
                        "id": 104,
                        "question": "Which sorting algorithm divides the array around a pivot?",
                        "options": [
                                "Selection sort",
                                "Bubble sort",
                                "Quick sort",
                                "Merge sort"
                        ],
                        "correct": 2,
                        "explanation": "Quick sort partitions the array into elements less than and greater than the pivot. This divide-and-conquer approach improves efficiency.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 105,
                        "question": "What is the time complexity of accessing an element in a linked list?",
                        "options": [
                                "O(1)",
                                "O(log n)",
                                "O(n)",
                                "O(n log n)"
                        ],
                        "correct": 2,
                        "explanation": "Linked lists require traversal from the head to reach a specific index. This results in linear time access.",
                        "difficulty": "Medium",
                        "topic": "Linked Lists"
                },
                {
                        "id": 106,
                        "question": "Which algorithm is used to reverse a linked list?",
                        "options": [
                                "Iterative pointer reversal",
                                "Binary search",
                                "DFS",
                                "Heapify"
                        ],
                        "correct": 0,
                        "explanation": "Reversing a linked list involves changing next pointers of each node. This can be done iteratively in linear time.",
                        "difficulty": "Medium",
                        "topic": "Linked Lists"
                },
                {
                        "id": 107,
                        "question": "Which data structure is used to implement recursion internally?",
                        "options": [
                                "Stack",
                                "Tree",
                                "Queue",
                                "Heap"
                        ],
                        "correct": 0,
                        "explanation": "Recursion uses the call stack to store function states. Each recursive call pushes a new frame onto the stack.",
                        "difficulty": "Medium",
                        "topic": "Stacks"
                },
                {
                        "id": 108,
                        "question": "Which tree traversal visits nodes level by level?",
                        "options": [
                                "Preorder",
                                "Postorder",
                                "Level order",
                                "Inorder"
                        ],
                        "correct": 2,
                        "explanation": "Level order traversal processes nodes by depth. It uses a queue to visit nodes layer by layer.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 109,
                        "question": "Which data structure allows duplicate elements?",
                        "options": [
                                "Array",
                                "Set",
                                "Map",
                                "HashSet"
                        ],
                        "correct": 0,
                        "explanation": "Arrays can store duplicate values without restriction. Sets typically enforce uniqueness.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                },
                {
                        "id": 110,
                        "question": "Which algorithm is used to detect a cycle in a directed graph?",
                        "options": [
                                "Prim",
                                "DFS with recursion stack",
                                "Dijkstra",
                                "BFS"
                        ],
                        "correct": 1,
                        "explanation": "A recursion stack helps detect back edges in directed graphs. This indicates a cycle.",
                        "difficulty": "Medium",
                        "topic": "Graphs"
                },
                {
                        "id": 111,
                        "question": "Which data structure stores key-value pairs?",
                        "options": [
                                "Tree",
                                "Stack",
                                "Queue",
                                "Hash Map"
                        ],
                        "correct": 3,
                        "explanation": "Hash maps associate keys with values using hashing. This allows fast retrieval based on keys.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                },
                {
                        "id": 112,
                        "question": "What is the average time complexity of quicksort?",
                        "options": [
                                "O(n²)",
                                "O(n log n)",
                                "O(n)",
                                "O(log n)"
                        ],
                        "correct": 1,
                        "explanation": "Balanced partitioning divides the array efficiently. This results in logarithmic recursion depth and linear work per level.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 113,
                        "question": "Which structure is used for implementing graphs?",
                        "options": [
                                "Adjacency list",
                                "Heap",
                                "Queue",
                                "Stack"
                        ],
                        "correct": 0,
                        "explanation": "Adjacency lists store neighbors for each vertex. This is memory-efficient for sparse graphs.",
                        "difficulty": "Medium",
                        "topic": "Graphs"
                },
                {
                        "id": 114,
                        "question": "Which operation removes the top element of a stack?",
                        "options": [
                                "Insert",
                                "Pop",
                                "Push",
                                "Peek"
                        ],
                        "correct": 1,
                        "explanation": "Pop removes and returns the top element. This follows the LIFO principle of stacks.",
                        "difficulty": "Medium",
                        "topic": "Stacks"
                },
                {
                        "id": 115,
                        "question": "Which algorithm is used for sorting integers in linear time under constraints?",
                        "options": [
                                "Quick sort",
                                "Merge sort",
                                "Counting sort",
                                "Heap sort"
                        ],
                        "correct": 2,
                        "explanation": "Counting sort uses frequency counts rather than comparisons. It achieves linear time when the range of values is limited.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 116,
                        "question": "Which data structure is used for priority queues?",
                        "options": [
                                "Heap",
                                "Stack",
                                "Linked list",
                                "Array"
                        ],
                        "correct": 0,
                        "explanation": "Heaps maintain priority ordering efficiently. Insertions and deletions occur in logarithmic time.",
                        "difficulty": "Medium",
                        "topic": "Queues"
                },
                {
                        "id": 117,
                        "question": "Which tree has at most two children per node?",
                        "options": [
                                "Trie",
                                "Heap",
                                "Binary tree",
                                "B-tree"
                        ],
                        "correct": 2,
                        "explanation": "Binary trees restrict nodes to two children. This structure is used in BSTs and heaps.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 118,
                        "question": "Which traversal prints root first?",
                        "options": [
                                "Inorder",
                                "Level order",
                                "Postorder",
                                "Preorder"
                        ],
                        "correct": 3,
                        "explanation": "Preorder traversal visits the root before its subtrees. This is useful for copying trees.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 119,
                        "question": "Which algorithm is used in minimum spanning tree construction?",
                        "options": [
                                "DFS",
                                "Counting sort",
                                "Kruskal",
                                "Binary search"
                        ],
                        "correct": 2,
                        "explanation": "Kruskal’s algorithm builds MST by selecting smallest edges without forming cycles. It uses Union-Find for efficiency.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 120,
                        "question": "Which data structure is best for implementing undo functionality?",
                        "options": [
                                "Graph",
                                "Queue",
                                "Stack",
                                "Heap"
                        ],
                        "correct": 2,
                        "explanation": "Undo operations reverse the most recent action first. Stacks naturally support this LIFO behavior.",
                        "difficulty": "Medium",
                        "topic": "Stacks"
                },
                {
                        "id": 121,
                        "question": "Which algorithm finds shortest path in unweighted graphs?",
                        "options": [
                                "Prim",
                                "DFS",
                                "BFS",
                                "Dijkstra"
                        ],
                        "correct": 2,
                        "explanation": "BFS explores nodes by distance from the source. This guarantees shortest path when all edges have equal weight.",
                        "difficulty": "Medium",
                        "topic": "Graphs"
                },
                {
                        "id": 122,
                        "question": "Which structure allows insertion at both ends?",
                        "options": [
                                "Stack",
                                "Heap",
                                "Deque",
                                "Queue"
                        ],
                        "correct": 2,
                        "explanation": "A deque supports insertion and deletion from both front and rear. This provides flexibility for double-ended operations.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 123,
                        "question": "Which sorting algorithm is unstable?",
                        "options": [
                                "Merge sort",
                                "Bubble sort",
                                "Insertion sort",
                                "Quick sort"
                        ],
                        "correct": 3,
                        "explanation": "Quick sort may reorder equal elements during partitioning. This makes it unstable.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 124,
                        "question": "Which data structure is used in autocomplete systems?",
                        "options": [
                                "Trie",
                                "Heap",
                                "Queue",
                                "Stack"
                        ],
                        "correct": 0,
                        "explanation": "Tries store strings character by character. This allows efficient prefix-based searches.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                },
                {
                        "id": 125,
                        "question": "Which graph representation is best for dense graphs?",
                        "options": [
                                "Tree",
                                "Adjacency matrix",
                                "Edge list",
                                "Adjacency list"
                        ],
                        "correct": 1,
                        "explanation": "Dense graphs have many edges. Adjacency matrices allow constant-time edge lookup.",
                        "difficulty": "Medium",
                        "topic": "Graphs"
                },
                {
                        "id": 126,
                        "question": "Which algorithm sorts by comparing adjacent elements repeatedly?",
                        "options": [
                                "Heap sort",
                                "Bubble sort",
                                "Merge sort",
                                "Quick sort"
                        ],
                        "correct": 1,
                        "explanation": "Bubble sort repeatedly swaps adjacent elements. Larger elements “bubble” to the end.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 127,
                        "question": "Which data structure is used for implementing DFS iteratively?",
                        "options": [
                                "Stack",
                                "Queue",
                                "Array",
                                "Heap"
                        ],
                        "correct": 0,
                        "explanation": "DFS uses a stack to explore deeper nodes first. This mimics recursive behavior.",
                        "difficulty": "Medium",
                        "topic": "Graphs"
                },
                {
                        "id": 128,
                        "question": "Which operation is performed by enqueue?",
                        "options": [
                                "Sort queue",
                                "Add element to rear",
                                "Remove element",
                                "View front element"
                        ],
                        "correct": 1,
                        "explanation": "Enqueue inserts an element at the rear of the queue. This maintains FIFO order.",
                        "difficulty": "Medium",
                        "topic": "Queues"
                },
                {
                        "id": 129,
                        "question": "Which algorithm is used for finding articulation points?",
                        "options": [
                                "Dijkstra",
                                "BFS",
                                "DFS",
                                "Kruskal"
                        ],
                        "correct": 2,
                        "explanation": "DFS tracks discovery times and low values. These help identify articulation points in graphs.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                },
                {
                        "id": 130,
                        "question": "Which data structure is used in LIFO scheduling?",
                        "options": [
                                "Queue",
                                "Stack",
                                "Tree",
                                "Heap"
                        ],
                        "correct": 1,
                        "explanation": "LIFO scheduling processes the most recent task first. This behavior matches stack operations.",
                        "difficulty": "Medium",
                        "topic": "Stacks"
                },
                {
                        "id": 131,
                        "question": "Which tree structure is used in prefix matching?",
                        "options": [
                                "Trie",
                                "Heap",
                                "BST",
                                "AVL Tree"
                        ],
                        "correct": 0,
                        "explanation": "Tries store characters in a tree structure. This allows efficient prefix matching.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 132,
                        "question": "Which sorting algorithm is fastest on average?",
                        "options": [
                                "Quick sort",
                                "Bubble sort",
                                "Selection sort",
                                "Insertion sort"
                        ],
                        "correct": 0,
                        "explanation": "Quick sort has average O(n log n) complexity with good cache performance. It is widely used in practice.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 133,
                        "question": "Which data structure is used to detect palindrome using stack?",
                        "options": [
                                "Heap",
                                "Queue",
                                "Tree",
                                "Stack"
                        ],
                        "correct": 3,
                        "explanation": "A stack reverses order of elements. Comparing with original sequence helps detect palindromes.",
                        "difficulty": "Medium",
                        "topic": "Stacks"
                },
                {
                        "id": 134,
                        "question": "Which algorithm is used in GPS navigation systems?",
                        "options": [
                                "Dijkstra",
                                "BFS",
                                "Selection sort",
                                "DFS"
                        ],
                        "correct": 0,
                        "explanation": "Dijkstra computes shortest paths in weighted graphs. GPS systems use it to find optimal routes.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                },
                {
                        "id": 135,
                        "question": "Which data structure is used in expression trees?",
                        "options": [
                                "Tree",
                                "Stack",
                                "Graph",
                                "Queue"
                        ],
                        "correct": 0,
                        "explanation": "Expression trees represent operators as internal nodes. Operands appear as leaf nodes.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 136,
                        "question": "Which algorithm uses a heuristic to improve search?",
                        "options": [
                                "BFS",
                                "A* Search",
                                "Prim",
                                "DFS"
                        ],
                        "correct": 1,
                        "explanation": "A* uses heuristics to estimate distance to goal. This speeds up pathfinding.",
                        "difficulty": "Medium",
                        "topic": "Searching"
                },
                {
                        "id": 137,
                        "question": "Which data structure supports fast lookup and insertion?",
                        "options": [
                                "Linked list",
                                "Queue",
                                "Hash table",
                                "Stack"
                        ],
                        "correct": 2,
                        "explanation": "Hash tables use hashing for direct access. This provides average O(1) lookup and insertion.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 138,
                        "question": "Which traversal is used to evaluate expression trees?",
                        "options": [
                                "Level order",
                                "Inorder",
                                "Preorder",
                                "Postorder"
                        ],
                        "correct": 3,
                        "explanation": "Postorder evaluates children before the operator. This matches postfix evaluation.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 139,
                        "question": "Which data structure is used in compiler syntax checking?",
                        "options": [
                                "Queue",
                                "Stack",
                                "Graph",
                                "Heap"
                        ],
                        "correct": 1,
                        "explanation": "Stacks help manage grammar symbols. They ensure syntactic correctness.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                },
                {
                        "id": 140,
                        "question": "Which sorting algorithm is best for small datasets?",
                        "options": [
                                "Insertion sort",
                                "Merge sort",
                                "Heap sort",
                                "Quick sort"
                        ],
                        "correct": 0,
                        "explanation": "Insertion sort has low overhead. It performs well for small or nearly sorted datasets.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 141,
                        "question": "Which data structure is used for breadth-first search in graphs?",
                        "options": [
                                "Heap",
                                "Stack",
                                "Queue",
                                "Tree"
                        ],
                        "correct": 2,
                        "explanation": "BFS uses a queue to explore nodes by layers. This ensures shortest path discovery in unweighted graphs.",
                        "difficulty": "Medium",
                        "topic": "Searching"
                },
                {
                        "id": 142,
                        "question": "Which algorithm detects strongly connected components?",
                        "options": [
                                "Binary search",
                                "Kosaraju",
                                "Prim",
                                "Dijkstra"
                        ],
                        "correct": 1,
                        "explanation": "Kosaraju’s algorithm performs two DFS passes. It identifies strongly connected components efficiently.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                },
                {
                        "id": 143,
                        "question": "Which data structure stores elements in sorted order automatically?",
                        "options": [
                                "Heap",
                                "Queue",
                                "Stack",
                                "Array"
                        ],
                        "correct": 0,
                        "explanation": "Heaps maintain partial ordering with the smallest or largest element at the root. This ensures priority-based access.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 144,
                        "question": "Which algorithm is used for merging two sorted arrays?",
                        "options": [
                                "Selection sort",
                                "Bubble sort",
                                "DFS",
                                "Merge procedure"
                        ],
                        "correct": 3,
                        "explanation": "The merge procedure combines two sorted arrays into one. It compares elements sequentially to maintain order.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 145,
                        "question": "Which data structure is used for implementing graphs in memory-efficient way?",
                        "options": [
                                "Stack",
                                "Heap",
                                "Adjacency matrix",
                                "Adjacency list"
                        ],
                        "correct": 3,
                        "explanation": "Adjacency lists store only existing edges. This is memory-efficient for sparse graphs.",
                        "difficulty": "Medium",
                        "topic": "Graphs"
                },
                {
                        "id": 146,
                        "question": "Which algorithm is used for finding Eulerian paths?",
                        "options": [
                                "Prim",
                                "Dijkstra",
                                "BFS",
                                "Fleury’s Algorithm"
                        ],
                        "correct": 3,
                        "explanation": "Fleury’s algorithm traverses edges without repetition. It constructs Eulerian paths in graphs.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                },
                {
                        "id": 147,
                        "question": "Which data structure is used in operating systems for process scheduling?",
                        "options": [
                                "Graph",
                                "Stack",
                                "Tree",
                                "Queue"
                        ],
                        "correct": 3,
                        "explanation": "Queues manage processes in scheduling policies like FIFO. They ensure fair CPU allocation.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                },
                {
                        "id": 148,
                        "question": "Which tree is used for dictionary word storage?",
                        "options": [
                                "AVL",
                                "Trie",
                                "Heap",
                                "BST"
                        ],
                        "correct": 1,
                        "explanation": "Tries store words character by character. This enables efficient prefix searches.",
                        "difficulty": "Medium",
                        "topic": "Trees"
                },
                {
                        "id": 149,
                        "question": "Which sorting algorithm repeatedly inserts elements into sorted portion?",
                        "options": [
                                "Insertion sort",
                                "Heap sort",
                                "Merge sort",
                                "Selection sort"
                        ],
                        "correct": 0,
                        "explanation": "Insertion sort builds a sorted section one element at a time. Each new element is placed in its correct position.",
                        "difficulty": "Medium",
                        "topic": "Sorting"
                },
                {
                        "id": 150,
                        "question": "Which data structure is best for implementing circular buffers?",
                        "options": [
                                "Array",
                                "Heap",
                                "Stack",
                                "Linked list"
                        ],
                        "correct": 0,
                        "explanation": "Arrays allow fixed-size cyclic indexing. Circular buffers use modulo arithmetic for efficient wrapping.",
                        "difficulty": "Medium",
                        "topic": "Data Structures"
                }
        ],
        "dbms": [
                {
                        "id": 1,
                        "question": "What does DBMS stand for?",
                        "options": [
                                "Database Management System",
                                "Digital Base Management System",
                                "Data Binary Management System",
                                "Data Backup Management System"
                        ],
                        "correct": 0,
                        "explanation": "DBMS is software that manages databases and provides tools for storing, retrieving, and managing data. It ensures data consistency, security, and efficient access.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 2,
                        "question": "Which of the following is a type of database model?",
                        "options": [
                                "Circular",
                                "Relational",
                                "Linear",
                                "Binary"
                        ],
                        "correct": 1,
                        "explanation": "The relational model organizes data into tables with rows and columns. It uses keys to establish relationships between tables.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 3,
                        "question": "What is a primary key?",
                        "options": [
                                "A foreign reference",
                                "A nullable column",
                                "A unique identifier for a record",
                                "A duplicate field"
                        ],
                        "correct": 2,
                        "explanation": "A primary key uniquely identifies each row in a table. It cannot contain NULL values or duplicates.",
                        "difficulty": "Medium",
                        "topic": "Keys"
                },
                {
                        "id": 4,
                        "question": "Which SQL command is used to retrieve data?",
                        "options": [
                                "SELECT",
                                "RETRIEVE",
                                "GET",
                                "FETCH"
                        ],
                        "correct": 0,
                        "explanation": "SELECT is used to fetch data from one or more tables. It can filter, sort, and group results.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 5,
                        "question": "What is normalization?",
                        "options": [
                                "Organizing data to reduce redundancy",
                                "Data duplication",
                                "Encrypting data",
                                "Sorting data"
                        ],
                        "correct": 0,
                        "explanation": "Normalization structures data into tables to eliminate redundancy. It improves consistency and reduces anomalies.",
                        "difficulty": "Hard",
                        "topic": "Normalization"
                },
                {
                        "id": 6,
                        "question": "Which normal form removes partial dependency?",
                        "options": [
                                "1NF",
                                "BCNF",
                                "2NF",
                                "3NF"
                        ],
                        "correct": 2,
                        "explanation": "Second Normal Form removes partial dependencies on composite keys. All non-key attributes must depend on the entire key.",
                        "difficulty": "Medium",
                        "topic": "Normalization"
                },
                {
                        "id": 7,
                        "question": "What is a foreign key?",
                        "options": [
                                "Duplicate column",
                                "Key linking two tables",
                                "Primary key replacement",
                                "Unique identifier"
                        ],
                        "correct": 1,
                        "explanation": "A foreign key references a primary key in another table. It establishes relationships and enforces referential integrity.",
                        "difficulty": "Medium",
                        "topic": "Keys"
                },
                {
                        "id": 8,
                        "question": "Which SQL clause filters rows?",
                        "options": [
                                "WHERE",
                                "ORDER BY",
                                "HAVING",
                                "GROUP BY"
                        ],
                        "correct": 0,
                        "explanation": "WHERE filters rows before grouping or aggregation. It specifies conditions that must be met.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 9,
                        "question": "Which command removes a table?",
                        "options": [
                                "REMOVE",
                                "DELETE",
                                "ERASE",
                                "DROP"
                        ],
                        "correct": 3,
                        "explanation": "DROP permanently removes a table and its structure. Unlike DELETE, it removes the schema itself.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 10,
                        "question": "What does ACID stand for?",
                        "options": [
                                "Atomicity, Control, Isolation, Data",
                                "Accuracy, Control, Integrity, Data",
                                "Atomicity, Consistency, Isolation, Durability",
                                "Access, Control, Index, Data"
                        ],
                        "correct": 2,
                        "explanation": "ACID properties ensure reliable database transactions. They guarantee data integrity even during failures.",
                        "difficulty": "Medium",
                        "topic": "Transactions"
                },
                {
                        "id": 11,
                        "question": "Which SQL command updates data?",
                        "options": [
                                "MODIFY",
                                "CHANGE",
                                "UPDATE",
                                "ALTER"
                        ],
                        "correct": 2,
                        "explanation": "UPDATE modifies existing records in a table. It can change one or multiple rows based on conditions.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 12,
                        "question": "What is a composite key?",
                        "options": [
                                "Secondary key",
                                "Duplicate key",
                                "Two primary keys",
                                "Key made of multiple columns"
                        ],
                        "correct": 3,
                        "explanation": "A composite key uses more than one column to uniquely identify a record. It is used when a single column is insufficient.",
                        "difficulty": "Medium",
                        "topic": "Keys"
                },
                {
                        "id": 13,
                        "question": "Which clause sorts query results?",
                        "options": [
                                "SORT BY",
                                "ORDER BY",
                                "GROUP BY",
                                "ARRANGE BY"
                        ],
                        "correct": 1,
                        "explanation": "ORDER BY sorts results in ascending or descending order. It improves readability and analysis.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 14,
                        "question": "What is denormalization?",
                        "options": [
                                "Adding redundancy for performance",
                                "Removing data",
                                "Sorting data",
                                "Encrypting data"
                        ],
                        "correct": 0,
                        "explanation": "Denormalization introduces redundancy to improve read performance. It reduces joins but increases storage.",
                        "difficulty": "Hard",
                        "topic": "Normalization"
                },
                {
                        "id": 15,
                        "question": "Which SQL function counts rows?",
                        "options": [
                                "COUNT()",
                                "TOTAL()",
                                "NUMBER()",
                                "SUM()"
                        ],
                        "correct": 0,
                        "explanation": "COUNT() returns the number of rows matching a condition. It is commonly used in aggregation queries.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 16,
                        "question": "What is an index?",
                        "options": [
                                "Log file",
                                "Duplicate table",
                                "Backup file",
                                "Data structure to speed up searches"
                        ],
                        "correct": 3,
                        "explanation": "Indexes improve query performance by enabling faster data retrieval. They work like book indexes for quick lookup.",
                        "difficulty": "Medium",
                        "topic": "Indexing"
                },
                {
                        "id": 17,
                        "question": "Which join returns matching rows only?",
                        "options": [
                                "FULL JOIN",
                                "LEFT JOIN",
                                "INNER JOIN",
                                "RIGHT JOIN"
                        ],
                        "correct": 2,
                        "explanation": "INNER JOIN returns rows with matching values in both tables. Non-matching rows are excluded.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 18,
                        "question": "What is a view?",
                        "options": [
                                "Index file",
                                "Physical table",
                                "Virtual table from query",
                                "Backup copy"
                        ],
                        "correct": 2,
                        "explanation": "A view is a virtual table created from a SQL query. It does not store data but displays results dynamically.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 19,
                        "question": "Which command deletes rows but keeps table structure?",
                        "options": [
                                "DELETE",
                                "ERASE",
                                "DROP",
                                "REMOVE"
                        ],
                        "correct": 0,
                        "explanation": "DELETE removes rows based on conditions. The table structure remains intact.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 20,
                        "question": "Which normal form removes transitive dependency?",
                        "options": [
                                "1NF",
                                "3NF",
                                "2NF",
                                "BCNF"
                        ],
                        "correct": 1,
                        "explanation": "Third Normal Form removes transitive dependencies. Non-key attributes must depend only on the primary key.",
                        "difficulty": "Medium",
                        "topic": "Normalization"
                },
                {
                        "id": 21,
                        "question": "What is a transaction?",
                        "options": [
                                "Single query",
                                "Data transfer",
                                "Backup process",
                                "Logical unit of work"
                        ],
                        "correct": 3,
                        "explanation": "A transaction groups multiple operations into one logical unit. It ensures data integrity through ACID properties.",
                        "difficulty": "Hard",
                        "topic": "Transactions"
                },
                {
                        "id": 22,
                        "question": "Which command creates a table?",
                        "options": [
                                "NEW TABLE",
                                "ADD TABLE",
                                "CREATE TABLE",
                                "MAKE TABLE"
                        ],
                        "correct": 2,
                        "explanation": "CREATE TABLE defines a new table structure. It specifies columns, data types, and constraints.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 23,
                        "question": "What is a trigger?",
                        "options": [
                                "Index structure",
                                "Automatic action on events",
                                "Manual query",
                                "Backup tool"
                        ],
                        "correct": 1,
                        "explanation": "Triggers execute automatically in response to database events. They enforce rules and maintain integrity.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 24,
                        "question": "Which join returns all rows from left table?",
                        "options": [
                                "INNER JOIN",
                                "LEFT JOIN",
                                "FULL JOIN",
                                "RIGHT JOIN"
                        ],
                        "correct": 1,
                        "explanation": "LEFT JOIN returns all rows from the left table. Matching rows from the right table are included when available.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 25,
                        "question": "What is referential integrity?",
                        "options": [
                                "Valid relationship between tables",
                                "Data encryption",
                                "Data duplication",
                                "Query optimization"
                        ],
                        "correct": 0,
                        "explanation": "Referential integrity ensures foreign keys match primary keys. It prevents orphan records.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 26,
                        "question": "Which SQL clause groups rows?",
                        "options": [
                                "HAVING",
                                "GROUP BY",
                                "WHERE",
                                "ORDER BY"
                        ],
                        "correct": 1,
                        "explanation": "GROUP BY groups rows with similar values. It is used with aggregate functions.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 27,
                        "question": "What is a candidate key?",
                        "options": [
                                "Foreign key",
                                "Secondary index",
                                "Duplicate key",
                                "Possible primary key"
                        ],
                        "correct": 3,
                        "explanation": "A candidate key uniquely identifies records. One candidate key is chosen as the primary key.",
                        "difficulty": "Medium",
                        "topic": "Keys"
                },
                {
                        "id": 28,
                        "question": "Which command modifies table structure?",
                        "options": [
                                "ALTER",
                                "CHANGE",
                                "UPDATE",
                                "MODIFY"
                        ],
                        "correct": 0,
                        "explanation": "ALTER changes table structure such as adding or dropping columns. It does not affect existing data.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 29,
                        "question": "What is a tuple?",
                        "options": [
                                "Row",
                                "Index",
                                "Table",
                                "Column"
                        ],
                        "correct": 0,
                        "explanation": "A tuple represents a single row in a relational table. It contains values for each attribute.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 30,
                        "question": "Which join returns all rows from both tables?",
                        "options": [
                                "LEFT JOIN",
                                "RIGHT JOIN",
                                "INNER JOIN",
                                "FULL OUTER JOIN"
                        ],
                        "correct": 3,
                        "explanation": "FULL OUTER JOIN returns all rows from both tables. Non-matching rows contain NULL values.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 31,
                        "question": "What is a schema?",
                        "options": [
                                "Index",
                                "Database structure definition",
                                "Backup",
                                "Data file"
                        ],
                        "correct": 1,
                        "explanation": "A schema defines the structure of a database. It includes tables, relationships, and constraints.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 32,
                        "question": "Which SQL command removes all rows quickly?",
                        "options": [
                                "TRUNCATE",
                                "REMOVE",
                                "DELETE",
                                "DROP"
                        ],
                        "correct": 0,
                        "explanation": "TRUNCATE removes all rows without logging individual deletions. It is faster than DELETE.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 33,
                        "question": "What is data redundancy?",
                        "options": [
                                "Duplicate data",
                                "Data indexing",
                                "Data encryption",
                                "Data sorting"
                        ],
                        "correct": 0,
                        "explanation": "Redundancy occurs when the same data is stored multiple times. It wastes space and can cause inconsistencies.",
                        "difficulty": "Medium",
                        "topic": "Normalization"
                },
                {
                        "id": 34,
                        "question": "Which normal form ensures atomic values?",
                        "options": [
                                "BCNF",
                                "3NF",
                                "1NF",
                                "2NF"
                        ],
                        "correct": 2,
                        "explanation": "First Normal Form requires each field to contain atomic values. It eliminates repeating groups.",
                        "difficulty": "Medium",
                        "topic": "Normalization"
                },
                {
                        "id": 35,
                        "question": "What is a stored procedure?",
                        "options": [
                                "Precompiled SQL code",
                                "Trigger event",
                                "Backup script",
                                "Index file"
                        ],
                        "correct": 0,
                        "explanation": "Stored procedures are reusable SQL programs stored in the database. They improve performance and maintainability.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 36,
                        "question": "Which key uniquely identifies records?",
                        "options": [
                                "Primary key",
                                "Composite key",
                                "Foreign key",
                                "Candidate key"
                        ],
                        "correct": 0,
                        "explanation": "A primary key uniquely identifies each row. It ensures entity integrity.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 37,
                        "question": "What is a deadlock?",
                        "options": [
                                "Query failure",
                                "Two transactions waiting on each other",
                                "Backup error",
                                "Data loss"
                        ],
                        "correct": 1,
                        "explanation": "Deadlock occurs when transactions block each other indefinitely. Proper locking strategies prevent this.",
                        "difficulty": "Medium",
                        "topic": "Transactions"
                },
                {
                        "id": 38,
                        "question": "Which isolation level prevents dirty reads?",
                        "options": [
                                "Serializable",
                                "Read Uncommitted",
                                "Repeatable Read",
                                "Read Committed"
                        ],
                        "correct": 3,
                        "explanation": "Read Committed ensures transactions only read committed data. This prevents dirty reads.",
                        "difficulty": "Hard",
                        "topic": "Transactions"
                },
                {
                        "id": 39,
                        "question": "What is a cursor?",
                        "options": [
                                "Backup tool",
                                "Index",
                                "Pointer to query result",
                                "Trigger"
                        ],
                        "correct": 2,
                        "explanation": "A cursor allows row-by-row processing of query results. It is used in procedural SQL.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 40,
                        "question": "Which SQL operator checks for NULL values?",
                        "options": [
                                "CHECK NULL",
                                "IS NULL",
                                "= NULL",
                                "== NULL"
                        ],
                        "correct": 1,
                        "explanation": "IS NULL checks for missing values. Standard equality operators do not work with NULL.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 41,
                        "question": "What is a subquery?",
                        "options": [
                                "Nested SQL query",
                                "Backup query",
                                "Index query",
                                "Delete query"
                        ],
                        "correct": 0,
                        "explanation": "A subquery is a query inside another query. It helps filter or compute results dynamically.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 42,
                        "question": "Which command grants privileges?",
                        "options": [
                                "ALLOW",
                                "ACCESS",
                                "GRANT",
                                "PERMIT"
                        ],
                        "correct": 2,
                        "explanation": "GRANT provides user permissions on database objects. It supports access control.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 43,
                        "question": "Which SQL clause filters groups?",
                        "options": [
                                "WHERE",
                                "GROUP BY",
                                "HAVING",
                                "ORDER BY"
                        ],
                        "correct": 2,
                        "explanation": "HAVING filters aggregated results after grouping. WHERE cannot be used with aggregates.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 44,
                        "question": "What is a materialized view?",
                        "options": [
                                "Stored result of a query",
                                "Index file",
                                "Backup table",
                                "Virtual view"
                        ],
                        "correct": 0,
                        "explanation": "Materialized views store query results physically. This improves performance for complex queries.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 45,
                        "question": "Which key allows NULL values?",
                        "options": [
                                "Primary key",
                                "Composite key",
                                "Candidate key",
                                "Foreign key"
                        ],
                        "correct": 3,
                        "explanation": "Foreign keys can contain NULL if the relationship is optional. Primary keys cannot be NULL.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 46,
                        "question": "What is concurrency control?",
                        "options": [
                                "Query optimization",
                                "Backup management",
                                "Managing simultaneous transactions",
                                "Data encryption"
                        ],
                        "correct": 2,
                        "explanation": "Concurrency control ensures database consistency during simultaneous transactions. It prevents conflicts and anomalies.",
                        "difficulty": "Hard",
                        "topic": "Transactions"
                },
                {
                        "id": 47,
                        "question": "Which SQL function returns the maximum value?",
                        "options": [
                                "HIGH()",
                                "MAX()",
                                "UPPER()",
                                "TOP()"
                        ],
                        "correct": 1,
                        "explanation": "MAX() returns the highest value in a column. It is commonly used in aggregation.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 48,
                        "question": "What is a data warehouse?",
                        "options": [
                                "Backup system",
                                "System for analytical reporting",
                                "Transaction log",
                                "Operational database"
                        ],
                        "correct": 1,
                        "explanation": "A data warehouse stores historical data for analysis. It supports decision-making and business intelligence.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 49,
                        "question": "Which normal form removes multi-valued dependency?",
                        "options": [
                                "4NF",
                                "3NF",
                                "2NF",
                                "BCNF"
                        ],
                        "correct": 0,
                        "explanation": "Fourth Normal Form removes multi-valued dependencies. It ensures independent relationships are separated.",
                        "difficulty": "Medium",
                        "topic": "Normalization"
                },
                {
                        "id": 50,
                        "question": "Which SQL clause limits output rows?",
                        "options": [
                                "RANGE",
                                "TOP ONLY",
                                "LIMIT",
                                "STOP"
                        ],
                        "correct": 2,
                        "explanation": "LIMIT restricts the number of rows returned. It is useful for pagination and performance.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 51,
                        "question": "What is a super key?",
                        "options": [
                                "Set of attributes that uniquely identifies a row",
                                "Key with duplicates",
                                "Secondary index",
                                "Foreign key"
                        ],
                        "correct": 0,
                        "explanation": "A super key is any combination of attributes that uniquely identifies a record. It may contain extra attributes beyond what is necessary.",
                        "difficulty": "Medium",
                        "topic": "Keys"
                },
                {
                        "id": 52,
                        "question": "What is a surrogate key?",
                        "options": [
                                "Artificial key generated by system",
                                "Foreign key",
                                "Natural key",
                                "Composite key"
                        ],
                        "correct": 0,
                        "explanation": "A surrogate key is a system-generated unique identifier, such as an auto-increment ID. It avoids dependence on real-world data.",
                        "difficulty": "Medium",
                        "topic": "Keys"
                },
                {
                        "id": 53,
                        "question": "Which join returns non-matching rows from both tables?",
                        "options": [
                                "INNER JOIN",
                                "LEFT JOIN",
                                "RIGHT JOIN",
                                "FULL OUTER JOIN"
                        ],
                        "correct": 3,
                        "explanation": "FULL OUTER JOIN includes all rows from both tables. Non-matching rows are filled with NULL values.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 54,
                        "question": "What is a database instance?",
                        "options": [
                                "Data stored at a specific time",
                                "Backup file",
                                "Query result",
                                "Structure definition"
                        ],
                        "correct": 0,
                        "explanation": "A database instance represents the data stored in the database at a particular moment. It changes as data is added or updated.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 55,
                        "question": "Which constraint ensures unique values in a column?",
                        "options": [
                                "DEFAULT",
                                "CHECK",
                                "UNIQUE",
                                "NOT NULL"
                        ],
                        "correct": 2,
                        "explanation": "UNIQUE prevents duplicate values in a column. Unlike primary keys, it can allow one NULL value depending on DBMS.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 56,
                        "question": "What is a check constraint?",
                        "options": [
                                "Ensures uniqueness",
                                "Validates data based on condition",
                                "Creates index",
                                "Removes duplicates"
                        ],
                        "correct": 1,
                        "explanation": "CHECK constraints enforce rules on column values. For example, ensuring age is greater than 18.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 57,
                        "question": "Which SQL command removes duplicate rows?",
                        "options": [
                                "REMOVE DUPLICATE",
                                "DISTINCT",
                                "FILTER",
                                "UNIQUE"
                        ],
                        "correct": 1,
                        "explanation": "DISTINCT eliminates duplicate rows in query results. It ensures each returned row is unique.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 58,
                        "question": "What is a clustered index?",
                        "options": [
                                "Backup index",
                                "Temporary index",
                                "Index defining physical order of data",
                                "Index stored separately"
                        ],
                        "correct": 2,
                        "explanation": "A clustered index determines the physical order of rows in a table. A table can have only one clustered index.",
                        "difficulty": "Medium",
                        "topic": "Indexing"
                },
                {
                        "id": 59,
                        "question": "Which key references another table?",
                        "options": [
                                "Candidate key",
                                "Primary key",
                                "Foreign key",
                                "Composite key"
                        ],
                        "correct": 2,
                        "explanation": "A foreign key links one table to another. It enforces referential integrity.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 60,
                        "question": "Which SQL statement adds a new column?",
                        "options": [
                                "INSERT COLUMN",
                                "ALTER TABLE ADD",
                                "MODIFY TABLE",
                                "UPDATE"
                        ],
                        "correct": 1,
                        "explanation": "ALTER TABLE ADD adds new columns to an existing table. It does not affect existing data.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 61,
                        "question": "What is data independence?",
                        "options": [
                                "Data encryption",
                                "Data backup",
                                "Data duplication",
                                "Ability to change schema without affecting applications"
                        ],
                        "correct": 3,
                        "explanation": "Data independence separates data structure from application logic. It allows schema changes without rewriting programs.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 62,
                        "question": "Which type of data independence deals with physical storage?",
                        "options": [
                                "Logical",
                                "Structural",
                                "Physical",
                                "Functional"
                        ],
                        "correct": 2,
                        "explanation": "Physical data independence allows changes in storage without affecting logical schema. For example, changing indexing methods.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 63,
                        "question": "Which SQL clause removes groups not meeting condition?",
                        "options": [
                                "GROUP BY",
                                "HAVING",
                                "WHERE",
                                "ORDER BY"
                        ],
                        "correct": 1,
                        "explanation": "HAVING filters grouped results after aggregation. WHERE filters rows before grouping.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 64,
                        "question": "What is a phantom read?",
                        "options": [
                                "Duplicate rows",
                                "Reading uncommitted data",
                                "Data loss",
                                "New rows appearing during transaction"
                        ],
                        "correct": 3,
                        "explanation": "Phantom reads occur when new rows appear in repeated queries within a transaction. This happens due to concurrent inserts.",
                        "difficulty": "Medium",
                        "topic": "Transactions"
                },
                {
                        "id": 65,
                        "question": "Which isolation level prevents phantom reads?",
                        "options": [
                                "Serializable",
                                "Read Committed",
                                "Read Uncommitted",
                                "Repeatable Read"
                        ],
                        "correct": 0,
                        "explanation": "Serializable is the strictest isolation level. It ensures transactions execute as if sequential.",
                        "difficulty": "Hard",
                        "topic": "Transactions"
                },
                {
                        "id": 66,
                        "question": "What is an ER model?",
                        "options": [
                                "Data storage model",
                                "Index structure",
                                "Query language",
                                "Conceptual model of entities and relationships"
                        ],
                        "correct": 3,
                        "explanation": "ER models represent real-world entities and relationships. They are used in database design.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 67,
                        "question": "Which attribute uniquely identifies entity instances?",
                        "options": [
                                "Composite attribute",
                                "Multivalued attribute",
                                "Key attribute",
                                "Derived attribute"
                        ],
                        "correct": 2,
                        "explanation": "Key attributes uniquely identify entity instances. They correspond to primary keys in relational tables.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 68,
                        "question": "Which SQL function calculates average?",
                        "options": [
                                "AVG()",
                                "COUNT()",
                                "MEAN()",
                                "SUM()"
                        ],
                        "correct": 0,
                        "explanation": "AVG() calculates the average value of a column. It ignores NULL values.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 69,
                        "question": "What is a weak entity?",
                        "options": [
                                "Entity without primary key",
                                "Entity with multiple keys",
                                "Entity with no attributes",
                                "Entity with foreign key"
                        ],
                        "correct": 0,
                        "explanation": "Weak entities cannot be uniquely identified by their own attributes. They depend on a strong entity.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 70,
                        "question": "Which join returns all rows from right table?",
                        "options": [
                                "LEFT JOIN",
                                "FULL JOIN",
                                "INNER JOIN",
                                "RIGHT JOIN"
                        ],
                        "correct": 3,
                        "explanation": "RIGHT JOIN returns all rows from the right table. Matching rows from the left table are included when available.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 71,
                        "question": "What is a derived attribute?",
                        "options": [
                                "Calculated from other attributes",
                                "Foreign key",
                                "Primary key",
                                "Stored attribute"
                        ],
                        "correct": 0,
                        "explanation": "Derived attributes are computed from existing data. For example, age derived from date of birth.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 72,
                        "question": "Which SQL keyword renames a column?",
                        "options": [
                                "CHANGE",
                                "ALTER TABLE RENAME",
                                "RENAME COLUMN",
                                "MODIFY NAME"
                        ],
                        "correct": 1,
                        "explanation": "ALTER TABLE RENAME changes column names. Syntax varies slightly across DBMS.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 73,
                        "question": "What is a multi-valued attribute?",
                        "options": [
                                "Derived attribute",
                                "Key attribute",
                                "Attribute with single value",
                                "Attribute with multiple values"
                        ],
                        "correct": 3,
                        "explanation": "Multi-valued attributes store multiple values for one entity. Example: phone numbers.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 74,
                        "question": "Which SQL clause combines rows from multiple tables?",
                        "options": [
                                "UNION",
                                "MERGE",
                                "JOIN",
                                "GROUP"
                        ],
                        "correct": 2,
                        "explanation": "JOIN combines rows based on related columns. It enables relational data retrieval.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 75,
                        "question": "What is UNION in SQL?",
                        "options": [
                                "Combines rows from queries",
                                "Filters rows",
                                "Joins tables",
                                "Groups rows"
                        ],
                        "correct": 0,
                        "explanation": "UNION merges results of multiple queries. It removes duplicates unless UNION ALL is used.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 76,
                        "question": "Which command removes user privileges?",
                        "options": [
                                "DELETE",
                                "DENY",
                                "REMOVE",
                                "REVOKE"
                        ],
                        "correct": 3,
                        "explanation": "REVOKE removes granted permissions. It enforces security control.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 77,
                        "question": "What is a bitmap index best for?",
                        "options": [
                                "High-cardinality columns",
                                "Text fields",
                                "Low-cardinality columns",
                                "Large objects"
                        ],
                        "correct": 2,
                        "explanation": "Bitmap indexes are efficient for columns with few distinct values. They improve query performance in data warehouses.",
                        "difficulty": "Medium",
                        "topic": "Indexing"
                },
                {
                        "id": 78,
                        "question": "Which DBMS language defines schema?",
                        "options": [
                                "DML",
                                "DCL",
                                "TCL",
                                "DDL"
                        ],
                        "correct": 3,
                        "explanation": "Data Definition Language defines database structures. Examples include CREATE and ALTER.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 79,
                        "question": "Which DBMS language controls permissions?",
                        "options": [
                                "TCL",
                                "DCL",
                                "DML",
                                "DDL"
                        ],
                        "correct": 1,
                        "explanation": "Data Control Language manages access rights. GRANT and REVOKE are examples.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 80,
                        "question": "Which DBMS language manages transactions?",
                        "options": [
                                "DCL",
                                "TCL",
                                "DML",
                                "DDL"
                        ],
                        "correct": 1,
                        "explanation": "Transaction Control Language handles COMMIT and ROLLBACK. It ensures transaction consistency.",
                        "difficulty": "Hard",
                        "topic": "Transactions"
                },
                {
                        "id": 81,
                        "question": "What is COMMIT?",
                        "options": [
                                "Undo changes",
                                "Save changes permanently",
                                "Delete records",
                                "Create table"
                        ],
                        "correct": 1,
                        "explanation": "COMMIT finalizes a transaction. Changes become permanent.",
                        "difficulty": "Easy",
                        "topic": "Transactions"
                },
                {
                        "id": 82,
                        "question": "What is ROLLBACK?",
                        "options": [
                                "Add column",
                                "Delete table",
                                "Undo changes",
                                "Save changes"
                        ],
                        "correct": 2,
                        "explanation": "ROLLBACK reverses uncommitted changes. It restores database to previous state.",
                        "difficulty": "Easy",
                        "topic": "Transactions"
                },
                {
                        "id": 83,
                        "question": "What is SAVEPOINT?",
                        "options": [
                                "Index",
                                "Trigger",
                                "Backup",
                                "Partial rollback marker"
                        ],
                        "correct": 3,
                        "explanation": "SAVEPOINT marks a point within a transaction. You can roll back to it without undoing the entire transaction.",
                        "difficulty": "Medium",
                        "topic": "Transactions"
                },
                {
                        "id": 84,
                        "question": "Which key enforces entity integrity?",
                        "options": [
                                "Candidate key",
                                "Foreign key",
                                "Composite key",
                                "Primary key"
                        ],
                        "correct": 3,
                        "explanation": "Primary keys ensure each entity is uniquely identifiable. This maintains entity integrity.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 85,
                        "question": "What is cardinality in DBMS?",
                        "options": [
                                "Number of keys",
                                "Number of indexes",
                                "Number of attributes",
                                "Number of rows in a table"
                        ],
                        "correct": 3,
                        "explanation": "Cardinality refers to the number of tuples (rows) in a relation. It indicates table size.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 86,
                        "question": "Which type of join returns matching and non-matching rows?",
                        "options": [
                                "SELF JOIN",
                                "FULL OUTER JOIN",
                                "CROSS JOIN",
                                "INNER JOIN"
                        ],
                        "correct": 1,
                        "explanation": "FULL OUTER JOIN includes all rows from both tables. Matching rows are combined; others contain NULL.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 87,
                        "question": "What is a cross join?",
                        "options": [
                                "Natural join",
                                "Join with condition",
                                "Cartesian product",
                                "Self join"
                        ],
                        "correct": 2,
                        "explanation": "Cross join returns all possible combinations of rows. It produces a Cartesian product.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 88,
                        "question": "Which key combination uniquely identifies records?",
                        "options": [
                                "Foreign key",
                                "Duplicate key",
                                "Secondary key",
                                "Composite key"
                        ],
                        "correct": 3,
                        "explanation": "A composite key uses multiple columns to uniquely identify a record. It is useful when one column is insufficient.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 89,
                        "question": "What is indexing overhead?",
                        "options": [
                                "Backup cost",
                                "Query delay",
                                "Storage used by indexes",
                                "Data duplication"
                        ],
                        "correct": 2,
                        "explanation": "Indexes require additional storage space. They improve performance but increase storage overhead.",
                        "difficulty": "Medium",
                        "topic": "Indexing"
                },
                {
                        "id": 90,
                        "question": "Which command displays table structure?",
                        "options": [
                                "STRUCTURE",
                                "DESCRIBE",
                                "VIEW TABLE",
                                "SHOW TABLE"
                        ],
                        "correct": 1,
                        "explanation": "DESCRIBE shows column names, types, and constraints. It helps understand table schema.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 91,
                        "question": "What is a natural key?",
                        "options": [
                                "Foreign key",
                                "Real-world attribute used as key",
                                "Composite key",
                                "System-generated key"
                        ],
                        "correct": 1,
                        "explanation": "Natural keys come from real-world data like SSN or email. They have business meaning.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 92,
                        "question": "Which anomaly occurs due to redundancy?",
                        "options": [
                                "Syntax error",
                                "Update anomaly",
                                "Deadlock",
                                "Backup failure"
                        ],
                        "correct": 1,
                        "explanation": "Redundant data can cause inconsistent updates. Normalization reduces this problem.",
                        "difficulty": "Medium",
                        "topic": "Normalization"
                },
                {
                        "id": 93,
                        "question": "Which SQL operator checks for range?",
                        "options": [
                                "IN",
                                "RANGE",
                                "WITHIN",
                                "BETWEEN"
                        ],
                        "correct": 3,
                        "explanation": "BETWEEN filters values within a specified range. It is inclusive of boundaries.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 94,
                        "question": "Which clause limits returned rows in SQL Server?",
                        "options": [
                                "LIMIT",
                                "RANGE",
                                "FETCH",
                                "TOP"
                        ],
                        "correct": 3,
                        "explanation": "SQL Server uses TOP to restrict result size. LIMIT is used in MySQL/PostgreSQL.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 95,
                        "question": "What is a self join?",
                        "options": [
                                "Outer join",
                                "Joining table with itself",
                                "Joining two tables",
                                "Cross join"
                        ],
                        "correct": 1,
                        "explanation": "A self join treats a table as two separate instances. It is useful for hierarchical relationships.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 96,
                        "question": "What is a log file in DBMS?",
                        "options": [
                                "Index file",
                                "Record of database changes",
                                "Backup file",
                                "Data table"
                        ],
                        "correct": 1,
                        "explanation": "Log files track transactions and changes. They support recovery after failures.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 97,
                        "question": "Which recovery technique uses logs?",
                        "options": [
                                "Replication",
                                "Rollforward",
                                "Snapshot",
                                "Log-based recovery"
                        ],
                        "correct": 3,
                        "explanation": "Log-based recovery replays or undoes transactions using logs. It ensures data consistency.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 98,
                        "question": "What is sharding?",
                        "options": [
                                "Backup technique",
                                "Splitting database into smaller parts",
                                "Query optimization",
                                "Indexing method"
                        ],
                        "correct": 1,
                        "explanation": "Sharding distributes data across multiple servers. It improves scalability and performance.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 99,
                        "question": "Which SQL clause searches pattern?",
                        "options": [
                                "MATCH",
                                "FIND",
                                "SEARCH",
                                "LIKE"
                        ],
                        "correct": 3,
                        "explanation": "LIKE matches patterns using wildcards. It is used for text searches.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 100,
                        "question": "What is replication?",
                        "options": [
                                "Index creation",
                                "Query optimization",
                                "Data deletion",
                                "Copying data across servers"
                        ],
                        "correct": 3,
                        "explanation": "Replication duplicates data across systems. It improves availability and fault tolerance.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 101,
                        "question": "What is vertical partitioning?",
                        "options": [
                                "Splitting table by rows",
                                "Deleting columns",
                                "Copying tables",
                                "Splitting table by columns"
                        ],
                        "correct": 3,
                        "explanation": "Vertical partitioning divides a table into smaller tables containing subsets of columns. It improves performance by accessing only required attributes.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 102,
                        "question": "What is horizontal partitioning?",
                        "options": [
                                "Splitting by rows",
                                "Copying indexes",
                                "Splitting by columns",
                                "Deleting rows"
                        ],
                        "correct": 0,
                        "explanation": "Horizontal partitioning divides a table into subsets of rows. It helps manage large datasets and improves query performance.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 103,
                        "question": "Which SQL clause is used for pattern matching?",
                        "options": [
                                "LIKE",
                                "MATCH",
                                "SEARCH",
                                "FIND"
                        ],
                        "correct": 0,
                        "explanation": "LIKE is used with wildcards such as % and _ for pattern matching. It enables flexible text searches.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 104,
                        "question": "What is a cascading delete?",
                        "options": [
                                "Deleting all tables",
                                "Dropping database",
                                "Automatically deleting related records",
                                "Removing indexes"
                        ],
                        "correct": 2,
                        "explanation": "Cascading delete removes related rows in child tables when a parent row is deleted. It maintains referential integrity.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 105,
                        "question": "Which type of index uses a tree structure?",
                        "options": [
                                "Bitmap index",
                                "Hash index",
                                "Cluster index",
                                "B-tree index"
                        ],
                        "correct": 3,
                        "explanation": "B-tree indexes use a balanced tree structure for fast searching. They support range queries efficiently.",
                        "difficulty": "Medium",
                        "topic": "Indexing"
                },
                {
                        "id": 106,
                        "question": "What is a transaction log used for?",
                        "options": [
                                "Recording database changes",
                                "Storing indexes",
                                "Query optimization",
                                "Storing backups"
                        ],
                        "correct": 0,
                        "explanation": "Transaction logs record all changes made to the database. They support recovery and ensure durability.",
                        "difficulty": "Hard",
                        "topic": "Transactions"
                },
                {
                        "id": 107,
                        "question": "Which SQL clause removes duplicate results?",
                        "options": [
                                "FILTER",
                                "DISTINCT",
                                "UNIQUE",
                                "REMOVE"
                        ],
                        "correct": 1,
                        "explanation": "DISTINCT eliminates duplicate rows in query results. It ensures each result row is unique.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 108,
                        "question": "What is normalization primarily used for?",
                        "options": [
                                "Increasing redundancy",
                                "Sorting data",
                                "Encrypting data",
                                "Reducing redundancy"
                        ],
                        "correct": 3,
                        "explanation": "Normalization organizes data to eliminate redundancy. It improves consistency and reduces anomalies.",
                        "difficulty": "Hard",
                        "topic": "Normalization"
                },
                {
                        "id": 109,
                        "question": "Which normal form eliminates transitive dependency?",
                        "options": [
                                "1NF",
                                "3NF",
                                "2NF",
                                "4NF"
                        ],
                        "correct": 1,
                        "explanation": "Third Normal Form ensures non-key attributes depend only on the primary key. This removes indirect dependencies.",
                        "difficulty": "Medium",
                        "topic": "Normalization"
                },
                {
                        "id": 110,
                        "question": "What is a star schema?",
                        "options": [
                                "Central fact table with dimension tables",
                                "Single table schema",
                                "Circular database",
                                "Network model"
                        ],
                        "correct": 0,
                        "explanation": "Star schema is used in data warehouses. A central fact table connects to dimension tables for analysis.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 111,
                        "question": "Which SQL clause groups rows with similar values?",
                        "options": [
                                "SORT BY",
                                "GROUP BY",
                                "HAVING",
                                "ORDER BY"
                        ],
                        "correct": 1,
                        "explanation": "GROUP BY groups rows sharing common column values. It is used with aggregate functions.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 112,
                        "question": "What is a snowflake schema?",
                        "options": [
                                "Flat schema",
                                "Network schema",
                                "Single table schema",
                                "Normalized star schema"
                        ],
                        "correct": 3,
                        "explanation": "Snowflake schema normalizes dimension tables in a star schema. This reduces redundancy but increases joins.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 113,
                        "question": "Which operation combines rows from two queries?",
                        "options": [
                                "JOIN",
                                "UNION",
                                "MERGE",
                                "CONNECT"
                        ],
                        "correct": 1,
                        "explanation": "UNION combines results of multiple queries into one result set. It removes duplicates unless UNION ALL is used.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 114,
                        "question": "What is a fact table?",
                        "options": [
                                "Table storing metadata",
                                "Table storing keys",
                                "Table storing measurements and metrics",
                                "Table storing indexes"
                        ],
                        "correct": 2,
                        "explanation": "Fact tables contain quantitative data such as sales or transactions. They link to dimension tables.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 115,
                        "question": "Which SQL function returns the smallest value?",
                        "options": [
                                "MIN()",
                                "LEAST()",
                                "SMALL()",
                                "LOW()"
                        ],
                        "correct": 0,
                        "explanation": "MIN() returns the smallest value in a column. It is used in aggregate queries.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 116,
                        "question": "What is a dimension table?",
                        "options": [
                                "Table storing indexes",
                                "Table storing descriptive attributes",
                                "Table storing logs",
                                "Table storing metrics"
                        ],
                        "correct": 1,
                        "explanation": "Dimension tables contain descriptive attributes like time, location, or product. They provide context to fact tables.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 117,
                        "question": "Which key enforces referential integrity?",
                        "options": [
                                "Primary key",
                                "Candidate key",
                                "Composite key",
                                "Foreign key"
                        ],
                        "correct": 3,
                        "explanation": "Foreign keys ensure values match primary keys in related tables. This prevents invalid references.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 118,
                        "question": "What is OLTP?",
                        "options": [
                                "Online Transaction Processing",
                                "Offline Transaction Processing",
                                "Object-Level Transaction Processing",
                                "Online Learning Transaction Processing"
                        ],
                        "correct": 0,
                        "explanation": "OLTP systems manage real-time transactions. They focus on fast insert, update, and delete operations.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 119,
                        "question": "What is OLAP?",
                        "options": [
                                "Online Analytical Processing",
                                "Online Access Processing",
                                "Object-Level Analytical Processing",
                                "Offline Analytical Processing"
                        ],
                        "correct": 0,
                        "explanation": "OLAP systems analyze large datasets for decision-making. They support complex queries and reporting.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 120,
                        "question": "Which operation rolls back to a savepoint?",
                        "options": [
                                "REVOKE",
                                "DELETE",
                                "ROLLBACK TO SAVEPOINT",
                                "COMMIT"
                        ],
                        "correct": 2,
                        "explanation": "ROLLBACK TO SAVEPOINT undoes changes up to a specific point. It allows partial transaction rollback.",
                        "difficulty": "Medium",
                        "topic": "Transactions"
                },
                {
                        "id": 121,
                        "question": "What is a data mart?",
                        "options": [
                                "Query engine",
                                "Index storage",
                                "Backup system",
                                "Small data warehouse for specific department"
                        ],
                        "correct": 3,
                        "explanation": "Data marts focus on specific business areas. They provide targeted analysis.",
                        "difficulty": "Easy",
                        "topic": "Database Concepts"
                },
                {
                        "id": 122,
                        "question": "Which SQL clause removes table?",
                        "options": [
                                "DROP TABLE",
                                "DELETE",
                                "REMOVE TABLE",
                                "CLEAR TABLE"
                        ],
                        "correct": 0,
                        "explanation": "DROP TABLE removes the table structure and data permanently. It cannot be rolled back in many systems.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 123,
                        "question": "What is a correlated subquery?",
                        "options": [
                                "Nested join",
                                "Query referencing outer query",
                                "Aggregate query",
                                "Independent query"
                        ],
                        "correct": 1,
                        "explanation": "Correlated subqueries depend on values from the outer query. They execute once for each row.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 124,
                        "question": "Which operator checks multiple values?",
                        "options": [
                                "BETWEEN",
                                "LIKE",
                                "EXISTS",
                                "IN"
                        ],
                        "correct": 3,
                        "explanation": "IN checks if a value matches any value in a list. It simplifies multiple OR conditions.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 125,
                        "question": "What is a non-clustered index?",
                        "options": [
                                "Separate structure pointing to data",
                                "Temporary index",
                                "Backup index",
                                "Defines physical order"
                        ],
                        "correct": 0,
                        "explanation": "Non-clustered indexes store pointers to data rows. They improve search speed without altering physical order.",
                        "difficulty": "Medium",
                        "topic": "Indexing"
                },
                {
                        "id": 126,
                        "question": "What is a data anomaly?",
                        "options": [
                                "Index corruption",
                                "Backup failure",
                                "Inconsistency due to redundancy",
                                "Query error"
                        ],
                        "correct": 2,
                        "explanation": "Data anomalies occur when redundant data leads to inconsistencies. Normalization reduces anomalies.",
                        "difficulty": "Medium",
                        "topic": "Normalization"
                },
                {
                        "id": 127,
                        "question": "Which SQL clause checks existence of rows?",
                        "options": [
                                "CHECK",
                                "EXISTS",
                                "PRESENT",
                                "VERIFY"
                        ],
                        "correct": 1,
                        "explanation": "EXISTS returns true if a subquery returns rows. It is used for conditional checks.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 128,
                        "question": "What is a distributed database?",
                        "options": [
                                "Cloud storage only",
                                "Backup system",
                                "Single location database",
                                "Database spread across multiple locations"
                        ],
                        "correct": 3,
                        "explanation": "Distributed databases store data across multiple sites. They improve availability and scalability.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 129,
                        "question": "Which key can have duplicate values?",
                        "options": [
                                "Primary key",
                                "Foreign key",
                                "Unique key",
                                "Candidate key"
                        ],
                        "correct": 1,
                        "explanation": "Foreign keys may contain duplicates. They represent relationships rather than uniqueness.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 130,
                        "question": "What is a domain in DBMS?",
                        "options": [
                                "Table",
                                "Query",
                                "Range of valid values for an attribute",
                                "Index"
                        ],
                        "correct": 2,
                        "explanation": "A domain defines permissible values for a column. It ensures data validity.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 131,
                        "question": "Which SQL clause is used for renaming tables?",
                        "options": [
                                "CHANGE TABLE",
                                "RENAME TABLE",
                                "MODIFY TABLE",
                                "ALTER TABLE RENAME"
                        ],
                        "correct": 3,
                        "explanation": "ALTER TABLE RENAME changes table names. Syntax may vary slightly across DBMS.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 132,
                        "question": "What is a temporal database?",
                        "options": [
                                "Temporary database",
                                "Stores time-based data",
                                "Backup database",
                                "Distributed database"
                        ],
                        "correct": 1,
                        "explanation": "Temporal databases track data over time. They store historical and current values.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 133,
                        "question": "Which join combines rows with matching values in both tables?",
                        "options": [
                                "INNER JOIN",
                                "RIGHT JOIN",
                                "LEFT JOIN",
                                "FULL JOIN"
                        ],
                        "correct": 0,
                        "explanation": "INNER JOIN returns rows with matching values in both tables. Non-matching rows are excluded.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 134,
                        "question": "What is data mining?",
                        "options": [
                                "Extracting patterns from data",
                                "Data deletion",
                                "Indexing method",
                                "Backup process"
                        ],
                        "correct": 0,
                        "explanation": "Data mining analyzes large datasets to discover patterns. It supports decision-making.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 135,
                        "question": "Which SQL keyword prevents NULL values?",
                        "options": [
                                "DEFAULT",
                                "NOT NULL",
                                "UNIQUE",
                                "CHECK"
                        ],
                        "correct": 1,
                        "explanation": "NOT NULL ensures a column always contains a value. It enforces data completeness.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 136,
                        "question": "What is a key constraint?",
                        "options": [
                                "Limits query results",
                                "Enforces uniqueness",
                                "Deletes duplicates",
                                "Encrypts data"
                        ],
                        "correct": 1,
                        "explanation": "Key constraints ensure uniqueness of records. They maintain entity integrity.",
                        "difficulty": "Medium",
                        "topic": "Keys"
                },
                {
                        "id": 137,
                        "question": "Which DBMS component manages concurrency?",
                        "options": [
                                "Query processor",
                                "Transaction manager",
                                "Storage manager",
                                "Index manager"
                        ],
                        "correct": 1,
                        "explanation": "The transaction manager ensures safe concurrent execution. It maintains consistency and isolation.",
                        "difficulty": "Hard",
                        "topic": "Transactions"
                },
                {
                        "id": 138,
                        "question": "What is a heap file organization?",
                        "options": [
                                "Temporary file",
                                "Unordered file",
                                "Indexed file",
                                "Sorted file"
                        ],
                        "correct": 1,
                        "explanation": "Heap files store records in no particular order. They allow fast insertion.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 139,
                        "question": "Which SQL clause sets default values?",
                        "options": [
                                "VALUE",
                                "DEFAULT",
                                "SET",
                                "INIT"
                        ],
                        "correct": 1,
                        "explanation": "DEFAULT assigns a value when no value is provided. It ensures consistent data entry.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 140,
                        "question": "What is a recursive query?",
                        "options": [
                                "Query calling itself",
                                "Nested query",
                                "Aggregate query",
                                "Join query"
                        ],
                        "correct": 0,
                        "explanation": "Recursive queries reference their own results. They are used for hierarchical data.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 141,
                        "question": "Which SQL feature supports hierarchical queries?",
                        "options": [
                                "ORDER BY",
                                "GROUP BY",
                                "HAVING",
                                "WITH RECURSIVE"
                        ],
                        "correct": 3,
                        "explanation": "WITH RECURSIVE enables recursive queries. It is used for tree-like structures.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 142,
                        "question": "What is a pivot operation?",
                        "options": [
                                "Deleting rows",
                                "Sorting data",
                                "Rotating rows into columns",
                                "Joining tables"
                        ],
                        "correct": 2,
                        "explanation": "Pivot transforms rows into columns for analysis. It helps summarize data.",
                        "difficulty": "Easy",
                        "topic": "Database Concepts"
                },
                {
                        "id": 143,
                        "question": "Which index type is best for equality searches?",
                        "options": [
                                "Bitmap index",
                                "Clustered index",
                                "B-tree",
                                "Hash index"
                        ],
                        "correct": 3,
                        "explanation": "Hash indexes provide fast equality lookups. They are not suitable for range queries.",
                        "difficulty": "Medium",
                        "topic": "Indexing"
                },
                {
                        "id": 144,
                        "question": "What is a surrogate primary key?",
                        "options": [
                                "Natural key",
                                "Artificial unique identifier",
                                "Composite key",
                                "Foreign key"
                        ],
                        "correct": 1,
                        "explanation": "Surrogate keys are system-generated identifiers. They simplify relationships and indexing.",
                        "difficulty": "Medium",
                        "topic": "Keys"
                },
                {
                        "id": 145,
                        "question": "Which SQL clause combines tables without condition?",
                        "options": [
                                "LEFT JOIN",
                                "INNER JOIN",
                                "RIGHT JOIN",
                                "CROSS JOIN"
                        ],
                        "correct": 3,
                        "explanation": "CROSS JOIN produces a Cartesian product. It combines every row from both tables.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 146,
                        "question": "What is a checkpoint in DBMS?",
                        "options": [
                                "Recovery marker",
                                "Index",
                                "Query",
                                "Backup"
                        ],
                        "correct": 0,
                        "explanation": "Checkpoints mark consistent states in logs. They reduce recovery time after crashes.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                },
                {
                        "id": 147,
                        "question": "Which property ensures transactions are isolated?",
                        "options": [
                                "Atomicity",
                                "Durability",
                                "Consistency",
                                "Isolation"
                        ],
                        "correct": 3,
                        "explanation": "Isolation ensures transactions do not interfere with each other. It prevents concurrency anomalies.",
                        "difficulty": "Hard",
                        "topic": "Transactions"
                },
                {
                        "id": 148,
                        "question": "What is a view used for?",
                        "options": [
                                "Simplifying complex queries",
                                "Storing data",
                                "Creating indexes",
                                "Backup"
                        ],
                        "correct": 0,
                        "explanation": "Views present data from one or more tables. They simplify queries and enhance security.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 149,
                        "question": "Which SQL clause filters rows before grouping?",
                        "options": [
                                "WHERE",
                                "HAVING",
                                "ORDER BY",
                                "GROUP BY"
                        ],
                        "correct": 0,
                        "explanation": "WHERE filters rows before aggregation. HAVING filters after grouping.",
                        "difficulty": "Medium",
                        "topic": "SQL"
                },
                {
                        "id": 150,
                        "question": "What is database scalability?",
                        "options": [
                                "Ability to encrypt data",
                                "Ability to handle growing data and users",
                                "Ability to create backups",
                                "Ability to delete data"
                        ],
                        "correct": 1,
                        "explanation": "Scalability ensures the database can grow without performance loss. Techniques include sharding and replication.",
                        "difficulty": "Medium",
                        "topic": "Database Concepts"
                }
        ],
        "os": [
                {
                        "id": 1,
                        "question": "What is an operating system?",
                        "options": [
                                "Programming language",
                                "Database system",
                                "Software that manages hardware and software resources",
                                "Hardware component"
                        ],
                        "correct": 2,
                        "explanation": "An operating system acts as an interface between users and hardware. It manages processes, memory, files, and devices.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 2,
                        "question": "Which of the following is not a function of an OS?",
                        "options": [
                                "File management",
                                "Compilation",
                                "Memory management",
                                "Process management"
                        ],
                        "correct": 1,
                        "explanation": "Compilation is performed by compilers, not the OS. The OS focuses on resource management and system coordination.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 3,
                        "question": "What is a process?",
                        "options": [
                                "Hardware unit",
                                "Memory block",
                                "Program in execution",
                                "Program file"
                        ],
                        "correct": 2,
                        "explanation": "A process is an active instance of a program. It includes code, data, stack, and execution state.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 4,
                        "question": "What is a thread?",
                        "options": [
                                "Memory unit",
                                "Scheduling algorithm",
                                "Lightweight process",
                                "Independent program"
                        ],
                        "correct": 2,
                        "explanation": "Threads are smaller units of a process that share resources. They enable parallel execution within the same process.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 5,
                        "question": "Which scheduling algorithm uses time slices?",
                        "options": [
                                "Priority Scheduling",
                                "FCFS",
                                "SJF",
                                "Round Robin"
                        ],
                        "correct": 3,
                        "explanation": "Round Robin assigns a fixed time quantum to each process. This ensures fair CPU allocation.",
                        "difficulty": "Medium",
                        "topic": "CPU Scheduling"
                },
                {
                        "id": 6,
                        "question": "What is context switching?",
                        "options": [
                                "Restarting process",
                                "Switching users",
                                "Changing OS",
                                "Saving and loading process state"
                        ],
                        "correct": 3,
                        "explanation": "Context switching saves the state of a running process and loads another. It enables multitasking.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 7,
                        "question": "Which scheduling algorithm may cause starvation?",
                        "options": [
                                "FCFS",
                                "Round Robin",
                                "Priority Scheduling",
                                "FIFO"
                        ],
                        "correct": 2,
                        "explanation": "Low-priority processes may never execute if higher-priority tasks keep arriving. This leads to starvation.",
                        "difficulty": "Medium",
                        "topic": "CPU Scheduling"
                },
                {
                        "id": 8,
                        "question": "What is deadlock?",
                        "options": [
                                "Program crash",
                                "CPU failure",
                                "Memory overflow",
                                "Processes waiting indefinitely for resources"
                        ],
                        "correct": 3,
                        "explanation": "Deadlock occurs when processes hold resources and wait for each other. None can proceed.",
                        "difficulty": "Medium",
                        "topic": "Concurrency"
                },
                {
                        "id": 9,
                        "question": "Which condition is necessary for deadlock?",
                        "options": [
                                "Virtual memory",
                                "Preemption",
                                "Mutual exclusion",
                                "Multiprocessing"
                        ],
                        "correct": 2,
                        "explanation": "Mutual exclusion means only one process can use a resource at a time. It is one of the four necessary deadlock conditions.",
                        "difficulty": "Medium",
                        "topic": "Concurrency"
                },
                {
                        "id": 10,
                        "question": "What is paging?",
                        "options": [
                                "Memory fragmentation",
                                "File allocation",
                                "Memory management technique using fixed-size blocks",
                                "Disk scheduling"
                        ],
                        "correct": 2,
                        "explanation": "Paging divides memory into fixed-size pages and frames. It reduces external fragmentation.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 11,
                        "question": "What is virtual memory?",
                        "options": [
                                "Memory on disk used as extension of RAM",
                                "ROM",
                                "Cache memory",
                                "Physical RAM"
                        ],
                        "correct": 0,
                        "explanation": "Virtual memory allows programs to use more memory than physically available. It uses disk space to simulate RAM.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 12,
                        "question": "Which memory is fastest?",
                        "options": [
                                "RAM",
                                "Cache",
                                "Hard disk",
                                "Virtual memory"
                        ],
                        "correct": 1,
                        "explanation": "Cache memory is closest to CPU and has the fastest access time. It stores frequently used data.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 13,
                        "question": "What is thrashing?",
                        "options": [
                                "CPU overheating",
                                "Excessive paging activity",
                                "Disk failure",
                                "Process termination"
                        ],
                        "correct": 1,
                        "explanation": "Thrashing occurs when the system spends more time swapping pages than executing processes. It degrades performance.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 14,
                        "question": "Which OS is single-user?",
                        "options": [
                                "UNIX",
                                "MS-DOS",
                                "Linux",
                                "Windows Server"
                        ],
                        "correct": 1,
                        "explanation": "MS-DOS supports one user at a time. Modern OSs support multiple users.",
                        "difficulty": "Easy",
                        "topic": "OS Concepts"
                },
                {
                        "id": 15,
                        "question": "What is a system call?",
                        "options": [
                                "Scheduling method",
                                "Interface between user program and OS",
                                "File system",
                                "Hardware interrupt"
                        ],
                        "correct": 1,
                        "explanation": "System calls allow programs to request OS services. Examples include file operations and process control.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 16,
                        "question": "What is a semaphore?",
                        "options": [
                                "Synchronization tool",
                                "File system",
                                "Memory unit",
                                "Scheduling algorithm"
                        ],
                        "correct": 0,
                        "explanation": "Semaphores control access to shared resources. They prevent race conditions in concurrent processes.",
                        "difficulty": "Medium",
                        "topic": "Concurrency"
                },
                {
                        "id": 17,
                        "question": "Which scheduling algorithm is non-preemptive?",
                        "options": [
                                "Multilevel queue",
                                "FCFS",
                                "Priority (preemptive)",
                                "Round Robin"
                        ],
                        "correct": 1,
                        "explanation": "FCFS executes processes in arrival order without interruption. Once started, a process runs to completion.",
                        "difficulty": "Medium",
                        "topic": "CPU Scheduling"
                },
                {
                        "id": 18,
                        "question": "What is a critical section?",
                        "options": [
                                "Disk partition",
                                "OS kernel",
                                "Code accessing shared resource",
                                "Memory block"
                        ],
                        "correct": 2,
                        "explanation": "Critical sections access shared data. They must be protected to avoid race conditions.",
                        "difficulty": "Medium",
                        "topic": "Concurrency"
                },
                {
                        "id": 19,
                        "question": "Which file allocation method uses linked blocks?",
                        "options": [
                                "Linked allocation",
                                "Contiguous",
                                "Sequential",
                                "Indexed allocation"
                        ],
                        "correct": 0,
                        "explanation": "Linked allocation stores file blocks as a linked list. It avoids external fragmentation.",
                        "difficulty": "Medium",
                        "topic": "File Systems"
                },
                {
                        "id": 20,
                        "question": "What is fragmentation?",
                        "options": [
                                "Data encryption",
                                "Disk scheduling",
                                "File compression",
                                "Wasted memory space"
                        ],
                        "correct": 3,
                        "explanation": "Fragmentation occurs when memory is inefficiently used. It can be internal or external.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 21,
                        "question": "What is internal fragmentation?",
                        "options": [
                                "Unused memory outside blocks",
                                "Unused space inside allocated block",
                                "Disk error",
                                "CPU idle time"
                        ],
                        "correct": 1,
                        "explanation": "Internal fragmentation happens when allocated memory is larger than needed. The extra space is wasted.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 22,
                        "question": "What is external fragmentation?",
                        "options": [
                                "Disk crash",
                                "Scattered free memory blocks",
                                "CPU overload",
                                "Unused memory inside block"
                        ],
                        "correct": 1,
                        "explanation": "External fragmentation occurs when free memory is divided into small blocks. This prevents allocation of large blocks.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 23,
                        "question": "Which disk scheduling algorithm moves in one direction?",
                        "options": [
                                "SSTF",
                                "FIFO",
                                "FCFS",
                                "SCAN"
                        ],
                        "correct": 3,
                        "explanation": "SCAN (elevator algorithm) moves the disk arm in one direction servicing requests. It reduces seek time.",
                        "difficulty": "Medium",
                        "topic": "CPU Scheduling"
                },
                {
                        "id": 24,
                        "question": "What is a file system?",
                        "options": [
                                "Method to organize and store files",
                                "Programming language",
                                "CPU component",
                                "Hardware device"
                        ],
                        "correct": 0,
                        "explanation": "A file system manages how data is stored and retrieved. It organizes files on storage devices.",
                        "difficulty": "Medium",
                        "topic": "File Systems"
                },
                {
                        "id": 25,
                        "question": "Which OS component manages memory?",
                        "options": [
                                "File system",
                                "Device driver",
                                "Scheduler",
                                "Memory manager"
                        ],
                        "correct": 3,
                        "explanation": "Memory manager handles allocation and deallocation. It ensures efficient use of RAM.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 26,
                        "question": "What is a zombie process?",
                        "options": [
                                "Suspended process",
                                "Terminated process with entry in process table",
                                "Running process",
                                "Deadlock state"
                        ],
                        "correct": 1,
                        "explanation": "Zombie processes have finished execution but still exist in the process table. They await parent process acknowledgment.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 27,
                        "question": "What is a device driver?",
                        "options": [
                                "Memory unit",
                                "File system",
                                "Software controlling hardware",
                                "Hardware device"
                        ],
                        "correct": 2,
                        "explanation": "Device drivers allow OS to communicate with hardware. They provide control and functionality.",
                        "difficulty": "Medium",
                        "topic": "I/O Management"
                },
                {
                        "id": 28,
                        "question": "Which scheduling algorithm minimizes average waiting time?",
                        "options": [
                                "FCFS",
                                "FIFO",
                                "Round Robin",
                                "SJF"
                        ],
                        "correct": 3,
                        "explanation": "Shortest Job First executes shortest tasks first. This reduces average waiting time.",
                        "difficulty": "Medium",
                        "topic": "CPU Scheduling"
                },
                {
                        "id": 29,
                        "question": "What is multitasking?",
                        "options": [
                                "Multiple disks",
                                "Running multiple processes simultaneously",
                                "Multiple CPUs",
                                "Multiple users"
                        ],
                        "correct": 1,
                        "explanation": "Multitasking allows several processes to share CPU time. It improves system utilization.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 30,
                        "question": "What is multiprogramming?",
                        "options": [
                                "Running one program",
                                "Multiple programs in memory at once",
                                "Multiple CPUs",
                                "Disk scheduling"
                        ],
                        "correct": 1,
                        "explanation": "Multiprogramming keeps multiple programs in memory. CPU switches among them to improve efficiency.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 31,
                        "question": "Which memory is volatile?",
                        "options": [
                                "SSD",
                                "ROM",
                                "RAM",
                                "Hard disk"
                        ],
                        "correct": 2,
                        "explanation": "RAM loses data when power is off. It is used for temporary storage.",
                        "difficulty": "Easy",
                        "topic": "Memory Management"
                },
                {
                        "id": 32,
                        "question": "What is swapping?",
                        "options": [
                                "Disk scheduling",
                                "Memory allocation",
                                "File compression",
                                "Moving processes between RAM and disk"
                        ],
                        "correct": 3,
                        "explanation": "Swapping temporarily moves processes to disk to free RAM. It supports multiprogramming.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 33,
                        "question": "What is a kernel?",
                        "options": [
                                "Core of operating system",
                                "Application program",
                                "File system",
                                "Hardware component"
                        ],
                        "correct": 0,
                        "explanation": "The kernel manages hardware and system resources. It provides essential OS services.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 34,
                        "question": "Which OS type supports multiple users?",
                        "options": [
                                "Embedded OS",
                                "Single-user OS",
                                "Batch OS",
                                "Multi-user OS"
                        ],
                        "correct": 3,
                        "explanation": "Multi-user OS allows multiple users to access the system simultaneously. Examples include UNIX and Linux.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 35,
                        "question": "What is batch processing?",
                        "options": [
                                "Real-time processing",
                                "Interactive processing",
                                "Multitasking",
                                "Processing jobs in groups"
                        ],
                        "correct": 3,
                        "explanation": "Batch processing executes jobs in batches without user interaction. It improves efficiency for repetitive tasks.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 36,
                        "question": "What is real-time OS?",
                        "options": [
                                "Single-user OS",
                                "Slow OS",
                                "OS with guaranteed response time",
                                "Batch OS"
                        ],
                        "correct": 2,
                        "explanation": "Real-time OS ensures responses within strict time limits. It is used in embedded systems and robotics.",
                        "difficulty": "Medium",
                        "topic": "Advanced OS"
                },
                {
                        "id": 37,
                        "question": "Which OS is open source?",
                        "options": [
                                "macOS",
                                "iOS",
                                "Windows",
                                "Linux"
                        ],
                        "correct": 3,
                        "explanation": "Linux is open source and freely modifiable. It is widely used in servers and embedded systems.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 38,
                        "question": "What is spooling?",
                        "options": [
                                "Memory allocation",
                                "CPU scheduling",
                                "Buffering data for devices",
                                "Disk scheduling"
                        ],
                        "correct": 2,
                        "explanation": "Spooling stores data temporarily before sending it to devices like printers. It allows asynchronous processing.",
                        "difficulty": "Medium",
                        "topic": "I/O Management"
                },
                {
                        "id": 39,
                        "question": "Which scheduling algorithm selects nearest track?",
                        "options": [
                                "FCFS",
                                "SSTF",
                                "SCAN",
                                "LOOK"
                        ],
                        "correct": 1,
                        "explanation": "SSTF selects the request closest to current head position. It reduces seek time.",
                        "difficulty": "Medium",
                        "topic": "CPU Scheduling"
                },
                {
                        "id": 40,
                        "question": "What is a pipe in OS?",
                        "options": [
                                "Memory unit",
                                "Communication channel between processes",
                                "File type",
                                "Hardware connection"
                        ],
                        "correct": 1,
                        "explanation": "Pipes allow inter-process communication. They transfer data between processes.",
                        "difficulty": "Easy",
                        "topic": "OS Concepts"
                },
                {
                        "id": 41,
                        "question": "What is a shell?",
                        "options": [
                                "Hardware device",
                                "User interface for OS",
                                "Memory manager",
                                "File system"
                        ],
                        "correct": 1,
                        "explanation": "The shell interprets user commands. It provides interaction with the OS.",
                        "difficulty": "Easy",
                        "topic": "OS Concepts"
                },
                {
                        "id": 42,
                        "question": "Which memory allocation avoids fragmentation?",
                        "options": [
                                "Contiguous allocation",
                                "Segmentation",
                                "Paging",
                                "Swapping"
                        ],
                        "correct": 2,
                        "explanation": "Paging uses fixed-size blocks. This eliminates external fragmentation.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 43,
                        "question": "What is segmentation?",
                        "options": [
                                "Disk scheduling",
                                "File allocation",
                                "Fixed memory blocks",
                                "Variable memory blocks based on logical divisions"
                        ],
                        "correct": 3,
                        "explanation": "Segmentation divides memory into logical segments like code and data. It supports logical organization.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 44,
                        "question": "What is a race condition?",
                        "options": [
                                "CPU failure",
                                "Disk error",
                                "Memory leak",
                                "Multiple processes accessing shared data simultaneously"
                        ],
                        "correct": 3,
                        "explanation": "Race conditions occur when process timing affects results. Synchronization prevents inconsistencies.",
                        "difficulty": "Medium",
                        "topic": "Concurrency"
                },
                {
                        "id": 45,
                        "question": "Which OS handles hardware interrupts?",
                        "options": [
                                "Compiler",
                                "File system",
                                "Kernel",
                                "Application"
                        ],
                        "correct": 2,
                        "explanation": "The kernel handles interrupts and coordinates hardware responses. It ensures proper execution flow.",
                        "difficulty": "Medium",
                        "topic": "I/O Management"
                },
                {
                        "id": 46,
                        "question": "What is a daemon?",
                        "options": [
                                "Background process",
                                "Memory unit",
                                "Hardware device",
                                "Scheduling algorithm"
                        ],
                        "correct": 0,
                        "explanation": "Daemons run in the background performing system tasks. Examples include print and network services.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 47,
                        "question": "Which scheduling algorithm is preemptive?",
                        "options": [
                                "SJF (non-preemptive)",
                                "Round Robin",
                                "FCFS",
                                "FIFO"
                        ],
                        "correct": 1,
                        "explanation": "Round Robin allows preemption after time quantum. This ensures fairness.",
                        "difficulty": "Medium",
                        "topic": "CPU Scheduling"
                },
                {
                        "id": 48,
                        "question": "What is a page fault?",
                        "options": [
                                "Memory leak",
                                "Accessing page not in memory",
                                "Disk error",
                                "CPU failure"
                        ],
                        "correct": 1,
                        "explanation": "A page fault occurs when a required page is not in RAM. The OS loads it from disk.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 49,
                        "question": "Which OS component manages files?",
                        "options": [
                                "Kernel",
                                "Scheduler",
                                "Memory manager",
                                "File system"
                        ],
                        "correct": 3,
                        "explanation": "The file system organizes and manages files on storage devices. It controls access and storage.",
                        "difficulty": "Medium",
                        "topic": "File Systems"
                },
                {
                        "id": 52,
                        "question": "Which scheduling algorithm is best for time-sharing systems?",
                        "options": [
                                "Round Robin",
                                "Priority",
                                "SJF",
                                "FCFS"
                        ],
                        "correct": 0,
                        "explanation": "Round Robin allocates time slices to each process. This provides responsiveness and fairness in time-sharing environments.",
                        "difficulty": "Medium",
                        "topic": "CPU Scheduling"
                },
                {
                        "id": 53,
                        "question": "What is aging in OS scheduling?",
                        "options": [
                                "Increasing CPU speed",
                                "Decreasing memory usage",
                                "Increasing process priority over time",
                                "Killing old processes"
                        ],
                        "correct": 2,
                        "explanation": "Aging gradually increases the priority of waiting processes. This prevents starvation in priority scheduling.",
                        "difficulty": "Medium",
                        "topic": "CPU Scheduling"
                },
                {
                        "id": 54,
                        "question": "What is the main goal of multiprogramming?",
                        "options": [
                                "Reduce memory size",
                                "Reduce CPU speed",
                                "Maximize CPU utilization",
                                "Increase disk usage"
                        ],
                        "correct": 2,
                        "explanation": "Multiprogramming keeps multiple jobs ready in memory. This ensures the CPU always has work to do.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 55,
                        "question": "Which state comes after \"Ready\" in process lifecycle?",
                        "options": [
                                "Waiting",
                                "Suspended",
                                "Running",
                                "Terminated"
                        ],
                        "correct": 2,
                        "explanation": "A ready process moves to running when scheduled. It begins execution on the CPU.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 56,
                        "question": "What is a waiting state?",
                        "options": [
                                "Process waiting for I/O or resource",
                                "Process ready for execution",
                                "Process finished",
                                "Process terminated"
                        ],
                        "correct": 0,
                        "explanation": "Processes enter waiting state when they need I/O or resources. They resume when the event completes.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 57,
                        "question": "What is a PCB (Process Control Block)?",
                        "options": [
                                "Scheduling algorithm",
                                "File descriptor",
                                "Memory block",
                                "Data structure storing process information"
                        ],
                        "correct": 3,
                        "explanation": "PCB contains process state, registers, and scheduling info. It allows the OS to manage processes.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 58,
                        "question": "Which OS supports multitasking?",
                        "options": [
                                "MS-DOS",
                                "Windows",
                                "Early batch systems",
                                "Single-user OS"
                        ],
                        "correct": 1,
                        "explanation": "Windows supports multiple processes simultaneously. It uses time-sharing and multitasking techniques.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 59,
                        "question": "What is a system interrupt?",
                        "options": [
                                "Memory leak",
                                "File error",
                                "Signal to CPU for attention",
                                "Disk failure"
                        ],
                        "correct": 2,
                        "explanation": "Interrupts notify the CPU about events requiring attention. They enable efficient device communication.",
                        "difficulty": "Medium",
                        "topic": "I/O Management"
                },
                {
                        "id": 60,
                        "question": "What is DMA (Direct Memory Access)?",
                        "options": [
                                "Disk formatting",
                                "Device accessing memory without CPU",
                                "CPU scheduling",
                                "Memory allocation"
                        ],
                        "correct": 1,
                        "explanation": "DMA allows devices to transfer data directly to memory. This reduces CPU overhead.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 61,
                        "question": "Which memory management technique uses logical segments?",
                        "options": [
                                "Contiguous allocation",
                                "Segmentation",
                                "Swapping",
                                "Paging"
                        ],
                        "correct": 1,
                        "explanation": "Segmentation divides memory based on logical units like code and data. It supports modular programming.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 62,
                        "question": "What is a page table?",
                        "options": [
                                "File index",
                                "Process list",
                                "Maps virtual pages to physical frames",
                                "Disk map"
                        ],
                        "correct": 2,
                        "explanation": "Page tables translate virtual addresses to physical addresses. They enable virtual memory.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 63,
                        "question": "What is TLB (Translation Lookaside Buffer)?",
                        "options": [
                                "Cache for page table entries",
                                "Disk buffer",
                                "CPU register",
                                "File system cache"
                        ],
                        "correct": 0,
                        "explanation": "TLB stores recent page table entries. It speeds up address translation.",
                        "difficulty": "Hard",
                        "topic": "Memory Management"
                },
                {
                        "id": 64,
                        "question": "What is demand paging?",
                        "options": [
                                "Loading all pages at once",
                                "Loading pages only when needed",
                                "Swapping processes",
                                "Disk scheduling"
                        ],
                        "correct": 1,
                        "explanation": "Demand paging loads pages into memory only when accessed. This saves memory and improves efficiency.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 65,
                        "question": "What is page replacement?",
                        "options": [
                                "Removing unused files",
                                "Allocating CPU time",
                                "Changing disk sectors",
                                "Replacing pages in memory when full"
                        ],
                        "correct": 3,
                        "explanation": "Page replacement selects which page to remove when memory is full. Algorithms like FIFO and LRU are used.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 66,
                        "question": "Which page replacement algorithm removes oldest page?",
                        "options": [
                                "LFU",
                                "LRU",
                                "Optimal",
                                "FIFO"
                        ],
                        "correct": 3,
                        "explanation": "FIFO replaces the page that entered memory first. It is simple but may not be efficient.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 67,
                        "question": "Which algorithm gives best page replacement theoretically?",
                        "options": [
                                "FIFO",
                                "Optimal",
                                "LRU",
                                "Random"
                        ],
                        "correct": 1,
                        "explanation": "Optimal replaces the page not used for the longest future time. It minimizes page faults but is impractical.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 68,
                        "question": "What is LRU algorithm?",
                        "options": [
                                "Removes least recently used page",
                                "Removes oldest page",
                                "Removes largest page",
                                "Removes random page"
                        ],
                        "correct": 0,
                        "explanation": "LRU replaces the page that hasn’t been used recently. It approximates optimal performance.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 69,
                        "question": "What is Belady’s anomaly?",
                        "options": [
                                "File corruption",
                                "CPU crash",
                                "More memory causing more page faults",
                                "Disk failure"
                        ],
                        "correct": 2,
                        "explanation": "In FIFO, increasing memory frames can increase page faults. This counterintuitive behavior is Belady’s anomaly.",
                        "difficulty": "Hard",
                        "topic": "Memory Management"
                },
                {
                        "id": 70,
                        "question": "Which file allocation method avoids fragmentation?",
                        "options": [
                                "Linked",
                                "Sequential",
                                "Indexed",
                                "Contiguous"
                        ],
                        "correct": 2,
                        "explanation": "Indexed allocation uses an index block for pointers. It avoids external fragmentation.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 71,
                        "question": "What is disk seek time?",
                        "options": [
                                "Time to read data",
                                "Time to transfer data",
                                "Time to rotate disk",
                                "Time to move head to track"
                        ],
                        "correct": 3,
                        "explanation": "Seek time is the time required to position the disk head. It affects disk performance.",
                        "difficulty": "Medium",
                        "topic": "File Systems"
                },
                {
                        "id": 72,
                        "question": "What is rotational latency?",
                        "options": [
                                "File transfer time",
                                "Disk speed",
                                "Memory delay",
                                "Time waiting for sector to rotate under head"
                        ],
                        "correct": 3,
                        "explanation": "Rotational latency is the delay waiting for the desired sector. It depends on disk rotation speed.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 73,
                        "question": "Which disk scheduling minimizes head movement?",
                        "options": [
                                "C-SCAN",
                                "SSTF",
                                "SCAN",
                                "FCFS"
                        ],
                        "correct": 1,
                        "explanation": "SSTF selects the closest request. This reduces total head movement.",
                        "difficulty": "Medium",
                        "topic": "CPU Scheduling"
                },
                {
                        "id": 74,
                        "question": "What is C-SCAN algorithm?",
                        "options": [
                                "Priority scheduling",
                                "Moves in one direction only",
                                "Random scheduling",
                                "Circular SCAN disk scheduling"
                        ],
                        "correct": 3,
                        "explanation": "C-SCAN services requests in one direction and jumps back. It provides uniform wait time.",
                        "difficulty": "Hard",
                        "topic": "OS Concepts"
                },
                {
                        "id": 75,
                        "question": "What is a mount point?",
                        "options": [
                                "Disk partition",
                                "Memory block",
                                "Directory where file system is attached",
                                "CPU register"
                        ],
                        "correct": 2,
                        "explanation": "Mount points connect storage devices to directory structure. They allow access to files.",
                        "difficulty": "Medium",
                        "topic": "File Systems"
                },
                {
                        "id": 76,
                        "question": "What is inode in UNIX?",
                        "options": [
                                "Process ID",
                                "Disk block",
                                "File name",
                                "Data structure storing file metadata"
                        ],
                        "correct": 3,
                        "explanation": "Inodes store file permissions, size, and pointers. They do not store file names.",
                        "difficulty": "Medium",
                        "topic": "File Systems"
                },
                {
                        "id": 77,
                        "question": "What is a hard link?",
                        "options": [
                                "Symbolic reference",
                                "Multiple names for same file",
                                "Shortcut file",
                                "Backup copy"
                        ],
                        "correct": 1,
                        "explanation": "Hard links point to the same inode. Deleting one link does not remove the file.",
                        "difficulty": "Easy",
                        "topic": "File Systems"
                },
                {
                        "id": 78,
                        "question": "What is a soft link?",
                        "options": [
                                "Hard disk",
                                "Duplicate file",
                                "Symbolic link to another file",
                                "Backup link"
                        ],
                        "correct": 2,
                        "explanation": "Soft links store path references. They break if the original file is deleted.",
                        "difficulty": "Easy",
                        "topic": "File Systems"
                },
                {
                        "id": 79,
                        "question": "What is user mode?",
                        "options": [
                                "Kernel execution",
                                "Memory mode",
                                "Restricted execution mode",
                                "Full hardware access"
                        ],
                        "correct": 2,
                        "explanation": "User mode limits access to hardware. It protects system integrity.",
                        "difficulty": "Easy",
                        "topic": "Security"
                },
                {
                        "id": 80,
                        "question": "What is kernel mode?",
                        "options": [
                                "Full access to hardware",
                                "Restricted mode",
                                "User interface mode",
                                "File mode"
                        ],
                        "correct": 0,
                        "explanation": "Kernel mode allows direct hardware access. It executes critical OS operations.",
                        "difficulty": "Easy",
                        "topic": "Security"
                },
                {
                        "id": 81,
                        "question": "What is a system boot?",
                        "options": [
                                "Installing software",
                                "Formatting disk",
                                "Shutting down",
                                "Starting computer and loading OS"
                        ],
                        "correct": 3,
                        "explanation": "Booting loads the OS into memory. It prepares the system for use.",
                        "difficulty": "Easy",
                        "topic": "I/O Management"
                },
                {
                        "id": 82,
                        "question": "What is BIOS?",
                        "options": [
                                "File system",
                                "Operating system",
                                "Firmware initializing hardware",
                                "Memory manager"
                        ],
                        "correct": 2,
                        "explanation": "BIOS initializes hardware during startup. It loads the bootloader.",
                        "difficulty": "Easy",
                        "topic": "I/O Management"
                },
                {
                        "id": 83,
                        "question": "What is a bootloader?",
                        "options": [
                                "OS kernel",
                                "Device driver",
                                "Program loading OS into memory",
                                "File system"
                        ],
                        "correct": 2,
                        "explanation": "Bootloader loads the OS kernel. It starts system initialization.",
                        "difficulty": "Easy",
                        "topic": "I/O Management"
                },
                {
                        "id": 84,
                        "question": "What is process synchronization?",
                        "options": [
                                "File management",
                                "Running processes simultaneously",
                                "CPU scheduling",
                                "Coordinating processes accessing shared data"
                        ],
                        "correct": 3,
                        "explanation": "Synchronization ensures safe access to shared resources. It prevents race conditions.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 85,
                        "question": "What is mutual exclusion?",
                        "options": [
                                "Memory allocation",
                                "Deadlock prevention",
                                "Only one process accessing resource at a time",
                                "Multiple processes accessing resource simultaneously"
                        ],
                        "correct": 2,
                        "explanation": "Mutual exclusion ensures exclusive access. It prevents data inconsistency.",
                        "difficulty": "Easy",
                        "topic": "OS Concepts"
                },
                {
                        "id": 86,
                        "question": "What is a monitor in OS?",
                        "options": [
                                "Display device",
                                "File system",
                                "Memory manager",
                                "Synchronization construct"
                        ],
                        "correct": 3,
                        "explanation": "Monitors provide high-level synchronization. They manage shared resources safely.",
                        "difficulty": "Medium",
                        "topic": "Concurrency"
                },
                {
                        "id": 87,
                        "question": "What is inter-process communication (IPC)?",
                        "options": [
                                "Disk scheduling",
                                "Data exchange between processes",
                                "Memory allocation",
                                "CPU scheduling"
                        ],
                        "correct": 1,
                        "explanation": "IPC allows processes to share data. Methods include pipes, message queues, and shared memory.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 88,
                        "question": "What is shared memory?",
                        "options": [
                                "Private memory",
                                "Cache memory",
                                "Memory accessible by multiple processes",
                                "Disk memory"
                        ],
                        "correct": 2,
                        "explanation": "Shared memory allows processes to communicate efficiently. It reduces overhead compared to message passing.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 89,
                        "question": "What is message passing?",
                        "options": [
                                "Disk scheduling",
                                "Memory allocation",
                                "IPC method sending messages between processes",
                                "File transfer"
                        ],
                        "correct": 2,
                        "explanation": "Message passing allows processes to exchange data without shared memory. It ensures isolation.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 90,
                        "question": "What is starvation?",
                        "options": [
                                "CPU crash",
                                "Memory overflow",
                                "Process waiting indefinitely",
                                "Process termination"
                        ],
                        "correct": 2,
                        "explanation": "Starvation occurs when a process never gets CPU time. Aging can prevent this.",
                        "difficulty": "Easy",
                        "topic": "OS Concepts"
                },
                {
                        "id": 91,
                        "question": "What is throughput in scheduling?",
                        "options": [
                                "Number of completed processes per time",
                                "Memory size",
                                "Disk space",
                                "CPU speed"
                        ],
                        "correct": 0,
                        "explanation": "Throughput measures system productivity. Higher throughput indicates better performance.",
                        "difficulty": "Medium",
                        "topic": "CPU Scheduling"
                },
                {
                        "id": 92,
                        "question": "What is turnaround time?",
                        "options": [
                                "Time from submission to completion",
                                "Execution time only",
                                "Waiting time only",
                                "CPU idle time"
                        ],
                        "correct": 0,
                        "explanation": "Turnaround time includes waiting and execution. It measures overall job completion time.",
                        "difficulty": "Medium",
                        "topic": "CPU Scheduling"
                },
                {
                        "id": 93,
                        "question": "What is waiting time?",
                        "options": [
                                "Disk access time",
                                "CPU execution time",
                                "I/O time",
                                "Time spent in ready queue"
                        ],
                        "correct": 3,
                        "explanation": "Waiting time measures time in the ready queue. It affects responsiveness.",
                        "difficulty": "Easy",
                        "topic": "CPU Scheduling"
                },
                {
                        "id": 94,
                        "question": "What is response time?",
                        "options": [
                                "Time to first response",
                                "Waiting time",
                                "CPU time",
                                "Time to finish execution"
                        ],
                        "correct": 0,
                        "explanation": "Response time measures how quickly the system reacts. It is critical in interactive systems.",
                        "difficulty": "Medium",
                        "topic": "CPU Scheduling"
                },
                {
                        "id": 95,
                        "question": "What is load balancing?",
                        "options": [
                                "Disk scheduling",
                                "CPU overheating",
                                "Distributing workload evenly",
                                "Memory allocation"
                        ],
                        "correct": 2,
                        "explanation": "Load balancing spreads tasks across resources. It improves performance and reliability.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 96,
                        "question": "What is a distributed OS?",
                        "options": [
                                "Real-time OS",
                                "Embedded OS",
                                "OS managing multiple computers as one system",
                                "Single computer OS"
                        ],
                        "correct": 2,
                        "explanation": "Distributed OS coordinates multiple systems. It provides transparency and resource sharing.",
                        "difficulty": "Medium",
                        "topic": "Advanced OS"
                },
                {
                        "id": 97,
                        "question": "What is an embedded OS?",
                        "options": [
                                "Distributed OS",
                                "Server OS",
                                "Desktop OS",
                                "OS for dedicated devices"
                        ],
                        "correct": 3,
                        "explanation": "Embedded OS runs on devices like routers and appliances. It is optimized for specific tasks.",
                        "difficulty": "Medium",
                        "topic": "Advanced OS"
                },
                {
                        "id": 98,
                        "question": "What is virtualization?",
                        "options": [
                                "Hardware failure",
                                "Creating virtual machines",
                                "Memory leak",
                                "Disk formatting"
                        ],
                        "correct": 1,
                        "explanation": "Virtualization allows multiple OS instances on one machine. It improves resource utilization.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 99,
                        "question": "What is a hypervisor?",
                        "options": [
                                "Operating system",
                                "File system",
                                "Device driver",
                                "Software managing virtual machines"
                        ],
                        "correct": 3,
                        "explanation": "Hypervisors create and manage virtual machines. Examples include VMware and Hyper-V.",
                        "difficulty": "Medium",
                        "topic": "Advanced OS"
                },
                {
                        "id": 102,
                        "question": "What is priority inversion?",
                        "options": [
                                "Deadlock condition",
                                "Low-priority process waiting for high-priority process",
                                "CPU switching priorities",
                                "High-priority process waiting for low-priority process"
                        ],
                        "correct": 3,
                        "explanation": "Priority inversion occurs when a high-priority process is blocked by a lower-priority one holding a resource. Priority inheritance helps mitigate this issue.",
                        "difficulty": "Medium",
                        "topic": "CPU Scheduling"
                },
                {
                        "id": 103,
                        "question": "Which scheduling algorithm uses multiple queues?",
                        "options": [
                                "SJF",
                                "Multilevel Queue Scheduling",
                                "FCFS",
                                "Round Robin"
                        ],
                        "correct": 1,
                        "explanation": "Multilevel queue scheduling separates processes into categories with different priorities. Each queue can have its own scheduling policy.",
                        "difficulty": "Medium",
                        "topic": "CPU Scheduling"
                },
                {
                        "id": 104,
                        "question": "What is multilevel feedback queue scheduling?",
                        "options": [
                                "Fixed queue scheduling",
                                "Disk scheduling",
                                "Dynamic queue with process movement",
                                "Single queue scheduling"
                        ],
                        "correct": 2,
                        "explanation": "Multilevel feedback queues allow processes to move between queues based on behavior. This balances responsiveness and fairness.",
                        "difficulty": "Medium",
                        "topic": "CPU Scheduling"
                },
                {
                        "id": 105,
                        "question": "What is CPU affinity?",
                        "options": [
                                "Memory allocation",
                                "Binding process to specific CPU core",
                                "CPU scheduling algorithm",
                                "CPU overheating"
                        ],
                        "correct": 1,
                        "explanation": "CPU affinity keeps a process on a specific core. This improves cache performance and reduces context switching.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 106,
                        "question": "What is symmetric multiprocessing (SMP)?",
                        "options": [
                                "Multiple OS instances",
                                "Single CPU system",
                                "Multiple CPUs sharing memory and OS",
                                "Distributed system"
                        ],
                        "correct": 2,
                        "explanation": "SMP systems use multiple processors that share memory. The OS treats them equally for scheduling tasks.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 107,
                        "question": "What is asymmetric multiprocessing?",
                        "options": [
                                "Single-core processing",
                                "One master CPU controls others",
                                "All CPUs equal",
                                "No CPU control"
                        ],
                        "correct": 1,
                        "explanation": "In asymmetric multiprocessing, one processor manages tasks. Other processors execute assigned work.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 108,
                        "question": "What is a spinlock?",
                        "options": [
                                "Lock that puts thread to sleep",
                                "Disk lock",
                                "Lock where thread repeatedly checks until free",
                                "File lock"
                        ],
                        "correct": 2,
                        "explanation": "Spinlocks cause threads to loop while waiting for a lock. They are efficient for short wait times.",
                        "difficulty": "Medium",
                        "topic": "Concurrency"
                },
                {
                        "id": 109,
                        "question": "What is busy waiting?",
                        "options": [
                                "Disk waiting",
                                "Process termination",
                                "CPU idle state",
                                "Loop checking condition repeatedly"
                        ],
                        "correct": 3,
                        "explanation": "Busy waiting wastes CPU cycles by repeatedly checking a condition. It is inefficient for long waits.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 110,
                        "question": "What is a race condition solution?",
                        "options": [
                                "Disable interrupts",
                                "Remove processes",
                                "Increase CPU speed",
                                "Use synchronization mechanisms"
                        ],
                        "correct": 3,
                        "explanation": "Synchronization tools like mutexes and semaphores prevent race conditions. They ensure orderly access to shared resources.",
                        "difficulty": "Medium",
                        "topic": "Concurrency"
                },
                {
                        "id": 111,
                        "question": "What is a mutex?",
                        "options": [
                                "Memory unit",
                                "File system",
                                "Mutual exclusion lock",
                                "Scheduling algorithm"
                        ],
                        "correct": 2,
                        "explanation": "Mutex ensures only one thread accesses a resource at a time. It prevents concurrent conflicts.",
                        "difficulty": "Medium",
                        "topic": "Concurrency"
                },
                {
                        "id": 112,
                        "question": "What is a condition variable?",
                        "options": [
                                "CPU register",
                                "Memory variable",
                                "Disk variable",
                                "Synchronization primitive for waiting threads"
                        ],
                        "correct": 3,
                        "explanation": "Condition variables allow threads to wait until a condition is true. They work with mutexes for synchronization.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 113,
                        "question": "What is a kernel thread?",
                        "options": [
                                "Background process",
                                "Thread managed by OS kernel",
                                "File system thread",
                                "User-level thread"
                        ],
                        "correct": 1,
                        "explanation": "Kernel threads are managed directly by the OS. They allow true parallel execution on multi-core systems.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 114,
                        "question": "What is a user-level thread?",
                        "options": [
                                "Hardware thread",
                                "Device thread",
                                "Managed by user library",
                                "Managed by OS kernel"
                        ],
                        "correct": 2,
                        "explanation": "User-level threads are managed in user space. They are faster but lack true parallelism without kernel support.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 115,
                        "question": "What is thread starvation?",
                        "options": [
                                "Disk failure",
                                "Thread termination",
                                "Thread waiting indefinitely for CPU",
                                "Memory leak"
                        ],
                        "correct": 2,
                        "explanation": "Starvation occurs when threads never receive CPU time. Priority adjustments can prevent this.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 116,
                        "question": "What is copy-on-write?",
                        "options": [
                                "Disk copying",
                                "Copy memory only when modified",
                                "Process duplication",
                                "Copying files"
                        ],
                        "correct": 1,
                        "explanation": "Copy-on-write delays copying memory until changes occur. It saves memory during process creation.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 117,
                        "question": "What is fork() in UNIX?",
                        "options": [
                                "Schedule process",
                                "Delete process",
                                "Kill process",
                                "Create child process"
                        ],
                        "correct": 3,
                        "explanation": "fork() creates a new child process. The child is a duplicate of the parent.",
                        "difficulty": "Easy",
                        "topic": "Process Management"
                },
                {
                        "id": 118,
                        "question": "What is exec() in UNIX?",
                        "options": [
                                "Replace process memory with new program",
                                "Delete process",
                                "Create process",
                                "Pause process"
                        ],
                        "correct": 0,
                        "explanation": "exec() loads a new program into the current process. It replaces the existing code.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 119,
                        "question": "What is a zombie process caused by?",
                        "options": [
                                "OS crash",
                                "Memory leak",
                                "Deadlock",
                                "Parent not reading child exit status"
                        ],
                        "correct": 3,
                        "explanation": "Zombies occur when a child terminates but the parent hasn’t acknowledged it. The process remains in the table.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 120,
                        "question": "What is an orphan process?",
                        "options": [
                                "Zombie process",
                                "Process without child",
                                "Suspended process",
                                "Process without parent"
                        ],
                        "correct": 3,
                        "explanation": "Orphan processes occur when the parent terminates. They are adopted by the init process.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 121,
                        "question": "What is loadable kernel module?",
                        "options": [
                                "Dynamically loaded kernel code",
                                "User application",
                                "Hardware driver",
                                "File system"
                        ],
                        "correct": 0,
                        "explanation": "Kernel modules allow adding functionality without rebooting. Examples include device drivers.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 122,
                        "question": "What is a device queue?",
                        "options": [
                                "CPU queue",
                                "Queue of processes waiting for device",
                                "Memory block",
                                "Disk partition"
                        ],
                        "correct": 1,
                        "explanation": "Device queues hold processes waiting for I/O. They help manage device access.",
                        "difficulty": "Medium",
                        "topic": "I/O Management"
                },
                {
                        "id": 123,
                        "question": "What is interrupt latency?",
                        "options": [
                                "CPU speed",
                                "Memory delay",
                                "Disk delay",
                                "Time to respond to interrupt"
                        ],
                        "correct": 3,
                        "explanation": "Interrupt latency measures time between interrupt and response. Low latency is critical for real-time systems.",
                        "difficulty": "Medium",
                        "topic": "I/O Management"
                },
                {
                        "id": 124,
                        "question": "What is journaling in file systems?",
                        "options": [
                                "File compression",
                                "Logging changes for recovery",
                                "File indexing",
                                "Disk defragmentation"
                        ],
                        "correct": 1,
                        "explanation": "Journaling records changes before applying them. It ensures recovery after crashes.",
                        "difficulty": "Medium",
                        "topic": "File Systems"
                },
                {
                        "id": 125,
                        "question": "What is RAID used for?",
                        "options": [
                                "Process management",
                                "CPU scheduling",
                                "Disk redundancy and performance",
                                "Memory management"
                        ],
                        "correct": 2,
                        "explanation": "RAID combines multiple disks for reliability and speed. It prevents data loss.",
                        "difficulty": "Medium",
                        "topic": "File Systems"
                },
                {
                        "id": 126,
                        "question": "Which RAID level provides mirroring?",
                        "options": [
                                "RAID 5",
                                "RAID 6",
                                "RAID 1",
                                "RAID 0"
                        ],
                        "correct": 2,
                        "explanation": "RAID 1 duplicates data across disks. It provides fault tolerance.",
                        "difficulty": "Medium",
                        "topic": "File Systems"
                },
                {
                        "id": 127,
                        "question": "What is RAID 0?",
                        "options": [
                                "Striping without redundancy",
                                "Parity-based storage",
                                "Mirroring",
                                "Backup storage"
                        ],
                        "correct": 0,
                        "explanation": "RAID 0 improves performance by striping data. It provides no fault tolerance.",
                        "difficulty": "Easy",
                        "topic": "File Systems"
                },
                {
                        "id": 128,
                        "question": "What is swap space?",
                        "options": [
                                "Cache memory",
                                "File storage",
                                "CPU memory",
                                "Disk space used as virtual memory"
                        ],
                        "correct": 3,
                        "explanation": "Swap space extends RAM using disk. It allows more processes to run.",
                        "difficulty": "Easy",
                        "topic": "OS Concepts"
                },
                {
                        "id": 129,
                        "question": "What is memory leak?",
                        "options": [
                                "Disk failure",
                                "Extra memory usage not released",
                                "File corruption",
                                "CPU crash"
                        ],
                        "correct": 1,
                        "explanation": "Memory leaks occur when programs fail to free memory. This reduces available RAM.",
                        "difficulty": "Medium",
                        "topic": "Memory Management"
                },
                {
                        "id": 130,
                        "question": "What is kernel panic?",
                        "options": [
                                "User error",
                                "Critical OS error causing system halt",
                                "OS shutdown command",
                                "File system error"
                        ],
                        "correct": 1,
                        "explanation": "Kernel panic occurs when the OS encounters a fatal error. The system stops to prevent damage.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 131,
                        "question": "What is sandboxing?",
                        "options": [
                                "Running programs in isolated environment",
                                "Memory allocation",
                                "CPU scheduling",
                                "Disk partitioning"
                        ],
                        "correct": 0,
                        "explanation": "Sandboxing restricts program access to system resources. It improves security.",
                        "difficulty": "Easy",
                        "topic": "Security"
                },
                {
                        "id": 132,
                        "question": "What is process migration?",
                        "options": [
                                "Deleting process",
                                "Moving process to another CPU or machine",
                                "Copying process",
                                "Suspending process"
                        ],
                        "correct": 1,
                        "explanation": "Process migration balances load across systems. It improves performance in distributed systems.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 133,
                        "question": "What is time-sharing?",
                        "options": [
                                "Disk sharing",
                                "Multiple users sharing CPU time",
                                "Memory sharing",
                                "One user at a time"
                        ],
                        "correct": 1,
                        "explanation": "Time-sharing allows multiple users to interact with the system. CPU time is divided into small slices.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 134,
                        "question": "What is a tick in OS?",
                        "options": [
                                "Memory block",
                                "Timer interrupt interval",
                                "Disk operation",
                                "CPU instruction"
                        ],
                        "correct": 1,
                        "explanation": "A tick is a periodic timer interrupt. It helps in scheduling and timekeeping.",
                        "difficulty": "Easy",
                        "topic": "OS Concepts"
                },
                {
                        "id": 135,
                        "question": "What is a soft interrupt?",
                        "options": [
                                "Disk interrupt",
                                "Hardware interrupt",
                                "Memory interrupt",
                                "Software-triggered interrupt"
                        ],
                        "correct": 3,
                        "explanation": "Soft interrupts are generated by software. They handle deferred tasks.",
                        "difficulty": "Easy",
                        "topic": "I/O Management"
                },
                {
                        "id": 136,
                        "question": "What is a hard interrupt?",
                        "options": [
                                "Memory error",
                                "Software signal",
                                "Disk scheduling",
                                "Hardware-generated interrupt"
                        ],
                        "correct": 3,
                        "explanation": "Hard interrupts come from hardware devices. They notify the CPU of events.",
                        "difficulty": "Easy",
                        "topic": "I/O Management"
                },
                {
                        "id": 137,
                        "question": "What is NUMA architecture?",
                        "options": [
                                "Uniform memory access",
                                "Non-uniform memory access",
                                "Virtual memory access",
                                "Single memory access"
                        ],
                        "correct": 1,
                        "explanation": "NUMA systems have different memory access times. CPUs access local memory faster.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 138,
                        "question": "What is a system daemon example?",
                        "options": [
                                "Web browser",
                                "Text editor",
                                "Print spooler",
                                "Calculator"
                        ],
                        "correct": 2,
                        "explanation": "Print spooler runs in the background managing print jobs. It is a daemon service.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 139,
                        "question": "What is OS portability?",
                        "options": [
                                "Running OS on multiple hardware platforms",
                                "Disk compatibility",
                                "Memory sharing",
                                "File transfer"
                        ],
                        "correct": 0,
                        "explanation": "Portability allows OS to run on different hardware. It increases flexibility.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 140,
                        "question": "What is POSIX?",
                        "options": [
                                "Programming language",
                                "OS standard interface",
                                "File system",
                                "CPU architecture"
                        ],
                        "correct": 1,
                        "explanation": "POSIX defines standards for OS compatibility. It ensures software portability.",
                        "difficulty": "Easy",
                        "topic": "OS Concepts"
                },
                {
                        "id": 141,
                        "question": "What is system throughput affected by?",
                        "options": [
                                "Scheduling and resource management",
                                "CPU speed only",
                                "File names",
                                "Disk color"
                        ],
                        "correct": 0,
                        "explanation": "Throughput depends on scheduling efficiency and resource allocation. Good management improves performance.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 142,
                        "question": "What is a process group?",
                        "options": [
                                "Collection of CPUs",
                                "Collection of related processes",
                                "Memory segments",
                                "Disk partitions"
                        ],
                        "correct": 1,
                        "explanation": "Process groups manage related processes together. They simplify signal handling.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 143,
                        "question": "What is a signal in OS?",
                        "options": [
                                "Notification to process",
                                "Disk request",
                                "Hardware device",
                                "Memory block"
                        ],
                        "correct": 0,
                        "explanation": "Signals notify processes about events. Examples include termination or interrupts.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 144,
                        "question": "What is a foreground process?",
                        "options": [
                                "Process interacting with user",
                                "Suspended process",
                                "Background task",
                                "Kernel thread"
                        ],
                        "correct": 0,
                        "explanation": "Foreground processes interact directly with users. They receive input and display output.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 145,
                        "question": "What is a background process?",
                        "options": [
                                "Process running without user interaction",
                                "Kernel thread",
                                "User-interactive process",
                                "Suspended process"
                        ],
                        "correct": 0,
                        "explanation": "Background processes run without direct user input. They handle system tasks.",
                        "difficulty": "Medium",
                        "topic": "Process Management"
                },
                {
                        "id": 146,
                        "question": "What is a run queue?",
                        "options": [
                                "File list",
                                "Memory block",
                                "List of ready processes",
                                "Disk queue"
                        ],
                        "correct": 2,
                        "explanation": "Run queue stores processes ready to execute. The scheduler selects from this queue.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 147,
                        "question": "What is kernel preemption?",
                        "options": [
                                "Kernel cannot be interrupted",
                                "Memory allocation",
                                "Kernel tasks can be interrupted",
                                "CPU shutdown"
                        ],
                        "correct": 2,
                        "explanation": "Kernel preemption allows higher-priority tasks to interrupt kernel tasks. It improves responsiveness.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 148,
                        "question": "What is a microkernel?",
                        "options": [
                                "Hardware kernel",
                                "Large kernel",
                                "File system kernel",
                                "Minimal kernel with core functions"
                        ],
                        "correct": 3,
                        "explanation": "Microkernels include only essential services. Other services run in user space.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 149,
                        "question": "What is a monolithic kernel?",
                        "options": [
                                "Minimal kernel",
                                "Distributed kernel",
                                "Kernel with all services included",
                                "Virtual kernel"
                        ],
                        "correct": 2,
                        "explanation": "Monolithic kernels include many services in kernel space. This improves performance but reduces modularity.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                },
                {
                        "id": 150,
                        "question": "What is system reliability?",
                        "options": [
                                "Disk capacity",
                                "CPU speed",
                                "Ability to operate without failure",
                                "Memory size"
                        ],
                        "correct": 2,
                        "explanation": "Reliability ensures consistent system operation. Fault tolerance and recovery mechanisms improve it.",
                        "difficulty": "Medium",
                        "topic": "OS Concepts"
                }
        ],
        "cn": [
                {
                        "id": 1,
                        "question": "What is a computer network?",
                        "options": [
                                "Interconnected devices sharing resources",
                                "Single computer system",
                                "Collection of hardware devices only",
                                "Database system"
                        ],
                        "correct": 0,
                        "explanation": "A computer network connects multiple devices to share data and resources. It enables communication using protocols.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 2,
                        "question": "Which device connects different networks?",
                        "options": [
                                "Router",
                                "Repeater",
                                "Switch",
                                "Hub"
                        ],
                        "correct": 0,
                        "explanation": "Routers forward packets between networks using IP addresses. They determine optimal paths.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 3,
                        "question": "What does LAN stand for?",
                        "options": [
                                "Local Area Network",
                                "Large Area Network",
                                "Logical Area Network",
                                "Linked Area Network"
                        ],
                        "correct": 0,
                        "explanation": "LAN connects devices within a small geographic area like a building. It provides high-speed connectivity.",
                        "difficulty": "Medium",
                        "topic": "Network Concepts"
                },
                {
                        "id": 4,
                        "question": "Which topology uses a central hub?",
                        "options": [
                                "Mesh",
                                "Bus",
                                "Star",
                                "Ring"
                        ],
                        "correct": 2,
                        "explanation": "In star topology, all nodes connect to a central hub or switch. Failure of the hub affects the entire network.",
                        "difficulty": "Medium",
                        "topic": "Network Hardware"
                },
                {
                        "id": 5,
                        "question": "What is the primary function of a switch?",
                        "options": [
                                "Convert analog to digital",
                                "Amplify signals",
                                "Assign IP addresses",
                                "Forward data using MAC addresses"
                        ],
                        "correct": 3,
                        "explanation": "Switches operate at the data link layer. They forward frames based on MAC addresses.",
                        "difficulty": "Medium",
                        "topic": "Network Hardware"
                },
                {
                        "id": 6,
                        "question": "Which protocol is used to assign IP addresses automatically?",
                        "options": [
                                "DHCP",
                                "HTTP",
                                "DNS",
                                "FTP"
                        ],
                        "correct": 0,
                        "explanation": "DHCP dynamically assigns IP addresses to devices. It simplifies network configuration.",
                        "difficulty": "Medium",
                        "topic": "Protocols"
                },
                {
                        "id": 7,
                        "question": "What is an IP address?",
                        "options": [
                                "Hardware identifier",
                                "Network cable type",
                                "Logical address for device identification",
                                "File location"
                        ],
                        "correct": 2,
                        "explanation": "IP addresses uniquely identify devices on a network. They enable routing and communication.",
                        "difficulty": "Medium",
                        "topic": "Addressing & Routing"
                },
                {
                        "id": 8,
                        "question": "Which layer of OSI model handles routing?",
                        "options": [
                                "Data Link",
                                "Session",
                                "Transport",
                                "Network"
                        ],
                        "correct": 3,
                        "explanation": "The network layer determines packet paths. It uses logical addressing like IP.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 9,
                        "question": "What is the OSI model?",
                        "options": [
                                "File system",
                                "Database protocol",
                                "Seven-layer networking framework",
                                "Hardware model"
                        ],
                        "correct": 2,
                        "explanation": "OSI model standardizes network communication. It divides functions into seven layers.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 10,
                        "question": "Which protocol is used for web browsing?",
                        "options": [
                                "SNMP",
                                "FTP",
                                "SMTP",
                                "HTTP"
                        ],
                        "correct": 3,
                        "explanation": "HTTP transfers web pages between client and server. HTTPS adds encryption for security.",
                        "difficulty": "Medium",
                        "topic": "Protocols"
                },
                {
                        "id": 11,
                        "question": "Which layer ensures reliable data transfer?",
                        "options": [
                                "Physical",
                                "Network",
                                "Data Link",
                                "Transport"
                        ],
                        "correct": 3,
                        "explanation": "The transport layer provides reliability using protocols like TCP. It ensures error-free delivery.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 12,
                        "question": "What is TCP?",
                        "options": [
                                "Routing protocol",
                                "Reliable connection-oriented protocol",
                                "Connectionless protocol",
                                "Encryption protocol"
                        ],
                        "correct": 1,
                        "explanation": "TCP establishes connections and ensures reliable delivery. It uses acknowledgments and retransmissions.",
                        "difficulty": "Medium",
                        "topic": "Protocols"
                },
                {
                        "id": 13,
                        "question": "What is UDP?",
                        "options": [
                                "Reliable protocol",
                                "Encryption protocol",
                                "Routing protocol",
                                "Connectionless protocol"
                        ],
                        "correct": 3,
                        "explanation": "UDP sends data without establishing a connection. It is faster but does not guarantee delivery.",
                        "difficulty": "Medium",
                        "topic": "Protocols"
                },
                {
                        "id": 14,
                        "question": "Which protocol resolves domain names to IP addresses?",
                        "options": [
                                "DHCP",
                                "ARP",
                                "DNS",
                                "FTP"
                        ],
                        "correct": 2,
                        "explanation": "DNS translates human-readable domain names into IP addresses. This enables easier web navigation.",
                        "difficulty": "Medium",
                        "topic": "Protocols"
                },
                {
                        "id": 15,
                        "question": "What is ARP used for?",
                        "options": [
                                "Assigning IP",
                                "Finding MAC address from IP",
                                "Encrypting data",
                                "Finding IP from MAC"
                        ],
                        "correct": 1,
                        "explanation": "ARP maps IP addresses to MAC addresses. It helps deliver data within a local network.",
                        "difficulty": "Medium",
                        "topic": "Protocols"
                },
                {
                        "id": 16,
                        "question": "Which device operates at the physical layer?",
                        "options": [
                                "Firewall",
                                "Hub",
                                "Router",
                                "Switch"
                        ],
                        "correct": 1,
                        "explanation": "Hubs transmit data to all connected devices. They operate at the physical layer without filtering.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 17,
                        "question": "What is bandwidth?",
                        "options": [
                                "Maximum data transfer rate",
                                "Data storage",
                                "IP range",
                                "Network cable length"
                        ],
                        "correct": 0,
                        "explanation": "Bandwidth measures the capacity of a network. Higher bandwidth allows more data per second.",
                        "difficulty": "Medium",
                        "topic": "Network Concepts"
                },
                {
                        "id": 18,
                        "question": "What is latency?",
                        "options": [
                                "Data speed",
                                "Delay in data transmission",
                                "Packet size",
                                "Signal strength"
                        ],
                        "correct": 1,
                        "explanation": "Latency is the time taken for data to travel from source to destination. Lower latency improves performance.",
                        "difficulty": "Medium",
                        "topic": "Network Concepts"
                },
                {
                        "id": 19,
                        "question": "Which topology provides redundancy?",
                        "options": [
                                "Ring",
                                "Mesh",
                                "Star",
                                "Bus"
                        ],
                        "correct": 1,
                        "explanation": "Mesh topology connects nodes with multiple paths. This ensures reliability and fault tolerance.",
                        "difficulty": "Medium",
                        "topic": "Network Concepts"
                },
                {
                        "id": 20,
                        "question": "What is a MAC address?",
                        "options": [
                                "Logical address",
                                "IP address",
                                "Physical hardware address",
                                "Port number"
                        ],
                        "correct": 2,
                        "explanation": "MAC addresses uniquely identify network interfaces. They are assigned by manufacturers.",
                        "difficulty": "Medium",
                        "topic": "Addressing & Routing"
                },
                {
                        "id": 21,
                        "question": "Which protocol is used for email sending?",
                        "options": [
                                "POP3",
                                "FTP",
                                "IMAP",
                                "SMTP"
                        ],
                        "correct": 3,
                        "explanation": "SMTP transfers outgoing email from clients to servers. POP3 and IMAP retrieve emails.",
                        "difficulty": "Medium",
                        "topic": "Protocols"
                },
                {
                        "id": 22,
                        "question": "What is FTP used for?",
                        "options": [
                                "File transfer",
                                "DNS resolution",
                                "Web browsing",
                                "Email sending"
                        ],
                        "correct": 0,
                        "explanation": "FTP transfers files between client and server. It supports upload and download operations.",
                        "difficulty": "Medium",
                        "topic": "Protocols"
                },
                {
                        "id": 23,
                        "question": "Which layer handles encryption?",
                        "options": [
                                "Physical",
                                "Presentation",
                                "Network",
                                "Application"
                        ],
                        "correct": 1,
                        "explanation": "The presentation layer handles encryption and data formatting. It ensures secure and compatible data exchange.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 24,
                        "question": "What is a firewall?",
                        "options": [
                                "Router",
                                "Switch",
                                "Security system controlling traffic",
                                "Network cable"
                        ],
                        "correct": 2,
                        "explanation": "Firewalls monitor and filter incoming and outgoing traffic. They protect networks from unauthorized access.",
                        "difficulty": "Medium",
                        "topic": "Network Hardware"
                },
                {
                        "id": 25,
                        "question": "What is packet switching?",
                        "options": [
                                "Encrypting data",
                                "Broadcasting data",
                                "Sending data in fixed circuit",
                                "Dividing data into packets"
                        ],
                        "correct": 3,
                        "explanation": "Packet switching divides data into smaller packets. These travel independently and reassemble at the destination.",
                        "difficulty": "Medium",
                        "topic": "Network Hardware"
                },
                {
                        "id": 26,
                        "question": "Which protocol secures web communication?",
                        "options": [
                                "SMTP",
                                "FTP",
                                "HTTPS",
                                "HTTP"
                        ],
                        "correct": 2,
                        "explanation": "HTTPS uses SSL/TLS encryption. It protects data from interception.",
                        "difficulty": "Medium",
                        "topic": "Protocols"
                },
                {
                        "id": 27,
                        "question": "What is a subnet?",
                        "options": [
                                "Routing protocol",
                                "Network cable",
                                "Firewall rule",
                                "Small network within a larger network"
                        ],
                        "correct": 3,
                        "explanation": "Subnets divide networks into smaller segments. They improve management and security.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 28,
                        "question": "What is NAT?",
                        "options": [
                                "Network Application Transfer",
                                "Network Allocation Table",
                                "Network Access Tool",
                                "Network Address Translation"
                        ],
                        "correct": 3,
                        "explanation": "NAT translates private IP addresses to public IPs. It conserves address space.",
                        "difficulty": "Easy",
                        "topic": "Addressing & Routing"
                },
                {
                        "id": 29,
                        "question": "Which device filters traffic based on IP?",
                        "options": [
                                "Hub",
                                "Repeater",
                                "Switch",
                                "Router"
                        ],
                        "correct": 3,
                        "explanation": "Routers use IP addresses to forward packets. They connect different networks.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 30,
                        "question": "What is a port number?",
                        "options": [
                                "Network cable",
                                "Logical endpoint for communication",
                                "IP address",
                                "Hardware slot"
                        ],
                        "correct": 1,
                        "explanation": "Port numbers identify specific services. They allow multiple applications to use network simultaneously.",
                        "difficulty": "Medium",
                        "topic": "Addressing & Routing"
                },
                {
                        "id": 31,
                        "question": "Which protocol is used for remote login?",
                        "options": [
                                "DNS",
                                "HTTP",
                                "FTP",
                                "Telnet"
                        ],
                        "correct": 3,
                        "explanation": "Telnet allows remote command-line access. It is insecure compared to SSH.",
                        "difficulty": "Medium",
                        "topic": "Protocols"
                },
                {
                        "id": 32,
                        "question": "Which protocol replaces Telnet securely?",
                        "options": [
                                "HTTP",
                                "SMTP",
                                "SSH",
                                "FTP"
                        ],
                        "correct": 2,
                        "explanation": "SSH encrypts remote connections. It provides secure authentication.",
                        "difficulty": "Medium",
                        "topic": "Protocols"
                },
                {
                        "id": 33,
                        "question": "What is a gateway?",
                        "options": [
                                "Device connecting different networks/protocols",
                                "Switch",
                                "Firewall",
                                "Network cable"
                        ],
                        "correct": 0,
                        "explanation": "Gateways translate between different network protocols. They enable communication between dissimilar systems.",
                        "difficulty": "Medium",
                        "topic": "Network Hardware"
                },
                {
                        "id": 34,
                        "question": "Which topology connects all nodes to a single cable?",
                        "options": [
                                "Bus",
                                "Star",
                                "Mesh",
                                "Ring"
                        ],
                        "correct": 0,
                        "explanation": "Bus topology uses a single backbone cable. Failure of the cable disrupts the network.",
                        "difficulty": "Medium",
                        "topic": "Network Hardware"
                },
                {
                        "id": 35,
                        "question": "What is a ring topology?",
                        "options": [
                                "Nodes connected to hub",
                                "Nodes connected randomly",
                                "Nodes in mesh",
                                "Nodes connected in circle"
                        ],
                        "correct": 3,
                        "explanation": "Ring topology connects each node to two others. Data travels in one direction.",
                        "difficulty": "Medium",
                        "topic": "Network Concepts"
                },
                {
                        "id": 36,
                        "question": "What is a repeater?",
                        "options": [
                                "Routing device",
                                "Security device",
                                "Signal amplifier",
                                "File server"
                        ],
                        "correct": 2,
                        "explanation": "Repeaters regenerate signals to extend network distance. They operate at physical layer.",
                        "difficulty": "Medium",
                        "topic": "Network Hardware"
                },
                {
                        "id": 37,
                        "question": "What is jitter?",
                        "options": [
                                "Signal strength",
                                "Packet size",
                                "Variation in packet delay",
                                "Data speed"
                        ],
                        "correct": 2,
                        "explanation": "Jitter measures inconsistency in packet arrival times. It affects voice and video quality.",
                        "difficulty": "Medium",
                        "topic": "Network Concepts"
                },
                {
                        "id": 38,
                        "question": "What is QoS?",
                        "options": [
                                "Quick Online Service",
                                "Quantity of Signal",
                                "Quality of Service",
                                "Query of System"
                        ],
                        "correct": 2,
                        "explanation": "QoS prioritizes network traffic. It ensures performance for critical applications.",
                        "difficulty": "Easy",
                        "topic": "Network Concepts"
                },
                {
                        "id": 39,
                        "question": "Which protocol is used for network management?",
                        "options": [
                                "SNMP",
                                "FTP",
                                "DNS",
                                "SMTP"
                        ],
                        "correct": 0,
                        "explanation": "SNMP monitors and manages network devices. It collects performance data.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 40,
                        "question": "What is a VPN?",
                        "options": [
                                "Virtual Private Network",
                                "Verified Private Network",
                                "Virtual Public Network",
                                "Variable Protocol Network"
                        ],
                        "correct": 0,
                        "explanation": "VPN creates secure encrypted connections over public networks. It protects data privacy.",
                        "difficulty": "Medium",
                        "topic": "Network Security"
                },
                {
                        "id": 41,
                        "question": "What is packet loss?",
                        "options": [
                                "Data encryption",
                                "Packets failing to reach destination",
                                "Signal amplification",
                                "Packet duplication"
                        ],
                        "correct": 1,
                        "explanation": "Packet loss occurs due to congestion or errors. It reduces network performance.",
                        "difficulty": "Easy",
                        "topic": "General Networking"
                },
                {
                        "id": 42,
                        "question": "What is throughput?",
                        "options": [
                                "Delay",
                                "Actual data transfer rate",
                                "Bandwidth",
                                "Packet size"
                        ],
                        "correct": 1,
                        "explanation": "Throughput measures real data transfer. It may be lower than bandwidth.",
                        "difficulty": "Easy",
                        "topic": "Network Concepts"
                },
                {
                        "id": 43,
                        "question": "Which protocol is used for time synchronization?",
                        "options": [
                                "FTP",
                                "SMTP",
                                "SNMP",
                                "NTP"
                        ],
                        "correct": 3,
                        "explanation": "NTP synchronizes clocks across network devices. Accurate time is essential for logs and security.",
                        "difficulty": "Medium",
                        "topic": "Protocols"
                },
                {
                        "id": 44,
                        "question": "What is collision in networking?",
                        "options": [
                                "Packet encryption",
                                "Two devices sending data simultaneously",
                                "IP conflict",
                                "Router failure"
                        ],
                        "correct": 1,
                        "explanation": "Collisions occur in shared media networks. They cause data corruption and retransmissions.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 45,
                        "question": "Which device prevents collisions?",
                        "options": [
                                "Hub",
                                "Switch",
                                "Repeater",
                                "Modem"
                        ],
                        "correct": 1,
                        "explanation": "Switches create separate collision domains. This reduces network congestion.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 46,
                        "question": "What is a broadcast address?",
                        "options": [
                                "Address for all devices in network",
                                "Firewall address",
                                "Address for single device",
                                "Router address"
                        ],
                        "correct": 0,
                        "explanation": "Broadcast addresses send data to all devices in a subnet. They are used for announcements.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 47,
                        "question": "What is IPv4 address size?",
                        "options": [
                                "32-bit",
                                "16-bit",
                                "64-bit",
                                "128-bit"
                        ],
                        "correct": 0,
                        "explanation": "IPv4 uses 32-bit addresses. This allows about 4.3 billion addresses.",
                        "difficulty": "Easy",
                        "topic": "Addressing & Routing"
                },
                {
                        "id": 48,
                        "question": "What is IPv6 address size?",
                        "options": [
                                "256-bit",
                                "128-bit",
                                "32-bit",
                                "64-bit"
                        ],
                        "correct": 1,
                        "explanation": "IPv6 uses 128-bit addresses. It provides a vast address space.",
                        "difficulty": "Easy",
                        "topic": "Addressing & Routing"
                },
                {
                        "id": 49,
                        "question": "What is a unicast transmission?",
                        "options": [
                                "One-to-many communication",
                                "Broadcast communication",
                                "Many-to-many communication",
                                "One-to-one communication"
                        ],
                        "correct": 3,
                        "explanation": "Unicast sends data from one sender to one receiver. It is the most common communication method.",
                        "difficulty": "Medium",
                        "topic": "Network Hardware"
                },
                {
                        "id": 52,
                        "question": "What is the main function of the Transport layer?",
                        "options": [
                                "Signal transmission",
                                "Reliable end-to-end communication",
                                "Routing",
                                "Encryption"
                        ],
                        "correct": 1,
                        "explanation": "The Transport layer ensures data is delivered reliably between hosts. Protocols like TCP manage sequencing and acknowledgments.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 53,
                        "question": "Which protocol is connectionless at the Transport layer?",
                        "options": [
                                "UDP",
                                "HTTP",
                                "FTP",
                                "TCP"
                        ],
                        "correct": 0,
                        "explanation": "UDP sends packets without establishing a connection. It is faster but does not guarantee delivery.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 54,
                        "question": "What is a socket?",
                        "options": [
                                "Routing table",
                                "Network cable",
                                "Endpoint for communication",
                                "IP address"
                        ],
                        "correct": 2,
                        "explanation": "A socket combines an IP address and port number. It uniquely identifies a communication endpoint.",
                        "difficulty": "Medium",
                        "topic": "Addressing & Routing"
                },
                {
                        "id": 55,
                        "question": "What is a three-way handshake?",
                        "options": [
                                "DNS lookup",
                                "File transfer method",
                                "Encryption method",
                                "TCP connection establishment process"
                        ],
                        "correct": 3,
                        "explanation": "TCP uses SYN, SYN-ACK, and ACK to establish a connection. This ensures both sides are ready to communicate.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 56,
                        "question": "What is flow control?",
                        "options": [
                                "Routing algorithm",
                                "Controlling packet speed",
                                "Encryption method",
                                "Managing data transmission rate between sender and receiver"
                        ],
                        "correct": 3,
                        "explanation": "Flow control prevents the sender from overwhelming the receiver. It ensures efficient data transfer.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 57,
                        "question": "Which protocol uses port 80 by default?",
                        "options": [
                                "DNS",
                                "FTP",
                                "HTTP",
                                "SMTP"
                        ],
                        "correct": 2,
                        "explanation": "HTTP uses port 80 for web traffic. HTTPS uses port 443.",
                        "difficulty": "Easy",
                        "topic": "Protocols"
                },
                {
                        "id": 58,
                        "question": "Which protocol uses port 443?",
                        "options": [
                                "Telnet",
                                "HTTP",
                                "HTTPS",
                                "FTP"
                        ],
                        "correct": 2,
                        "explanation": "HTTPS secures web communication using SSL/TLS. It operates on port 443.",
                        "difficulty": "Medium",
                        "topic": "Protocols"
                },
                {
                        "id": 59,
                        "question": "What is congestion control?",
                        "options": [
                                "Managing network traffic to avoid overload",
                                "Assigning IP addresses",
                                "Increasing bandwidth",
                                "Encrypting packets"
                        ],
                        "correct": 0,
                        "explanation": "Congestion control prevents network overload. TCP adjusts transmission rates to reduce packet loss.",
                        "difficulty": "Hard",
                        "topic": "General Networking"
                },
                {
                        "id": 60,
                        "question": "Which TCP feature ensures ordered delivery?",
                        "options": [
                                "Sequence numbers",
                                "Ports",
                                "ARP",
                                "Checksums"
                        ],
                        "correct": 0,
                        "explanation": "TCP uses sequence numbers to reorder packets. This ensures correct data sequence.",
                        "difficulty": "Medium",
                        "topic": "Protocols"
                },
                {
                        "id": 61,
                        "question": "What is a DNS server?",
                        "options": [
                                "Resolves domain names to IP addresses",
                                "Stores web pages",
                                "Filters traffic",
                                "Assigns IP addresses"
                        ],
                        "correct": 0,
                        "explanation": "DNS servers translate domain names into IP addresses. This enables user-friendly browsing.",
                        "difficulty": "Medium",
                        "topic": "Protocols"
                },
                {
                        "id": 62,
                        "question": "What is a proxy server?",
                        "options": [
                                "Router",
                                "Firewall device",
                                "Network cable",
                                "Intermediary between client and server"
                        ],
                        "correct": 3,
                        "explanation": "Proxy servers forward client requests. They enhance security and caching.",
                        "difficulty": "Easy",
                        "topic": "General Networking"
                },
                {
                        "id": 63,
                        "question": "What is a CDN?",
                        "options": [
                                "Computer Data Network",
                                "Content Delivery Network",
                                "Core Distribution Node",
                                "Central Data Node"
                        ],
                        "correct": 1,
                        "explanation": "CDNs distribute content across servers globally. This reduces latency and improves performance.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 64,
                        "question": "What is an intranet?",
                        "options": [
                                "Private internal network",
                                "Global network",
                                "Public network",
                                "Wireless network"
                        ],
                        "correct": 0,
                        "explanation": "Intranets are private networks used within organizations. They enhance internal communication.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 65,
                        "question": "What is an extranet?",
                        "options": [
                                "Wireless LAN",
                                "Network accessible to partners",
                                "Internal network",
                                "Public internet"
                        ],
                        "correct": 1,
                        "explanation": "Extranets allow controlled external access. They support collaboration with partners.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 66,
                        "question": "What is a MAN?",
                        "options": [
                                "Metropolitan Area Network",
                                "Massive Area Network",
                                "Main Access Network",
                                "Multiple Area Network"
                        ],
                        "correct": 0,
                        "explanation": "MAN covers a city-sized area. It connects multiple LANs.",
                        "difficulty": "Easy",
                        "topic": "Network Concepts"
                },
                {
                        "id": 67,
                        "question": "What is WAN?",
                        "options": [
                                "Wide Area Network",
                                "Wireless Area Network",
                                "World Access Network",
                                "Web Area Network"
                        ],
                        "correct": 0,
                        "explanation": "WAN spans large geographic areas. The internet is the largest WAN.",
                        "difficulty": "Easy",
                        "topic": "Network Concepts"
                },
                {
                        "id": 68,
                        "question": "What is a backbone network?",
                        "options": [
                                "High-capacity central network",
                                "Personal network",
                                "Small network",
                                "Wireless network"
                        ],
                        "correct": 0,
                        "explanation": "Backbone networks carry large volumes of traffic. They connect smaller networks.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 69,
                        "question": "What is MPLS?",
                        "options": [
                                "File transfer protocol",
                                "Routing protocol",
                                "Multi-Protocol Label Switching",
                                "Encryption method"
                        ],
                        "correct": 2,
                        "explanation": "MPLS speeds packet forwarding using labels. It improves performance and traffic engineering.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 70,
                        "question": "What is a VLAN?",
                        "options": [
                                "Visual LAN",
                                "Virtual LAN",
                                "Variable LAN",
                                "Verified LAN"
                        ],
                        "correct": 1,
                        "explanation": "VLANs logically separate networks within a switch. They improve security and management.",
                        "difficulty": "Medium",
                        "topic": "Network Concepts"
                },
                {
                        "id": 71,
                        "question": "What is a trunk port?",
                        "options": [
                                "Router port",
                                "Port for single VLAN",
                                "Firewall port",
                                "Port carrying multiple VLAN traffic"
                        ],
                        "correct": 3,
                        "explanation": "Trunk ports carry traffic from multiple VLANs. They use tagging to identify VLANs.",
                        "difficulty": "Medium",
                        "topic": "Addressing & Routing"
                },
                {
                        "id": 72,
                        "question": "What is STP?",
                        "options": [
                                "Secure Transfer Protocol",
                                "Standard Transfer Process",
                                "Spanning Tree Protocol",
                                "System Transport Protocol"
                        ],
                        "correct": 2,
                        "explanation": "STP prevents loops in network topologies. It creates a loop-free logical structure.",
                        "difficulty": "Easy",
                        "topic": "General Networking"
                },
                {
                        "id": 73,
                        "question": "What is a collision domain?",
                        "options": [
                                "Network area sharing bandwidth",
                                "VLAN",
                                "IP address range",
                                "Area where packets collide"
                        ],
                        "correct": 3,
                        "explanation": "A collision domain is where packet collisions can occur. Switches reduce collision domains.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 74,
                        "question": "What is a broadcast domain?",
                        "options": [
                                "IP address",
                                "Area receiving broadcasts",
                                "Router port",
                                "Single device"
                        ],
                        "correct": 1,
                        "explanation": "Broadcast domains include all devices receiving broadcast messages. Routers separate broadcast domains.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 75,
                        "question": "Which protocol is used for secure file transfer?",
                        "options": [
                                "SMTP",
                                "FTP",
                                "HTTP",
                                "SFTP"
                        ],
                        "correct": 3,
                        "explanation": "SFTP uses SSH for secure file transfer. It encrypts data and authentication.",
                        "difficulty": "Medium",
                        "topic": "Protocols"
                },
                {
                        "id": 76,
                        "question": "What is a checksum?",
                        "options": [
                                "Port number",
                                "IP address",
                                "Error detection method",
                                "Encryption key"
                        ],
                        "correct": 2,
                        "explanation": "Checksums verify data integrity. They detect errors during transmission.",
                        "difficulty": "Easy",
                        "topic": "General Networking"
                },
                {
                        "id": 77,
                        "question": "What is MTU?",
                        "options": [
                                "Maximum Transfer Unit",
                                "Minimum Transmission Unit",
                                "Media Transfer Utility",
                                "Memory Transfer Unit"
                        ],
                        "correct": 0,
                        "explanation": "MTU defines the largest packet size that can be transmitted. Larger packets may be fragmented.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 78,
                        "question": "What is packet fragmentation?",
                        "options": [
                                "Breaking packets into smaller pieces",
                                "Combining packets",
                                "Encrypting packets",
                                "Dropping packets"
                        ],
                        "correct": 0,
                        "explanation": "Fragmentation occurs when packets exceed MTU. They are reassembled at the destination.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 79,
                        "question": "What is ICMP used for?",
                        "options": [
                                "File transfer",
                                "DNS resolution",
                                "Error reporting and diagnostics",
                                "Email transfer"
                        ],
                        "correct": 2,
                        "explanation": "ICMP reports errors and network conditions. Tools like ping use ICMP.",
                        "difficulty": "Easy",
                        "topic": "Protocols"
                },
                {
                        "id": 80,
                        "question": "What does ping use?",
                        "options": [
                                "TCP",
                                "UDP",
                                "HTTP",
                                "ICMP"
                        ],
                        "correct": 3,
                        "explanation": "Ping uses ICMP echo requests. It checks connectivity.",
                        "difficulty": "Easy",
                        "topic": "General Networking"
                },
                {
                        "id": 81,
                        "question": "What is traceroute used for?",
                        "options": [
                                "DNS lookup",
                                "File transfer",
                                "Tracking packet path",
                                "IP assignment"
                        ],
                        "correct": 2,
                        "explanation": "Traceroute shows the path packets take. It helps diagnose network issues.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 82,
                        "question": "What is a network interface card (NIC)?",
                        "options": [
                                "Protocol",
                                "Software driver",
                                "Router",
                                "Hardware for network connectivity"
                        ],
                        "correct": 3,
                        "explanation": "NIC enables devices to connect to networks. It provides MAC addresses.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 83,
                        "question": "What is duplex communication?",
                        "options": [
                                "Two-way communication",
                                "Broadcast communication",
                                "One-way communication",
                                "Multicast communication"
                        ],
                        "correct": 0,
                        "explanation": "Duplex allows simultaneous sending and receiving. Full duplex improves efficiency.",
                        "difficulty": "Medium",
                        "topic": "Network Hardware"
                },
                {
                        "id": 84,
                        "question": "What is half-duplex?",
                        "options": [
                                "Multicast only",
                                "One direction at a time",
                                "Broadcast only",
                                "Simultaneous communication"
                        ],
                        "correct": 1,
                        "explanation": "Half-duplex allows communication in both directions but not simultaneously. Walkie-talkies use this mode.",
                        "difficulty": "Medium",
                        "topic": "Network Concepts"
                },
                {
                        "id": 85,
                        "question": "What is full duplex?",
                        "options": [
                                "One-way communication",
                                "Multicast communication",
                                "Two-way simultaneous communication",
                                "Broadcast communication"
                        ],
                        "correct": 2,
                        "explanation": "Full duplex allows simultaneous transmission and reception. It improves performance.",
                        "difficulty": "Medium",
                        "topic": "Network Concepts"
                },
                {
                        "id": 86,
                        "question": "What is a hotspot?",
                        "options": [
                                "Router failure",
                                "Network error",
                                "Wireless internet access point",
                                "Security breach"
                        ],
                        "correct": 2,
                        "explanation": "Hotspots provide wireless connectivity. They allow devices to connect to the internet.",
                        "difficulty": "Medium",
                        "topic": "Wireless Networking"
                },
                {
                        "id": 87,
                        "question": "What is WPA3?",
                        "options": [
                                "Wireless protocol",
                                "Wi-Fi security standard",
                                "Routing protocol",
                                "File transfer method"
                        ],
                        "correct": 1,
                        "explanation": "WPA3 provides improved wireless security. It protects against brute-force attacks.",
                        "difficulty": "Easy",
                        "topic": "Network Security"
                },
                {
                        "id": 88,
                        "question": "What is SSID?",
                        "options": [
                                "Network password",
                                "MAC address",
                                "Network name",
                                "IP address"
                        ],
                        "correct": 2,
                        "explanation": "SSID identifies a wireless network. Users select it to connect.",
                        "difficulty": "Easy",
                        "topic": "Wireless Networking"
                },
                {
                        "id": 89,
                        "question": "What is MAC filtering?",
                        "options": [
                                "DNS filtering",
                                "Allowing devices based on MAC address",
                                "Blocking IP addresses",
                                "Encrypting packets"
                        ],
                        "correct": 1,
                        "explanation": "MAC filtering controls device access. It enhances network security.",
                        "difficulty": "Easy",
                        "topic": "General Networking"
                },
                {
                        "id": 90,
                        "question": "What is a wireless access point?",
                        "options": [
                                "Modem",
                                "Device providing Wi-Fi connectivity",
                                "Firewall",
                                "Router"
                        ],
                        "correct": 1,
                        "explanation": "Access points enable wireless devices to connect to networks. They extend Wi-Fi coverage.",
                        "difficulty": "Medium",
                        "topic": "Network Hardware"
                },
                {
                        "id": 91,
                        "question": "What is a modem?",
                        "options": [
                                "Modulator-demodulator",
                                "Firewall",
                                "Router",
                                "Switch"
                        ],
                        "correct": 0,
                        "explanation": "Modems convert digital data to analog signals and vice versa. They enable internet over phone lines.",
                        "difficulty": "Medium",
                        "topic": "Network Hardware"
                },
                {
                        "id": 92,
                        "question": "What is broadband?",
                        "options": [
                                "Narrow bandwidth",
                                "Wireless protocol",
                                "High-speed internet connection",
                                "Encryption method"
                        ],
                        "correct": 2,
                        "explanation": "Broadband provides high-speed internet. It supports multiple services simultaneously.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 93,
                        "question": "What is packet sniffing?",
                        "options": [
                                "Packet encryption",
                                "Packet routing",
                                "Monitoring network traffic",
                                "Packet loss"
                        ],
                        "correct": 2,
                        "explanation": "Packet sniffing analyzes network packets. It is used for troubleshooting and security monitoring.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 94,
                        "question": "What is spoofing?",
                        "options": [
                                "Data encryption",
                                "Packet routing",
                                "Impersonating another device",
                                "Network optimization"
                        ],
                        "correct": 2,
                        "explanation": "Spoofing involves falsifying identity. It is used in cyberattacks.",
                        "difficulty": "Easy",
                        "topic": "Network Security"
                },
                {
                        "id": 95,
                        "question": "What is phishing?",
                        "options": [
                                "Fraudulent attempt to obtain sensitive data",
                                "Packet loss",
                                "Network error",
                                "Routing error"
                        ],
                        "correct": 0,
                        "explanation": "Phishing tricks users into revealing credentials. It is a common cyber threat.",
                        "difficulty": "Easy",
                        "topic": "Network Security"
                },
                {
                        "id": 96,
                        "question": "What is DDoS attack?",
                        "options": [
                                "File transfer",
                                "Packet routing",
                                "Data encryption",
                                "Overloading server with traffic"
                        ],
                        "correct": 3,
                        "explanation": "Distributed Denial of Service floods servers. It disrupts services.",
                        "difficulty": "Easy",
                        "topic": "Network Security"
                },
                {
                        "id": 97,
                        "question": "What is a honeypot?",
                        "options": [
                                "Router",
                                "Firewall rule",
                                "Network cable",
                                "Security system to trap attackers"
                        ],
                        "correct": 3,
                        "explanation": "Honeypots lure attackers to detect threats. They help improve security.",
                        "difficulty": "Easy",
                        "topic": "Network Security"
                },
                {
                        "id": 98,
                        "question": "What is SSL/TLS?",
                        "options": [
                                "Routing protocol",
                                "File transfer protocol",
                                "Encryption protocol",
                                "Network topology"
                        ],
                        "correct": 2,
                        "explanation": "SSL/TLS encrypts data in transit. It ensures secure communication.",
                        "difficulty": "Easy",
                        "topic": "Network Security"
                },
                {
                        "id": 99,
                        "question": "What is digital signature used for?",
                        "options": [
                                "IP assignment",
                                "Routing",
                                "Data compression",
                                "Authentication and integrity"
                        ],
                        "correct": 3,
                        "explanation": "Digital signatures verify sender identity. They ensure data integrity.",
                        "difficulty": "Medium",
                        "topic": "Addressing & Routing"
                },
                {
                        "id": 102,
                        "question": "What is static routing?",
                        "options": [
                                "Manually configured routing",
                                "Routing that changes automatically",
                                "Routing using AI",
                                "Dynamic routing"
                        ],
                        "correct": 0,
                        "explanation": "Static routing requires manual configuration. It is simple but not adaptable to network changes.",
                        "difficulty": "Medium",
                        "topic": "Addressing & Routing"
                },
                {
                        "id": 103,
                        "question": "What is dynamic routing?",
                        "options": [
                                "Manual routing",
                                "Routing without protocols",
                                "Static routing",
                                "Routing that updates automatically"
                        ],
                        "correct": 3,
                        "explanation": "Dynamic routing uses protocols to update routes automatically. It adapts to network changes.",
                        "difficulty": "Medium",
                        "topic": "Addressing & Routing"
                },
                {
                        "id": 104,
                        "question": "Which protocol is used for dynamic routing?",
                        "options": [
                                "HTTP",
                                "RIP",
                                "SMTP",
                                "FTP"
                        ],
                        "correct": 1,
                        "explanation": "RIP (Routing Information Protocol) exchanges routing information. It uses hop count to determine best paths.",
                        "difficulty": "Medium",
                        "topic": "Protocols"
                },
                {
                        "id": 105,
                        "question": "What is OSPF?",
                        "options": [
                                "File transfer protocol",
                                "Security protocol",
                                "Email protocol",
                                "Open Shortest Path First routing protocol"
                        ],
                        "correct": 3,
                        "explanation": "OSPF is a link-state routing protocol. It calculates shortest paths using Dijkstra’s algorithm.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 106,
                        "question": "What is BGP used for?",
                        "options": [
                                "File transfer",
                                "Internet routing between autonomous systems",
                                "DNS resolution",
                                "Internal routing"
                        ],
                        "correct": 1,
                        "explanation": "BGP manages routing between large networks. It is essential for internet backbone routing.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 107,
                        "question": "What is hop count?",
                        "options": [
                                "Number of routers a packet passes",
                                "Network speed",
                                "Packet size",
                                "IP address"
                        ],
                        "correct": 0,
                        "explanation": "Hop count measures the number of intermediate devices. It helps determine routing paths.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 108,
                        "question": "What is a loopback address?",
                        "options": [
                                "Broadcast address",
                                "Multicast address",
                                "External IP",
                                "Address used to test local network stack"
                        ],
                        "correct": 3,
                        "explanation": "Loopback addresses like 127.0.0.1 test local networking. They do not leave the device.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 109,
                        "question": "What is CIDR?",
                        "options": [
                                "Controlled IP Data Routing",
                                "Classless Inter-Domain Routing",
                                "Classful Internet Domain Routing",
                                "Central Internet Data Routing"
                        ],
                        "correct": 1,
                        "explanation": "CIDR replaces class-based addressing. It improves IP address allocation.",
                        "difficulty": "Medium",
                        "topic": "Addressing & Routing"
                },
                {
                        "id": 110,
                        "question": "What is subnet mask used for?",
                        "options": [
                                "Encrypting data",
                                "Assigning IP addresses",
                                "Filtering traffic",
                                "Identifying network and host portions of IP"
                        ],
                        "correct": 3,
                        "explanation": "Subnet masks divide IP addresses into network and host parts. They enable subnetting.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 111,
                        "question": "What is private IP address?",
                        "options": [
                                "Router address",
                                "Address used within local networks",
                                "Broadcast address",
                                "Public internet address"
                        ],
                        "correct": 1,
                        "explanation": "Private IPs are used within local networks. They are not routable on the internet.",
                        "difficulty": "Medium",
                        "topic": "Addressing & Routing"
                },
                {
                        "id": 112,
                        "question": "Which range is private IP (Class C)?",
                        "options": [
                                "10.0.0.0–10.255.255.255",
                                "192.168.0.0–192.168.255.255",
                                "172.16.0.0–172.31.255.255",
                                "8.8.8.8–8.8.8.8"
                        ],
                        "correct": 1,
                        "explanation": "192.168.x.x is reserved for private networks. It is commonly used in home routers.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 113,
                        "question": "What is a public IP address?",
                        "options": [
                                "Router port",
                                "Globally unique address",
                                "Used inside LAN",
                                "MAC address"
                        ],
                        "correct": 1,
                        "explanation": "Public IP addresses are globally unique. They enable internet communication.",
                        "difficulty": "Medium",
                        "topic": "Addressing & Routing"
                },
                {
                        "id": 114,
                        "question": "What is IPv6 abbreviation?",
                        "options": [
                                "Internal Protocol version 6",
                                "Internet Port version 6",
                                "Internet Protocol version 6",
                                "Integrated Protocol version 6"
                        ],
                        "correct": 2,
                        "explanation": "IPv6 is the latest IP version. It solves IPv4 address exhaustion.",
                        "difficulty": "Easy",
                        "topic": "Addressing & Routing"
                },
                {
                        "id": 115,
                        "question": "What is tunneling?",
                        "options": [
                                "Dropping packets",
                                "Encrypting packets",
                                "Packet duplication",
                                "Encapsulating packets within another protocol"
                        ],
                        "correct": 3,
                        "explanation": "Tunneling wraps packets inside other packets. It enables VPNs and secure communication.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 116,
                        "question": "What is QoS used for?",
                        "options": [
                                "File transfer",
                                "Prioritizing network traffic",
                                "IP assignment",
                                "Encryption"
                        ],
                        "correct": 1,
                        "explanation": "QoS prioritizes critical traffic like voice. It improves performance.",
                        "difficulty": "Easy",
                        "topic": "Network Concepts"
                },
                {
                        "id": 117,
                        "question": "What is VoIP?",
                        "options": [
                                "Variable Online IP",
                                "Voice over Internet Protocol",
                                "Virtual Office IP",
                                "Video over Internet Protocol"
                        ],
                        "correct": 1,
                        "explanation": "VoIP transmits voice over IP networks. It enables internet-based calls.",
                        "difficulty": "Easy",
                        "topic": "General Networking"
                },
                {
                        "id": 118,
                        "question": "What is a gateway protocol?",
                        "options": [
                                "Protocol for routing between networks",
                                "Protocol for file transfer",
                                "DNS protocol",
                                "Encryption protocol"
                        ],
                        "correct": 0,
                        "explanation": "Gateway protocols like BGP route between networks. They enable large-scale connectivity.",
                        "difficulty": "Medium",
                        "topic": "Protocols"
                },
                {
                        "id": 119,
                        "question": "What is an autonomous system (AS)?",
                        "options": [
                                "Router",
                                "Switch",
                                "Single computer",
                                "Network under one administrative control"
                        ],
                        "correct": 3,
                        "explanation": "AS is a collection of networks managed by one organization. BGP routes between ASes.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 120,
                        "question": "What is load balancing in networks?",
                        "options": [
                                "Increasing bandwidth",
                                "Encrypting packets",
                                "Distributing traffic across servers",
                                "Assigning IP addresses"
                        ],
                        "correct": 2,
                        "explanation": "Load balancing improves performance and availability. It prevents server overload.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 121,
                        "question": "What is a reverse proxy?",
                        "options": [
                                "Proxy for servers",
                                "Router",
                                "Firewall",
                                "Proxy for clients"
                        ],
                        "correct": 0,
                        "explanation": "Reverse proxies handle client requests on behalf of servers. They improve security and load distribution.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 122,
                        "question": "What is caching in networking?",
                        "options": [
                                "Storing frequently accessed data",
                                "Encryption",
                                "Data deletion",
                                "Packet loss"
                        ],
                        "correct": 0,
                        "explanation": "Caching reduces latency by storing data locally. It improves performance.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 123,
                        "question": "What is a content filter?",
                        "options": [
                                "DNS server",
                                "Blocking unwanted content",
                                "Switch",
                                "Router"
                        ],
                        "correct": 1,
                        "explanation": "Content filters restrict access to harmful sites. They enhance security.",
                        "difficulty": "Easy",
                        "topic": "General Networking"
                },
                {
                        "id": 124,
                        "question": "What is DPI (Deep Packet Inspection)?",
                        "options": [
                                "Analyzing packet content",
                                "Packet duplication",
                                "Packet routing",
                                "Packet encryption"
                        ],
                        "correct": 0,
                        "explanation": "DPI examines packet data beyond headers. It is used for security and traffic management.",
                        "difficulty": "Medium",
                        "topic": "General Networking"
                },
                {
                        "id": 125,
                        "question": "What is a zero-day attack?",
                        "options": [
                                "DDoS attack",
                                "Attack on first day",
                                "Exploit of unknown vulnerability",
                                "Network outage"
                        ],
                        "correct": 2,
                        "explanation": "Zero-day attacks exploit unknown vulnerabilities. They are difficult to defend against.",
                        "difficulty": "Medium",
                        "topic": "Network Security"
                },
                {
                        "id": 126,
                        "question": "What is network segmentation?",
                        "options": [
                                "Increasing bandwidth",
                                "Combining networks",
                                "Encrypting data",
                                "Dividing network into smaller parts"
                        ],
                        "correct": 3,
                        "explanation": "Segmentation improves security and performance. It limits broadcast traffic.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 127,
                        "question": "What is a DMZ in networking?",
                        "options": [
                                "Isolated network for public services",
                                "Secure internal network",
                                "Backup network",
                                "Wireless network"
                        ],
                        "correct": 0,
                        "explanation": "DMZ hosts public-facing services. It protects internal networks.",
                        "difficulty": "Easy",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 128,
                        "question": "What is port forwarding?",
                        "options": [
                                "Redirecting traffic to internal device",
                                "Encrypting ports",
                                "Blocking ports",
                                "Assigning IP"
                        ],
                        "correct": 0,
                        "explanation": "Port forwarding maps external requests to internal devices. It enables remote access.",
                        "difficulty": "Medium",
                        "topic": "Addressing & Routing"
                },
                {
                        "id": 129,
                        "question": "What is NAT overload?",
                        "options": [
                                "Multiple private IPs sharing one public IP",
                                "IP conflict",
                                "Multiple public IPs",
                                "Routing loop"
                        ],
                        "correct": 0,
                        "explanation": "NAT overload allows many devices to share one public IP. It uses port numbers to distinguish sessions.",
                        "difficulty": "Medium",
                        "topic": "Addressing & Routing"
                },
                {
                        "id": 130,
                        "question": "What is a wireless channel?",
                        "options": [
                                "MAC address",
                                "Port number",
                                "IP address",
                                "Frequency band for communication"
                        ],
                        "correct": 3,
                        "explanation": "Wireless channels divide frequency bands. They reduce interference.",
                        "difficulty": "Easy",
                        "topic": "Wireless Networking"
                },
                {
                        "id": 131,
                        "question": "What is signal attenuation?",
                        "options": [
                                "Signal amplification",
                                "Packet duplication",
                                "Signal weakening over distance",
                                "Data encryption"
                        ],
                        "correct": 2,
                        "explanation": "Attenuation reduces signal strength. Repeaters can restore signals.",
                        "difficulty": "Easy",
                        "topic": "General Networking"
                },
                {
                        "id": 132,
                        "question": "What is crosstalk?",
                        "options": [
                                "Data encryption",
                                "Signal interference between cables",
                                "IP conflict",
                                "Packet routing"
                        ],
                        "correct": 1,
                        "explanation": "Crosstalk occurs when signals interfere. Proper shielding reduces it.",
                        "difficulty": "Easy",
                        "topic": "General Networking"
                },
                {
                        "id": 133,
                        "question": "What is fiber optic cable advantage?",
                        "options": [
                                "High speed and low interference",
                                "Easy installation",
                                "Cheap cost",
                                "Short distance"
                        ],
                        "correct": 0,
                        "explanation": "Fiber optics transmit data using light. They offer high bandwidth and immunity to interference.",
                        "difficulty": "Medium",
                        "topic": "Network Hardware"
                },
                {
                        "id": 134,
                        "question": "What is UTP cable?",
                        "options": [
                                "Universal Transmission Protocol",
                                "Unshielded Twisted Pair",
                                "Ultra Transfer Port",
                                "Unified Twisted Pair"
                        ],
                        "correct": 1,
                        "explanation": "UTP cables are common in LANs. Twisting reduces interference.",
                        "difficulty": "Easy",
                        "topic": "Network Hardware"
                },
                {
                        "id": 135,
                        "question": "What is STP cable?",
                        "options": [
                                "Standard Twisted Pair",
                                "Serial Transfer Pair",
                                "Shielded Twisted Pair",
                                "Secure Twisted Pair"
                        ],
                        "correct": 2,
                        "explanation": "STP cables include shielding to reduce interference. They are used in noisy environments.",
                        "difficulty": "Medium",
                        "topic": "Network Hardware"
                },
                {
                        "id": 136,
                        "question": "What is a patch panel?",
                        "options": [
                                "Router",
                                "Switch",
                                "Firewall",
                                "Network cable organizer"
                        ],
                        "correct": 3,
                        "explanation": "Patch panels organize network cables. They simplify maintenance.",
                        "difficulty": "Easy",
                        "topic": "General Networking"
                },
                {
                        "id": 137,
                        "question": "What is a network bridge?",
                        "options": [
                                "Firewall",
                                "Modem",
                                "Router",
                                "Connects two LAN segments"
                        ],
                        "correct": 3,
                        "explanation": "Bridges connect LAN segments at data link layer. They filter traffic using MAC addresses.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 138,
                        "question": "What is a wireless repeater?",
                        "options": [
                                "Extends Wi-Fi coverage",
                                "Modem",
                                "Firewall",
                                "Router"
                        ],
                        "correct": 0,
                        "explanation": "Wireless repeaters amplify Wi-Fi signals. They extend coverage areas.",
                        "difficulty": "Easy",
                        "topic": "Network Hardware"
                },
                {
                        "id": 139,
                        "question": "What is a captive portal?",
                        "options": [
                                "DNS server",
                                "Router",
                                "Firewall",
                                "Web page for network authentication"
                        ],
                        "correct": 3,
                        "explanation": "Captive portals require users to log in before accessing internet. Common in public Wi-Fi.",
                        "difficulty": "Medium",
                        "topic": "Addressing & Routing"
                },
                {
                        "id": 140,
                        "question": "What is WPA2?",
                        "options": [
                                "Routing protocol",
                                "File transfer protocol",
                                "Wi-Fi standard",
                                "Wireless security protocol"
                        ],
                        "correct": 3,
                        "explanation": "WPA2 secures wireless networks using encryption. WPA3 is the newer version.",
                        "difficulty": "Easy",
                        "topic": "Network Security"
                },
                {
                        "id": 141,
                        "question": "What is SSID broadcasting?",
                        "options": [
                                "Hiding network name",
                                "Encrypting Wi-Fi",
                                "Assigning IP",
                                "Displaying network name"
                        ],
                        "correct": 3,
                        "explanation": "SSID broadcasting makes networks visible. Disabling hides the network.",
                        "difficulty": "Easy",
                        "topic": "Wireless Networking"
                },
                {
                        "id": 142,
                        "question": "What is MAC spoofing?",
                        "options": [
                                "Changing MAC address to impersonate device",
                                "Blocking MAC",
                                "Filtering MAC",
                                "Encrypting MAC address"
                        ],
                        "correct": 0,
                        "explanation": "MAC spoofing disguises device identity. It can bypass MAC filtering.",
                        "difficulty": "Easy",
                        "topic": "Network Security"
                },
                {
                        "id": 143,
                        "question": "What is network sniffing tool example?",
                        "options": [
                                "Wireshark",
                                "Chrome",
                                "Excel",
                                "Notepad"
                        ],
                        "correct": 0,
                        "explanation": "Wireshark captures and analyzes packets. It is used for troubleshooting.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 144,
                        "question": "What is a botnet?",
                        "options": [
                                "Group of compromised devices",
                                "Firewall",
                                "Network cable",
                                "Router"
                        ],
                        "correct": 0,
                        "explanation": "Botnets are controlled by attackers. They perform DDoS attacks.",
                        "difficulty": "Easy",
                        "topic": "General Networking"
                },
                {
                        "id": 145,
                        "question": "What is HTTPS encryption based on?",
                        "options": [
                                "SNMP",
                                "ARP",
                                "FTP",
                                "SSL/TLS"
                        ],
                        "correct": 3,
                        "explanation": "HTTPS uses SSL/TLS protocols. They secure web communication.",
                        "difficulty": "Easy",
                        "topic": "Protocols"
                },
                {
                        "id": 146,
                        "question": "What is end-to-end encryption?",
                        "options": [
                                "Encryption between sender and receiver",
                                "Encryption only at sender",
                                "Encryption at router",
                                "No encryption"
                        ],
                        "correct": 0,
                        "explanation": "End-to-end encryption ensures only sender and receiver can read data. Intermediaries cannot decrypt it.",
                        "difficulty": "Medium",
                        "topic": "Network Security"
                },
                {
                        "id": 147,
                        "question": "What is a network protocol?",
                        "options": [
                                "IP address",
                                "Hardware device",
                                "Rules for communication",
                                "Cable type"
                        ],
                        "correct": 2,
                        "explanation": "Protocols define how data is transmitted. Examples include TCP/IP.",
                        "difficulty": "Easy",
                        "topic": "Network Models & Layers"
                },
                {
                        "id": 148,
                        "question": "What is packet header?",
                        "options": [
                                "Data payload",
                                "Control information in packet",
                                "File format",
                                "Encryption key"
                        ],
                        "correct": 1,
                        "explanation": "Packet headers contain addressing and routing info. They guide data delivery.",
                        "difficulty": "Easy",
                        "topic": "General Networking"
                },
                {
                        "id": 149,
                        "question": "What is payload?",
                        "options": [
                                "Actual data carried by packet",
                                "Encryption key",
                                "Routing table",
                                "Packet header"
                        ],
                        "correct": 0,
                        "explanation": "Payload is the actual content of a packet. It is delivered to the application.",
                        "difficulty": "Easy",
                        "topic": "General Networking"
                },
                {
                        "id": 150,
                        "question": "What is network reliability?",
                        "options": [
                                "Encryption method",
                                "Cable length",
                                "Ability to maintain service without failure",
                                "Speed only"
                        ],
                        "correct": 2,
                        "explanation": "Reliability ensures continuous network operation. Redundancy and failover improve it.",
                        "difficulty": "Medium",
                        "topic": "Network Models & Layers"
                }
        ],
        "oops": [
                {
                        "id": 1,
                        "question": "What is Object-Oriented Programming (OOP)?",
                        "options": [
                                "Programming using only functions",
                                "Programming using databases",
                                "Programming using hardware",
                                "Programming based on objects and classes"
                        ],
                        "correct": 3,
                        "explanation": "OOP organizes programs around objects that contain data and behavior. This approach improves modularity, reuse, and maintainability.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                },
                {
                        "id": 2,
                        "question": "Which of the following is a core principle of OOP?",
                        "options": [
                                "Compilation",
                                "Encapsulation",
                                "Execution",
                                "Linking"
                        ],
                        "correct": 1,
                        "explanation": "Encapsulation binds data and methods within a class. It protects internal state and enforces controlled access.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                },
                {
                        "id": 3,
                        "question": "What is a class?",
                        "options": [
                                "A function",
                                "Blueprint for creating objects",
                                "A variable",
                                "Instance of an object"
                        ],
                        "correct": 1,
                        "explanation": "A class defines attributes and behaviors that its objects will have. It acts as a template for object creation.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 4,
                        "question": "What is an object?",
                        "options": [
                                "Blueprint",
                                "Operator",
                                "Instance of a class",
                                "Function"
                        ],
                        "correct": 2,
                        "explanation": "An object is a real-world entity created from a class. It holds actual values for attributes defined in the class.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 5,
                        "question": "What is encapsulation?",
                        "options": [
                                "Hiding functions only",
                                "Creating multiple objects",
                                "Wrapping data and methods together",
                                "Destroying objects"
                        ],
                        "correct": 2,
                        "explanation": "Encapsulation combines data and methods into a single unit. It prevents unauthorized access and improves data security.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                },
                {
                        "id": 6,
                        "question": "What is inheritance?",
                        "options": [
                                "Acquiring properties from another class",
                                "Copying data",
                                "Deleting class",
                                "Creating variables"
                        ],
                        "correct": 0,
                        "explanation": "Inheritance allows a class to reuse attributes and methods of another class. It promotes code reuse and hierarchy.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                },
                {
                        "id": 7,
                        "question": "What is polymorphism?",
                        "options": [
                                "Single object",
                                "Data hiding",
                                "One interface, multiple implementations",
                                "Multiple classes"
                        ],
                        "correct": 2,
                        "explanation": "Polymorphism allows the same method to behave differently depending on context. It enhances flexibility and extensibility.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                },
                {
                        "id": 8,
                        "question": "What is abstraction?",
                        "options": [
                                "Deleting data",
                                "Copying objects",
                                "Hiding implementation details",
                                "Showing all details"
                        ],
                        "correct": 2,
                        "explanation": "Abstraction exposes only essential features while hiding complexity. It simplifies interaction with objects.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                },
                {
                        "id": 9,
                        "question": "Which access modifier restricts access to the same class only?",
                        "options": [
                                "Default",
                                "Protected",
                                "Public",
                                "Private"
                        ],
                        "correct": 3,
                        "explanation": "Private members are accessible only within the defining class. This ensures strict data hiding.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 10,
                        "question": "Which access modifier allows access everywhere?",
                        "options": [
                                "Public",
                                "Private",
                                "Default",
                                "Protected"
                        ],
                        "correct": 0,
                        "explanation": "Public members can be accessed from any part of the program. They define the class’s external interface.",
                        "difficulty": "Medium",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 11,
                        "question": "What is method overloading?",
                        "options": [
                                "Creating new classes",
                                "Multiple methods with same name but different parameters",
                                "Overwriting methods",
                                "Deleting methods"
                        ],
                        "correct": 1,
                        "explanation": "Method overloading allows methods to share the same name but differ in parameters. It improves readability and flexibility.",
                        "difficulty": "Medium",
                        "topic": "Advanced OOP"
                },
                {
                        "id": 12,
                        "question": "What is method overriding?",
                        "options": [
                                "Same method name in same class",
                                "Creating new method",
                                "Deleting parent method",
                                "Redefining parent class method in child class"
                        ],
                        "correct": 3,
                        "explanation": "Overriding allows a subclass to provide its own implementation. It supports runtime polymorphism.",
                        "difficulty": "Medium",
                        "topic": "Advanced OOP"
                },
                {
                        "id": 13,
                        "question": "Which concept supports code reuse?",
                        "options": [
                                "Polymorphism",
                                "Inheritance",
                                "Encapsulation",
                                "Abstraction"
                        ],
                        "correct": 1,
                        "explanation": "Inheritance allows new classes to reuse existing code. This reduces redundancy and improves maintainability.",
                        "difficulty": "Medium",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 14,
                        "question": "What is a constructor?",
                        "options": [
                                "Method to destroy objects",
                                "Special method to initialize objects",
                                "Variable declaration",
                                "Function outside class"
                        ],
                        "correct": 1,
                        "explanation": "Constructors initialize object state when created. They ensure objects start in a valid state.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 15,
                        "question": "What is a destructor?",
                        "options": [
                                "Method to override",
                                "Method to destroy objects",
                                "Method to copy objects",
                                "Method to initialize objects"
                        ],
                        "correct": 1,
                        "explanation": "Destructors release resources when an object is destroyed. They prevent memory leaks.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 16,
                        "question": "What is dynamic binding?",
                        "options": [
                                "Binding at compile time",
                                "Binding memory",
                                "Binding variables",
                                "Binding at runtime"
                        ],
                        "correct": 3,
                        "explanation": "Dynamic binding resolves method calls at runtime. It enables runtime polymorphism.",
                        "difficulty": "Medium",
                        "topic": "Advanced OOP"
                },
                {
                        "id": 17,
                        "question": "What is static binding?",
                        "options": [
                                "Binding at compile time",
                                "Binding at runtime",
                                "Binding objects",
                                "Binding memory"
                        ],
                        "correct": 0,
                        "explanation": "Static binding resolves method calls during compilation. It improves performance but reduces flexibility.",
                        "difficulty": "Medium",
                        "topic": "Advanced OOP"
                },
                {
                        "id": 18,
                        "question": "What is an abstract class?",
                        "options": [
                                "Class with only variables",
                                "Class without methods",
                                "Class without inheritance",
                                "Class that cannot be instantiated"
                        ],
                        "correct": 3,
                        "explanation": "Abstract classes define common behavior but cannot create objects. They are meant to be extended.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 19,
                        "question": "What is an interface?",
                        "options": [
                                "Constructor collection",
                                "Class with implementation",
                                "Collection of abstract methods",
                                "Variable collection"
                        ],
                        "correct": 2,
                        "explanation": "Interfaces define method signatures without implementation. They enable multiple inheritance of behavior.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 20,
                        "question": "Which concept allows multiple inheritance in Java?",
                        "options": [
                                "Objects",
                                "Constructors",
                                "Interfaces",
                                "Classes"
                        ],
                        "correct": 2,
                        "explanation": "Java supports multiple inheritance through interfaces. Classes can implement multiple interfaces.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                },
                {
                        "id": 21,
                        "question": "What is a base class?",
                        "options": [
                                "Parent class",
                                "Interface",
                                "Object",
                                "Child class"
                        ],
                        "correct": 0,
                        "explanation": "A base class provides properties and methods to derived classes. It supports inheritance.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 22,
                        "question": "What is a derived class?",
                        "options": [
                                "Parent class",
                                "Abstract class",
                                "Child class",
                                "Interface"
                        ],
                        "correct": 2,
                        "explanation": "A derived class inherits from a base class. It can extend or modify behavior.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 23,
                        "question": "What is object composition?",
                        "options": [
                                "Method overriding",
                                "Inheritance",
                                "Object containing other objects",
                                "Data hiding"
                        ],
                        "correct": 2,
                        "explanation": "Composition builds complex objects using simpler objects. It promotes flexibility over inheritance.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 24,
                        "question": "What is aggregation?",
                        "options": [
                                "Weak relationship between objects",
                                "Inheritance",
                                "Strong ownership",
                                "Method overloading"
                        ],
                        "correct": 0,
                        "explanation": "Aggregation represents a \"has-a\" relationship. Objects can exist independently.",
                        "difficulty": "Easy",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 25,
                        "question": "What is association?",
                        "options": [
                                "Strong ownership",
                                "Encapsulation",
                                "Relationship between objects",
                                "Inheritance"
                        ],
                        "correct": 2,
                        "explanation": "Association defines how objects relate to each other. It can be one-to-one or one-to-many.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 26,
                        "question": "What is cohesion?",
                        "options": [
                                "Degree of class independence",
                                "Data hiding",
                                "Degree to which elements belong together",
                                "Coupling measure"
                        ],
                        "correct": 2,
                        "explanation": "High cohesion means class elements are closely related. It improves maintainability.",
                        "difficulty": "Medium",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 27,
                        "question": "What is coupling?",
                        "options": [
                                "Degree of independence between classes",
                                "Degree of dependence between classes",
                                "Encapsulation",
                                "Data hiding"
                        ],
                        "correct": 1,
                        "explanation": "Coupling measures interdependence between modules. Low coupling improves flexibility.",
                        "difficulty": "Medium",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 28,
                        "question": "What is a virtual function (C++)?",
                        "options": [
                                "Function overridden in derived class",
                                "Function without body",
                                "Constructor",
                                "Static function"
                        ],
                        "correct": 0,
                        "explanation": "Virtual functions enable runtime polymorphism. They allow dynamic binding.",
                        "difficulty": "Medium",
                        "topic": "Advanced OOP"
                },
                {
                        "id": 29,
                        "question": "What is a pure virtual function?",
                        "options": [
                                "Static function",
                                "Constructor",
                                "Function with body",
                                "Function without implementation in base class"
                        ],
                        "correct": 3,
                        "explanation": "Pure virtual functions define interfaces in abstract classes. Derived classes must implement them.",
                        "difficulty": "Medium",
                        "topic": "Advanced OOP"
                },
                {
                        "id": 30,
                        "question": "What is method hiding?",
                        "options": [
                                "Encapsulation",
                                "Overriding",
                                "Child class defining method with same name",
                                "Abstraction"
                        ],
                        "correct": 2,
                        "explanation": "Method hiding occurs when a subclass defines a method with the same name. It hides the parent method.",
                        "difficulty": "Medium",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 31,
                        "question": "What is late binding?",
                        "options": [
                                "Early binding",
                                "Runtime binding",
                                "Compile-time binding",
                                "Static binding"
                        ],
                        "correct": 1,
                        "explanation": "Late binding resolves method calls during execution. It enables polymorphism.",
                        "difficulty": "Easy",
                        "topic": "Advanced OOP"
                },
                {
                        "id": 32,
                        "question": "What is early binding?",
                        "options": [
                                "Runtime binding",
                                "Compile-time binding",
                                "Dynamic binding",
                                "Late binding"
                        ],
                        "correct": 1,
                        "explanation": "Early binding occurs at compile time. It is faster but less flexible.",
                        "difficulty": "Easy",
                        "topic": "Advanced OOP"
                },
                {
                        "id": 33,
                        "question": "What is a friend function (C++)?",
                        "options": [
                                "Public function",
                                "Constructor",
                                "Static method",
                                "Function accessing private members"
                        ],
                        "correct": 3,
                        "explanation": "Friend functions can access private data of a class. They are declared using the friend keyword.",
                        "difficulty": "Medium",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 34,
                        "question": "What is a static member?",
                        "options": [
                                "Belongs to object",
                                "Local variable",
                                "Constructor",
                                "Belongs to class"
                        ],
                        "correct": 3,
                        "explanation": "Static members are shared by all objects. They belong to the class rather than instances.",
                        "difficulty": "Medium",
                        "topic": "Advanced OOP"
                },
                {
                        "id": 35,
                        "question": "What is a singleton class?",
                        "options": [
                                "Interface",
                                "Abstract class",
                                "Class allowing only one object",
                                "Class with many objects"
                        ],
                        "correct": 2,
                        "explanation": "Singleton restricts instantiation to one object. It ensures a single shared instance.",
                        "difficulty": "Medium",
                        "topic": "Design Patterns"
                },
                {
                        "id": 36,
                        "question": "What is the \"this\" keyword?",
                        "options": [
                                "Refers to current object",
                                "Refers to static member",
                                "Refers to constructor",
                                "Refers to parent class"
                        ],
                        "correct": 0,
                        "explanation": "this refers to the current instance of the class. It distinguishes instance variables from parameters.",
                        "difficulty": "Medium",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 37,
                        "question": "What is super keyword (Java)?",
                        "options": [
                                "Refers to current class",
                                "Refers to object",
                                "Refers to parent class",
                                "Refers to interface"
                        ],
                        "correct": 2,
                        "explanation": "super accesses parent class members. It is used in inheritance.",
                        "difficulty": "Easy",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 38,
                        "question": "What is operator overloading?",
                        "options": [
                                "Hiding operators",
                                "Redefining operators for objects",
                                "Deleting operators",
                                "Creating operators"
                        ],
                        "correct": 1,
                        "explanation": "Operator overloading allows operators to work with user-defined types. It improves readability.",
                        "difficulty": "Medium",
                        "topic": "Advanced OOP"
                },
                {
                        "id": 39,
                        "question": "What is multiple inheritance?",
                        "options": [
                                "No inheritance",
                                "Single class",
                                "One parent class",
                                "Inheriting from multiple classes"
                        ],
                        "correct": 3,
                        "explanation": "Multiple inheritance allows a class to inherit from multiple parents. Some languages support it directly.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                },
                {
                        "id": 40,
                        "question": "What is hierarchical inheritance?",
                        "options": [
                                "Multiple parents",
                                "Multiple child classes from one parent",
                                "No inheritance",
                                "Single child"
                        ],
                        "correct": 1,
                        "explanation": "Hierarchical inheritance allows one base class to have multiple derived classes. It promotes reuse.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                },
                {
                        "id": 41,
                        "question": "What is multilevel inheritance?",
                        "options": [
                                "One parent multiple children",
                                "No inheritance",
                                "Chain of inheritance",
                                "Multiple parents"
                        ],
                        "correct": 2,
                        "explanation": "Multilevel inheritance forms a chain of classes. Each class derives from the previous one.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                },
                {
                        "id": 42,
                        "question": "What is hybrid inheritance?",
                        "options": [
                                "No inheritance",
                                "Single inheritance",
                                "Interface only",
                                "Combination of multiple inheritance types"
                        ],
                        "correct": 3,
                        "explanation": "Hybrid inheritance combines multiple inheritance forms. It supports complex relationships.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                },
                {
                        "id": 43,
                        "question": "What is object slicing (C++)?",
                        "options": [
                                "Cutting objects",
                                "Deleting objects",
                                "Copying objects",
                                "Losing derived class data when assigned to base object"
                        ],
                        "correct": 3,
                        "explanation": "Object slicing occurs when derived objects are assigned to base objects. Derived-specific data is lost.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 44,
                        "question": "What is a copy constructor?",
                        "options": [
                                "Deletes object",
                                "Static method",
                                "Initializes object",
                                "Creates object from another object"
                        ],
                        "correct": 3,
                        "explanation": "Copy constructors create new objects as copies of existing ones. They ensure proper duplication.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 45,
                        "question": "What is deep copy?",
                        "options": [
                                "Copying references",
                                "Shallow copy",
                                "Copying actual data",
                                "Memory deletion"
                        ],
                        "correct": 2,
                        "explanation": "Deep copy duplicates the actual data. It prevents shared references.",
                        "difficulty": "Easy",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 46,
                        "question": "What is shallow copy?",
                        "options": [
                                "Copying references only",
                                "Deep copy",
                                "Copying actual data",
                                "Memory allocation"
                        ],
                        "correct": 0,
                        "explanation": "Shallow copy copies references, not actual data. Changes affect both objects.",
                        "difficulty": "Easy",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 47,
                        "question": "What is polymorphic variable?",
                        "options": [
                                "Variable holding one type",
                                "Local variable",
                                "Variable holding multiple types",
                                "Static variable"
                        ],
                        "correct": 2,
                        "explanation": "Polymorphic variables can refer to different object types. They enable dynamic behavior.",
                        "difficulty": "Medium",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 48,
                        "question": "What is object lifecycle?",
                        "options": [
                                "Object creation to destruction",
                                "Memory allocation",
                                "Only creation",
                                "Only destruction"
                        ],
                        "correct": 0,
                        "explanation": "Object lifecycle includes creation, usage, and destruction. Proper management prevents resource leaks.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 49,
                        "question": "What is dependency injection?",
                        "options": [
                                "Encapsulation",
                                "Providing dependencies externally",
                                "Inheritance",
                                "Creating objects internally"
                        ],
                        "correct": 1,
                        "explanation": "Dependency injection supplies required objects from outside. It improves modularity and testing.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 52,
                        "question": "What is the Open/Closed Principle?",
                        "options": [
                                "Classes should be open for modification",
                                "Classes should be open for extension but closed for modification",
                                "Classes should be private",
                                "Classes should be closed for extension"
                        ],
                        "correct": 1,
                        "explanation": "This principle encourages extending behavior without altering existing code. It helps prevent bugs in stable code.",
                        "difficulty": "Medium",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 53,
                        "question": "What is the Liskov Substitution Principle?",
                        "options": [
                                "Subclasses should be replaceable for their base classes",
                                "Subclasses cannot replace base classes",
                                "Base classes replace subclasses",
                                "Classes should not inherit"
                        ],
                        "correct": 0,
                        "explanation": "Subclasses must behave in ways expected of the base class. Violations lead to unpredictable behavior.",
                        "difficulty": "Medium",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 54,
                        "question": "What is the Interface Segregation Principle?",
                        "options": [
                                "Interfaces should contain variables only",
                                "Interfaces should be private",
                                "One large interface is better",
                                "Clients should not depend on unused methods"
                        ],
                        "correct": 3,
                        "explanation": "Small, specific interfaces prevent unnecessary dependencies. This improves modularity.",
                        "difficulty": "Medium",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 55,
                        "question": "What is the Dependency Inversion Principle?",
                        "options": [
                                "Both depend on abstractions",
                                "Low-level modules depend on high-level modules",
                                "Modules should be tightly coupled",
                                "High-level modules depend on low-level modules"
                        ],
                        "correct": 0,
                        "explanation": "Both high- and low-level modules depend on abstractions. This reduces coupling and increases flexibility.",
                        "difficulty": "Medium",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 56,
                        "question": "What is tight coupling?",
                        "options": [
                                "Loose relationships",
                                "Modules highly dependent on each other",
                                "No dependencies",
                                "Modules independent"
                        ],
                        "correct": 1,
                        "explanation": "Tight coupling makes code harder to maintain. Changes in one module affect others.",
                        "difficulty": "Medium",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 57,
                        "question": "What is loose coupling?",
                        "options": [
                                "Modules dependent",
                                "No classes",
                                "No interfaces",
                                "Modules independent"
                        ],
                        "correct": 3,
                        "explanation": "Loose coupling minimizes dependencies between modules. It improves flexibility and maintainability.",
                        "difficulty": "Medium",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 58,
                        "question": "What is a design pattern?",
                        "options": [
                                "Reusable solution to common problem",
                                "Hardware model",
                                "Code error",
                                "Programming language"
                        ],
                        "correct": 0,
                        "explanation": "Design patterns provide proven solutions to recurring problems. They improve code quality and communication.",
                        "difficulty": "Medium",
                        "topic": "Design Patterns"
                },
                {
                        "id": 59,
                        "question": "Which pattern ensures only one instance exists?",
                        "options": [
                                "Factory",
                                "Singleton",
                                "Strategy",
                                "Observer"
                        ],
                        "correct": 1,
                        "explanation": "Singleton restricts class instantiation to one object. It ensures controlled access to shared resources.",
                        "difficulty": "Medium",
                        "topic": "Design Patterns"
                },
                {
                        "id": 60,
                        "question": "Which pattern creates objects without exposing instantiation logic?",
                        "options": [
                                "Adapter",
                                "Singleton",
                                "Observer",
                                "Factory"
                        ],
                        "correct": 3,
                        "explanation": "Factory pattern delegates object creation to a method. It promotes flexibility and decoupling.",
                        "difficulty": "Medium",
                        "topic": "Design Patterns"
                },
                {
                        "id": 61,
                        "question": "What is the Observer pattern used for?",
                        "options": [
                                "Notifying dependent objects of state changes",
                                "Creating objects",
                                "Memory allocation",
                                "Encrypting data"
                        ],
                        "correct": 0,
                        "explanation": "Observer pattern establishes a one-to-many relationship. Observers update automatically when the subject changes.",
                        "difficulty": "Medium",
                        "topic": "Design Patterns"
                },
                {
                        "id": 62,
                        "question": "What is the Strategy pattern?",
                        "options": [
                                "Handling exceptions",
                                "Encapsulating algorithms",
                                "Creating objects",
                                "Managing memory"
                        ],
                        "correct": 1,
                        "explanation": "Strategy pattern allows selecting algorithms at runtime. It promotes flexibility.",
                        "difficulty": "Medium",
                        "topic": "Design Patterns"
                },
                {
                        "id": 63,
                        "question": "What is the Adapter pattern?",
                        "options": [
                                "Managing threads",
                                "Creating objects",
                                "Changing interface compatibility",
                                "Handling exceptions"
                        ],
                        "correct": 2,
                        "explanation": "Adapter converts one interface into another. It enables incompatible classes to work together.",
                        "difficulty": "Medium",
                        "topic": "Design Patterns"
                },
                {
                        "id": 64,
                        "question": "What is the Decorator pattern?",
                        "options": [
                                "Managing memory",
                                "Removing features",
                                "Adding behavior dynamically",
                                "Deleting objects"
                        ],
                        "correct": 2,
                        "explanation": "Decorator adds new functionality without modifying the original class. It supports open/closed principle.",
                        "difficulty": "Medium",
                        "topic": "Design Patterns"
                },
                {
                        "id": 65,
                        "question": "What is composition over inheritance?",
                        "options": [
                                "Always use inheritance",
                                "Avoid classes",
                                "Use only interfaces",
                                "Prefer using objects within objects"
                        ],
                        "correct": 3,
                        "explanation": "Composition provides flexibility and avoids rigid hierarchies. It promotes reuse.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                },
                {
                        "id": 66,
                        "question": "What is a sealed class?",
                        "options": [
                                "Class without methods",
                                "Abstract class",
                                "Class without variables",
                                "Class that cannot be inherited"
                        ],
                        "correct": 3,
                        "explanation": "Sealed classes prevent inheritance. They control class hierarchy.",
                        "difficulty": "Easy",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 67,
                        "question": "What is a final class (Java)?",
                        "options": [
                                "Cannot be inherited",
                                "Cannot contain variables",
                                "Cannot be instantiated",
                                "Cannot contain methods"
                        ],
                        "correct": 0,
                        "explanation": "Final classes cannot be extended. This ensures security and immutability.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 68,
                        "question": "What is immutability?",
                        "options": [
                                "Object cannot change after creation",
                                "Object can change state",
                                "Object copying",
                                "Object deletion"
                        ],
                        "correct": 0,
                        "explanation": "Immutable objects maintain a constant state. They improve thread safety.",
                        "difficulty": "Easy",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 69,
                        "question": "What is method chaining?",
                        "options": [
                                "Hiding methods",
                                "Calling methods in sequence on same object",
                                "Overloading methods",
                                "Overriding methods"
                        ],
                        "correct": 1,
                        "explanation": "Method chaining improves readability. Each method returns the object itself.",
                        "difficulty": "Medium",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 70,
                        "question": "What is a fluent interface?",
                        "options": [
                                "Interface with many methods",
                                "Interface allowing method chaining",
                                "Abstract interface",
                                "Static interface"
                        ],
                        "correct": 1,
                        "explanation": "Fluent interfaces use method chaining for readable code. They improve usability.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 71,
                        "question": "What is object pooling?",
                        "options": [
                                "Copying objects",
                                "Reusing objects to reduce overhead",
                                "Creating many objects",
                                "Deleting objects"
                        ],
                        "correct": 1,
                        "explanation": "Object pooling reduces creation cost. It improves performance.",
                        "difficulty": "Easy",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 72,
                        "question": "What is a marker interface?",
                        "options": [
                                "Interface with no methods",
                                "Abstract class",
                                "Static interface",
                                "Interface with variables"
                        ],
                        "correct": 0,
                        "explanation": "Marker interfaces signal behavior to the compiler or runtime. Example: Serializable.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 73,
                        "question": "What is reflection?",
                        "options": [
                                "Encryption",
                                "Memory allocation",
                                "Copying objects",
                                "Inspecting classes at runtime"
                        ],
                        "correct": 3,
                        "explanation": "Reflection allows examining class structure at runtime. It supports dynamic programming.",
                        "difficulty": "Medium",
                        "topic": "Advanced OOP"
                },
                {
                        "id": 74,
                        "question": "What is dynamic dispatch?",
                        "options": [
                                "Static binding",
                                "Compile-time method call",
                                "Runtime method selection",
                                "Method hiding"
                        ],
                        "correct": 2,
                        "explanation": "Dynamic dispatch resolves overridden methods at runtime. It enables polymorphism.",
                        "difficulty": "Medium",
                        "topic": "Advanced OOP"
                },
                {
                        "id": 75,
                        "question": "What is a callback?",
                        "options": [
                                "Function passed as argument",
                                "Object copy",
                                "Static method",
                                "Constructor call"
                        ],
                        "correct": 0,
                        "explanation": "Callbacks allow functions to be executed later. They enable asynchronous behavior.",
                        "difficulty": "Medium",
                        "topic": "Advanced OOP"
                },
                {
                        "id": 76,
                        "question": "What is delegation?",
                        "options": [
                                "Inheritance",
                                "Method overriding",
                                "Object deletion",
                                "Passing responsibility to another object"
                        ],
                        "correct": 3,
                        "explanation": "Delegation allows one object to handle tasks for another. It promotes composition.",
                        "difficulty": "Medium",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 77,
                        "question": "What is an anonymous class?",
                        "options": [
                                "Class without methods",
                                "Abstract class",
                                "Class without variables",
                                "Class without name"
                        ],
                        "correct": 3,
                        "explanation": "Anonymous classes are declared without names. They are used for short-lived tasks.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 78,
                        "question": "What is lambda expression?",
                        "options": [
                                "Variable",
                                "Class definition",
                                "Anonymous function",
                                "Named function"
                        ],
                        "correct": 2,
                        "explanation": "Lambda expressions define functions inline. They support functional programming.",
                        "difficulty": "Medium",
                        "topic": "Advanced OOP"
                },
                {
                        "id": 79,
                        "question": "What is a mixin?",
                        "options": [
                                "Interface",
                                "Constructor",
                                "Base class",
                                "Class providing reusable functionality"
                        ],
                        "correct": 3,
                        "explanation": "Mixins add behavior to classes without inheritance. They promote reuse.",
                        "difficulty": "Easy",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 80,
                        "question": "What is multiple dispatch?",
                        "options": [
                                "Single method call",
                                "Overloading",
                                "Method selection based on multiple object types",
                                "Static binding"
                        ],
                        "correct": 2,
                        "explanation": "Multiple dispatch selects methods based on runtime types. It extends polymorphism.",
                        "difficulty": "Medium",
                        "topic": "Advanced OOP"
                },
                {
                        "id": 81,
                        "question": "What is covariance?",
                        "options": [
                                "Class change",
                                "Parameter change",
                                "Return type change in overridden method",
                                "Variable change"
                        ],
                        "correct": 2,
                        "explanation": "Covariance allows more specific return types. It improves flexibility.",
                        "difficulty": "Medium",
                        "topic": "Advanced OOP"
                },
                {
                        "id": 82,
                        "question": "What is contravariance?",
                        "options": [
                                "Parameter type generalization",
                                "Method hiding",
                                "Return type change",
                                "Variable deletion"
                        ],
                        "correct": 0,
                        "explanation": "Contravariance allows broader parameter types. It supports polymorphism.",
                        "difficulty": "Hard",
                        "topic": "Advanced OOP"
                },
                {
                        "id": 83,
                        "question": "What is object serialization?",
                        "options": [
                                "Encrypting objects",
                                "Deleting objects",
                                "Converting object to byte stream",
                                "Copying objects"
                        ],
                        "correct": 2,
                        "explanation": "Serialization converts objects into storable format. It enables persistence and transmission.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 84,
                        "question": "What is deserialization?",
                        "options": [
                                "Encrypting data",
                                "Converting byte stream back to object",
                                "Deleting object",
                                "Copying data"
                        ],
                        "correct": 1,
                        "explanation": "Deserialization restores objects from stored data. It reconstructs original state.",
                        "difficulty": "Medium",
                        "topic": "Advanced OOP"
                },
                {
                        "id": 85,
                        "question": "What is dependency injection benefit?",
                        "options": [
                                "Loose coupling and testability",
                                "Tight coupling",
                                "Slower performance",
                                "Memory leak"
                        ],
                        "correct": 0,
                        "explanation": "Dependency injection decouples classes. It improves testability and flexibility.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 86,
                        "question": "What is inversion of control?",
                        "options": [
                                "Static binding",
                                "Class controlling dependencies",
                                "Memory allocation",
                                "Framework controlling object flow"
                        ],
                        "correct": 3,
                        "explanation": "IoC shifts control from application to framework. It improves modular design.",
                        "difficulty": "Medium",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 87,
                        "question": "What is a service locator pattern?",
                        "options": [
                                "Finds services globally",
                                "Creates objects",
                                "Hides classes",
                                "Deletes objects"
                        ],
                        "correct": 0,
                        "explanation": "Service locator provides global access to services. It centralizes dependency retrieval.",
                        "difficulty": "Medium",
                        "topic": "Design Patterns"
                },
                {
                        "id": 88,
                        "question": "What is an anti-pattern?",
                        "options": [
                                "Poor solution to common problem",
                                "Good design",
                                "Design pattern",
                                "Programming language"
                        ],
                        "correct": 0,
                        "explanation": "Anti-patterns represent ineffective practices. Avoiding them improves code quality.",
                        "difficulty": "Medium",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 89,
                        "question": "What is code smell?",
                        "options": [
                                "Runtime error",
                                "Indicator of poor design",
                                "Syntax error",
                                "Compilation error"
                        ],
                        "correct": 1,
                        "explanation": "Code smells suggest potential problems. Refactoring improves maintainability.",
                        "difficulty": "Easy",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 90,
                        "question": "What is refactoring?",
                        "options": [
                                "Debugging only",
                                "Rewriting code without changing behavior",
                                "Adding features",
                                "Deleting code"
                        ],
                        "correct": 1,
                        "explanation": "Refactoring improves code structure. It enhances readability and maintainability.",
                        "difficulty": "Medium",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 91,
                        "question": "What is method extraction?",
                        "options": [
                                "Combining methods",
                                "Overriding methods",
                                "Deleting methods",
                                "Splitting method into smaller methods"
                        ],
                        "correct": 3,
                        "explanation": "Method extraction improves readability. It reduces complexity.",
                        "difficulty": "Easy",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 92,
                        "question": "What is cohesion vs coupling goal?",
                        "options": [
                                "Low cohesion, high coupling",
                                "No cohesion",
                                "High coupling, low cohesion",
                                "High cohesion, low coupling"
                        ],
                        "correct": 3,
                        "explanation": "High cohesion and low coupling improve maintainability. They create modular systems.",
                        "difficulty": "Medium",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 93,
                        "question": "What is class responsibility?",
                        "options": [
                                "Constructors",
                                "Tasks performed by class",
                                "Variables",
                                "Methods only"
                        ],
                        "correct": 1,
                        "explanation": "Responsibilities define class behavior. Clear responsibilities improve design.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 94,
                        "question": "What is domain model?",
                        "options": [
                                "Representation of real-world concepts",
                                "Network model",
                                "Database schema",
                                "UI model"
                        ],
                        "correct": 0,
                        "explanation": "Domain models represent real-world entities. They guide system design.",
                        "difficulty": "Easy",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 95,
                        "question": "What is a value object?",
                        "options": [
                                "Object defined by its values",
                                "Object with identity",
                                "Static object",
                                "Abstract object"
                        ],
                        "correct": 0,
                        "explanation": "Value objects are equal based on data. They are immutable.",
                        "difficulty": "Easy",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 96,
                        "question": "What is an entity object?",
                        "options": [
                                "Static object",
                                "Interface",
                                "Object without identity",
                                "Object with unique identity"
                        ],
                        "correct": 3,
                        "explanation": "Entity objects have unique identifiers. They represent persistent data.",
                        "difficulty": "Easy",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 97,
                        "question": "What is lazy initialization?",
                        "options": [
                                "Immediate object creation",
                                "Deleting object early",
                                "Copying object",
                                "Creating object when needed"
                        ],
                        "correct": 3,
                        "explanation": "Lazy initialization improves performance. Objects are created only when required.",
                        "difficulty": "Medium",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 98,
                        "question": "What is eager initialization?",
                        "options": [
                                "Delaying object creation",
                                "Copying object",
                                "Creating object when needed",
                                "Creating object immediately"
                        ],
                        "correct": 3,
                        "explanation": "Eager initialization creates objects at startup. It ensures availability but uses memory.",
                        "difficulty": "Medium",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 99,
                        "question": "What is thread safety in OOP?",
                        "options": [
                                "Data hiding",
                                "Safe object access in multithreading",
                                "Single-thread execution",
                                "Memory leak prevention"
                        ],
                        "correct": 1,
                        "explanation": "Thread-safe objects work correctly in concurrent environments. Synchronization ensures consistency.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                },
                {
                        "id": 102,
                        "question": "What is an object diagram?",
                        "options": [
                                "Shows class structure",
                                "Shows network topology",
                                "Shows database tables",
                                "Shows object instances at runtime"
                        ],
                        "correct": 3,
                        "explanation": "Object diagrams represent actual instances of classes at a given time. They help visualize runtime behavior.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 103,
                        "question": "What is UML?",
                        "options": [
                                "Universal Machine Language",
                                "Unified Modeling Language",
                                "User Model Language",
                                "Unified Machine Logic"
                        ],
                        "correct": 1,
                        "explanation": "UML is a standardized modeling language for designing software systems. It supports visualization of OOP concepts.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 104,
                        "question": "What is aggregation in UML represented by?",
                        "options": [
                                "Arrow",
                                "Hollow diamond",
                                "Filled diamond",
                                "Circle"
                        ],
                        "correct": 1,
                        "explanation": "Aggregation is shown using a hollow diamond. It indicates a weak “has-a” relationship.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 105,
                        "question": "What does a filled diamond represent in UML?",
                        "options": [
                                "Inheritance",
                                "Dependency",
                                "Composition",
                                "Association"
                        ],
                        "correct": 2,
                        "explanation": "Composition uses a filled diamond. It represents strong ownership where the child cannot exist independently.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 106,
                        "question": "What is association multiplicity?",
                        "options": [
                                "Number of classes",
                                "Number of methods",
                                "Number of variables",
                                "Number of instances in a relationship"
                        ],
                        "correct": 3,
                        "explanation": "Multiplicity defines how many objects participate in a relationship. Example: one-to-many.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 107,
                        "question": "What is dependency in UML?",
                        "options": [
                                "Strong ownership",
                                "Composition",
                                "Inheritance",
                                "Weak relationship where one class uses another"
                        ],
                        "correct": 3,
                        "explanation": "Dependency indicates that a class relies on another temporarily. It is represented by a dashed arrow.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 108,
                        "question": "What is encapsulation benefit?",
                        "options": [
                                "Increased coupling",
                                "Slower performance",
                                "Data protection and modularity",
                                "Increased complexity"
                        ],
                        "correct": 2,
                        "explanation": "Encapsulation hides internal data. It improves security and modular design.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                },
                {
                        "id": 109,
                        "question": "What is polymorphism advantage?",
                        "options": [
                                "Increased coupling",
                                "Flexibility and extensibility",
                                "Code duplication",
                                "Reduced readability"
                        ],
                        "correct": 1,
                        "explanation": "Polymorphism allows the same interface to support multiple behaviors. It simplifies code maintenance.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                },
                {
                        "id": 110,
                        "question": "What is abstraction advantage?",
                        "options": [
                                "Reduces complexity",
                                "Removes classes",
                                "Exposes implementation",
                                "Increases memory usage"
                        ],
                        "correct": 0,
                        "explanation": "Abstraction hides unnecessary details. It makes systems easier to understand and maintain.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                },
                {
                        "id": 111,
                        "question": "What is an interface default method (Java)?",
                        "options": [
                                "Static method",
                                "Abstract method",
                                "Method with implementation in interface",
                                "Constructor"
                        ],
                        "correct": 2,
                        "explanation": "Default methods allow interfaces to include implementation. They support backward compatibility.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 112,
                        "question": "What is a functional interface?",
                        "options": [
                                "Interface with many methods",
                                "Interface with one abstract method",
                                "Interface with variables",
                                "Interface without methods"
                        ],
                        "correct": 1,
                        "explanation": "Functional interfaces contain exactly one abstract method. They are used in lambda expressions.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 113,
                        "question": "What is multiple inheritance problem called?",
                        "options": [
                                "Diamond problem",
                                "Triangle problem",
                                "Square problem",
                                "Circle problem"
                        ],
                        "correct": 0,
                        "explanation": "The diamond problem occurs when a class inherits from two classes with a common base. It creates ambiguity.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                },
                {
                        "id": 114,
                        "question": "How does Java resolve the diamond problem?",
                        "options": [
                                "Abstract classes only",
                                "Multiple inheritance",
                                "Interfaces with default methods",
                                "Removing inheritance"
                        ],
                        "correct": 2,
                        "explanation": "Java uses interfaces and explicit method overrides. This avoids ambiguity.",
                        "difficulty": "Medium",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 115,
                        "question": "What is a mixin used for?",
                        "options": [
                                "Creating objects",
                                "Deleting classes",
                                "Removing methods",
                                "Adding reusable behavior"
                        ],
                        "correct": 3,
                        "explanation": "Mixins provide reusable functionality. They enhance composition.",
                        "difficulty": "Easy",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 116,
                        "question": "What is the builder pattern used for?",
                        "options": [
                                "Managing memory",
                                "Overriding methods",
                                "Deleting objects",
                                "Simplifying object creation"
                        ],
                        "correct": 3,
                        "explanation": "Builder pattern constructs complex objects step-by-step. It improves readability and flexibility.",
                        "difficulty": "Medium",
                        "topic": "Design Patterns"
                },
                {
                        "id": 117,
                        "question": "What is the prototype pattern?",
                        "options": [
                                "Creating objects using constructor",
                                "Deleting objects",
                                "Creating objects using cloning",
                                "Managing memory"
                        ],
                        "correct": 2,
                        "explanation": "Prototype pattern creates objects by copying existing ones. It avoids costly creation.",
                        "difficulty": "Medium",
                        "topic": "Design Patterns"
                },
                {
                        "id": 118,
                        "question": "What is the facade pattern?",
                        "options": [
                                "Multiple inheritance",
                                "Data hiding",
                                "Complex interface",
                                "Simplified interface to complex system"
                        ],
                        "correct": 3,
                        "explanation": "Facade provides a simple interface. It hides subsystem complexity.",
                        "difficulty": "Medium",
                        "topic": "Design Patterns"
                },
                {
                        "id": 119,
                        "question": "What is the command pattern?",
                        "options": [
                                "Creating objects",
                                "Encapsulating requests as objects",
                                "Managing memory",
                                "Handling exceptions"
                        ],
                        "correct": 1,
                        "explanation": "Command pattern encapsulates actions as objects. It enables undo/redo functionality.",
                        "difficulty": "Medium",
                        "topic": "Design Patterns"
                },
                {
                        "id": 120,
                        "question": "What is the mediator pattern?",
                        "options": [
                                "Inheritance",
                                "Central object managing communication",
                                "Encapsulation",
                                "Direct object communication"
                        ],
                        "correct": 1,
                        "explanation": "Mediator reduces direct dependencies between objects. It centralizes communication.",
                        "difficulty": "Medium",
                        "topic": "Design Patterns"
                },
                {
                        "id": 121,
                        "question": "What is the template method pattern?",
                        "options": [
                                "Defining algorithm structure in base class",
                                "Handling exceptions",
                                "Managing memory",
                                "Creating objects"
                        ],
                        "correct": 0,
                        "explanation": "Template method defines algorithm steps. Subclasses implement specific steps.",
                        "difficulty": "Medium",
                        "topic": "Design Patterns"
                },
                {
                        "id": 122,
                        "question": "What is the state pattern?",
                        "options": [
                                "Hiding methods",
                                "Changing object behavior based on state",
                                "Creating objects",
                                "Managing memory"
                        ],
                        "correct": 1,
                        "explanation": "State pattern allows objects to change behavior dynamically. It simplifies conditional logic.",
                        "difficulty": "Medium",
                        "topic": "Design Patterns"
                },
                {
                        "id": 123,
                        "question": "What is the chain of responsibility pattern?",
                        "options": [
                                "Managing memory",
                                "Passing request along handlers",
                                "Creating objects",
                                "Overriding methods"
                        ],
                        "correct": 1,
                        "explanation": "Requests pass through a chain of handlers. Each handler decides whether to process.",
                        "difficulty": "Medium",
                        "topic": "Design Patterns"
                },
                {
                        "id": 124,
                        "question": "What is the visitor pattern?",
                        "options": [
                                "Adding operations without modifying classes",
                                "Creating objects",
                                "Managing memory",
                                "Handling exceptions"
                        ],
                        "correct": 0,
                        "explanation": "Visitor allows adding new operations. It follows open/closed principle.",
                        "difficulty": "Medium",
                        "topic": "Design Patterns"
                },
                {
                        "id": 125,
                        "question": "What is a data transfer object (DTO)?",
                        "options": [
                                "Interface",
                                "Database table",
                                "Abstract class",
                                "Object transferring data between layers"
                        ],
                        "correct": 3,
                        "explanation": "DTOs carry data across system layers. They reduce method calls.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 126,
                        "question": "What is lazy loading?",
                        "options": [
                                "Copying data",
                                "Loading data only when needed",
                                "Loading all data at startup",
                                "Deleting data"
                        ],
                        "correct": 1,
                        "explanation": "Lazy loading improves performance. Data loads only when required.",
                        "difficulty": "Easy",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 127,
                        "question": "What is eager loading?",
                        "options": [
                                "Copying data",
                                "Deleting data",
                                "Loading data on demand",
                                "Loading data immediately"
                        ],
                        "correct": 3,
                        "explanation": "Eager loading fetches data upfront. It avoids repeated queries.",
                        "difficulty": "Easy",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 128,
                        "question": "What is an immutable class benefit?",
                        "options": [
                                "Memory leaks",
                                "High coupling",
                                "Easy modification",
                                "Thread safety"
                        ],
                        "correct": 3,
                        "explanation": "Immutable classes cannot change state. They are inherently thread-safe.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 129,
                        "question": "What is a mutable object?",
                        "options": [
                                "Cannot change state",
                                "Abstract object",
                                "Static object",
                                "Can change state after creation"
                        ],
                        "correct": 3,
                        "explanation": "Mutable objects allow state changes. They require careful synchronization.",
                        "difficulty": "Easy",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 130,
                        "question": "What is a record class (modern languages)?",
                        "options": [
                                "Interface",
                                "Class for immutable data",
                                "Abstract class",
                                "Mutable class"
                        ],
                        "correct": 1,
                        "explanation": "Record classes store immutable data. They reduce boilerplate code.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 131,
                        "question": "What is pattern matching in OOP?",
                        "options": [
                                "Memory allocation",
                                "Matching strings",
                                "Checking object types and structure",
                                "Encryption"
                        ],
                        "correct": 2,
                        "explanation": "Pattern matching simplifies type checking. It improves readability.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                },
                {
                        "id": 132,
                        "question": "What is object identity?",
                        "options": [
                                "Unique reference to object",
                                "Object method",
                                "Object value",
                                "Object variable"
                        ],
                        "correct": 0,
                        "explanation": "Object identity distinguishes instances. Even identical values may have different identities.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 133,
                        "question": "What is equality vs identity?",
                        "options": [
                                "Equality compares values, identity compares references",
                                "Same concept",
                                "Equality compares references",
                                "Identity compares values"
                        ],
                        "correct": 0,
                        "explanation": "Equality checks data equivalence. Identity checks if objects are the same instance.",
                        "difficulty": "Medium",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 134,
                        "question": "What is deep immutability?",
                        "options": [
                                "Static object",
                                "Object and nested objects immutable",
                                "Mutable object",
                                "Immutable reference only"
                        ],
                        "correct": 1,
                        "explanation": "Deep immutability ensures entire object graph cannot change. It improves reliability.",
                        "difficulty": "Medium",
                        "topic": "OOP Concepts"
                },
                {
                        "id": 135,
                        "question": "What is object cloning?",
                        "options": [
                                "Deleting object",
                                "Hiding object",
                                "Encrypting object",
                                "Creating duplicate object"
                        ],
                        "correct": 3,
                        "explanation": "Cloning creates a copy of an object. It can be shallow or deep.",
                        "difficulty": "Easy",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 136,
                        "question": "What is a class invariant?",
                        "options": [
                                "Condition that remains true for class",
                                "Variable value",
                                "Method override",
                                "Constructor"
                        ],
                        "correct": 0,
                        "explanation": "Class invariants define valid object states. They ensure consistency.",
                        "difficulty": "Easy",
                        "topic": "Classes & Objects"
                },
                {
                        "id": 137,
                        "question": "What is defensive programming in OOP?",
                        "options": [
                                "Ignoring errors",
                                "Deleting exceptions",
                                "Static binding",
                                "Writing code to handle unexpected inputs"
                        ],
                        "correct": 3,
                        "explanation": "Defensive programming anticipates errors. It improves robustness.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                },
                {
                        "id": 138,
                        "question": "What is exception handling role in OOP?",
                        "options": [
                                "Prevent errors",
                                "Manage runtime errors gracefully",
                                "Compile code",
                                "Allocate memory"
                        ],
                        "correct": 1,
                        "explanation": "Exception handling prevents program crashes. It ensures controlled error management.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                },
                {
                        "id": 139,
                        "question": "What is custom exception?",
                        "options": [
                                "Syntax error",
                                "User-defined exception class",
                                "Built-in exception",
                                "Runtime error"
                        ],
                        "correct": 1,
                        "explanation": "Custom exceptions represent specific errors. They improve clarity.",
                        "difficulty": "Easy",
                        "topic": "Advanced OOP"
                },
                {
                        "id": 140,
                        "question": "What is fail-fast principle?",
                        "options": [
                                "Delay errors",
                                "Hide errors",
                                "Detect errors early",
                                "Ignore errors"
                        ],
                        "correct": 2,
                        "explanation": "Fail-fast detects problems early. It prevents cascading failures.",
                        "difficulty": "Medium",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 141,
                        "question": "What is contract programming?",
                        "options": [
                                "Defining expectations between methods",
                                "Legal contract",
                                "Network contract",
                                "Database contract"
                        ],
                        "correct": 0,
                        "explanation": "Contracts define preconditions and postconditions. They ensure correctness.",
                        "difficulty": "Medium",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 142,
                        "question": "What is a mock object?",
                        "options": [
                                "Real object",
                                "Abstract class",
                                "Simulated object for testing",
                                "Interface"
                        ],
                        "correct": 2,
                        "explanation": "Mock objects simulate dependencies. They support unit testing.",
                        "difficulty": "Easy",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 143,
                        "question": "What is test-driven development (TDD)?",
                        "options": [
                                "Writing tests after code",
                                "Writing tests before code",
                                "Debugging only",
                                "No testing"
                        ],
                        "correct": 1,
                        "explanation": "TDD improves design and reliability. Tests guide implementation.",
                        "difficulty": "Medium",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 144,
                        "question": "What is SOLID goal?",
                        "options": [
                                "Faster execution",
                                "Network performance",
                                "Maintainable and scalable design",
                                "Memory optimization"
                        ],
                        "correct": 2,
                        "explanation": "SOLID principles improve code structure. They enhance scalability.",
                        "difficulty": "Medium",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 145,
                        "question": "What is DRY principle?",
                        "options": [
                                "Delete Repeated Yield",
                                "Don’t Repeat Yourself",
                                "Repeat code",
                                "Data Reuse Yield"
                        ],
                        "correct": 1,
                        "explanation": "DRY avoids duplication. It improves maintainability.",
                        "difficulty": "Medium",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 146,
                        "question": "What is YAGNI principle?",
                        "options": [
                                "Yield All Global Names Immediately",
                                "Your Application Gets New Interfaces",
                                "You Always Gain New Ideas",
                                "You Aren’t Gonna Need It"
                        ],
                        "correct": 3,
                        "explanation": "YAGNI discourages unnecessary features. It keeps design simple.",
                        "difficulty": "Medium",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 147,
                        "question": "What is KISS principle?",
                        "options": [
                                "Keep Interface Safe System",
                                "Keep Internal State Secure",
                                "Kill Invalid System States",
                                "Keep It Simple, Stupid"
                        ],
                        "correct": 3,
                        "explanation": "KISS promotes simplicity. Simple systems are easier to maintain.",
                        "difficulty": "Medium",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 148,
                        "question": "What is Law of Demeter?",
                        "options": [
                                "Classes should know everything",
                                "Use global variables",
                                "Objects should interact with close friends only",
                                "Avoid encapsulation"
                        ],
                        "correct": 2,
                        "explanation": "This law reduces coupling. Objects interact only with direct dependencies.",
                        "difficulty": "Hard",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 149,
                        "question": "What is cohesion improvement method?",
                        "options": [
                                "Increase coupling",
                                "Add unrelated features",
                                "Split large classes into focused ones",
                                "Remove methods"
                        ],
                        "correct": 2,
                        "explanation": "Smaller focused classes improve cohesion. They simplify maintenance.",
                        "difficulty": "Medium",
                        "topic": "Design & Best Practices"
                },
                {
                        "id": 150,
                        "question": "What is the ultimate goal of OOP?",
                        "options": [
                                "Improve modularity, reuse, and maintainability",
                                "Eliminate classes",
                                "Increase complexity",
                                "Reduce code readability"
                        ],
                        "correct": 0,
                        "explanation": "OOP promotes modular design and reuse. It helps build scalable and maintainable systems.",
                        "difficulty": "Medium",
                        "topic": "OOP Principles"
                }
        ],
        "web": [
                {
                        "id": 1,
                        "question": "What does HTML stand for?",
                        "options": [
                                "Hyper Transfer Markup Language",
                                "Hyperlink Text Management Language",
                                "Hyper Text Markup Language",
                                "High Text Machine Language"
                        ],
                        "correct": 2,
                        "explanation": "HTML structures web content using tags. It defines elements like headings, paragraphs, and links.",
                        "difficulty": "Easy",
                        "topic": "HTML"
                },
                {
                        "id": 2,
                        "question": "What is the role of CSS?",
                        "options": [
                                "Store data",
                                "Style and layout web pages",
                                "Structure web pages",
                                "Handle server logic"
                        ],
                        "correct": 1,
                        "explanation": "CSS controls visual presentation such as colors, fonts, and layout. It separates design from content.",
                        "difficulty": "Easy",
                        "topic": "CSS/Styling"
                },
                {
                        "id": 3,
                        "question": "Which language is used for client-side scripting?",
                        "options": [
                                "Java",
                                "JavaScript",
                                "Python",
                                "SQL"
                        ],
                        "correct": 1,
                        "explanation": "JavaScript runs in the browser. It adds interactivity to web pages.",
                        "difficulty": "Medium",
                        "topic": "JavaScript"
                },
                {
                        "id": 4,
                        "question": "What is the purpose of the <head> tag?",
                        "options": [
                                "Add images",
                                "Store metadata",
                                "Display content",
                                "Create forms"
                        ],
                        "correct": 1,
                        "explanation": "The <head> contains metadata like title, styles, and scripts. It does not display content directly.",
                        "difficulty": "Easy",
                        "topic": "HTML"
                },
                {
                        "id": 5,
                        "question": "Which HTML tag creates a hyperlink?",
                        "options": [
                                "<href>",
                                "<link>",
                                "<a>",
                                "<url>"
                        ],
                        "correct": 2,
                        "explanation": "The <a> tag defines hyperlinks. It uses the href attribute to specify the destination.",
                        "difficulty": "Easy",
                        "topic": "HTML"
                },
                {
                        "id": 6,
                        "question": "What is the default position of elements in CSS?",
                        "options": [
                                "Relative",
                                "Fixed",
                                "Static",
                                "Absolute"
                        ],
                        "correct": 2,
                        "explanation": "Static positioning is the default. Elements follow normal document flow.",
                        "difficulty": "Easy",
                        "topic": "CSS/Styling"
                },
                {
                        "id": 7,
                        "question": "Which CSS property changes text color?",
                        "options": [
                                "text-color",
                                "text-style",
                                "font-color",
                                "color"
                        ],
                        "correct": 3,
                        "explanation": "The color property sets text color. It accepts named colors, HEX, RGB, etc.",
                        "difficulty": "Medium",
                        "topic": "CSS/Styling"
                },
                {
                        "id": 8,
                        "question": "What is the DOM?",
                        "options": [
                                "Digital Output Mode",
                                "Data Object Model",
                                "Document Object Model",
                                "Display Object Method"
                        ],
                        "correct": 2,
                        "explanation": "DOM represents HTML as a tree structure. JavaScript manipulates it to update content dynamically.",
                        "difficulty": "Easy",
                        "topic": "HTML"
                },
                {
                        "id": 9,
                        "question": "Which HTTP method retrieves data?",
                        "options": [
                                "DELETE",
                                "GET",
                                "PUT",
                                "POST"
                        ],
                        "correct": 1,
                        "explanation": "GET requests fetch data from a server. They do not modify resources.",
                        "difficulty": "Medium",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 10,
                        "question": "Which HTTP method sends data to server?",
                        "options": [
                                "FETCH",
                                "GET",
                                "POST",
                                "CONNECT"
                        ],
                        "correct": 2,
                        "explanation": "POST sends data to the server for processing. It is commonly used in forms.",
                        "difficulty": "Medium",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 11,
                        "question": "What is responsive design?",
                        "options": [
                                "Fast loading pages",
                                "Server-side rendering",
                                "Database optimization",
                                "Design adapting to different screen sizes"
                        ],
                        "correct": 3,
                        "explanation": "Responsive design ensures websites work on phones, tablets, and desktops. CSS media queries enable this.",
                        "difficulty": "Medium",
                        "topic": "CSS/Styling"
                },
                {
                        "id": 12,
                        "question": "What is a media query?",
                        "options": [
                                "JavaScript function",
                                "CSS feature for responsive design",
                                "Database query",
                                "HTML tag"
                        ],
                        "correct": 1,
                        "explanation": "Media queries apply styles based on screen size or device. They enable responsive layouts.",
                        "difficulty": "Medium",
                        "topic": "CSS/Styling"
                },
                {
                        "id": 13,
                        "question": "Which tag is used for images?",
                        "options": [
                                "<img>",
                                "<image>",
                                "<pic>",
                                "<src>"
                        ],
                        "correct": 0,
                        "explanation": "The <img> tag embeds images. The src attribute specifies the image source.",
                        "difficulty": "Medium",
                        "topic": "HTML"
                },
                {
                        "id": 14,
                        "question": "What is the purpose of JavaScript?",
                        "options": [
                                "Adding interactivity",
                                "Styling pages",
                                "Managing servers",
                                "Storing data"
                        ],
                        "correct": 0,
                        "explanation": "JavaScript handles dynamic behavior like form validation and animations. It runs in browsers.",
                        "difficulty": "Easy",
                        "topic": "JavaScript"
                },
                {
                        "id": 15,
                        "question": "Which keyword declares a variable in JavaScript?",
                        "options": [
                                "declare",
                                "int",
                                "define",
                                "var"
                        ],
                        "correct": 3,
                        "explanation": "var, let, and const declare variables. var is function-scoped.",
                        "difficulty": "Medium",
                        "topic": "JavaScript"
                },
                {
                        "id": 16,
                        "question": "What is let in JavaScript?",
                        "options": [
                                "Block-scoped variable",
                                "Constant variable",
                                "Function name",
                                "Global variable"
                        ],
                        "correct": 0,
                        "explanation": "let is block-scoped. It prevents scope-related bugs.",
                        "difficulty": "Easy",
                        "topic": "JavaScript"
                },
                {
                        "id": 17,
                        "question": "What is const used for?",
                        "options": [
                                "Mutable variable",
                                "Loop control",
                                "Constant variable",
                                "Function declaration"
                        ],
                        "correct": 2,
                        "explanation": "const declares variables that cannot be reassigned. It improves code safety.",
                        "difficulty": "Easy",
                        "topic": "JavaScript"
                },
                {
                        "id": 18,
                        "question": "What is an event in JavaScript?",
                        "options": [
                                "Error",
                                "Variable",
                                "User interaction or browser action",
                                "Function"
                        ],
                        "correct": 2,
                        "explanation": "Events include clicks, keypresses, and loads. JavaScript responds using event listeners.",
                        "difficulty": "Medium",
                        "topic": "JavaScript"
                },
                {
                        "id": 19,
                        "question": "What is an API?",
                        "options": [
                                "Advanced Programming Input",
                                "Application Process Interface",
                                "Application Programming Interface",
                                "Automated Process Integration"
                        ],
                        "correct": 2,
                        "explanation": "APIs allow communication between software systems. Web APIs enable client-server interaction.",
                        "difficulty": "Medium",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 20,
                        "question": "What is JSON?",
                        "options": [
                                "JavaScript Output Name",
                                "Java Source Object Notation",
                                "JavaScript Object Notation",
                                "Java Syntax Object Network"
                        ],
                        "correct": 2,
                        "explanation": "JSON is a lightweight data format. It is used for data exchange in web apps.",
                        "difficulty": "Easy",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 21,
                        "question": "What is AJAX?",
                        "options": [
                                "Automatic Java and XML",
                                "Asynchronous JavaScript and XML",
                                "Advanced JSON Access",
                                "Application Java Access"
                        ],
                        "correct": 1,
                        "explanation": "AJAX allows asynchronous server communication. It updates pages without reload.",
                        "difficulty": "Easy",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 22,
                        "question": "What is a framework?",
                        "options": [
                                "Hardware component",
                                "Prebuilt structure for development",
                                "Programming language",
                                "Database"
                        ],
                        "correct": 1,
                        "explanation": "Frameworks provide reusable code and structure. Examples include React and Angular.",
                        "difficulty": "Medium",
                        "topic": "General Web Dev"
                },
                {
                        "id": 23,
                        "question": "What is a library in web development?",
                        "options": [
                                "Collection of reusable functions",
                                "Database",
                                "Server",
                                "Programming language"
                        ],
                        "correct": 0,
                        "explanation": "Libraries provide reusable code. Developers call them as needed.",
                        "difficulty": "Medium",
                        "topic": "General Web Dev"
                },
                {
                        "id": 24,
                        "question": "What is Bootstrap?",
                        "options": [
                                "CSS framework",
                                "Server",
                                "Database",
                                "JavaScript engine"
                        ],
                        "correct": 0,
                        "explanation": "Bootstrap provides prebuilt CSS components. It speeds up responsive design.",
                        "difficulty": "Easy",
                        "topic": "CSS/Styling"
                },
                {
                        "id": 25,
                        "question": "What is Node.js?",
                        "options": [
                                "Browser",
                                "CSS framework",
                                "Database",
                                "JavaScript runtime environment"
                        ],
                        "correct": 3,
                        "explanation": "Node.js runs JavaScript on the server. It enables full-stack JavaScript development.",
                        "difficulty": "Medium",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 26,
                        "question": "What is npm?",
                        "options": [
                                "Node Package Manager",
                                "New Programming Method",
                                "Network Package Module",
                                "Node Processing Manager"
                        ],
                        "correct": 0,
                        "explanation": "npm manages JavaScript packages. It installs dependencies.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 27,
                        "question": "What is REST?",
                        "options": [
                                "Remote Execution State Transfer",
                                "Representational State Transfer",
                                "Random Execution State Transfer",
                                "Rapid Execution Service Transfer"
                        ],
                        "correct": 1,
                        "explanation": "REST defines web service architecture. It uses HTTP methods.",
                        "difficulty": "Easy",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 28,
                        "question": "What is a cookie?",
                        "options": [
                                "Server error",
                                "CSS file",
                                "Small data stored in browser",
                                "Database record"
                        ],
                        "correct": 2,
                        "explanation": "Cookies store session data. They help maintain user state.",
                        "difficulty": "Easy",
                        "topic": "Data & Storage"
                },
                {
                        "id": 29,
                        "question": "What is localStorage?",
                        "options": [
                                "Server storage",
                                "Session memory",
                                "Browser storage for persistent data",
                                "Database"
                        ],
                        "correct": 2,
                        "explanation": "localStorage stores data in the browser. Data persists after closing the tab.",
                        "difficulty": "Easy",
                        "topic": "Data & Storage"
                },
                {
                        "id": 30,
                        "question": "What is sessionStorage?",
                        "options": [
                                "Database",
                                "Temporary storage per session",
                                "Permanent storage",
                                "Server storage"
                        ],
                        "correct": 1,
                        "explanation": "sessionStorage stores data for a single session. It clears when the tab closes.",
                        "difficulty": "Medium",
                        "topic": "Data & Storage"
                },
                {
                        "id": 31,
                        "question": "What is SEO?",
                        "options": [
                                "Site Engine Output",
                                "Secure Execution Order",
                                "Server Execution Operation",
                                "Search Engine Optimization"
                        ],
                        "correct": 3,
                        "explanation": "SEO improves website visibility. It optimizes content for search engines.",
                        "difficulty": "Easy",
                        "topic": "Web Concepts"
                },
                {
                        "id": 32,
                        "question": "What is a CDN?",
                        "options": [
                                "Code Deployment Network",
                                "Client Data Network",
                                "Content Delivery Network",
                                "Central Data Node"
                        ],
                        "correct": 2,
                        "explanation": "CDNs deliver content from nearby servers. They improve performance.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 33,
                        "question": "What is HTTPS?",
                        "options": [
                                "Secure HTTP",
                                "High Transfer Protocol",
                                "Hyper Transfer Protocol",
                                "Host Transfer Protocol"
                        ],
                        "correct": 0,
                        "explanation": "HTTPS encrypts data using SSL/TLS. It ensures secure communication.",
                        "difficulty": "Easy",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 34,
                        "question": "What is CORS?",
                        "options": [
                                "Core Object Request Service",
                                "Cross Output Rendering System",
                                "Cross-Origin Resource Sharing",
                                "Client-Origin Request Service"
                        ],
                        "correct": 2,
                        "explanation": "CORS allows controlled cross-origin requests. It enhances security.",
                        "difficulty": "Hard",
                        "topic": "Security & DevOps"
                },
                {
                        "id": 35,
                        "question": "What is a SPA?",
                        "options": [
                                "Static Page Application",
                                "Secure Page Access",
                                "Server Page Application",
                                "Single Page Application"
                        ],
                        "correct": 3,
                        "explanation": "SPAs load a single page and update dynamically. They improve user experience.",
                        "difficulty": "Easy",
                        "topic": "Web Concepts"
                },
                {
                        "id": 36,
                        "question": "What is a progressive web app (PWA)?",
                        "options": [
                                "Desktop app",
                                "Web app with native app features",
                                "Database app",
                                "Server app"
                        ],
                        "correct": 1,
                        "explanation": "PWAs work offline and can be installed. They combine web and mobile features.",
                        "difficulty": "Medium",
                        "topic": "Web Concepts"
                },
                {
                        "id": 37,
                        "question": "What is version control?",
                        "options": [
                                "Database storage",
                                "Code editing",
                                "Server management",
                                "Tracking code changes"
                        ],
                        "correct": 3,
                        "explanation": "Version control tracks code history. Git is a popular tool.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 38,
                        "question": "What is Git?",
                        "options": [
                                "Database",
                                "Version control system",
                                "Framework",
                                "Programming language"
                        ],
                        "correct": 1,
                        "explanation": "Git tracks code changes and collaboration. It enables branching and merging.",
                        "difficulty": "Easy",
                        "topic": "Security & DevOps"
                },
                {
                        "id": 39,
                        "question": "What is GitHub?",
                        "options": [
                                "Local repository",
                                "Remote repository hosting",
                                "Framework",
                                "Database"
                        ],
                        "correct": 1,
                        "explanation": "GitHub hosts Git repositories. It supports collaboration.",
                        "difficulty": "Easy",
                        "topic": "Security & DevOps"
                },
                {
                        "id": 40,
                        "question": "What is deployment?",
                        "options": [
                                "Debugging code",
                                "Designing UI",
                                "Publishing application to server",
                                "Writing code"
                        ],
                        "correct": 2,
                        "explanation": "Deployment makes apps available to users. It involves servers and hosting.",
                        "difficulty": "Easy",
                        "topic": "Security & DevOps"
                },
                {
                        "id": 41,
                        "question": "What is web hosting?",
                        "options": [
                                "Running JavaScript",
                                "Writing HTML",
                                "Storing website files on server",
                                "Designing CSS"
                        ],
                        "correct": 2,
                        "explanation": "Hosting stores website files online. Users access them via domain.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 42,
                        "question": "What is a domain name?",
                        "options": [
                                "IP address",
                                "Server",
                                "Database",
                                "Human-readable website address"
                        ],
                        "correct": 3,
                        "explanation": "Domain names map to IP addresses. They make websites easy to access.",
                        "difficulty": "Easy",
                        "topic": "HTML"
                },
                {
                        "id": 43,
                        "question": "What is DNS?",
                        "options": [
                                "Domain Network Security",
                                "Domain Name System",
                                "Data Network Service",
                                "Digital Name Server"
                        ],
                        "correct": 1,
                        "explanation": "DNS translates domain names into IP addresses. It enables web navigation.",
                        "difficulty": "Easy",
                        "topic": "Web Concepts"
                },
                {
                        "id": 44,
                        "question": "What is a web server?",
                        "options": [
                                "Software serving web content",
                                "Programming language",
                                "Browser",
                                "Database"
                        ],
                        "correct": 0,
                        "explanation": "Web servers handle HTTP requests. Examples include Apache and Nginx.",
                        "difficulty": "Easy",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 45,
                        "question": "What is a browser?",
                        "options": [
                                "Programming language",
                                "Database",
                                "Server software",
                                "Client software to access websites"
                        ],
                        "correct": 3,
                        "explanation": "Browsers render web pages. Examples include Chrome and Firefox.",
                        "difficulty": "Easy",
                        "topic": "Web Concepts"
                },
                {
                        "id": 46,
                        "question": "What is HTML semantic tag?",
                        "options": [
                                "JavaScript tag",
                                "CSS tag",
                                "Tag describing content meaning",
                                "Tag without meaning"
                        ],
                        "correct": 2,
                        "explanation": "Semantic tags like <article> improve accessibility. They describe content purpose.",
                        "difficulty": "Easy",
                        "topic": "HTML"
                },
                {
                        "id": 47,
                        "question": "What is flexbox used for?",
                        "options": [
                                "HTML tag",
                                "Database layout",
                                "CSS layout system",
                                "JavaScript function"
                        ],
                        "correct": 2,
                        "explanation": "Flexbox aligns and distributes space in layouts. It simplifies responsive design.",
                        "difficulty": "Medium",
                        "topic": "CSS/Styling"
                },
                {
                        "id": 48,
                        "question": "What is grid in CSS?",
                        "options": [
                                "JavaScript layout",
                                "Database grid",
                                "HTML structure",
                                "Two-dimensional layout system"
                        ],
                        "correct": 3,
                        "explanation": "CSS Grid handles rows and columns. It enables complex layouts.",
                        "difficulty": "Easy",
                        "topic": "CSS/Styling"
                },
                {
                        "id": 49,
                        "question": "What is a promise in JavaScript?",
                        "options": [
                                "Variable",
                                "Function",
                                "Loop",
                                "Object representing future result"
                        ],
                        "correct": 3,
                        "explanation": "Promises handle asynchronous operations. They improve code readability.",
                        "difficulty": "Medium",
                        "topic": "JavaScript"
                },
                {
                        "id": 52,
                        "question": "Which attribute specifies where to send form data?",
                        "options": [
                                "action",
                                "target",
                                "name",
                                "method"
                        ],
                        "correct": 0,
                        "explanation": "The action attribute defines the URL where form data is sent. It connects the frontend to backend processing.",
                        "difficulty": "Medium",
                        "topic": "HTML"
                },
                {
                        "id": 53,
                        "question": "Which HTTP method is commonly used for form submission?",
                        "options": [
                                "GET",
                                "POST",
                                "PATCH",
                                "PUT"
                        ],
                        "correct": 1,
                        "explanation": "POST sends form data securely in the request body. It is used when modifying server data.",
                        "difficulty": "Medium",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 54,
                        "question": "What is the purpose of the method attribute in forms?",
                        "options": [
                                "Defines CSS style",
                                "Defines layout",
                                "Adds JavaScript",
                                "Specifies HTTP method"
                        ],
                        "correct": 3,
                        "explanation": "The method attribute determines how data is sent. Common values are GET and POST.",
                        "difficulty": "Easy",
                        "topic": "HTML"
                },
                {
                        "id": 55,
                        "question": "What is the difference between GET and POST?",
                        "options": [
                                "POST sends data in URL",
                                "GET sends data in URL, POST in body",
                                "GET sends data in body",
                                "No difference"
                        ],
                        "correct": 1,
                        "explanation": "GET appends data to URL, making it visible. POST sends data in the request body, improving security.",
                        "difficulty": "Easy",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 56,
                        "question": "What is a query string?",
                        "options": [
                                "CSS rule",
                                "JavaScript function",
                                "Data appended to URL",
                                "Database query"
                        ],
                        "correct": 2,
                        "explanation": "Query strings contain key-value pairs in URLs. They are used in GET requests.",
                        "difficulty": "Medium",
                        "topic": "General Web Dev"
                },
                {
                        "id": 57,
                        "question": "What is the purpose of <label> tag?",
                        "options": [
                                "Style input",
                                "Add image",
                                "Submit form",
                                "Provide text for input field"
                        ],
                        "correct": 3,
                        "explanation": "Labels improve accessibility. They associate text with form inputs.",
                        "difficulty": "Easy",
                        "topic": "HTML"
                },
                {
                        "id": 58,
                        "question": "What is the <input type=\"password\"> used for?",
                        "options": [
                                "Hide user input",
                                "Display text",
                                "Show images",
                                "Submit form"
                        ],
                        "correct": 0,
                        "explanation": "Password inputs mask characters. This enhances security.",
                        "difficulty": "Easy",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 59,
                        "question": "What is client-side validation?",
                        "options": [
                                "Validation in browser",
                                "Validation on server",
                                "Network validation",
                                "Database validation"
                        ],
                        "correct": 0,
                        "explanation": "Client-side validation checks input before submission. It improves user experience.",
                        "difficulty": "Medium",
                        "topic": "General Web Dev"
                },
                {
                        "id": 60,
                        "question": "What is server-side validation?",
                        "options": [
                                "CSS validation",
                                "HTML validation",
                                "Validation on server",
                                "Validation in browser"
                        ],
                        "correct": 2,
                        "explanation": "Server-side validation ensures data integrity. It protects against malicious input.",
                        "difficulty": "Medium",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 61,
                        "question": "What is XSS?",
                        "options": [
                                "Cross Server Security",
                                "Extra Secure System",
                                "Extended Style Sheet",
                                "Cross-Site Scripting"
                        ],
                        "correct": 3,
                        "explanation": "XSS injects malicious scripts into web pages. It can steal user data.",
                        "difficulty": "Hard",
                        "topic": "Security & DevOps"
                },
                {
                        "id": 62,
                        "question": "What is CSRF?",
                        "options": [
                                "Cross-Site Request Forgery",
                                "Client-Side Rendering Format",
                                "Cross Server Request File",
                                "Central Security Request Function"
                        ],
                        "correct": 0,
                        "explanation": "CSRF tricks users into submitting unwanted requests. Tokens prevent such attacks.",
                        "difficulty": "Hard",
                        "topic": "Security & DevOps"
                },
                {
                        "id": 63,
                        "question": "What is SQL Injection?",
                        "options": [
                                "JavaScript error",
                                "Injecting malicious SQL code",
                                "Network failure",
                                "Styling attack"
                        ],
                        "correct": 1,
                        "explanation": "SQL injection manipulates database queries. It can expose sensitive data.",
                        "difficulty": "Easy",
                        "topic": "Data & Storage"
                },
                {
                        "id": 64,
                        "question": "What is HTTPS used for?",
                        "options": [
                                "Secure communication",
                                "Database access",
                                "Faster loading",
                                "Styling"
                        ],
                        "correct": 0,
                        "explanation": "HTTPS encrypts data in transit. It protects user information.",
                        "difficulty": "Easy",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 65,
                        "question": "What is authentication?",
                        "options": [
                                "Storing cookies",
                                "Encrypting data",
                                "Verifying user identity",
                                "Styling pages"
                        ],
                        "correct": 2,
                        "explanation": "Authentication confirms user identity. Examples include login systems.",
                        "difficulty": "Easy",
                        "topic": "Security & DevOps"
                },
                {
                        "id": 66,
                        "question": "What is authorization?",
                        "options": [
                                "Verifying identity",
                                "Encrypting data",
                                "Creating users",
                                "Granting access rights"
                        ],
                        "correct": 3,
                        "explanation": "Authorization determines what users can access. It follows authentication.",
                        "difficulty": "Easy",
                        "topic": "Security & DevOps"
                },
                {
                        "id": 67,
                        "question": "What is JWT?",
                        "options": [
                                "Java Web Token",
                                "JavaScript Web Token",
                                "Joint Web Token",
                                "JSON Web Token"
                        ],
                        "correct": 3,
                        "explanation": "JWT securely transmits user data. It is used in authentication.",
                        "difficulty": "Hard",
                        "topic": "Security & DevOps"
                },
                {
                        "id": 68,
                        "question": "What is session management?",
                        "options": [
                                "Styling pages",
                                "Database design",
                                "Server shutdown",
                                "Tracking user activity"
                        ],
                        "correct": 3,
                        "explanation": "Session management maintains user state. It enables login persistence.",
                        "difficulty": "Easy",
                        "topic": "Data & Storage"
                },
                {
                        "id": 69,
                        "question": "What is caching used for?",
                        "options": [
                                "Encrypting data",
                                "Deleting data",
                                "Storing data for faster access",
                                "Slowing performance"
                        ],
                        "correct": 2,
                        "explanation": "Caching reduces server load. It improves response time.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 70,
                        "question": "What is lazy loading in web development?",
                        "options": [
                                "Deleting content",
                                "Loading content when needed",
                                "Encrypting content",
                                "Loading all content at once"
                        ],
                        "correct": 1,
                        "explanation": "Lazy loading improves performance. Images load only when visible.",
                        "difficulty": "Medium",
                        "topic": "General Web Dev"
                },
                {
                        "id": 71,
                        "question": "What is minification?",
                        "options": [
                                "Encrypting code",
                                "Compressing images",
                                "Removing unnecessary characters from code",
                                "Increasing file size"
                        ],
                        "correct": 2,
                        "explanation": "Minification reduces file size. It improves load speed.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 72,
                        "question": "What is bundling?",
                        "options": [
                                "Deleting files",
                                "Encrypting files",
                                "Splitting files",
                                "Combining multiple files into one"
                        ],
                        "correct": 3,
                        "explanation": "Bundling reduces HTTP requests. Tools like Webpack perform bundling.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 73,
                        "question": "What is transpiling?",
                        "options": [
                                "Converting code to compatible version",
                                "Compressing code",
                                "Running code",
                                "Encrypting code"
                        ],
                        "correct": 0,
                        "explanation": "Transpilers convert modern JavaScript to older versions. Example: Babel.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 74,
                        "question": "What is Webpack?",
                        "options": [
                                "Database",
                                "Server",
                                "Browser",
                                "Module bundler"
                        ],
                        "correct": 3,
                        "explanation": "Webpack bundles assets for deployment. It optimizes performance.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 75,
                        "question": "What is a virtual DOM?",
                        "options": [
                                "Real DOM",
                                "Database",
                                "Server",
                                "Lightweight copy of DOM"
                        ],
                        "correct": 3,
                        "explanation": "Virtual DOM improves performance. Frameworks update only changed parts.",
                        "difficulty": "Easy",
                        "topic": "HTML"
                },
                {
                        "id": 76,
                        "question": "Which library uses virtual DOM?",
                        "options": [
                                "Bootstrap",
                                "React",
                                "jQuery",
                                "Node.js"
                        ],
                        "correct": 1,
                        "explanation": "React uses virtual DOM to optimize rendering. It minimizes updates.",
                        "difficulty": "Easy",
                        "topic": "HTML"
                },
                {
                        "id": 77,
                        "question": "What is Angular?",
                        "options": [
                                "CSS library",
                                "Database",
                                "Server",
                                "Frontend framework"
                        ],
                        "correct": 3,
                        "explanation": "Angular is a full-featured frontend framework. It supports SPA development.",
                        "difficulty": "Easy",
                        "topic": "Frontend Frameworks"
                },
                {
                        "id": 78,
                        "question": "What is React?",
                        "options": [
                                "CSS tool",
                                "Server",
                                "Database",
                                "JavaScript library for UI"
                        ],
                        "correct": 3,
                        "explanation": "React builds interactive UIs. It uses components and virtual DOM.",
                        "difficulty": "Easy",
                        "topic": "Frontend Frameworks"
                },
                {
                        "id": 79,
                        "question": "What is Vue.js?",
                        "options": [
                                "Server",
                                "CSS preprocessor",
                                "Frontend framework",
                                "Database"
                        ],
                        "correct": 2,
                        "explanation": "Vue.js is a progressive JavaScript framework. It is lightweight and flexible.",
                        "difficulty": "Easy",
                        "topic": "Frontend Frameworks"
                },
                {
                        "id": 80,
                        "question": "What is component-based architecture?",
                        "options": [
                                "Network design",
                                "UI built using reusable components",
                                "Single large file",
                                "Database design"
                        ],
                        "correct": 1,
                        "explanation": "Components promote reuse and maintainability. They encapsulate UI logic.",
                        "difficulty": "Medium",
                        "topic": "Frontend Frameworks"
                },
                {
                        "id": 81,
                        "question": "What is state in React?",
                        "options": [
                                "Server",
                                "Database",
                                "Data managed within component",
                                "CSS style"
                        ],
                        "correct": 2,
                        "explanation": "State stores dynamic data. Changes trigger UI updates.",
                        "difficulty": "Easy",
                        "topic": "Frontend Frameworks"
                },
                {
                        "id": 82,
                        "question": "What are props in React?",
                        "options": [
                                "CSS properties",
                                "Data passed to components",
                                "Database values",
                                "Server variables"
                        ],
                        "correct": 1,
                        "explanation": "Props pass data between components. They are read-only.",
                        "difficulty": "Easy",
                        "topic": "Frontend Frameworks"
                },
                {
                        "id": 83,
                        "question": "What is backend development?",
                        "options": [
                                "Designing UI",
                                "Server-side logic and database management",
                                "Styling pages",
                                "Writing HTML"
                        ],
                        "correct": 1,
                        "explanation": "Backend handles data processing and storage. It supports frontend functionality.",
                        "difficulty": "Medium",
                        "topic": "General Web Dev"
                },
                {
                        "id": 84,
                        "question": "Which language is used for backend development?",
                        "options": [
                                "HTML",
                                "JavaScript (Node.js)",
                                "Photoshop",
                                "CSS"
                        ],
                        "correct": 1,
                        "explanation": "Node.js allows JavaScript backend development. It handles server logic.",
                        "difficulty": "Medium",
                        "topic": "General Web Dev"
                },
                {
                        "id": 85,
                        "question": "What is Express.js?",
                        "options": [
                                "Database",
                                "Node.js web framework",
                                "CSS framework",
                                "Browser"
                        ],
                        "correct": 1,
                        "explanation": "Express simplifies server development. It handles routes and middleware.",
                        "difficulty": "Easy",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 86,
                        "question": "What is middleware in Express?",
                        "options": [
                                "Database",
                                "HTML tag",
                                "CSS rule",
                                "Function handling request/response cycle"
                        ],
                        "correct": 3,
                        "explanation": "Middleware processes requests before responses. It enables logging and authentication.",
                        "difficulty": "Medium",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 87,
                        "question": "What is RESTful API?",
                        "options": [
                                "API using CSS",
                                "API using SMTP",
                                "API using FTP",
                                "API using HTTP methods"
                        ],
                        "correct": 3,
                        "explanation": "RESTful APIs follow HTTP standards. They use GET, POST, PUT, DELETE.",
                        "difficulty": "Easy",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 88,
                        "question": "What is CRUD?",
                        "options": [
                                "Copy, Remove, Update, Delete",
                                "Create, Read, Update, Delete",
                                "Create, Run, Update, Debug",
                                "Control, Read, Use, Deploy"
                        ],
                        "correct": 1,
                        "explanation": "CRUD represents basic database operations. It is used in APIs.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 89,
                        "question": "What is MongoDB?",
                        "options": [
                                "Framework",
                                "NoSQL database",
                                "Programming language",
                                "SQL database"
                        ],
                        "correct": 1,
                        "explanation": "MongoDB stores data in JSON-like documents. It supports flexible schemas.",
                        "difficulty": "Easy",
                        "topic": "Data & Storage"
                },
                {
                        "id": 90,
                        "question": "What is SQL database?",
                        "options": [
                                "JavaScript library",
                                "CSS tool",
                                "Document database",
                                "Relational database"
                        ],
                        "correct": 3,
                        "explanation": "SQL databases store data in tables. They use structured queries.",
                        "difficulty": "Easy",
                        "topic": "Data & Storage"
                },
                {
                        "id": 91,
                        "question": "What is ORM?",
                        "options": [
                                "Object Relational Mapping",
                                "Operational Resource Method",
                                "Object Rendering Model",
                                "Online Resource Manager"
                        ],
                        "correct": 0,
                        "explanation": "ORM maps database tables to objects. It simplifies database interaction.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 92,
                        "question": "What is environment variable?",
                        "options": [
                                "Database column",
                                "CSS variable",
                                "HTML attribute",
                                "Configuration value stored outside code"
                        ],
                        "correct": 3,
                        "explanation": "Environment variables store sensitive data. They improve security.",
                        "difficulty": "Easy",
                        "topic": "JavaScript"
                },
                {
                        "id": 93,
                        "question": "What is .env file used for?",
                        "options": [
                                "Storing environment variables",
                                "CSS styles",
                                "Database schema",
                                "HTML layout"
                        ],
                        "correct": 0,
                        "explanation": ".env files store configuration values. They keep secrets out of code.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 94,
                        "question": "What is API rate limiting?",
                        "options": [
                                "Deleting requests",
                                "Encrypting requests",
                                "Increasing API calls",
                                "Restricting number of requests"
                        ],
                        "correct": 3,
                        "explanation": "Rate limiting prevents abuse. It protects servers from overload.",
                        "difficulty": "Easy",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 95,
                        "question": "What is load balancing?",
                        "options": [
                                "Slowing servers",
                                "Deleting traffic",
                                "Encrypting traffic",
                                "Distributing traffic across servers"
                        ],
                        "correct": 3,
                        "explanation": "Load balancing improves availability. It prevents server overload.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 96,
                        "question": "What is serverless architecture?",
                        "options": [
                                "Database-only systems",
                                "Cloud-managed backend services",
                                "No servers exist",
                                "Static websites only"
                        ],
                        "correct": 1,
                        "explanation": "Serverless uses cloud providers to manage infrastructure. Developers focus on code.",
                        "difficulty": "Medium",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 97,
                        "question": "What is a webhook?",
                        "options": [
                                "HTML tag",
                                "Database trigger",
                                "CSS event",
                                "HTTP callback triggered by events"
                        ],
                        "correct": 3,
                        "explanation": "Webhooks notify systems of events. They enable real-time integration.",
                        "difficulty": "Easy",
                        "topic": "Frontend Frameworks"
                },
                {
                        "id": 98,
                        "question": "What is CI/CD?",
                        "options": [
                                "Continuous Internet Connection and Data",
                                "Code Inspection and Code Debugging",
                                "Client Integration and Client Deployment",
                                "Continuous Integration and Continuous Deployment"
                        ],
                        "correct": 3,
                        "explanation": "CI/CD automates testing and deployment. It improves delivery speed.",
                        "difficulty": "Easy",
                        "topic": "Security & DevOps"
                },
                {
                        "id": 99,
                        "question": "What is Docker used for?",
                        "options": [
                                "Database management",
                                "Styling",
                                "Containerization",
                                "UI design"
                        ],
                        "correct": 2,
                        "explanation": "Docker packages apps with dependencies. It ensures consistent environments.",
                        "difficulty": "Hard",
                        "topic": "Security & DevOps"
                },
                {
                        "id": 102,
                        "question": "What is client-side rendering (CSR)?",
                        "options": [
                                "Rendering using CSS",
                                "Rendering on the server",
                                "Rendering in the browser using JavaScript",
                                "Rendering database queries"
                        ],
                        "correct": 2,
                        "explanation": "CSR loads a basic HTML file and builds the page using JavaScript. It enables dynamic SPAs.",
                        "difficulty": "Medium",
                        "topic": "General Web Dev"
                },
                {
                        "id": 103,
                        "question": "What is hydration in web apps?",
                        "options": [
                                "Deleting DOM",
                                "Loading images",
                                "Encrypting data",
                                "Attaching JavaScript to server-rendered HTML"
                        ],
                        "correct": 3,
                        "explanation": "Hydration makes static HTML interactive. Frameworks like React use it after SSR.",
                        "difficulty": "Hard",
                        "topic": "General Web Dev"
                },
                {
                        "id": 104,
                        "question": "What is a static website?",
                        "options": [
                                "Website with dynamic data",
                                "Website with fixed content",
                                "Database-driven website",
                                "Serverless website"
                        ],
                        "correct": 1,
                        "explanation": "Static sites deliver prebuilt HTML files. They are fast and secure.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 105,
                        "question": "What is a dynamic website?",
                        "options": [
                                "No server required",
                                "Content generated at runtime",
                                "Only CSS",
                                "Fixed content"
                        ],
                        "correct": 1,
                        "explanation": "Dynamic websites generate content based on user input or database data. They provide personalized experiences.",
                        "difficulty": "Medium",
                        "topic": "General Web Dev"
                },
                {
                        "id": 106,
                        "question": "What is a template engine?",
                        "options": [
                                "Browser",
                                "Tool for generating dynamic HTML",
                                "Database",
                                "CSS framework"
                        ],
                        "correct": 1,
                        "explanation": "Template engines combine templates with data. Examples include EJS and Handlebars.",
                        "difficulty": "Medium",
                        "topic": "General Web Dev"
                },
                {
                        "id": 107,
                        "question": "What is MVC architecture?",
                        "options": [
                                "Model Value Controller",
                                "Multi-Version Control",
                                "Managed View Component",
                                "Model-View-Controller pattern"
                        ],
                        "correct": 3,
                        "explanation": "MVC separates application logic. It improves maintainability.",
                        "difficulty": "Easy",
                        "topic": "Web Concepts"
                },
                {
                        "id": 108,
                        "question": "What is the role of the Model in MVC?",
                        "options": [
                                "Styling",
                                "Business logic and data",
                                "Routing",
                                "UI rendering"
                        ],
                        "correct": 1,
                        "explanation": "The Model manages data and rules. It interacts with databases.",
                        "difficulty": "Easy",
                        "topic": "Web Concepts"
                },
                {
                        "id": 109,
                        "question": "What is the role of the View in MVC?",
                        "options": [
                                "Business logic",
                                "Routing",
                                "UI presentation",
                                "Data storage"
                        ],
                        "correct": 2,
                        "explanation": "Views display data to users. They handle UI rendering.",
                        "difficulty": "Easy",
                        "topic": "Web Concepts"
                },
                {
                        "id": 110,
                        "question": "What is the role of the Controller in MVC?",
                        "options": [
                                "Handles user input and updates model/view",
                                "Database storage",
                                "Styling",
                                "CSS layout"
                        ],
                        "correct": 0,
                        "explanation": "Controllers process user input. They coordinate between Model and View.",
                        "difficulty": "Easy",
                        "topic": "Web Concepts"
                },
                {
                        "id": 111,
                        "question": "What is REST statelessness?",
                        "options": [
                                "Server remembers users",
                                "Server stores session",
                                "Cookies required",
                                "Each request contains all needed information"
                        ],
                        "correct": 3,
                        "explanation": "REST APIs do not store client state. Each request is independent.",
                        "difficulty": "Easy",
                        "topic": "Frontend Frameworks"
                },
                {
                        "id": 112,
                        "question": "What is idempotent HTTP method?",
                        "options": [
                                "Method encrypting data",
                                "Method deleting data",
                                "Method producing same result when repeated",
                                "Method changing state"
                        ],
                        "correct": 2,
                        "explanation": "Idempotent methods like GET and PUT produce consistent results. They improve reliability.",
                        "difficulty": "Medium",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 113,
                        "question": "Which HTTP method is idempotent?",
                        "options": [
                                "CONNECT",
                                "PATCH",
                                "PUT",
                                "POST"
                        ],
                        "correct": 2,
                        "explanation": "PUT replaces a resource consistently. Repeated requests have the same effect.",
                        "difficulty": "Medium",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 114,
                        "question": "What is WebSocket used for?",
                        "options": [
                                "Real-time communication",
                                "Database queries",
                                "CSS styling",
                                "Static content"
                        ],
                        "correct": 0,
                        "explanation": "WebSockets enable full-duplex communication. They support chat apps and live updates.",
                        "difficulty": "Medium",
                        "topic": "General Web Dev"
                },
                {
                        "id": 115,
                        "question": "What is polling?",
                        "options": [
                                "Database replication",
                                "Client repeatedly requests updates",
                                "Encryption",
                                "Server pushes updates"
                        ],
                        "correct": 1,
                        "explanation": "Polling checks for updates at intervals. It is less efficient than WebSockets.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 116,
                        "question": "What is long polling?",
                        "options": [
                                "Server holds request until data available",
                                "Fast polling",
                                "CSS loading",
                                "Database query"
                        ],
                        "correct": 0,
                        "explanation": "Long polling reduces frequent requests. The server responds when new data arrives.",
                        "difficulty": "Medium",
                        "topic": "General Web Dev"
                },
                {
                        "id": 117,
                        "question": "What is a service worker?",
                        "options": [
                                "CSS worker",
                                "HTML tag",
                                "Script enabling offline support",
                                "Database worker"
                        ],
                        "correct": 2,
                        "explanation": "Service workers enable caching and offline functionality. They power PWAs.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 118,
                        "question": "What is web accessibility?",
                        "options": [
                                "Encrypting data",
                                "Making websites fast",
                                "Database optimization",
                                "Making websites usable for people with disabilities"
                        ],
                        "correct": 3,
                        "explanation": "Accessibility ensures inclusivity. It includes screen reader support.",
                        "difficulty": "Easy",
                        "topic": "Web Concepts"
                },
                {
                        "id": 119,
                        "question": "What is ARIA?",
                        "options": [
                                "Accessible Rich Internet Applications",
                                "Automatic Rendering Internet API",
                                "Advanced Resource Integration API",
                                "Application Routing Interface"
                        ],
                        "correct": 0,
                        "explanation": "ARIA improves accessibility for dynamic content. It helps assistive technologies.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 120,
                        "question": "What is semantic HTML benefit?",
                        "options": [
                                "Faster server",
                                "Better accessibility and SEO",
                                "Faster CSS",
                                "Smaller database"
                        ],
                        "correct": 1,
                        "explanation": "Semantic HTML improves search engine understanding. It enhances accessibility.",
                        "difficulty": "Easy",
                        "topic": "HTML"
                },
                {
                        "id": 121,
                        "question": "What is web performance optimization?",
                        "options": [
                                "Improving load speed and responsiveness",
                                "Adding images",
                                "Deleting CSS",
                                "Slowing pages"
                        ],
                        "correct": 0,
                        "explanation": "Optimization improves user experience. It reduces bounce rates.",
                        "difficulty": "Medium",
                        "topic": "Web Concepts"
                },
                {
                        "id": 122,
                        "question": "What is critical rendering path?",
                        "options": [
                                "Steps browser takes to render page",
                                "Path to database",
                                "CSS layout path",
                                "API request path"
                        ],
                        "correct": 0,
                        "explanation": "Optimizing rendering path improves performance. It reduces load time.",
                        "difficulty": "Medium",
                        "topic": "General Web Dev"
                },
                {
                        "id": 123,
                        "question": "What is code splitting?",
                        "options": [
                                "Combining files",
                                "Deleting code",
                                "Loading code in chunks",
                                "Encrypting code"
                        ],
                        "correct": 2,
                        "explanation": "Code splitting loads only required code. It improves performance.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 124,
                        "question": "What is tree shaking?",
                        "options": [
                                "Removing unused code",
                                "Deleting files",
                                "Encrypting code",
                                "Compressing images"
                        ],
                        "correct": 0,
                        "explanation": "Tree shaking eliminates dead code. It reduces bundle size.",
                        "difficulty": "Hard",
                        "topic": "General Web Dev"
                },
                {
                        "id": 125,
                        "question": "What is HTTP/2 advantage?",
                        "options": [
                                "No headers",
                                "Slower speed",
                                "No encryption",
                                "Multiplexing multiple requests"
                        ],
                        "correct": 3,
                        "explanation": "HTTP/2 allows multiple requests over one connection. It improves performance.",
                        "difficulty": "Medium",
                        "topic": "HTML"
                },
                {
                        "id": 126,
                        "question": "What is HTTP/3 based on?",
                        "options": [
                                "TCP",
                                "UDP (QUIC)",
                                "SMTP",
                                "FTP"
                        ],
                        "correct": 1,
                        "explanation": "HTTP/3 uses QUIC over UDP. It reduces latency.",
                        "difficulty": "Easy",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 127,
                        "question": "What is a reverse proxy server?",
                        "options": [
                                "Client proxy",
                                "Server receiving client requests and forwarding to backend",
                                "CSS engine",
                                "Database"
                        ],
                        "correct": 1,
                        "explanation": "Reverse proxies improve security and load balancing. Example: Nginx.",
                        "difficulty": "Easy",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 128,
                        "question": "What is edge computing in web development?",
                        "options": [
                                "CSS rendering",
                                "Processing data near users",
                                "Computing at central server",
                                "Database replication"
                        ],
                        "correct": 1,
                        "explanation": "Edge computing reduces latency. It improves performance.",
                        "difficulty": "Easy",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 129,
                        "question": "What is Jamstack?",
                        "options": [
                                "JSON, API, Storage",
                                "JavaScript, Angular, MongoDB",
                                "JavaScript, APIs, Markup",
                                "Java, SQL, Stack"
                        ],
                        "correct": 2,
                        "explanation": "Jamstack builds fast static sites using APIs. It improves scalability.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 130,
                        "question": "What is headless CMS?",
                        "options": [
                                "CMS without database",
                                "CMS without UI",
                                "CMS providing content via APIs",
                                "Static CMS"
                        ],
                        "correct": 2,
                        "explanation": "Headless CMS separates content from presentation. It supports multiple platforms.",
                        "difficulty": "Medium",
                        "topic": "General Web Dev"
                },
                {
                        "id": 131,
                        "question": "What is GraphQL?",
                        "options": [
                                "Query language for APIs",
                                "Web server",
                                "CSS framework",
                                "Database"
                        ],
                        "correct": 0,
                        "explanation": "GraphQL allows clients to request specific data. It reduces over-fetching.",
                        "difficulty": "Hard",
                        "topic": "Backend & APIs"
                },
                {
                        "id": 132,
                        "question": "What is rate limiting purpose?",
                        "options": [
                                "Encrypt requests",
                                "Increase traffic",
                                "Delete requests",
                                "Prevent abuse"
                        ],
                        "correct": 3,
                        "explanation": "Rate limiting protects servers. It prevents excessive requests.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 133,
                        "question": "What is CSRF token used for?",
                        "options": [
                                "Preventing CSRF attacks",
                                "Database access",
                                "Encrypting passwords",
                                "Styling"
                        ],
                        "correct": 0,
                        "explanation": "CSRF tokens verify legitimate requests. They protect users.",
                        "difficulty": "Hard",
                        "topic": "Security & DevOps"
                },
                {
                        "id": 134,
                        "question": "What is password hashing?",
                        "options": [
                                "Converting passwords into fixed hash",
                                "Deleting passwords",
                                "Storing plain text",
                                "Encrypting passwords"
                        ],
                        "correct": 0,
                        "explanation": "Hashing protects passwords. Even if breached, originals are hidden.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 135,
                        "question": "What is salting in hashing?",
                        "options": [
                                "Adding random data before hashing",
                                "Encrypting database",
                                "Removing hash",
                                "Compressing password"
                        ],
                        "correct": 0,
                        "explanation": "Salting prevents rainbow table attacks. It improves security.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 136,
                        "question": "What is OAuth?",
                        "options": [
                                "CSS tool",
                                "Authorization framework",
                                "Web server",
                                "Database protocol"
                        ],
                        "correct": 1,
                        "explanation": "OAuth allows third-party login. It provides secure authorization.",
                        "difficulty": "Easy",
                        "topic": "Security & DevOps"
                },
                {
                        "id": 137,
                        "question": "What is SSO?",
                        "options": [
                                "Static Site Optimization",
                                "Session Storage Option",
                                "Single Sign-On",
                                "Secure Server Operation"
                        ],
                        "correct": 2,
                        "explanation": "SSO allows one login for multiple services. It improves user experience.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 138,
                        "question": "What is CAPTCHA used for?",
                        "options": [
                                "Speed testing",
                                "Distinguishing humans from bots",
                                "Encrypting data",
                                "Database validation"
                        ],
                        "correct": 1,
                        "explanation": "CAPTCHA prevents automated abuse. It improves security.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 139,
                        "question": "What is WebAssembly?",
                        "options": [
                                "HTML tag",
                                "Database",
                                "Binary format for high-performance web apps",
                                "CSS framework"
                        ],
                        "correct": 2,
                        "explanation": "WebAssembly runs code at near-native speed. It supports heavy computations.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 140,
                        "question": "What is a sandbox in web security?",
                        "options": [
                                "CSS tool",
                                "Isolated environment for running code",
                                "Database",
                                "HTML feature"
                        ],
                        "correct": 1,
                        "explanation": "Sandboxing prevents code from affecting system. It improves security.",
                        "difficulty": "Medium",
                        "topic": "Security & DevOps"
                },
                {
                        "id": 141,
                        "question": "What is feature detection?",
                        "options": [
                                "Detect browser capabilities",
                                "Detect browser name",
                                "Detect server",
                                "Detect database"
                        ],
                        "correct": 0,
                        "explanation": "Feature detection checks browser support. It ensures compatibility.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 142,
                        "question": "What is progressive enhancement?",
                        "options": [
                                "Basic functionality first, enhancements later",
                                "Database optimization",
                                "Building for modern browsers only",
                                "Removing features"
                        ],
                        "correct": 0,
                        "explanation": "Progressive enhancement ensures accessibility. Advanced features load when supported.",
                        "difficulty": "Medium",
                        "topic": "General Web Dev"
                },
                {
                        "id": 143,
                        "question": "What is graceful degradation?",
                        "options": [
                                "Improving performance",
                                "Encrypting data",
                                "Removing features",
                                "Ensuring basic functionality on older browsers"
                        ],
                        "correct": 3,
                        "explanation": "Graceful degradation maintains usability. It supports legacy browsers.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 144,
                        "question": "What is browser caching?",
                        "options": [
                                "Encrypting data",
                                "Storing resources locally",
                                "Compressing images",
                                "Deleting files"
                        ],
                        "correct": 1,
                        "explanation": "Browser caching reduces load time. It improves performance.",
                        "difficulty": "Easy",
                        "topic": "Web Concepts"
                },
                {
                        "id": 145,
                        "question": "What is ETag in HTTP?",
                        "options": [
                                "CSS rule",
                                "Identifier for resource version",
                                "Encryption key",
                                "Database ID"
                        ],
                        "correct": 1,
                        "explanation": "ETags help caching. They detect resource changes.",
                        "difficulty": "Easy",
                        "topic": "HTML"
                },
                {
                        "id": 146,
                        "question": "What is a sitemap?",
                        "options": [
                                "API list",
                                "List of website pages for search engines",
                                "CSS file",
                                "Database schema"
                        ],
                        "correct": 1,
                        "explanation": "Sitemaps help search engines index pages. They improve SEO.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 147,
                        "question": "What is robots.txt?",
                        "options": [
                                "Database file",
                                "File instructing search engine crawlers",
                                "CSS file",
                                "JavaScript file"
                        ],
                        "correct": 1,
                        "explanation": "robots.txt controls crawler access. It manages indexing.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                },
                {
                        "id": 148,
                        "question": "What is canonical URL?",
                        "options": [
                                "API endpoint",
                                "Preferred URL for search engines",
                                "CSS link",
                                "Duplicate URL"
                        ],
                        "correct": 1,
                        "explanation": "Canonical URLs prevent duplicate content issues. They improve SEO.",
                        "difficulty": "Easy",
                        "topic": "Web Concepts"
                },
                {
                        "id": 149,
                        "question": "What is Lighthouse tool used for?",
                        "options": [
                                "Web performance auditing",
                                "API testing",
                                "Database testing",
                                "CSS styling"
                        ],
                        "correct": 0,
                        "explanation": "Lighthouse analyzes performance and accessibility. It provides optimization suggestions.",
                        "difficulty": "Medium",
                        "topic": "General Web Dev"
                },
                {
                        "id": 150,
                        "question": "What is the goal of modern web development?",
                        "options": [
                                "Build fast, secure, and scalable applications",
                                "Avoid user experience",
                                "Remove security",
                                "Increase complexity"
                        ],
                        "correct": 0,
                        "explanation": "Modern web development focuses on performance, security, and usability. It ensures scalable user-friendly systems.",
                        "difficulty": "Easy",
                        "topic": "General Web Dev"
                }
        ],
        "cloud": [
                {
                        "id": 1,
                        "question": "What is cloud computing?",
                        "options": [
                                "Storing data on personal devices",
                                "Using offline software",
                                "Delivering computing services over the internet",
                                "Using local servers only"
                        ],
                        "correct": 2,
                        "explanation": "Cloud computing provides resources like storage and computing over the internet. It eliminates the need for local infrastructure.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 2,
                        "question": "Which of the following is a cloud service provider?",
                        "options": [
                                "Windows OS",
                                "HTML",
                                "MySQL",
                                "Microsoft Azure"
                        ],
                        "correct": 3,
                        "explanation": "Microsoft Azure offers cloud services including computing and storage. It is a major cloud provider.",
                        "difficulty": "Medium",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 3,
                        "question": "What does IaaS stand for?",
                        "options": [
                                "Interface as a Service",
                                "Integration as a Service",
                                "Infrastructure as a Service",
                                "Internet as a Service"
                        ],
                        "correct": 2,
                        "explanation": "IaaS provides virtualized computing resources. Users manage OS and applications.",
                        "difficulty": "Easy",
                        "topic": "Service Models"
                },
                {
                        "id": 4,
                        "question": "Which service model provides virtual machines?",
                        "options": [
                                "PaaS",
                                "FaaS",
                                "IaaS",
                                "SaaS"
                        ],
                        "correct": 2,
                        "explanation": "IaaS offers virtual machines and storage. Users control the operating system.",
                        "difficulty": "Medium",
                        "topic": "Virtualization"
                },
                {
                        "id": 5,
                        "question": "What does PaaS stand for?",
                        "options": [
                                "Platform as a Service",
                                "Performance as a Service",
                                "Process as a Service",
                                "Program as a Service"
                        ],
                        "correct": 0,
                        "explanation": "PaaS provides a platform for developing applications. Developers focus on code rather than infrastructure.",
                        "difficulty": "Easy",
                        "topic": "Service Models"
                },
                {
                        "id": 6,
                        "question": "What does SaaS stand for?",
                        "options": [
                                "Storage as a Service",
                                "Software as a Service",
                                "System as a Service",
                                "Server as a Service"
                        ],
                        "correct": 1,
                        "explanation": "SaaS delivers software over the internet. Users access applications via browsers.",
                        "difficulty": "Easy",
                        "topic": "Service Models"
                },
                {
                        "id": 7,
                        "question": "Which is an example of SaaS?",
                        "options": [
                                "Docker",
                                "Google Docs",
                                "Kubernetes",
                                "Amazon EC2"
                        ],
                        "correct": 1,
                        "explanation": "Google Docs is accessed via browser. Users do not manage infrastructure.",
                        "difficulty": "Easy",
                        "topic": "Service Models"
                },
                {
                        "id": 8,
                        "question": "Which is an example of IaaS?",
                        "options": [
                                "Gmail",
                                "Slack",
                                "Amazon EC2",
                                "Google Docs"
                        ],
                        "correct": 2,
                        "explanation": "Amazon EC2 provides virtual servers. Users control OS and applications.",
                        "difficulty": "Easy",
                        "topic": "Service Models"
                },
                {
                        "id": 9,
                        "question": "Which is an example of PaaS?",
                        "options": [
                                "Microsoft Word",
                                "Dropbox",
                                "Heroku",
                                "Gmail"
                        ],
                        "correct": 2,
                        "explanation": "Heroku provides a platform for deploying apps. Developers focus on code.",
                        "difficulty": "Easy",
                        "topic": "Service Models"
                },
                {
                        "id": 10,
                        "question": "What is virtualization?",
                        "options": [
                                "Deleting servers",
                                "Physical server creation",
                                "Encrypting data",
                                "Creating virtual versions of resources"
                        ],
                        "correct": 3,
                        "explanation": "Virtualization allows multiple virtual machines on one physical server. It improves resource utilization.",
                        "difficulty": "Medium",
                        "topic": "Virtualization"
                },
                {
                        "id": 11,
                        "question": "What is a virtual machine (VM)?",
                        "options": [
                                "Physical server",
                                "Database",
                                "Network cable",
                                "Software-based computer"
                        ],
                        "correct": 3,
                        "explanation": "VMs emulate physical computers. They run operating systems independently.",
                        "difficulty": "Medium",
                        "topic": "Virtualization"
                },
                {
                        "id": 12,
                        "question": "What is a hypervisor?",
                        "options": [
                                "Cloud storage",
                                "Software that manages virtual machines",
                                "Database manager",
                                "Network switch"
                        ],
                        "correct": 1,
                        "explanation": "Hypervisors create and manage VMs. Examples include VMware and Hyper-V.",
                        "difficulty": "Easy",
                        "topic": "Virtualization"
                },
                {
                        "id": 13,
                        "question": "What is Type 1 hypervisor?",
                        "options": [
                                "Runs on host OS",
                                "Runs in database",
                                "Runs directly on hardware",
                                "Runs in browser"
                        ],
                        "correct": 2,
                        "explanation": "Type 1 hypervisors run directly on hardware. They offer better performance.",
                        "difficulty": "Medium",
                        "topic": "Virtualization"
                },
                {
                        "id": 14,
                        "question": "What is Type 2 hypervisor?",
                        "options": [
                                "Runs on hardware directly",
                                "Runs on host OS",
                                "Runs in database",
                                "Runs in cloud"
                        ],
                        "correct": 1,
                        "explanation": "Type 2 hypervisors run on top of an operating system. Example: VirtualBox.",
                        "difficulty": "Medium",
                        "topic": "Virtualization"
                },
                {
                        "id": 15,
                        "question": "What is containerization?",
                        "options": [
                                "Creating virtual machines",
                                "Packaging applications with dependencies",
                                "Encrypting data",
                                "Deleting servers"
                        ],
                        "correct": 1,
                        "explanation": "Containers package apps with dependencies. They ensure consistent environments.",
                        "difficulty": "Medium",
                        "topic": "Virtualization"
                },
                {
                        "id": 16,
                        "question": "Which tool is used for containerization?",
                        "options": [
                                "Apache",
                                "MySQL",
                                "Docker",
                                "HTML"
                        ],
                        "correct": 2,
                        "explanation": "Docker creates and manages containers. It simplifies deployment.",
                        "difficulty": "Medium",
                        "topic": "Virtualization"
                },
                {
                        "id": 17,
                        "question": "What is Kubernetes?",
                        "options": [
                                "Programming language",
                                "Web server",
                                "Database",
                                "Container orchestration platform"
                        ],
                        "correct": 3,
                        "explanation": "Kubernetes manages container deployment and scaling. It automates operations.",
                        "difficulty": "Hard",
                        "topic": "Virtualization"
                },
                {
                        "id": 18,
                        "question": "What is cloud storage?",
                        "options": [
                                "RAM storage",
                                "USB storage",
                                "Local storage",
                                "Storing data on remote servers"
                        ],
                        "correct": 3,
                        "explanation": "Cloud storage stores data on remote servers. Users access it via internet.",
                        "difficulty": "Easy",
                        "topic": "Storage & Data"
                },
                {
                        "id": 19,
                        "question": "Which is an example of cloud storage?",
                        "options": [
                                "CPU",
                                "Hard disk",
                                "Google Drive",
                                "RAM"
                        ],
                        "correct": 2,
                        "explanation": "Google Drive stores files in the cloud. Users can access them anywhere.",
                        "difficulty": "Easy",
                        "topic": "Storage & Data"
                },
                {
                        "id": 20,
                        "question": "What is elasticity in cloud computing?",
                        "options": [
                                "Deleting resources",
                                "Fixed resources",
                                "Encrypting data",
                                "Ability to scale resources automatically"
                        ],
                        "correct": 3,
                        "explanation": "Elasticity allows automatic scaling. It matches resource usage with demand.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 21,
                        "question": "What is scalability?",
                        "options": [
                                "Increasing performance by adding resources",
                                "Deleting resources",
                                "Encrypting data",
                                "Reducing storage"
                        ],
                        "correct": 0,
                        "explanation": "Scalability ensures systems handle increased load. It improves performance.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 22,
                        "question": "What is load balancing?",
                        "options": [
                                "Distributing traffic across servers",
                                "Encrypting data",
                                "Increasing server load",
                                "Deleting servers"
                        ],
                        "correct": 0,
                        "explanation": "Load balancing improves availability. It prevents server overload.",
                        "difficulty": "Easy",
                        "topic": "Architecture"
                },
                {
                        "id": 23,
                        "question": "What is multi-tenancy?",
                        "options": [
                                "Single user system",
                                "Multiple users sharing resources",
                                "Local storage",
                                "Dedicated server only"
                        ],
                        "correct": 1,
                        "explanation": "Multi-tenancy allows multiple users to share cloud resources. It reduces costs.",
                        "difficulty": "Medium",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 24,
                        "question": "What is a public cloud?",
                        "options": [
                                "Local server",
                                "Cloud services available to public",
                                "Offline system",
                                "Private infrastructure"
                        ],
                        "correct": 1,
                        "explanation": "Public clouds are accessible over internet. Examples: AWS, Azure.",
                        "difficulty": "Easy",
                        "topic": "Service Models"
                },
                {
                        "id": 25,
                        "question": "What is a private cloud?",
                        "options": [
                                "Free cloud",
                                "Offline system",
                                "Cloud used by one organization",
                                "Public cloud"
                        ],
                        "correct": 2,
                        "explanation": "Private clouds are dedicated to one organization. They provide greater control.",
                        "difficulty": "Medium",
                        "topic": "Service Models"
                },
                {
                        "id": 26,
                        "question": "What is a hybrid cloud?",
                        "options": [
                                "Local server",
                                "Offline network",
                                "Only public cloud",
                                "Combination of public and private clouds"
                        ],
                        "correct": 3,
                        "explanation": "Hybrid cloud combines public and private environments. It offers flexibility.",
                        "difficulty": "Medium",
                        "topic": "Service Models"
                },
                {
                        "id": 27,
                        "question": "What is community cloud?",
                        "options": [
                                "Offline cloud",
                                "Cloud for single user",
                                "Public cloud",
                                "Cloud shared by organizations with common goals"
                        ],
                        "correct": 3,
                        "explanation": "Community clouds serve organizations with shared concerns. They improve collaboration.",
                        "difficulty": "Medium",
                        "topic": "Service Models"
                },
                {
                        "id": 28,
                        "question": "What is serverless computing?",
                        "options": [
                                "Cloud provider manages infrastructure",
                                "Offline computing",
                                "No servers exist",
                                "Local computing"
                        ],
                        "correct": 0,
                        "explanation": "Serverless allows developers to focus on code. Infrastructure is managed by provider.",
                        "difficulty": "Medium",
                        "topic": "Service Models"
                },
                {
                        "id": 29,
                        "question": "What is FaaS?",
                        "options": [
                                "Framework as a Service",
                                "Firewall as a Service",
                                "File as a Service",
                                "Function as a Service"
                        ],
                        "correct": 3,
                        "explanation": "FaaS executes functions in response to events. It supports serverless architecture.",
                        "difficulty": "Easy",
                        "topic": "Service Models"
                },
                {
                        "id": 30,
                        "question": "What is auto-scaling?",
                        "options": [
                                "Manual scaling",
                                "Deleting servers",
                                "Automatic adjustment of resources",
                                "Encrypting data"
                        ],
                        "correct": 2,
                        "explanation": "Auto-scaling adjusts resources based on demand. It optimizes performance and cost.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 31,
                        "question": "What is cloud security?",
                        "options": [
                                "Encrypting hardware",
                                "Deleting data",
                                "Protecting cloud resources and data",
                                "Protecting local devices"
                        ],
                        "correct": 2,
                        "explanation": "Cloud security ensures data confidentiality and integrity. It uses encryption and access control.",
                        "difficulty": "Easy",
                        "topic": "Network & Security"
                },
                {
                        "id": 32,
                        "question": "What is IAM in cloud computing?",
                        "options": [
                                "Internal Access Method",
                                "Identity and Access Management",
                                "Internet Access Mode",
                                "Integrated Application Model"
                        ],
                        "correct": 1,
                        "explanation": "IAM controls user access. It ensures secure authentication and authorization.",
                        "difficulty": "Medium",
                        "topic": "Network & Security"
                },
                {
                        "id": 33,
                        "question": "What is encryption in cloud computing?",
                        "options": [
                                "Copying data",
                                "Converting data into secure format",
                                "Compressing data",
                                "Deleting data"
                        ],
                        "correct": 1,
                        "explanation": "Encryption protects data from unauthorized access. It ensures confidentiality.",
                        "difficulty": "Medium",
                        "topic": "Network & Security"
                },
                {
                        "id": 34,
                        "question": "What is data redundancy?",
                        "options": [
                                "Single copy of data",
                                "Multiple copies for reliability",
                                "Encrypting data",
                                "Deleting data"
                        ],
                        "correct": 1,
                        "explanation": "Redundancy improves data availability. It prevents data loss.",
                        "difficulty": "Easy",
                        "topic": "Architecture"
                },
                {
                        "id": 35,
                        "question": "What is disaster recovery?",
                        "options": [
                                "Scaling servers",
                                "Encrypting data",
                                "Deleting data",
                                "Restoring systems after failure"
                        ],
                        "correct": 3,
                        "explanation": "Disaster recovery ensures business continuity. It restores data and services.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 36,
                        "question": "What is uptime in cloud services?",
                        "options": [
                                "Backup time",
                                "Downtime duration",
                                "Time service is operational",
                                "Data storage time"
                        ],
                        "correct": 2,
                        "explanation": "Uptime measures service availability. High uptime ensures reliability.",
                        "difficulty": "Medium",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 37,
                        "question": "What is SLA in cloud computing?",
                        "options": [
                                "Server Link Application",
                                "Service Level Agreement",
                                "System Load Analysis",
                                "Secure Login Access"
                        ],
                        "correct": 1,
                        "explanation": "SLA defines service expectations. It includes uptime and performance guarantees.",
                        "difficulty": "Medium",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 38,
                        "question": "What is pay-as-you-go pricing?",
                        "options": [
                                "Annual billing only",
                                "Pay only for resources used",
                                "Free service",
                                "Fixed cost"
                        ],
                        "correct": 1,
                        "explanation": "Pay-as-you-go reduces costs. Users pay for actual usage.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 39,
                        "question": "What is edge computing?",
                        "options": [
                                "Offline computing",
                                "Local storage",
                                "Centralized computing",
                                "Processing data near source"
                        ],
                        "correct": 3,
                        "explanation": "Edge computing reduces latency. It processes data near users.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 40,
                        "question": "What is CDN in cloud computing?",
                        "options": [
                                "Content Delivery Network",
                                "Code Delivery Network",
                                "Cloud Data Network",
                                "Central Data Node"
                        ],
                        "correct": 0,
                        "explanation": "CDNs deliver content from nearby servers. They improve performance.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 41,
                        "question": "What is cloud bursting?",
                        "options": [
                                "Using public cloud during peak demand",
                                "Offline computing",
                                "Encrypting data",
                                "Deleting resources"
                        ],
                        "correct": 0,
                        "explanation": "Cloud bursting handles peak loads. It extends private cloud capacity.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 42,
                        "question": "What is resource pooling?",
                        "options": [
                                "Encrypting resources",
                                "Dedicated resources",
                                "Deleting resources",
                                "Sharing resources among users"
                        ],
                        "correct": 3,
                        "explanation": "Resource pooling improves efficiency. It supports multi-tenancy.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 43,
                        "question": "What is a region in cloud computing?",
                        "options": [
                                "Network cable",
                                "Database",
                                "Single server",
                                "Geographic area with data centers"
                        ],
                        "correct": 3,
                        "explanation": "Regions group data centers. They ensure availability and compliance.",
                        "difficulty": "Medium",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 44,
                        "question": "What is an availability zone?",
                        "options": [
                                "Isolated data center within region",
                                "Database cluster",
                                "Network cable",
                                "Single server"
                        ],
                        "correct": 0,
                        "explanation": "Availability zones improve fault tolerance. They isolate failures.",
                        "difficulty": "Easy",
                        "topic": "Architecture"
                },
                {
                        "id": 45,
                        "question": "What is cloud migration?",
                        "options": [
                                "Encrypting data",
                                "Deleting data",
                                "Moving applications to cloud",
                                "Scaling servers"
                        ],
                        "correct": 2,
                        "explanation": "Migration moves workloads to cloud. It improves scalability.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 46,
                        "question": "What is vendor lock-in?",
                        "options": [
                                "Difficulty switching providers",
                                "Freedom to switch providers",
                                "Security feature",
                                "Free cloud services"
                        ],
                        "correct": 0,
                        "explanation": "Vendor lock-in limits flexibility. It makes migration harder.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 47,
                        "question": "What is cloud orchestration?",
                        "options": [
                                "Manual management",
                                "Automated management of cloud resources",
                                "Security feature",
                                "Database management"
                        ],
                        "correct": 1,
                        "explanation": "Orchestration automates deployment and scaling. It improves efficiency.",
                        "difficulty": "Easy",
                        "topic": "Virtualization"
                },
                {
                        "id": 48,
                        "question": "What is a snapshot in cloud computing?",
                        "options": [
                                "Backup of system state",
                                "CSS file",
                                "Image file",
                                "Network packet"
                        ],
                        "correct": 0,
                        "explanation": "Snapshots capture system state. They support recovery.",
                        "difficulty": "Easy",
                        "topic": "Storage & Data"
                },
                {
                        "id": 49,
                        "question": "What is object storage?",
                        "options": [
                                "RAM storage",
                                "CPU storage",
                                "Block storage",
                                "Storage for unstructured data"
                        ],
                        "correct": 3,
                        "explanation": "Object storage stores files like images and videos. It is scalable.",
                        "difficulty": "Easy",
                        "topic": "Storage & Data"
                },
                {
                        "id": 52,
                        "question": "What is cold storage?",
                        "options": [
                                "Low-cost storage for infrequently accessed data",
                                "Cache storage",
                                "High-speed storage",
                                "RAM storage"
                        ],
                        "correct": 0,
                        "explanation": "Cold storage is cost-efficient. It is used for backups and archives.",
                        "difficulty": "Easy",
                        "topic": "Storage & Data"
                },
                {
                        "id": 53,
                        "question": "What is hot storage?",
                        "options": [
                                "Offline storage",
                                "High-speed storage for frequently accessed data",
                                "Storage for rarely used data",
                                "Encrypted storage"
                        ],
                        "correct": 1,
                        "explanation": "Hot storage provides fast access. It is used for active workloads.",
                        "difficulty": "Easy",
                        "topic": "Storage & Data"
                },
                {
                        "id": 54,
                        "question": "What is cloud monitoring?",
                        "options": [
                                "Creating VMs",
                                "Tracking performance and health of resources",
                                "Encrypting data",
                                "Deleting logs"
                        ],
                        "correct": 1,
                        "explanation": "Monitoring helps detect issues early. Tools provide metrics and alerts.",
                        "difficulty": "Easy",
                        "topic": "DevOps & Management"
                },
                {
                        "id": 55,
                        "question": "What is logging in cloud computing?",
                        "options": [
                                "Deleting data",
                                "Encrypting data",
                                "Scaling resources",
                                "Recording system events"
                        ],
                        "correct": 3,
                        "explanation": "Logs help troubleshoot and audit systems. They improve security and reliability.",
                        "difficulty": "Medium",
                        "topic": "DevOps & Management"
                },
                {
                        "id": 56,
                        "question": "What is autoscaling group?",
                        "options": [
                                "Manual scaling",
                                "Group of instances that scale automatically",
                                "Database cluster",
                                "Single VM"
                        ],
                        "correct": 1,
                        "explanation": "Autoscaling groups adjust instance numbers. They ensure performance and cost efficiency.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 57,
                        "question": "What is horizontal scaling?",
                        "options": [
                                "Adding more servers",
                                "Encrypting data",
                                "Increasing server capacity",
                                "Deleting servers"
                        ],
                        "correct": 0,
                        "explanation": "Horizontal scaling adds more machines. It improves availability and scalability.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 58,
                        "question": "What is vertical scaling?",
                        "options": [
                                "Increasing server resources (CPU, RAM)",
                                "Encrypting data",
                                "Deleting servers",
                                "Adding more servers"
                        ],
                        "correct": 0,
                        "explanation": "Vertical scaling upgrades existing hardware. It is limited by machine capacity.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 59,
                        "question": "What is cloud load balancer?",
                        "options": [
                                "Encrypts data",
                                "Deletes resources",
                                "Distributes traffic across instances",
                                "Database tool"
                        ],
                        "correct": 2,
                        "explanation": "Load balancers improve reliability. They route traffic to healthy instances.",
                        "difficulty": "Easy",
                        "topic": "Architecture"
                },
                {
                        "id": 60,
                        "question": "What is health check in load balancing?",
                        "options": [
                                "Creating backups",
                                "Monitoring instance availability",
                                "Database query",
                                "Encrypting data"
                        ],
                        "correct": 1,
                        "explanation": "Health checks detect failed instances. Traffic is redirected automatically.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 61,
                        "question": "What is VPC?",
                        "options": [
                                "Verified Public Cloud",
                                "Variable Private Cloud",
                                "Virtual Public Connection",
                                "Virtual Private Cloud"
                        ],
                        "correct": 3,
                        "explanation": "VPC provides isolated network environments. It enhances security and control.",
                        "difficulty": "Easy",
                        "topic": "Network & Security"
                },
                {
                        "id": 62,
                        "question": "What is subnet in cloud networking?",
                        "options": [
                                "Storage unit",
                                "Segment of VPC network",
                                "Entire network",
                                "Database table"
                        ],
                        "correct": 1,
                        "explanation": "Subnets divide networks into smaller segments. They improve organization and security.",
                        "difficulty": "Medium",
                        "topic": "Network & Security"
                },
                {
                        "id": 63,
                        "question": "What is a public subnet?",
                        "options": [
                                "Private network only",
                                "Database subnet",
                                "Storage subnet",
                                "Accessible from internet"
                        ],
                        "correct": 3,
                        "explanation": "Public subnets host internet-facing resources. They allow external access.",
                        "difficulty": "Easy",
                        "topic": "Network & Security"
                },
                {
                        "id": 64,
                        "question": "What is a private subnet?",
                        "options": [
                                "Internal network only",
                                "Accessible from internet",
                                "Public cloud",
                                "Storage unit"
                        ],
                        "correct": 0,
                        "explanation": "Private subnets protect internal resources. They enhance security.",
                        "difficulty": "Easy",
                        "topic": "Network & Security"
                },
                {
                        "id": 65,
                        "question": "What is NAT gateway?",
                        "options": [
                                "Database gateway",
                                "Storage gateway",
                                "Enables private subnet internet access",
                                "Security firewall"
                        ],
                        "correct": 2,
                        "explanation": "NAT gateways allow outbound internet access. They protect private IPs.",
                        "difficulty": "Easy",
                        "topic": "Network & Security"
                },
                {
                        "id": 66,
                        "question": "What is a security group?",
                        "options": [
                                "Storage service",
                                "Virtual firewall controlling traffic",
                                "Database",
                                "Load balancer"
                        ],
                        "correct": 1,
                        "explanation": "Security groups filter inbound/outbound traffic. They enforce access rules.",
                        "difficulty": "Medium",
                        "topic": "Network & Security"
                },
                {
                        "id": 67,
                        "question": "What is network ACL?",
                        "options": [
                                "Database rule",
                                "Storage rule",
                                "VM setting",
                                "Stateless firewall at subnet level"
                        ],
                        "correct": 3,
                        "explanation": "Network ACLs control subnet traffic. They add another security layer.",
                        "difficulty": "Easy",
                        "topic": "Network & Security"
                },
                {
                        "id": 68,
                        "question": "What is IAM role?",
                        "options": [
                                "Database role",
                                "Network role",
                                "Temporary permissions for services",
                                "User account"
                        ],
                        "correct": 2,
                        "explanation": "IAM roles grant permissions to services. They avoid storing credentials.",
                        "difficulty": "Easy",
                        "topic": "Network & Security"
                },
                {
                        "id": 69,
                        "question": "What is multi-factor authentication (MFA)?",
                        "options": [
                                "Multiple verification methods",
                                "Storage method",
                                "Single password login",
                                "Encryption method"
                        ],
                        "correct": 0,
                        "explanation": "MFA adds extra security. It requires additional verification like OTP.",
                        "difficulty": "Medium",
                        "topic": "Network & Security"
                },
                {
                        "id": 70,
                        "question": "What is data sovereignty?",
                        "options": [
                                "Data deletion",
                                "Data compression",
                                "Data encryption",
                                "Data governed by local laws"
                        ],
                        "correct": 3,
                        "explanation": "Data sovereignty ensures compliance. It controls where data is stored.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 71,
                        "question": "What is compliance in cloud computing?",
                        "options": [
                                "Meeting legal and security standards",
                                "Scaling servers",
                                "Deleting logs",
                                "Ignoring regulations"
                        ],
                        "correct": 0,
                        "explanation": "Compliance ensures regulatory adherence. It protects user data.",
                        "difficulty": "Medium",
                        "topic": "DevOps & Management"
                },
                {
                        "id": 72,
                        "question": "What is shared responsibility model?",
                        "options": [
                                "Security responsibilities shared between provider and user",
                                "No security needed",
                                "User responsible for hardware",
                                "Provider responsible for everything"
                        ],
                        "correct": 0,
                        "explanation": "Providers manage infrastructure security. Users secure applications and data.",
                        "difficulty": "Medium",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 73,
                        "question": "What is cloud cost optimization?",
                        "options": [
                                "Increasing expenses",
                                "Encrypting data",
                                "Deleting resources",
                                "Reducing costs while maintaining performance"
                        ],
                        "correct": 3,
                        "explanation": "Optimization ensures efficient resource use. It prevents overspending.",
                        "difficulty": "Easy",
                        "topic": "DevOps & Management"
                },
                {
                        "id": 74,
                        "question": "What is reserved instance pricing?",
                        "options": [
                                "Free usage",
                                "Pay hourly",
                                "Discount for long-term commitment",
                                "Pay per request"
                        ],
                        "correct": 2,
                        "explanation": "Reserved instances lower costs. Users commit to usage.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 75,
                        "question": "What is spot instance?",
                        "options": [
                                "Dedicated server",
                                "High-cost instance",
                                "Permanent instance",
                                "Low-cost instance with possible interruption"
                        ],
                        "correct": 3,
                        "explanation": "Spot instances use unused capacity. They are cheaper but may terminate.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 76,
                        "question": "What is cloud billing dashboard?",
                        "options": [
                                "Tool to track usage and costs",
                                "Storage tool",
                                "Security tool",
                                "Database"
                        ],
                        "correct": 0,
                        "explanation": "Billing dashboards provide cost visibility. They help manage expenses.",
                        "difficulty": "Easy",
                        "topic": "DevOps & Management"
                },
                {
                        "id": 77,
                        "question": "What is resource tagging?",
                        "options": [
                                "Labeling resources for organization",
                                "Scaling resources",
                                "Encrypting resources",
                                "Deleting resources"
                        ],
                        "correct": 0,
                        "explanation": "Tags help manage and track resources. They support billing and organization.",
                        "difficulty": "Medium",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 78,
                        "question": "What is a cloud API?",
                        "options": [
                                "Storage device",
                                "Interface to manage cloud resources",
                                "Database table",
                                "Hardware interface"
                        ],
                        "correct": 1,
                        "explanation": "Cloud APIs automate resource management. They enable infrastructure as code.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 79,
                        "question": "What is Infrastructure as Code (IaC)?",
                        "options": [
                                "CSS styling",
                                "Managing infrastructure using code",
                                "Database scripting",
                                "Manual infrastructure setup"
                        ],
                        "correct": 1,
                        "explanation": "IaC automates infrastructure deployment. Tools include Terraform.",
                        "difficulty": "Hard",
                        "topic": "DevOps & Management"
                },
                {
                        "id": 80,
                        "question": "What is Terraform?",
                        "options": [
                                "Programming language",
                                "IaC tool for cloud provisioning",
                                "Web server",
                                "Database"
                        ],
                        "correct": 1,
                        "explanation": "Terraform automates infrastructure. It supports multiple cloud providers.",
                        "difficulty": "Hard",
                        "topic": "DevOps & Management"
                },
                {
                        "id": 81,
                        "question": "What is cloud automation?",
                        "options": [
                                "Automatic management of resources",
                                "Manual tasks",
                                "Encrypting data",
                                "Deleting resources"
                        ],
                        "correct": 0,
                        "explanation": "Automation reduces manual errors. It improves efficiency.",
                        "difficulty": "Easy",
                        "topic": "DevOps & Management"
                },
                {
                        "id": 82,
                        "question": "What is a cloud sandbox environment?",
                        "options": [
                                "Testing environment",
                                "Database server",
                                "Production environment",
                                "Storage unit"
                        ],
                        "correct": 0,
                        "explanation": "Sandboxes allow safe testing. They prevent affecting production systems.",
                        "difficulty": "Medium",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 83,
                        "question": "What is blue-green deployment?",
                        "options": [
                                "Scaling servers",
                                "Encrypting data",
                                "Deleting servers",
                                "Running two environments for zero downtime"
                        ],
                        "correct": 3,
                        "explanation": "Blue-green deployment reduces downtime. Traffic shifts to new version.",
                        "difficulty": "Medium",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 84,
                        "question": "What is canary deployment?",
                        "options": [
                                "Full deployment",
                                "Deleting version",
                                "Gradual rollout to small users",
                                "Database migration"
                        ],
                        "correct": 2,
                        "explanation": "Canary releases reduce risk. Issues are detected early.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 85,
                        "question": "What is cloud backup?",
                        "options": [
                                "Deleting data",
                                "Encrypting data",
                                "Scaling servers",
                                "Copying data to cloud for recovery"
                        ],
                        "correct": 3,
                        "explanation": "Backups protect data. They enable disaster recovery.",
                        "difficulty": "Easy",
                        "topic": "Storage & Data"
                },
                {
                        "id": 86,
                        "question": "What is snapshot backup?",
                        "options": [
                                "Incremental backup",
                                "Database backup",
                                "Point-in-time system copy",
                                "Full backup"
                        ],
                        "correct": 2,
                        "explanation": "Snapshots capture system state. They support quick recovery.",
                        "difficulty": "Easy",
                        "topic": "Storage & Data"
                },
                {
                        "id": 87,
                        "question": "What is replication in cloud storage?",
                        "options": [
                                "Copying data across locations",
                                "Compressing data",
                                "Encrypting data",
                                "Deleting data"
                        ],
                        "correct": 0,
                        "explanation": "Replication improves availability. It protects against failures.",
                        "difficulty": "Medium",
                        "topic": "Storage & Data"
                },
                {
                        "id": 88,
                        "question": "What is latency in cloud computing?",
                        "options": [
                                "Encryption level",
                                "CPU speed",
                                "Storage size",
                                "Delay in data transfer"
                        ],
                        "correct": 3,
                        "explanation": "Lower latency improves performance. It affects user experience.",
                        "difficulty": "Easy",
                        "topic": "Architecture"
                },
                {
                        "id": 89,
                        "question": "What is throughput?",
                        "options": [
                                "CPU speed",
                                "Delay",
                                "Data transfer rate",
                                "Storage size"
                        ],
                        "correct": 2,
                        "explanation": "Throughput measures actual performance. It indicates system efficiency.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 90,
                        "question": "What is cloud bursting benefit?",
                        "options": [
                                "Handling peak loads",
                                "Reduced performance",
                                "Encrypting data",
                                "Deleting resources"
                        ],
                        "correct": 0,
                        "explanation": "Cloud bursting ensures scalability. It handles sudden demand.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 91,
                        "question": "What is container registry?",
                        "options": [
                                "Database",
                                "Load balancer",
                                "Storage for container images",
                                "Web server"
                        ],
                        "correct": 2,
                        "explanation": "Registries store container images. Example: Docker Hub.",
                        "difficulty": "Easy",
                        "topic": "Virtualization"
                },
                {
                        "id": 92,
                        "question": "What is serverless cold start?",
                        "options": [
                                "Delay when function initializes",
                                "Encryption failure",
                                "Fast response",
                                "Database error"
                        ],
                        "correct": 0,
                        "explanation": "Cold starts occur when functions are idle. They cause initial latency.",
                        "difficulty": "Medium",
                        "topic": "Service Models"
                },
                {
                        "id": 93,
                        "question": "What is event-driven architecture?",
                        "options": [
                                "Triggered by events",
                                "Time-based execution",
                                "Manual execution",
                                "Database-driven execution"
                        ],
                        "correct": 0,
                        "explanation": "Events trigger functions automatically. It improves scalability.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 94,
                        "question": "What is cloud-native application?",
                        "options": [
                                "Desktop app",
                                "Traditional app",
                                "Built specifically for cloud environments",
                                "Offline app"
                        ],
                        "correct": 2,
                        "explanation": "Cloud-native apps leverage cloud features. They are scalable and resilient.",
                        "difficulty": "Easy",
                        "topic": "Architecture"
                },
                {
                        "id": 95,
                        "question": "What is service mesh?",
                        "options": [
                                "Web server",
                                "Storage system",
                                "Infrastructure layer for service communication",
                                "Database"
                        ],
                        "correct": 2,
                        "explanation": "Service mesh manages microservices communication. It improves security and observability.",
                        "difficulty": "Medium",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 96,
                        "question": "What is observability?",
                        "options": [
                                "Monitoring system behavior using metrics, logs, traces",
                                "Scaling servers",
                                "Deleting logs",
                                "Encrypting data"
                        ],
                        "correct": 0,
                        "explanation": "Observability helps diagnose issues. It improves reliability.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 97,
                        "question": "What is fault tolerance?",
                        "options": [
                                "Ability to continue operation despite failures",
                                "Encrypting data",
                                "Deleting data",
                                "System failure"
                        ],
                        "correct": 0,
                        "explanation": "Fault tolerance ensures reliability. Systems recover from failures.",
                        "difficulty": "Easy",
                        "topic": "Architecture"
                },
                {
                        "id": 98,
                        "question": "What is high availability?",
                        "options": [
                                "Data deletion",
                                "System operational most of the time",
                                "Encryption",
                                "Frequent downtime"
                        ],
                        "correct": 1,
                        "explanation": "High availability ensures minimal downtime. It improves reliability.",
                        "difficulty": "Easy",
                        "topic": "Architecture"
                },
                {
                        "id": 99,
                        "question": "What is cloud governance?",
                        "options": [
                                "Managing cloud usage and compliance",
                                "Ignoring policies",
                                "Encrypting data",
                                "Deleting resources"
                        ],
                        "correct": 0,
                        "explanation": "Governance ensures policy compliance. It controls costs and security.",
                        "difficulty": "Easy",
                        "topic": "DevOps & Management"
                },
                {
                        "id": 102,
                        "question": "What is multi-cloud strategy?",
                        "options": [
                                "Using private cloud only",
                                "Using offline systems",
                                "Using multiple cloud providers",
                                "Using one cloud provider"
                        ],
                        "correct": 2,
                        "explanation": "Multi-cloud improves reliability and avoids dependency on one vendor. It enhances resilience.",
                        "difficulty": "Medium",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 103,
                        "question": "What is cloud interoperability?",
                        "options": [
                                "Incompatible systems",
                                "Ability of different cloud systems to work together",
                                "Local network",
                                "Database integration only"
                        ],
                        "correct": 1,
                        "explanation": "Interoperability enables seamless data and application exchange. It supports multi-cloud strategies.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 104,
                        "question": "What is cloud portability?",
                        "options": [
                                "Local storage",
                                "Ability to move apps between clouds",
                                "Database backup",
                                "Data cannot be moved"
                        ],
                        "correct": 1,
                        "explanation": "Portability reduces vendor lock-in. It enables migration across providers.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 105,
                        "question": "What is cloud broker?",
                        "options": [
                                "Hypervisor",
                                "Database tool",
                                "Intermediary managing cloud services",
                                "Storage device"
                        ],
                        "correct": 2,
                        "explanation": "Cloud brokers help manage multiple providers. They optimize cost and performance.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 106,
                        "question": "What is API gateway?",
                        "options": [
                                "Database gateway",
                                "Security firewall",
                                "Storage gateway",
                                "Entry point for API requests"
                        ],
                        "correct": 3,
                        "explanation": "API gateways manage routing, authentication, and rate limiting. They simplify microservices communication.",
                        "difficulty": "Medium",
                        "topic": "Network & Security"
                },
                {
                        "id": 107,
                        "question": "What is service discovery?",
                        "options": [
                                "Manual configuration",
                                "Automatic detection of services in a network",
                                "Finding databases",
                                "Data encryption"
                        ],
                        "correct": 1,
                        "explanation": "Service discovery enables dynamic service communication. It supports microservices architecture.",
                        "difficulty": "Medium",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 108,
                        "question": "What is container orchestration?",
                        "options": [
                                "Managing container deployment and scaling",
                                "Deleting containers",
                                "Running single container",
                                "Encrypting containers"
                        ],
                        "correct": 0,
                        "explanation": "Orchestration automates container lifecycle. Kubernetes is a common tool.",
                        "difficulty": "Hard",
                        "topic": "Virtualization"
                },
                {
                        "id": 109,
                        "question": "What is rolling deployment?",
                        "options": [
                                "Gradually updating instances",
                                "Deleting instances",
                                "Encrypting instances",
                                "Deploy all at once"
                        ],
                        "correct": 0,
                        "explanation": "Rolling deployments update services gradually. They minimize downtime.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 110,
                        "question": "What is immutable infrastructure?",
                        "options": [
                                "Deleting servers",
                                "Encrypting servers",
                                "Changing servers manually",
                                "Replacing servers instead of modifying"
                        ],
                        "correct": 3,
                        "explanation": "Immutable infrastructure improves consistency. It reduces configuration drift.",
                        "difficulty": "Medium",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 111,
                        "question": "What is configuration drift?",
                        "options": [
                                "Data encryption",
                                "Network failure",
                                "Differences between environments over time",
                                "Consistent configuration"
                        ],
                        "correct": 2,
                        "explanation": "Drift causes inconsistencies. Automation prevents it.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 112,
                        "question": "What is secrets management?",
                        "options": [
                                "Storing passwords in code",
                                "Deleting credentials",
                                "Encrypting hardware",
                                "Secure storage of sensitive credentials"
                        ],
                        "correct": 3,
                        "explanation": "Secrets management protects credentials. Tools include AWS Secrets Manager.",
                        "difficulty": "Medium",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 113,
                        "question": "What is key management service (KMS)?",
                        "options": [
                                "Load balancer",
                                "Storage service",
                                "Database tool",
                                "Service to manage encryption keys"
                        ],
                        "correct": 3,
                        "explanation": "KMS securely stores encryption keys. It supports data protection.",
                        "difficulty": "Medium",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 114,
                        "question": "What is zero trust security model?",
                        "options": [
                                "Allow public access",
                                "Disable authentication",
                                "Trust all users",
                                "Verify every access request"
                        ],
                        "correct": 3,
                        "explanation": "Zero trust requires verification for all access. It enhances security.",
                        "difficulty": "Hard",
                        "topic": "Network & Security"
                },
                {
                        "id": 115,
                        "question": "What is DDoS protection in cloud?",
                        "options": [
                                "Deleting traffic",
                                "Protecting against traffic flooding attacks",
                                "Scaling servers",
                                "Encrypting data"
                        ],
                        "correct": 1,
                        "explanation": "Cloud providers mitigate DDoS attacks. They ensure service availability.",
                        "difficulty": "Medium",
                        "topic": "Network & Security"
                },
                {
                        "id": 116,
                        "question": "What is WAF (Web Application Firewall)?",
                        "options": [
                                "Database firewall",
                                "Network cable",
                                "Protects web applications from attacks",
                                "Storage firewall"
                        ],
                        "correct": 2,
                        "explanation": "WAF filters HTTP traffic. It blocks malicious requests.",
                        "difficulty": "Easy",
                        "topic": "Network & Security"
                },
                {
                        "id": 117,
                        "question": "What is SIEM?",
                        "options": [
                                "Security Information and Event Management",
                                "Server Infrastructure Execution Model",
                                "Secure Internet Email Management",
                                "System Integration Event Module"
                        ],
                        "correct": 0,
                        "explanation": "SIEM collects and analyzes security events. It helps detect threats.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 118,
                        "question": "What is threat modeling?",
                        "options": [
                                "Identifying and mitigating security risks",
                                "Ignoring threats",
                                "Deleting threats",
                                "Encrypting threats"
                        ],
                        "correct": 0,
                        "explanation": "Threat modeling improves security planning. It identifies vulnerabilities.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 119,
                        "question": "What is penetration testing?",
                        "options": [
                                "Encrypting systems",
                                "Scaling servers",
                                "Simulating attacks to find vulnerabilities",
                                "Deleting data"
                        ],
                        "correct": 2,
                        "explanation": "Pen testing identifies security weaknesses. It improves defense.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 120,
                        "question": "What is cloud audit?",
                        "options": [
                                "Reviewing cloud usage and compliance",
                                "Deleting data",
                                "Encrypting logs",
                                "Ignoring logs"
                        ],
                        "correct": 0,
                        "explanation": "Audits ensure compliance and security. They detect misuse.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 121,
                        "question": "What is edge location in cloud CDN?",
                        "options": [
                                "Storage device",
                                "Central server",
                                "Data center near users",
                                "Database server"
                        ],
                        "correct": 2,
                        "explanation": "Edge locations reduce latency. They deliver content faster.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 122,
                        "question": "What is cold start mitigation?",
                        "options": [
                                "Deleting functions",
                                "Increasing delay",
                                "Encrypting functions",
                                "Keeping functions warm"
                        ],
                        "correct": 3,
                        "explanation": "Warm functions reduce latency. They improve performance.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 123,
                        "question": "What is function timeout in serverless?",
                        "options": [
                                "Database timeout",
                                "Maximum execution time limit",
                                "Unlimited execution",
                                "Network timeout"
                        ],
                        "correct": 1,
                        "explanation": "Timeouts prevent runaway processes. They control costs.",
                        "difficulty": "Easy",
                        "topic": "Service Models"
                },
                {
                        "id": 124,
                        "question": "What is API throttling?",
                        "options": [
                                "Limiting request rate",
                                "Encrypting requests",
                                "Deleting requests",
                                "Increasing requests"
                        ],
                        "correct": 0,
                        "explanation": "Throttling protects APIs. It prevents abuse.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 125,
                        "question": "What is message queue?",
                        "options": [
                                "Storage system",
                                "Load balancer",
                                "Service for asynchronous communication",
                                "Database table"
                        ],
                        "correct": 2,
                        "explanation": "Message queues decouple services. They improve scalability.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 126,
                        "question": "What is publish/subscribe model?",
                        "options": [
                                "Messaging pattern with publishers and subscribers",
                                "Direct communication",
                                "Storage method",
                                "Database replication"
                        ],
                        "correct": 0,
                        "explanation": "Pub/Sub enables event-driven systems. It improves scalability.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 127,
                        "question": "What is event sourcing?",
                        "options": [
                                "Encrypting events",
                                "Storing sequence of events",
                                "Deleting events",
                                "Storing final state only"
                        ],
                        "correct": 1,
                        "explanation": "Event sourcing tracks changes over time. It improves traceability.",
                        "difficulty": "Hard",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 128,
                        "question": "What is CQRS?",
                        "options": [
                                "Cloud Query Resource System",
                                "Cloud Quality Routing Service",
                                "Central Queue Response System",
                                "Command Query Responsibility Segregation"
                        ],
                        "correct": 3,
                        "explanation": "CQRS separates read and write operations. It improves performance.",
                        "difficulty": "Hard",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 129,
                        "question": "What is cloud-native security?",
                        "options": [
                                "Traditional security",
                                "Security designed for cloud environments",
                                "Local firewall",
                                "Offline security"
                        ],
                        "correct": 1,
                        "explanation": "Cloud-native security uses automation and monitoring. It improves protection.",
                        "difficulty": "Easy",
                        "topic": "Network & Security"
                },
                {
                        "id": 130,
                        "question": "What is data encryption at rest?",
                        "options": [
                                "Encryption during transmission",
                                "Encryption in CPU",
                                "Encryption of stored data",
                                "Encryption in RAM"
                        ],
                        "correct": 2,
                        "explanation": "Encryption at rest protects stored data. It prevents unauthorized access.",
                        "difficulty": "Medium",
                        "topic": "Network & Security"
                },
                {
                        "id": 131,
                        "question": "What is encryption in transit?",
                        "options": [
                                "Encrypt data during transmission",
                                "Encrypt RAM",
                                "Encrypt stored data",
                                "Encrypt CPU"
                        ],
                        "correct": 0,
                        "explanation": "Encryption in transit protects data from interception. It uses TLS.",
                        "difficulty": "Easy",
                        "topic": "Network & Security"
                },
                {
                        "id": 132,
                        "question": "What is TLS?",
                        "options": [
                                "Transmission Link System",
                                "Total Load Security",
                                "Trusted Login Service",
                                "Transport Layer Security"
                        ],
                        "correct": 3,
                        "explanation": "TLS encrypts network communication. It secures web traffic.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 133,
                        "question": "What is certificate authority (CA)?",
                        "options": [
                                "Storage provider",
                                "Network switch",
                                "Entity issuing digital certificates",
                                "Database authority"
                        ],
                        "correct": 2,
                        "explanation": "CAs verify identities. They enable secure connections.",
                        "difficulty": "Easy",
                        "topic": "Network & Security"
                },
                {
                        "id": 134,
                        "question": "What is autoscaling cooldown period?",
                        "options": [
                                "Scaling delay",
                                "Network delay",
                                "Time between scaling actions",
                                "Database timeout"
                        ],
                        "correct": 2,
                        "explanation": "Cooldown prevents rapid scaling. It stabilizes systems.",
                        "difficulty": "Easy",
                        "topic": "Architecture"
                },
                {
                        "id": 135,
                        "question": "What is failover?",
                        "options": [
                                "Data deletion",
                                "Switching to backup system",
                                "Encryption",
                                "System crash"
                        ],
                        "correct": 1,
                        "explanation": "Failover ensures continuity. It activates backup systems.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 136,
                        "question": "What is disaster recovery site?",
                        "options": [
                                "Database cluster",
                                "Primary data center",
                                "Load balancer",
                                "Backup site for recovery"
                        ],
                        "correct": 3,
                        "explanation": "DR sites restore operations after disasters. They ensure business continuity.",
                        "difficulty": "Medium",
                        "topic": "Architecture"
                },
                {
                        "id": 137,
                        "question": "What is RTO?",
                        "options": [
                                "Runtime Transfer Option",
                                "Remote Task Operation",
                                "Recovery Time Objective",
                                "Resource Transfer Operation"
                        ],
                        "correct": 2,
                        "explanation": "RTO defines acceptable downtime. It guides recovery planning.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 138,
                        "question": "What is RPO?",
                        "options": [
                                "Remote Processing Option",
                                "Resource Protection Operation",
                                "Recovery Point Objective",
                                "Runtime Performance Output"
                        ],
                        "correct": 2,
                        "explanation": "RPO defines acceptable data loss. It guides backup frequency.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 139,
                        "question": "What is cloud workload?",
                        "options": [
                                "Hardware",
                                "Application or service running in cloud",
                                "Database",
                                "Network cable"
                        ],
                        "correct": 1,
                        "explanation": "Workloads include apps and services. They consume cloud resources.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 140,
                        "question": "What is container image?",
                        "options": [
                                "Network packet",
                                "Database",
                                "Snapshot of container environment",
                                "Running container"
                        ],
                        "correct": 2,
                        "explanation": "Images contain app and dependencies. Containers run from images.",
                        "difficulty": "Easy",
                        "topic": "Virtualization"
                },
                {
                        "id": 141,
                        "question": "What is blue/green environment?",
                        "options": [
                                "Database replication",
                                "Load balancing",
                                "Single deployment",
                                "Two identical environments for deployment"
                        ],
                        "correct": 3,
                        "explanation": "Blue/green deployment ensures zero downtime. Traffic switches between environments.",
                        "difficulty": "Medium",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 142,
                        "question": "What is autoscaling policy?",
                        "options": [
                                "Manual scaling",
                                "Rules defining scaling behavior",
                                "Database policy",
                                "Security rule"
                        ],
                        "correct": 1,
                        "explanation": "Policies define when to scale. They optimize performance.",
                        "difficulty": "Easy",
                        "topic": "Architecture"
                },
                {
                        "id": 143,
                        "question": "What is cloud sandbox testing?",
                        "options": [
                                "Network testing",
                                "Database testing",
                                "Safe environment for experimentation",
                                "Production testing"
                        ],
                        "correct": 2,
                        "explanation": "Sandboxes prevent affecting production. They allow safe testing.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 144,
                        "question": "What is green computing in cloud?",
                        "options": [
                                "Energy-efficient computing",
                                "Deleting servers",
                                "Using more energy",
                                "Encrypting data"
                        ],
                        "correct": 0,
                        "explanation": "Green computing reduces environmental impact. Cloud optimizes resource usage.",
                        "difficulty": "Medium",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 145,
                        "question": "What is cloud elasticity vs scalability?",
                        "options": [
                                "Same concept",
                                "Scalability is automatic",
                                "Elasticity is manual",
                                "Elasticity is automatic scaling, scalability is planned scaling"
                        ],
                        "correct": 3,
                        "explanation": "Elasticity responds automatically. Scalability prepares for growth.",
                        "difficulty": "Easy",
                        "topic": "Architecture"
                },
                {
                        "id": 146,
                        "question": "What is a bastion host?",
                        "options": [
                                "Database server",
                                "Storage device",
                                "Load balancer",
                                "Secure gateway to access private network"
                        ],
                        "correct": 3,
                        "explanation": "Bastion hosts secure remote access. They protect internal resources.",
                        "difficulty": "Easy",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 147,
                        "question": "What is cloud-native CI/CD?",
                        "options": [
                                "Network monitoring",
                                "Database replication",
                                "Manual deployment",
                                "Automated pipeline in cloud environment"
                        ],
                        "correct": 3,
                        "explanation": "Cloud-native CI/CD automates builds and deployments. It improves agility.",
                        "difficulty": "Easy",
                        "topic": "Architecture"
                },
                {
                        "id": 148,
                        "question": "What is serverless event trigger?",
                        "options": [
                                "Automatic function execution on event",
                                "Network request",
                                "Database query",
                                "Manual function execution"
                        ],
                        "correct": 0,
                        "explanation": "Events trigger serverless functions. It supports automation.",
                        "difficulty": "Easy",
                        "topic": "Service Models"
                },
                {
                        "id": 149,
                        "question": "What is observability pillar?",
                        "options": [
                                "Encryption",
                                "Storage",
                                "Metrics, logs, traces",
                                "Networking"
                        ],
                        "correct": 2,
                        "explanation": "Observability uses metrics, logs, and traces. It helps diagnose issues.",
                        "difficulty": "Medium",
                        "topic": "Cloud Concepts"
                },
                {
                        "id": 150,
                        "question": "What is the main goal of cloud computing?",
                        "options": [
                                "Provide scalable, reliable, and cost-efficient computing",
                                "Remove security",
                                "Reduce performance",
                                "Increase hardware usage"
                        ],
                        "correct": 0,
                        "explanation": "Cloud computing improves scalability and reliability. It reduces infrastructure costs.",
                        "difficulty": "Medium",
                        "topic": "Cloud Concepts"
                }
        ],
        "cyber": [
                {
                        "id": 1,
                        "question": "What is cybersecurity?",
                        "options": [
                                "Protecting hardware only",
                                "Managing databases",
                                "Protecting systems, networks, and data from attacks",
                                "Designing websites"
                        ],
                        "correct": 2,
                        "explanation": "Cybersecurity safeguards digital assets from unauthorized access and attacks. It ensures confidentiality, integrity, and availability.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 2,
                        "question": "What does CIA triad stand for?",
                        "options": [
                                "Control, Integrity, Access",
                                "Confidentiality, Integrity, Availability",
                                "Cyber, Internet, Access",
                                "Control, Internet, Authorization"
                        ],
                        "correct": 1,
                        "explanation": "CIA triad defines core security principles. It ensures data protection and system reliability.",
                        "difficulty": "Easy",
                        "topic": "Core Concepts"
                },
                {
                        "id": 3,
                        "question": "What is confidentiality?",
                        "options": [
                                "Data availability",
                                "Data duplication",
                                "Data accuracy",
                                "Protecting data from unauthorized access"
                        ],
                        "correct": 3,
                        "explanation": "Confidentiality ensures only authorized users access data. Encryption supports this principle.",
                        "difficulty": "Easy",
                        "topic": "Core Concepts"
                },
                {
                        "id": 4,
                        "question": "What is integrity in cybersecurity?",
                        "options": [
                                "Data storage",
                                "Data encryption",
                                "Data deletion",
                                "Ensuring data accuracy and consistency"
                        ],
                        "correct": 3,
                        "explanation": "Integrity ensures data remains unchanged and trustworthy. Hashing helps verify integrity.",
                        "difficulty": "Easy",
                        "topic": "Core Concepts"
                },
                {
                        "id": 5,
                        "question": "What is availability?",
                        "options": [
                                "Blocking users",
                                "Encrypting data",
                                "Data deletion",
                                "Ensuring systems are accessible when needed"
                        ],
                        "correct": 3,
                        "explanation": "Availability ensures users can access systems. Redundancy improves availability.",
                        "difficulty": "Easy",
                        "topic": "Core Concepts"
                },
                {
                        "id": 6,
                        "question": "What is a firewall?",
                        "options": [
                                "Database",
                                "Web server",
                                "Network security device filtering traffic",
                                "Programming language"
                        ],
                        "correct": 2,
                        "explanation": "Firewalls control incoming and outgoing traffic. They enforce security rules.",
                        "difficulty": "Easy",
                        "topic": "Network Security"
                },
                {
                        "id": 7,
                        "question": "What is malware?",
                        "options": [
                                "Network protocol",
                                "Database",
                                "Malicious software",
                                "Security tool"
                        ],
                        "correct": 2,
                        "explanation": "Malware includes viruses, worms, and ransomware. It harms systems and data.",
                        "difficulty": "Easy",
                        "topic": "Threats & Attacks"
                },
                {
                        "id": 8,
                        "question": "What is a virus?",
                        "options": [
                                "Encryption method",
                                "Self-replicating malware attached to files",
                                "Firewall",
                                "Network device"
                        ],
                        "correct": 1,
                        "explanation": "Viruses spread by attaching to files. They execute when the file runs.",
                        "difficulty": "Easy",
                        "topic": "Threats & Attacks"
                },
                {
                        "id": 9,
                        "question": "What is a worm?",
                        "options": [
                                "Requires host file",
                                "Self-spreading malware",
                                "Encryption tool",
                                "Firewall rule"
                        ],
                        "correct": 1,
                        "explanation": "Worms spread across networks without user action. They exploit vulnerabilities.",
                        "difficulty": "Easy",
                        "topic": "Threats & Attacks"
                },
                {
                        "id": 10,
                        "question": "What is ransomware?",
                        "options": [
                                "Software update",
                                "Malware that encrypts data for payment",
                                "Firewall rule",
                                "Network protocol"
                        ],
                        "correct": 1,
                        "explanation": "Ransomware locks files until payment is made. Backups help recovery.",
                        "difficulty": "Easy",
                        "topic": "Threats & Attacks"
                },
                {
                        "id": 11,
                        "question": "What is phishing?",
                        "options": [
                                "Encryption method",
                                "Firewall configuration",
                                "Fraudulent attempt to obtain sensitive data",
                                "Network attack"
                        ],
                        "correct": 2,
                        "explanation": "Phishing uses fake messages to steal credentials. User awareness prevents attacks.",
                        "difficulty": "Easy",
                        "topic": "Threats & Attacks"
                },
                {
                        "id": 12,
                        "question": "What is social engineering?",
                        "options": [
                                "Encryption method",
                                "Firewall rule",
                                "Programming technique",
                                "Manipulating people to reveal information"
                        ],
                        "correct": 3,
                        "explanation": "Social engineering exploits human behavior. Training helps prevent it.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 13,
                        "question": "What is a strong password?",
                        "options": [
                                "Short and simple",
                                "Long and complex",
                                "Same as username",
                                "Only numbers"
                        ],
                        "correct": 1,
                        "explanation": "Strong passwords include letters, numbers, and symbols. They resist brute-force attacks.",
                        "difficulty": "Easy",
                        "topic": "Identity & Access"
                },
                {
                        "id": 14,
                        "question": "What is multi-factor authentication (MFA)?",
                        "options": [
                                "Single password login",
                                "Encryption method",
                                "Multiple verification methods",
                                "Firewall rule"
                        ],
                        "correct": 2,
                        "explanation": "MFA adds extra security layers. It combines passwords with OTP or biometrics.",
                        "difficulty": "Easy",
                        "topic": "Core Concepts"
                },
                {
                        "id": 15,
                        "question": "What is encryption?",
                        "options": [
                                "Data deletion",
                                "Compressing data",
                                "Converting data into secure format",
                                "Copying data"
                        ],
                        "correct": 2,
                        "explanation": "Encryption protects data confidentiality. Only authorized parties can decrypt.",
                        "difficulty": "Easy",
                        "topic": "Cryptography"
                },
                {
                        "id": 16,
                        "question": "What is decryption?",
                        "options": [
                                "Deleting data",
                                "Compressing data",
                                "Encrypting data",
                                "Converting encrypted data back to original"
                        ],
                        "correct": 3,
                        "explanation": "Decryption restores readable data. It requires the correct key.",
                        "difficulty": "Easy",
                        "topic": "Cryptography"
                },
                {
                        "id": 17,
                        "question": "What is symmetric encryption?",
                        "options": [
                                "Public key only",
                                "No keys used",
                                "Different keys for encryption/decryption",
                                "Same key for encryption and decryption"
                        ],
                        "correct": 3,
                        "explanation": "Symmetric encryption uses one shared key. It is fast but requires secure key sharing.",
                        "difficulty": "Easy",
                        "topic": "Cryptography"
                },
                {
                        "id": 18,
                        "question": "What is asymmetric encryption?",
                        "options": [
                                "No encryption",
                                "Single password",
                                "Same key for encryption",
                                "Public and private key pair"
                        ],
                        "correct": 3,
                        "explanation": "Asymmetric encryption uses two keys. It improves secure communication.",
                        "difficulty": "Easy",
                        "topic": "Cryptography"
                },
                {
                        "id": 19,
                        "question": "What is a digital signature?",
                        "options": [
                                "Password",
                                "Handwritten signature",
                                "Firewall rule",
                                "Electronic method to verify authenticity"
                        ],
                        "correct": 3,
                        "explanation": "Digital signatures ensure integrity and authenticity. They use cryptography.",
                        "difficulty": "Easy",
                        "topic": "Cryptography"
                },
                {
                        "id": 20,
                        "question": "What is hashing?",
                        "options": [
                                "Encryption method",
                                "Data deletion",
                                "Converting data into fixed-length value",
                                "Data copying"
                        ],
                        "correct": 2,
                        "explanation": "Hashing verifies data integrity. Hash values change if data is altered.",
                        "difficulty": "Easy",
                        "topic": "Cryptography"
                },
                {
                        "id": 21,
                        "question": "What is brute-force attack?",
                        "options": [
                                "Network monitoring",
                                "Guessing passwords using trial and error",
                                "Encrypting data",
                                "Firewall configuration"
                        ],
                        "correct": 1,
                        "explanation": "Brute-force tries many combinations. Strong passwords prevent it.",
                        "difficulty": "Easy",
                        "topic": "Threats & Attacks"
                },
                {
                        "id": 22,
                        "question": "What is a DDoS attack?",
                        "options": [
                                "Password cracking",
                                "Data encryption",
                                "Overloading system with traffic",
                                "Firewall rule"
                        ],
                        "correct": 2,
                        "explanation": "DDoS floods servers. It disrupts services.",
                        "difficulty": "Easy",
                        "topic": "Threats & Attacks"
                },
                {
                        "id": 23,
                        "question": "What is a botnet?",
                        "options": [
                                "Security tool",
                                "Encryption method",
                                "Firewall rule",
                                "Network of infected devices"
                        ],
                        "correct": 3,
                        "explanation": "Botnets perform coordinated attacks. They are controlled remotely.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 24,
                        "question": "What is spyware?",
                        "options": [
                                "Malware that collects user information",
                                "Security software",
                                "Encryption tool",
                                "Firewall"
                        ],
                        "correct": 0,
                        "explanation": "Spyware monitors user activity. It steals sensitive data.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 25,
                        "question": "What is adware?",
                        "options": [
                                "Firewall rule",
                                "Encryption tool",
                                "Displays unwanted advertisements",
                                "Network protocol"
                        ],
                        "correct": 2,
                        "explanation": "Adware shows intrusive ads. It may track user behavior.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 26,
                        "question": "What is a Trojan horse?",
                        "options": [
                                "Malware disguised as legitimate software",
                                "Self-replicating malware",
                                "Firewall rule",
                                "Encryption tool"
                        ],
                        "correct": 0,
                        "explanation": "Trojans trick users into installing them. They create backdoors.",
                        "difficulty": "Easy",
                        "topic": "Threats & Attacks"
                },
                {
                        "id": 27,
                        "question": "What is a backdoor?",
                        "options": [
                                "Hidden access to system",
                                "Firewall rule",
                                "Encryption method",
                                "Secure login"
                        ],
                        "correct": 0,
                        "explanation": "Backdoors bypass authentication. Attackers use them for access.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 28,
                        "question": "What is patch management?",
                        "options": [
                                "Encrypting data",
                                "Scaling servers",
                                "Deleting software",
                                "Updating software to fix vulnerabilities"
                        ],
                        "correct": 3,
                        "explanation": "Patches fix security flaws. Regular updates improve protection.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 29,
                        "question": "What is vulnerability?",
                        "options": [
                                "Encryption method",
                                "Security strength",
                                "Firewall rule",
                                "Weakness exploitable by attackers"
                        ],
                        "correct": 3,
                        "explanation": "Vulnerabilities expose systems to threats. Regular scanning identifies them.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 30,
                        "question": "What is penetration testing?",
                        "options": [
                                "Deleting data",
                                "Scaling servers",
                                "Encrypting data",
                                "Simulating attacks to find weaknesses"
                        ],
                        "correct": 3,
                        "explanation": "Pen testing identifies vulnerabilities. It improves defenses.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 31,
                        "question": "What is network sniffing?",
                        "options": [
                                "Monitoring network packets",
                                "Encrypting traffic",
                                "Blocking traffic",
                                "Deleting packets"
                        ],
                        "correct": 0,
                        "explanation": "Sniffing analyzes traffic. It helps detect threats.",
                        "difficulty": "Easy",
                        "topic": "Network Security"
                },
                {
                        "id": 32,
                        "question": "What is spoofing?",
                        "options": [
                                "Network protocol",
                                "Firewall rule",
                                "Data encryption",
                                "Impersonating another device/user"
                        ],
                        "correct": 3,
                        "explanation": "Spoofing falsifies identity. It enables attacks.",
                        "difficulty": "Easy",
                        "topic": "Threats & Attacks"
                },
                {
                        "id": 33,
                        "question": "What is man-in-the-middle attack?",
                        "options": [
                                "Firewall rule",
                                "Intercepting communication between parties",
                                "Encryption method",
                                "Direct attack"
                        ],
                        "correct": 1,
                        "explanation": "MITM attackers intercept data. Encryption prevents this.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 34,
                        "question": "What is secure protocol for web browsing?",
                        "options": [
                                "FTP",
                                "HTTPS",
                                "SMTP",
                                "HTTP"
                        ],
                        "correct": 1,
                        "explanation": "HTTPS uses encryption. It protects data in transit.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 35,
                        "question": "What is SSL/TLS?",
                        "options": [
                                "Database",
                                "Network cable",
                                "Encryption protocols",
                                "Firewall rule"
                        ],
                        "correct": 2,
                        "explanation": "SSL/TLS secure communication. They encrypt data.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 36,
                        "question": "What is VPN?",
                        "options": [
                                "Verified Private Node",
                                "Virtual Processing Network",
                                "Virtual Private Network",
                                "Variable Public Network"
                        ],
                        "correct": 2,
                        "explanation": "VPN encrypts internet traffic. It protects privacy.",
                        "difficulty": "Easy",
                        "topic": "Network Security"
                },
                {
                        "id": 37,
                        "question": "What is endpoint security?",
                        "options": [
                                "Network firewall",
                                "Cloud storage",
                                "Database security",
                                "Protecting devices like laptops and phones"
                        ],
                        "correct": 3,
                        "explanation": "Endpoint security protects user devices. It prevents malware.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 38,
                        "question": "What is antivirus software?",
                        "options": [
                                "Database tool",
                                "Firewall rule",
                                "Software to detect and remove malware",
                                "Encryption method"
                        ],
                        "correct": 2,
                        "explanation": "Antivirus scans for threats. It protects systems.",
                        "difficulty": "Easy",
                        "topic": "Threats & Attacks"
                },
                {
                        "id": 39,
                        "question": "What is spam?",
                        "options": [
                                "Unwanted messages",
                                "Legitimate email",
                                "Encryption tool",
                                "Firewall rule"
                        ],
                        "correct": 0,
                        "explanation": "Spam clutters inboxes. It may contain phishing attempts.",
                        "difficulty": "Easy",
                        "topic": "Identity & Access"
                },
                {
                        "id": 40,
                        "question": "What is data breach?",
                        "options": [
                                "Encryption method",
                                "Unauthorized access to data",
                                "Secure data transfer",
                                "Database backup"
                        ],
                        "correct": 1,
                        "explanation": "Data breaches expose sensitive information. Security controls prevent them.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 41,
                        "question": "What is least privilege principle?",
                        "options": [
                                "Maximum access",
                                "Minimum necessary access",
                                "No access",
                                "Full admin rights"
                        ],
                        "correct": 1,
                        "explanation": "Least privilege reduces risk. Users get only needed permissions.",
                        "difficulty": "Easy",
                        "topic": "Core Concepts"
                },
                {
                        "id": 42,
                        "question": "What is access control?",
                        "options": [
                                "Backup",
                                "Encryption",
                                "Restricting system access",
                                "Data deletion"
                        ],
                        "correct": 2,
                        "explanation": "Access control ensures authorized usage. It uses authentication and authorization.",
                        "difficulty": "Easy",
                        "topic": "Identity & Access"
                },
                {
                        "id": 43,
                        "question": "What is role-based access control (RBAC)?",
                        "options": [
                                "Access based on user roles",
                                "No access",
                                "Open access",
                                "Access based on passwords"
                        ],
                        "correct": 0,
                        "explanation": "RBAC assigns permissions by role. It simplifies management.",
                        "difficulty": "Easy",
                        "topic": "Identity & Access"
                },
                {
                        "id": 44,
                        "question": "What is audit log?",
                        "options": [
                                "Record of system activities",
                                "Database",
                                "Encryption tool",
                                "Firewall rule"
                        ],
                        "correct": 0,
                        "explanation": "Audit logs track actions. They support compliance.",
                        "difficulty": "Easy",
                        "topic": "Governance & Compliance"
                },
                {
                        "id": 45,
                        "question": "What is security policy?",
                        "options": [
                                "Database rule",
                                "Encryption method",
                                "Firewall device",
                                "Guidelines for protecting systems"
                        ],
                        "correct": 3,
                        "explanation": "Security policies define rules. They ensure consistent protection.",
                        "difficulty": "Easy",
                        "topic": "Governance & Compliance"
                },
                {
                        "id": 46,
                        "question": "What is incident response?",
                        "options": [
                                "Deleting data",
                                "Ignoring attacks",
                                "Handling security breaches",
                                "Encrypting data"
                        ],
                        "correct": 2,
                        "explanation": "Incident response manages security events. It minimizes damage.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 47,
                        "question": "What is backup in cybersecurity?",
                        "options": [
                                "Encrypting data",
                                "Deleting data",
                                "Copying data for recovery",
                                "Scaling servers"
                        ],
                        "correct": 2,
                        "explanation": "Backups protect against data loss. They enable recovery.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 48,
                        "question": "What is disaster recovery?",
                        "options": [
                                "Ignoring failures",
                                "Scaling servers",
                                "Encrypting data",
                                "Restoring systems after incidents"
                        ],
                        "correct": 3,
                        "explanation": "Disaster recovery ensures continuity. It restores operations.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 49,
                        "question": "What is security awareness training?",
                        "options": [
                                "Technical training only",
                                "Educating users about security threats",
                                "Deleting logs",
                                "Encrypting data"
                        ],
                        "correct": 1,
                        "explanation": "Training reduces human errors. Users learn to avoid threats.",
                        "difficulty": "Easy",
                        "topic": "Governance & Compliance"
                },
                {
                        "id": 52,
                        "question": "What is a zero-day exploit?",
                        "options": [
                                "Security patch",
                                "Firewall rule",
                                "Encryption method",
                                "Attack exploiting unknown vulnerability"
                        ],
                        "correct": 3,
                        "explanation": "Attackers exploit zero-day flaws before fixes. It leaves systems exposed.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 53,
                        "question": "What is a rootkit?",
                        "options": [
                                "Security tool",
                                "Firewall rule",
                                "Encryption method",
                                "Malware hiding its presence"
                        ],
                        "correct": 3,
                        "explanation": "Rootkits conceal malicious activity. They provide persistent access.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 54,
                        "question": "What is keylogging?",
                        "options": [
                                "Network protocol",
                                "Firewall rule",
                                "Encrypting keys",
                                "Recording keystrokes secretly"
                        ],
                        "correct": 3,
                        "explanation": "Keyloggers capture passwords and sensitive data. They compromise accounts.",
                        "difficulty": "Easy",
                        "topic": "Cryptography"
                },
                {
                        "id": 55,
                        "question": "What is session hijacking?",
                        "options": [
                                "Creating session",
                                "Ending session",
                                "Taking over active session",
                                "Encrypting session"
                        ],
                        "correct": 2,
                        "explanation": "Attackers steal session tokens. They impersonate users.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 56,
                        "question": "What is DNS spoofing?",
                        "options": [
                                "Database attack",
                                "Firewall rule",
                                "Redirecting users to fake sites",
                                "Encrypting DNS"
                        ],
                        "correct": 2,
                        "explanation": "DNS spoofing manipulates domain resolution. It leads to phishing.",
                        "difficulty": "Easy",
                        "topic": "Threats & Attacks"
                },
                {
                        "id": 57,
                        "question": "What is ARP spoofing?",
                        "options": [
                                "Encrypting ARP",
                                "Firewall rule",
                                "Associating attacker MAC with victim IP",
                                "DNS attack"
                        ],
                        "correct": 2,
                        "explanation": "ARP spoofing enables MITM attacks. It intercepts network traffic.",
                        "difficulty": "Easy",
                        "topic": "Threats & Attacks"
                },
                {
                        "id": 58,
                        "question": "What is a replay attack?",
                        "options": [
                                "Deleting data",
                                "Encrypting packets",
                                "Blocking packets",
                                "Reusing captured data packets"
                        ],
                        "correct": 3,
                        "explanation": "Replay attacks reuse valid transmissions. Nonces prevent them.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 59,
                        "question": "What is salting in password security?",
                        "options": [
                                "Compressing passwords",
                                "Deleting passwords",
                                "Adding random data before hashing",
                                "Encrypting passwords"
                        ],
                        "correct": 2,
                        "explanation": "Salting prevents rainbow table attacks. It enhances password security.",
                        "difficulty": "Easy",
                        "topic": "Identity & Access"
                },
                {
                        "id": 60,
                        "question": "What is rainbow table attack?",
                        "options": [
                                "Network scanning",
                                "Using precomputed hashes to crack passwords",
                                "Encrypting data",
                                "Firewall attack"
                        ],
                        "correct": 1,
                        "explanation": "Rainbow tables reverse hashes. Salting mitigates this.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 61,
                        "question": "What is port scanning?",
                        "options": [
                                "Encrypting ports",
                                "Blocking ports",
                                "Checking open ports on a system",
                                "Closing ports"
                        ],
                        "correct": 2,
                        "explanation": "Port scanning identifies services. Attackers use it for reconnaissance.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 62,
                        "question": "What is vulnerability scanning?",
                        "options": [
                                "Firewall configuration",
                                "Deleting vulnerabilities",
                                "Encrypting systems",
                                "Automated detection of security weaknesses"
                        ],
                        "correct": 3,
                        "explanation": "Scanners identify known flaws. They support proactive defense.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 63,
                        "question": "What is a honeypot?",
                        "options": [
                                "Decoy system to attract attackers",
                                "Encryption tool",
                                "Real server",
                                "Firewall"
                        ],
                        "correct": 0,
                        "explanation": "Honeypots detect attacker behavior. They improve threat intelligence.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 64,
                        "question": "What is intrusion detection system (IDS)?",
                        "options": [
                                "Delete logs",
                                "Encrypt traffic",
                                "Detect suspicious activity",
                                "Prevent attacks"
                        ],
                        "correct": 2,
                        "explanation": "IDS monitors traffic for anomalies. It alerts administrators.",
                        "difficulty": "Easy",
                        "topic": "Network Security"
                },
                {
                        "id": 65,
                        "question": "What is intrusion prevention system (IPS)?",
                        "options": [
                                "Detect attacks only",
                                "Backup system",
                                "Detect and block attacks",
                                "Encrypt data"
                        ],
                        "correct": 2,
                        "explanation": "IPS actively blocks threats. It prevents exploitation.",
                        "difficulty": "Easy",
                        "topic": "Network Security"
                },
                {
                        "id": 66,
                        "question": "What is network segmentation?",
                        "options": [
                                "Combining networks",
                                "Dividing network into smaller parts",
                                "Deleting networks",
                                "Encrypting networks"
                        ],
                        "correct": 1,
                        "explanation": "Segmentation limits attack spread. It improves security.",
                        "difficulty": "Easy",
                        "topic": "Network Security"
                },
                {
                        "id": 67,
                        "question": "What is DMZ in networking?",
                        "options": [
                                "Database zone",
                                "Isolated network for public services",
                                "Firewall zone",
                                "Secure internal network"
                        ],
                        "correct": 1,
                        "explanation": "DMZ hosts public-facing services. It protects internal networks.",
                        "difficulty": "Easy",
                        "topic": "Network Security"
                },
                {
                        "id": 68,
                        "question": "What is secure boot?",
                        "options": [
                                "Boot process verifying trusted software",
                                "Fast boot",
                                "Database boot",
                                "Network boot"
                        ],
                        "correct": 0,
                        "explanation": "Secure boot prevents unauthorized OS loading. It ensures system integrity.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 69,
                        "question": "What is hardware security module (HSM)?",
                        "options": [
                                "Database",
                                "Firewall",
                                "Device managing cryptographic keys",
                                "Network switch"
                        ],
                        "correct": 2,
                        "explanation": "HSM secures keys. It enhances encryption security.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 70,
                        "question": "What is tokenization?",
                        "options": [
                                "Replacing sensitive data with tokens",
                                "Encrypting data",
                                "Deleting data",
                                "Compressing data"
                        ],
                        "correct": 0,
                        "explanation": "Tokenization protects sensitive information. Tokens have no exploitable value.",
                        "difficulty": "Easy",
                        "topic": "App & Data Security"
                },
                {
                        "id": 71,
                        "question": "What is data masking?",
                        "options": [
                                "Encrypting data",
                                "Hiding sensitive data",
                                "Deleting data",
                                "Compressing data"
                        ],
                        "correct": 1,
                        "explanation": "Masking protects privacy. It hides sensitive values.",
                        "difficulty": "Easy",
                        "topic": "App & Data Security"
                },
                {
                        "id": 72,
                        "question": "What is secure coding?",
                        "options": [
                                "Writing fast code",
                                "Deleting code",
                                "Encrypting code",
                                "Writing code free from vulnerabilities"
                        ],
                        "correct": 3,
                        "explanation": "Secure coding prevents exploits. It reduces vulnerabilities.",
                        "difficulty": "Easy",
                        "topic": "App & Data Security"
                },
                {
                        "id": 73,
                        "question": "What is OWASP?",
                        "options": [
                                "Online Web Access Security Protocol",
                                "Open Wireless Access Security Program",
                                "Open Web Application Security Project",
                                "Operating Web Application Security Policy"
                        ],
                        "correct": 2,
                        "explanation": "OWASP provides security guidelines. It identifies top vulnerabilities.",
                        "difficulty": "Easy",
                        "topic": "App & Data Security"
                },
                {
                        "id": 74,
                        "question": "What is OWASP Top 10?",
                        "options": [
                                "Top web security risks",
                                "Top encryption methods",
                                "Top databases",
                                "Top programming languages"
                        ],
                        "correct": 0,
                        "explanation": "OWASP Top 10 lists common vulnerabilities. It guides secure development.",
                        "difficulty": "Easy",
                        "topic": "App & Data Security"
                },
                {
                        "id": 75,
                        "question": "What is SQL injection prevention method?",
                        "options": [
                                "Hardcoding queries",
                                "Encrypting database",
                                "Disabling database",
                                "Using parameterized queries"
                        ],
                        "correct": 3,
                        "explanation": "Parameterized queries prevent injection. They separate data from code.",
                        "difficulty": "Easy",
                        "topic": "Threats & Attacks"
                },
                {
                        "id": 76,
                        "question": "What is cross-site scripting (XSS) prevention?",
                        "options": [
                                "Disabling JavaScript",
                                "Input validation and output encoding",
                                "Encrypting HTML",
                                "Deleting forms"
                        ],
                        "correct": 1,
                        "explanation": "Encoding prevents script execution. Validation ensures safe input.",
                        "difficulty": "Easy",
                        "topic": "Threats & Attacks"
                },
                {
                        "id": 77,
                        "question": "What is content security policy (CSP)?",
                        "options": [
                                "Firewall rule",
                                "Security layer preventing XSS",
                                "Encryption method",
                                "Database policy"
                        ],
                        "correct": 1,
                        "explanation": "CSP restricts script sources. It reduces XSS risks.",
                        "difficulty": "Easy",
                        "topic": "Governance & Compliance"
                },
                {
                        "id": 78,
                        "question": "What is same-origin policy?",
                        "options": [
                                "Delete cookies",
                                "Restrict resources from different origins",
                                "Encrypt data",
                                "Allow all requests"
                        ],
                        "correct": 1,
                        "explanation": "Same-origin policy prevents unauthorized access. It protects web apps.",
                        "difficulty": "Easy",
                        "topic": "Governance & Compliance"
                },
                {
                        "id": 79,
                        "question": "What is cookie hijacking?",
                        "options": [
                                "Encrypting cookies",
                                "Stealing session cookies",
                                "Deleting cookies",
                                "Blocking cookies"
                        ],
                        "correct": 1,
                        "explanation": "Attackers use stolen cookies. It allows session takeover.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 80,
                        "question": "What is secure cookie flag?",
                        "options": [
                                "Encrypt cookie",
                                "Delete cookie",
                                "Send cookie only over HTTPS",
                                "Allow HTTP"
                        ],
                        "correct": 2,
                        "explanation": "Secure flag prevents interception. It ensures encrypted transmission.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 81,
                        "question": "What is HttpOnly cookie?",
                        "options": [
                                "Encrypts cookie",
                                "Deletes cookie",
                                "Prevents JavaScript access",
                                "Accessible by JavaScript"
                        ],
                        "correct": 2,
                        "explanation": "HttpOnly prevents XSS cookie theft. It improves security.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 82,
                        "question": "What is password policy?",
                        "options": [
                                "Ignore passwords",
                                "Delete passwords",
                                "Encrypt passwords",
                                "Rules for strong passwords"
                        ],
                        "correct": 3,
                        "explanation": "Policies enforce complexity. They improve security.",
                        "difficulty": "Easy",
                        "topic": "Governance & Compliance"
                },
                {
                        "id": 83,
                        "question": "What is account lockout?",
                        "options": [
                                "Blocking account after failed attempts",
                                "Scaling account",
                                "Deleting account",
                                "Encrypting account"
                        ],
                        "correct": 0,
                        "explanation": "Lockout prevents brute-force attacks. It protects accounts.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 84,
                        "question": "What is biometric authentication?",
                        "options": [
                                "Encryption method",
                                "Using physical traits for verification",
                                "Password",
                                "Firewall rule"
                        ],
                        "correct": 1,
                        "explanation": "Biometrics include fingerprints and face recognition. They improve authentication.",
                        "difficulty": "Easy",
                        "topic": "Core Concepts"
                },
                {
                        "id": 85,
                        "question": "What is smart card authentication?",
                        "options": [
                                "Password",
                                "Encryption method",
                                "Using physical card for authentication",
                                "Firewall rule"
                        ],
                        "correct": 2,
                        "explanation": "Smart cards store credentials securely. They support MFA.",
                        "difficulty": "Easy",
                        "topic": "Core Concepts"
                },
                {
                        "id": 86,
                        "question": "What is time-based one-time password (TOTP)?",
                        "options": [
                                "Permanent password",
                                "Temporary code for authentication",
                                "Firewall rule",
                                "Encryption method"
                        ],
                        "correct": 1,
                        "explanation": "TOTP expires quickly. It enhances MFA security.",
                        "difficulty": "Easy",
                        "topic": "Identity & Access"
                },
                {
                        "id": 87,
                        "question": "What is security operations center (SOC)?",
                        "options": [
                                "Storage center",
                                "Network center",
                                "Team monitoring security events",
                                "Database center"
                        ],
                        "correct": 2,
                        "explanation": "SOC monitors threats. It responds to incidents.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 88,
                        "question": "What is threat intelligence?",
                        "options": [
                                "Firewall rule",
                                "Encryption method",
                                "Information about threats and attackers",
                                "Ignoring threats"
                        ],
                        "correct": 2,
                        "explanation": "Threat intelligence helps anticipate attacks. It improves defense.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 89,
                        "question": "What is digital forensics?",
                        "options": [
                                "Deleting evidence",
                                "Encrypting data",
                                "Investigating cyber incidents",
                                "Scaling servers"
                        ],
                        "correct": 2,
                        "explanation": "Forensics analyzes breaches. It supports legal actions.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 90,
                        "question": "What is cyber espionage?",
                        "options": [
                                "Firewall rule",
                                "Friendly monitoring",
                                "Stealing confidential information",
                                "Encryption method"
                        ],
                        "correct": 2,
                        "explanation": "Espionage targets sensitive data. It affects governments and companies.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 91,
                        "question": "What is hacktivism?",
                        "options": [
                                "Hacking for political/social causes",
                                "Encryption method",
                                "Firewall rule",
                                "Ethical hacking"
                        ],
                        "correct": 0,
                        "explanation": "Hacktivists promote causes. They disrupt systems.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 92,
                        "question": "What is insider threat?",
                        "options": [
                                "Encryption method",
                                "Firewall rule",
                                "Threat from authorized user",
                                "External attacker"
                        ],
                        "correct": 2,
                        "explanation": "Insiders misuse access. It is hard to detect.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 93,
                        "question": "What is data exfiltration?",
                        "options": [
                                "Unauthorized data transfer",
                                "Data compression",
                                "Encrypting data",
                                "Data backup"
                        ],
                        "correct": 0,
                        "explanation": "Exfiltration steals sensitive data. Monitoring prevents it.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 94,
                        "question": "What is cyber warfare?",
                        "options": [
                                "Firewall rule",
                                "Encryption method",
                                "Nation-state cyber attacks",
                                "Friendly monitoring"
                        ],
                        "correct": 2,
                        "explanation": "Cyber warfare targets infrastructure. It disrupts nations.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 95,
                        "question": "What is bug bounty program?",
                        "options": [
                                "Paying attackers",
                                "Encrypting software",
                                "Rewarding security researchers",
                                "Deleting bugs"
                        ],
                        "correct": 2,
                        "explanation": "Bug bounties encourage responsible disclosure. They improve security.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 96,
                        "question": "What is ethical hacking?",
                        "options": [
                                "Encryption method",
                                "Illegal hacking",
                                "Firewall rule",
                                "Authorized security testing"
                        ],
                        "correct": 3,
                        "explanation": "Ethical hackers find vulnerabilities legally. They strengthen systems.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 97,
                        "question": "What is red team?",
                        "options": [
                                "Database team",
                                "Network team",
                                "Team simulating attacks",
                                "Security team defending"
                        ],
                        "correct": 2,
                        "explanation": "Red teams test defenses. They simulate attackers.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 98,
                        "question": "What is blue team?",
                        "options": [
                                "Defensive security team",
                                "Network team",
                                "Database team",
                                "Attack team"
                        ],
                        "correct": 0,
                        "explanation": "Blue teams defend systems. They monitor and respond.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 99,
                        "question": "What is purple team?",
                        "options": [
                                "Collaboration between red and blue teams",
                                "Encryption team",
                                "Database team",
                                "Network team"
                        ],
                        "correct": 0,
                        "explanation": "Purple teams improve coordination. They enhance security strategies.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 102,
                        "question": "What is ISO/IEC 27001?",
                        "options": [
                                "Programming language",
                                "Encryption algorithm",
                                "Information security management standard",
                                "Firewall rule"
                        ],
                        "correct": 2,
                        "explanation": "ISO 27001 provides guidelines for managing information security. It ensures systematic risk management.",
                        "difficulty": "Easy",
                        "topic": "Governance & Compliance"
                },
                {
                        "id": 103,
                        "question": "What is NIST Cybersecurity Framework?",
                        "options": [
                                "Network protocol",
                                "Firewall rule",
                                "Guidelines for improving cybersecurity practices",
                                "Encryption protocol"
                        ],
                        "correct": 2,
                        "explanation": "NIST framework helps organizations manage risks. It provides best practices for security.",
                        "difficulty": "Easy",
                        "topic": "Governance & Compliance"
                },
                {
                        "id": 104,
                        "question": "What is GDPR?",
                        "options": [
                                "General Database Protection Rule",
                                "General Data Protection Regulation",
                                "Global Digital Privacy Regulation",
                                "Global Data Processing Rule"
                        ],
                        "correct": 1,
                        "explanation": "GDPR protects personal data in the EU. It enforces strict privacy regulations.",
                        "difficulty": "Easy",
                        "topic": "Governance & Compliance"
                },
                {
                        "id": 105,
                        "question": "What is data classification?",
                        "options": [
                                "Compressing data",
                                "Deleting data",
                                "Encrypting data",
                                "Categorizing data based on sensitivity"
                        ],
                        "correct": 3,
                        "explanation": "Classification ensures proper protection levels. Sensitive data gets stronger controls.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 106,
                        "question": "What is data retention policy?",
                        "options": [
                                "Rules for how long data is stored",
                                "Encrypting data",
                                "Compressing data",
                                "Deleting all data immediately"
                        ],
                        "correct": 0,
                        "explanation": "Retention policies ensure compliance. They manage storage and legal requirements.",
                        "difficulty": "Easy",
                        "topic": "Governance & Compliance"
                },
                {
                        "id": 107,
                        "question": "What is privacy by design?",
                        "options": [
                                "Encrypting hardware",
                                "Deleting logs",
                                "Integrating privacy into system design",
                                "Ignoring privacy"
                        ],
                        "correct": 2,
                        "explanation": "Privacy by design ensures data protection from the start. It reduces risks.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 108,
                        "question": "What is anonymization?",
                        "options": [
                                "Encrypting data",
                                "Deleting data",
                                "Removing personally identifiable information",
                                "Compressing data"
                        ],
                        "correct": 2,
                        "explanation": "Anonymization protects privacy. It prevents identifying individuals.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 109,
                        "question": "What is pseudonymization?",
                        "options": [
                                "Encrypting data",
                                "Deleting data",
                                "Replacing identifiers with pseudonyms",
                                "Compressing data"
                        ],
                        "correct": 2,
                        "explanation": "Pseudonymization reduces data exposure. It still allows analysis.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 110,
                        "question": "What is a security baseline?",
                        "options": [
                                "Firewall rule",
                                "Weak configuration",
                                "Minimum security standard",
                                "Encryption method"
                        ],
                        "correct": 2,
                        "explanation": "Baselines define secure configurations. They ensure consistent protection.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 111,
                        "question": "What is risk assessment?",
                        "options": [
                                "Deleting risks",
                                "Ignoring threats",
                                "Encrypting risks",
                                "Identifying and evaluating risks"
                        ],
                        "correct": 3,
                        "explanation": "Risk assessment prioritizes security efforts. It helps allocate resources.",
                        "difficulty": "Easy",
                        "topic": "Governance & Compliance"
                },
                {
                        "id": 112,
                        "question": "What is risk mitigation?",
                        "options": [
                                "Ignoring risks",
                                "Deleting data",
                                "Increasing risk",
                                "Reducing risk impact"
                        ],
                        "correct": 3,
                        "explanation": "Mitigation reduces vulnerabilities. It lowers potential damage.",
                        "difficulty": "Easy",
                        "topic": "Governance & Compliance"
                },
                {
                        "id": 113,
                        "question": "What is business continuity planning (BCP)?",
                        "options": [
                                "Ensuring operations during disruptions",
                                "Scaling servers",
                                "Deleting systems",
                                "Encrypting systems"
                        ],
                        "correct": 0,
                        "explanation": "BCP ensures critical functions continue. It supports resilience.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 114,
                        "question": "What is tabletop exercise?",
                        "options": [
                                "Encryption method",
                                "Simulated incident response discussion",
                                "Physical security test",
                                "Firewall test"
                        ],
                        "correct": 1,
                        "explanation": "Tabletop exercises test response plans. They improve preparedness.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 115,
                        "question": "What is cyber resilience?",
                        "options": [
                                "Ability to recover from cyber incidents",
                                "Encrypting data",
                                "Ignoring attacks",
                                "Deleting logs"
                        ],
                        "correct": 0,
                        "explanation": "Resilience ensures quick recovery. It maintains operations.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 116,
                        "question": "What is supply chain attack?",
                        "options": [
                                "Network attack",
                                "Compromising third-party vendors",
                                "Encryption method",
                                "Firewall rule"
                        ],
                        "correct": 1,
                        "explanation": "Supply chain attacks exploit trusted partners. They bypass defenses.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 117,
                        "question": "What is code signing?",
                        "options": [
                                "Writing code",
                                "Deleting logs",
                                "Encrypting databases",
                                "Verifying software authenticity"
                        ],
                        "correct": 3,
                        "explanation": "Code signing ensures software integrity. It prevents tampering.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 118,
                        "question": "What is sandboxing in security?",
                        "options": [
                                "Scaling servers",
                                "Encrypting data",
                                "Deleting code",
                                "Running code in isolated environment"
                        ],
                        "correct": 3,
                        "explanation": "Sandboxing prevents malicious impact. It isolates risky code.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 119,
                        "question": "What is memory protection?",
                        "options": [
                                "Deleting memory",
                                "Compressing RAM",
                                "Encrypting CPU",
                                "Preventing unauthorized memory access"
                        ],
                        "correct": 3,
                        "explanation": "Memory protection stops exploits. It protects system stability.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 120,
                        "question": "What is buffer overflow?",
                        "options": [
                                "Firewall rule",
                                "Writing data beyond buffer limits",
                                "Encryption method",
                                "Secure memory usage"
                        ],
                        "correct": 1,
                        "explanation": "Buffer overflows enable code execution. Secure coding prevents them.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 121,
                        "question": "What is ASLR?",
                        "options": [
                                "Automated Secure Login Rule",
                                "Address Space Layout Randomization",
                                "Advanced Security Log Reporting",
                                "Access Security Layer Routing"
                        ],
                        "correct": 1,
                        "explanation": "ASLR randomizes memory addresses. It prevents exploitation.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 122,
                        "question": "What is DEP (Data Execution Prevention)?",
                        "options": [
                                "Encrypting data",
                                "Preventing code execution in memory regions",
                                "Scaling memory",
                                "Deleting data"
                        ],
                        "correct": 1,
                        "explanation": "DEP blocks malicious execution. It improves system security.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 123,
                        "question": "What is sandbox escape?",
                        "options": [
                                "Firewall rule",
                                "Safe execution",
                                "Encryption method",
                                "Bypassing sandbox restrictions"
                        ],
                        "correct": 3,
                        "explanation": "Sandbox escape allows malware to access system resources. It bypasses isolation.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 124,
                        "question": "What is firmware security?",
                        "options": [
                                "Software security only",
                                "Protecting low-level device software",
                                "Network security",
                                "Database security"
                        ],
                        "correct": 1,
                        "explanation": "Firmware security prevents hardware-level attacks. It ensures device integrity.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 125,
                        "question": "What is hardware root of trust?",
                        "options": [
                                "Trusted hardware component for security",
                                "Network trust",
                                "Software trust",
                                "Database trust"
                        ],
                        "correct": 0,
                        "explanation": "Root of trust ensures secure boot and cryptography. It anchors security.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 126,
                        "question": "What is mobile device management (MDM)?",
                        "options": [
                                "Managing and securing mobile devices",
                                "Firewall rule",
                                "Database management",
                                "Encryption method"
                        ],
                        "correct": 0,
                        "explanation": "MDM enforces security policies. It protects enterprise devices.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 127,
                        "question": "What is BYOD risk?",
                        "options": [
                                "Security risks from personal devices",
                                "Firewall rule",
                                "Company-owned devices",
                                "Encryption method"
                        ],
                        "correct": 0,
                        "explanation": "BYOD increases attack surface. Policies mitigate risks.",
                        "difficulty": "Easy",
                        "topic": "Governance & Compliance"
                },
                {
                        "id": 128,
                        "question": "What is cloud security posture management (CSPM)?",
                        "options": [
                                "Database tool",
                                "Encryption method",
                                "Firewall rule",
                                "Monitoring cloud security configurations"
                        ],
                        "correct": 3,
                        "explanation": "CSPM detects misconfigurations. It improves cloud security.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 129,
                        "question": "What is identity federation?",
                        "options": [
                                "Multiple passwords",
                                "Encryption method",
                                "Sharing identity across systems",
                                "Firewall rule"
                        ],
                        "correct": 2,
                        "explanation": "Federation enables single identity across platforms. It simplifies access.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 130,
                        "question": "What is single sign-on (SSO)?",
                        "options": [
                                "Firewall rule",
                                "Multiple logins",
                                "Encryption method",
                                "One login for multiple services"
                        ],
                        "correct": 3,
                        "explanation": "SSO improves user experience. It centralizes authentication.",
                        "difficulty": "Easy",
                        "topic": "Identity & Access"
                },
                {
                        "id": 131,
                        "question": "What is privileged access management (PAM)?",
                        "options": [
                                "Firewall rule",
                                "Managing normal users",
                                "Controlling privileged accounts",
                                "Encryption method"
                        ],
                        "correct": 2,
                        "explanation": "PAM protects admin accounts. It reduces insider threats.",
                        "difficulty": "Easy",
                        "topic": "Identity & Access"
                },
                {
                        "id": 132,
                        "question": "What is identity lifecycle management?",
                        "options": [
                                "Managing user access from creation to removal",
                                "Encryption method",
                                "Deleting users",
                                "Firewall rule"
                        ],
                        "correct": 0,
                        "explanation": "Lifecycle management ensures proper access control. It prevents orphan accounts.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 133,
                        "question": "What is shadow IT?",
                        "options": [
                                "Unauthorized technology use",
                                "Encryption method",
                                "Approved systems",
                                "Firewall rule"
                        ],
                        "correct": 0,
                        "explanation": "Shadow IT bypasses security controls. It increases risk.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 134,
                        "question": "What is data loss prevention (DLP)?",
                        "options": [
                                "Compressing data",
                                "Preventing unauthorized data transfer",
                                "Deleting data",
                                "Encrypting data"
                        ],
                        "correct": 1,
                        "explanation": "DLP monitors data movement. It prevents leaks.",
                        "difficulty": "Easy",
                        "topic": "App & Data Security"
                },
                {
                        "id": 135,
                        "question": "What is secure email gateway?",
                        "options": [
                                "Filters malicious emails",
                                "Encryption tool",
                                "Database",
                                "Firewall rule"
                        ],
                        "correct": 0,
                        "explanation": "Email gateways block phishing and malware. They improve security.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 136,
                        "question": "What is spear phishing?",
                        "options": [
                                "Targeted phishing attack",
                                "Encryption method",
                                "Firewall rule",
                                "Random phishing"
                        ],
                        "correct": 0,
                        "explanation": "Spear phishing targets individuals. It uses personalized messages.",
                        "difficulty": "Easy",
                        "topic": "Threats & Attacks"
                },
                {
                        "id": 137,
                        "question": "What is whaling attack?",
                        "options": [
                                "Network attack",
                                "Firewall rule",
                                "Phishing targeting executives",
                                "Encryption method"
                        ],
                        "correct": 2,
                        "explanation": "Whaling targets high-level executives. It seeks sensitive data.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 138,
                        "question": "What is security misconfiguration?",
                        "options": [
                                "Improper system settings",
                                "Secure setup",
                                "Firewall rule",
                                "Encryption method"
                        ],
                        "correct": 0,
                        "explanation": "Misconfigurations create vulnerabilities. Regular audits prevent them.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 139,
                        "question": "What is attack surface?",
                        "options": [
                                "Physical surface",
                                "Total points of possible attack",
                                "Encryption method",
                                "Firewall rule"
                        ],
                        "correct": 1,
                        "explanation": "Reducing attack surface improves security. It limits exposure.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 140,
                        "question": "What is defense in depth?",
                        "options": [
                                "Single security layer",
                                "Multiple security layers",
                                "No security",
                                "Encryption only"
                        ],
                        "correct": 1,
                        "explanation": "Defense in depth uses layered security. It improves protection.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 141,
                        "question": "What is threat modeling benefit?",
                        "options": [
                                "Ignoring threats",
                                "Encrypting threats",
                                "Identifying vulnerabilities early",
                                "Deleting threats"
                        ],
                        "correct": 2,
                        "explanation": "Threat modeling improves design security. It reduces risks.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 142,
                        "question": "What is cyber insurance?",
                        "options": [
                                "Financial protection against cyber incidents",
                                "Encryption method",
                                "Firewall rule",
                                "Network insurance"
                        ],
                        "correct": 0,
                        "explanation": "Cyber insurance mitigates financial losses. It supports recovery.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 143,
                        "question": "What is legal hold?",
                        "options": [
                                "Encrypting data",
                                "Compressing data",
                                "Deleting data",
                                "Preserving data for legal cases"
                        ],
                        "correct": 3,
                        "explanation": "Legal hold prevents data deletion. It supports investigations.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 144,
                        "question": "What is eDiscovery?",
                        "options": [
                                "Identifying electronic evidence",
                                "Firewall rule",
                                "Data deletion",
                                "Encryption method"
                        ],
                        "correct": 0,
                        "explanation": "eDiscovery supports legal cases. It retrieves digital evidence.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 145,
                        "question": "What is cyber hygiene?",
                        "options": [
                                "Regular security practices",
                                "Encryption method",
                                "Firewall rule",
                                "Cleaning hardware"
                        ],
                        "correct": 0,
                        "explanation": "Cyber hygiene includes updates and backups. It reduces risks.",
                        "difficulty": "Easy",
                        "topic": "General Security"
                },
                {
                        "id": 146,
                        "question": "What is security awareness phishing simulation?",
                        "options": [
                                "Firewall rule",
                                "Real attack",
                                "Training exercise for users",
                                "Encryption method"
                        ],
                        "correct": 2,
                        "explanation": "Simulations improve awareness. Users learn to detect phishing.",
                        "difficulty": "Easy",
                        "topic": "Threats & Attacks"
                },
                {
                        "id": 147,
                        "question": "What is digital certificate?",
                        "options": [
                                "Electronic credential verifying identity",
                                "Firewall rule",
                                "Password",
                                "Encryption method"
                        ],
                        "correct": 0,
                        "explanation": "Certificates enable secure communication. They verify authenticity.",
                        "difficulty": "Easy",
                        "topic": "Cryptography"
                },
                {
                        "id": 148,
                        "question": "What is public key infrastructure (PKI)?",
                        "options": [
                                "Database system",
                                "Firewall rule",
                                "Encryption method",
                                "Framework for managing digital certificates"
                        ],
                        "correct": 3,
                        "explanation": "PKI manages keys and certificates. It enables secure communication.",
                        "difficulty": "Easy",
                        "topic": "Cryptography"
                },
                {
                        "id": 149,
                        "question": "What is trust model in PKI?",
                        "options": [
                                "Encryption method",
                                "Framework for validating certificates",
                                "Firewall rule",
                                "No trust"
                        ],
                        "correct": 1,
                        "explanation": "Trust models verify certificate authenticity. They ensure secure connections.",
                        "difficulty": "Easy",
                        "topic": "Cryptography"
                },
                {
                        "id": 150,
                        "question": "What is the ultimate goal of cybersecurity governance?",
                        "options": [
                                "Align security with business objectives",
                                "Reduce compliance",
                                "Increase risk",
                                "Remove policies"
                        ],
                        "correct": 0,
                        "explanation": "Governance ensures security supports business goals. It balances risk and compliance.",
                        "difficulty": "Easy",
                        "topic": "Governance & Compliance"
                }
        ],
        "ai": [
                {
                        "id": 1,
                        "question": "What is Artificial Intelligence?",
                        "options": [
                                "Programming hardware",
                                "Simulation of human intelligence in machines",
                                "Network security",
                                "Database management"
                        ],
                        "correct": 1,
                        "explanation": "AI enables machines to perform tasks requiring human intelligence. These include learning, reasoning, and decision-making.",
                        "difficulty": "Easy",
                        "topic": "AI Concepts"
                },
                {
                        "id": 2,
                        "question": "Which of the following is an application of AI?",
                        "options": [
                                "Word processing",
                                "Spreadsheet formatting",
                                "Self-driving cars",
                                "File storage"
                        ],
                        "correct": 2,
                        "explanation": "Self-driving cars use AI for perception and decision-making. They rely on machine learning and sensors.",
                        "difficulty": "Medium",
                        "topic": "General AI"
                },
                {
                        "id": 3,
                        "question": "What is Machine Learning?",
                        "options": [
                                "Network configuration",
                                "Manual programming",
                                "Learning from data without explicit programming",
                                "Database querying"
                        ],
                        "correct": 2,
                        "explanation": "Machine learning enables systems to learn patterns from data. It improves performance over time.",
                        "difficulty": "Easy",
                        "topic": "Machine Learning"
                },
                {
                        "id": 4,
                        "question": "Which type of ML uses labeled data?",
                        "options": [
                                "Unsupervised learning",
                                "Reinforcement learning",
                                "Semi-supervised learning",
                                "Supervised learning"
                        ],
                        "correct": 3,
                        "explanation": "Supervised learning uses labeled datasets. It maps inputs to known outputs.",
                        "difficulty": "Medium",
                        "topic": "Data Processing"
                },
                {
                        "id": 5,
                        "question": "Which type of ML finds patterns without labels?",
                        "options": [
                                "Reinforcement learning",
                                "Unsupervised learning",
                                "Deep learning",
                                "Supervised learning"
                        ],
                        "correct": 1,
                        "explanation": "Unsupervised learning identifies hidden patterns. Clustering is a common example.",
                        "difficulty": "Medium",
                        "topic": "General AI"
                },
                {
                        "id": 6,
                        "question": "What is reinforcement learning?",
                        "options": [
                                "Database learning",
                                "Learning through rewards and penalties",
                                "Learning with labeled data",
                                "Static learning"
                        ],
                        "correct": 1,
                        "explanation": "Reinforcement learning uses feedback signals. Agents learn optimal actions through rewards.",
                        "difficulty": "Easy",
                        "topic": "Machine Learning"
                },
                {
                        "id": 7,
                        "question": "What is a dataset?",
                        "options": [
                                "Network device",
                                "Single value",
                                "Collection of data used for training models",
                                "Encryption key"
                        ],
                        "correct": 2,
                        "explanation": "Datasets provide training examples. Model performance depends on data quality.",
                        "difficulty": "Easy",
                        "topic": "Data Processing"
                },
                {
                        "id": 8,
                        "question": "What is overfitting?",
                        "options": [
                                "Model memorizes training data",
                                "Model fails to learn",
                                "Model performs well on new data",
                                "Model compresses data"
                        ],
                        "correct": 0,
                        "explanation": "Overfitting reduces generalization. Regularization helps prevent it.",
                        "difficulty": "Easy",
                        "topic": "Machine Learning"
                },
                {
                        "id": 9,
                        "question": "What is underfitting?",
                        "options": [
                                "Model too complex",
                                "Model memorizes data",
                                "Model fails to capture patterns",
                                "Model encrypts data"
                        ],
                        "correct": 2,
                        "explanation": "Underfitting occurs when model is too simple. It leads to poor performance.",
                        "difficulty": "Easy",
                        "topic": "Machine Learning"
                },
                {
                        "id": 10,
                        "question": "What is a feature in ML?",
                        "options": [
                                "Output variable",
                                "Database field",
                                "Network protocol",
                                "Input variable used for prediction"
                        ],
                        "correct": 3,
                        "explanation": "Features represent input data. They influence predictions.",
                        "difficulty": "Easy",
                        "topic": "Data Processing"
                },
                {
                        "id": 11,
                        "question": "What is a label?",
                        "options": [
                                "Input variable",
                                "Database key",
                                "Network address",
                                "Output variable"
                        ],
                        "correct": 3,
                        "explanation": "Labels are target outputs. They guide supervised learning.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 12,
                        "question": "What is classification?",
                        "options": [
                                "Encrypting data",
                                "Predicting categories",
                                "Predicting continuous values",
                                "Clustering data"
                        ],
                        "correct": 1,
                        "explanation": "Classification assigns data to categories. Example: spam vs. not spam.",
                        "difficulty": "Easy",
                        "topic": "Machine Learning"
                },
                {
                        "id": 13,
                        "question": "What is regression?",
                        "options": [
                                "Predicting categories",
                                "Encrypting data",
                                "Clustering data",
                                "Predicting continuous values"
                        ],
                        "correct": 3,
                        "explanation": "Regression predicts numeric values. Example: house prices.",
                        "difficulty": "Easy",
                        "topic": "Machine Learning"
                },
                {
                        "id": 14,
                        "question": "What is clustering?",
                        "options": [
                                "Supervised learning",
                                "Encryption",
                                "Regression",
                                "Grouping similar data"
                        ],
                        "correct": 3,
                        "explanation": "Clustering identifies patterns. It is unsupervised learning.",
                        "difficulty": "Easy",
                        "topic": "Machine Learning"
                },
                {
                        "id": 15,
                        "question": "What is k-means algorithm used for?",
                        "options": [
                                "Encryption",
                                "Regression",
                                "Clustering",
                                "Classification"
                        ],
                        "correct": 2,
                        "explanation": "k-means groups data into clusters. It minimizes intra-cluster distance.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 16,
                        "question": "What is decision tree?",
                        "options": [
                                "Network topology",
                                "Model using tree-like decisions",
                                "Database structure",
                                "Neural network"
                        ],
                        "correct": 1,
                        "explanation": "Decision trees split data based on features. They are interpretable models.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 17,
                        "question": "What is random forest?",
                        "options": [
                                "Database",
                                "Ensemble of decision trees",
                                "Single decision tree",
                                "Neural network"
                        ],
                        "correct": 1,
                        "explanation": "Random forests combine multiple trees. They improve accuracy and reduce overfitting.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 18,
                        "question": "What is support vector machine (SVM)?",
                        "options": [
                                "Database",
                                "Encryption method",
                                "Clustering algorithm",
                                "Classification algorithm using hyperplanes"
                        ],
                        "correct": 3,
                        "explanation": "SVM separates data using optimal boundaries. It works well in high dimensions.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 19,
                        "question": "What is neural network?",
                        "options": [
                                "Database",
                                "Encryption method",
                                "Model inspired by human brain",
                                "Network protocol"
                        ],
                        "correct": 2,
                        "explanation": "Neural networks process data using interconnected nodes. They power deep learning.",
                        "difficulty": "Easy",
                        "topic": "Deep Learning"
                },
                {
                        "id": 20,
                        "question": "What is deep learning?",
                        "options": [
                                "Shallow learning",
                                "ML using multi-layer neural networks",
                                "Database optimization",
                                "Encryption"
                        ],
                        "correct": 1,
                        "explanation": "Deep learning handles complex patterns. It excels in vision and speech tasks.",
                        "difficulty": "Easy",
                        "topic": "Deep Learning"
                },
                {
                        "id": 21,
                        "question": "What is an epoch in training?",
                        "options": [
                                "One complete pass through dataset",
                                "Network layer",
                                "Feature set",
                                "Single data point"
                        ],
                        "correct": 0,
                        "explanation": "Epoch represents full training cycle. Multiple epochs improve learning.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 22,
                        "question": "What is a loss function?",
                        "options": [
                                "Database function",
                                "Network function",
                                "Measures prediction error",
                                "Encryption function"
                        ],
                        "correct": 2,
                        "explanation": "Loss functions quantify model errors. Optimization minimizes loss.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 23,
                        "question": "What is gradient descent?",
                        "options": [
                                "Clustering method",
                                "Encryption method",
                                "Database query",
                                "Optimization algorithm to minimize loss"
                        ],
                        "correct": 3,
                        "explanation": "Gradient descent updates weights. It improves model accuracy.",
                        "difficulty": "Easy",
                        "topic": "Deep Learning"
                },
                {
                        "id": 24,
                        "question": "What is training data?",
                        "options": [
                                "Network logs",
                                "Data used to train model",
                                "Data for testing only",
                                "Database schema"
                        ],
                        "correct": 1,
                        "explanation": "Training data teaches patterns. It determines model performance.",
                        "difficulty": "Easy",
                        "topic": "Data Processing"
                },
                {
                        "id": 25,
                        "question": "What is test data?",
                        "options": [
                                "Data used to evaluate model",
                                "Database records",
                                "Training data",
                                "Network packets"
                        ],
                        "correct": 0,
                        "explanation": "Test data measures generalization. It ensures unbiased evaluation.",
                        "difficulty": "Easy",
                        "topic": "Data Processing"
                },
                {
                        "id": 26,
                        "question": "What is validation data?",
                        "options": [
                                "Training data",
                                "Data used to tune model",
                                "Database records",
                                "Network packets"
                        ],
                        "correct": 1,
                        "explanation": "Validation data helps tune parameters. It prevents overfitting.",
                        "difficulty": "Easy",
                        "topic": "Data Processing"
                },
                {
                        "id": 27,
                        "question": "What is bias in ML?",
                        "options": [
                                "Encryption method",
                                "Error from wrong assumptions",
                                "Random error",
                                "Network delay"
                        ],
                        "correct": 1,
                        "explanation": "Bias leads to systematic errors. It affects fairness.",
                        "difficulty": "Easy",
                        "topic": "Machine Learning"
                },
                {
                        "id": 28,
                        "question": "What is variance in ML?",
                        "options": [
                                "Encryption method",
                                "Model simplicity",
                                "Database error",
                                "Sensitivity to training data"
                        ],
                        "correct": 3,
                        "explanation": "High variance causes overfitting. Regularization reduces it.",
                        "difficulty": "Easy",
                        "topic": "Machine Learning"
                },
                {
                        "id": 29,
                        "question": "What is natural language processing (NLP)?",
                        "options": [
                                "Image processing",
                                "Network security",
                                "Database management",
                                "Interaction between computers and human language"
                        ],
                        "correct": 3,
                        "explanation": "NLP enables text understanding. Examples include chatbots.",
                        "difficulty": "Easy",
                        "topic": "NLP"
                },
                {
                        "id": 30,
                        "question": "What is tokenization in NLP?",
                        "options": [
                                "Compressing text",
                                "Splitting text into words/tokens",
                                "Translating text",
                                "Encrypting text"
                        ],
                        "correct": 1,
                        "explanation": "Tokenization prepares text for analysis. It is a preprocessing step.",
                        "difficulty": "Easy",
                        "topic": "NLP"
                },
                {
                        "id": 31,
                        "question": "What is stemming?",
                        "options": [
                                "Encrypting text",
                                "Reducing words to root form",
                                "Translating text",
                                "Compressing text"
                        ],
                        "correct": 1,
                        "explanation": "Stemming normalizes words. Example: “running” → “run”.",
                        "difficulty": "Easy",
                        "topic": "NLP"
                },
                {
                        "id": 32,
                        "question": "What is computer vision?",
                        "options": [
                                "Enabling machines to interpret images",
                                "Database management",
                                "Network monitoring",
                                "Encryption method"
                        ],
                        "correct": 0,
                        "explanation": "Computer vision analyzes visual data. Applications include facial recognition.",
                        "difficulty": "Easy",
                        "topic": "Computer Vision"
                },
                {
                        "id": 33,
                        "question": "What is image classification?",
                        "options": [
                                "Assigning labels to images",
                                "Encrypting images",
                                "Predicting numbers",
                                "Compressing images"
                        ],
                        "correct": 0,
                        "explanation": "Image classification identifies objects. It is widely used in AI.",
                        "difficulty": "Easy",
                        "topic": "Machine Learning"
                },
                {
                        "id": 34,
                        "question": "What is object detection?",
                        "options": [
                                "Encrypting images",
                                "Detecting numbers",
                                "Compressing images",
                                "Identifying objects and their locations"
                        ],
                        "correct": 3,
                        "explanation": "Object detection locates objects. It is used in autonomous vehicles.",
                        "difficulty": "Easy",
                        "topic": "Computer Vision"
                },
                {
                        "id": 35,
                        "question": "What is speech recognition?",
                        "options": [
                                "Converting speech to text",
                                "Encryption",
                                "Text processing",
                                "Image processing"
                        ],
                        "correct": 0,
                        "explanation": "Speech recognition enables voice assistants. It converts audio to text.",
                        "difficulty": "Easy",
                        "topic": "NLP"
                },
                {
                        "id": 36,
                        "question": "What is chatbot?",
                        "options": [
                                "Network protocol",
                                "Database tool",
                                "Encryption tool",
                                "AI program simulating conversation"
                        ],
                        "correct": 3,
                        "explanation": "Chatbots use NLP. They automate customer support.",
                        "difficulty": "Easy",
                        "topic": "NLP"
                },
                {
                        "id": 37,
                        "question": "What is recommendation system?",
                        "options": [
                                "Security system",
                                "Encryption method",
                                "Suggesting items based on user behavior",
                                "Database tool"
                        ],
                        "correct": 2,
                        "explanation": "Recommendation systems personalize content. Example: Netflix suggestions.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 38,
                        "question": "What is reinforcement learning agent?",
                        "options": [
                                "Network protocol",
                                "Entity that learns by interacting with environment",
                                "Database",
                                "Encryption method"
                        ],
                        "correct": 1,
                        "explanation": "Agents take actions and receive rewards. They learn optimal strategies.",
                        "difficulty": "Easy",
                        "topic": "Machine Learning"
                },
                {
                        "id": 39,
                        "question": "What is Q-learning?",
                        "options": [
                                "Reinforcement learning algorithm",
                                "Encryption method",
                                "Database query",
                                "Clustering method"
                        ],
                        "correct": 0,
                        "explanation": "Q-learning learns action values. It helps agents make decisions.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 40,
                        "question": "What is heuristic in AI?",
                        "options": [
                                "Rule-of-thumb for problem solving",
                                "Encryption method",
                                "Database index",
                                "Exact solution"
                        ],
                        "correct": 0,
                        "explanation": "Heuristics speed up search. They provide approximate solutions.",
                        "difficulty": "Easy",
                        "topic": "AI Concepts"
                },
                {
                        "id": 41,
                        "question": "What is A* search algorithm?",
                        "options": [
                                "Database query",
                                "Sorting algorithm",
                                "Pathfinding algorithm using heuristics",
                                "Encryption method"
                        ],
                        "correct": 2,
                        "explanation": "A* finds optimal paths efficiently. It combines cost and heuristic.",
                        "difficulty": "Easy",
                        "topic": "AI Concepts"
                },
                {
                        "id": 42,
                        "question": "What is breadth-first search (BFS)?",
                        "options": [
                                "Depth search",
                                "Encryption method",
                                "Explores nodes level by level",
                                "Database query"
                        ],
                        "correct": 2,
                        "explanation": "BFS guarantees shortest path in unweighted graphs. It uses a queue.",
                        "difficulty": "Easy",
                        "topic": "AI Concepts"
                },
                {
                        "id": 43,
                        "question": "What is depth-first search (DFS)?",
                        "options": [
                                "Encryption method",
                                "Explores deep before backtracking",
                                "Explores nodes level by level",
                                "Database query"
                        ],
                        "correct": 1,
                        "explanation": "DFS explores depth-first. It uses a stack or recursion.",
                        "difficulty": "Easy",
                        "topic": "AI Concepts"
                },
                {
                        "id": 44,
                        "question": "What is expert system?",
                        "options": [
                                "Database",
                                "AI system mimicking human expertise",
                                "Network protocol",
                                "Encryption tool"
                        ],
                        "correct": 1,
                        "explanation": "Expert systems use rules and knowledge bases. They support decision-making.",
                        "difficulty": "Easy",
                        "topic": "AI Concepts"
                },
                {
                        "id": 45,
                        "question": "What is knowledge base in AI?",
                        "options": [
                                "Network log",
                                "Repository of facts and rules",
                                "Encryption method",
                                "Database only"
                        ],
                        "correct": 1,
                        "explanation": "Knowledge bases store domain knowledge. They support inference.",
                        "difficulty": "Easy",
                        "topic": "AI Concepts"
                },
                {
                        "id": 46,
                        "question": "What is inference engine?",
                        "options": [
                                "Encryption tool",
                                "Applies rules to derive conclusions",
                                "Database engine",
                                "Network tool"
                        ],
                        "correct": 1,
                        "explanation": "Inference engines process knowledge bases. They generate decisions.",
                        "difficulty": "Easy",
                        "topic": "AI Concepts"
                },
                {
                        "id": 47,
                        "question": "What is Turing Test?",
                        "options": [
                                "Test for machine intelligence",
                                "Database test",
                                "Encryption test",
                                "Network test"
                        ],
                        "correct": 0,
                        "explanation": "Turing Test evaluates AI’s ability to mimic humans. It measures intelligence.",
                        "difficulty": "Easy",
                        "topic": "AI Concepts"
                },
                {
                        "id": 48,
                        "question": "What is strong AI?",
                        "options": [
                                "AI with human-level intelligence",
                                "Database system",
                                "Encryption system",
                                "AI with narrow tasks"
                        ],
                        "correct": 0,
                        "explanation": "Strong AI aims for general intelligence. It can perform any intellectual task.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 49,
                        "question": "What is weak AI?",
                        "options": [
                                "AI with general intelligence",
                                "Database system",
                                "AI designed for specific tasks",
                                "Encryption tool"
                        ],
                        "correct": 2,
                        "explanation": "Weak AI focuses on narrow tasks. Examples include voice assistants.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 52,
                        "question": "What is an activation function?",
                        "options": [
                                "Database function",
                                "Sorting function",
                                "Encryption method",
                                "Function determining neuron output"
                        ],
                        "correct": 3,
                        "explanation": "Activation functions introduce non-linearity. They enable neural networks to learn complex patterns.",
                        "difficulty": "Easy",
                        "topic": "Deep Learning"
                },
                {
                        "id": 53,
                        "question": "Which is a common activation function?",
                        "options": [
                                "JOIN",
                                "ReLU",
                                "INSERT",
                                "SELECT"
                        ],
                        "correct": 1,
                        "explanation": "ReLU (Rectified Linear Unit) is widely used. It improves training speed and avoids vanishing gradients.",
                        "difficulty": "Medium",
                        "topic": "Deep Learning"
                },
                {
                        "id": 54,
                        "question": "What is ReLU?",
                        "options": [
                                "Sorting algorithm",
                                "Activation function returning max(0, x)",
                                "Database query",
                                "Encryption method"
                        ],
                        "correct": 1,
                        "explanation": "ReLU outputs zero for negative inputs. It helps deep networks train efficiently.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 55,
                        "question": "What is sigmoid function used for?",
                        "options": [
                                "Sorting",
                                "Binary classification output",
                                "Encryption",
                                "Database indexing"
                        ],
                        "correct": 1,
                        "explanation": "Sigmoid maps values between 0 and 1. It is useful for probability outputs.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 56,
                        "question": "What is softmax function?",
                        "options": [
                                "Encryption method",
                                "Clustering algorithm",
                                "Converts outputs into probability distribution",
                                "Sorting method"
                        ],
                        "correct": 2,
                        "explanation": "Softmax is used in multi-class classification. It ensures probabilities sum to 1.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 57,
                        "question": "What is backpropagation?",
                        "options": [
                                "Encryption method",
                                "Algorithm for updating neural network weights",
                                "Database query",
                                "Forward pass"
                        ],
                        "correct": 1,
                        "explanation": "Backpropagation computes gradients. It adjusts weights to minimize loss.",
                        "difficulty": "Easy",
                        "topic": "Deep Learning"
                },
                {
                        "id": 58,
                        "question": "What is vanishing gradient problem?",
                        "options": [
                                "Gradients become too small to update weights",
                                "Exploding loss",
                                "Encryption error",
                                "Database failure"
                        ],
                        "correct": 0,
                        "explanation": "Small gradients slow learning in deep networks. ReLU helps mitigate this.",
                        "difficulty": "Easy",
                        "topic": "Deep Learning"
                },
                {
                        "id": 59,
                        "question": "What is exploding gradient?",
                        "options": [
                                "Database failure",
                                "Encryption error",
                                "Gradients become zero",
                                "Gradients become extremely large"
                        ],
                        "correct": 3,
                        "explanation": "Large gradients destabilize training. Gradient clipping prevents this.",
                        "difficulty": "Easy",
                        "topic": "Deep Learning"
                },
                {
                        "id": 60,
                        "question": "What is dropout in neural networks?",
                        "options": [
                                "Randomly disabling neurons during training",
                                "Sorting algorithm",
                                "Deleting dataset",
                                "Encryption method"
                        ],
                        "correct": 0,
                        "explanation": "Dropout prevents overfitting. It improves generalization.",
                        "difficulty": "Easy",
                        "topic": "Deep Learning"
                },
                {
                        "id": 61,
                        "question": "What is convolutional neural network (CNN)?",
                        "options": [
                                "Sorting algorithm",
                                "Neural network for image processing",
                                "Text processing model",
                                "Encryption method"
                        ],
                        "correct": 1,
                        "explanation": "CNNs extract spatial features. They are used in computer vision.",
                        "difficulty": "Easy",
                        "topic": "Deep Learning"
                },
                {
                        "id": 62,
                        "question": "What is convolution operation?",
                        "options": [
                                "Database join",
                                "Sorting algorithm",
                                "Encryption method",
                                "Applying filter to input data"
                        ],
                        "correct": 3,
                        "explanation": "Convolution extracts features like edges. It reduces parameters.",
                        "difficulty": "Easy",
                        "topic": "Computer Vision"
                },
                {
                        "id": 63,
                        "question": "What is pooling in CNN?",
                        "options": [
                                "Sorting algorithm",
                                "Reducing spatial dimensions",
                                "Encryption method",
                                "Increasing resolution"
                        ],
                        "correct": 1,
                        "explanation": "Pooling reduces computation. It retains important features.",
                        "difficulty": "Easy",
                        "topic": "Deep Learning"
                },
                {
                        "id": 64,
                        "question": "What is recurrent neural network (RNN)?",
                        "options": [
                                "Encryption method",
                                "Model for sequential data",
                                "Image model",
                                "Sorting algorithm"
                        ],
                        "correct": 1,
                        "explanation": "RNNs handle time-series and text. They maintain memory of previous inputs.",
                        "difficulty": "Easy",
                        "topic": "Deep Learning"
                },
                {
                        "id": 65,
                        "question": "What is LSTM?",
                        "options": [
                                "Sorting algorithm",
                                "Database",
                                "Long Short-Term Memory network",
                                "Encryption method"
                        ],
                        "correct": 2,
                        "explanation": "LSTMs solve RNN memory issues. They capture long-term dependencies.",
                        "difficulty": "Easy",
                        "topic": "Deep Learning"
                },
                {
                        "id": 66,
                        "question": "What is GRU?",
                        "options": [
                                "Encryption method",
                                "Database",
                                "Sorting method",
                                "Gated Recurrent Unit"
                        ],
                        "correct": 3,
                        "explanation": "GRU is a simplified LSTM. It improves efficiency.",
                        "difficulty": "Easy",
                        "topic": "Deep Learning"
                },
                {
                        "id": 67,
                        "question": "What is transformer model?",
                        "options": [
                                "Sorting algorithm",
                                "Deep learning model using attention",
                                "Encryption method",
                                "Image filter"
                        ],
                        "correct": 1,
                        "explanation": "Transformers use self-attention. They power modern NLP systems.",
                        "difficulty": "Easy",
                        "topic": "Deep Learning"
                },
                {
                        "id": 68,
                        "question": "What is attention mechanism?",
                        "options": [
                                "Encryption method",
                                "Sorting method",
                                "Database query",
                                "Focus on important input parts"
                        ],
                        "correct": 3,
                        "explanation": "Attention improves context understanding. It enhances NLP performance.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 69,
                        "question": "What is BERT?",
                        "options": [
                                "Encryption method",
                                "Database tool",
                                "NLP model using transformers",
                                "Sorting algorithm"
                        ],
                        "correct": 2,
                        "explanation": "BERT understands context in text. It improves language tasks.",
                        "difficulty": "Easy",
                        "topic": "Deep Learning"
                },
                {
                        "id": 70,
                        "question": "What is GPT?",
                        "options": [
                                "Sorting algorithm",
                                "Generative language model",
                                "Database engine",
                                "Encryption method"
                        ],
                        "correct": 1,
                        "explanation": "GPT generates human-like text. It uses transformer architecture.",
                        "difficulty": "Easy",
                        "topic": "Deep Learning"
                },
                {
                        "id": 71,
                        "question": "What is transfer learning?",
                        "options": [
                                "Using pre-trained model for new task",
                                "Sorting algorithm",
                                "Training from scratch",
                                "Encryption method"
                        ],
                        "correct": 0,
                        "explanation": "Transfer learning saves time and data. It leverages existing knowledge.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 72,
                        "question": "What is fine-tuning?",
                        "options": [
                                "Deleting model",
                                "Sorting algorithm",
                                "Adjusting pre-trained model for specific task",
                                "Encryption method"
                        ],
                        "correct": 2,
                        "explanation": "Fine-tuning adapts models to new data. It improves performance.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 73,
                        "question": "What is data augmentation?",
                        "options": [
                                "Increasing dataset size with transformations",
                                "Sorting algorithm",
                                "Deleting data",
                                "Encryption method"
                        ],
                        "correct": 0,
                        "explanation": "Augmentation improves generalization. It prevents overfitting.",
                        "difficulty": "Easy",
                        "topic": "Data Processing"
                },
                {
                        "id": 74,
                        "question": "What is feature scaling?",
                        "options": [
                                "Normalizing feature values",
                                "Deleting features",
                                "Sorting features",
                                "Encrypting features"
                        ],
                        "correct": 0,
                        "explanation": "Scaling improves model convergence. It ensures uniform feature contribution.",
                        "difficulty": "Easy",
                        "topic": "Data Processing"
                },
                {
                        "id": 75,
                        "question": "What is normalization?",
                        "options": [
                                "Encrypting data",
                                "Scaling data between 0 and 1",
                                "Deleting data",
                                "Sorting data"
                        ],
                        "correct": 1,
                        "explanation": "Normalization standardizes ranges. It improves model performance.",
                        "difficulty": "Easy",
                        "topic": "Data Processing"
                },
                {
                        "id": 76,
                        "question": "What is standardization?",
                        "options": [
                                "Scaling to mean 0 and variance 1",
                                "Encrypting data",
                                "Deleting data",
                                "Sorting data"
                        ],
                        "correct": 0,
                        "explanation": "Standardization centers data. It is useful for many algorithms.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 77,
                        "question": "What is confusion matrix?",
                        "options": [
                                "Table showing classification performance",
                                "Database table",
                                "Encryption table",
                                "Sorting table"
                        ],
                        "correct": 0,
                        "explanation": "Confusion matrix shows true vs predicted values. It evaluates classifiers.",
                        "difficulty": "Easy",
                        "topic": "Model Evaluation"
                },
                {
                        "id": 78,
                        "question": "What is accuracy?",
                        "options": [
                                "Correct predictions ratio",
                                "Database metric",
                                "Sorting metric",
                                "Encryption method"
                        ],
                        "correct": 0,
                        "explanation": "Accuracy measures overall correctness. It may be misleading for imbalanced data.",
                        "difficulty": "Easy",
                        "topic": "Model Evaluation"
                },
                {
                        "id": 79,
                        "question": "What is precision?",
                        "options": [
                                "Encryption method",
                                "Correct positive predictions ratio",
                                "Sorting metric",
                                "Database metric"
                        ],
                        "correct": 1,
                        "explanation": "Precision measures prediction quality. It reduces false positives.",
                        "difficulty": "Easy",
                        "topic": "Model Evaluation"
                },
                {
                        "id": 80,
                        "question": "What is recall?",
                        "options": [
                                "Sorting metric",
                                "Correct positive detection ratio",
                                "Database metric",
                                "Encryption method"
                        ],
                        "correct": 1,
                        "explanation": "Recall measures detection completeness. It reduces false negatives.",
                        "difficulty": "Easy",
                        "topic": "Model Evaluation"
                },
                {
                        "id": 81,
                        "question": "What is F1-score?",
                        "options": [
                                "Average of precision and recall",
                                "Sorting metric",
                                "Database metric",
                                "Encryption method"
                        ],
                        "correct": 0,
                        "explanation": "F1-score balances precision and recall. It is useful for imbalanced datasets.",
                        "difficulty": "Easy",
                        "topic": "Model Evaluation"
                },
                {
                        "id": 82,
                        "question": "What is ROC curve?",
                        "options": [
                                "Performance graph for classifiers",
                                "Database chart",
                                "Encryption graph",
                                "Sorting graph"
                        ],
                        "correct": 0,
                        "explanation": "ROC shows trade-off between true positive and false positive rates. It evaluates models.",
                        "difficulty": "Easy",
                        "topic": "Model Evaluation"
                },
                {
                        "id": 83,
                        "question": "What is AUC?",
                        "options": [
                                "Encryption metric",
                                "Area under ROC curve",
                                "Database metric",
                                "Sorting metric"
                        ],
                        "correct": 1,
                        "explanation": "AUC measures classifier performance. Higher AUC indicates better model.",
                        "difficulty": "Easy",
                        "topic": "Model Evaluation"
                },
                {
                        "id": 84,
                        "question": "What is cross-validation?",
                        "options": [
                                "Encryption method",
                                "Splitting data multiple times for evaluation",
                                "Sorting method",
                                "Single test"
                        ],
                        "correct": 1,
                        "explanation": "Cross-validation ensures robust evaluation. It reduces bias.",
                        "difficulty": "Easy",
                        "topic": "Model Evaluation"
                },
                {
                        "id": 85,
                        "question": "What is k-fold cross-validation?",
                        "options": [
                                "Sorting method",
                                "Encryption method",
                                "Single split",
                                "Splitting data into k subsets"
                        ],
                        "correct": 3,
                        "explanation": "k-fold improves reliability. Each subset is used for testing.",
                        "difficulty": "Easy",
                        "topic": "Model Evaluation"
                },
                {
                        "id": 86,
                        "question": "What is hyperparameter tuning?",
                        "options": [
                                "Optimizing model parameters",
                                "Training model",
                                "Sorting method",
                                "Encryption method"
                        ],
                        "correct": 0,
                        "explanation": "Hyperparameters control model behavior. Tuning improves performance.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 87,
                        "question": "What is grid search?",
                        "options": [
                                "Exhaustive search for best parameters",
                                "Database query",
                                "Encryption method",
                                "Sorting method"
                        ],
                        "correct": 0,
                        "explanation": "Grid search tests parameter combinations. It finds optimal settings.",
                        "difficulty": "Easy",
                        "topic": "AI Concepts"
                },
                {
                        "id": 88,
                        "question": "What is random search?",
                        "options": [
                                "Random sampling of parameters",
                                "Encryption method",
                                "Sorting method",
                                "Random predictions"
                        ],
                        "correct": 0,
                        "explanation": "Random search is efficient. It explores parameter space faster.",
                        "difficulty": "Easy",
                        "topic": "AI Concepts"
                },
                {
                        "id": 89,
                        "question": "What is ensemble learning?",
                        "options": [
                                "Combining multiple models",
                                "Sorting method",
                                "Encryption method",
                                "Single model"
                        ],
                        "correct": 0,
                        "explanation": "Ensembles improve accuracy. Examples include boosting and bagging.",
                        "difficulty": "Easy",
                        "topic": "Machine Learning"
                },
                {
                        "id": 90,
                        "question": "What is boosting?",
                        "options": [
                                "Encryption method",
                                "Database method",
                                "Combining weak learners sequentially",
                                "Sorting method"
                        ],
                        "correct": 2,
                        "explanation": "Boosting focuses on errors. It improves model performance.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 91,
                        "question": "What is bagging?",
                        "options": [
                                "Sequential learning",
                                "Sorting method",
                                "Training models on random subsets",
                                "Encryption method"
                        ],
                        "correct": 2,
                        "explanation": "Bagging reduces variance. Random Forest uses bagging.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 92,
                        "question": "What is anomaly detection?",
                        "options": [
                                "Encryption method",
                                "Sorting method",
                                "Identifying unusual patterns",
                                "Classification"
                        ],
                        "correct": 2,
                        "explanation": "Anomaly detection finds outliers. It is used in fraud detection.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 93,
                        "question": "What is recommender system type?",
                        "options": [
                                "Encryption filtering",
                                "Sorting filtering",
                                "Database filtering",
                                "Collaborative filtering"
                        ],
                        "correct": 3,
                        "explanation": "Collaborative filtering uses user behavior. It powers recommendation engines.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 94,
                        "question": "What is content-based filtering?",
                        "options": [
                                "Recommending based on item features",
                                "Encryption method",
                                "Sorting method",
                                "Database method"
                        ],
                        "correct": 0,
                        "explanation": "Content-based filtering uses item attributes. It matches user preferences.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 95,
                        "question": "What is reinforcement learning policy?",
                        "options": [
                                "Database rule",
                                "Strategy for choosing actions",
                                "Sorting method",
                                "Encryption method"
                        ],
                        "correct": 1,
                        "explanation": "Policies guide agent decisions. They maximize rewards.",
                        "difficulty": "Easy",
                        "topic": "Machine Learning"
                },
                {
                        "id": 96,
                        "question": "What is reward function?",
                        "options": [
                                "Encryption method",
                                "Defines feedback for agent actions",
                                "Sorting method",
                                "Database function"
                        ],
                        "correct": 1,
                        "explanation": "Reward functions guide learning. They shape agent behavior.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                },
                {
                        "id": 97,
                        "question": "What is environment in reinforcement learning?",
                        "options": [
                                "Sorting method",
                                "External system interacting with agent",
                                "Encryption method",
                                "Database"
                        ],
                        "correct": 1,
                        "explanation": "Environment provides feedback. It influences learning.",
                        "difficulty": "Easy",
                        "topic": "Machine Learning"
                },
                {
                        "id": 98,
                        "question": "What is state in reinforcement learning?",
                        "options": [
                                "Database record",
                                "Encryption method",
                                "Sorting method",
                                "Current situation of agent"
                        ],
                        "correct": 3,
                        "explanation": "State represents environment conditions. It affects decisions.",
                        "difficulty": "Easy",
                        "topic": "Machine Learning"
                },
                {
                        "id": 99,
                        "question": "What is action in reinforcement learning?",
                        "options": [
                                "Decision taken by agent",
                                "Encryption method",
                                "Sorting method",
                                "Database query"
                        ],
                        "correct": 0,
                        "explanation": "Actions influence outcomes. They determine rewards.",
                        "difficulty": "Easy",
                        "topic": "Machine Learning"
                },
                {
                        "id": 100,
                        "question": "What is exploration vs exploitation?",
                        "options": [
                                "Encryption method",
                                "Database method",
                                "Sorting method",
                                "Balancing new actions and known rewards"
                        ],
                        "correct": 3,
                        "explanation": "Exploration finds better strategies. Exploitation uses known best actions.",
                        "difficulty": "Easy",
                        "topic": "General AI"
                }
        ]
};

export const getQuestionsForSubject = (subjectId: string): QuizQuestion[] => {
        return quizData[subjectId] || [];
};

export const getAllQuestions = (): QuizQuestion[] => {
        return Object.entries(quizData).flatMap(([subject, questions]) =>
                questions.map(q => ({
                        ...q,
                        id: `${subject}-${q.id}` as any // Convert ID to unique string
                }))
        );
};
