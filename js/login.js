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
            UserPoolId: 'ap-northeast-1_MNT0bbnmI', // ユーザープールID
            ClientId: 'k5olvrm72340o6alds32p0hem', // クライアントID
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

                // トークンの有効期限を取得（秒単位）
                var idTokenPayload = JSON.parse(atob(idToken.split('.')[1])); // JWTのペイロードをデコード
                var expirationTime = idTokenPayload.exp * 1000; // ミリ秒に変換

                // トークンと有効期限を保存
                localStorage.setItem("idToken", idToken);
                localStorage.setItem("expirationTime", expirationTime);

                // AWSのリージョンを設定
                AWS.config.region = 'ap-northeast-1';

                // AWSの認証情報を設定
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: 'ap-northeast-1:1185c121-9b44-4e97-9c05-ba2f190c7654', // IDプールID
                    Logins: {
                        // ユーザープールのログイン情報を設定
                        'cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_MNT0bbnmI': idToken,
                    },
                });

                // 認証情報を更新
                AWS.config.credentials.refresh(function (error) {
                    if (error) {
                        // 認証情報の更新に失敗した場合
                        console.error(error);
                    } else {
                        // 認証情報の更新に成功した場合
                        console.log('ログインに成功しました！');
                        window.location.href = 'index.html'; // ログイン後のリダイレクト
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