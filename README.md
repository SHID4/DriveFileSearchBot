# DriveFileSearcher
## 概要
slackからGoogleDriveに存在するファイルを検索して、  
botがファイル結果を通知してくれるアプリケーション
## 環境
- ### GoogleApps Script
- ### GoogleAppsScript Library  
  - SlackAPI
- ### Slack
  - Outgoing Webhook

## 導入方法
1. GoogleDriveで適当なファイルを作成し[ツール]→[スクリプトエディタ]を開き  
`DriveSearcher_.js`の内容をそのまま貼り付け

2. [Slack BotをGASでいい感じで書くためのライブラリを作った](https://qiita.com/soundTricker/items/43267609a870fc9c7453)  
を参考に設定を行う  
(↑の記事ではAPI tokenが発行できないので[Slack APIのTokenの取得・場所](https://qiita.com/ykhirao/items/0d6b9f4a0cc626884dbb)を参考にする)

3. スクリプトの`slack_token`をSlack API Tokenのトークンに書き換える
4. スクリプトの`validToken`をOutgoing Webhookの検証用トークンに置き換える
5. １度`saveVerifyToken()`と`saveSlackToken()`を実行する

## 使い方
1. メッセージに設定したトリガーキーを記述する  
2. スペースは開けずに、検索したいワードを記述する
3. ドライブ上にワードが含まれるファイルがあるとbotがそのパスとURLを発言する