$(document).ready(function () {
  if (!window.Amplify) {
    console.error("❌ Amplifyがロードされていません。");
    return;
  }

  const Amplify = window.Amplify;
  const Auth = Amplify.Auth;

  Amplify.configure({
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
      const user = await Auth.signIn(username, password);
      alert('ログイン成功！ようこそ ' + user.username);
      window.location.href = 'index.html';
    } catch (err) {
      alert('ログイン失敗: ' + err.message);
      console.error(err);
    }
  });
});
