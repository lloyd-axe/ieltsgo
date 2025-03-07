from django.db import models
from django.core.exceptions import ValidationError

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
    test_type = models.CharField(max_length=50, choices=QUESTION_SET_TYPES)
    information = models.TextField()

    def __str__(self):
        return f"{self.test_type} - info"
    
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