# lending/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # 立て替えデータの取得・登録画面への案内
    path('debts/', views.DebtListCreate.as_view(), name='debt_list'),
]