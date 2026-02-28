# lending/serializers.py
from rest_framework import serializers
from .models import Debt  # さっき作ったデータベースの設計図

class DebtSerializer(serializers.ModelSerializer):
    class Meta:
        model = Debt
        # 翻訳（やり取り）を許可する項目をリストで指定します
        fields = ['id', 'friend_name', 'amount', 'reason', 'created_at']