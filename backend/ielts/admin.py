from django.contrib import admin

from .models import AIConfigs, WritingTest, ChoicesTest, FillBlanksTest, FillTableTest, MapTest, WordBoxTest, TestInformation

admin.site.register(AIConfigs)
admin.site.register(WritingTest)
admin.site.register(ChoicesTest)
admin.site.register(FillBlanksTest)
admin.site.register(FillTableTest)
admin.site.register(WordBoxTest)
admin.site.register(MapTest)
admin.site.register(TestInformation)
