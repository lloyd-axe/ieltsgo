from rest_framework import serializers
from .models import ContextModel, TestModel, QuestionsSetModel, TestInformation, AIConfigs, WritingScoreLogs, TestScoreLogs


class TestScoreLogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestScoreLogs
        fields = "__all__"


class WritingScoreLogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WritingScoreLogs
        fields = "__all__"


class QuestionsSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionsSetModel
        fields = "__all__"


class ContextSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContextModel
        fields = "__all__"


class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestModel
        fields = "__all__"


class TestInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestInformation
        fields = "__all__"


class AIConfigsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIConfigs
        fields = "__all__"
