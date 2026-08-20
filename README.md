# PayMate

友人同士のお金の貸し借り、共同支出、外貨での支払いと精算を記録する、個人開発のWebアプリケーションです。

PayMateは送金や信用判定を行う金融サービスではありません。実際の金銭移動は利用者同士で行い、その事実と確認状況を管理するためのツールです。

## 現在の状態

現在は学習用の初期プロトタイプです。Reactの画面、単純な `Debt` API、為替レート取得の試作まで存在しますが、合意済みの最終データモデルはまだ実装していません。

未実装の主な機能は次のとおりです。

- Googleログインとユーザー管理
- 友人申請と個人用のサブユーザーネーム
- イベント、参加招待、個人の一覧非表示
- 複数支払者・複数負担者を含む共同支出
- 編集・取消の承認と監査履歴
- 一部返済、精算申請、受取確認
- 外貨レートのスナップショットと障害時処理
- アプリ内通知、清算リマインド、退会処理
- PWA用の正式なアプリアイコン（manifestの設定枠だけ存在）

現在の `Debt` モデルへ機能を継ぎ足すのではなく、仕様を学びながら段階的に置き換えます。確定した詳しい仕様は [docs/product-specification.md](docs/product-specification.md) を参照してください。

## 技術構成

- フロントエンド: React 19 / Vite 7 / Tailwind CSS 4
- バックエンド: Django 5.2 / Django REST Framework 3.16
- ローカルDB: SQLite
- Docker・本番DB: PostgreSQL
- 本番方針: ReactとDjangoを同じオリジンから配信

ブラウザからのAPIアクセスは常に `/api/...` という相対URLを使います。開発中はViteがDjangoへ中継し、本番では同じサーバーから配信するため、CORS設定を追加しない方針です。

## 必要なソフトウェア

- Python 3.11以上
- Node.js 22 LTS推奨
- npm
- Docker Desktop（Docker構成を使う場合のみ）

## ローカル起動

### 1. Django

プロジェクトのルートで実行します。

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Django APIは `http://127.0.0.1:8000/api/debts/` で確認できます。ローカルでは `POSTGRES_HOST` を設定しない限りSQLiteを使います。

### 2. React

別のターミナルで実行します。

```bash
cd frontend
npm install
npm run dev
```

表示されたViteのURL（通常は `http://127.0.0.1:5173`）を開きます。Reactから `/api/...` へ送ったリクエストは、Viteのproxy設定によってDjangoへ転送されます。

## Docker起動

Docker DesktopのWSL連携を有効にしてから、プロジェクトのルートで実行します。

```bash
docker compose up --build
```

現在のDocker構成で起動するのはDjangoとPostgreSQLです。Reactは前述の手順で別に起動します。SQLiteは学習しやすいローカル起動用、PostgreSQLは本番に近い動作確認用という役割分担です。

## 検査コマンド

変更後は最低限、次を実行します。

```bash
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test

cd frontend
npm run lint
npm run build
```

- `check`: Django設定に矛盾がないか確認します。
- `makemigrations --check`: モデル変更に対応するマイグレーションの作り忘れを検出します。
- `test`: 保存やAPIなど、決めた振る舞いが壊れていないか確認します。
- `lint`: JavaScriptの不具合になりやすい書き方を検出します。
- `build`: 本番配信用のReactファイルを実際に生成できるか確認します。

## GitHubを使った開発

`main` は動作確認済みの状態を保ち、変更は目的ごとのブランチで進めます。

1. `feature/...` や `chore/...` ブランチを作る
2. ローカルで変更と検査を行う
3. commitしてGitHubへpushする
4. `main` 向けのPull Requestを作る
5. GitHub Actionsの `Backend / Django` と `Frontend / React` が成功したことを確認する
6. 差分とレビュー結果を確認してから `main` へ取り込む

Pull Requestを作ると、確認項目を書き残すためのテンプレートが表示されます。GitHub ActionsはPull Requestの作成・更新時と、`main` への取り込み後に自動検査を行います。

Dependabotは毎月1日の午前9時（日本時間）にPython、npm、GitHub Actionsの依存関係を確認します。minor・patch更新は種類ごとにまとめ、同時に開く通常更新PRを抑えます。Dockerイメージの通常更新は、Dockerを検査するCIができるまで停止します。更新用Pull Requestが作られても自動では取り込まず、変更内容とCI結果を確認してから判断します。

## 環境変数

[.env.example](.env.example) は必要な設定名の見本です。実際の秘密情報を含む `.env` はGitへ登録しません。現在のDjangoは `.env` を自動では読み込まないため、Docker、デプロイサービス、またはシェルから環境変数として渡します。

特に `DJANGO_SECRET_KEY` や将来追加するGoogle・為替APIの認証情報を、ソースコードへ直接書いたりGitHubへ送ったりしないでください。

## 開発方針

1. 一度に大きく完成させず、機能単位でモデル・API・画面を学ぶ
2. 先にDjango側の制約とテストを作り、その後Reactから利用する
3. 金額は浮動小数点数ではなく、通貨の最小単位とDecimalを使う
4. 金銭記録はサーバー保存成功後に確定表示する
5. 重要な更新はDBトランザクションと監査履歴で守る
6. 無料サーバーの遅延や失敗をUIで明確に伝え、入力を失わない

## 次の実装ステップ

最初の実装ステップは、Googleログインそのものではなく、PayMateの土台となるユーザーモデルとテストです。認証、友人、イベント、共同支出、精算、外貨の順に、小さく動かしながら進めます。
