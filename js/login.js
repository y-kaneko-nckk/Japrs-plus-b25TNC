import { CgntSignInfo, CgntPoolSettings } from "./login-utils.js"

$(document).ready(function () {
    // Cognito認証処理
    function OnCognitoAuthenticateUser() {
        // ユーザー名とパスワードを取得
        var username = $("#email").val();
        var password = $("#password").val();

        // 認証データを作成
        var authenticationData = {
            Username: username,
            Password: password,
        };

        // 認証詳細を作成
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

        // ユーザープールの設定
        var poolData = {
            UserPoolId: CgntPoolSettings.UserPoolId, // ユーザープールID
            ClientId: CgntPoolSettings.ClientId, // クライアントID
        };
        var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

        // ユーザーデータを作成
        var userData = {
            Username: username,
            Pool: userPool,
        };

        // Cognitoユーザーを作成
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        // ユーザー認証を実行
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                // 認証成功時の処理
                var idToken = result.getIdToken().getJwtToken(); // IDトークン
                var accessToken = result.getAccessToken().getJwtToken(); // アクセストークン
                var refreshToken = result.getRefreshToken().getToken(); // 更新トークン

                console.log("idToken : " + idToken);
                console.log("accessToken : " + accessToken);
                console.log("refreshToken : " + refreshToken);

                // トークンと有効期限を保存
                CgntSignInfo.updateLocal(idToken, accessToken, refreshToken, 3600);

                // AWSのリージョンを設定
                AWS.config.region = 'ap-northeast-1';

                // AWSの認証情報を設定
				let tmpCred = {}
	            tmpCred["IdentityPoolId"] = 'ap-northeast-1:1185c121-9b44-4e97-9c05-ba2f190c7654'; // IDプールID
				tmpCred["Logins"] = {};
				// ユーザープールのログイン情報を設定
				tmpCred["Logins"]['cognito-idp.ap-northeast-1.amazonaws.com/' + CgntPoolSettings.UserPoolId] = idToken;
                AWS.config.credentials = new AWS.CognitoIdentityCredentials(tmpCred);

                // 認証情報を更新
                AWS.config.credentials.refresh(function (error) {
                    if (error) {
                        // 認証情報の更新に失敗した場合
                        console.error(error);
                    } else {
                        // 認証情報の更新に成功した場合
                        console.log('ログインに成功しました！');
                        window.location.href = 'ocrinfoList.html'; // ログイン後のリダイレクト
                    }
                });
            },
            onFailure: function (err) {
                // 認証失敗時の処理
                alert(err.message || JSON.stringify(err));
            },
        });
    }

    // ボタンのクリックイベントに認証処理をバインド
    $("#loginBtn").on("click", function () {
        OnCognitoAuthenticateUser();
    });
});