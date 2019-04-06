var slack_token =
  "xoxp-000000000000000000000000000";
  
var validToken = "hogehogehogehoge";
function saveToken() {
  PropertiesService.getScriptProperties().setProperty(
    "slackToken",
    slack_token
  );
}

function saveVerifyToken() {
  PropertiesService.getScriptProperties().setProperty(
    "verifyToken",
    validToken
  );
}

// POSTデータを受け取る
function doGet(e) {}

function doPost(e) {
  var prop = PropertiesService.getScriptProperties().getProperties();
  if (!e) {
    //for Test. Slackからは以下のパラメータで飛んできます。
    e = {
      parameter: {
        token: prop.verifyToken,
        team_id: "t00001",
        channel_id: "CHQFWKE6R",
        channel_name: "#channel",
        timestamp: "1355517523.000005",
        user_id: "id1213131",
        user_name: "Steve",
        text: "MyFirstBot: Hi",
        trigger_word: "b"
      }
    };
  }

  if (prop.verifyToken != e.parameter.token) {
    throw new Error("invalid token.");
  }

  //Create an instance.
  var slackApp = SlackApp.create(prop.slackToken);

  var fileName = e.parameter.text.trim().slice(1);
  var fileUrl = SearchFile(fileName);
  SendSearchedMessage(slackApp, "ファイルサーチくん", e, fileUrl);

  return null;
}

function SendSearchedMessage(slackApp, userName, e, fileUrl) {
  var baseMsg =
    "お待たせしました！！あなたが探しているファイルはズバリこれですね！！";
  var url = "URL:" + fileUrl;

  slackApp.chatPostMessage(e.parameter.channel_id, baseMsg + "\n" + url, {
    username: userName,
    icon_emoji: ":eyes:"
  });
}

function SearchFile(fileName) {
  try {
    var fileInfo = DriveApp.getFilesByName(fileName).next();
  } catch (e) {
    return "error:" + e;
  }

  return fileInfo.getUrl();
}
