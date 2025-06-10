import { CgntSignInfo, CgntPoolSettings } from "./login-utils.js"

// データ保持用の変数
let allDataCache = null;

// ページ読み込み時
$(document).ready(function () {
	if (!CgntSignInfo.checkValidity()) return;

    // タブの状態を設定
    $("#ocrTab").removeClass("active");
    $("#ocrContent").hide();
    $("#generatedTab").addClass("active");
    $("#generatedContent").show();

    // 生成日時初期値
    $("#generatedtime").val(getTodayJstDate());

    // セッションストレージから検索条件を復元
    const savedGeneratedtime = sessionStorage.getItem("generatedtime");
    if (savedGeneratedtime) {
        $("#generatedtime").val(savedGeneratedtime);
    } else {
        $("#generatedtime").val(getTodayJstDate());
    }

    // データを取得してフィルタ
    fetchGenerategkData(function (data) {
        renderGeneratedTable(data, $("#generatedtime").val());
    });
});

// 検索ボタン押下時
$("#searchBtn").on("click", function () {
    const generatedtime = $("#generatedtime").val();

    // 検索条件をセッションストレージに保存
    sessionStorage.setItem("generatedtime", generatedtime);

    // ページをリロードして検索条件を反映
    window.location.href = "generategkList.html";
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

// 生成原稿テーブル描画
function renderGeneratedTable(data, generatedtimeFilter) {
    console.log("フィルタ条件:", generatedtimeFilter);
    console.log("描画データ:", data);

    const $tbody = $("#generatedTable tbody");
    $tbody.empty();

    // フィルタ条件をYYYY/MM/DD形式に変換
    const formattedGeneratedtimetimeFilter = generatedtimeFilter ? generatedtimeFilter.replace(/-/g, "/") : null;

    let recordCount = 0; // 件数をカウント

    $.each(data.generategk, function(i, item) {
        // 調査用のログ出力
        console.log("item[" + i + "]:", item);

        // 生成日時でフィルタ
        if (formattedGeneratedtimetimeFilter && !item.generatedtime.startsWith(formattedGeneratedtimetimeFilter)) {
            return; // 日付が一致しない場合はスキップ
        }

        recordCount++; // 件数をカウント

        // テーブルに行を追加
        $tbody.append(`
          <tr>
            <td>${item.generatedtime}</td>
            <td>
              <a href="generategkDetail.html?id=${encodeURIComponent(item.id)}" target="_blank">
                ${item.title}
              </a>
            </td>
            <td>${getSttsLabel(item.stts)}</td>
            <td>${item.workuser}</td>
            <td>${item.id}</td>
          </tr>
        `);
    });
    // 件数を表示
    $("#recordCount").text(`対象件数: ${recordCount} 件`);
}

// ステータスラベルを取得する関数
function getSttsLabel(stts) {
    switch (Number(stts)) {
        case 1:
            return "縦原稿登録済";
        case 2:
            return "配信連携済";
        case 3:
            return "縦原稿登録済、配信連携済";
        default:
            return "";
    }
}

// データ取得（生成原稿）
function fetchGenerategkData(callback) {
	if (!CgntSignInfo.checkValidity()) return;

    var idToken = localStorage.getItem("idToken");

    showLoading(); // インジケーター表示
    $.ajax({
        url: "https://8ej2lsmdn2.execute-api.ap-northeast-1.amazonaws.com/prod/generategk/list",
        method: "GET",
        headers: {
            Authorization: idToken,
        },
        success: function (data) {
            console.log("APIから取得したデータ:", data);

            // IDを文字列として扱う（念のため）
            data.generategk = data.generategk.map(item => {
                item.id = String(item.id); // IDを文字列に変換
                return item;
            });

            hideLoading(); // インジケーター非表示
            callback(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            hideLoading(); // インジケーター非表示
            if (jqXHR.status === 401) {
                alert("認証エラーです。再度ログインしてください。");
                window.location.href = CgntPoolSettingsCgntPoolSettings.getOauthSignOut();
            } else {
                alert("データ取得に失敗しました。");
            }
        },
    });
}

// タブ切り替え処理（HTML遷移）
$("#ocrTab").on("click", function () {
    window.location.href = "ocrinfoList.html";
});
$("#generatedTab").on("click", function () {
    window.location.href = "generategkList.html";
});

// 日付操作用の関数
/*function adjustDate(date, adjustment) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + (adjustment.days || 0));
    newDate.setMonth(newDate.getMonth() + (adjustment.months || 0));
    newDate.setFullYear(newDate.getFullYear() + (adjustment.years || 0));
    return newDate;
}*/

// 日付操作用の関数
function adjustDate(date, adjustment) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + (adjustment.days || 0));
    newDate.setMonth(newDate.getMonth() + (adjustment.months || 0));
    newDate.setFullYear(newDate.getFullYear() + (adjustment.years || 0));
    return newDate.toISOString().split("T")[0]; // yyyy-mm-dd形式に変換
}

// 日付操作後に検索処理を実行する共通関数
function updateAndSearch(adjustment) {
    const date = $("#generatedtime").val() || getTodayJstDate();
    const newDate = adjustDate(date, adjustment);
    $("#generatedtime").val(newDate).trigger("change"); // 日付を更新してchangeイベントを発火
}

// 各ボタンのクリックイベント
$("#prevYearBtn").on("click", function () {
    updateAndSearch({ years: -1 });
});

$("#prevMonthBtn").on("click", function () {
    updateAndSearch({ months: -1 });
});

$("#prevDayBtn").on("click", function () {
    updateAndSearch({ days: -1 });
});

$("#todayBtn").on("click", function () {
    // 実行日時を今日の日付に設定し、検索処理を実行
    $("#generatedtime").val(getTodayJstDate()).trigger("change");
});

$("#nextDayBtn").on("click", function () {
    updateAndSearch({ days: 1 });
});

$("#nextMonthBtn").on("click", function () {
    updateAndSearch({ months: 1 });
});

$("#nextYearBtn").on("click", function () {
    updateAndSearch({ years: 1 });
});

// 日付変更時に検索処理を実行
$("#generatedtime").on("change", function () {
    const generatedtime = $(this).val();

    // 検索条件をセッションストレージに保存
    sessionStorage.setItem("generatedtime", generatedtime);

    // データを再取得してテーブルを更新
    fetchGenerategkData(function (data) {
        renderGeneratedTable(data, generatedtime);
    });
});

$(document).ready(function () {
    // 登録ボタンのクリック
    $("#registBtn").on("click", function () {
        window.open("generategkRegist.html", "_blank"); // 新しいタブで開く
    });
});

// 日本時間で今日の日付（yyyy-MM-dd形式）を取得
function getTodayJstDate() {
    const now = new Date();
    now.setHours(now.getHours() + 9); // UTC → JSTに補正
    return now.toISOString().split("T")[0];
}