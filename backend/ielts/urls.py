from django.urls import path
from .views import (post_validate_writing_answer, fetch_test, fetch_test_types, fetch_all_tests, 
fetch_test_info, fetch_type_display_names, post_validate_answers, custom_sitemap, get_csrf_token)

urlpatterns = [
    path("api/validate_writing/", post_validate_writing_answer, name="validate_writing_answer"),
    path("api/validate_answers/", post_validate_answers, name="validate_answers"),
    path("api/test/", fetch_test, name="get_test"),
    path("api/selection/", fetch_all_tests, name="get_all_tests"),
    path("api/test_types/", fetch_test_types, name="get_all_test_types"),
    path("api/test_types/<str:skill>/", fetch_test_types, name="get_test_types"),
    path("api/test_info/<str:test_type>/", fetch_test_info, name="get_test_info"),
    path("api/test_type/names/", fetch_type_display_names, name="get_test_display_name"),
    path("sitemap.xml", custom_sitemap, name="custom_sitemap"),
    path("/api/get-csrf-token/", get_csrf_token),
]