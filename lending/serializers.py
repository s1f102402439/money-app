from rest_framework import serializers
from .models import Debt

class DebtSerializer(serializers.ModelSerializer):
    class Meta:
        model = Debt
        fields = [
            'id',
            'friend_name',
            'amount',
            'reason',
            'created_at',
            'foreign_currency',  # 通貨単位 (PHP, USDなど)
            'foreign_amount',    # 外貨での生の金額
            'exchange_rate'      # 為替レート
        ]