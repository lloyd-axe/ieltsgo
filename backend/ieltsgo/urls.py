from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.urls import re_path
from django.http import HttpResponseNotFound

def serve_react_frontend(request):
    if request.method != "GET":
        return HttpResponseNotFound()
    return TemplateView.as_view(template_name="index.html")(request)

urlpatterns = [
    path('admin/', admin.site.urls),
    path("ieltsgo/", include("ielts.urls")),
    re_path(r"^(?!admin/|ieltsgo/).*$", serve_react_frontend),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)




