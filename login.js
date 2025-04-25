// グローバル変数の aws_amplify から Auth を使う
$(function () {
  const auth = window.aws_amplify.Auth;

  // Amplify 初期設定
  window.aws_amplify.Amplify.configure({
    Auth: {
      region: 'ap-northeast-1',
      userPoolId: 'ap-northeast-1_Ld53mCmLp',
      userPoolWebClientId: '75uttfu4ovnj51hnm5qd7b3co0',
    }
  });

  $('#loginForm').on('submit', async function (e) {
    e.preventDefault();

    const username = $('#username').val();
    const password = $('#password').val();

    try {
      const user = await auth.signIn(username, password);
      alert('ログイン成功！ようこそ ' + user.username);
      // 成功後に 各種情報画面へ
      window.location.href = 'index.html';
    } catch (err) {
      alert('ログイン失敗: ' + err.message);
      console.error(err);
    }
  });
});