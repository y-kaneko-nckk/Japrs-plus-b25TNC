// Amplfyの初期設定
aws_amplify.Amplify.configure({
  Auth: {
    region: 'ap-northeast-1', // 東京リージョン
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
      const user = await aws_amplify.Auth.signIn(username, password);
      alert('ログイン成功！ようこそ ' + user.username);
      console.log('ログイン成功:', user);
      // 必要があればここで画面遷移やトークン保存
    } catch (err) {
      alert('ログイン失敗: ' + err.message);
      console.error('ログイン失敗:', err);
    }
  });
});