from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.urls import path, re_path
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path("ieltsgo/", include("ielts.urls")),
    re_path(r'^.*$', serve, {'document_root': os.path.join(settings.BASE_DIR, 'static'), 'path': 'index.html'}),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)




