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

// ページ読み込み時
$(document).ready(function () {
    checkTokenValidity();

    // タブの状態を設定
    $("#ocrContent").show();
    $("#generatedContent").hide();
    $("#ocrTab").addClass("active");
    $("#generatedTab").removeClass("active");
  
    // 実行日時の初期値を今日にセット
    const today = new Date();
    const formattedToday = today.getFullYear() + "/" +
        String(today.getMonth() + 1).padStart(2, "0") + "/" +
        String(today.getDate()).padStart(2, "0");
    $("#execdtime").val(formattedToday);

    // ローカルストレージから検索条件を復元
    const savedExecdtime = localStorage.getItem("execdtime");
    if (savedExecdtime) {
        $("#execdtime").val(savedExecdtime);
    } else {
        const today = new Date();
        const formattedToday = today.getFullYear() + "/" +
            String(today.getMonth() + 1).padStart(2, "0") + "/" +
            String(today.getDate()).padStart(2, "0");
        $("#execdtime").val(formattedToday); // 初期値を今日の日付に設定
    }

    // データを取得してフィルタ
    fetchOcrData(function (data) {
        renderOcrTable(data, $("#execdtime").val());
    });
});

// 検索ボタン押下時
$("#searchBtn").on("click", function () {
    const execdtime = $("#execdtime").val();

    // 検索条件をローカルストレージに保存
    localStorage.setItem("execdtime", execdtime);

    // ページをリロードして検索条件を反映
    window.location.href = "ocrinfoList.html";
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

// OCR情報テーブル描画
function renderOcrTable(data, execdtimeFilter = null) {
    const $tbody = $("#ocrTable tbody");
    $tbody.empty();

    // フィルタ条件をYYYY/MM/DD形式に変換
    const formattedExecdtimeFilter = execdtimeFilter ? execdtimeFilter.replace(/-/g, "/") : null;


    $.each(data.ocrinfo, function (i, item) {
        // 実行日時でフィルタ
        if (formattedExecdtimeFilter && !item.execdtime.startsWith(formattedExecdtimeFilter)) {
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

// データ取得（OCR）
function fetchOcrData(callback) {
    checkTokenValidity(); // トークン有効期限チェック

    var idToken = localStorage.getItem("idToken");
    if (!idToken) {
        alert("認証情報がありません。ログインしてください。");
        window.location.href = "login.html";
        return;
    }
    showLoading(); // インジケーター表示
    $.ajax({
        url: "https://8ej2lsmdn2.execute-api.ap-northeast-1.amazonaws.com/prod/ocrinfo/list",
        method: "GET",
        headers: {
            Authorization: idToken,
        },
        success: function (data) {
            hideLoading(); // インジケーター非表示
            callback(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            hideLoading(); // インジケーター非表示
            if (jqXHR.status === 401) {
                alert("認証エラーです。再度ログインしてください。");
                window.location.href = "login.html";
            } else {
                alert("データ取得に失敗しました。");
            }
        },
    });
}

// タブ切り替え処理（HTML遷移）
$("#ocrTab").on("click", function () {
    window.location.href = "ocrinfoList.html";
});
$("#generatedTab").on("click", function () {
    window.location.href = "generategkList.html";
});