// ユーザー設定
export const CgntPoolSettings = {
	Region: 'ap-northeast-1',
	UserPoolId: 'ap-northeast-1_MNT0bbnmI', // ユーザープールID
	ClientId: 'k5olvrm72340o6alds32p0hem', // クライアントID
	ContentType: 'application/x-www-form-urlencoded; charset=UTF-8', // リクエスト時のContenType
	Url: 'https://ap-northeast-1mnt0bbnmi.auth.ap-northeast-1.amazoncognito.com',
	ApplicationUrl: 'https%3A%2F%2Fdevelop-srv.d1wmev0i8iycrh.amplifyapp.com%2F',
	ApplicationTop: './ocrinfoList.html',
	ResponseType: 'code',
	Lang: 'ja',
	Scope: 'email+openid+phone',
	Path: {
		Token: '/oauth2/token',
		SignOut: '/logout',
		SignIn: '/login',
	},
	getOauthEndpoint: function() {
		return this.Url + this.Path.Token;
	},
	getOauthSignIn: function() {
		return this.Url + this.Path.SignIn + "?client_id=" + this.ClientId + "&response_type=" + this.ResponseType + '&lang=' + this.Lang +'&scope=' + this.Scope + '&redirect_uri=' + this.ApplicationUrl;
	},
	getOauthSignOut: function() {
		return this.Url + this.Path.SignOut + "?client_id=" + this.ClientId + "&response_type=" + this.ResponseType + '&lang=' + this.Lang +'&scope=' + this.Scope + '&redirect_uri=' + this.ApplicationUrl;
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
		[this._ID_TOKEN,this._PLAIN_HEADER,this._PLAIN_PAYLOAD,this._ACCESS_TOKEN,this._REFRESH_TOKEN,this._EXPIRES_IN,this._EXPIRATION_TIME].forEach((n)=>{
			localStorage.removeItem(n);
		});
	},
	calcExpTime: function() {
		let _n = this.getLocalPayload();
		return (_n != null && 'exp' in _n) ? _n['exp'] * 1000 : null;
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
		if (!idToken) return {header:null,payload:null,sign:null};
		let idTokenList = idToken.split('.');
		return {header:atob(idTokenList[0]),payload:atob(idTokenList[1]),sign:idTokenList[2]};
	},
	checkValidityNoalert: function(valid,invalid,options={}) {
		options.noalert = 1;
		this.checkValidity(valid,invalid,options);
	},
	checkValidity: function(valid,invalid,options={}) {
        $('#cognitoUserInfo').empty().append(`ログインチェック中`)
		let errMsg = '';
		let expirationTime = JSON.parse(this.getLocal(this._EXPIRATION_TIME));
		if (!this.getLocal(this._ID_TOKEN)) errMsg = "認証情報がありません。ログインしてください。";
		if (!expirationTime || Date.now() > expirationTime) errMsg = "セッションの有効期限が切れました。再度ログインしてください。";
		if (errMsg) {
			$('#cognitoUserInfo').empty().append(`未ログイン`);
		    if (!options.noalert) alert(errMsg);
			($.isFunction(invalid)) ? invalid() : this.afterInvalidDefaultFunc();
			this.clearLocal();
		    return false;
		}
		console.log("expirationTime（ミリ秒）: " + (expirationTime));
		console.log("トークンの残り時間（ミリ秒）: " + (expirationTime - Date.now()));
		console.log(this.getLocalPayload());
		$('#cognitoUserInfo').empty().append(`<div class="menu">
	<div class="menuTitle"><i class="menuTitleIcon" data-feather="user-check"></i><span class="menuTitleName">` + this.getShowName() + `</span></div>
	<ul class="menuSub">
		<li><a class="signout" href="` + CgntPoolSettings.getOauthSignOut() + `">ログアウト</a></li>
	</ul>
</div>
<script>feather.replace();</script>
`);
		($.isFunction(valid)) ? valid() : this.afterValidDefaultFunc() ;
		return true;
	},
	afterValidDefaultFunc: function() {
		this.demoMenuClick();
		this.demoLogoutClick();
	},
	afterInvalidDefaultFunc: function() {
		window.location.href = CgntPoolSettings.getOauthSignOut();
	},
	demoMenuClick: function() {
		$("div.menu").click(function() {
		  $(this).children(".menuSub").slideToggle(120);
		});
	},
	demoLogoutClick: function() {
		$("a.signout").click(function() {
			CgntSignInfo.clearLocal();
		});
	},
};


