$(document).ready(function () {
  const waitForAmplify = setInterval(() => {
    if (window.Amplify && window.Amplify.Auth) {
      clearInterval(waitForAmplify); // 見つかったらループ停止

      const Amplify = window.Amplify;
      const Auth = Amplify.Auth;

      // 設定
      Amplify.configure({
        Auth: {
          region: 'ap-northeast-1',
          userPoolId: 'ap-northeast-1_Ld53mCmLp',
          userPoolWebClientId: '75uttfu4ovnj51hnm5qd7b3co0',
        }
      });

      // ログイン処理
      $('#loginForm').on('submit', async function (e) {
        e.preventDefault();

        const username = $('#username').val();
        const password = $('#password').val();

        try {
          const user = await Auth.signIn(username, password);
          alert('ログイン成功！ようこそ ' + user.username);
          window.location.href = 'index.html';
        } catch (err) {
          alert('ログイン失敗: ' + err.message);
          console.error(err);
        }
      });
    } else {
      console.log('Amplify is not loaded yet...');
    }
  }, 100); // 100msごとにチェック
});