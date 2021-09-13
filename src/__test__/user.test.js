const axios = require('axios');

const fruits = ['manzana', 'Melón', 'Banana']

test('Tenemos una banana ', () => {
    expect(fruits).toContain('Banana');
});

const newUser = {
    "firstName":"Usuario",
    "lastName":"Test",
    "userName":"usertest",
    "password":"12345678",
    "preferedCoin":"BNB"
}