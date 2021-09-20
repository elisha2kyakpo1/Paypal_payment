const amountInput = document.querySelector('.amount');

paypal.Buttons({
  createOrder:function(data, actions) {
    return actions.order.create({
      purchase_units:[{
        amount: {
          value: amountInput.value
        }
      }]
    });
  },
  onApprove:function(data, actions) {
    return actions.order.capture().then(function(details) {
      alert('Trasanction completed by' + details.payer.name.given_name);
    });
  }
}).render('#paypal')