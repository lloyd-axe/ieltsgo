from django.shortcuts import render
from rest_framework.decorators import api_view
from .test_manager import (get_test, get_test_info, get_test_type_display_names, get_test_types, get_all_tests)
from .test_validator import (
    validate_writing_answer_1, validate_writing_answer_2, validate_answers, validate_table_answer,
    validate_single_choice_answer, validate_multi_choice_answer,
    handle_unanswered_question, validate_map_answer, validate_wordbox_answer)
from django.http import HttpResponse
from django.urls import reverse
import xml.etree.ElementTree as ET
from django.http import JsonResponse
from django.middleware.csrf import get_token

def get_csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})

@api_view(['POST'])
def post_validate_writing_answer(request):
    user_response = request.data.get('user_response', '')
    question = request.data.get('question', '')
    test_type = request.data.get('test_type', '')
    return validate_writing_answer_1(test_type, user_response, question)


@api_view(['POST'])
def post_validate_answers(request):
    test_data = request.data.get('test_data', {})
    full_user_answers = request.data.get('user_answers', {})
    full_user_answers = full_user_answers if full_user_answers else {} 
    return validate_answers(test_data, full_user_answers)


@api_view(["GET"])
def fetch_test(request):
    skill = request.GET.get("skill", None)
    item_id = request.GET.get("item_id", None)
    return get_test(skill, item_id)


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


def custom_sitemap(request):
    base_url = request.build_absolute_uri('/')[:-1]  # Remove trailing slash
    urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

    # ✅ Static API URLs
    api_urls = [
        "get_all_tests",
        "get_all_test_types",
        "get_test_display_name",
    ]

    for api in api_urls:
        url = ET.SubElement(urlset, "url")
        ET.SubElement(url, "loc").text = f"{base_url}{reverse(api)}"
        ET.SubElement(url, "priority").text = "0.8"
        ET.SubElement(url, "changefreq").text = "weekly"

    # ✅ Dynamic API URLs (Example Data)
    dynamic_api_urls = [
        {"name": "get_test", "params": {"skill": "reading", "test_type": "mock", "item_id": 123}},
        {"name": "get_test_types", "params": {"skill": "writing"}},
        {"name": "get_test_info", "params": {"test_type": "academic"}},
    ]

    for api in dynamic_api_urls:
        try:
            url_path = reverse(api["name"], kwargs=api["params"])
            url = ET.SubElement(urlset, "url")
            ET.SubElement(url, "loc").text = f"{base_url}{url_path}"
            ET.SubElement(url, "priority").text = "0.6"
            ET.SubElement(url, "changefreq").text = "monthly"
        except Exception:
            pass  # Skip invalid routes

    xml_string = ET.tostring(urlset, encoding="utf-8", method="xml")
    return HttpResponse(xml_string, content_type="application/xml")