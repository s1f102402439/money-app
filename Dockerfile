# 1. ベースとなるOS（Pythonが入った軽量なLinux）を指定
FROM python:3.11-slim

# 2. コンテナ内での作業場所（フォルダ）を決める
WORKDIR /app

# 3. 必要なソフトをインストールするための準備
# Pythonのログがすぐに画面に出るようにする設定
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 4. pip-compileで固定済みの依存ライブラリをコピーしてインストール
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 5. 今のフォルダにあるすべてのファイルをコンテナにコピー
COPY . /app/
