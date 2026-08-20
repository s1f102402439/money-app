from unittest.mock import patch

from django.test import TestCase
from django.urls import reverse

from .models import Debt


class DebtSaveTests(TestCase):
    def test_jpy_currency_sets_amount_and_rate(self):
        debt = Debt(
            friend_name="Alice",
            reason="Lunch",
            foreign_currency="JPY",
            foreign_amount=123.45,
        )

        debt.save()

        self.assertEqual(debt.amount, 123)
        self.assertEqual(debt.exchange_rate, 1.0)

    def test_foreign_currency_uses_provided_exchange_rate(self):
        debt = Debt(
            friend_name="Alice",
            reason="Lunch",
            foreign_currency="USD",
            foreign_amount=10.5,
            exchange_rate=150.25,
        )

        debt.save()

        self.assertEqual(debt.exchange_rate, 150.25)
        self.assertEqual(debt.amount, 1578)

    def test_foreign_currency_uses_service_when_rate_is_missing(self):
        with patch("lending.services.get_exchange_rate", return_value=145.5):
            debt = Debt(
                friend_name="Alice",
                reason="Lunch",
                foreign_currency="USD",
                foreign_amount=12.5,
                exchange_rate=None,
            )

            debt.save()

        self.assertEqual(debt.exchange_rate, 145.5)
        self.assertEqual(debt.amount, 1819)


class DebtApiTests(TestCase):
    def test_create_debt_through_relative_api_route(self):
        response = self.client.post(
            reverse("debt_list"),
            data={
                "friend_name": "Alice",
                "amount": 1200,
                "reason": "Lunch",
                "foreign_currency": "JPY",
                "foreign_amount": 1200,
                "exchange_rate": 1,
            },
            content_type="application/json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()["amount"], 1200)
        self.assertEqual(Debt.objects.count(), 1)
