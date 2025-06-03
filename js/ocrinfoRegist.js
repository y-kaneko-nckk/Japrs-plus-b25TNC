import { CgntSignInfo, CgntPoolSettings } from "./login-utils.js"

let isModified = false; // フォームが変更されたかを示すフラグ（別途、入力変更イベントなどでtrueに）

// ページ読み込み時にトークンの有効期限を確認
$(document).ready(function () {
	if (!CgntSignInfo.checkValidity(0,()=>{window.location.href = CgntPoolSettings.SignOut;})) return; // トークン有効期限チェック、ログイン画面にリダイレクト
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

// フォーム変更時にフラグを更新
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

$(document).ready(function () {
    // クリアボタンのクリックイベント
    $("#clearFileBtn").on("click", function () {
        $("#uploadFile").val(""); // ファイル選択をクリア
        $("#filename").val("");   // ファイル名をクリア
        $(this).prop("disabled", true); // クリアボタンを無効化
    });

    // 添付ボタンのクリックイベント
    $("#attachFileBtn").on("click", function () {
        $("#uploadFile").click(); // ファイル選択ダイアログを表示
    });

    // ファイル選択時の処理
    $("#uploadFile").on("change", function () {
        const file = this.files[0];
        if (file) {
            $("#filename").val(file.name); // ファイル名を表示
            $("#clearFileBtn").prop("disabled", false); // クリアボタンを有効化
        }
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
    $("#registBtn").on("click", function () {
        const title = $("#title").val();
        const execResult = $("#ocrText").text();

        if (!title || !execResult) {
            alert("必須項目を入力してください。");
            return;
        }

        // 登録処理（API呼び出し）
        alert("登録処理を開始します。");
    });
});