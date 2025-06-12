import { CgntSignInfo, CgntPoolSettings } from "./login-utils.js"

let isModified = false; // フォームが変更されたかを示すフラグ（別途、入力変更イベントなどでtrueに）

// ページ読み込み時にトークンの有効期限を確認
$(document).ready(function () {
	if (!CgntSignInfo.checkValidity()) return;
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
            $("#title").val(data.title || "");
            $("#id").text(data.id || "");
            $("#generatedtime").text(data.generatedtime || "");
            $("#execresult").text(data.execresult || "");
            $("#execresult").val(data.execresult || "");
            $("#document").val(data.document || "");
            // presignedUrlがあればそれを使う
            if (data.presignedUrl) {
                $("#pdfViewer").attr("src", data.presignedUrl);
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
        const warnMessage = $(this).data("warn-message").replace("{0}", displayName);

        if (isModified) {
            if (confirm(warnMessage)) {
                window.close();
            }
        } else {
            window.close();
        }
    });

  // PDF表示ブロックの表示・非表示切り替え
  $("#togglePdfBtn").on("click", function () {
    const pdfBlock = $("#pdfViewer");
    if (pdfBlock.is(":visible")) {
      pdfBlock.hide();
      $(this).text("＋"); // ボタンを「+」に変更
    } else {
      pdfBlock.show();
      $(this).text("－"); // ボタンを「-」に変更
    }
  });

  // ドキュメント表示ブロックの表示・非表示切り替え
  $("#toggleDocBtn").on("click", function () {
    const docBlock = $("#document, label[for='document']");
    if (docBlock.is(":visible")) {
      docBlock.hide();
      $(this).text("+"); // ボタンを「+」に変更
    } else {
      docBlock.show();
      $(this).text("-"); // ボタンを「-」に変更
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

        if (confirm("この生成原稿を削除しますか？")) {
            showLoading(); // インジケーター表示

            $.ajax({
                url: "https://986o8kyzy3.execute-api.ap-northeast-1.amazonaws.com/prod/generategk/delete?id=" + encodeURIComponent(id),
                method: "DELETE",
                headers: {
                    Authorization: localStorage.getItem("idToken"),
                },
                success: function() {
                    hideLoading(); // インジケーター非表示
                    alert("生成原稿を削除しました。");
                    window.close();
                },
                error: function(jqXHR) {
                    hideLoading(); // インジケーター非表示
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