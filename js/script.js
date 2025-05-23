// データ保持用の変数
let allDataCache = null;

// トークンの有効期限を確認
function checkTokenValidity() {
    var expirationTime = localStorage.getItem("expirationTime");
    if (!expirationTime || Date.now() > expirationTime) {
        alert("セッションの有効期限が切れました。再度ログインしてください。");
        window.location.href = "login.html"; // ログイン画面にリダイレクト
    }
}

// ページ読み込み時にトークンの有効期限を確認
$(document).ready(function () {
    checkTokenValidity();
  
    // 実行日時の初期値を今日にセット
    const today = new Date().toISOString().slice(0, 10);
    $("#execdtime").val(today);

    // 検索ボタン押下時
    $("#searchBtn").on("click", function () {
        const execdtime = $("#execdtime").val();
        // 検索条件をクエリパラメータにしてリロード
        window.location.href = "index.html?execdtime=" + encodeURIComponent(execdtime);
    });

    // ページ表示時にクエリパラメータがあればフィルタ
    const urlParams = new URLSearchParams(window.location.search);
    const execdtimeParam = urlParams.get("execdtime");
    if (execdtimeParam) {
        $("#execdtime").val(execdtimeParam);
    }
});

// インジケーター表示・非表示
function showLoading() {
  $("#commonDisabledModal").show();
  $("#commonLoadingSpinner").show();
}
function hideLoading() {
  $("#commonDisabledModal").hide();
  $("#commonLoadingSpinner").hide();
}

// データ取得（初回のみ）
function fetchAllDataOnce(callback) {
    checkTokenValidity(); // トークンの有効期限を確認

    if (allDataCache) {
        callback(allDataCache);
    } else {
        var idToken = localStorage.getItem("idToken");
        if (!idToken) {
            alert("認証情報がありません。ログインしてください。");
            window.location.href = "login.html";
            return;
        }

        showLoading(); // インジケーター表示

        $.ajax({
            url: "https://8ej2lsmdn2.execute-api.ap-northeast-1.amazonaws.com/prod/infoMgmt",
            method: "GET",
            headers: {
                Authorization: idToken, // トークンをヘッダーに追加
            },
            success: function (data) {
                console.log("データ取得成功:", data);
                allDataCache = data;
                hideLoading(); // インジケーター非表示
                callback(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                hideLoading(); // インジケーター非表示
                console.error("データ取得エラー:", textStatus, errorThrown);
                if (jqXHR.status === 401) {
                    alert("認証エラーです。再度ログインしてください。");
                    window.location.href = "login.html";
                }
            },
        });
    }
}

// OCR情報テーブル描画
function renderOcrTable(data) {
    const urlParams = new URLSearchParams(window.location.search);
    const execdtimeParam = urlParams.get("execdtime");

    const $tbody = $("#ocrTable tbody");
    $tbody.empty();
    $.each(data.ocrinfo, function(i, item) {
        // 実行日時でフィルタ
        if (execdtimeParam && !item.execdtime.startsWith(execdtimeParam)) {
            return; // 日付が一致しない場合はスキップ
        }
        $tbody.append(`
          <tr>
            <td>${item.execdtime}</td>
            <td>
              <a href="ocrinfoDetail.html?filename=${encodeURIComponent(item.filename)}&id=${encodeURIComponent(item.id)}" target="_blank">
                ${item.title}
              </a>
            </td>
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
        <td>
          <a href="generategkDetail.html?id=${encodeURIComponent(item.id)}" target="_blank">
            ${item.title}
          </a>
        </td>
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