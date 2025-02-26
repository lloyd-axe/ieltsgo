from django.shortcuts import render

import google.generativeai as genai
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.conf import settings
from .models import AIConfigs
from .serializers import AIConfigsSerializer
from .test_manager import (get_test, get_test_info, get_test_type_display_names, get_test_types, get_all_tests)
from .test_validator import (validate_writing_answer, validate_answers, validate_matching_answer,
                             validate_single_choice_answer, validate_multi_choice_answer)


genai.configure(api_key=settings.AI_API_KEY)

def fetch_model_configs():
    model_configs = AIConfigs.objects.filter(is_active=True).order_by("id").first()
    serializer = AIConfigsSerializer(model_configs)
    return serializer.data


@api_view(['POST'])
def post_validate_writing_answer(request):
    user_response = request.data.get('user_response', '')
    question = request.data.get('question', '')
    test_type = request.data.get('test_type', '')
    model_configs = fetch_model_configs()
    print(f"Using {model_configs['model_name']} model.")
    
    model = genai.GenerativeModel(
        model_name=model_configs['model_name'],
        safety_settings=model_configs['safety_settings'],
        generation_config=model_configs['generation_config'],
        system_instruction=model_configs['system_prompt']
    )
    task_prompt = model_configs[f'task{test_type.split("_")[1]}_prompt']
    return validate_writing_answer(model, user_response, question, task_prompt)


@api_view(['POST'])
def post_validate_answers(request):
    test_type = request.data.get('test_type', '')
    user_answers = request.data.get('answers', {})
    correct_answers = request.data.get('correct_answers', '')
    n_choices = request.data.get('n_choices', 0)

    if user_answers:
        # Handle unanswered questions
        if isinstance(list(user_answers.values())[0], dict):
            for n, correct in enumerate(correct_answers):
                user_answers[str(n)] = {
                    str(m): user_answers.get(str(n), {}).get(str(m), None)
                    for m in range(len(correct))
                }
                user_answers[str(n)] = list(user_answers[str(n)].values())
        else:
            user_answers = {str(n): user_answers.get(str(n), None) for n in range(len(correct_answers))}
            

        user_answers = {k: user_answers[k] for k in sorted(user_answers)}
    print(user_answers, correct_answers)
    if test_type == 'single_selection' or test_type == 'map':
        return validate_single_choice_answer(n_choices, user_answers, correct_answers)
    elif test_type == 'double_selection':
        return validate_multi_choice_answer(n_choices, user_answers, correct_answers)
    elif test_type == 'fill_table' or test_type == 'word_box':
        return validate_matching_answer(user_answers, correct_answers)
    return validate_answers(n_choices, user_answers, correct_answers)


@api_view(["GET"])
def fetch_test(request, skill, test_type, item_id):
    return get_test(skill, test_type, item_id)


@api_view(["GET"])
def fetch_all_tests(request, skill=None, test_type=None):
    return get_all_tests(skill, test_type)


@api_view(["GET"])
def fetch_test_types(request, skill=None):
    return get_test_types(skill)


@api_view(["GET"])
def fetch_test_info(request, test_type):
    return get_test_info(test_type)


@api_view(["GET"])
def fetch_type_display_names(request):
    return get_test_type_display_names()
