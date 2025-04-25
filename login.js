import { Amplify, Auth } from 'https://develop-srv.d1wmev0i8iycrh.amplifyapp.com';

Amplify.configure({
  Auth: {
    region: 'ap-northeast-1',
    userPoolId: 'ap-northeast-1_Ld53mCmLp',
    userPoolWebClientId: '75uttfu4ovnj51hnm5qd7b3co0',
  }
});

// jQueryでフォーム送信処理
$(function () {
  $('#loginForm').on('submit', async function (e) {
    e.preventDefault();

    const username = $('#username').val();
    const password = $('#password').val();

    try {
      const user = await Auth.signIn(username, password);
      alert('ログイン成功！ようこそ ' + user.username);
      window.location.href = 'dashboard.html'; // 成功後に遷移
    } catch (err) {
      alert('ログイン失敗: ' + err.message);
      console.error('ログイン失敗:', err);
    }
  });
});