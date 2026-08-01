from unittest.mock import patch

from django.test import TestCase

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
