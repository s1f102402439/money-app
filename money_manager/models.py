from django.db import models

class Transaction(models.Model):
    # 借りた人の名前（最大50文字）
    debtor = models.CharField(max_length=50, verbose_name="借りた人")
    
    # 金額
    amount = models.IntegerField(verbose_name="金額")
    
    # 貸した日付（デフォルトで「今」を入れる）
    date = models.DateTimeField(auto_now_add=True, verbose_name="日付")
    
    # 何のお金？（ランチ代など）
    description = models.CharField(max_length=100, verbose_name="用途")
    
    # 返してもらったか？（最初は「いいえ」にしておく）
    is_returned = models.BooleanField(default=False, verbose_name="返済済み")

    def __str__(self):
        # 管理画面で表示される名前：「A君: 1000円」のように見える
        return f"{self.debtor}: {self.amount}円"