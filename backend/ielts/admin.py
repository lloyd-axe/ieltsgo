from django.contrib import admin

from .models import ContextModel, TestModel, QuestionsSetModel, TestInformation, AIConfigs, WritingScoreLogs, TestScoreLogs

admin.site.register(ContextModel)
admin.site.register(TestModel)
admin.site.register(QuestionsSetModel)
admin.site.register(TestInformation)
admin.site.register(AIConfigs)
admin.site.register(WritingScoreLogs)
admin.site.register(TestScoreLogs)