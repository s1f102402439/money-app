from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from .models import Debt

# 画面からのアクセスを受け取る関数
def debt_list(request):
    # ★ 偽物のデータの代わりに、データベースから本物のデータを全部取ってくる！
    # .values() をつけると、JSONにしやすい「辞書型」のリストにしてくれます
    debts = list(Debt.objects.values())
    
    # JSON（データ）として返す
    return JsonResponse(debts, safe=False)