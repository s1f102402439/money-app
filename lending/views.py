# lending/views.py
from rest_framework import generics, filters
from .models import Debt
from .serializers import DebtSerializer

# ▼ 今まであった窓口（一覧と追加）
class DebtListCreate(generics.ListCreateAPIView):
    queryset = Debt.objects.all()
    serializer_class = DebtSerializer
    # 1. この窓口に「検索係」を配置する
    filter_backends = [filters.SearchFilter]
    
    # 2. 「どの項目」を検索の対象にするかを指定する
    # （例：名前や理由で検索できるようにする）
    search_fields = ['friend_name', 'reason']

# ▼ 【今回新しく追加する窓口】（個別のデータを「見る・更新する・削除する」専用）
class DebtRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Debt.objects.all()
    serializer_class = DebtSerializer