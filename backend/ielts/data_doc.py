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
