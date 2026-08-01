from datetime import timedelta
import requests
from django.utils import timezone
from .models import ExchangeRate


def get_exchange_rate(currency_code="USD") -> float:
    """指定された通貨コード（例: 'USD'）の対JPY為替レートを取得する。

    DBに1時間以内のキャッシュがあればそれを返し、
    無ければ Frankfurter API から取得してDBを更新する。
    """
    currency_code = currency_code.upper()
    now = timezone.now()
    one_hour_ago = now - timedelta(hours=1)

    # 1. DBから該当通貨のデータを検索
    rate_obj = ExchangeRate.objects.filter(
        currency_code=currency_code
    ).first()

    # 2. キャッシュが有効（1時間以内に取得されたデータ）であればそれを返す
    if rate_obj and rate_obj.fetched_at >= one_hour_ago:
        return float(rate_obj.rate)

    # 3. キャッシュが無い、または1時間以上古い場合は API から最新レートを取得
    url = (
        f"https://api.frankfurter.app/latest?from={currency_code}&to=JPY"
    )

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        new_rate = data["rates"]["JPY"]

        # 4. DBのレコードを更新、無ければ新規作成 (update_or_create)
        if rate_obj:
            rate_obj.rate = new_rate
            rate_obj.save()  # auto_now=True により fetched_at が現在時刻に自動更新される
        else:
            rate_obj = ExchangeRate.objects.create(
                currency_code=currency_code, rate=new_rate
            )

        return float(new_rate)

    except requests.exceptions.RequestException as e:
        # API取得エラー時：古いキャッシュがDBにあればフォールバックとしてそれを返す
        if rate_obj:
            print(f"APIエラーのため過去キャッシュを使用します: {e}")
            return float(rate_obj.rate)
        print(f"為替レートの取得に失敗しました: {e}")
        return 1.0  # デフォルト値など