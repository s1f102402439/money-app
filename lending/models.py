from django.db import models

class Debt(models.Model):
    # 1. 友達の名前
    friend_name = models.CharField(max_length=50)

    # 2. 金額（日本円換算後の整数。全体の計算や集計はここでやります）
    amount = models.IntegerField()

    # 3. 理由
    reason = models.CharField(max_length=100)

    # 4. 登録日時
    created_at = models.DateTimeField(auto_now_add=True)

    # 💡 外貨データを保存するフィールド
    foreign_currency = models.CharField(max_length=10, default="JPY")
    foreign_amount = models.IntegerField(default=0)
    exchange_rate = models.FloatField(default=1.0)

    def __str__(self):
        if self.foreign_currency != "JPY":
            return f"{self.friend_name} - {self.amount}円 ({self.foreign_amount}{self.foreign_currency})"
        return f"{self.friend_name} - {self.amount}円"