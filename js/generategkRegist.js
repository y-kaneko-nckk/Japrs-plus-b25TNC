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

$(document).ready(function () {

    // 実行ボタンのクリックイベント
    $("#execBtn").on("click", function () {
        const languageModel = $("#languageModel").val();
        const document = $("#document").val();
        const format = $("#format").val();

        // 必須項目のチェック
        if (!languageModel || !document || !format || languageModel.trim() === "" || document.trim() === "" || format.trim() === "") {
            alert("すべての必須項目を入力してください。");
            return;
        }

        // トークンの有効性チェック
        const idToken = localStorage.getItem("idToken");
        if (!idToken) {
            alert("認証トークンがありません。再度ログインしてください。");
            window.location.href = "login.html";
            return;
        }

        // インジケーター表示
        showLoading();

        // Lambda関数を呼び出すためのAPIリクエスト
        const apiUrl = "https://986o8kyzy3.execute-api.ap-northeast-1.amazonaws.com/prod/generategk/prompting";
        // console.log("APIリクエストを開始します。");
        // console.log("リクエストURL:", apiUrl);
        // console.log("リクエストヘッダー:", { Authorization: idToken });
        // console.log("リクエストデータ:", { languageModel, document, format });

        // Lambda関数を呼び出すためのAPIリクエスト
        $.ajax({
            url: apiUrl,
            method: "POST",
            headers: {
                Authorization: idToken,
            },
            contentType: "application/json",
            data: JSON.stringify({ languageModel, document, format }),
            success: function (response) {
                //console.log("APIリクエストが成功しました。レスポンス:", response);
                $("#title").val(response.title);
                $("#execResult").val(response.generatedDocument);
                hideLoading(); // インジケーター非表示
            },
            error: function (jqXHR) {
                console.error("APIリクエストが失敗しました。");
                console.error("ステータスコード:", jqXHR.status);
                console.error("レスポンス:", jqXHR.responseText || "レスポンスなし");
                console.error("エラーメッセージ:", jqXHR.statusText || "エラーメッセージなし");

                hideLoading(); // インジケーター非表示
                let msg = "原稿生成に失敗しました";
                if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
                    msg += ": " + jqXHR.responseJSON.message;
                } else if (jqXHR.responseText) {
                    msg += ": " + jqXHR.responseText;
                } else if (jqXHR.statusText) {
                    msg += ": " + jqXHR.statusText;
                }
                alert(msg);
            }
        });
    });

    // 登録ボタンのクリックイベント
    $("#registBtn").on("click", function () {
        const title = $("#title").val();
        const execResult = $("#execResult").text();

        if (!title) {
            alert("必須項目を入力してください。");
            return;
        }

        // 登録処理（API呼び出し）
        alert("登録処理を開始します。");
    });

    $(document).ready(function () {
        // フォーマット切り替え時
        $('#prompt').on('change', function () {
            let format = $('#format').val(); // フォーマットの初期値を取得
            const selectedPrompt = parseInt($(this).val(), 10); // 選択されたプロンプトの値を取得

            switch (selectedPrompt) {
                case 1:
                    format = "次の構成に従ってニュース原稿を作成してください。\r\n" +
                        "1. **火災概要**: 発生時刻、場所、状況を簡潔に説明してください。\r\n" +
                        "2. **通報・対応**: 「○○○によりますと」の文章で書き始めて、通報内容と対応を記載してください。また、必ず「・・・ということです。」を入れてください。\r\n" +
                        "3. **焼損・消化状況**: 焼損範囲と消火状況を記載してください。\r\n" +
                        "4. **負傷者状況**: 負傷者の搬送状況や被害の程度を記載してください。\r\n" +
                        "5. **原因調査**: 出火原因と調査状況を簡潔に述べてください。\r\n" +
                        "- 各構成を必ずこの順番で盛り込んでください。\r\n" +
                        "- 各構成ごとで改行を入れてください。\r\n" +
                        "- 構成のタイトル名は含めず、自然な文章として出力してください。\r\n" +
                        "- 文体は敬体（です・ます調）を使用してください。\r\n" +
                        "- 感情や主観を排除するように心がけてください。\r\n" +
                        "- 本文の読み上げ時間が60秒以内（約250～300語）になるよう調整してください。出力後に自らカウントして、過不足があれば調整してください。\r\n" +
                        "- 「○○○」に文字を当てはめないでください。";
                    break;
                case 2:
                    format = "次の構成に従ってニュース原稿を作成してください。\r\n" +
                        "1. **速報通知**: 「先ほど入ってきたニュースです。」と一文で伝えてください。\r\n" +
                        "2. **概要**: 事故の場所、内容を簡潔に述べてください。\r\n" +
                        "3. **詳細**: 「○○○によりますと」の文章で書き始めて、発生時刻、場所、状況を具体的に説明してください。また、必ず「・・・ということです。」を入れてください。\r\n" +
                        "4. **被害状況**: 事故による被害の範囲や影響を説明してください。\r\n" +
                        "5. **けが人情報**: けが人の情報を記載してください。\r\n" +
                        "- 各構成を必ずこの順番で盛り込んでください。\r\n" +
                        "- 各構成ごとで改行を入れてください。\r\n" +
                        "- 構成のタイトル名は含めず、自然な文章として出力してください。\r\n" +
                        "- 文体は敬体（です・ます調）を使用してください。\r\n" +
                        "- 感情や主観を排除するように心がけてください。\r\n" +
                        "- 本文の読み上げ時間が60秒以内（約250～300語）になるよう調整してください。出力後に自らカウントして、過不足があれば調整してください。\r\n" +
                        "- 「○○○」に文字を当てはめないでください。";
                    break;
                case 3:
                    format = "次の構成に従ってニュース原稿を作成してください。\r\n" +
                        "1. **事件概要**: 事件の背景や要点を簡潔に説明してください。\r\n" +
                        "2. **判決を受けた人物**: 判決を受けた人物の氏名と役職が明記される場合は、『判決を受けたのは、[役職・所属]の[氏名]被告です。』 の形式で記載してください。必要に応じて文脈に合わせて役職や所属を調整してください。\r\n" +
                        "3. **詳細**: 「判決によりますと」で始めてください。\r\n" +
                        "4. **判決内容**: 「きょうの判決公判で、＠＠地裁の＠＠＠＠＠裁判長は・・・」で始めて、裁判長の発言と判決の内容を記載してください。\r\n" +
                        "- 各構成を必ずこの順番で盛り込んでください。\r\n" +
                        "- 各構成ごとで改行を入れてください。\r\n" +
                        "- 構成のタイトル名は含めず、自然な文章として出力してください。\r\n" +
                        "- 文体は敬体（です・ます調）を使用してください。\r\n" +
                        "- 感情や主観を排除するように心がけてください。\r\n" +
                        "- 本文の読み上げ時間が60秒以内（約250～300語）になるよう調整してください。出力後に自らカウントして、過不足があれば調整してください。";
                    break;
            }

            $('#format').val(format); // フォーマットを更新
        });
    });
});

