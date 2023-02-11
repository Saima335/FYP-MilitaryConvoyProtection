from django.urls import path
from api import views

urlpatterns =[
    path('detection/',views.DetectionList.as_view()),
    path('frame/',views.FrameList.as_view()),
    path('detect/',views.Detection),
    path('value/',views.valueReturn),
    path('detect2/',views.Detection2),
    path('risk/',views.Risk),
    path('hotspot/',views.Hotspot),
    path('hotspotkmean/',views.HotspotKMean),
    path('landminekmean/',views.HotspotKMean),
    path('riskarea/',views.RiskArea),
    path('riskpath/',views.RiskPath),
]