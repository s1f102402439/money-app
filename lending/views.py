# lending/views.py
from rest_framework import generics
from .models import Debt
from .serializers import DebtSerializer

# 友達との割り勘や立て替えデータを一括で取得・登録するための受付窓口
class DebtListCreate(generics.ListCreateAPIView):
    queryset = Debt.objects.all()
    serializer_class = DebtSerializer