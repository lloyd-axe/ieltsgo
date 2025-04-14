import logging
from django.shortcuts import render
from rest_framework.decorators import api_view
from .test_manager import (get_test, get_test_info, get_test_type_display_names, get_test_types, get_all_tests)
from .test_validator import (
    validate_writing_answer_1, validate_answers)
from .models import TestModel, ContextModel, QuestionsSetModel
from django.http import HttpResponse
import xml.etree.ElementTree as ET
from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.throttling import AnonRateThrottle
from rest_framework.exceptions import Throttled

logger = logging.getLogger(__name__)

class CustomAnonThrottleWriting(AnonRateThrottle):
    rate = '10/hour' 


def get_csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})

def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0].strip()  # Get first IP in the chain
    else:
        ip = request.META.get("CF-Connecting-IP") or request.META.get("REMOTE_ADDR")
    return ip


@api_view(['POST'])
@throttle_classes([CustomAnonThrottleWriting])
def post_validate_writing_answer(request):
    logger.info('Validate Writing Asnwer...')
    try:
        user_response = request.data.get('user_response', '')
        question = request.data.get('question', '')
        test_type = request.data.get('test_type', '')
        test_id = request.data.get('test_id', 0)

        return validate_writing_answer_1(test_type, user_response, question, test_id)

    except Throttled as e: 
        logger.error("Throttling triggered: User exceeded request limit")
        return JsonResponse(
            {
                "band_score": "/",
                "evaluation": f"Looks like you've run out of requests. Try again in {round(e.wait / 3600, 2)} hours.",
                "improve_version": "-- --"
            },
            status=429
        )


@api_view(['POST'])
def post_validate_answers(request):
    logger.info('Validate Asnwer...')
    test_data = request.data.get('test_data', {})
    full_user_answers = request.data.get('user_answers', {})
    full_user_answers = full_user_answers if full_user_answers else {} 
    return validate_answers(test_data, full_user_answers, test_data.get("id"))


@api_view(["GET"])
def fetch_test(request):
    skill = request.GET.get("skill", None)
    item_id = request.GET.get("item_id", None)
    ip_address = get_client_ip(request)
    return get_test(skill, item_id, ip_address)


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
    base_url = request.build_absolute_uri('/')[:-1]
    urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

    for base_paths in ["","home","about","contact"]:
        try:
            url = ET.SubElement(urlset, "url")
            ET.SubElement(url, "loc").text = f"{base_url}/{base_paths}"
            ET.SubElement(url, "priority").text = "0.8"
            ET.SubElement(url, "changefreq").text = "weekly"
        except Exception as e:
            print(f"Static URL error: {e}")

    for skill in ["all", "reading", "listening", "writing"]:
        try:
            url_path = f"ieltsgo/selection/{skill}"
            url = ET.SubElement(urlset, "url")
            ET.SubElement(url, "loc").text = f"{base_url}/{url_path}"
            ET.SubElement(url, "priority").text = "0.7"
            ET.SubElement(url, "changefreq").text = "weekly"
        except Exception as e:
            print(f"Skipping {skill}: {e}")
            continue
    
    sitemap_scale_limit = 1000
    tests = TestModel.objects.all()[:sitemap_scale_limit] 
    for test in tests:
        try:
            context = ContextModel.objects.get(subject=test.subject)
            questions = QuestionsSetModel.objects.filter(context=context)
            
            test_type = ""
            if questions.exists():
                test_type = ",".join(
                    [question_set.test_type 
                     for question_set in questions])
            panel = 0 if test.skill == 'listening' else 0
            url_path = f"ieltsgo/test/intro/{test.skill}/{panel}/{test_type}/{test.id}"
            url = ET.SubElement(urlset, "url")
            ET.SubElement(url, "loc").text = f"{base_url}/{url_path}"
            ET.SubElement(url, "priority").text = "0.6"
            ET.SubElement(url, "changefreq").text = "monthly"

            url_path = f"ieltsgo/test/{test.skill}/{panel}/{test_type}/{test.id}"
            url = ET.SubElement(urlset, "url")
            ET.SubElement(url, "loc").text = f"{base_url}/{url_path}"
            ET.SubElement(url, "priority").text = "0.6"
            ET.SubElement(url, "changefreq").text = "monthly"
        except Exception as e:
            print(f"Dynamic URL error for test {test.id}: {e}")

    xml_string = ET.tostring(urlset, encoding="utf-8", method="xml")
    return HttpResponse(xml_string, content_type="application/xml")