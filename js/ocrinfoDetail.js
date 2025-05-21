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
    url: "https://5jd5ld5ax4.execute-api.ap-northeast-1.amazonaws.com/ocrinfo/detail?id=" + encodeURIComponent(id),
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
      alert("データ取得に失敗しました: " + jqXHR.responseJSON.message);
    }
  });
});