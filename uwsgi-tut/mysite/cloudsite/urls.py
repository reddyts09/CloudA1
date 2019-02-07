from django.conf.urls import url
from cloudsite import views


urlpatterns = [
    url(r'^$', views.HomePageView.as_view()),
]
