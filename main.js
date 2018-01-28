function newfun() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                var x = request.responseText.toString();
                var button = document.querySelector('#submit-button');
                braintree.dropin.create({
                    authorization: x,
                    container: '#dropin-container'
                }, function(createErr, instance) {
                    button.addEventListener('click', function() {
                        instance.requestPaymentMethod(function(err, payload) {
                            var request1 = new XMLHttpRequest();
                            request1.onreadystatechange = function() {
                                if (request1.readyState === XMLHttpRequest.DONE) {
                                    if (request1.status === 200) {
                                        if (JSON.parse(request1.responseText).success === true) {
                                            window.location.href = "success";
                                        } else {
                                            window.location.href = "failed";
                                        }
                                    } else {
                                        alert(request1.responseText.toString());
                                    }
                                }
                            };
                            request1.open("POST", "/checkout", true);
                            request1.setRequestHeader('Content-Type', 'application/json');
                            request1.send(JSON.stringify({
                                "payment_method_nonce": payload.nonce
                            }));
                        });
                    });
                });
            } else {
                alert(request.responseText.toString());
            }
        }
    };
    request.open("GET", "/client_token", true);
    request.send();
}

newfun();
