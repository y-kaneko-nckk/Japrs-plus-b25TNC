let isModified = false; // フォームが変更されたかを示すフラグ（別途、入力変更イベントなどでtrueに）

// トークンの有効期限を確認
function checkTokenValidity() {
    var expirationTime = localStorage.getItem("expirationTime");
    if (!expirationTime || Date.now() > expirationTime) {
        alert("セッションの有効期限が切れました。再度ログインしてください。");
        window.location.href = "login.html";
    }
}

// ページ読み込み時にトークンの有効期限を確認
$(document).ready(function () {
    checkTokenValidity();
    fetchDetailData();
});

// クエリパラメータを取得する関数
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 詳細データをAPIから取得して画面に反映
function fetchDetailData() {
    const id = getQueryParam("id");
    if (!id) {
        alert("IDが指定されていません。");
        return;
    }

    // インジケーター表示
    showLoading();

    $.ajax({
        url: "https://986o8kyzy3.execute-api.ap-northeast-1.amazonaws.com/prod/generategk/detail?id=" + encodeURIComponent(id),
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("idToken"),
        },
        success: function(data) {
            hideLoading(); // インジケーター非表示
            $("#title").text(data.title || "");
            $("#languagemodel").text(data.languagemodel || "");
            $("#workuser").text(data.workuser || "");
            $("#prompt").val(data.prompt || "");
            $("#id").text(data.id || "");
            $("#generatedtime").text(data.generatedtime || "");
            $("#execresult").text(data.execresult || "");
        },
        error: function(jqXHR) {
            hideLoading(); // インジケーター非表示
            let msg = "データ取得に失敗しました";
            if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
                msg += ": " + jqXHR.responseJSON.message;
            } else if (jqXHR.statusText) {
                msg += ": " + jqXHR.statusText;
            }
            alert(msg);
        }
    });
}

// インジケーター表示・非表示
function showLoading() {
  $("#commonDisabledModal").show();
  $("#commonLoadingSpinner").show();
}
function hideLoading() {
  $("#commonDisabledModal").hide();
  $("#commonLoadingSpinner").hide();
}

$("input, textarea, select").on("change input", function () {
  isModified = true;
});

$(document).ready(function () {
    $("#footerCloseBtn").on("click", function () {
    const displayName = $(this).data("displayname");
    const message = $(this).data("message").replace("{0}", displayName);
    const warnMessage = $(this).data("warn-message").replace("{0}", displayName);

    if (isModified) {
        if (confirm(warnMessage)) {
        window.close();
        }
    } else {
        if (confirm(message)) {
        window.close();
        }
    }
    });
});