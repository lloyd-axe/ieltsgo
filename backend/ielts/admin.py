from django.contrib import admin

from .models import ContextModel, TestModel, QuestionsSetModel, TestInformation, AIConfigs

admin.site.register(ContextModel)
admin.site.register(TestModel)
admin.site.register(QuestionsSetModel)
admin.site.register(TestInformation)
admin.site.register(AIConfigs)