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

    $.ajax({
        url: "https://986o8kyzy3.execute-api.ap-northeast-1.amazonaws.com/prod/generategk/detail?id=" + encodeURIComponent(id),
        method: "GET",
        headers: {
            Authorization: localStorage.getItem("idToken"),
        },
        success: function(data) {
            $("#title").text(data.title || "");
            $("#languagemodel").text(data.languagemodel || "");
            $("#workuser").text(data.workuser || "");
            $("#prompt").val(data.prompt || "");
            $("#id").text(data.id || "");
            $("#generatedtime").text(data.generatedtime || "");
            $("#execresult").text(data.execresult || "");
        },
        error: function(jqXHR) {
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