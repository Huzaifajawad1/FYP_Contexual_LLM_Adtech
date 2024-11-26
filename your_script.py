import sys
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
from collections import defaultdict
from math import log

# Receive input from Node.js
input_string = sys.stdin.readline().strip()

# Dictionary of topics and subtopics
dictionary  = {
    'Arrays': [
        'Declaration and Initialization',
        'Indexing and Accessing Elements',
        'Basic Operations (e.g., Sum, Average)',
        'Multidimensional Arrays',
        'Sorting Algorithms',
        'Searching Algorithms',
        'Array Manipulation and Transformation',
        'Dynamic Arrays (Vectors in C++)',
        'Optimization Techniques'
    ],
    'Arrays & Functions': [
        'Passing Arrays as Function Arguments',
        'Modifying Arrays within Functions',
        'Returning Arrays from Functions',
        'Interaction with Other Data Types'
    ],
    'Pointers': [
        'Introduction to Pointers',
        'Pointer Declaration and Initialization',
        'Pointer Arithmetic',
        'Dereferencing Pointers',
        'Pointers and Arrays Relationship',
        'Function Pointers',
        'NULL Pointers and Void Pointers',
        'Pointer to Structures and Functions'
    ],
    'Memory Allocation': [
        'Static Memory Allocation',
        'Dynamic Memory Allocation (new and delete in C++)',
        'Memory Leaks and Debugging',
        'Memory Optimization Techniques',
        'Memory Pools and Custom Allocators'
    ],
    'String': [
        'C-style Strings',
        'String Declaration and Initialization',
        'String Manipulation and Concatenation',
        'String Input/Output Operations',
        'String Comparison and Searching',
        'String Libraries and Advanced Handling',
        'Standard String Functions (strlen, strcpy, etc.)',
        'Regular Expressions',
        'Custom String Functions and Algorithms'
    ],
    'String Functions': [
        'Basic String Operations',
        'Advanced String Manipulation',
        'String Concatenation and Slicing',
        'String Formatting and Parsing',
        'String Length and Trimming',
        'String Encoding and Decoding'
    ],
    'Structures': [
        'Declaration and Initialization of Structures',
        'Accessing Structure Members',
        'Nested Structures',
        'Functions with Structures',
        'Advanced Structure Concepts (e.g., Bitfields, Alignment)'
    ],
    'File Handling': [
        'Basic File I/O Operations',
        'File Modes and Permissions',
        'Sequential File Processing',
        'Error Handling in File Operations',
        'Random Access File Handling',
        'Binary File Manipulation and Serialization'
    ],
    'Variables and Datatypes': [
        'Understanding Variables and Data Types',
        'Simple Variable Assignments and Operations',
        'Deeper Understanding of Data Types',
        'Type Conversions and Casting',
        'Complex Variable Manipulations',
        'Memory Management with Variables',
        'Advanced Data Types and Custom Structures'
    ],
    'Operators and Expressions': [
        'Basic Arithmetic Operators',
        'Relational and Logical Operators',
        'Simple Expressions and Precedence',
        'Bitwise Operators',
        'Ternary Operators',
        'Complex Expressions and Operator Overloading',
        'Custom Operators',
        'Operator Precedence in Complex Expressions',
        'Understanding and Implementing Custom Overloaded Operators'
    ],
    'if-else Conditional Statements': [
        'Basic if Statements',
        'Simple Conditions and Comparisons',
        'else and else if Statements',
        'Nested if Statements',
        'Short-circuit Evaluation',
        'Complex Conditional Statements',
        'Advanced Branching and Optimization Techniques'
    ],
    'while, do-while, Loop': [
        'Basic while Loop',
        'Loop Control Statements (break, continue)',
        'Simple Loop Examples',
        'do-while Loop',
        'Nested Loops',
        'Loop Optimization Techniques',
        'Advanced Loop Structures',
        'Loop Unrolling and Vectorization'
    ],
    'for Loop': [
        'Basic for Loop',
        'Loop Control Statements (break, continue)',
        'Iterating through Arrays',
        'Nested for Loops',
        'Range-based for Loops',
        'Advanced Loop Structures',
        'Parallelizing Loops for Performance'
    ],
    'break, continue, & switch Case': [
        'Basic Usage of break and continue',
        'Simple switch-case Statements',
        'Advanced Uses of break and continue',
        'Multiple Cases in switch Statements',
        'Optimizing switch-case Performance',
        'Using break and continue in Complex Control Flow'
    ],
    'Functions and Recursion': [
        'Basics of Function Declaration and Definition',
        'Function Parameters and Return Types',
        'Function Overloading',
        'Scope and Lifetime of Variables',
        'Recursive Functions',
        'Function Pointers and Callbacks',
        'Advanced Recursion Techniques',
        'Designing and Implementing Complex Functions'
    ]
}

def tokenize_and_stem(text):
    # Convert to lowercase, remove stop words, tokenize, and stem the input text
    stemmer = PorterStemmer()
    tokens = word_tokenize(text.lower())
    filtered_tokens = [stemmer.stem(token) for token in tokens if token.isalnum()]
    return set(filtered_tokens)

def advanced_scoring(count_common_tokens, weight_factor):
    # Apply logarithmic scaling to the count of common tokens
    scaled_count = log(count_common_tokens + 1)  # Adding 1 to avoid log(0)
    return weight_factor * scaled_count

def calculate_score_advanced(input_tokens, dictionary):
    scores = defaultdict(float)
    threshold = 5  # Threshold to determine if input is unrelated.

    for i, (topic, subtopics) in enumerate(dictionary.items()):
        # Score for the topic
        topic_tokens = tokenize_and_stem(topic)
        count_common_tokens_topic = len(set(input_tokens) & set(topic_tokens))
        scores[i] += advanced_scoring(count_common_tokens_topic, 50)

        # Score for subtopics
        for j, subtopic in enumerate(subtopics):
            subtopic_tokens = tokenize_and_stem(subtopic)
            count_common_tokens_subtopic = len(set(input_tokens) & set(subtopic_tokens))
            scores[i] += advanced_scoring(count_common_tokens_subtopic, 2.5)

    # Find the topic with the maximum score
    max_score_index = max(scores, key=scores.get)
    
    # Check if the maximum score is below the threshold
    if scores[max_score_index] < threshold:
        return "none"
    
    return "set" + str(max_score_index + 1)

# Example usage
input_tokens = tokenize_and_stem(input_string)
result = calculate_score_advanced(input_tokens, dictionary)

# Send output to Node.js
sys.stdout.write(result)
sys.stdout.flush()
