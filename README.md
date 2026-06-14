# 💰 Debt Settlement Optimizer

旅行や日常の貸し借り記録を管理し、グループ内の複雑な精算を最小限の送金回数で解決するフルスタックWebアプリケーションです。

## 🚀 概要

「誰が誰にいくら貸しているか」を記録するだけでなく、グループ全体で発生した貸し借りを「誰が誰にいくら送金すれば完了するか」という最適解をアルゴリズムで自動計算します。

## 🛠️ 技術スタック

- **Frontend**: React (Tailwind CSS)
- **Backend**: Django (Django Rest Framework)
- **Database**: PostgreSQL
- **Infrastructure**: Docker / Docker Compose

## ✨ 主要機能

- **貸し借り記録の柔軟な登録**: 個別記録およびグループ割り勘モードに対応。
- **外貨対応**: PHP/USDなど外貨での入力時に、自動で日本円換算し記録。
- **精算アルゴリズム**:
  - **個別相殺モード**: 特定の友人と自分との直接の収支を算出。
  - **グループ最適化モード**: 貪欲法アルゴリズムにより、グループ全体の精算を最小限の送金で完了させるルートを提示。
- **データ永続化**: Docker環境下でPostgreSQLを使用し、安定したデータ管理を実現。

## ⚙️ セットアップ手順

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/s1f102402439/money-app.git
   cd money-app
   ```
