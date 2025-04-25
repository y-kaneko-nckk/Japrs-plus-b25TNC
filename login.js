import { Amplify, Auth } from 'https://develop-srv.d1wmev0i8iycrh.amplifyapp.com';
import awsconfig from './aws-exports.js';

// Amplify設定
Amplify.configure(awsconfig);

// フォーム送信イベント
document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const user = await Auth.signIn(username, password);
    alert(`ようこそ、${user.username} さん！`);
    // 例：ログイン後に遷移
    window.location.href = "index.html";
  } catch (error) {
    alert("ログイン失敗: " + error.message);
    console.error("ログイン失敗", error);
  }
});