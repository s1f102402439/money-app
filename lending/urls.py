# lending/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # 今まであった案内（一覧・追加画面）
    path('debts/', views.DebtListCreate.as_view(), name='debt_list'),
    
    # 【今回新しく追加する案内】（個別・更新・削除画面）
    # <int:pk> の部分に、データのID番号（1や2など）が入ります
    path('debts/<int:pk>/', views.DebtRetrieveUpdateDestroy.as_view(), name='debt_detail'),
]