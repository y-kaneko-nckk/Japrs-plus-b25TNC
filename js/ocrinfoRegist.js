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
});