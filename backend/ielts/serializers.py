from rest_framework import serializers
from .models import AIConfigs, WritingTest, ChoicesTest, FillBlanksTest, FillTableTest, MapTest, WordBoxTest, TestInformation


class AIConfigsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIConfigs
        fields = "__all__"
        

class WritingTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = WritingTest
        fields = "__all__"


class ChoicesTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChoicesTest
        fields = "__all__"


class FillBlanksTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FillBlanksTest
        fields = "__all__"


class FillTableTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FillTableTest
        fields = "__all__"


class MapTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = MapTest
        fields = "__all__"

class WordBoxTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = WordBoxTest
        fields = "__all__"


class TestInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestInformation
        fields = "__all__"
