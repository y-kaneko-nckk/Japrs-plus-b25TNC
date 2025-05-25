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
  
    // 生成日時初期値
    const today = new Date().toISOString().slice(0, 10);
    $("#generatedtime").val(today);

    // クエリパラメータ反映
    const urlParams = new URLSearchParams(window.location.search);
    const generatedtimeParam = urlParams.get("generatedtime");
    if (generatedtimeParam) {
        $("#generatedtime").val(generatedtimeParam);
    }

    // 初期表示・検索ボタン押下時
    fetchGenerategkData(renderGeneratedTable);
    $("#searchBtn").on("click", function () {
        const generatedtime = $("#generatedtime").val();
        window.location.href = "generategkList.html?generatedtime=" + encodeURIComponent(generatedtime);
    });
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

// 生成原稿テーブル描画
function renderGeneratedTable(data) {
    const generatedtimeParam = new URLSearchParams(window.location.search).get("generatedtime");
    const $tbody = $("#generatedTable tbody");
    $tbody.empty();
    $.each(data.generategk, function(i, item) {
        if (generatedtimeParam && !item.generatedtime.startsWith(generatedtimeParam)) return;
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

// データ取得（生成原稿）
function fetchGenerategkData(callback) {
    checkTokenValidity(); // トークン有効期限チェック

    var idToken = localStorage.getItem("idToken");
    if (!idToken) {
        alert("認証情報がありません。ログインしてください。");
        window.location.href = "login.html";
        return;
    }
    showLoading(); // インジケーター表示
    $.ajax({
        url: "https://8ej2lsmdn2.execute-api.ap-northeast-1.amazonaws.com/prod/generategk/list",
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
    $("#ocrContent").show();
    $("#generatedContent").hide();
    $("#ocrTab").addClass("active");
    $("#generatedTab").removeClass("active");
    window.location.href = "ocrinfoList.html";
});
$("#generatedTab").on("click", function () {
    $("#ocrContent").hide();
    $("#generatedContent").show();
    $("#generatedTab").addClass("active");
    $("#ocrTab").removeClass("active");
    window.location.href = "generategkList.html";
});