from django.urls import path
from . import views

urlpatterns = [
    # 'debts/' というURLが来たら、views.pyのdebt_list関数に案内する
    path('debts/', views.debt_list, name='debt_list'),
]