from django.db import models
from django.core.exceptions import ValidationError


TEST_TYPES = {
    "writing": [
        ("task_1", "Task 1"),
        ("task_2", "Task 2"),
    ],
    "choices": [
        ("single_selection", "Single Selection"),
        ("double_selection", "Double Selection"),
    ],
    "fill_blanks": [
        ("fill_sentence", "Fill the Blanks"),
        ("fill_list", "Fill the List"),
    ],
    "fill_table": [
        ("fill_table", "Fill the Table")
    ],
    "map": [
        ("map", "Map")
    ],
    "word_box": [
        ("word_box", "Word Box")
    ]
}


QUESTION_SET_TYPES = [
    ("task_1", "Task 1"),
    ("task_2", "Task 2"),
    ("single_selection", "Single Selection"),
    ("double_selection", "Double Selection"),
    ("fill_sentence", "Fill the Blanks"),
    ("fill_list", "Fill the List"),
    ("fill_table", "Fill the Table"),
    ("map", "Map Test"),
    ("word_box", "Word Box")
]


class ContextModel(models.Model):
    context_id = models.AutoField(primary_key=True)
    subject = models.CharField(max_length=50, null=False, blank=False)
    context = models.TextField()
    audio_url = models.URLField(blank=True, null=True)
    image_url = models.URLField(null=True, blank=True)

    def __str__(self):
        return f'{self.context_id} - {self.subject}'


class QuestionsSetModel(models.Model):
    question_id = models.AutoField(primary_key=True)
    test_type = models.CharField(max_length=50, choices=QUESTION_SET_TYPES, null=False, blank=False)
    context = models.ForeignKey(ContextModel, on_delete=models.CASCADE, related_name="q_context")
    questions = models.JSONField(default=list, blank=True, null=True,
                                 help_text='default: ["q1", "q2"]\nblanks: [["question1 __1__", "__2__ question2"]]')
    answers = models.JSONField(default=list, blank=True, null=True,
                               help_text='[0, "an0"]')
    topics = models.JSONField(default=list, blank=True, null=True,
                              help_text='["t1", "t2"]')
    choices = models.JSONField(default=list, blank=True, null=True,
                               help_text='[["c1", "c2"], ["c1", "c2"]]')
    table_data = models.JSONField(default=list, blank=True, null=True,
                                  help_text='default: [["col1", "col2"], ["row1a", "row1b |0|"]]\n maps: [[]"", "A", "B", "C"], ["row1, row2, row3"]]')
    word_box = models.JSONField(default=list, blank=True, null=True,
                                help_text='["wrod1", "word2"]')

    def __str__(self):
        return f"Q:{self.question_id} -{self.test_type}: {self.context.subject}"


class TestModel(models.Model):
    SKILL_TYPES = [
        ("listening", "Listening"),
        ("reading", "Reading"),
        ("writing", "Writing"),
        ("speaking", "Speaking")
    ]
    skill = models.CharField(max_length=10, choices=SKILL_TYPES, null=False, blank=False)

    context = models.ForeignKey(ContextModel, on_delete=models.CASCADE, related_name="tests")
    
    def __str__(self):
        return f"{self.id}: {self.get_skill_display()} - {self.context.subject}"


class TestInformation(models.Model):
    all_test_types = []
    for k,v in TEST_TYPES.items():
        all_test_types += v

    test_types = models.CharField(max_length=50, choices=all_test_types)
    information = models.TextField()

    def __str__(self):
        return f"{self.test_types()} - info"
    
class AIConfigs(models.Model):
    model_display_name = models.CharField(max_length=50, null=False, blank=False)
    is_active = models.BooleanField(null=False, blank=False, default=False)
    model_name = models.CharField(max_length=50, null=False, blank=False)
    image_url = models.URLField(null=True, blank=True)
    system_prompt = models.TextField(null=False, blank=False)
    generation_config = models.JSONField(null=True, blank=True, default={
        "temperature": 0.7,
        "top_p": 1,
        "top_k": 1,
        "max_output_tokens": 2048,
        "response_mime_type":"text/plain"
    })
    safety_settings = models.JSONField(null=True, blank=True, default=[
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE",
        },
    ])
    task1_prompt = models.TextField(null=False, blank=False)
    task2_prompt = models.TextField(null=False, blank=False)


    def __str__(self):
        return self.model_display_name    
    
# class MultipleChoiceModel(QuestionSetModel):
#     test_type = models.CharField(max_length=50, choices=TEST_TYPES["choices"], null=False, blank=False)
#     questions = models.JSONField(default=["q1", "q2"])
#     choices = models.JSONField(null=True, blank=True, default=[["c1", "c2"], ["c1", "c2"]])
#     answers = models.JSONField(default=[0, 1])
#     def __str__(self):
#         return f"{self.question_id} - {self.test_type}"


# class BasicTestModel(models.Model):
#     SKILL_TYPES = [
#         ("listening", "Listening"),
#         ("reading", "Reading"),
#         ("writing", "Writing"),
#         ("speaking", "Speaking")
#     ]
#     skill = models.CharField(max_length=10, choices=SKILL_TYPES, null=False, blank=False)
#     subject = models.CharField(max_length=50, null=False, blank=False)
    
#     def __str__(self):
#         return f"{self.get_skill_display()} - {self.subject}"

#     class Meta:
#         abstract = True

# class AIConfigs(models.Model):
#     model_display_name = models.CharField(max_length=50, null=False, blank=False)
#     is_active = models.BooleanField(null=False, blank=False, default=False)
#     model_name = models.CharField(max_length=50, null=False, blank=False)
#     system_prompt = models.TextField(null=False, blank=False)
#     generation_config = models.JSONField(null=True, blank=True, default={
#         "temperature": 0.7,
#         "top_p": 1,
#         "top_k": 1,
#         "max_output_tokens": 2048,
#         "response_mime_type":"text/plain"
#     })
#     safety_settings = models.JSONField(null=True, blank=True, default=[
#         {
#             "category": "HARM_CATEGORY_HARASSMENT",
#             "threshold": "BLOCK_MEDIUM_AND_ABOVE",
#         },
#         {
#             "category": "HARM_CATEGORY_HATE_SPEECH",
#             "threshold": "BLOCK_MEDIUM_AND_ABOVE",
#         },
#         {
#             "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
#             "threshold": "BLOCK_MEDIUM_AND_ABOVE",
#         },
#         {
#             "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
#             "threshold": "BLOCK_MEDIUM_AND_ABOVE",
#         },
#     ])
#     task1_prompt = models.TextField(null=False, blank=False)
#     task2_prompt = models.TextField(null=False, blank=False)


#     def __str__(self):
#         return self.model_display_name


class TestInformation(models.Model):
    all_test_types = []
    for k,v in TEST_TYPES.items():
        all_test_types += v

    test_types = models.CharField(max_length=50, choices=all_test_types)
    information = models.TextField()

    def __str__(self):
        return f"{self.test_types()} - info"


# class WritingTest(BasicTestModel):
#     allowed_skills = ["writing"]
#     test_type = models.CharField(max_length=50, choices=TEST_TYPES["writing"], null=False, blank=False)
#     question = models.TextField()
#     diagram_url = models.URLField(blank=True, null=True)

#     def clean(self):
#         if self.skill not in self.allowed_skills:
#             raise ValidationError(f"This test type is only allowed for skill = {' '.join(self.allowed_skills)}")


# class ChoicesTest(BasicTestModel):
#     allowed_skills = ["reading", "listening"]
#     test_type = models.CharField(max_length=50, choices=TEST_TYPES["choices"], null=False, blank=False)
#     text = models.TextField()
#     questions = models.JSONField(default=["question"])
#     choices = models.JSONField(null=True, blank=True, default=[["choices"]])
#     answers = models.JSONField(default=["answer"])

#     audio_url = models.URLField(blank=True, null=True)

#     def clean(self):
#         if self.skill not in self.allowed_skills:
#             raise ValidationError(f"This test type is only allowed for skill = {' '.join(self.allowed_skills)}")
        
#         if len(self.questions) != len(self.answers):
#             raise ValidationError("The number of questions and answers must be equal.")

#         if self.choices:
#             if len(self.questions) != len(self.choices):
#                 raise ValidationError("The number of questions and choices must be equal.")
            
#         if self.skill == "listening" and not self.audio_url:
#             raise ValidationError("Audio URL is required for 'listening' test type.")
        
#         if self.skill == "reading" and self.audio_url:
#             raise ValidationError("Audio URL should not be provided for 'reading' test type.")

        
# class FillBlanksTest(BasicTestModel):
#     allowed_skills = ["reading", "listening"]
#     test_type = models.CharField(max_length=50, choices=TEST_TYPES["fill_blanks"], null=False, blank=False)
#     text = models.TextField()
#     topics = models.JSONField(default=["topics"], null=False, blank=False)
#     questions = models.JSONField(default=[["question1 __1__", "__2__ question2"]], null=False, blank=False)
#     answers = models.JSONField(default=[["asnwer1", "aswer2"]], null=False, blank=False)
#     audio_url = models.URLField(blank=True, null=True)

#     def clean(self):
#         if self.skill not in self.allowed_skills:
#             raise ValidationError(f"This test type is only allowed for skill = {' '.join(self.allowed_skills)}")
        
#         if self.test_type != "fill_list":
#             if len(self.questions) != len(self.answers):
#                 raise ValidationError("The number of questions and answers must be equal.")
            
#         if self.skill == "listening" and not self.audio_url:
#             raise ValidationError("Audio URL is required for 'listening' test type.")
        
#         if self.skill == "reading" and self.audio_url:
#             raise ValidationError("Audio URL should not be provided for 'reading' test type.")
            

# class FillTableTest(BasicTestModel):
#     allowed_skills = ["reading", "listening"]
#     test_type = models.CharField(max_length=50, choices=TEST_TYPES["fill_table"], null=False, blank=False)
#     text = models.TextField()
#     topic = models.TextField()
#     table_data = models.JSONField(default=[['col1', 'col2'], ['row1a', 'row1b |0|']], null=False, blank=False)
#     answers = models.JSONField(default=["asnwer1"],  null=False, blank=False)
#     audio_url = models.URLField(blank=True, null=True)

#     def clean(self):
#         if self.skill not in self.allowed_skills:
#             raise ValidationError(f"This test type is only allowed for skill = {' '.join(self.allowed_skills)}")
    
#         if self.skill == "listening" and not self.audio_url:
#             raise ValidationError("Audio URL is required for 'listening' test type.")
        
#         if self.skill == "reading" and self.audio_url:
#             raise ValidationError("Audio URL should not be provided for 'reading' test type.")


# class MapTest(BasicTestModel):
#     allowed_skills = ["reading", "listening"]
#     test_type = models.CharField(max_length=50, choices=TEST_TYPES["map"], null=False, blank=False)
#     text = models.TextField()
#     diagram_url = models.URLField(null=False, blank=False)
#     topic = models.TextField()
#     num_questions = models.IntegerField(null=False, blank=False)
#     rows = models.JSONField(default=["word 1"], null=False, blank=False)
#     answers = models.JSONField(default=["a", "b"],  null=False, blank=False)
#     audio_url = models.URLField(blank=True, null=True)

#     def clean(self):
#         if self.skill not in self.allowed_skills:
#             raise ValidationError(f"This test type is only allowed for skill = {' '.join(self.allowed_skills)}")
        
#         if self.skill == "listening" and not self.audio_url:
#             raise ValidationError("Audio URL is required for 'listening' test type.")
        
#         if self.skill == "reading" and self.audio_url:
#             raise ValidationError("Audio URL should not be provided for 'reading' test type.")


# class WordBoxTest(BasicTestModel):
#     allowed_skills = ["reading", "listening"]
#     test_type = models.CharField(max_length=50, choices=TEST_TYPES["word_box"], null=False, blank=False)
#     text = models.TextField()

#     questions = models.JSONField(default=["text", "__1__"], null=False, blank=False)
#     word_box = models.JSONField(default=["wrod1", "word2"], null=False, blank=False)
#     answers = models.JSONField(default=["asnwer1", "aswer2"], null=False, blank=False)
#     audio_url = models.URLField(blank=True, null=True)

#     def clean(self):
#         if self.skill not in self.allowed_skills:
#             raise ValidationError(f"This test type is only allowed for skill = {' '.join(self.allowed_skills)}")
        
#         if self.skill == "listening" and not self.audio_url:
#             raise ValidationError("Audio URL is required for 'listening' test type.")
        
#         if self.skill == "reading" and self.audio_url:
#             raise ValidationError("Audio URL should not be provided for 'reading' test type.")
            