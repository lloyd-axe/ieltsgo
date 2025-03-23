single_selection =  { # list[str]
    "questions": [
            "q1", 
            "q2",
            ...
        ],
    "choices": [ # list[list[str]]
        [
            "c1", 
            "c2", 
            ...
        ]
    ],
    "answers" : [ # index list[int]
        1, 
        0,
        ...
    ]
}

"""
give me 1 ielts reading example text. Minimum of 4 paragraphs. 
Make sure it does not exists anywhere in the internet to avoid copyright. 
Topic should be about history.
Then, give me 10 questions with 4 multiple choice answers each from this text. 
There should be 1 answers in each question. 
Question format should be a list of string ["question1", "question2", ...]. 
Choices format should be a nested list of string [["q_choice1", ...], ["q2_choice1", ...], ...]. 
Answers format should be a list of index [1, 0, ...]. 
Index should start from 0. Make sure the question and answers can be found in the given text.
"""

"""
give me 1 ielts reading example text. Minimum of 4 paragraphs. 
Make sure it does not exists anywhere in the internet to avoid copyright. 
Topic should be about history.
Then, give me 10 true, false, not-give type questions.
Question format should be a list of string ["question1", "question2", ...]. 
Choices format should be a nested list of string [["True", "False", "Not Given"], ["True", "False", "Not Given"], ...]. 
Answers format should be a list of index [1, 0, ...]. 
Index should start from 0. Make sure the question and answers can be found in the given text.
"""

double_selection =  { # list[str]
    "questions": [
            "q1", 
            "q2",
            ...
        ],
    "choices": [ # list[list[str]]
        [
            "c1", 
            "c2", 
            ...
        ]
    ],
    "answers" : [ # index list[list[int]]
        [
            1, 
            0,
            ...
        ]
    ]
}

"""
give me 1 ielts reading example text. Minimum of 3 paragraphs. 
Make sure it does not exists anywhere in the internet to avoid copyright. 
Topic is about history.
Then, give me 6 questions with 4 multiple choice answers each from this text. 
There should be 2 answers in each question. Question format should be a list of string ["question1", "question2", ...]. Choices format should be a nested list of string [["q_choice1", ...], ["q2_choice1", ...], ...]. 
Answers format should be a nested list of index [[1, 0], [2, 3], ...]. 
Index should start from 0. Make sure the question and answers can be found in the given text.
"""

fill_table =  { # list[str]
    "topics": ["Homo sapiens vs Neanderthals"],
    "table_data": [ # list[list[str]]
        ["col1", "col2", "col3"], 
        ["row1a", "row1b |1|", "row1c"], 
        ...
        ],
    "answers" : [ # list[str]
        "ans1", 
        "ans2",
        ...
    ]
}

"""
give me 1 ielts reading example text that you can make a table out of. Minimum of 4 paragraphs.
The table will be a cause and effect table where you compare the cause and effects from the text.
Make sure the exact contents in the table can be found in the text.
Make sure it does not exists anywhere in the internet to avoid copyright.

Make a 4 column 5 row table about the machine specs based on this text.


Each cell should only contain 1 word.
Each row should have at least 1 missing value.
List the missing values in a list of sting. For example ["row1b", "row2a"].
The missing values in the cell should be represented by |n|.
The table format should be similar to this [["column1", "column3", "column3"], ["row1a", "|1|", "row1c"], ["|2|", "row2b", "row2c"], ...] 
"""

fill_sentence = {
    "questions": [ # list[list[str]]
        [
            "Type: |1| bike", 
            "Rental: $30 a week, or |2| a day", 
            ...
        ]
    ],
    "topics": ["Notes -- Clark's Bicycle Hire"], # list[str]
    "answers" : [ # list[list[str]]
        [
            "touring", 
            "$100", 
            ...
        ]
    ]
}


"""
give me 1 ielts reading example text. Minimum of 4 paragraphs. 
Make sure it does not exists anywhere in the internet to avoid copyright. 
Topic is about history.
Then, give me 5 fill in the blanks questions. 
Each blank should only contain 1 word or number. 
Question format should be a list of string where blank is represented by |N|, example: ["who |1| you?", "thi |2| is cool", ...]. 
Answers format should be a nested list of index ["punched", "rock", ...]. 
"""

map =  { # list[str]
    "topics": ["Homo sapiens vs Neanderthals"],
    "table_data": [ # list[list[str]]
        ["", "A", "B", ...], # columns
        ["row1", "row2", "row3", ...], # rows
        ],
    "answers" : [ # index list[int]
        1, 
        0,
        ...
    ]
}

"""
give me 1 ielts reading example text. Minimum of 3 paragraphs. 
Topic is about describing the map of the school. 
Try to mention as much landmarks as possible and desribe where they are in the map.
Make sure it does not exists anywhere in the internet to avoid copyright.
List the landmarks in a list of string.
"""

word_box =  { # list[str]
    "questions": [
            "q1 |1|", 
            "q2 |2|",
            ...
        ],
    "word_box": [ # index list[str]
        "ans1", 
        "ans2",
        ...
    ],
    "answers" : [ # index list[str]
        "ans1", 
        "ans2",
        ...
    ]
}
"""
give me 1 ielts reading example text. Minimum of 4 paragraphs. 
Make sure it does not exists anywhere in the internet to avoid copyright. 
Topic is about history.
Then, give me 8 fill in the blanks questions. 
Each blank should only contain 1 word or number. 
Question format should be a list of string where blank is represented by |N|, example: ["who |1| you?", "thi |2| is cool", ...]. 
Answers format should be a nested list of index ["punched", "rock", ...]. 
"""

