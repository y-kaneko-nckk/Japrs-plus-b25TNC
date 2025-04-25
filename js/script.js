// データ保持用の変数
let allDataCache = null;

// データ取得（初回のみ）
function fetchAllDataOnce(callback) {
  if (allDataCache) {
    callback(allDataCache);
  } else {
    $.getJSON("https://hy5qo8wko2.execute-api.ap-northeast-1.amazonaws.com/prod/ai/infomgmt/ocrinfo/list")
      .done(function(data) {
        allDataCache = data;
        callback(data);
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.error("データ取得エラー:", textStatus, errorThrown);
      });
  }
}

// OCR情報テーブル描画
function renderOcrTable(data) {
  const $tbody = $("#ocrTable tbody");
  $tbody.empty();
  $.each(data.ocrinfo, function(i, item) {
    $tbody.append(`
      <tr>
        <td>${item.execdtime}</td>
        <td>${item.title}</td>
        <td>${item.execresult}</td>
        <td>${item.id}</td>
      </tr>
    `);
  });
}

// 生成原稿テーブル描画
function renderGeneratedTable(data) {
  const $tbody = $("#generatedTable tbody");
  $tbody.empty();
  $.each(data.generategk, function(i, item) {
    $tbody.append(`
      <tr>
        <td>${item.generatedtime}</td>
        <td>${item.title}</td>
        <td>${item.languagemodel}</td>
        <td>${item.workuser}</td>
        <td>${item.id}</td>
        <td>${item.savedtime}</td>
      </tr>
    `);
  });
}

// タブ切り替え処理
$("#ocrTab").on("click", function () {
  fetchAllDataOnce(function(data) {
    renderOcrTable(data);
    $("#ocrContent").show();
    $("#generatedContent").hide();
    $("#ocrTab").addClass("active");
    $("#generatedTab").removeClass("active");
  });
});

$("#generatedTab").on("click", function () {
  fetchAllDataOnce(function(data) {
    renderGeneratedTable(data);
    $("#ocrContent").hide();
    $("#generatedContent").show();
    $("#generatedTab").addClass("active");
    $("#ocrTab").removeClass("active");
  });
});

// 初期表示はOCR情報タブ
$("#ocrTab").trigger("click");