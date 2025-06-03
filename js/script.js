import { CgntSignInfo, CgntPoolSettings } from "./login-utils.js"

// 認証の２重動作の防止
let flgCogniteRequest = false;

// ページ読み込み時にトークンの有効期限を確認
$(document).ready(()=>{
    initPage();
});


async function initPage() {
    const result1 = await awsCognitoAuth(searchParams().get('code')).then(
		(data)=>{
			console.debug("＊＊＊　　cognito_done:", data);
			if (!data) {}
			else if ("errorText" in data) {
				console.debug(data.msg + "[" +data.errorText + "]");
			}
			else { // トークンと有効期限を保存
				CgntSignInfo.updateLocal(data.id_token, data.access_token, data.refresh_token, data.expires_in);
			}
			CgntSignInfo.checkValidity(
				()=>{window.location.href = "./ocrinfoList.html";},
				()=>{window.location.href = "./login.html";},
			);
		},
		(jqXHR)=>{
			if (jqXHR.status === 0) { return; };
			let errorText = JSON.parse((jqXHR.responseText)??'{}').error;
			console.log("jqXHR          : " + jqXHR.status); // HTTPステータスを表示
			console.log("jqXHR.Error    : " + errorText);
			if (['invalid_request','invalid_client'].includes(errorText)) {
			    console.log("☆★★リクエストが不正です。");
			    return;
			}
			if ('invalid_grant' == errorText) {
			    console.log("☆★★更新トークンが失効しています。");
			    return;
			}
			alert('Ajax通信に失敗しました[' + errorText + ']。再度ログインしてください。');
			CgntSignInfo.clearSignInfo();
			$('#cognitoUserInfo').empty().append(`未ログイン`);
			window.location.href = "login.html";
		}
	);
};

function searchParams() { // URLSearchParamsオブジェクトを作成してクエリ文字列を解析
    return new URLSearchParams(window.location.search);
}


function awsCognitoAuth(aCode) {

return new Promise((resolve, reject) => {

    $.ajax({
        url:CgntPoolSettings.getOauthEndpoint(),
        method:'POST',
        contentType:CgntPoolSettings.ContentType,
        data:{
            grant_type: "authorization_code",
            code: aCode,
            client_id: CgntPoolSettings.ClientId,
            redirect_uri: "https://develop-srv.d1wmev0i8iycrh.amplifyapp.com/"
        },
        beforeSend: function(xhr){
            console.log('▼▼▼Cognito確認開始');
            $('#cognitoUserInfo').empty().append(`ログイン処理中`)
            if (flgCogniteRequest || !aCode) {
                console.log('▽▼▼キャンセル');
                return false;
            }
            flgCogniteRequest = true;
        },
    })
    .done( (data) => { resolve(data); } )
    .fail(
        (jqXHR, textStatus, errorThrown) => {
            if (jqXHR.status === 0) resolve({errorText:"",msg:"☆★★codeが渡されませんでした。"});
            let errorText = JSON.parse((jqXHR.responseText)??'{}').error;
            console.log("textStatus     : " + textStatus);    // タイムアウト、パースエラーなどのエラー情報を表示
            if (['invalid_request','invalid_client'].includes(errorText)) {
                resolve({errorText:errorText,msg:"☆★★リクエストが不正です。"});
            }
            else if ('invalid_grant' == errorText) {
                resolve({errorText:errorText,msg:"☆★★更新トークンが失効しています。"});
            }
			else {
	            reject(jqXHR);
			}
        }
    )
    .always( () => { console.log('▲▲▲Cognito確認終了'); });
});
}
