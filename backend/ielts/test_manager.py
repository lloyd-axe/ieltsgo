import logging
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import TestModel, ContextModel, QuestionsSetModel, TestInformation, QUESTION_SET_TYPES
from .serializers import TestSerializer, ContextSerializer, QuestionsSetSerializer
from django.core.paginator import Paginator
logger = logging.getLogger(__name__)

def get_test(skill, item_id):
    test = get_object_or_404(TestModel, skill=skill,  id=item_id)
    test_data = TestSerializer(test).data
    context = get_object_or_404(ContextModel, context_id=test_data.get("context"))
    context_data = ContextSerializer(context).data
    questions = QuestionsSetModel.objects.filter(context_id=test_data.get("context")).order_by("-question_id")
    question_sets = QuestionsSetSerializer(questions, many=True).data
    test_data["question_sets"] = question_sets
    test_data["context"] = context_data
    return Response(test_data)


def get_all_tests(page, skill=None, test_type=None, page_items=12):
    try:
        page = int(page)
        if page < 1:
            raise ValueError("Invalid page number")
    except ValueError:
        return Response({"error": "Invalid page number."}, status=400)

    data = []
    if skill and skill != "all":
        tests = []
        if test_type:
            # Skill + test type --------------------------------------------
            test_data = TestSerializer(TestModel.objects.filter(skill=skill), many=True).data
            for test in test_data:
                context_id = test.get("context")
                questions = QuestionsSetSerializer(QuestionsSetModel.objects.filter(
                    context_id=context_id, test_type=test_type).order_by("-question_id"), many=True).data
                if questions:
                    tests.append(test)
        else:
            # ONLY skill ---------------------------------------------------
            tests = TestSerializer(TestModel.objects.filter(skill=skill), many=True).data
    else:
        if test_type:
            # ONLY test type ---------------------------------------------
            question_sets = QuestionsSetSerializer(QuestionsSetModel.objects.filter(
                test_type=test_type).order_by("-question_id"), many=True).data
            used_context = []
            data = []
            for q_set in question_sets:
                context_id = q_set.get("context")
                if context_id not in used_context:
                    used_context.append(context_id)
                    data.extend(TestSerializer(TestModel.objects.filter(context=context_id).order_by("-id"), many=True).data)
            tests = list({test["id"]: test for test in data}.values())
        else:
            # GET ALL TESTS ---------------------------------------------
            tests = TestSerializer(TestModel.objects.all(), many=True).data
    
    for test in tests:
        # Get subject
        context_id = test.get("context")
        context = ContextSerializer(get_object_or_404(ContextModel, context_id=context_id)).data
        test["subject"] = context.get("subject")

        #Get test types
        questions = QuestionsSetSerializer(QuestionsSetModel.objects.filter(
                context_id=context_id).order_by("question_id"), many=True).data
        ttype = [q.get("test_type") for q in questions]
        test["test_type"] = ttype

    paginator = Paginator(tests, page_items)
    paginated_data = paginator.get_page(page)

    return Response({
        "data": paginated_data.object_list,
        "total_pages": paginator.num_pages,
        "current_page": page
    })


def get_test_types(skill=None):
    test_types = [ttype[0] for ttype in QUESTION_SET_TYPES]
    if skill == "writing":
        test_types.remove("task_1")
        test_types.remove("task_2")

    return Response({"test_types": test_types})
    

def get_test_info(test_type):
    test_info = TestInformation.objects.filter(test_type=test_type).values_list("information", flat=True).first()
    return Response({"info": test_info or "Test information does not exists."})


def get_test_type_display_names():
    display_names = {ttype[0]: ttype[1] for ttype in QUESTION_SET_TYPES}
    display_names["all"] = "All"
    return Response({"display_names": display_names})