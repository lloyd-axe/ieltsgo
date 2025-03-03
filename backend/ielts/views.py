from django.shortcuts import render
from rest_framework.decorators import api_view
from .test_manager import (get_test, get_test_info, get_test_type_display_names, get_test_types, get_all_tests)
from .test_validator import (
    validate_writing_answer_1, validate_writing_answer_2, validate_answers, validate_table_answer,
    validate_single_choice_answer, validate_multi_choice_answer,
    handle_unanswered_question, validate_map_answer, validate_wordbox_answer)


@api_view(['POST'])
def post_validate_writing_answer(request):
    user_response = request.data.get('user_response', '')
    question = request.data.get('question', '')
    test_type = request.data.get('test_type', '')
    return validate_writing_answer_1(test_type, user_response, question)


@api_view(['POST'])
def post_validate_answers(request):
    test_data = request.data.get('test_data', {})
    user_answers = request.data.get('user_answers', {})
    correct_answers = test_data.get('answers', [])
    test_type = test_data.get('test_type', '')
    context = test_data.get('text', '')
    questions = test_data.get('questions', [])
    choices = test_data.get('choices', [])
    table_data = test_data.get('table_data', [])
    topic = test_data.get('topic', '')
    topics = test_data.get('topics', '')
    rows = test_data.get('rows', [])
    n_questions = test_data.get('num_questions', 0)

    if user_answers: # Handle unanswered questions
        user_answers = handle_unanswered_question(user_answers, correct_answers)
    
    print('user: ', user_answers, 'gt: ', correct_answers)

    validation_methods = {
        'single_selection': lambda: validate_single_choice_answer(choices, user_answers, correct_answers, questions, context),
        'double_selection': lambda: validate_multi_choice_answer(choices, user_answers, correct_answers, questions, context),
        'fill_table': lambda: validate_table_answer(user_answers, correct_answers, table_data, context, topic),
        'word_box': lambda: validate_wordbox_answer(user_answers, correct_answers, questions, context),
        'map': lambda: validate_map_answer(user_answers, correct_answers, rows, n_questions, context),
    }
    return validation_methods.get(test_type, lambda: validate_answers(user_answers, correct_answers, questions, context, topics))()


@api_view(["GET"])
def fetch_test(request, skill, test_type, item_id):
    return get_test(skill, test_type, item_id)


@api_view(["GET"])
def fetch_all_tests(request):
    skill = request.GET.get("skill", None)
    test_type = request.GET.get("test_type", None)
    page = request.GET.get("page", 1)  # Default to page 1
    page_items = request.GET.get("page_items", 12)  # Default to page 1
    return get_all_tests(page, skill, test_type, page_items)


@api_view(["GET"])
def fetch_test_types(request, skill=None):
    return get_test_types(skill)


@api_view(["GET"])
def fetch_test_info(request, test_type):
    return get_test_info(test_type)


@api_view(["GET"])
def fetch_type_display_names(request):
    return get_test_type_display_names()
