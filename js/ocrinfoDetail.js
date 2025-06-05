import { CgntSignInfo, CgntPoolSettings } from "./login-utils.js"

let isModified = false; // フォームが変更されたかを示すフラグ（別途、入力変更イベントなどでtrueに）

// ページ読み込み時にトークンの有効期限を確認
$(document).ready(function () {
	if (!CgntSignInfo.checkValidity()) return;
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

  // インジケーター表示
  showLoading();

  // API呼び出しで詳細データを取得
  $.ajax({
    url: "https://5jd5ld5ax4.execute-api.ap-northeast-1.amazonaws.com/prod/ocrinfo/detail?id=" + encodeURIComponent(id),
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("idToken"),
    },
    success: function(data) {
      hideLoading(); // インジケーター非表示
      $("#title").text(data.title || "");
      $("#ocrText").text(data.execresult || "");
      $("#id").text(data.id || "");
      $("#execdtime").text(data.execdtime || "");
      // presignedUrlがあればそれを使う
      if (data.presignedUrl) {
        $("#pdfViewer").attr("src", data.presignedUrl);
      } else if (data.filename) {
        // 念のため従来の方法も残す
        $("#pdfViewer").attr("src", "https://japrs-s3-pdfupload-tnc-dev.s3.ap-northeast-1.amazonaws.com/" + encodeURIComponent(data.filename));
      }
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

$("input, textarea, select").on("change input", function () {
  isModified = true;
});

$(document).ready(function () {
  $("#footerCloseBtn").on("click", function () {
    const displayName = $(this).data("displayname");
    const warnMessage = $(this).data("warn-message").replace("{0}", displayName);

    if (isModified) {
      if (confirm(warnMessage)) {
        window.close();
      }
    } else {
      window.close();
    }
  });
});

// 削除ボタン
$(document).ready(function () {
  $("#deleteBtn").on("click", function () {
    const id = getQueryParam("id");
    if (!id) {
      alert("IDが指定されていません。");
      return;
    }

    if (confirm("このOCR情報を削除しますか？")) {
      showLoading();// インジケーター表示
      $.ajax({
        url: "https://5jd5ld5ax4.execute-api.ap-northeast-1.amazonaws.com/prod/ocrinfo/delete?id=" + encodeURIComponent(id),
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("idToken"),
        },
        success: function() {
          hideLoading();// インジケーター非表示
          alert("OCR情報を削除しました。");
          window.close();
        },
        error: function(jqXHR) {
          hideLoading();// インジケーター非表示

          let msg = "削除に失敗しました";
          if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
            msg += ": " + jqXHR.responseJSON.message;
          } else if (jqXHR.statusText) {
            msg += ": " + jqXHR.statusText;
          }
          alert(msg);
        }
      });
    }
  });
});