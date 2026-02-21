from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse

# 画面からのアクセスを受け取る関数
def debt_list(request):
    # 返したいデータ（辞書型）
    data = [
        {'id': 1, 'friend_name': '田中', 'amount': 1000, 'reason': 'ランチ代'},
        {'id': 2, 'friend_name': '佐藤', 'amount': -500, 'reason': 'ジュース代'},
    ]
    return JsonResponse(data, safe=False)