function introspectAccessToken(r) {
  r.log('introspectAccessToken: ' + JSON.stringify(r.variables));

  r.log('OAuth sending introspection request with token: ' + r.variables.access_token);
  r.subrequest('/_oauth2_send_request', function (reply) {
    if (reply.status != 200) {
      r.error('OAuth unexpected response from authorization server (HTTP ' + reply.status + '). ' + reply.body);
      r.return(401);
    }

    r.log(reply.responseBody);
    var response = JSON.parse(reply.responseBody);

    if (response.active == true) {
      r.return(204); // Token is valid, return success code
    } else {
      r.return(403); // Token is invalid, return forbidden code
    }
  });
}

export default { introspectAccessToken };
