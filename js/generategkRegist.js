import { CgntSignInfo, CgntPoolSettings } from "./login-utils.js"

let isModified = false; // フォームが変更されたかを示すフラグ（別途、入力変更イベントなどでtrueに）

const languageModel = "us.anthropic.claude-3-7-sonnet-20250219-v1:0";
const format = "あなたは放送局のニュースを担当する記者です。ドキュメントを基にニュース原稿を完成させてください。その際、下記のルールに従ってください。\r\n" +
"・原稿はリード文（50字程度）と本文（300字程度）に分けてください。\r\n" +
"・リード文は読みたくなるような見出しとなりうる要約にしてください。\r\n" +
"・内容は「イベント」や「催し」の紹介です。イベント開催当日に、実際に行ったものとして原稿を作ってください。オンラインの場合はオンラインで参加したものとして原稿を作ってください。\r\n" +
"・記載していない事実以外の事実を加えないでください。\r\n" +
"・住所は町名のみを使用し、○丁目以下の番地は使用しないでください。\r\n" +
"・構成のタイトル名は含めず、自然な文章として出力してください。\r\n" +
"・文体は敬体（です・ます調）を使用してください。\r\n" +
"・感情や主観を排除するように心がけてください。\r\n" +
"・本文の読み上げ時間が60秒以内（約250～300語）になるよう調整してください。出力後に自らカウントして、過不足があれば調整してください。\r\n";

// ページ読み込み時にトークンの有効期限を確認
$(document).ready(function () {
    if (!CgntSignInfo.checkValidity()) return;
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
        const filename = $("#filename").val();
        const document = $("#document").val();
        const fileInput = $("#uploadFile")[0];
        const file = fileInput.files[0];

        // 必須項目のチェック
        if ((!filename || filename.trim() === "") && (!document || document.trim() === "")) {
            alert("ファイルの添付、もしくはドキュメントを入力してください。");
            return;
        }

        // PDFファイルチェック
        if (filename && !filename.toLowerCase().endsWith(".pdf")) {
            alert("PDFファイル以外では実行できません。");
            return;
        }

        if ((!filename || filename.trim() === "") && (document && document.trim() !== "")) {
            alert("入力されたドキュメントから原稿を生成します。");
        }

        if ((filename && filename.trim() !== "") && (!document || document.trim() === "")) {
            alert("添付されたPDFファイルから原稿を生成します。");
        }

        if ((filename && filename.trim() !== "") && (document && document.trim() !== "")) {
            alert("添付されたPDFファイルから原稿を生成します。");
        }

        // トークンの有効性チェック
        const idToken = localStorage.getItem("idToken");
        if (!CgntSignInfo.checkValidity()) return;

        // インジケーター表示
        showLoading();

        // FormDataを作成して添付ファイルを追加
        const formData = new FormData();
        formData.append("file", file); // 添付ファイル
        formData.append("document", document); // ドキュメント
        formData.append("languageModel", languageModel); // 言語モデル
        formData.append("format", format); // フォーマット
        // フォームデータの確認
        console.log("フォームデータ:", formData);
        console.log("送信するファイルデータ:", file);
        console.log("ファイル名:", filename);
        console.log("ドキュメント:", document);
        console.log("言語モデル:", languageModel);
        console.log("フォーマット:", format);

        // Lambda関数を呼び出すためのAPIリクエスト
        const apiUrl = "https://986o8kyzy3.execute-api.ap-northeast-1.amazonaws.com/prod/generategk/prompting";

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }                

        // Lambda関数を呼び出すためのAPIリクエスト
        $.ajax({
            url: apiUrl,
            method: "POST",
            headers: {
                Authorization: idToken,
            },
            processData: false, // FormDataをそのまま送信するためにfalseに設定
            contentType: false, // Content-Typeを自動設定するためにfalseに設定
            data: formData,
            success: function (response) {
                console.log("APIリクエストが成功しました。レスポンス:", response);
                $("#title").val(response.title);
                $("#document").val(response.document);
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
        const languageModelName = "Claude 3.7 Sonnet";
        const document = $("#document").val();
		const worker = CgntSignInfo.getUserId();
        const prompt = "####ドキュメント\n" + document + "\n\n####フォーマット\n" + format;
        const title = $("#title").val();
        const execResult = $("#execResult").val();
        const today = new Date();
        const formattedToday = today.toISOString().split("T")[0].replace(/-/g, "/");
        const generatedtime = formattedToday;
        // Cognitoユーザー情報を取得してworkerに設定
        $('#worker').val(worker); // workerのvalueに設定

        // 必須項目のチェック
        if (!title || title.trim() === "" || !execResult || execResult.trim() === "") {
            alert("実行結果に値が存在しません。");
            return;
        }

        // トークンの有効性チェック
        const idToken = localStorage.getItem("idToken");
        if (!CgntSignInfo.checkValidity()) return;

        // インジケーター表示
        showLoading();

        // Lambda関数を呼び出すためのAPIリクエスト
        const apiUrl = "https://986o8kyzy3.execute-api.ap-northeast-1.amazonaws.com/prod/generategk/regist";
        console.log("登録APIリクエストを開始します。");
        console.log("リクエストURL:", apiUrl);
        console.log("リクエストヘッダー:", { Authorization: idToken });
        console.log("リクエストデータ:", { languageModelName, worker, prompt, title, execResult, generatedtime });

        $.ajax({
            url: apiUrl,
            method: "POST",
            headers: {
                Authorization: idToken,
            },
            contentType: "application/json",
            data: JSON.stringify({ languageModelName, worker, prompt, title, execResult, generatedtime }),
            success: function (response) {
                console.log("登録APIリクエストが成功しました。レスポンス:", response);
                hideLoading(); // インジケーター非表示
                alert("登録が完了しました。");
                window.close();
            },
            error: function (jqXHR) {
                console.error("登録APIリクエストが失敗しました。");
                console.error("ステータスコード:", jqXHR.status);
                console.error("レスポンス:", jqXHR.responseText || "レスポンスなし");
                console.error("エラーメッセージ:", jqXHR.statusText || "エラーメッセージなし");

                hideLoading(); // インジケーター非表示
                let msg = "登録に失敗しました";
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

$(document).ready(function () {
    const fileDropArea = $("#fileDropArea");
    const uploadFileInput = $("#uploadFile");
    const filenameInput = $("#filename");

    // ドラッグアンドドロップイベント
    fileDropArea.on("dragover", function (e) {
        e.preventDefault();
        e.stopPropagation();
        fileDropArea.addClass("drag-over");
    });

    fileDropArea.on("dragleave", function (e) {
        e.preventDefault();
        e.stopPropagation();
        fileDropArea.removeClass("drag-over");
    });

    fileDropArea.on("drop", function (e) {
        e.preventDefault();
        e.stopPropagation();
        fileDropArea.removeClass("drag-over");

        const files = e.originalEvent.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            uploadFileInput[0].files = e.originalEvent.dataTransfer.files; // ファイルをinputに設定
            filenameInput.val(file.name); // ファイル名を表示
            $("#clearFileBtn").prop("disabled", false); // クリアボタンを有効化
        }
    });
});

//     $(document).ready(function () {
//         // フォーマット切り替え時
//         $('#prompt').on('change', function () {
//             let format = $('#format').val(); // フォーマットの初期値を取得
//             const selectedPrompt = parseInt($(this).val(), 10); // 選択されたプロンプトの値を取得

//             switch (selectedPrompt) {
//                 case 1:
//                     format = "次の構成に従ってニュース原稿を作成してください。\r\n" +
//                         "1. **火災概要**: 発生時刻、場所、状況を簡潔に説明してください。\r\n" +
//                         "2. **通報・対応**: 「○○○によりますと」の文章で書き始めて、通報内容と対応を記載してください。また、必ず「・・・ということです。」を入れてください。\r\n" +
//                         "3. **焼損・消化状況**: 焼損範囲と消火状況を記載してください。\r\n" +
//                         "4. **負傷者状況**: 負傷者の搬送状況や被害の程度を記載してください。\r\n" +
//                         "5. **原因調査**: 出火原因と調査状況を簡潔に述べてください。\r\n" +
//                         "- 各構成を必ずこの順番で盛り込んでください。\r\n" +
//                         "- 各構成ごとで改行を入れてください。\r\n" +
//                         "- 構成のタイトル名は含めず、自然な文章として出力してください。\r\n" +
//                         "- 文体は敬体（です・ます調）を使用してください。\r\n" +
//                         "- 感情や主観を排除するように心がけてください。\r\n" +
//                         "- 本文の読み上げ時間が60秒以内（約250～300語）になるよう調整してください。出力後に自らカウントして、過不足があれば調整してください。\r\n" +
//                         "- 「○○○」に文字を当てはめないでください。";
//                     break;
//                 case 2:
//                     format = "次の構成に従ってニュース原稿を作成してください。\r\n" +
//                         "1. **速報通知**: 「先ほど入ってきたニュースです。」と一文で伝えてください。\r\n" +
//                         "2. **概要**: 事故の場所、内容を簡潔に述べてください。\r\n" +
//                         "3. **詳細**: 「○○○によりますと」の文章で書き始めて、発生時刻、場所、状況を具体的に説明してください。また、必ず「・・・ということです。」を入れてください。\r\n" +
//                         "4. **被害状況**: 事故による被害の範囲や影響を説明してください。\r\n" +
//                         "5. **けが人情報**: けが人の情報を記載してください。\r\n" +
//                         "- 各構成を必ずこの順番で盛り込んでください。\r\n" +
//                         "- 各構成ごとで改行を入れてください。\r\n" +
//                         "- 構成のタイトル名は含めず、自然な文章として出力してください。\r\n" +
//                         "- 文体は敬体（です・ます調）を使用してください。\r\n" +
//                         "- 感情や主観を排除するように心がけてください。\r\n" +
//                         "- 本文の読み上げ時間が60秒以内（約250～300語）になるよう調整してください。出力後に自らカウントして、過不足があれば調整してください。\r\n" +
//                         "- 「○○○」に文字を当てはめないでください。";
//                     break;
//                 case 3:
//                     format = "次の構成に従ってニュース原稿を作成してください。\r\n" +
//                         "1. **事件概要**: 事件の背景や要点を簡潔に説明してください。\r\n" +
//                         "2. **判決を受けた人物**: 判決を受けた人物の氏名と役職が明記される場合は、『判決を受けたのは、[役職・所属]の[氏名]被告です。』 の形式で記載してください。必要に応じて文脈に合わせて役職や所属を調整してください。\r\n" +
//                         "3. **詳細**: 「判決によりますと」で始めてください。\r\n" +
//                         "4. **判決内容**: 「きょうの判決公判で、＠＠地裁の＠＠＠＠＠裁判長は・・・」で始めて、裁判長の発言と判決の内容を記載してください。\r\n" +
//                         "- 各構成を必ずこの順番で盛り込んでください。\r\n" +
//                         "- 各構成ごとで改行を入れてください。\r\n" +
//                         "- 構成のタイトル名は含めず、自然な文章として出力してください。\r\n" +
//                         "- 文体は敬体（です・ます調）を使用してください。\r\n" +
//                         "- 感情や主観を排除するように心がけてください。\r\n" +
//                         "- 本文の読み上げ時間が60秒以内（約250～300語）になるよう調整してください。出力後に自らカウントして、過不足があれば調整してください。";
//                     break;
//             }

//             $('#format').val(format); // フォーマットを更新
//         });
//     });
// });

