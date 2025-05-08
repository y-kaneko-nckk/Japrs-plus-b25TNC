import Amplify, { Auth } from 'aws-amplify';

$(document).ready(function () {
  console.log('Amplify:', Amplify);

  // Amplifyの初期化
  try {
    Amplify.configure({
      Auth: {
        region: 'ap-northeast-1',
        userPoolId: 'ap-northeast-1_Ld53mCmLp',
        userPoolWebClientId: '75uttfu4ovnj51hnm5qd7b3co0',
      }
    });
    console.log('✅ Amplifyが初期化されました');
  } catch (err) {
    console.error('❌ Amplifyの初期化に失敗しました:', err);
    return;
  }

  // ログインフォームの処理
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