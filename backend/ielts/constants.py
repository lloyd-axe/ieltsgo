from django.apps import apps

# MODEL_SERIALIZER = {
#     "writing": (WritingTest, WritingTestSerializer),
#     "choice": (ChoicesTest, ChoicesTestSerializer),
#     "blanks": (FillBlanksTest, FillBlanksTestSerializer),
#     "table": (FillTableTest, FillTableTestSerializer),
#     "map": (MapTest, MapTestSerializer),
#     "word_box": (WordBoxTest, WordBoxTestSerializer)
# }

MODEL_SERIALIZER = {
"test":(0,0)
}

TEST_CONFIG = {
    "writing": {
        "task_1": MODEL_SERIALIZER['test'],
        "task_2": MODEL_SERIALIZER['test'],
    }
}

# TASK_TYPES = {
#     "writing": [
#         ("task_1", "Task 1"),
#         ("task_2", "Task 2"),
#     ],
#     "choices": [
#         ("single_selection", "Single Selection"),
#         ("double_selection", "Double Selection"),
#     ],
#     "fill_blanks": [
#         ("fill_sentence_1", "Fill in the Blanks - One word only"),
#         ("fill_sentence_2", "Fill in the Blanks - No more than two words"),
#         ("fill_list", "Fill the List"),
#     ],
#     "fill_table": [
#         ("fill_table", "Fill in the Table")
#     ],
#     "map": [
#         ("map", "Label the Map")
#     ],
#     "word_box": [
#         ("word_box", "Choose from the Word Box"),
#         ("flow_chart", "Complete the Flow Chart")
#     ]
# }
