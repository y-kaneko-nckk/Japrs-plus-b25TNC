// ユーザー設定
export const CgntPoolSettings = {
	Region: 'ap-northeast-1',
	UserPoolId: 'ap-northeast-1_MNT0bbnmI', // ユーザープールID
	ClientId: 'k5olvrm72340o6alds32p0hem', // クライアントID
	ContentType: 'application/x-www-form-urlencoded; charset=UTF-8', // リクエスト時のContenType
	Url: 'https://ap-northeast-1mnt0bbnmi.auth.ap-northeast-1.amazoncognito.com',
	SignOut: 'login.html',
	Path: {
		Token: '/oauth2/token',
		SignOut: '/logout',
	},
	getOauthEndpoint: function() {
		return this.Url + this.Path.Token;
	},
	genAuthDetails: function(username, password) {
		return new AmazonCognitoIdentity.AuthenticationDetails({
			Username: username,
			Password: password,
	    });
	},
	genUserPool: function() {
		return new AmazonCognitoIdentity.CognitoUserPool({
			UserPoolId: this.UserPoolId,
			ClientId: this.ClientId,
		});
	},
	genCognitoUser: function(username) {
		new AmazonCognitoIdentity.CognitoUser({
	        Username: username,
	        Pool: this.genUserPool,
	    });
	},
};


export const CgntSignInfo = {
	_ID_TOKEN: "idToken",
	_PLAIN_HEADER: "plainHeader",
	_PLAIN_PAYLOAD: "plainPayload",
	_ACCESS_TOKEN: "accessToken",
	_REFRESH_TOKEN: "refreshToken",
	_EXPIRES_IN: "expiresIn",
	_EXPIRATION_TIME: "expirationTime",
	updateLocal: function(idToken, accessToken, refreshToken, expiresIn) {
		// トークンと有効期限を保存
		localStorage.setItem(this._ID_TOKEN, idToken);
		let _tmpToken = this.decodeIdToken(idToken);
		localStorage.setItem(this._PLAIN_HEADER, _tmpToken.header);
		localStorage.setItem(this._PLAIN_PAYLOAD, _tmpToken.payload);
		localStorage.setItem(this._ACCESS_TOKEN, accessToken);
		localStorage.setItem(this._REFRESH_TOKEN, refreshToken);
		localStorage.setItem(this._EXPIRES_IN, expiresIn);
		localStorage.setItem(this._EXPIRATION_TIME, this.calcExpTime());
	},
	clearLocal: function() {
		this.updateLocal(null, null, null, null);
	},
	calcExpTime: function() {
		return this.getLocalPayload()['exp'] * 1000;
	},
	printLocal: function() {
		console.debug("＊＊＊　　idToken      ", this.getLocal(this._ID_TOKEN));
		console.debug("＊＊＊　　plainHeader  ", this.getLocal(this._PLAIN_HEADER));
		console.debug("＊＊＊　　plainPayload ", this.getLocal(this._PLAIN_PAYLOAD));
		console.debug("＊＊＊　　accessToken  ", this.getLocal(this._ACCESS_TOKEN));
		console.debug("＊＊＊　　refreshToken ", this.getLocal(this._REFRESH_TOKEN));
		console.debug("＊＊＊　　expiresIn    ", this.getLocal(this._EXPIRES_IN));
		console.debug("＊＊＊　　expTime      ", this.getLocal(this._EXPIRATION_TIME));
	},
	getLocal: function(column) {
		return localStorage.getItem(column);
	},
	getLocalIdToken: function() {
		return this.getLocal(this._ID_TOKEN);
	},
	getLocalPayload: function() {
		console.log(this.getLocal(this._PLAIN_PAYLOAD)??"{}");
		return JSON.parse(this.getLocal(this._PLAIN_PAYLOAD)??"{}");
	},
	getUserId: function() { // TODO 暫定でemailを返却
		return this.getShowName();
	},
	getShowName: function() {
		let _n = this.getLocalPayload()??{};
		return _n.name??_n.email??'ログイン済';
	},
	decodeIdToken: function(idToken) { // JWTのヘッダをデコード
		if (!idToken) return {};
		let idTokenList = idToken.split('.');
		return {header:atob(idTokenList[0]),payload:atob(idTokenList[1]),sign:idTokenList[2]};
	},
	checkValidity: function(valid,invalid) {
        $('#cognitoUserInfo').empty().append(`ログインチェック中`)
		if (!this.getLocal(this._ID_TOKEN)) {
            $('#cognitoUserInfo').empty().append(`未ログイン`);
		    alert("認証情報がありません。ログインしてください。[m]");
			if($.isFunction(invalid)) invalid();
		    return false;
		}
		var expirationTime = JSON.parse(this.getLocal(this._EXPIRATION_TIME));
		console.log("トークンの残り時間（ミリ秒）[m]: " + (expirationTime - Date.now()));
		if (!expirationTime || Date.now() > expirationTime)
		{
            $('#cognitoUserInfo').empty().append(`未ログイン`);
		    alert("セッションの有効期限が切れました。再度ログインしてください。[m]");
			if($.isFunction(invalid)) invalid();
		    return false;
		}
		console.log(this.getLocalPayload());
		$('#cognitoUserInfo').empty().append(`<div class="menu">
	<div class="menuTitle"><i class="menuTitleIcon" data-feather="user-check"></i><span class="menuTitleName">` + this.getShowName() + `</span></div>
	<ul class="menuSub">
		<li><a id="signout" href="javascript:void(0);">ログアウト</a></li>
	</ul>
</div>
<script>feather.replace();</script>
`);
		if($.isFunction(valid)) valid();
		return true;
	},
	demoMenuClick: function() {
		$("div.menu").click(function() {
		  $(this).children(".menuSub").slideToggle(200);
		});
	},
	demoLogoutClick: function() {
		$("a.signout").click(function() {
		  $(this).children(".menuSub").slideToggle(200);
		});
	},
};


