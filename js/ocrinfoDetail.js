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
});

// クエリパラメータを取得する関数
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// クエリパラメータから値を取得
$(function() {
  const filename = getQueryParam("filename");
  const id = getQueryParam("id");

  // API呼び出しで詳細データを取得
  $.ajax({
    url: "https://5jd5ld5ax4.execute-api.ap-northeast-1.amazonaws.com/prod/ocrinfo/detail?id=" + encodeURIComponent(id),
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("idToken"),
    },
    success: function(data) {
      $("#title").text(data.title || "");
      $("#ocrText").text(data.execresult || "");
      if (data.filename) {
        $("#pdfViewer").attr("src", "https://japrs-s3-pdfupload-tnc-dev.s3.ap-northeast-1.amazonaws.com/" + encodeURIComponent(data.filename));
      }
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
});