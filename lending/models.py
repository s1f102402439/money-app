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
    foreign_amount = models.FloatField(default=0.0)
    exchange_rate = models.FloatField(default=1.0)

    def save(self, *args, **kwargs):
        currency_code = (self.foreign_currency or "JPY").strip().upper()
        self.foreign_currency = currency_code

        if currency_code == "JPY":
            self.exchange_rate = 1.0
            self.amount = int(float(self.foreign_amount or 0))
        else:
            if self.exchange_rate is None:
                from .services import get_exchange_rate

                self.exchange_rate = float(get_exchange_rate(currency_code))

            self.amount = int(round(float(self.foreign_amount or 0) * float(self.exchange_rate)))

        super().save(*args, **kwargs)

    def __str__(self):
        if self.foreign_currency != "JPY":
            return f"{self.friend_name} - {self.amount}円 ({self.foreign_amount}{self.foreign_currency})"
        return f"{self.friend_name} - {self.amount}円"


# 既存のモデル（Debtなど）の下に追記します
class ExchangeRate(models.Model):
    """為替レートキャッシュ保存用モデル"""

    currency_code = models.CharField(
        max_length=3,
        unique=True,
        verbose_name="通貨コード",
        help_text="例: USD, EUR",
    )
    rate = models.DecimalField(
        max_digits=12,
        decimal_places=6,
        verbose_name="対円レート",
        help_text="1外貨あたりの日本円 (JPY)",
    )
    fetched_at = models.DateTimeField(
        auto_now=True, verbose_name="最終取得日時"
    )

    class Meta:
        verbose_name = "為替レート"
        verbose_name_plural = "為替レート一覧"

    def __str__(self):
        return f"1 {self.currency_code} = {self.rate} JPY ({self.fetched_at.strftime('%Y-%m-%d %H:%M')})"