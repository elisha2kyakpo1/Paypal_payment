const amountInput = document.querySelector('.amount');

paypal.Buttons({
  createOrder:function() {
    return fetch('/create-order', {
      method: "POST",
      headers: {
        "Content-Type": 'application/json',
      },
      body: JSON.stringify({
        item: [
          {
            id: 1,
            quatity: 3,
          },
          {
            id: 1,
            quantity: 2,
          }
      ]
      })
    }).then(res => {
      if (res.ok) return res.json()
      return res.json().then(json => Promise.reject(json))
    }).then(({ id}) => {
      return id
    })
  },
  onApprove:function(data, actions) {
    return actions.order.capture().then(function(details) {
      alert('Trasanction completed by' + details.payer.name.given_name);
    });
  }
}).render('#paypal')