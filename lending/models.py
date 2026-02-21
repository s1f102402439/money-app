# lending/models.py
from django.db import models

class Debt(models.Model):
    # 1. 友達の名前（最大50文字の文字列）
    friend_name = models.CharField(max_length=50)
    
    # 2. 金額（整数。プラスなら貸し、マイナスなら借りとして扱います）
    amount = models.IntegerField()
    
    # 3. 理由（最大100文字の文字列。「ランチ代」「立て替え」など）
    reason = models.CharField(max_length=100)
    
    # 4. 登録した日時（データが作られた瞬間の時間を、自動で保存する）
    created_at = models.DateTimeField(auto_now_add=True)

    # 管理画面などで見やすくするための設定（「田中 - 1000円」のように表示される）
    def __str__(self):
        return f"{self.friend_name} - {self.amount}円"