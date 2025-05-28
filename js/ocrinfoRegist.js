let isModified = false; // フォームが変更されたかを示すフラグ（別途、入力変更イベントなどでtrueに）

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

// OCR実行ボタンのクリックイベント
$("#execOcrBtn").on("click", function () {
    const file = $("#uploadFile")[0].files[0];
    if (!file) {
        alert("ファイルを選択してください。");
        return;
    }

    // OCR実行処理（API呼び出しなど）
    alert("OCR実行処理を開始します。");
});

// 登録ボタンのクリックイベント
$("#saveBtn").on("click", function () {
    const title = $("#title").val();
    const execResult = $("#ocrText").text();

    if (!title || !execResult) {
        alert("タイトルと実行結果を入力してください。");
        return;
    }

    // 登録処理（API呼び出し）
    alert("登録処理を開始します。");
});

// クリアボタンのクリックイベント
$("#clearFileBtn").on("click", function () {
    $("#uploadFile").val("");
    $("#filename").val("");
    $(this).prop("disabled", true);
});

// attachFileBtnのクリックイベント
$("#attachFileBtn").on("click", function () {
    // ファイル選択ダイアログを表示
    $("#uploadFile").click();
});

// ファイル選択時の処理
$("#uploadFile").on("change", function () {
    const file = this.files[0];
    if (file) {
        $("#filename").val(file.name);
        $("#clearFileBtn").prop("disabled", false);
    }
});