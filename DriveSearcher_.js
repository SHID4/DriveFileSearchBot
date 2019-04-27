// slack API Token
var slack_token =
  "_______________";
// Outgoing Webhook Verify Token
var validToken = "____________";
var bikkuri = ":exclamation::exclamation:";

function saveSlackToken() {
  PropertiesService.getScriptProperties().setProperty(
    "slackToken",
    slack_token
  );
}

// Save Outgoing Webhook Verify Token
function saveVerifyToken() {
  PropertiesService.getScriptProperties().setProperty(
    "verifyToken",
    validToken
  );
}

function doGet(e) {}

function doPost(e) {
  var prop = PropertiesService.getScriptProperties().getProperties();
  if (!e) {
    //for Test. Slackからは以下のパラメータで飛んできます。
    e = {
      parameter: {
        token: prop.verifyToken,
        team_id: "tuvalun-script",
        channel_id: "CHQFWKE6R",
        channel_name: "#bot",
        timestamp: "1355517523.000005",
        user_id: "BHFB8N23T",
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

  slackApp.chatPostMessage(
    e.parameter.channel_id,
    "今からファイルを検索するよ" + bikkuri,
    {
      username: "ファイルサーチくん",
      icon_emoji: ":eyes:"
    }
  );

  var triggerWordLength = e.parameter.trigger_word.length;
  var fileName = e.parameter.text.trim().slice(triggerWordLength);
  var fileUrls = SearchFiles(fileName);
  SendSearchedMessage(slackApp, "ファイルサーチくん", e, fileUrls);

  return null;
}

function SendSearchedMessage(slackApp, userName, e, fileUrls) {
  var baseMsg =
    "@" +
    e.parameter.user_name +
    "\n" +
    "お待たせ" +
    bikkuri +
    "\nあなたが探してそうなファイルを持ってきたよ:eyes::eyes:\n" +
    "*Hit: " +
    fileUrls.length / 3 +
    "件*\n";
  if (fileUrls.length == 0) {
    baseMsg = "@" + e.parameter.user_name + "\n" + "そのファイルなかった...";
  }

  // 3要素で1単位の情報なのでlengthは1/3
  var url = "";

  for (var i = 0; i < fileUrls.length; i += 3) {
    var fileUrl = fileUrls[i];
    var name = fileUrls[i + 1];
    var folderName = fileUrls[i + 2];

    url += "ファイルの場所: " + folderName + "/*" + name + "*\n";
    url += "URL: " + fileUrl + "\n";
  }

  slackApp.chatPostMessage(e.parameter.channel_id, baseMsg + "\n" + url, {
    username: userName,
    icon_emoji: ":eyes:",
    link_names: 1
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

// 外に出すことで再帰でGetPathNameを使うときに状態を保ったまま再帰させる
var folderNames = [];

// 複数のファイルを検索する(任意の文字が含まれているファイル情報を返す）
// fileUrls[0 + n * 3] : 存在するファイルのURL
// fileUrls[1 + n * 3] : 条件に合致するファイル名
// fileUrls[2 + n * 3] : そのファイルまでのパス
function SearchFiles(fileName) {
  var fileUrls = [];

  try {
    var allFiles = DriveApp.getFiles();
    while (allFiles.hasNext()) {
      var file = allFiles.next();

      if (file.getName().indexOf(fileName) != -1) {
        var path = GetPathName(file.getParents());

        fileUrls.push(file.getUrl());
        fileUrls.push(file.getName());
        fileUrls.push(path);
      }
      // 次のループのためにクリアする(書かないとGetPathNameが失敗する)
      folderNames = [];
    }
  } catch (e) {
    return "error:" + e;
  }
  return fileUrls;
}

function GetPathName(folders) {
  if (folders.hasNext()) {
    var folder = folders.next();
    folderNames.push("/" + folder.getName());
    // さらに一つ上の階層を検索する
    GetPathName(folder.getParents());
  }

  var path = JoinReverseArrayString(folderNames);
  try {
    return path.slice(1);
  } catch (e) {
    return "";
  }
}

// 文字列配列を逆から結合する
function JoinReverseArrayString(strs) {
  var reverse = "";
  for (var i = strs.length - 1; i >= 0; i--) {
    reverse += strs[i];
  }
  return reverse;
}
