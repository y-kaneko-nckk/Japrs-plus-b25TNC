$(document).ready(function () {
  // Amplifyが正しく読み込まれているか確認
  if (typeof window.Amplify === 'undefined') {
    console.error('Amplify is not loaded yet');
    return;  // Amplifyが読み込まれていない場合は処理を終了
  }

  // Amplifyオブジェクトが読み込まれたら、Authを安全に取得
  const Amplify = window.Amplify;
  const Auth = Amplify.Auth;

  // Authが読み込まれていない場合のエラーチェック
  if (typeof Auth === 'undefined') {
    console.error('Auth is not loaded');
    return;  // Authが読み込まれていない場合は処理を終了
  }

  console.log('Amplify:', Amplify);
  console.log('Auth:', Auth);

  // Amplifyの設定
  Amplify.configure({
    Auth: {
      region: 'ap-northeast-1',
      userPoolId: 'ap-northeast-1_Ld53mCmLp',
      userPoolWebClientId: '75uttfu4ovnj51hnm5qd7b3co0',
    }
  });

  // フォームのsubmitイベントに処理を追加
  $('#loginForm').on('submit', async function (e) {
    e.preventDefault();  // フォーム送信をキャンセル

    const username = $('#username').val();
    const password = $('#password').val();

    try {
      // ユーザー認証を試みる
      const user = await Auth.signIn(username, password);
      alert('ログイン成功！ようこそ ' + user.username);
      window.location.href = 'index.html';  // ログイン成功後の遷移先
    } catch (err) {
      // エラーメッセージを表示
      alert('ログイン失敗: ' + err.message);
      console.error(err);
    }
  });
});