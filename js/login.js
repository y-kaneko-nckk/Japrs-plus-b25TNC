function OnCognitoSignUp() {

	var poolData = {
		UserPoolId: 'ap-northeast-1_9bJi4i6lX', // Your user pool id here
		ClientId: '	3book7lp0qsi5eajs37f236qur', // Your client id here
	};
	var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

	var username = document.getElementById("email").value;
	var password = document.getElementById("password").value;

	userPool.signUp(username, password, null, null, function(
		err,
		result
	) {
		if (err) {
			alert(err.message || JSON.stringify(err));
			return;
		}
		var cognitoUser = result.user;
		console.log('user name is ' + cognitoUser.getUsername());
	});
}
