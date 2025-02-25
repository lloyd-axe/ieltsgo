from django.apps import apps
from .serializers import (WritingTestSerializer, ChoicesTestSerializer, FillBlanksTestSerializer, 
                          FillTableTestSerializer, MapTestSerializer, WordBoxTestSerializer)
from .models import WritingTest, ChoicesTest, FillBlanksTest, FillTableTest, MapTest, WordBoxTest

MODEL_SERIALIZER = {
    "writing": (WritingTest, WritingTestSerializer),
    "choice": (ChoicesTest, ChoicesTestSerializer),
    "blanks": (FillBlanksTest, FillBlanksTestSerializer),
    "table": (FillTableTest, FillTableTestSerializer),
    "map": (MapTest, MapTestSerializer),
    "word_box": (WordBoxTest, WordBoxTestSerializer)
}

TEST_CONFIG = {
    "writing": {
        "task_1": MODEL_SERIALIZER['writing'],
        "task_2": MODEL_SERIALIZER['writing'],
    },
    "reading": {
        "single_selection": MODEL_SERIALIZER['choice'],
        "double_selection": MODEL_SERIALIZER['choice'],
        "fill_table": MODEL_SERIALIZER['table'],
        "fill_sentence_1": MODEL_SERIALIZER['blanks'],
        "fill_sentence_2": MODEL_SERIALIZER['blanks'],
        "fill_list": MODEL_SERIALIZER['blanks'],
        "map": MODEL_SERIALIZER['map'],
        "word_box": MODEL_SERIALIZER['word_box'],
        "flow_chart" : MODEL_SERIALIZER['word_box']
    },
    "listening": {
        "single_selection": MODEL_SERIALIZER['choice'],
        "double_selection": MODEL_SERIALIZER['choice'],
        "fill_table": MODEL_SERIALIZER['table'],
        "fill_sentence_1": MODEL_SERIALIZER['blanks'],
        "fill_sentence_2": MODEL_SERIALIZER['blanks'],
        "fill_list": MODEL_SERIALIZER['blanks'],
        "map": MODEL_SERIALIZER['map'],
        "word_box": MODEL_SERIALIZER['word_box'],
        "flow_chart" : MODEL_SERIALIZER['word_box']
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
